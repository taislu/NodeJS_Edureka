//var express = require('express');
import express from 'express'
var app = express();
var port = process.env.port || 6700;

app.get('/', (req,res)=>{
    res.send('Welcome to Express Server !')
});

app.listen(port, (err)=>{
    if(err) throw err;
    console.log(`Express Server is running on port ${port}`)
});