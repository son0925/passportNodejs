// server.js
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
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');
const config = require('config');
const mainRouter = require('../routes/main.router');
const usersRouter = require('../routes/users.router');
const serverConfig = config.get('server');
require('dotenv').config();

// Express Method Variable
const app = express();

app.use(cookieSession({
  name: 'cookie-session-name',
  keys: [process.env.COOKIE_ENCRYPTION_KEY]
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
mongoose.connect(process.env.MONGO_URL)
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

app.use('/', mainRouter)
app.use('/auth', usersRouter)


// Server Listener
app.listen(serverConfig.port, () => {
  console.log(`Listen On Port ${serverConfig.port}`);
})