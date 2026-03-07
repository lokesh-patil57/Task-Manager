const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
