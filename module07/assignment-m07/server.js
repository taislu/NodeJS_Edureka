const app = require('./app');
const express = require('express');

const port = process.env.PORT || 9900;

const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const session = require('express-session');
app.use(session({
  secret: 'edurekaSecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

let sess;

app.get('/admin',(req,res) => {
  sess=req.session;
  sess.email=" "
 // console.log(">>>>",sess.email);

 //redirect messaging variables : msg, invalid
  res.render('adminSignUp',
    { invalid: req.query.invalid?req.query.invalid:'',
      msg: req.query.msg?req.query.msg:''})
})

app.get('/',(req,res) => {
    sess=req.session;
    sess.email=" "
   // console.log(">>>>",sess.email);

   //redirect messaging variables : msg, invalid
    res.render('signin',
      { invalid: req.query.invalid?req.query.invalid:'',
        msg: req.query.msg?req.query.msg:''})
    
})

const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});