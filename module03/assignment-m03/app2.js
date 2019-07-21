const express = require('express');
const app = express();
const request = require('request');
const port = 4000;

const employeeUrl = "http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees";

// Static file path
app.use(express.static(__dirname+'/public'));
// Html or rending Path
app.set('views', './src/views');
// View engine specification
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.send('Welcome to Express Server !')
});

// request api without promise
app.get('/employeewithoutpromise',(req,res) => {
    request(employeeUrl, (err,response,body) =>{
        if(err){
            console.log(err);
        } else {
            const output = JSON.parse(body);
            //res.send(output);
            result = output
            res.render('main',{result,title:'Employees List'})
            
        }
    });
});

const getApiData = (apiUrl) => {
    // Setting URL and headers for request
    var options = {
        url: apiUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise( (resolve, reject) => {
        // Do async job
        request.get(options, (err, resp, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

app.get('/displayEmployeesList',(req,res) => {
    var dataPromise = getApiData(employeeUrl);
    // Get user details after that get followers from URL
    dataPromise.then(JSON.parse)
               .then( (result) => {
                    res.render('main',{result,title:'Employees List'})
                })
})

app.listen(port ,(err) => {
    if(err) { console.log('error in api call')}
    else{ 
        console.log('app is running on port ' + port)
        console.log('check localhost:4000/displayEmployeesList')
    }
})