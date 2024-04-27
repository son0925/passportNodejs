const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true

  },
  password: {
    type: String,
    minLength: 5
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  }
})

// 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;