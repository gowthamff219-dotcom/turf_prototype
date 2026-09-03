const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject CSS
const customCss = `
        /* --- Premium Animations --- */
        @keyframes slowZoom {
            0% { transform: scale(1.05); }
            100% { transform: scale(1.25); }
        }
        .hero-video-zoom {
            animation: slowZoom 25s ease-in-out infinite alternate;
        }
        
        #particles-js {
            position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1; pointer-events: none;
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
            animation: fadeUpDelayed 1s cubic-bezier(0.2, 0.8, 0.2, 1) 1s forwards; /* 1s delay */
        }
        
        @keyframes ambientLight {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .ambient-glow-bg {
            position: absolute;
            top: -10%; left: -10%; width: 120%; height: 120%;
            background: radial-gradient(circle at center, rgba(255,107,0,0.15) 0%, transparent 60%);
            z-index: 0;
            pointer-events: none;
            background-size: 200% 200%;
            animation: ambientLight 10s ease infinite;
        }
        /* -------------------------- */
`;

html = html.replace('</style>', customCss + '</style>');

// Modify video tag to add slow zoom
html = html.replace('<video id="heroVideo" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; transform: scale(1.1);">',
    '<video id="heroVideo" class="hero-video-zoom" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">');

// Add particles container
html = html.replace('<div class="video-overlay"></div>',
    '<div class="video-overlay"></div><div id="particles-js"></div>');

// Update Hero Title and Description HTML
const oldHeroContent = `<div class="max-w-4xl glass-card p-12 rounded-2xl" data-aos="fade-up" data-aos-duration="1000">
                <h1 class="text-6xl md:text-8xl font-display font-bold text-white mb-4 leading-none uppercase tracking-wide">
                    Claim Your <br><span class="text-brand-primary">Territory</span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-10 font-medium max-w-2xl border-l-4 border-brand-primary pl-4 uppercase">
                    The City's Premier Football & Cricket Arena. Premium 4G Turf. Pure Adrenaline.
                </p>`;

const newHeroContent = `<div class="ambient-glow-bg"></div>
            <div class="max-w-4xl glass-card p-12 rounded-2xl relative z-10" style="background: rgba(0,0,0,0.4); border-color: rgba(255,107,0,0.2); box-shadow: 0 0 40px rgba(0,0,0,0.8);">
                <h1 class="text-6xl md:text-8xl font-display font-bold text-white mb-4 leading-none uppercase tracking-wide">
                    <span class="anim-title-word" style="animation-delay: 0.1s;">Claim</span> 
                    <span class="anim-title-word" style="animation-delay: 0.3s;">Your</span> <br>
                    <span class="text-brand-primary anim-title-word anim-glow" style="animation-delay: 0.5s;">Territory</span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-10 font-medium max-w-2xl border-l-4 border-brand-primary pl-4 uppercase anim-desc">
                    The City's Premier Football & Cricket Arena. Premium 4G Turf. Pure Adrenaline.
                </p>`;

html = html.replace(oldHeroContent, newHeroContent);

// Add particles.js script and init it before AOS init
const particlesScript = `
    <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
    <script>
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#FC2B24" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: "top", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: false }, resize: true },
                modes: { bubble: { distance: 200, size: 6, duration: 2, opacity: 1, speed: 3 } }
            },
            retina_detect: true
        });
    </script>
`;

html = html.replace('<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>', particlesScript + '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
