const express = require('express');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');
const usersRouter = express.Router();
const passport = require('passport');
const User = require('../src/models/users.model');

usersRouter.post('/login', checkNotAuthenticated, (req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err) return next(err);
    if(!user) return next({msg: info});

    req.logIn(user, function(err) {
      if(err) return next(err);
      res.redirect('/');
    })
  })(req,res,next)  
})

usersRouter.post('/logout', (req,res,next) => {
  req.logOut(function (err) {
    if (err) {return next(err)}
    res.redirect('/login');
  })
})

usersRouter.post('/signup', async (req,res) => {
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

usersRouter.get('/google', passport.authenticate('google'));
usersRouter.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}))


module.exports = usersRouter;