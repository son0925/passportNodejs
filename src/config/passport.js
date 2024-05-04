// passport.js
const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

// req.logIn(user) 호출
passport.serializeUser((user, done) => {
  done(null, user.id);
})
// client => session => request
// passport.js

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err);
  }
});



// local로그인 미들웨어
const localStrategyConfig = new LocalStrategy({usernameField: 'email', passwordField: 'password'},
  (email, password, done) => {
    // mongoose DB에서 문서를 찾는 함수 findOne()
    User.findOne({
      email: email.toLocaleLowerCase()
    })
    .then(user => {
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
    .catch(err => {
      return done(err);
    });
  }
)



const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['email', 'profile']
}, (accessToken, refreshToken, profile, done) => {
  console.log(0);
  User.findOne({ googleId: profile.id })
    .then(existingUser => {
      console.log(1);
      if (existingUser) return done(null, existingUser);
      const user = new User({
        email: profile.emails[0].value,
        googleId: profile.id
      });
      return user.save();
    })
    .then(newUser => {
      console.log(2)
      done(null, newUser);
    })
    .catch(err => {
      console.error(err);
      return done(err);
    });
});

const kakaoStrategyConfig = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: '/auth/kakao/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({kakaoId: profile.id})
    .then(existingUser => {
      if (existingUser) {
        console.log('100')
        return done(null, existingUser)
      }
      else {
        const user = new User();
        user.kakaoId = profile.id;
        user.email = profile._json.kakao_account.email;
        console.log('100')
        user.save();
      }
    })
    .catch(err => {
      console.log('err');
      return done(err);
    })
})

passport.use('google', googleStrategyConfig);
passport.use('local', localStrategyConfig);
passport.use('kakao', kakaoStrategyConfig);