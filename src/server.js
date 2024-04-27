const express = require('express');
const {default : mongoose} = require('mongoose');
const app = express();
const passport = require('passport');

const path = require('path');
const User = require('./models/users.model');

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');


app.use(express.json());
// html에서 form태그에서 보내주는 정보를 받아주는 미들웨어
app.use(express.urlencoded( {extended: false}));

// 몽구스 db 연결하기
mongoose.connect(`mongodb+srv://son0925:1234@son0925.kwzwdli.mongodb.net/`)
  .then(()=>{
    console.log(`mongodb connected`)
  })
  .catch((err) => {
    console.log('err: ' +err)
  })
  
app.use('/static', express.static(path.join(__dirname, 'public')))


app.get('/login', (req,res) => {
  res.render('login')
})


app.get('/signup', (req,res) => {
  res.render('signup')
})

app.post('/signup', async(req,res) => {
  // user 객체를 생성합니다
  const user = new User(req.body) // email, password가 들어있음

  // user 컬렉션에 유저를 저장합니다
  try {
    await user.save();
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
})

const port = 4000;

app.listen(port, ()=>{
  console.log(`Listening on ${port}`);
})

