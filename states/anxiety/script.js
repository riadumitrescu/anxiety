// Preload images
const eyeImages = [
    '../assets/eyeopen.png',
    '../assets/eyeclosed.png'
];

Promise.all(eyeImages.map(src => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
    });
})).then(() => {
    document.body.classList.add('images-loaded');
}).catch(error => {
    console.error('Error loading images:', error);
});

// Custom cursor implementation
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');

// Track cursor state
let cursorX = 0;
let cursorY = 0;
let targetX = 0;
let targetY = 0;

// Smooth cursor movement
function updateCursor() {
    // Smoothly interpolate cursor position
    cursorX += (targetX - cursorX) * 0.1;
    cursorY += (targetY - cursorY) * 0.1;
    
    if (cursorOuter) {
        cursorOuter.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${cursorOuter.dataset.scale || 1})`;
    }
    if (cursorInner) {
        cursorInner.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }
    
    requestAnimationFrame(updateCursor);
}

// Start cursor animation
updateCursor();

// Update cursor target position
document.addEventListener('mousemove', (e) => {
    targetX = e.pageX;
    targetY = e.pageY;
});

// Handle cursor visibility
document.addEventListener('mouseenter', () => {
    if (cursorOuter) cursorOuter.style.opacity = '1';
    if (cursorInner) cursorInner.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    if (cursorOuter) cursorOuter.style.opacity = '0';
    if (cursorInner) cursorInner.style.opacity = '0';
});

// Add hover states for clickable elements
document.querySelectorAll('button, input, a').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        if (cursorOuter) {
            cursorOuter.dataset.scale = '1.5';
            cursorOuter.style.mixBlendMode = 'hard-light';
        }
    });
    
    elem.addEventListener('mouseleave', () => {
        if (cursorOuter) {
            cursorOuter.dataset.scale = '1';
            cursorOuter.style.mixBlendMode = 'difference';
        }
    });
});

// Avoid button with more complex avoidance
const avoidButton = document.querySelector('.avoid-button');
let isAvoiding = false;
let avoidanceCount = 0;

document.addEventListener('mousemove', (e) => {
    if (!isAvoiding && avoidButton) {
        const rect = avoidButton.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - buttonCenterX, 2) + 
            Math.pow(mouseY - buttonCenterY, 2)
        );
        
        if (distance < 150) { // Increased detection radius
            isAvoiding = true;
            avoidanceCount++;
            
            const angle = Math.atan2(mouseY - buttonCenterY, mouseX - buttonCenterX);
            const avoidDistance = 150 + (avoidanceCount * 20); // Increased movement distance
            
            let newX = buttonCenterX - Math.cos(angle) * avoidDistance;
            let newY = buttonCenterY - Math.sin(angle) * avoidDistance;
            
            // Keep button within viewport
            newX = Math.max(rect.width/2, Math.min(window.innerWidth - rect.width/2, newX));
            newY = Math.max(rect.height/2, Math.min(window.innerHeight - rect.height/2, newY));
            
            avoidButton.style.transition = 'transform 0.2s ease-out';
            avoidButton.style.transform = `translate(${newX - buttonCenterX}px, ${newY - buttonCenterY}px) rotate(${Math.random() * 20 - 10}deg)`;
            
            if (avoidanceCount > 5) {
                avoidButton.textContent = "You can't catch me!";
            }
            
            setTimeout(() => {
                isAvoiding = false;
            }, 200);
        }
    }
});

// Enhanced form manipulation
const anxietyForm = document.getElementById('anxiety-form');
const anxietyInput = document.getElementById('anxiety-input');
const errorMessage = document.querySelector('.error-message');

if (anxietyInput) {
    let originalPlaceholder = anxietyInput.placeholder;
    let alternativePlaceholders = [
        "Are you sure about that?",
        "Is that really your name?",
        "Think carefully...",
        "Don't make a mistake.",
        "You're running out of time."
    ];
    
    anxietyInput.addEventListener('focus', () => {
        const interval = setInterval(() => {
            anxietyInput.placeholder = alternativePlaceholders[Math.floor(Math.random() * alternativePlaceholders.length)];
        }, 2000);
        anxietyInput.dataset.interval = interval;
    });
    
    anxietyInput.addEventListener('blur', () => {
        clearInterval(Number(anxietyInput.dataset.interval));
        anxietyInput.placeholder = originalPlaceholder;
    });
    
    anxietyInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length > 0) {
            if (Math.random() < 0.3) {
                const modifications = [
                    () => value.split('').reverse().join(''),
                    () => value.replace(/[aeiou]/gi, '*'),
                    () => value.toUpperCase(),
                    () => '?'.repeat(value.length),
                    () => value.split('').join('̴̢̨̻̞͎̩̟̲̪̥̄̈́͋͑̊̈́̎̕͝'),  // Glitch characters
                    () => value.replace(/./g, char => Math.random() > 0.5 ? char : '?')
                ];
                
                const modification = modifications[Math.floor(Math.random() * modifications.length)];
                e.target.value = modification();
            }
        }
    });
}

if (anxietyForm) {
    anxietyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.style.opacity = '1';
        anxietyInput.value = '';
        
        const submitButton = anxietyForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.classList.add('error');
        
        const errorMessages = [
            "Too late.",
            "Not good enough.",
            "Try harder.",
            "You failed.",
            "Start over."
        ];
        
        // Add glitch effect to the error message
        errorMessage.style.animation = 'textGlitch 0.3s infinite';
        
        setTimeout(() => {
            submitButton.textContent = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            document.body.classList.add('heavy-shake');
            
            // Intensify the shake
            shakeIntensity = Math.min(shakeIntensity + 1, 5);
            document.documentElement.style.setProperty('--shake-intensity', shakeIntensity);
            
            setTimeout(() => {
                document.body.classList.remove('heavy-shake');
                submitButton.disabled = false;
                submitButton.classList.remove('error');
                errorMessage.style.animation = '';
            }, 2000);
        }, 500);
    });
}

// Enhanced time-based escalation
let anxietyLevel = 0;
const maxAnxietyLevel = 10;
let isPageVisible = true;
let shakeIntensity = 0;

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
});

function updateShakeIntensity() {
    if (!isPageVisible) return;
    
    // Gradually increase shake intensity
    shakeIntensity = Math.min(shakeIntensity + 0.1, 5);
    document.documentElement.style.setProperty('--shake-intensity', shakeIntensity);
}

function escalateAnxiety() {
    if (!isPageVisible) return;
    anxietyLevel = Math.min(anxietyLevel + 1, maxAnxietyLevel);
    
    // Apply effects based on anxiety level
    document.body.style.filter = `contrast(${1 + anxietyLevel * 0.05})`;
    document.documentElement.style.setProperty('--anxiety-red', `hsl(0, ${50 + anxietyLevel * 5}%, 50%)`);
    
    // Start with light shake and progress to heavy
    if (anxietyLevel >= 2) {
        document.body.classList.add('continuous-shake');
        updateShakeIntensity();
    }
}

// Update shake intensity more frequently than anxiety level
setInterval(updateShakeIntensity, 1000);
setInterval(escalateAnxiety, 3000);

// Enhanced audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let gainNode = null;

function createNoise() {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = noiseBuffer;
    audioSource.loop = true;
    
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.05; // Very low volume
    
    // Add low-pass filter for rumble effect
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    
    audioSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Modulate the filter frequency for unsettling effect
    setInterval(() => {
        filter.frequency.value = 100 + Math.sin(Date.now() * 0.001) * 50;
    }, 100);
}

const toggleAudio = document.getElementById('toggle-audio');
let isPlaying = false;

if (toggleAudio) {
    toggleAudio.addEventListener('click', () => {
        if (!isPlaying) {
            if (!audioSource) {
                createNoise();
            }
            audioSource.start();
            toggleAudio.textContent = '🔊';
            isPlaying = true;
            
            // Gradually increase volume
            if (gainNode) {
                gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 10);
            }
        } else {
            if (gainNode) {
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
                setTimeout(() => {
                    audioSource.stop();
                    audioSource = null;
                    toggleAudio.textContent = '🔇';
                    isPlaying = false;
                }, 1000);
            }
        }
    });
}

// Enhanced scroll resistance
let lastScrollTop = 0;
let scrollResistance = 1;

window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - st) > 50) {
        scrollResistance = Math.min(scrollResistance + 0.1, 3);
        window.scrollTo(0, lastScrollTop + (st > lastScrollTop ? 30 : -30) / scrollResistance);
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Random glitch effects
function applyRandomGlitch() {
    const elements = document.querySelectorAll('.glitch-text, .loading-text, .error-message');
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    if (element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'textGlitch 0.5s forwards';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

setInterval(applyRandomGlitch, 5000); 