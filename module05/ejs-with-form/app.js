//load environment variables
require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mongoose = require('mongoose')
//fix mongoose deprecation warnings
//mongoose.set('useNewUrlParser', true) 
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const db = mongoose.connect('mongodb://127.0.0.1:27017/db_edureka', { useNewUrlParser: true })
const orderlist = require('./models/order_model')

const express = require('express');
const app = express();
const port = 9900;

/*
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017";
const dbName = 'db_edureka'
const collectionName = 'orders'
let db

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err,client)=>{
    if(err) throw err
    db = client.db(dbName)
    app.listen(port, () => {
        console.log('APP is running on port ' + port)
    })
})
*/

// For url encoding in utf-8
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Static file path
app.use(express.static(__dirname+'/public'));
//Html path
app.set('views', './views');
app.set('view engine', 'ejs');

//Post request to add new order
app.post('/addOrder', (req,res)=>{

    const order = Object.assign({}, req.body, {order_date: Date.now()})
    console.log("order ==> ", order)
    
    orderlist.create(order, (err,data)=>{
        if(err){
            console.log(err)
            res.status(500).send(err)
        }
        else{
            //console.log(data)
            res.send(`Inserted ... ${data} `)
        }
    })

    /* with MongoClient
    db.collection(collectionName).insertOne(order)
        .then( result => {
            res.status(200).send("New order inserted ... check /orderDashboard ")
            console.log("result : ", result.ops)
        })
        .catch(err => console.error(`Error Message : ${err}`))    
    */
})

//Get request to render OrderForm.ejs
app.get('/enterOrder', (req,res)=>{
    res.render('OrderForm')
})

app.get('/orderDashboard', (req,res)=>{
    //db.collection(collectionName).find().toArray( (err,result)=>{
    //    if (err) throw err
    orderlist.find({}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("data ==> ", data)
            const now = Date.now()
            let status
            let d0
            let sec
            const orders = data.map( order => {
                console.log("order ****** ", order)
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
                //return Object.assign({}, order, {order_date: d}, {order_status: status})
            })
            console.log("orders ==> ", orders)
            
            //binding result to data to be used in OrderStatus.ejs
            res.render('OrderStatus', {data: orders})
        }
    })
})

//Get request to retrieve order data from db
app.get('/getOrders', (req,res) => {

    orderlist.find({}, (err,data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.json(data)
    })

    /* MongoClient
    db.collection(collectionName).find().toArray( (err,result)=>{
        if (err) throw err
        res.send(result)
    })
    */
})

app.get('/', (req,res)=>{
    res.send("Welcome to Order Management and Status App !")
})

app.get('/sendEmail/:email', (req,res)=>{
    const email = req.params.email
    console.log("email ==> ", email)
    orderlist.find({}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("data ==> ", data)
            const now = Date.now()
            let status
            let d0
            let sec
            const orders = data.map( order => {
                console.log("order ****** ", order)
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
                //return Object.assign({}, order, {order_date: d}, {order_status: status})
            })
            console.log("orders ==> ", orders)
            const contentText = JSON.stringify(orders, null, 4)
            const contentHtml = "<div><h3>" + contentText + "</h3></div>"
            const msg = {
                to: email,
                from: 'tailu@ie-sd.com',
                subject: 'Your Order Status',
                text: contentText,
                html: contentHtml,
            };
            sgMail.send(msg);
            console.log("msg ==> ", msg)
            res.send("Email sent to " + email)
        }
    })
})

app.listen(port, (err)=>{
    if(err) throw err;
    console.log("app is running on the port "+ port);
})
