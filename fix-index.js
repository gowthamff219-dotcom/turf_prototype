const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix Navbar active state
html = html.replace(
    '<a href="#about" class="hover:text-brand-primary transition-colors text-white uppercase">About</a>',
    '<a href="index.html" class="hover:text-brand-primary transition-colors text-brand-primary uppercase">Home</a>'
);
html = html.replace(
    '<a href="book.html" class="hover:text-brand-primary transition-colors text-brand-primary uppercase">Book Now</a>',
    '<a href="book.html" class="hover:text-brand-primary transition-colors text-white uppercase">Book Now</a>'
);

// 2. Remove Scroll Indicator
const startIdx = html.indexOf('<!-- Scroll Indicator -->');
if (startIdx !== -1) {
    const endIdx = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', startIdx) + 1) + 1) + 6;
    html = html.slice(0, startIdx) + html.slice(endIdx);
}

// 3. Fix Title layout to ensure "Territory" is strictly below "Claim Your"
const oldTitle = `                <h1 class="text-6xl md:text-8xl font-display font-bold text-white mb-4 leading-none uppercase tracking-wide">
                    <span class="anim-title-word" style="animation-delay: 0.1s;">Claim</span> 
                    <span class="anim-title-word" style="animation-delay: 0.3s;">Your</span> <br>
                    <span class="text-brand-primary anim-title-word anim-glow" style="animation-delay: 0.5s;">Territory</span>
                </h1>`;
const newTitle = `                <h1 class="text-6xl md:text-8xl font-display font-bold text-white mb-4 leading-none uppercase tracking-wide flex flex-col items-start">
                    <span class="anim-title-word" style="animation-delay: 0.1s;">Claim Your</span>
                    <span class="text-brand-primary anim-title-word anim-glow" style="animation-delay: 0.3s; margin-top: 0.5rem;">Territory</span>
                </h1>`;
html = html.replace(oldTitle, newTitle);

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
