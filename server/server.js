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

const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: ['https://ssnmart.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Health
app.get('/', (req, res) => res.send('🛒 SSNMart API is running.'));

// ========================== AUTH ==============================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'User exists' });

  const user = new User({ username, password, approved: false, declined: false });
  await user.save();
  res.json({ message: 'User registered', user: { username: user.username } });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.declined) return res.status(403).json({ message: 'Admin has declined your registration. Contact admin@ssnmart.com' });
  if (!user.approved) return res.status(403).json({ message: 'Your account is pending approval by admin.' });

  res.json({ message: 'Login successful', user: { username: user.username } });
});

// Get Pending & Declined Users
app.get('/api/users/pending', async (req, res) => {
  const users = await User.find({ $or: [{ approved: false, declined: false }, { declined: true }] });
  res.json(users);
});

// Admin approval/decline
app.post('/api/users/approval', async (req, res) => {
  const { username, approve } = req.body;
  const update = approve
    ? { approved: true, declined: false }
    : { approved: false, declined: true };

  const result = await User.findOneAndUpdate({ username }, { $set: update }, { new: true });
  if (!result) return res.status(404).json({ message: 'User not found' });

  res.json({ message: `User ${approve ? 'approved' : 'declined'}`, user: result });
});

// ========================== PRODUCTS ==============================

app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category
      ? { category: new RegExp('^' + category + '$', 'i') }
      : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, description, category, specifications } = req.body;
    if (!name || !price || !image || !category)
      return res.status(400).json({ message: 'Missing required fields' });

    const product = new Product({ name, price, image, description, category, specifications });
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================== CART ==============================

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
  try {
    await CartItem.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

// ========================== PAYMENT CONFIG ==============================

app.post('/api/payment-config', async (req, res) => {
  try {
    await PaymentConfig.deleteMany();
    const config = new PaymentConfig(req.body);
    await config.save();
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to save payment config' });
  }
});

app.get('/api/payment-config', async (req, res) => {
  try {
    const config = await PaymentConfig.findOne();
    res.json(config);
  } catch {
    res.status(500).json({ message: 'Failed to fetch payment config' });
  }
});

// ========================== TRANSACTIONS ==============================

app.post('/api/transactions', async (req, res) => {
  try {
    const txn = new Transaction(req.body);
    await txn.save();
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to log transaction' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const txns = await Transaction.find().sort({ createdAt: -1 });
    res.json(txns);
  } catch {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// ========================== SERVER START ==============================

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});