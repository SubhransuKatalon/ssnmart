const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  
  await Product.deleteMany({}); // Clear existing products

  await Product.insertMany([
    {
      name: 'iPhone 17 Pro',
      price: 1199,
      image: 'https://via.placeholder.com/150'
    },
    {
      name: 'Samsung S24 Ultra',
      price: 1099,
      image: 'https://via.placeholder.com/150'
    },
    {
      name: 'Google Pixel 8 Pro',
      price: 999,
      image: 'https://via.placeholder.com/150'
    }
  ]);

  console.log('✅ Products seeded successfully');
  process.exit();
};

seed();
