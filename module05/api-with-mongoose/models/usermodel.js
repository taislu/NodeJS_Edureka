var mongoose = require('mongoose')
Schema = mongoose.Schema

var userModel = new Schema({
    name: {type:String},
    city: {type:String},
    job: {type:String}
})

// model name : user
// collection name : userlist
module.exports = mongoose.model('user', userModel, 'userlist')