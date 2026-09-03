const fs = require('fs');

const cssToAdd = `
        .neu-surface {
            background: #121212 !important;
            border-radius: 16px !important;
            box-shadow: 8px 8px 16px #050505, -8px -8px 16px #1f1f1f !important;
            border: 1px solid rgba(255,255,255,0.03) !important;
        }
        .neu-inset {
            background: #0A0A0A !important;
            border-radius: 8px !important;
            box-shadow: inset 4px 4px 8px #040404, inset -4px -4px 8px #101010 !important;
            border: 1px solid rgba(255,255,255,0.02) !important;
            color: #F5F5F5 !important;
        }
        .neu-slot {
            background: #121212;
            border-radius: 12px;
            box-shadow: 5px 5px 10px #060606, -5px -5px 10px #1e1e1e;
            border: 1px solid rgba(255,255,255,0.02);
            transition: all 0.3s ease;
        }
        .neu-slot:hover {
            box-shadow: 0 0 10px rgba(252,43,36,0.3), 5px 5px 10px #050505, -5px -5px 10px #1f1f1f;
            transform: translateY(-2px);
        }
        .neu-slot.selected {
            background: #FC2B24 !important;
            color: #ffffff !important;
            box-shadow: 0 0 15px rgba(252,43,36,0.6), inset 2px 2px 5px rgba(0,0,0,0.2) !important;
            border-color: #FC2B24 !important;
        }
`;

function addCss(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    if (!content.includes('.neu-surface')) {
        content = content.replace('</style>', cssToAdd + '\n</style>');
        fs.writeFileSync(filename, content, 'utf8');
    }
}

addCss('index.html');
addCss('turf.html');
addCss('book.html');

let bookHtml = fs.readFileSync('book.html', 'utf8');

bookHtml = bookHtml.replace(/text-brand-dark/g, 'text-white');
bookHtml = bookHtml.replace(/bg-black\/50 border border-white\/5 rounded-xl/g, 'neu-surface');
bookHtml = bookHtml.replace(/bg-white\/5 border border-white\/10 rounded-sm/g, 'neu-inset');
bookHtml = bookHtml.replace(/bg-black\/50 border border-white\/20 rounded/g, 'neu-inset');

bookHtml = bookHtml.replace(/date-card border border-white\/20 rounded-lg p-2 text-center flex flex-col items-center justify-center bg-black\/40/g, 'date-card neu-slot p-2 text-center flex flex-col items-center justify-center cursor-pointer');

bookHtml = bookHtml.replace(/el\.classList\.add\('border-\[#FC2B24\]', 'bg-\[#FC2B24\]\/10'\);/g, "el.classList.add('selected');");
bookHtml = bookHtml.replace(/el\.classList\.remove\('border-\[#FC2B24\]', 'bg-\[#FC2B24\]\/10'\);/g, "el.classList.remove('selected');");

bookHtml = bookHtml.replace(/border border-white\/10 rounded-lg p-3 text-center cursor-pointer hover:border-\[#FC2B24\] transition-colors bg-white\/5/g, 'neu-slot p-3 text-center cursor-pointer');
bookHtml = bookHtml.replace(/border border-white\/10 rounded-lg p-3 text-center opacity-50 cursor-not-allowed bg-black\/50/g, 'neu-inset p-3 text-center opacity-50 cursor-not-allowed');

bookHtml = bookHtml.replace(/el\.classList\.add\('bg-\[#FC2B24\]', 'text-white', 'border-\[#FC2B24\]'\);/g, "el.classList.add('selected');");
bookHtml = bookHtml.replace(/el\.classList\.remove\('bg-\[#FC2B24\]', 'text-white', 'border-\[#FC2B24\]'\);/g, "el.classList.remove('selected');");

bookHtml = bookHtml.replace(/bg-white\/5 p-4 border border-white\/10 rounded-sm/g, 'neu-slot p-4');
bookHtml = bookHtml.replace(/el\.classList\.add\('border-\[#FC2B24\]', 'bg-\[#FC2B24\]\/10'\)/g, "el.classList.add('selected')");
bookHtml = bookHtml.replace(/el\.classList\.remove\('border-\[#FC2B24\]', 'bg-\[#FC2B24\]\/10'\)/g, "el.classList.remove('selected')");

bookHtml = bookHtml.replace(/class="flex-1 bg-\[#FC2B24\] text-white font-display font-bold text-xl py-4 rounded-sm uppercase tracking-widest hover:bg-white transition-colors"/g, 'class="flex-1 btn-primary font-display font-bold text-xl py-4 uppercase tracking-widest"');

bookHtml = bookHtml.replace(/bg-\[#FC2B24\]\/10 border border-\[#FC2B24\]\/30/g, 'neu-inset border-[#FC2B24]/30');

bookHtml = bookHtml.replace(/class="bg-\[#FC2B24\] text-white px-6 font-bold uppercase tracking-widest rounded hover:bg-white transition-colors"/g, 'class="btn-primary px-6 font-bold uppercase tracking-widest rounded"');

fs.writeFileSync('book.html', bookHtml, 'utf8');
console.log('DONE');
