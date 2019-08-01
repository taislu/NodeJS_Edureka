var express = require('express');
var app = express();
var port = 7800;
const bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
const dbName = 'db_edureka'
const collectionName = 'movies'

// For url encoding in utf-8
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//Static file path
app.use(express.static(__dirname+'/public'));
//Html path
app.set('views', './src/views');
app.set('view engine', 'ejs');

var menu = [
    {name:'Home', link:'/'},
    {name:'Movies', link:'/movies'},
    {name:'Artists', link:'/artist'},
    {name:'Admin', link:'/admin'}
]

var moviesRouter = require('./src/routes/moviesRoutes')(menu);
var artistRouter = require('./src/routes/ArtistsRoute')(menu);
var adminRouter = require('./src/routes/AdminRoute')(menu)

app.use('/movies', moviesRouter);
app.use('/artist', artistRouter);
app.use('/admin', adminRouter);

app.get('/',function(req,res){
    res.render('index',{title:'Home Page', 
                        menu:menu})
});

app.post('/addMovies',(req,res)=>{
    let out = req.body;
    mongodb.connect(url, function(err,db){
        if(err){
            res.status(401).send('error while connecting..')
        }else{
            const dbo = db.db(dbName);
            dbo.collection(collectionName).insert(
                req.body, (err,result) => {
                    if(err) throw err;
                    else{
                        console.log('data inserted')
                        res.redirect('/movies') 
                    }
                    
                }
            )
        }
    }) 
    console.log(out);
});

app.listen(port,function(err){
    if(err) throw err;
    else {
        console.log("app is running on the port "+ port);
    }
})
