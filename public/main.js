document.addEventListener('DOMContentLoaded', function () {
    const responseElement = document.getElementById('response');
    const triggerWord = "serena";
    let recognizing = false;
    let speechRecognition;

    async function initializeSpeechRecognition() {
        const recognizer = speechCommands.create(
            'BROWSER_FFT',
            null,
            'https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.3/browser_fft/18w/model.json',
            'https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.3/browser_fft/18w/metadata.json'
        );

        await recognizer.ensureModelLoaded();
        speechRecognition = recognizer.createTransfer(triggerWord);
        await speechRecognition.collectExample('serena');

        recognizer.listen(result => {
            const words = recognizer.wordLabels();
            const recognizedWord = words[result.scores.indexOf(Math.max(...result.scores))];

            if (recognizedWord === triggerWord) {
                recognizing = !recognizing;
                responseElement.textContent = recognizing ? "I'm listening..." : "How can I assist you?";
            }
        }, { probabilityThreshold: 0.75 });
    }

    initializeSpeechRecognition();

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
