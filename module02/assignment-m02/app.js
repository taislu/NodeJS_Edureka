/* ********
package.json configuration
    "scripts": {
        "start":"node app.js",
        "dev":"nodemon app.js"
    },
npm install express
Command : npm run dev
Browser : localhost:6700 localhost:6700/getProducts
Control-C to stop development server

Running Production Server
Command : pm2 start app.js 
Command : nginx
Browser : localhost:8082 localhost:8082/getProducts
Command : nginx -s stop
Command : pm2 stop all
********* */
var express = require('express');
var app = express();
var port = process.env.port || 6700;

var fs = require('fs')

app.get('/', function(req,res){
    res.send('Welcome to Express Server !')
});

app.get('/getProducts', function(req,res){
    fs.readFile('products.json',function(err,data){
        if(err) throw err;
        res.send(JSON.parse(data))
    })
   
});

app.listen(port,function(err){
    if(err) throw err;
    console.log('server is running on port ' + port)
});