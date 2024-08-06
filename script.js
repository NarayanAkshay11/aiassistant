document.addEventListener('mousemove', (event) => {
    const eyes = document.querySelectorAll('.eye');
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
        const x = Math.cos(angle) * 20;
        const y = Math.sin(angle) * 20;
        eye.style.transform = `translate(${x}px, ${y}px)`;
    });
});

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    fetch('/get_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: userInput })
    })
    .then(response => response.json())
    .then(data => {
        const responseText = data.response;
        document.querySelector('.mouth').style.height = '20px';
        setTimeout(() => {
            document.querySelector('.mouth').style.height = '40px';
        }, 1000);
        alert('Tony Stark: ' + responseText);
    });
}
