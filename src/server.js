// express 모듈 생성
const express = require('express');
// mongoose 모듈 생성 (commonJs로 생성)
const {default: mongoose} = require('mongoose');
// path 모듈 생성 (절대경로 목적 호출)
const path = require('path');


// express 모듈 변수 생성
const app = express();

// template engine ejs Setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// json read MiddleWare
app.use(express.json());
// form read MiddleWare
app.use(express.urlencoded({extended: false}));
// Static File MiddleWare
app.use('/static', express.static(path.join(__dirname, 'public')));

// mongoose DB Connect url
mongoose.connect(`mongodb+srv://son0925:1234@son0925.kwzwdli.mongodb.net/`)
  .then(() => {
    console.log(`Mongoose DB Connect`)
  })
  .catch((err) => {
    console.log(err)
  });


app.get('/login', (req,res) => {
  res.render('login')
})
app.get('/signup', (req,res) => {
  res.render('signup')
})

// 서버 실행
const port = 4000;
app.listen(port, () => {
  console.log(`Running On Port ${port}`);
})