function checkAuthenticated (req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

function checkNotAuthenticated (req,res,next) {
  if (req.isAuthenticated()) {
    console.log('이미 로그인이 되었습니다')
    return res.redirect('/');
  }
  next();
}


module.exports = {checkAuthenticated, checkNotAuthenticated};