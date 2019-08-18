const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsModel = new Schema({
    title: {type:String},
    description: {type:String},
    url: {type:String},
    urlToImage: {type:String},
    publishedAt: {type:String},
    insertTime: {type:Number}
})

// model name : newslist
// collection name : news_list
module.exports = mongoose.model('newslist', newsModel, 'news_list')