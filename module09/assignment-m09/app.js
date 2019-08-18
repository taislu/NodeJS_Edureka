import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3800

const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://127.0.0.1:27017'
const db_name = 'userdata'
const collection_name = 'userlist'
let db 

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err,client)=>{
    if(err) throw err
    
    db = client.db(db_name)
    app.listen(port, () => {
        console.log('Express API is running on port ' + port)
    })
})

//const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Express API is working ...')
})

//POST request to add user into db
app.post('/addUser', (req,res) => {
    if( req.body.name ){ // valid name
      db.collection(collection_name).insertOne(req.body)
        .then( result => {
            res.send("data inserted ...")
            console.log("result : ", result.ops)
        })
        .catch(err => console.error(`Failed to insert item: ${err}`))
    }else{
        res.sendStatus(400)
    }
    
})

//GET request to query db by user name
app.get('/getUser/:name', (req,res)=>{
    
        const name = req.params.name
        console.log("req.params.name : ", req.params.name)

        db.collection(collection_name)
            .find({"name": name}).toArray( (err,result)=>{
            if (err) throw err
            if ( result.length ) res.send(result)
            else res.sendStatus(404)
        })
        
})

//PUT request to update user data into db
app.put('/updateUser', (req,res)=>{
    if(req.body.name){ // valid name
        console.log("req.body.name : ", req.body.name)
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
    }else{
        res.sendStatus(400)
    }
    
    
})

//DELETE request to delete user data from db
app.delete('/deleteUser/:name', (req,res)=>{
    const name = req.params.name
    console.log("req.params.name : ", req.params.name)

    db.collection(collection_name).findOneAndDelete({
        "name" : name
    }, (err,result)=>{
        if(err) return res.send(500,err)
        console.log(result)
        if( result.value ) res.send({message: 'deleted ...'})
        else res.sendStatus(404)
        
    })
})