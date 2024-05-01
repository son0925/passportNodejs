// Express Require
const express = require('express');
// Mongo DB Require
const mongoose = require('mongoose');
// Path Require
const path = require('path');
// Passport Require
const passport = require('passport');
// User 모델 호출
const User = require('./models/users.model');
const cookieSession = require('cookie-session');



// Server Port Number
const port = 4000;

// Express Method Variable
const app = express();

const cookieEncryptionKey = ['key1', 'key2'];
app.use(cookieSession({
  name: 'cookie-session-name',
  keys: cookieEncryptionKey
}))
app.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb) => {
          cb()
      }
  }
  if (request.session && !request.session.save) {
      request.session.save = (cb) => {
          cb()
      }
  }
  next()
})

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');


// Json Read Middleware
app.use(express.json());
// form values parsing middleware
app.use(express.urlencoded());

// Mongo DB Connect
mongoose.connect('mongodb+srv://son0925:1234@son0925.kwzwdli.mongodb.net/')
  .then(() => {
    console.log('Mongo DB Connect');
  })
  .catch((err) => {
    console.log(err);
  });

// Static File Service
app.use('/static', express.static(path.join(__dirname, 'public')));

// Template Engine Set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) => {
  res.render('index')
})

// Render login.ejs
app.get('/login', (req,res) => {
  res.render('login');
})
// Login Post
app.post('/login', (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) return next(err);
    
    console.log(1)
    if(!user) return next({msg: info});

    req.logIn(user, function(err) {
      console.log(1)
      if(err) return next(err);
      res.redirect('/');
    })
  })(req,res,next)  
})

// Render signup.ejs
app.get('/signup', (req,res) => {
  res.render('signup');
})

// SignUp Post
app.post('/signup', async (req,res) => {
  // req.body의 내용을 User객체로 저장
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      success: true
    })
  } catch (error) {
    console.error(error);
  }
})


// Server Listener
app.listen(port, () => {
  console.log(`Listen On Port ${port}`);
})