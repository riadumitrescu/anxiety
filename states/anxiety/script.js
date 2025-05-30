// Custom cursor with trailing effect
const cursor = document.querySelector('.cursor-overlay');
const cursorTrails = [];
const maxTrails = 5;

for (let i = 0; i < maxTrails; i++) {
    const trail = cursor.cloneNode();
    trail.style.opacity = (1 - i / maxTrails) * 0.3;
    document.body.appendChild(trail);
    cursorTrails.push(trail);
}

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Update trails with delay
    setTimeout(() => {
        cursorTrails.forEach((trail, index) => {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
        });
    }, 50 * (index + 1));
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
        
        if (distance < 100) {
            isAvoiding = true;
            avoidanceCount++;
            
            const angle = Math.atan2(mouseY - buttonCenterY, mouseX - buttonCenterX);
            const avoidDistance = 100 + (avoidanceCount * 10);
            const newX = buttonCenterX - Math.cos(angle) * avoidDistance;
            const newY = buttonCenterY - Math.sin(angle) * avoidDistance;
            
            avoidButton.style.transform = `translate(${newX - buttonCenterX}px, ${newY - buttonCenterY}px) rotate(${Math.random() * 10 - 5}deg)`;
            
            if (avoidanceCount > 5) {
                avoidButton.textContent = "You can't catch me";
            }
            
            setTimeout(() => {
                isAvoiding = false;
            }, 500);
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
        setInterval(() => {
            anxietyInput.placeholder = alternativePlaceholders[Math.floor(Math.random() * alternativePlaceholders.length)];
        }, 2000);
    });
    
    anxietyInput.addEventListener('blur', () => {
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
        submitButton.style.opacity = '0';
        
        const errorMessages = [
            "Too late.",
            "Not good enough.",
            "Try harder.",
            "You failed.",
            "Start over."
        ];
        
        setTimeout(() => {
            submitButton.textContent = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            submitButton.style.opacity = '1';
            document.body.classList.add('heavy-shake');
            setTimeout(() => document.body.classList.remove('heavy-shake'), 1000);
        }, 1000);
    });
}

// Enhanced time-based escalation
let anxietyLevel = 0;
const maxAnxietyLevel = 10;

function addShake() {
    document.body.classList.add('heavy-shake');
    setTimeout(() => {
        document.body.classList.remove('heavy-shake');
    }, 1000);
}

function escalateAnxiety() {
    anxietyLevel = Math.min(anxietyLevel + 1, maxAnxietyLevel);
    
    // Apply effects based on anxiety level
    document.body.style.filter = `contrast(${1 + anxietyLevel * 0.05})`;
    document.documentElement.style.setProperty('--anxiety-red', `hsl(0, ${50 + anxietyLevel * 5}%, 50%)`);
    
    if (anxietyLevel >= 3) {
        document.body.classList.add('light-shake');
    }
    
    if (anxietyLevel >= 6) {
        document.body.classList.remove('light-shake');
        addShake();
    }
}

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

// Enhanced cursor handling
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');

document.addEventListener('mousemove', (e) => {
    // Update outer cursor with lag
    requestAnimationFrame(() => {
        cursorOuter.style.left = e.clientX - 15 + 'px';
        cursorOuter.style.top = e.clientY - 15 + 'px';
    });
    
    // Update inner cursor immediately
    cursorInner.style.left = e.clientX - 4 + 'px';
    cursorInner.style.top = e.clientY - 4 + 'px';
});

// Add hover states for clickable elements
document.querySelectorAll('button, input, a').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursorOuter.style.transform = 'scale(1.5)';
        cursorOuter.style.mixBlendMode = 'hard-light';
    });
    
    elem.addEventListener('mouseleave', () => {
        cursorOuter.style.transform = 'scale(1)';
        cursorOuter.style.mixBlendMode = 'difference';
    });
}); 