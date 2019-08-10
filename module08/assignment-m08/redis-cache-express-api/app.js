import express from 'express';
import axios from 'axios';
import redis from 'redis';
const port = 7700;
const app = express();
const client = redis.createClient();

client.on('error', (err) => {
    console.log(err)
})

/*
request.params is an object containing properties to the named route.
https://localhost:3000/user/:userId
https://localhost:3000/user/5896544 
request.params.userId = 5896544

request.query comes from query parameters in the URL
https://localhost:3000/user?userId=5896544
request.query.userId = 5896544
*/

app.get('/', (req,res)=>{
    res.send('Welcome to Express Server !')
})

// localhost:7700/getWiki?country=india
app.get('/getWiki',(req,res) => {
    const userinput = req.query.country;
    const url = `https://en.m.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${userinput}`

    return client.get(`wiki:${userinput}`, (err, result) => {
        if(result){
            const output = JSON.parse(result);
            return res.status(200).json(output)
        } else {
            return axios.get(url)
                .then( response => {
                    const output = response.data;
                    client.setex(`wiki:${userinput}`,3600,JSON.stringify({source:'*** Redis Cache ***',...output}));
                    return res.status(200).json({source:'API',...output})
                })
                .catch(err => {
                    return res.send(err)
                }) 
        }
    })
})

app.listen(port,(err)=>{
    console.log(`Express erver is running on port ${port}`)
});