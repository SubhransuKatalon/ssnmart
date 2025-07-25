const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  approved: { type: Boolean, default: false },
  declined: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);