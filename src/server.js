const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/users.model');
const passport = require('passport');

const app = express();

const port = 4000;

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
// form태그가 보내는 value값을 Parsing하는 미들웨이
app.use(express.urlencoded({extended: false}));
// ejs 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connect Code
mongoose.connect(`mongodb+srv://son0925:1234@son0925.kwzwdli.mongodb.net/`)
  .then(() => {
    console.log(`MongoDB Connected`);
  })
  .catch((err) => {
    console.log('err: '+err)
  });

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')));

// 로그인, 회원가입 render
app.get('/login', (req,res) => {
  res.render('login');
})
app.post('/login', (req,res,next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) {
      return next(err);
    }
    if (!user) {
      return res.json({msg: info});
    }

    req.logIn(user, function (err) {
      if(err) {return next(err);}
      res.redirect('/')
    })
  })
})
app.get('/signup', (req,res) => {
  res.render('signup');
})
app.post('/signup', async (req,res) => {
  // user 객체 생성
  const user = new User(req.body);
  // user 컬렉션에 유저 저장
  try {
    await user.save();
    return res.status(200).json({
      success: true
    })
  } catch (error) {
    console.error(error);
  }
})

app.listen(port, () => {
  console.log(`Running On Port ${port}`)
})