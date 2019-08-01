var mongoose = require('mongoose')
Schema = mongoose.Schema

var orderModel = new Schema({
    name: {type:String},
    email: {type:String},
    address: {type:String},
    product_name: {type:String},
    unit_price: {type:String},
    quantity: {type:String},
    order_date: {type:String}
})

// model name : orderlist
// collection name : orderlist
module.exports = mongoose.model('orderlist', orderModel, 'orderlist')