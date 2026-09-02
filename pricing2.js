const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

const selectDateCode = `async function selectDate(dateStr, el) {
            const d = new Date(dateStr);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            BASE_PRICE = isWeekend ? 1300 : 1100;
            EXTRA_PRICE = isWeekend ? 650 : 550;`;
            
html = html.replace('async function selectDate(dateStr, el) {', selectDateCode);

fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
