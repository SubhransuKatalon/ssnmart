const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  await Product.deleteMany(); // Clear existing products

  await Product.insertMany([
    // Electronics
    {
      name: 'iPhone 15 Pro',
      price: 121299,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/iphone-15-pro.jpg',
      description: 'Apple flagship smartphone with A17 chip',
      category: 'Electronics',
    },
    {
      name: 'Samsung Galaxy S24',
      price: 31199,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Samsung%20Galaxy%20S24.jpg',
      description: 'Latest Samsung smartphone with AMOLED display',
      category: 'Electronics',
    },

    // Fashion
    {
      name: 'Men’s Denim Jacket',
      price: 490,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Men%E2%80%99s%20Denim%20Jacket.jpg',
      description: 'Blue denim jacket, stylish & comfortable',
      category: 'Fashion',
    },
    {
      name: 'Women’s Summer Dress',
      price: 350,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Women%E2%80%99s%20Summer%20Dress.jpg',
      description: 'Floral dress for casual outings',
      category: 'Fashion',
    },

    // Home & Furniture
    {
      name: 'Wooden Coffee Table',
      price: 12999,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Wooden%20Coffee%20Table.jpg',
      description: 'Solid oak coffee table with shelf',
      category: 'Home & Furniture',
    },
    {
      name: 'Recliner Sofa Chair',
      price: 399,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Recliner%20Sofa%20Chair.jpg',
      description: 'Comfortable single seater recliner',
      category: 'Home & Furniture',
    },

    // Beauty & Personal care
    {
      name: 'Face Moisturizer',
      price: 150,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Face%20Moisturizer.jpg',
      description: 'Hydrating cream with SPF 30',
      category: 'Beauty & Personal care',
    },
    {
      name: 'Hair Shampoo Pack',
      price: 129,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Hair%20Shampoo%20Pack.jpg',
      description: 'Shampoo for silky smooth hair',
      category: 'Beauty & Personal care',
    },

    // Grocery
    {
      name: 'Basmati Rice 5kg',
      price: 220,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Basmati%20Rice%205kg.jpg',
      description: 'Premium long grain rice',
      category: 'Grocery',
    },
    {
      name: 'Olive Oil 1L',
      price: 99,
      image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/refs/heads/main/client/public/assets/Olive%20Oil%201L.jpg',
      description: 'Extra virgin olive oil',
      category: 'Grocery',
    },
  ]);

  console.log('✅ Products seeded successfully.');
  process.exit();
};

seed();