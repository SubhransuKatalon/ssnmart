const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  specifications: [String],       
  category: String,
  featured: { type: Boolean, default: false }, 
  bestseller: { type: Boolean, default: false }           
});

module.exports = mongoose.model('Product', ProductSchema);


