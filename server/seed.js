const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  await Product.deleteMany(); // Clear existing products

  await Product.insertMany([
    // Electronics
    {
      name: 'iPhone 15 Pro',
      price: 1299,
      image: 'https://via.placeholder.com/150',
      description: 'Apple flagship smartphone with A17 chip',
      category: 'Electronics',
    },
    {
      name: 'Samsung Galaxy S24',
      price: 1199,
      image: 'https://via.placeholder.com/150',
      description: 'Latest Samsung smartphone with AMOLED display',
      category: 'Electronics',
    },

    // Fashion
    {
      name: 'Men’s Denim Jacket',
      price: 49,
      image: 'https://via.placeholder.com/150',
      description: 'Blue denim jacket, stylish & comfortable',
      category: 'Fashion',
    },
    {
      name: 'Women’s Summer Dress',
      price: 35,
      image: 'https://via.placeholder.com/150',
      description: 'Floral dress for casual outings',
      category: 'Fashion',
    },

    // Home & Furniture
    {
      name: 'Wooden Coffee Table',
      price: 199,
      image: 'https://via.placeholder.com/150',
      description: 'Solid oak coffee table with shelf',
      category: 'Home & Furniture',
    },
    {
      name: 'Recliner Sofa Chair',
      price: 399,
      image: 'https://via.placeholder.com/150',
      description: 'Comfortable single seater recliner',
      category: 'Home & Furniture',
    },

    // Beauty & Personal care
    {
      name: 'Face Moisturizer',
      price: 15,
      image: 'https://via.placeholder.com/150',
      description: 'Hydrating cream with SPF 30',
      category: 'Beauty & Personal care',
    },
    {
      name: 'Hair Shampoo Pack',
      price: 12,
      image: 'https://via.placeholder.com/150',
      description: 'Shampoo for silky smooth hair',
      category: 'Beauty & Personal care',
    },

    // Grocery
    {
      name: 'Basmati Rice 5kg',
      price: 22,
      image: 'https://via.placeholder.com/150',
      description: 'Premium long grain rice',
      category: 'Grocery',
    },
    {
      name: 'Olive Oil 1L',
      price: 9,
      image: 'https://via.placeholder.com/150',
      description: 'Extra virgin olive oil',
      category: 'Grocery',
    },
  ]);

  console.log('✅ Products seeded successfully.');
  process.exit();
};

seed();
