document.addEventListener('DOMContentLoaded', () => {
    const responseElement = document.getElementById('response');
    const triggerWord = 'serena';
    let recognizing = false;
    let recognition;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            recognizing = true;
            responseElement.textContent = 'Listening...';
        };

        recognition.onend = () => {
            recognizing = false;
            responseElement.textContent = 'How can I assist you?';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript.trim();
            if (transcript.toLowerCase().includes(triggerWord)) {
                handleCommand(transcript);
            }
        };

        document.body.onclick = () => {
            if (recognizing) {
                recognition.stop();
            } else {
                recognition.start();
            }
        };
    } else {
        responseElement.textContent = 'Speech recognition not supported in this browser.';
    }

    function handleCommand(command) {
        if (command.toLowerCase().includes('play')) {
            const song = command.split('play')[1].trim();
            playSpotify(song);
        } else if (command.toLowerCase().includes('take a note')) {
            takeNote();
        } else if (command.toLowerCase().includes('show me my calendar')) {
            openTeamsCalendar();
        } else if (command.toLowerCase().includes('schedule for the day')) {
            readTeamsSchedule();
        } else if (command.toLowerCase().includes('search for')) {
            const query = command.split('search for')[1].trim();
            searchWeb(query);
        } else {
            responseElement.textContent = 'Command not recognized.';
        }
    }

    async function playSpotify(songName) {
        const response = await fetch(`/spotify/play?query=${encodeURIComponent(songName)}`);
        const result = await response.json();
        responseElement.textContent = result.message;
    }

    async function takeNote() {
        const response = await fetch('/google/note');
        responseElement.textContent = 'Taking note on Google Keep.';
    }

    async function openTeamsCalendar() {
        const url = 'https://teams.microsoft.com/';
        window.open(url, '_blank');
        responseElement.textContent = 'Opening Microsoft Teams calendar.';
    }

    async function readTeamsSchedule() {
        const response = await fetch('/teams/schedule');
        const schedule = await response.json();
        responseElement.textContent = `Your schedule for the day is: ${schedule}`;
    }

    async function searchWeb(query) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
        responseElement.textContent = `Searching for ${query}.`;
    }
});
