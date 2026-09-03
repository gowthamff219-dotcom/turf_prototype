const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(/text-brand-dark/g, 'text-white');
fs.writeFileSync('index.html', index);

let turf = fs.readFileSync('turf.html', 'utf8');
turf = turf.replace(/text-brand-dark/g, 'text-white');
turf = turf.replace('class="inline-block bg-[#FC2B24] text-white font-display font-bold text-xl px-10 py-4 uppercase tracking-widest hover:bg-white transition-colors duration-300 rounded-sm"', 'class="inline-block btn-primary font-display font-bold text-xl px-10 py-4 uppercase tracking-widest"');
fs.writeFileSync('turf.html', turf);
console.log('Fixed');
