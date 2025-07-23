// server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./db');

const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const User = require('./models/User');
const PaymentConfig = require('./models/PaymentConfig');
const Transaction = require('./models/Transaction');

const PORT = process.env.PORT;

app.use(cors({
  origin: ['https://ssnmart.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Root
app.get('/', (req, res) => {
  res.send('🛒 SSNMart API is running.');
});

// --- AUTH ---

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'User exists' });

  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User registered', user: { username: user.username } });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.declined) return res.status(403).json({ message: 'Admin has declined your registration. Contact admin@ssnmart.com' });
  if (!user.approved) return res.status(403).json({ message: 'Your account is pending approval by admin.' });

  res.json({ message: 'Login successful', user: { username: user.username } });
});

// --- USER ADMIN ---

app.get('/api/users/pending', async (req, res) => {
  const newUsers = await User.find({ approved: false, declined: false });
  const declinedUsers = await User.find({ declined: true });
  res.json({ newUsers, declinedUsers });
});

app.post('/api/users/approval', async (req, res) => {
  const { username, approve } = req.body;
  const result = await User.findOneAndUpdate(
    { username },
    { $set: { approved: approve, declined: !approve } },
    { new: true }
  );
  if (!result) return res.status(404).json({ message: 'User not found' });
  res.json({ message: `User ${approve ? 'approved' : 'declined'}`, user: result });
});

app.delete('/api/users/:username', async (req, res) => {
  const result = await User.findOneAndDelete({ username: req.params.username });
  if (!result) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// --- PRODUCTS ---

app.get('/api/products', async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category: new RegExp('^' + category + '$', 'i') } : {};
  const products = await Product.find(filter);
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { name, price, image, description, category, specifications, featured = false, bestseller = false } = req.body;
  if (!name || !price || !image || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const product = new Product({ name, price, image, description, category, specifications, featured, bestseller });
  try {
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const featured = await Product.find({ featured: true }).limit(5);
    res.json(featured);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
});

// Get bestsellers
app.get('/api/products/bestsellers', async (req, res) => {
  try {
    const bestsellers = await Product.find({ bestseller: true }).limit(5);
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bestsellers' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Product Search (for live search suggestions)
app.get('/api/products/search', async (req, res) => {
  const query = req.query.query || '';
  if (!query.trim()) return res.json([]);

  try {
    const results = await Product.find({
      name: { $regex: query, $options: 'i' }
    }).select('_id name').limit(10); // lightweight and fast

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// --- CART ---

app.get('/api/cart', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  const cartItems = await CartItem.find({ userId }).populate('productId');
  const validItems = cartItems.filter(item => item.productId !== null);
  const formattedItems = validItems.map(item => ({
    product: {
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      description: item.productId.description
    },
    qty: item.qty
  }));

  const total = formattedItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  res.json({ items: formattedItems, total });
});

app.post('/api/cart', async (req, res) => {
  const { productId, qty, userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  if (qty === 0) {
    await CartItem.deleteOne({ userId, productId });
  } else {
    await CartItem.findOneAndUpdate(
      { userId, productId },
      { $set: { qty } },
      { upsert: true }
    );
  }
  res.json({ success: true });
});

app.delete('/api/cart/clear/:userId', async (req, res) => {
  await CartItem.deleteMany({ userId: req.params.userId });
  res.json({ message: 'Cart cleared' });
});

// --- PAYMENT CONFIG ---

app.post('/api/payment-config', async (req, res) => {
  await PaymentConfig.deleteMany();
  const config = new PaymentConfig(req.body);
  await config.save();
  res.json({ success: true });
});

app.get('/api/payment-config', async (req, res) => {
  const config = await PaymentConfig.findOne();
  res.json(config);
});

// --- TRANSACTIONS ---

app.post('/api/transactions', async (req, res) => {
  const txn = new Transaction(req.body);
  await txn.save();
  res.json({ success: true });
});

app.get('/api/transactions', async (req, res) => {
  const txns = await Transaction.find().sort({ createdAt: -1 });
  res.json(txns);
});

// --- HEALTH CHECK ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});