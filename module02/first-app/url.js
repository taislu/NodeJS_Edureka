var http = require('http');
var url = require('url');

console.log("http server running at localhost:7888 !")
console.log("Try localhost:7888/login")
http.createServer(function(req,res){
    var myquery = url.parse(req.url,true);
    res.write(myquery.href);
    res.end();
    console.log(myquery.href)
}).listen(7888);