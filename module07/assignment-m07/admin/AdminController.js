const express = require('express');
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const config = require('../config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../models/User_model');
const Orderlist = require('../models/Order_model')

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));

const session = require('express-session');
router.use(session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}));

// admin addOneOrder
router.post('/addOneOrder', (req,res) => {
    console.log("/addOneOrder : req.body : ", req.body)
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        
        if (err) res.redirect('/')
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')}
            console.log("/addOneOrder : user ==> ", user)

            const d = Date.now()
            const order = {...req.body, order_date: d }
            //const order = Object.assign({}, req.body, {order_date: Date.now()})
            console.log("/addOneOrder : order => ", order)
            Orderlist.create(
                order
            , (err, data) => {
                if(err) return res.status(500).send('There was a problem registering user')
                console.log(`Inserted ... ${data} `)
                const htmlMsg = encodeURIComponent('Added New Order DONE !');
                res.redirect('/admin/shoppingDashboard?msg=' + htmlMsg)
            })            
        });
    });
})


// add user
router.post('/addUser', (req, res) => {

    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        res.redirect('/')
    };
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')}
            console.log("admin/addUser : user ==> ", user)

            console.log("/admin/addUser : req.body ==> ", req.body)
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
                        htmlMsg = encodeURIComponent('Added New User DONE !');
                        res.redirect('/admin/userDashboard?msg=' + htmlMsg)
                    })
                }else{ //duplicate
                    htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
                    res.redirect('/admin/userDashboard?msg=' + htmlMsg);
                }
            }) 
        });
    });
});

router.get('/shoppingDashboard', (req, res)=>{
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
            User.findById(decoded.id, { password: 0 }, (err, user) => {
                if (err) {res.redirect('/')}
                if (!user) {res.redirect('/')}

                console.log("/shoppingDashboard : user ==> ", user)
                //res.render('profile.ejs',{user})
                
               Orderlist.find({}, (err,data)=>{
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
                        console.log("/shoppingDashboard : orders ==> ", orders)
                        console.log("/shoppingDashboard : user ==> ", user)
                        //binding result to data to be used in OrderStatus.ejs
    
                        res.render('shoppingDashboard.ejs', {
                            user,
                            data: orders,
                            msg: req.query.msg?req.query.msg:''
                        })
                }
            })
        });
    });
})

// admin user dashboard
router.get('/userDashboard', (req, res) => {
    
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        
        if (err) res.redirect('/')
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')}
            console.log("user ==> ", user)

            User.find({}, (err,data)=>{
                if(err) res.status(500).send(err)
                else{
                    res.render('userDashboard.ejs', {
                        user,
                        data,
                        msg: req.query.msg?req.query.msg:''
                    })
                }
            })
        });
    });
});

module.exports = router