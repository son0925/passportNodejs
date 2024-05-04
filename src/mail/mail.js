const mailer = require('nodemailer');
const welcome = require('./welcom_template');
const goodbye = require('./goodbye_template');


const getEmailData = (to, name, template) => {
  let data = null;

  switch(template) {
    case 'hello' :
      data = {
        from: '보내는 사람 이름 <userId@gmail.com>',
        to,
        subject: `Hello ${name}`,
        html: welcome()
      }
      break;
    
    case 'goodbye' :
      data = {
        from: '보내는 사람 이름 <userId@gmail.com>',
        to,
        subject: `GoodBye ${name}`,
        html: goodbye()
      }
      break
    default:
      data;
  }
  return data
}

const sendMail = (to, name, type) => {
  const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'bjpio113@google.com',
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const mail = getEmailData(to, name, type);
  
  transporter.sendMail(mail, (err, response) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log('email sent successfully')  
    }
  
    transporter.close()
  })
}

module.exports = sendMail;