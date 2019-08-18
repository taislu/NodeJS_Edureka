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
const Newslist = require('../models/News_model')

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));

const session = require('express-session');
router.use(session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}));

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

        res.redirect(`/admin/newsForm`)
      }
    });
});

router.get('/newsForm', (req, res)=>{
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   
            res.render('news_form', {
                user,
                msg: req.query.msg?req.query.msg:''
            })
        })
    })
})

router.get('/getNews', (req, res)=>{
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   

            Newslist.find({}, (err,data)=>{
                if(err) res.status(500).send(err)
                else{
                    res.render('news_table', {
                        user,
                        data
                    })
                }        
            })
          
        })
    })
})

router.post('/find_by_id', (req,res)=>{
    const id = req.body.id
    console.log("/find_by_id : id : ", id)
    Newslist.find({_id: id}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("/find_by_id : data : ", data)
            res.send(data)
        }
    })
})

router.put('/updateNews', (req,res)=>{
    const id = req.body.id
    console.log("/updateNews : id : ", id)
    Newslist.findOneAndUpdate({_id: id},{
        $set:{
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            urlToImage: req.body.urlToImage,
            publishedAt: req.body.publishedAt,
            insertTime: Date.now()
        }
    },{
        upsert: true
    }, (err,result)=>{
        if(err) return res.send(err)
        res.send("Updated ...")
    }) 
})

router.delete('/deleteNews', (req,res)=>{
    const id = req.body.id
    console.log("/deleteNews : id : ", id)
    Newslist.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
})

router.post('/addNews', (req, res)=>{
    console.log("/addNews : req.body : ", req.body)
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   
            
            const d = Date.now()
            const news = {...req.body, insertTime: d }
            console.log("/addNews : news => ", news)

            Newslist.create(
                news
            , (err, data) => {
                if(err) return res.status(500).send('There was a problem registering user')
                console.log(`Inserted ... ${data} `)
                const htmlMsg = encodeURIComponent('Added News DONE !');
                res.redirect('/admin/newsForm/?msg=' + htmlMsg)
            })            

        })
    })
})

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})

// Register without JWT validation
router.post('/register', (req,res) => {
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
})

module.exports = router