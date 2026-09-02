const fs = require('fs');

function wrapGlow(filename) {
    let html = fs.readFileSync(filename, 'utf8');
    
    // Fix index.html
    if (filename === 'index.html') {
        html = html.replace(
            '<span class="text-brand-primary anim-title-word anim-glow" style="animation-delay: 0.3s; margin-top: 0.5rem;">Territory</span>',
            '<span class="anim-title-word text-brand-primary" style="animation-delay: 0.3s; margin-top: 0.5rem;"><span class="anim-glow inline-block">Territory</span></span>'
        );
        html = html.replace(
            '<span class="text-brand-primary anim-title-word anim-glow" style="animation-delay: 0.5s;">Territory</span>',
            '<span class="anim-title-word text-brand-primary" style="animation-delay: 0.5s;"><span class="anim-glow inline-block">Territory</span></span>'
        );
    }
    
    // Fix turf.html
    if (filename === 'turf.html') {
        html = html.replace(
            '<span class="anim-title-word text-brand-primary anim-glow" style="animation-delay: 0.3s;">Arena</span>',
            '<span class="anim-title-word text-brand-primary" style="animation-delay: 0.3s;"><span class="anim-glow inline-block">Arena</span></span>'
        );
    }
    
    // Fix book.html
    if (filename === 'book.html') {
        html = html.replace(
            '<span class="anim-title-word text-brand-primary anim-glow" style="animation-delay: 0.3s;">Your Slot</span>',
            '<span class="anim-title-word text-brand-primary" style="animation-delay: 0.3s;"><span class="anim-glow inline-block">Your Slot</span></span>'
        );
    }
    
    // Ensure inline-block for anim-glow so text shadow and transforms work perfectly
    html = html.replace(
        '.anim-glow {\n            animation: textGlow 3s ease-in-out infinite;\n        }',
        '.anim-glow {\n            display: inline-block;\n            animation: textGlow 3s ease-in-out infinite;\n        }'
    );

    fs.writeFileSync(filename, html, 'utf8');
}

wrapGlow('index.html');
wrapGlow('turf.html');
wrapGlow('book.html');
console.log('DONE');
