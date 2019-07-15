var str='abc'
var out = Buffer.from(str);
console.log("str: ", str)
console.log("buffer: ", out)

var str1='xyzhjk'
var out1 = Buffer.from(str1);
var myout = out1.slice(2,5)
console.log("str1: ", str1)
console.log("slice 2,5: ", myout)
console.log(myout.toString())