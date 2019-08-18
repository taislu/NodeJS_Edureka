import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import cors from 'cors'
import 'babel-polyfill'
import path from 'path'
import http from 'http'

const iplocate = require("node-iplocate")
const publicIp = require('public-ip')

//const db = require('./db')
require('./db')
const Newslist = require('./models/News_model')
const Contactuslist = require('./models/Contactus_model')

const app = express()
app.set('port', process.env.PORT || 9901);
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Cross-origin resource sharing (CORS) allows AJAX requests 
// to skip the Same-origin policy and access resources from remote hosts.
// the other express api on localhost:9900 can't be found without cors
app.use(cors())

app.set('view engine', 'ejs')
app.set('views', './views')

const userloc = async ()=>{
    try{
        const ip = await publicIp.v4()
        console.log("ip : ", ip)
        return await iplocate(ip)    
    }catch(err){
        console.log(err)
    }
}

const getWeather = async (lon, lat) =>{
    const apikey = 'f443d734d889d6c735762b5fedab80b1'
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apikey}&units=metric`
    console.log("getWeather : apiUrl : ", apiUrl)
    try{
        return await axios.get(apiUrl)
    }catch(err){
        console.log(err)
    }
}

app.get('/', (req,res)=>{

    userloc().then((loc)=>{  
        const lon = loc.longitude
        const lat = loc.latitude
        console.log(`lon: ${lon}, lat: ${lat}`)

        getWeather(lon,lat).then((response)=>{
            const weather = {
                description: response.data.weather[0].main,
                icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
                temperature: response.data.main.temp,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                city: response.data.name
            }
            console.log("weather: ", weather)

            Newslist.find({}).limit(3).sort( {insertTime: -1} ).exec( (err,data)=>{
                console.log(err)
                const news = data

                console.log("news : ", news)
                res.render('home', {
                    weather,
                    news
                })
            })
    
        })
    })
})

app.get('/sports', (req,res)=>{

    const d = new Date().toISOString()
    const today = d.substring(0,10)
    console.log("today : ", today)

    const apiUrl = 'https://newsapi.org/v2/top-headlines' 
    axios.get(apiUrl, {
            params: {
                sources: 'espn, nfl-news, the-sport-bible',
                from: today,
                sortBy: 'popularity',
                language: 'en',
                apiKey: '98129a2a05e845ef84fec4963493b12e'
            }
        })
        .then( (response)=>{
            const data = response.data.articles
            console.log("/sports : data => ", data)
            res.render('sports', {data})
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/about_us', (req,res)=>{
    res.render('about_us')
})

app.get('/contact_us', (req,res)=>{
    res.render('contact_us', {
        msg: req.query.msg?req.query.msg:''
    })
})

app.post('/addContactUs', (req,res)=>{
    console.log("/addContactUs : req.body : ", req.body)
    
    const record = req.body
    Contactuslist.create(
            record  
        , (err, data) => {
            if(err){
                const htmlMsg = encodeURIComponent('Error : ', error);
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }else{
                const htmlMsg = encodeURIComponent('ContactUs Message Saved OK !');
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }
            
        }) 
    
})

const server = http.createServer(app).listen(app.get('port'), () => {
    console.log("Express server listening on port " + app.get('port'));
});
const io = require('socket.io').listen(server);

let users = []

// connection event
// socket represents each client connected to our server
io.on('connection',  (socket) => {

    socket.on('connect', ()=>{
        console.log("New connection socket.id : ", socket.id)
    })

    socket.on('disconnect', ()=>{
        console.log("disconnect => nickname : ", socket.nickname)
        const updatedUsers = users.filter(user => user != socket.nickname)
        console.log("updatedUsers : ", updatedUsers)
        users = updatedUsers
        io.emit('userlist', users)
    })

    // nick event
    socket.on('nick', (nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)

        console.log("server : users : ", users)
        // emit userlist event to all connected sockets
        io.emit('userlist', users);
    });

    // chat event
    socket.on('chat', (data) => {
        console.log("chat => nickname : ", socket.nickname)
        const d = new Date()
        const ts = d.toLocaleString()
        console.log("ts : ", ts)
        const response = `${ts} : ${socket.nickname} : ${data.message}`
        console.log("rs : ", response)
        io.emit('chat', response)
    });
});


