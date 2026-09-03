const fs = require('fs');

const files = ['index.html', 'turf.html', 'book.html'];

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update Tailwind config colors
    content = content.replace(
        "colors: { brand: { primary: '#ff6b00', dark: '#111111', gray: '#2d3748', white: '#ffffff' } }",
        "colors: { brand: { primary: '#FC2B24', dark: '#0A0A0A', surface: '#121212', surface2: '#181818', gray: '#A8A8A8', white: '#F5F5F5' } }"
    );
    
    // 2. Update Body Background
    content = content.replace(/background-color:\s*#111111/g, "background-color: #0A0A0A");
    content = content.replace(/background:\s*#111111/g, "background: #0A0A0A");
    content = content.replace(/color:\s*#ffffff/g, "color: #F5F5F5");

    // 3. Update Glass Card to Neumorphic Card
    const oldGlassCard = `        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }`;
    const newGlassCard = `        .glass-card {
            background: #121212;
            border-radius: 20px;
            box-shadow: 8px 8px 16px #060606, -8px -8px 16px #1e1e1e;
            border: 1px solid rgba(255,255,255,0.02);
            transition: all 0.3s ease;
        }
        .glass-card:hover {
            box-shadow: 12px 12px 20px #040404, -12px -12px 20px #202020;
            transform: translateY(-2px);
        }`;
    content = content.replace(oldGlassCard, newGlassCard);

    // 4. Update Video Overlay
    const oldVideoOverlay = `        .video-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to right, rgba(17, 17, 17, 0.9) 0%, rgba(17, 17, 17, 0.4) 100%);
            z-index: 1;
        }`;
    const newVideoOverlay = `        .video-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.6) 100%);
            z-index: 1;
        }`;
    content = content.replace(oldVideoOverlay, newVideoOverlay);

    // 5. Update Buttons (Premium Animations block)
    const oldBtn = `.btn-primary {
            position: relative; overflow: hidden;
            display: inline-block; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            z-index: 1;
        }
        .btn-primary::before {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: all 0.6s ease; z-index: -1;
        }
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(255, 107, 0, 0.8), 0 0 20px rgba(255, 107, 0, 0.4);
            border-color: #ff6b00;
        }`;
        
    const newBtn = `.btn-primary {
            background: #FC2B24;
            color: #FFFFFF;
            border-radius: 12px;
            box-shadow: 6px 6px 12px #060606, -6px -6px 12px #1e1e1e;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            position: relative;
            overflow: hidden;
            border: none;
            display: inline-block;
            z-index: 1;
        }
        .btn-primary::before {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: all 0.6s ease; z-index: -1;
        }
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
            transform: scale(1.02) translateY(-1px);
            box-shadow: 0 0 20px rgba(252, 43, 36, 0.4), 8px 8px 16px #040404, -8px -8px 16px #202020;
        }
        .btn-primary:active {
            box-shadow: inset 4px 4px 10px rgba(0,0,0,0.5), inset -4px -4px 10px rgba(255,255,255,0.1);
            transform: scale(0.98);
        }`;
    
    if (content.includes(oldBtn)) {
        content = content.replace(oldBtn, newBtn);
    } else {
        // Fallback replacement if exact match fails
        content = content.replace(/\.btn-primary\s*\{[^}]*\}\s*\.btn-primary::before\s*\{[^}]*\}\s*\.btn-primary:hover::before\s*\{[^}]*\}\s*\.btn-primary:hover\s*\{[^}]*\}/g, newBtn);
    }

    // 6. Update Glow colors from orange (#ff6b00/255,107,0) to red (#FC2B24/252,43,36)
    content = content.replace(/255,\s*107,\s*0/g, "252, 43, 36");
    content = content.replace(/#ff6b00/g, "#FC2B24");

    // 7. Update hover classes in HTML
    content = content.replace(/hover:text-brand-primary/g, "hover:text-[#FC2B24]");
    content = content.replace(/text-brand-primary/g, "text-[#FC2B24]");
    content = content.replace(/border-brand-primary/g, "border-[#FC2B24]");
    content = content.replace(/bg-brand-primary/g, "bg-[#FC2B24]");
    content = content.replace(/bg-brand-dark/g, "bg-[#0A0A0A]");
    
    // 8. Make navbar Neumorphic
    content = content.replace('bg-brand-dark/80 backdrop-blur-md border-b border-white/5', 'bg-[#0A0A0A] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-white/5');
    content = content.replace('bg-brand-dark/90 backdrop-blur-md border-b border-white/10', 'bg-[#0A0A0A] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-white/5');

    // 9. Update inline glass-card styles (index.html hero)
    content = content.replace('style="background: rgba(0,0,0,0.4); border-color: rgba(252, 43, 36,0.2); box-shadow: 0 0 40px rgba(0,0,0,0.8);"', 'style="background: #121212; border-color: rgba(255,255,255,0.02); box-shadow: 12px 12px 24px #050505, -12px -12px 24px #191919;"');

    // 10. Update text colors globally
    content = content.replace(/text-gray-300/g, "text-[#A8A8A8]");
    content = content.replace(/text-gray-400/g, "text-[#A8A8A8]");
    
    // Write back
    fs.writeFileSync(file, content, 'utf8');
}

console.log('DONE');
