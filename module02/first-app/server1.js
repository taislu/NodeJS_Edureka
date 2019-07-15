var http = require('http');
var fs = require('fs');

console.log("http server running at localhost:2300 !")
var server = http.createServer(function(req,res){
    
    fs.readFile('db.json', 'utf-8', function(err,data){
        if(err) throw err;
        console.log(data)
        res.write(data);
        res.end();
    })

    
})

server.listen(2300);

//http://localhost:2300/