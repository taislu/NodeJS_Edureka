/* ********
package.json configuration
    "scripts": {
        "start":"node app.js",
        "dev":"nodemon app.js"
    },
npm install express
Command : npm run dev
Browser : localhost:6700 /getMovies /getProducts

prodution : pm2 -> nginx/proxy
npm install -g pm2
pm2 start app.js  (pm2 stop all)
brew install nginx
nginx.conf (mac:/usr/local/etc/nginx windows:c:\nginx\conf)
nginx
localhost:8082 /getMovies /getProducts
nginx -s stop
********* */
var express = require('express');
var app = express();
var port = process.env.port || 6700;

var fs = require('fs')

app.get('/', function(req,res){
    res.send('Welcome to Express Server !')
});

app.get('/getMovies', function(req,res){
    fs.readFile('movies.json',function(err,data){
        if(err) throw err;
        res.send(JSON.parse(data))
    })

});

app.get('/getProducts', function(req,res){
    fs.readFile('product.json',function(err,data){
        if(err) throw err;
        res.send(JSON.parse(data))
    })

});

app.listen(port,function(err){
    if(err) throw err;
    console.log('server is running on port ' + port)
});
