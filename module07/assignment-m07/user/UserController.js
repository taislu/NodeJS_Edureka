const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
const localStorage = new LocalStorage('./scratch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../models/User_model');
const Orderlist = require('../models/Order_model')

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));

// RETURNS ALL THE USERS IN THE DATABASE
/*
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
*/

router.get('/view_shopping_list', (req,res)=>{
    var token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        console.log("decoded ==> ", decoded)
        if (err) {
            res.redirect('/')
        };
            User.findById(decoded.id, { password: 0 }, function (err, user) {
                if (err) {res.redirect('/')}
                if (!user) {res.redirect('/')}

                console.log("user ==> ", user)
                //res.render('profile.ejs',{user})
                
               Orderlist.find({email: user.email}, (err,data)=>{
                if(err) res.status(500).send(err)
                else{
                        //console.log("data ==> ", data)
                        const now = Date.now()
                        let status
                        let d0
                        let sec
                        const orders = data.map( order => {
                            //console.log("order ****** ", order)
                            d0 = Number(order.order_date)
                            sec = (now - d0)/1000
                            if (sec<86400)        status = "In Progess"
                            else if (sec>172800)  status = "Delivered"
                            else                  status = "Dispatched"
                            
                            //console.log(d0)
                            const d = new Date(d0).toLocaleDateString()
                            console.log(d)
                            order["order_date"] = d
                            order["order_status"] = status
                            return order
                        })
                        console.log("orders ==> ", orders)
                        console.log("user ==> ", user)
                        //binding result to data to be used in OrderStatus.ejs
                        res.render('OrderStatus', {data: orders, user})
                    }
                })
            });
        });
})

// GETS A SINGLE USER FROM THE DATABASE
/*
router.get('/profile', function (req, res) {
    var token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
        res.redirect('/')
    };
        User.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')}

            console.log("user ==> ", user)
            res.render('profile.ejs',{user})
        });
    });
});

router.get('/signup',  (req, res) => {
    res.render('signup.ejs')
 });
 */

 router.get('/logout', (req,res) => {
     localStorage.removeItem('authtoken');
     res.redirect('/');
 })

module.exports = router;