# Install babel modules

npm install @babel/core @babel/preset-env @babel/register babel-polyfill

# create .babelrc

{
    "presets": [
        "@babel/preset-env"
    ]
}

# create start.js

require('@babel/register')({})
module.exports = require('./app')

# set scripts in package.json

start: "node start.js", //replace node app.js
dev: "nodemon start.js"