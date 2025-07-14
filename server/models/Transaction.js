const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  method: String,
  details: Object,
  status: String,
  timestamp: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
