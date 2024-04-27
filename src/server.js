// express 모듈 생성
const express = require('express')
// mongoose 모듈 생성
const {default: mongoose} = require('mongoose');


// express 모듈 변수 생성
const app = express()

// json read MiddleWare
app.use(express.json());
// form read MiddleWare
app.use(express.urlencoded({extended: false}));

// mongoose DB Connect url
mongoose.connect(`mongodb+srv://son0925:1234@son0925.kwzwdli.mongodb.net/`)
  .then(() => {
    console.log(`Mongoose DB Connect`)
  })
  .catch((err) => {
    console.log(err)
  })


// 서버 실행
const port = 4000;
app.listen(port, () => {
  console.log(`Running On Port ${port}`);
})