const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  await Product.deleteMany(); // Clear existing products

  await Product.insertMany([
    // 📱 Electronics
    {
      name: 'iPhone 15 Pro',
      price: 2299,
      image: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg',
      description: 'Apple flagship smartphone with A17 chip and Titanium design.',
      category: 'Electronics',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      price: 1199,
      image: 'https://m.media-amazon.com/images/I/81ZSn2rk9WL._SL1500_.jpg',
      description: 'Samsung’s latest S-series phone with powerful camera and S Pen.',
      category: 'Electronics',
    },

    // 👗 Fashion
    {
      name: "Men's Classic Denim Jacket",
      price: 459,
      image: 'https://m.media-amazon.com/images/I/71CJGzy4L-L._AC_UX679_.jpg',
      description: 'Blue washed denim jacket with full sleeves and button closure.',
      category: 'Fashion',
    },
    {
      name: "Women's Floral Summer Dress",
      price: 395,
      image: 'https://m.media-amazon.com/images/I/71Rj6u1Zz+L._AC_UX569_.jpg',
      description: 'Lightweight cotton dress for summer with floral patterns.',
      category: 'Fashion',
    },

    // 🛋 Home & Furniture
    {
      name: 'Modern Coffee Table',
      price: 189,
      image: 'https://m.media-amazon.com/images/I/61YPRP7y1gL._SL1500_.jpg',
      description: 'Wooden finish center table with storage space.',
      category: 'Home & Furniture',
    },
    {
      name: 'Recliner Sofa Chair',
      price: 449,
      image: 'https://m.media-amazon.com/images/I/71xHneWTZgL._SL1500_.jpg',
      description: 'Manual recliner lounge chair with fabric cushioning.',
      category: 'Home & Furniture',
    },

    // 💄 Beauty & Personal Care
    {
      name: 'Neutrogena Face Moisturizer SPF 30',
      price: 120,
      image: 'https://m.media-amazon.com/images/I/61Yx1wPZ3gL._SL1500_.jpg',
      description: 'Oil-free moisturizer with sun protection for daily use.',
      category: 'Beauty & Personal care',
    },
    {
      name: 'L’Oreal Paris Shampoo Pack (650ml)',
      price: 140,
      image: 'https://m.media-amazon.com/images/I/61lhKR+q0FL._SL1500_.jpg',
      description: 'Total Repair 5 shampoo to strengthen and revitalize hair.',
      category: 'Beauty & Personal care',
    },

    // 🛒 Grocery
    {
      name: 'India Gate Basmati Rice (5kg)',
      price: 239,
      image: 'https://m.media-amazon.com/images/I/81+92wjqV2L._SL1500_.jpg',
      description: 'Premium aged basmati rice with long grains and rich aroma.',
      category: 'Grocery',
    },
    {
      name: 'Figaro Extra Virgin Olive Oil (1L)',
      price: 99,
      image: 'https://m.media-amazon.com/images/I/61mm3ckQDBL._SL1500_.jpg',
      description: 'Cold-pressed olive oil ideal for cooking and salads.',
      category: 'Grocery',
    },
  ]);

  console.log('✅ Products with real images seeded successfully.');
  process.exit();
};

seed();
