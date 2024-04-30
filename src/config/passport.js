const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;

// local로그인 미들웨어
passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
  (email, password, done) => {
    // mongoose DB에서 문서를 찾는 함수 findOne()
    User.findOne({
      email: email.toLocaleLowerCase()
    }, (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, {msg: `Email ${email} not Found`});
      // user는 db에서 찾은 pw, password는 클라이언트의 pw를 비교
      user.comparePassword(password, (err,isMatch) => {
        if (err) return done(err)
        if (isMatch){
          return done(null, user);
        }
        // server.js의 authenticate에서 (err, user, info)로 받는 done
        return done(null, false, {msg: 'Invalid email or password.'});
      });
    })
  }
))