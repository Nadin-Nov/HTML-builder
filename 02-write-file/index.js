//импортируем
const fs = require('fs');
const path = require('path');
const readline = require('readline');
//потоки
const filePath = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(filePath, { flags: 'a' });
//ридлайн
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Welcome! Please enter text to write to the file. To exit, type "exit".',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
    output.end();
    return;
  }
  output.write(input + '\n');
});

process.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
  output.end();
});
