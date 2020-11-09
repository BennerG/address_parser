const { parseAddress } = require('./index');

const address1 = '123 eAst 1420 s. alpine dist, utah 84058-1234';
console.log(parseAddress(address1));
const address2 = '123 eAst whiticker ave. alpine dist, utah 84058-1234';
console.log(parseAddress(address2));
const address3 = '123 n 1800 West elk ridge, utah 84058-1234';
console.log(parseAddress(address3));
const address4 = '1800 w elk ridge, utah 84058-1234';
console.log(parseAddress(address4));
const address5 = '56 north lincoln & adams drive elk ridge, utah 84058-1234';
console.log(parseAddress(address5));
const address6 = '56 north hwy 89 elk ridge, utah 84058-1234';
console.log(parseAddress(address6));
const address7 = 'hwy 89 elk ridge';
console.log(parseAddress(address7));
const address8 = 'n hwy 89 elk ridge 84058';
console.log(parseAddress(address8));

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
    console.log(parseAddress(input));
});