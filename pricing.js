const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

// 1. Change const to let for prices
html = html.replace('const BASE_PRICE = 1100;', 'let BASE_PRICE = 1100;');
html = html.replace('const EXTRA_PRICE = 550;', 'let EXTRA_PRICE = 550;');

// 2. Add ID to turf title so we can update the rate
html = html.replace(
    '5TH YARD TURF (₹1100/hr) - Football / Cricket Turf',
    '5TH YARD TURF (<span id="modalRateText">₹1100</span>/hr) - Football / Cricket Turf'
);

// 3. Add ID to extra time text
html = html.replace(
    'Add 30 Mins Extra (+₹550)',
    'Add 30 Mins Extra (+<span id="modalExtraRateText">₹550</span>)'
);

// 4. In selectDate, update BASE_PRICE and EXTRA_PRICE based on weekend
const selectDateCode = `async function selectDate(dateStr) {
            const d = new Date(dateStr);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            BASE_PRICE = isWeekend ? 1300 : 1100;
            EXTRA_PRICE = isWeekend ? 650 : 550;`;
html = html.replace('async function selectDate(dateStr) {', selectDateCode);

// 5. In updateSummary, update the HTML text for the rates
const updateSummaryCode = `function updateSummary() {
            document.getElementById('modalRateText').textContent = '₹' + BASE_PRICE;
            document.getElementById('modalExtraRateText').textContent = '₹' + EXTRA_PRICE;`;
html = html.replace('function updateSummary() {', updateSummaryCode);

fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
