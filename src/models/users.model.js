// users.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minLength: 5
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
})

const saltRounds = 10;
// save를 하기 전에
userSchema.pre('save', function (next) {
  let user = this;
  // 비밀번호가 변경될 때마다
  if (user.isModified('password')) {
    // salt 생성
    bcrypt.genSalt(saltRounds, function (err,salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      })
    })
  }
  else {
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err,isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  })
}


const User = mongoose.model('User', userSchema);

module.exports = User;