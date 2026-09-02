const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

const badDate = 'const d = new Date(dateStr);';
const goodDate = 'const parts = dateStr.split("-"); const d = new Date(parts[0], parts[1] - 1, parts[2]);';

html = html.replace(badDate, goodDate);

fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
