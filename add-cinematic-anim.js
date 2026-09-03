const fs = require('fs');
const path = 'index.html';

let html = fs.readFileSync(path, 'utf8');

const cssToAdd = `
        :root {
            --cinematic-duration: 4s;
        }

        @keyframes cinematicSpinBlur {
            0% {
                transform: perspective(1000px) rotateX(-90deg) translateY(30px);
                filter: blur(20px);
                opacity: 0;
                animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            15% {
                transform: perspective(1000px) rotateX(-30deg) translateY(10px);
                filter: blur(10px);
                opacity: 0.5;
                animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            35% {
                transform: perspective(1000px) rotateX(0deg) translateY(0);
                filter: blur(0px);
                opacity: 1;
                animation-timing-function: linear;
            }
            70% {
                transform: perspective(1000px) rotateX(0deg) translateY(0);
                filter: blur(0px);
                opacity: 1;
                animation-timing-function: cubic-bezier(0.8, 0.2, 0.8, 1);
            }
            95% {
                transform: perspective(1000px) rotateX(90deg) translateY(-30px);
                filter: blur(20px);
                opacity: 0;
                animation-timing-function: linear;
            }
            100% {
                transform: perspective(1000px) rotateX(90deg) translateY(-30px);
                filter: blur(20px);
                opacity: 0;
            }
        }

        .anim-cinematic-text {
            display: inline-block;
            animation: cinematicSpinBlur var(--cinematic-duration) infinite;
            transform-style: preserve-3d;
            will-change: transform, filter, opacity;
            text-shadow: 0 0 10px rgba(252, 43, 36, 0.3); /* Subtle red glow as requested */
        }

        @media (prefers-reduced-motion: reduce) {
            .anim-cinematic-text {
                animation: none;
                transform: none;
                filter: none;
                opacity: 1;
            }
        }
`;

if (!html.includes('.anim-cinematic-text')) {
    html = html.replace('</style>', cssToAdd + '\n</style>');
}

// Replace anim-glow with anim-cinematic-text on the word Territory
html = html.replace(/class="anim-glow inline-block"/g, 'class="anim-cinematic-text"');

fs.writeFileSync(path, html, 'utf8');
console.log('Animation injected into index.html');
