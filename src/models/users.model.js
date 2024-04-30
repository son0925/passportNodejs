const mongoose = require('mongoose');

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

userSchema.methods.comparePassword = function(plainPassword, cb) {
  // bcrypt compare 비교
  //  plain password => client, this.password => DB 비번
  if (plainPassword == this.password) {
    cb(null, true)
  }
  else {
    cb(null,false)
  }
  return cb({error: 'error'});
}


const User = mongoose.model('User', userSchema);

module.exports = User;