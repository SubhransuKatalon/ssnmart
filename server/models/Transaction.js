const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: String,
  method: String,
  status: String,
  amount: Number,
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true }); // ✅ THIS enables createdAt

module.exports = mongoose.model('Transaction', transactionSchema);
