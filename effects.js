const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Button CSS Enhancements
const oldBtnCss = `        .btn-primary {
            position: relative; overflow: hidden;
            display: inline-block; transition: all 0.3s;
        }`;
const newBtnCss = `        .btn-primary {
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
        }`;
        
if(html.includes(oldBtnCss)) {
    html = html.replace(oldBtnCss, newBtnCss);
} else {
    // maybe it got malformed, append it to style
    html = html.replace('</style>', newBtnCss + '</style>');
}

// 2. Scroll Indicator
const scrollIndicator = `
        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer hover:opacity-100 opacity-70 transition-opacity" onclick="document.getElementById('about').scrollIntoView({behavior: 'smooth'})">
            <span class="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-2">Scroll Down</span>
            <div class="w-5 h-8 border-2 border-brand-primary/50 rounded-full flex justify-center p-1 relative overflow-hidden">
                <div class="w-1 h-2 bg-brand-primary rounded-full animate-bounce"></div>
            </div>
        </div>
`;

// Insert scroll indicator before the end of the hero section
html = html.replace('</section>', scrollIndicator + '\n    </section>');


// 3. Mouse Parallax and Glow Script
const mouseScript = `
    <div id="mouseGlow" class="mouse-glow" style="top: -1000px; left: -1000px;"></div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const glow = document.getElementById('mouseGlow');
            const heroWrapper = document.querySelector('.video-wrapper');
            
            document.addEventListener('mousemove', (e) => {
                // Update glow position
                if(glow) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                }
                
                // Subtle parallax for background based on mouse
                if(heroWrapper && window.scrollY < window.innerHeight) {
                    const x = (window.innerWidth / 2 - e.clientX) / 80;
                    const y = (window.innerHeight / 2 - e.clientY) / 80;
                    heroWrapper.style.transform = \`translate(\${x}px, \${y}px)\`;
                }
            });
        });
    </script>
`;

// Only add if not already there
if (!html.includes('mouseGlow')) {
    html = html.replace('</body>', mouseScript + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
