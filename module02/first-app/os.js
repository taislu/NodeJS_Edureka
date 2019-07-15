var os = require('os');

console.log('platform>> '+ os.platform())
console.log('Architecture>> '+ os.arch())
console.log('HostName>> '+ os.hostname())
console.log('UserInfo>> '+ JSON.stringify(os.userInfo().username))