const app = require('./app')
const express = require('express')

const port = process.env.PORT || 9900;

const bodyParser =  require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const session = require('express-session')
app.use(session({
  secret: 'edurekaSecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
app.set('views', './views')

const Newslist = require('./models/News_model')
const Contactuslist = require('./models/Contactus_model')

let sess;

app.get('/',(req,res) => {
    sess=req.session;
    sess.email=" "
   
    res.render('signin',
      { invalid: req.query.invalid?req.query.invalid:'',
        msg: req.query.msg?req.query.msg:''})
    
})

app.post('/api/addContactUs', (req,res)=>{
  
  console.log("/api/addContactUs : req.body : ", req.body)
  const record = req.body
  Contactuslist.create(
              record  
            , (err, data) => {
                if(err) return res.status(500).send('There was a problem registering user')
                console.log(`Inserted ... ${data} `)
                return res.status(200).send("Inserted")
            }) 
})

app.get('/api/getLatestNews', (req,res) => {

  Newslist.find({}).limit(3).sort( {insertTime: -1} ).exec((err,data)=>{
    if (err) res.status(500).send(err)
    else res.json(data)
  })

})

const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});