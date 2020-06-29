const nodemailer = require('nodemailer');

const { credentials } = require('./config');

const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password
  }
})
async function go () {
  try {
    const result = await mailTransport.sendMail({
      from: '"Chris Baker" <christopherbaker15@augustana.edu>',
      to: 'eblavelle@gmail.com',
      subject: 'Chris Baker is the god of pool',
      text: 'Chris has beaten Ellie Lavelle in pool and it\'s very important that everyone knows about it. All hail pool god Chris Baker'
    });
    console.log('mail sent successfully: ', result);
  } catch (err) {
    console.log('could not send ' + err.message);
  }
}

go()
