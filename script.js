const face = document.getElementById('tony-face');
const leftEye = document.getElementById('left-eye');
const rightEye = document.getElementById('right-eye');
const upperLip = document.getElementById('upper-lip');
const lowerLip = document.getElementById('lower-lip');
const muteButton = document.getElementById('mute-button');
const statusElement = document.getElementById('status');

let isMuted = false;
let isSpeaking = false;

// Eye movement
document.addEventListener('mousemove', (e) => {
    const rect = face.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const angle = Math.atan2(y, x);
    const distance = Math.min(Math.sqrt(x*x + y*y) / 5, 10);

    const eyeX = Math.cos(angle) * distance;
    const eyeY = Math.sin(angle) * distance;

    leftEye.querySelector('.pupil').style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    rightEye.querySelector('.pupil').style.transform = `translate(${eyeX}px, ${eyeY}px)`;
});

// Mouth animation
function speak(text) {
    if (isSpeaking) return;
    isSpeaking = true;
    const duration = text.length * 50;  // Adjust speaking duration based on text length
    const startTime = Date.now();

    function animateMouth() {
        const progress = (Date.now() - startTime) / duration;
        if (progress >= 1) {
            isSpeaking = false;
            upperLip.style.transform = 'translateY(0)';
            lowerLip.style.transform = 'translateY(0)';
            return;
        }

        const openness = Math.sin(progress * Math.PI * 8) * 10;
        upperLip.style.transform = `translateY(-${openness}px)`;
        lowerLip.style.transform = `translateY(${openness}px)`;

        requestAnimationFrame(animateMouth);
    }

    animateMouth();

    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male') || speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
}

// Mute button functionality
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
    if (isMuted) {
        speechSynthesis.cancel();
    }
});

// Speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    processInput(text);
};

recognition.onend = () => {
    if (!isMuted) {
        recognition.start();
    }
};

recognition.start();

// Simple AI model (using compromise.js for basic NLP)
function processInput(input) {
    const doc = nlp(input.toLowerCase());
    let response = "I'm sorry, I didn't understand that.";

    if (doc.has('hello') || doc.has('hi')) {
        response = "Hello! I'm Tony Stark's AI assistant. How can I help you today?";
    } else if (doc.has('how are you')) {
        response = "I'm functioning at optimal levels, thanks for asking!";
    } else if (doc.has('what') && doc.has('your name')) {
        response = "I'm Tony Stark's AI assistant. You can call me JARVIS if you'd like.";
    } else if (doc.has('joke')) {
        response = "Why don't scientists trust atoms? Because they make up everything!";
    } else if (doc.has('weather')) {
        response = "I'm sorry, I don't have access to real-time weather data. You might want to check a weather app for that information.";
    } else if (doc.has('bye') || doc.has('goodbye')) {
        response = "Goodbye! It was a pleasure assisting you.";
    }

    speak(response);
    statusElement.textContent = `You said: ${input}`;
}
