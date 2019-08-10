const express = require('express');
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const app = express();
// For parsing form
const bodyParser = require('body-parser');
// For generating Token
const jwt = require('jsonwebtoken');
// For encrypting Password
const bcrypt = require('bcryptjs');
// For Secert Token
const config = require('../config');
// For User Schema
const User = require('../models/User_model');
const session = require('express-session');

router.use(session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Register 1st Admin without JWT validation
router.post('/registerAdmin', (req,res) => {
  console.log("/registerAdmin : req.body ==> ", req.body)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    let htmlMsg
    if(!user){ //add new user
      const hashedPasword = bcrypt.hashSync(req.body.password, 8);
      User.create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPasword,
          role: req.body.role
      }, (err, user) => {
          if(err) return res.status(500).send('There was a problem registering user')
          htmlMsg = encodeURIComponent('Registered OK, disable after first admin created !');
          res.redirect('/admin?msg=' + htmlMsg)
      })
    }else{ //duplicate
      htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
      res.redirect('/admin?msg=' + htmlMsg);
    }
  }) 
  
})

// Register a User
router.post('/register', (req, res) => {
    console.log("/register : req.body ==> ", req.body)
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg
      if(!user){ //add new user
        const hashedPasword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword,
            role: "normal"
        }, (err, user) => {
            if(err) return res.status(500).send('There was a problem registering user')
            htmlMsg = encodeURIComponent('Registered OK !');
            res.redirect('/?msg=' + htmlMsg)
        })
      }else{ //duplicate
        htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
        res.redirect('/?msg=' + htmlMsg);
      }
    }) 
});

// Login User
router.post('/login', (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
      console.log("/login : user => ", user)
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg
      if (!user) { 
        htmlMsg = encodeURIComponent('Email not found, try again ...');
        res.redirect('/?invalid=' + htmlMsg);
      }else{
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          return res.status(401).send({ auth: false, token: null });
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        localStorage.setItem('authtoken', token)

        if(user.role == 'admin'){
          res.redirect(`/admin/userDashboard`)
        }else{
          res.redirect(`/users/view_shopping_list`);
        }
      }
    });
});

// Info of logined User
router.get('/loginedUser', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      // res.status(200).send(decoded);
      User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        res.status(200).send(user);
      });
    });
  });



  module.exports = router