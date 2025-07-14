const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./db');

const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const User = require('./models/User');
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Verifying backend API
app.get('/', (req, res) => {
  res.send('🛒 SSNMart API is running.');
});

// Simple login (for demo; production should use hashed passwords + sessions)
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(409).json({ message: 'User exists' });
  }
  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User registered', user: { username: user.username } });
});


app.post('/api/auth/login', async (req, res) => {
  console.log("Login attempt:", req.body);  // Add this
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user: { username: user.username } });
});

app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    console.log('📥 Requested category:', category);

    const escapeRegExp = (str) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const filter = category
      ? { category: new RegExp('^' + escapeRegExp(category) + '$', 'i') }
      : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product (admin only - no auth check here for demo)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({ name, price, image, description, category });
    await product.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error('❌ Product creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


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
    image: item.productId.image,              // Add image
    description: item.productId.description
    },
    qty: item.qty
  }));

  const total = formattedItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  res.json({ items: formattedItems, total });
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', async (req, res) => {
  const { productId, qty, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});