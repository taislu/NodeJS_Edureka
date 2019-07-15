var util = require('util');
var genric = 'Hi %s welcome onboard with %s language';

var output = util.format(genric, 'John', 'Nodejs')

console.log(output)