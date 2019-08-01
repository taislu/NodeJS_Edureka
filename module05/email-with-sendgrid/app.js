//load environment variables
require('dotenv').config()

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const contentHtml 
= "<div>\
        <h3>header message : test1</h3>\
        <p>paragrap message : test2</p>\
   </div>"

const contentText 
= "header message : test1\nparagrap message : test2" 

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'tailu@ie-sd.com',
  from: 'tailu@ie-sd.com',
  subject: 'SendGrid Email Testing',
  text: contentText,
  html: contentHtml,
};
sgMail.send(msg);