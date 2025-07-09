const mongoose = require('./db');
const CartItem = require('./models/CartItem');

const clean = async () => {
  const badItems = await CartItem.find().populate('productId');
  const toDelete = badItems.filter(item => item.productId === null);

  for (let item of toDelete) {
    await CartItem.deleteOne({ _id: item._id });
  }

  console.log(`✅ Deleted ${toDelete.length} invalid cart items`);
  process.exit();
};

clean();
