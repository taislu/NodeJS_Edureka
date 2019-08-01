/*
    Express APIs to support CRUD with MongoDB
    1. Post request to add user
    2. Get request to retrieve user
    3. Put request to update user
    4. Delete request to delete user
*/
const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://127.0.0.1:27017'
const collection_name = 'userlist'
let db 

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//POST request to add user into db
app.post('/addUser', (req,res) => {
    db.collection(collection_name).insertOne(req.body)
        .then( result => {
            res.send("data inserted ...")
            console.log("result : ", result.ops)
        })
        .catch(err => console.error(`Failed to insert item: ${err}`))
    /*
    db.collection(collection_name)
        .insert(req.body, (err,result) => {
            if(err) throw err
            res.send("data inserted ...")
            console.log("result : ", result)
        })
    */
})

//GET request to retrieve user data from db
app.get('/getUsers', (req,res) => {
    db.collection(collection_name).find().toArray( (err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.get('/getUser', (req,res) => {
    db.collection(collection_name)
        .find({"name":req.body.name}).toArray( (err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

//PUT request to update user data into db
app.put('/updateUser', (req,res)=>{
    db.collection(collection_name)
        .findOneAndUpdate({"name":req.body.name},{
            $set:{
                name: req.body.name,
                city: req.body.city,
                job: req.body.job
            }
        },{
            upsert: true
        }, (err,result)=>{
            if(err) return res.send(err)
            res.send(result)
        })
})

//DELETE request to delete user data from db
app.delete('/deleteUser', (req,res)=>{
    db.collection(collection_name).findOneAndDelete({
        "name" : req.body.name
    }, (err,result)=>{
        if(err) return res.send(500,err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
})

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(err,client){
    if(err) throw err
    // database name : userdata
    db = client.db('userdata')
    app.listen(port, () => {
        console.log('API is running on port ' + port)
    })
})

app.get('/', (req, res) => {
    res.send('API is working ...')
})

/*
app.listen(port, function(){
    console.log('API is running on port ' + port)
})
*/