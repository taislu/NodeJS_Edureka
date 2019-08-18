'use strict'
const express = require('express')
const axios = require('axios')

const HOST = '0.0.0.0'
const PORT = 8080

const app = express()
app.listen(PORT, HOST)
console.log(`Express server running on http://${HOST}:${PORT}`)

app.get('/', (req,res)=>{
    res.send("API endpoint: /getGithubUser/userid")
})

app.get('/getGithubUser/:uid', (req,res)=>{

    console.log("req.params.uid : ", req.params.uid)
    const uid = req.params.uid
    const githubUrl = `https://api.github.com/users/${uid}` 
    console.log("githubUrl : ", githubUrl)
    axios.get(githubUrl).then(response => {
        const responseJSON = response.data;
        return res.status(200).json({ source: 'Docker Microservice', ...responseJSON, })    
    })
    .catch(err => { return res.json(err)} )

})