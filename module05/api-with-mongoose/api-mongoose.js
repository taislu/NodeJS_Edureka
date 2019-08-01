const express = require('express')
const mongoose = require('mongoose')
var db = mongoose.connect('mongodb://127.0.0.1:27017/userdata', { useNewUrlParser: true })
//var db = mongoose.connect('mongodb://127.0.0.1:27017/userdata')
var user = require('./models/usermodel')
var app = express()
var port = process.env.PORT || 3000

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//fix mongoose deprecation warnings
//mongoose.set('useNewUrlParser', true) 
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

//Post user data using mongoose model
app.post('/addUser', (req,res)=>{
    user.create(req.body, (err,data)=>{
        if(err){
            console.log(err)
            res.status(500).send(err)
        }
        else{
            //console.log(data)
            res.send(`Inserted ... ${data} `)
        }
            
    })
})

//Get user data using mongoose model
app.get('/getUsers', (req,res)=>{
    user.find({}, (err,data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.json(data)
    })
})

app.get('/getUser', (req,res)=>{
    //console.log("req.body : ", req.body)
    user.find({"name": req.body.name}, (err,data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.json(data)
    })
})

//PUT request to update user data using mongoose model
app.put('/updateUser', (req,res)=>{
    //db.collection(collection_name)
        user.findOneAndUpdate({"name":req.body.name},{
            $set:{
                name: req.body.name,
                city: req.body.city,
                job: req.body.job
            }
        },{
            upsert: true
        }, (err,result)=>{
            if(err) return res.send(err)
            res.send("Updated ...")
        })
})

//DELETE request to delete user data using mongoose model
app.delete('/deleteUser', (req,res)=>{
    //db.collection(collection_name).findOneAndDelete({
    user.findOneAndDelete({
        "name" : req.body.name
    }, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
})

app.get('/', (req,res)=>{
    res.send('Welcome to api with mongoose !')
})

app.listen(port, ()=>{
    console.log(`Express api-mongoose server running at port ${port} `)
})