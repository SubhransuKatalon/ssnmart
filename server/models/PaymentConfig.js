const mongoose = require('mongoose');

const PaymentConfigSchema = new mongoose.Schema({
  card: {
    name: String,
    number: String,
    expiry: String,
    cvv: String
  },
  upi: String
});

module.exports = mongoose.model('PaymentConfig', PaymentConfigSchema);