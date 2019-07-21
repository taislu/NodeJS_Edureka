const express = require('express');
const cors = require('cors')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express();

app.use(logger('dev'))
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const port = process.env.port || 3000;

var fs = require('fs')

app.get('/', (req,res) => {
    res.send('Welcome to Express Server !')
});

app.get('/getProjects', (req,res) => {
    fs.readFile('projects.json', (err,data) => {
        if(err) throw err;
        res.send(JSON.parse(data))
    })
});

app.get('/getEmployees', (req,res) => {
    fs.readFile('employees.json', (err,data) => {
        if(err) throw err;
        res.send(JSON.parse(data))
    })
});

app.get('/employee/:id', (req,res) => {
    const id = req.params.id
    let employee = null
    fs.readFile('employees.json', (err,result) => {
        if(err) throw err;
        data=JSON.parse(result)
        for (let i=0; i<data.length; i++){
            if(data[i].employee_id == id){
                employee = data[i]
                break
            }
        }
        if(employee){
            res.json(employee)
        }else{
            res.status(404).json({
                msg: 'Employee Not found'
              })
        }
    })
});

app.get('/project/:id', (req,res) => {
    const id = req.params.id
    let project = null
    fs.readFile('projects.json', (err,result) => {
        if(err) throw err;
        data=JSON.parse(result)
        for (let i=0; i<data.length; i++){
            if(data[i].project_id == id){
                project = data[i]
                break
            }
        }
        if(project){
            res.json(project)
        }else{
            res.status(404).json({
                msg: 'Project Not found'
              })
        }
    })
});

const fetch = require("node-fetch");

app.get('/getemployeedetails/:id', async (req,res) => {
    const id = req.params.id
    const employeeUrl = "http://localhost:3000/employee/" + id 
    console.log("employeeUrl: ", employeeUrl)
    try {
        const response = await fetch(employeeUrl);
        const employee = await response.json();
        
        const projectUrl  = "http://localhost:3000/project/" + employee.project_id
        const response1 = await fetch(projectUrl);
        const project = await response1.json();
        
        const result = {
            ...employee,
            ...project,
        }
        console.log("result: ", result)
        res.send(result)
      } catch (error) {
        console.log("getData: ",error);
      }
});

app.listen(port,function(err){
    if(err) throw err;
    console.log('server is running on port ' + port)
    console.log('check localhost:3000/employee/1 (valid ids: 1, 2, 3)')
    console.log('check localhost:3000/project/p01 (valid ids: p01, p02, p03)')
    console.log('check localhost:3000/getemployeedetails/1 (valid ids: 1, 2, 3)')
});

