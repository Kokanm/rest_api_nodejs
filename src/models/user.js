const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  uniqueUsername: {
    type: String,
  },
  password: { type: String, required: true },
  passwordModifiedAt: { type: Date, default: Date.now() },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cratedAt: { type: Date, default: Date.now() },
});

UserSchema.pre('save', function(next) {
  this.uniqueUsername = this.get('username').toLowerCase();
  next();
});

module.exports = mongoose.model('User', UserSchema);
