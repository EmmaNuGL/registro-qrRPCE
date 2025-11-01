const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  email: { type: String },
  role: { type: String, enum: ['Administrador', 'Usuario'], default: 'Usuario' },
  password: { type: String }, // opcional, si luego agregas login
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
