document.getElementById('search').addEventListener('click', () => {
  const query = prompt('What would you like to search for?');
  fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }).then(response => response.json())
    .then(data => alert(data.message));
});

document.getElementById('play').addEventListener('click', () => {
  const track = prompt('What track would you like to play?');
  fetch('/play', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ track })
  }).then(response => response.json())
    .then(data => alert(data.message));
});

document.getElementById('note').addEventListener('click', () => {
  const note = prompt('What would you like to note down?');
  fetch('/take-note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  }).then(response => response.json())
    .then(data => alert(data.message));
});

document.getElementById('calendar').addEventListener('click', () => {
  const calendarUrl = 'https://teams.microsoft.com';
  window.open(calendarUrl, '_blank');
});
