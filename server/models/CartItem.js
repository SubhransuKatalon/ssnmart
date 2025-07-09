const mongoose = require('mongoose');
const Product = require('./Product'); // ✅ register Product schema

const CartItemSchema = new mongoose.Schema({
  userId: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number
});

module.exports = mongoose.model('CartItem', CartItemSchema);
