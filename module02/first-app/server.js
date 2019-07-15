var http = require('http');
var os = require('os');

var server = http.createServer(function(req,res){
    res.write("<h1>Hi "+JSON.stringify(os.userInfo().username)
        +" Your are using mac "+ os.platform() +" of "
        +os.arch()+ " Architecture" );
    res.end();
})

server.listen(2300);

//localhost:2300