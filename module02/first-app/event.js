var event = require('events');
var myevents = new event.EventEmitter();

myevents.on('health',function(){
    console.log('SERVER IS HEALTHY')
})

myevents.emit('health')