/*
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var input = "";
rl.on('line', (line) => {
    //console.log(`Received: ${input}`);
    if(line.trim() === "")  {
        rl.close();
        //console.log(`Received: \n${input}`);

        
    } else {
        if(input !== "") {
            input = input.concat("\n");    
        }
        input = input.concat(line);
    }
});

*/

var a = [];
a.push(new Map())
console.log(a.length);
var b =[1, 2, 3];
b.forEach((val, index) => { console.log(`[${index}]: ${val}` )})
