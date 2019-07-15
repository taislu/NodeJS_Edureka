/*
Usage : node createFiles.js
User Prompt to enter a filename
** if not existing in flist, create a new file & add it into the list
** if existed, prompt try again to enter next filename
*/
var fs = require('fs')
var flist = 'FilesList.txt'
var firstRun = true
var fnames = []

function readContent(callback) {
    fs.readFile(flist, 'utf-8', function (err, content) {
        if (err) return callback(err)
        callback(null, content)
    })
}

if (fs.existsSync(flist)) firstRun = false
console.log("firstRun : ", firstRun)

if( !firstRun ){
    // wrapping async calls in function that takes a callback
    // readFile flist into fnames[]
    //console.log("*** readContent ***")
    readContent(function (err, content) {
        if(err) throw err;
        //console.log("content: ",content)
        fnames = content.split(",")
        console.log("fnames: ",fnames)
        console.log('Enter Filename : ')
    })
}

var user_input = process.stdin;
var found = false
user_input.setEncoding('utf-8');
//console.log("fnames: ", fnames)
//console.log('Enter Filename : ')

user_input.on('data', function(data) { 
    //Removes all 3 types of line breaks
    data = data.replace(/(\r\n|\n|\r)/gm,"");
    found = fnames.includes(data)
    if(found){
        console.log(data, "******** Oops, existing, try again !")
    }else{
        fnames.push(data)
        fs.writeFile(data,'You are awesome', function(err){
            if(err) throw err;
            //console.log(data, " ---> writeFile DONE ")
        })
        fs.writeFile(flist, fnames, function(err){
            if(err) throw err;
            //console.log(flist, " ---> writeFile DONE ")
        })
    }
    console.log("fnames: ", fnames)
    console.log('Enter Filename : ')
})

/* Screen Output 7/14/2019
Tais-MBP:assignment-m02 tailu$ node createFiles.js
firstRun :  false
fnames:  [ 't1.txt' ]
Enter Filename : 
t2.txt
fnames:  [ 't1.txt', 't2.txt' ]
Enter Filename : 
t3.txt
fnames:  [ 't1.txt', 't2.txt', 't3.txt' ]
Enter Filename : 
t1.txt
t1.txt ******** Oops, existing, try again !
fnames:  [ 't1.txt', 't2.txt', 't3.txt' ]
Enter Filename : 
^C

*/