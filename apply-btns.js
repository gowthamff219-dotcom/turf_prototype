const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Primary button
html = html.replace(/class="btn-primary bg-\[#FC2B24\] text-brand-dark font-display font-bold text-xl px-12 py-4 rounded-sm uppercase tracking-widest"/g, 'class="btn-primary font-display font-bold text-xl px-12 py-4 uppercase tracking-widest"');

// Secondary button class definition
const btnSecCss = `
        .btn-secondary {
            background: #181818;
            color: #F5F5F5;
            border-radius: 12px;
            box-shadow: 5px 5px 10px #060606, -5px -5px 10px #1e1e1e;
            border: 1px solid rgba(255,255,255,0.03);
            transition: all 0.3s ease;
            display: inline-block;
        }
        .btn-secondary:hover {
            border-color: #FC2B24;
            box-shadow: 0 0 10px rgba(252, 43, 36, 0.2), 5px 5px 12px #040404, -5px -5px 12px #202020;
            color: #FC2B24;
        }
        .btn-secondary:active {
            box-shadow: inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #262626;
        }`;

if (!html.includes('.btn-secondary')) {
    html = html.replace('</style>', btnSecCss + '\n</style>');
}

// Update secondary button HTML
html = html.replace(/class="btn-primary bg-transparent border-2 border-white text-white font-display font-bold text-xl px-12 py-4 rounded-sm uppercase tracking-widest hover:bg-white hover:text-brand-dark"/g, 'class="btn-secondary font-display font-bold text-xl px-12 py-4 uppercase tracking-widest"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
