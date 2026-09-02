const fs = require('fs');

const premiumCss = `
        /* --- Premium Animations --- */
        .btn-primary {
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
        }
        
        .mouse-glow {
            position: fixed; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%);
            border-radius: 50%; pointer-events: none; z-index: 50; mix-blend-mode: screen;
            transform: translate(-50%, -50%); transition: top 0.1s, left 0.1s;
        }

        @keyframes titleReveal {
            0% { opacity: 0; transform: translateY(40px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .anim-title-word {
            display: inline-block;
            opacity: 0;
            animation: titleReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        @keyframes textGlow {
            0% { text-shadow: 0 0 10px rgba(255, 107, 0, 0.2), 0 0 20px rgba(255, 107, 0, 0.1); }
            50% { text-shadow: 0 0 20px rgba(255, 107, 0, 0.6), 0 0 40px rgba(255, 107, 0, 0.3); }
            100% { text-shadow: 0 0 10px rgba(255, 107, 0, 0.2), 0 0 20px rgba(255, 107, 0, 0.1); }
        }
        
        .anim-glow {
            animation: textGlow 3s ease-in-out infinite;
        }

        @keyframes fadeUpDelayed {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .anim-desc {
            opacity: 0;
            animation: fadeUpDelayed 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
        }
        /* -------------------------- */
`;

const mouseScript = `
    <div id="mouseGlow" class="mouse-glow" style="top: -1000px; left: -1000px;"></div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const glow = document.getElementById('mouseGlow');
            document.addEventListener('mousemove', (e) => {
                if(glow) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                }
            });
        });
    </script>
`;

function processFile(filename, oldTitleHTML, newTitleHTML) {
    let html = fs.readFileSync(filename, 'utf8');

    if (!html.includes('.anim-title-word')) {
        html = html.replace('</style>', premiumCss + '\n</style>');
    }
    
    if (!html.includes('mouseGlow')) {
        html = html.replace('</body>', mouseScript + '\n</body>');
    }

    if (html.includes(oldTitleHTML)) {
        html = html.replace(oldTitleHTML, newTitleHTML);
    }
    
    html = html.replace('<p class="text-xl text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">', '<p class="text-xl text-gray-300 max-w-2xl mx-auto anim-desc">');
    
    fs.writeFileSync(filename, html, 'utf8');
}

// 1. Process book.html
const oldBookHeader = '<h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-4 uppercase tracking-wider" data-aos="fade-up">Book <span class="text-brand-primary">Your Slot</span></h1>';
const newBookHeader = `<h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-4 uppercase tracking-wider">
    <span class="anim-title-word" style="animation-delay: 0.1s;">Book</span>
    <span class="anim-title-word text-brand-primary anim-glow" style="animation-delay: 0.3s;">Your Slot</span>
</h1>`;
processFile('book.html', oldBookHeader, newBookHeader);

// Inject AOS into book.html forms if needed
let bookHtml = fs.readFileSync('book.html', 'utf8');
bookHtml = bookHtml.replace('<div class="mb-10">', '<div class="mb-10" data-aos="fade-up" data-aos-delay="200">');
if (!bookHtml.includes('data-aos="fade-up" id="stepTime"')) {
    bookHtml = bookHtml.replace('<div id="stepTime" class="hidden mb-10">', '<div id="stepTime" class="hidden mb-10" data-aos="fade-up">');
}
if (!bookHtml.includes('data-aos="fade-up" id="stepPayment"')) {
    bookHtml = bookHtml.replace('<div id="stepPayment" class="hidden max-w-xl">', '<div id="stepPayment" class="hidden max-w-xl" data-aos="fade-up">');
}
fs.writeFileSync('book.html', bookHtml, 'utf8');

// 2. Process turf.html
const oldTurfHeader = '<h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-4 uppercase tracking-wider" data-aos="fade-up">The <span class="text-brand-primary">Arena</span></h1>';
const newTurfHeader = `<h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-4 uppercase tracking-wider">
    <span class="anim-title-word" style="animation-delay: 0.1s;">The</span>
    <span class="anim-title-word text-brand-primary anim-glow" style="animation-delay: 0.3s;">Arena</span>
</h1>`;
processFile('turf.html', oldTurfHeader, newTurfHeader);

console.log('DONE');
