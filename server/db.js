const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('connected', () => console.log('✅ MongoDB connected'));
db.on('error', (err) => console.error('❌ MongoDB error:', err));

console.log('Connecting to:', process.env.MONGODB_URI);

module.exports = mongoose;
