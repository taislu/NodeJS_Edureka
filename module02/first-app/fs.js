var fs = require('fs');

/*
fs.writeFile('testFs1.txt','Hi to fs module', function(err){
    if(err) throw err;
    console.log('File created with data')
})
*/
/*
fs.appendFile('myappend.txt','This is new line >>>\n',function(err){
    if(err) throw err;
    console.log('Text appended')
})
*/
/*
fs.readFile('myappend.txt','utf-8',function(err,data){
    if(err)  throw err;
    console.log(data)
})
fs.readFile('db.json','utf-8',function(err,data){
    if(err)  throw err;
    console.log(data)
})
fs.unlink('myappend.txt',function(err){
    if(err) throw err;
    console.log('File deleted')
})
*/

fs.rename('testFs1.txt', 'testMyFs.txt', function(err){
    if(err) throw err;
    console.log('File renamed')
})
