var express = require('express');
var moviesRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
const dbName = 'db_edureka'
const collectionName = 'movies'

function router(menu){
    moviesRouter.route('/')
        .get(function(req,res){
            mongodb.connect(url, function(err,db){
                if(err){
                    res.status(401).send('error while connecting..')
                }else{
                    const dbo = db.db(dbName);
                    dbo.collection(collectionName).find({}).toArray(
                        function(err,data){
                            if(err){
                                throw err;
                            }else {
                                res.status(200).render(
                                    'movies',{title:'Movies Page',
                                        menu,
                                        movies:data}
                                )
                            }
                        }
                    )
                }
            })       
    });


    moviesRouter.route('/:id')
        .get(function(req,res){
            // var id = req.params.id
            var {id} = req.params;
            mongodb.connect(url, function(err,db){
                if(err){
                    res.status(401).send('error while connecting..')
                }else{
                    const dbo = db.db(dbName);
                    dbo.collection(collectionName).findOne({_id:id}, function(err,data){
                        if(err){
                            throw err;
                        }else {
                            var moviename = data.name;
                            res.render('moviesDetail',{ menu,
                                            title:moviename,
                                            details:data});
                            
                        }
                    })
                }
            })
    });

    return moviesRouter
}


module.exports = router;

/*
res.render('moviesDetail',{ menu,
                                        title:moviename,
                                        details:data});
function add(a,b){
    return a+b
}
add(1,2)
*/