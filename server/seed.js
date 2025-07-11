const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await Product.deleteMany(); // Clear all existing products
    console.log('🧹 Existing products deleted.');

    const result = await Product.insertMany([
      // Electronics
      {
        name: 'iPhone 15 Pro',
        price: 121299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/iphone-15-pro.jpg',
        description: 'Apple flagship smartphone with A17 chip',
        category: 'Electronics',
      },
      {
        name: 'Samsung Galaxy S24',
        price: 31199,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Samsung%20Galaxy%20S24.jpg',
        description: 'Latest Samsung smartphone with AMOLED display',
        category: 'Electronics',
      },
      {
        name: 'OnePlus 12 Pro',
        price: 79999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/oneplus-12-pro.jpg',
        description: 'Flagship phone with Snapdragon 8 Gen 2 and 120Hz AMOLED.',
        category: 'Electronics',
      },
      {
        name: 'Sony WH-1000XM5',
        price: 29990,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/sony-wh1000xm5.jpg',
        description: 'Industry-leading noise cancelling headphones.',
        category: 'Electronics',
      },
      {
        name: 'LG Smart TV',
        price: 44999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/LG%20Smart%20TV.jpg',
        description: '55-inch Ultra HD Smart TV',
        category: 'Electronics',
      },

      // Fashion
      {
        name: 'Men’s Denim Jacket',
        price: 490,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Men%E2%80%99s%20Denim%20Jacket.jpg',
        description: 'Blue denim jacket, stylish & comfortable',
        category: 'Fashion',
      },
      {
        name: 'Women’s Summer Dress',
        price: 350,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Women%E2%80%99s%20Summer%20Dress.jpg',
        description: 'Floral dress for casual outings',
        category: 'Fashion',
      },
      {
        name: "Men's Cotton Polo T-Shirt",
        price: 799,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/mens-polo.jpg',
        description: 'Breathable fabric, perfect for summer.',
        category: 'Fashion',
      },
      {
        name: "Women's Ethnic Kurti",
        price: 1299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/womens-kurti.jpg',
        description: 'Elegant floral printed kurti.',
        category: 'Fashion',
      },

      // Home & Furniture
      {
        name: 'Wooden Coffee Table',
        price: 12999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Wooden%20Coffee%20Table.jpg',
        description: 'Solid oak coffee table with shelf',
        category: 'Home & Furniture',
      },
      {
        name: 'Recliner Sofa Chair',
        price: 399,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Recliner%20Sofa%20Chair.jpg',
        description: 'Comfortable single seater recliner',
        category: 'Home & Furniture',
      },
      {
        name: 'Wall-Mounted Bookshelf',
        price: 2499,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/bookshelf.jpg',
        description: 'Rustic wooden finish shelf for books and décor.',
        category: 'Home & Furniture',
      },
      {
        name: 'LED Ceiling Lamp',
        price: 1799,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/ceiling-lamp.jpg',
        description: 'Modern energy-efficient ceiling lighting.',
        category: 'Home & Furniture',
      },

      // Beauty & Personal care
      {
        name: 'Face Moisturizer',
        price: 150,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Face%20Moisturizer.jpg',
        description: 'Hydrating cream with SPF 30',
        category: 'Beauty & Personal care',
      },
      {
        name: 'Hair Shampoo Pack',
        price: 129,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Hair%20Shampoo%20Pack.jpg',
        description: 'Shampoo for silky smooth hair',
        category: 'Beauty & Personal care',
      },
      {
        name: 'Nivea Body Lotion',
        price: 349,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/nivea-lotion.jpg',
        description: '48-hour deep moisture with almond oil.',
        category: 'Beauty & Personal care',
      },
      {
        name: 'Beardo Hair Wax',
        price: 299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/beardo-wax.jpg',
        description: 'Matte finish styling wax for strong hold.',
        category: 'Beauty & Personal care',
      },

      // Grocery
      {
        name: 'Basmati Rice 5kg',
        price: 220,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Basmati%20Rice%205kg.jpg',
        description: 'Premium long grain rice',
        category: 'Grocery',
      },
      {
        name: 'Olive Oil 1L',
        price: 99,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Olive%20Oil%201L.jpg',
        description: 'Extra virgin olive oil',
        category: 'Grocery',
      },
      {
        name: 'Amul Butter 500g',
        price: 275,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/amul-butter.jpg',
        description: "India's favorite creamy butter.",
        category: 'Grocery',
      },
      {
        name: 'Tata Salt 1kg',
        price: 25,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/tata-salt.jpg',
        description: 'Iodized salt for a healthy family.',
        category: 'Grocery',
      },
      {
  name: 'Dell XPS 13 Laptop',
  price: 98999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/dell-xps-13.jpg',
  description: '13.3-inch ultra-slim laptop with Intel Evo i7.',
  category: 'Electronics',
},
{
  name: 'Apple MacBook Air M2',
  price: 114999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/macbook-air-m2.jpg',
  description: 'Lightweight laptop with Apple M2 chip.',
  category: 'Electronics',
},
{
  name: 'iPad Air (5th Gen)',
  price: 58999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/ipad-air.jpg',
  description: '10.9-inch display with Apple Pencil support.',
  category: 'Electronics',
},
{
  name: 'Canon EOS 1500D DSLR',
  price: 41999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/canon-dslr.jpg',
  description: '24.1 MP DSLR with Wi-Fi & Full HD recording.',
  category: 'Electronics',
},
{
  name: 'Logitech MX Master 3 Mouse',
  price: 7990,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/logitech-mx3.jpg',
  description: 'Ergonomic mouse for productivity.',
  category: 'Electronics',
},
{
  name: 'HP Ink Tank 419 Printer',
  price: 13999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/hp-printer.jpg',
  description: 'Wireless all-in-one ink tank printer.',
  category: 'Electronics',
},
{
  name: 'Google Pixel Buds A-Series',
  price: 7999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/pixel-buds.jpg',
  description: 'Truly wireless earbuds with adaptive sound.',
  category: 'Electronics',
},
{
  name: 'Samsung Galaxy Watch 6',
  price: 32999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/galaxy-watch.jpg',
  description: 'Smartwatch with health monitoring features.',
  category: 'Electronics',
},
{
  name: 'Mi Air Purifier 4',
  price: 12999,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/mi-air-purifier.jpg',
  description: 'Smart HEPA filter air purifier for home.',
  category: 'Electronics',
},
{
  name: 'Amazon Echo Dot (5th Gen)',
  price: 4499,
  image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/echo-dot.jpg',
  description: 'Smart speaker with Alexa voice control.',
  category: 'Electronics',
}
    ]);

    console.log(`✅ Inserted ${result.length} products successfully.`);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    process.exit();
  }
};

seed();