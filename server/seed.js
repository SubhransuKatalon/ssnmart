const mongoose = require('./db');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await Product.deleteMany();
    console.log('🧹 Existing products deleted.');

    const result = await Product.insertMany([
      // 📱 Electronics
      {
        name: 'iPhone 15 Pro',
        price: 121299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/iphone-15-pro.jpg',
        description: 'Apple flagship smartphone with A17 chip',
        category: 'Electronics',
        specifications: ['6.1-inch OLED display', 'A17 Pro chip', '128GB storage', 'Triple 48MP camera', 'iOS 17']
      },
      {
        name: 'Samsung Galaxy S24',
        price: 31199,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Samsung%20Galaxy%20S24.jpg',
        description: 'Latest Samsung smartphone with AMOLED display',
        category: 'Electronics',
        specifications: ['6.5-inch AMOLED display', 'Exynos 2400', '256GB storage', '50MP Triple Camera', 'Android 14']
      },
      {
        name: 'OnePlus 12 Pro',
        price: 79999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/oneplus-12-pro.jpg',
        description: 'Flagship phone with Snapdragon 8 Gen 2 and 120Hz AMOLED.',
        category: 'Electronics',
        specifications: ['6.7-inch QHD+ AMOLED', 'Snapdragon 8 Gen 2', '12GB RAM', '5000mAh battery', 'OxygenOS']
      },
      {
        name: 'Sony WH-1000XM5',
        price: 29990,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/sony-wh1000xm5.jpg',
        description: 'Industry-leading noise cancelling headphones.',
        category: 'Electronics',
        specifications: ['30 hours battery life', 'Active noise cancellation', 'Touch controls', 'USB-C Charging']
      },
      {
        name: 'LG Smart TV',
        price: 44999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/LG%20Smart%20TV.jpg',
        description: '55-inch Ultra HD Smart TV',
        category: 'Electronics',
        specifications: ['4K UHD', '55-inch LED', 'WebOS Smart TV', '3 HDMI ports', 'Built-in Wi-Fi']
      },
      {
        name: 'Dell XPS 13 Laptop',
        price: 98999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/dell-xps-13.jpg',
        description: '13.3-inch ultra-slim laptop with Intel Evo i7.',
        category: 'Electronics',
        specifications: ['Intel i7 13th Gen', '16GB RAM', '512GB SSD', 'Windows 11', 'Touchscreen']
      },
      {
        name: 'Apple MacBook Air M2',
        price: 114999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/macbook-air-m2.jpg',
        description: 'Lightweight laptop with Apple M2 chip.',
        category: 'Electronics',
        specifications: ['Apple M2 chip', '13.6-inch Retina', '8GB RAM', '256GB SSD', 'macOS Sonoma']
      },
      {
        name: 'Canon EOS 1500D DSLR',
        price: 41999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/canon-dslr.jpg',
        description: '24.1 MP DSLR with Wi-Fi & Full HD recording.',
        category: 'Electronics',
        specifications: ['24.1MP APS-C sensor', 'Wi-Fi enabled', 'Full HD video', 'EF-S lens mount']
      },
      {
        name: 'Samsung Galaxy Watch 6',
        price: 32999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/galaxy-watch.jpg',
        description: 'Smartwatch with health monitoring features.',
        category: 'Electronics',
        specifications: ['1.5-inch AMOLED', 'Sleep tracking', 'Heart rate monitor', 'Wear OS']
      },
      {
        name: 'Amazon Echo Dot (5th Gen)',
        price: 4499,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/echo-dot.jpg',
        description: 'Smart speaker with Alexa voice control.',
        category: 'Electronics',
        specifications: ['Voice assistant', 'Wi-Fi', 'Compact design', 'Bluetooth streaming']
      },

      // 👗 Fashion
      {
        name: 'Men’s Denim Jacket',
        price: 490,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Men%E2%80%99s%20Denim%20Jacket.jpg',
        description: 'Blue denim jacket, stylish & comfortable',
        category: 'Fashion',
        specifications: ['100% Cotton', 'Machine washable', 'Slim fit', 'Button closure']
      },
      {
        name: 'Women’s Summer Dress',
        price: 350,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Women%E2%80%99s%20Summer%20Dress.jpg',
        description: 'Floral dress for casual outings',
        category: 'Fashion',
        specifications: ['Sleeveless', 'Chiffon fabric', 'Knee length', 'Available in sizes S to XL']
      },
      {
        name: "Men's Cotton Polo T-Shirt",
        price: 799,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/mens-polo.jpg',
        description: 'Breathable fabric, perfect for summer.',
        category: 'Fashion',
        specifications: ['Cotton blend', 'Short sleeve', 'Collar neck', 'Regular fit']
      },
      {
        name: "Women's Ethnic Kurti",
        price: 1299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/womens-kurti.jpg',
        description: 'Elegant floral printed kurti.',
        category: 'Fashion',
        specifications: ['Rayon fabric', 'Printed design', '3/4 sleeve', 'Straight fit']
      },

      // 🛋️ Home & Furniture
      {
        name: 'Wooden Coffee Table',
        price: 12999,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Wooden%20Coffee%20Table.jpg',
        description: 'Solid oak coffee table with shelf',
        category: 'Home & Furniture',
        specifications: ['Solid wood', 'Natural finish', '1-year warranty', 'Size: 40x20x18 inch']
      },
      {
        name: 'Recliner Sofa Chair',
        price: 399,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Recliner%20Sofa%20Chair.jpg',
        description: 'Comfortable single seater recliner',
        category: 'Home & Furniture',
        specifications: ['Push-back recliner', 'PU leather', 'Metal frame', 'Max weight 120kg']
      },
      {
        name: 'Wall-Mounted Bookshelf',
        price: 2499,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/bookshelf.jpg',
        description: 'Rustic wooden finish shelf for books and décor.',
        category: 'Home & Furniture',
        specifications: ['Engineered wood', '5-tier design', 'Rustic brown finish', 'Easy to install']
      },
      {
        name: 'LED Ceiling Lamp',
        price: 1799,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/ceiling-lamp.jpg',
        description: 'Modern energy-efficient ceiling lighting.',
        category: 'Home & Furniture',
        specifications: ['20W LED', 'Warm white', 'Ceiling mount', 'Plastic + metal body']
      },

      // 💄 Beauty & Personal care
      {
        name: 'Face Moisturizer',
        price: 150,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Face%20Moisturizer.jpg',
        description: 'Hydrating cream with SPF 30',
        category: 'Beauty & Personal care',
        specifications: ['SPF 30', 'Paraben-free', 'For dry skin', 'Daily use']
      },
      {
        name: 'Hair Shampoo Pack',
        price: 129,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Hair%20Shampoo%20Pack.jpg',
        description: 'Shampoo for silky smooth hair',
        category: 'Beauty & Personal care',
        specifications: ['No sulfate', 'Coconut extract', 'pH balanced', '200ml bottle']
      },
      {
        name: 'Nivea Body Lotion',
        price: 349,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/nivea-lotion.jpg',
        description: '48-hour deep moisture with almond oil.',
        category: 'Beauty & Personal care',
        specifications: ['400ml bottle', 'Dermatologically tested', 'Non-greasy', 'Quick absorption']
      },
      {
        name: 'Beardo Hair Wax',
        price: 299,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/beardo-wax.jpg',
        description: 'Matte finish styling wax for strong hold.',
        category: 'Beauty & Personal care',
        specifications: ['Strong hold', 'Matte finish', 'For all hair types', '100g jar']
      },

      // 🛒 Grocery
      {
        name: 'Basmati Rice 5kg',
        price: 220,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Basmati%20Rice%205kg.jpg',
        description: 'Premium long grain rice',
        category: 'Grocery',
        specifications: ['5kg pack', 'Aged for 1 year', 'Low GI', 'Long grain']
      },
      {
        name: 'Olive Oil 1L',
        price: 99,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/Olive%20Oil%201L.jpg',
        description: 'Extra virgin olive oil',
        category: 'Grocery',
        specifications: ['1L bottle', 'Cold pressed', 'Imported from Spain', 'Rich in antioxidants']
      },
      {
        name: 'Amul Butter 500g',
        price: 275,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/amul-butter.jpg',
        description: "India's favorite creamy butter.",
        category: 'Grocery',
        specifications: ['500g pack', 'Salted', 'Refrigerated item', 'FSSAI certified']
      },
      {
        name: 'Tata Salt 1kg',
        price: 25,
        image: 'https://raw.githubusercontent.com/SubhransuKatalon/ssnmart/main/client/public/assets/tata-salt.jpg',
        description: 'Iodized salt for a healthy family.',
        category: 'Grocery',
        specifications: ['1kg pack', 'Iodized', 'Vacuum evaporated', 'Pure white crystals']
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