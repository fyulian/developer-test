const readline = require('readline');
const storenload = require('./store-n-load');

var input = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Enter string based format then enter blank after the last line \n(eg. key1=value1;key2=value2\\nkeyA=valueA\\nkeyC=valueC\\n): ");
rl.on('line', (line) => {
    if(line.trim() === "")  {
        rl.close();
        var tmp = input.replace(/\n/g, '\\n');
        console.log(`Running load("${tmp}")\nResult:`)
        var ret = storenload.load(input);
        console.log(ret);

        console.log(`Running store(\n`);
        console.log(`${ret}`);
        console.log(`Result:`);
        var ret2 = storenload.store(ret);
        var tmp2 = ret2.replace(/\n/g, '\\n');
        console.log(`${ret2}`);
        console.log(`In string:\n"${tmp2}"`);

    } else {
        if(input !== "") {
            input = input.concat("\n");    
        }
        input = input.concat(line);
    }
});