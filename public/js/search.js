let djs = [];
let songs = [];
let events = [];

// Fetch DJs from the server
fetch('/api/djs').then(response => response.json()).then(data => {
    djs = data;
});

// Fetch songs from the server
fetch('/api/songs').then(response => response.json()).then(data => {
    songs = data;
});

// Fetch events from the server
fetch('/api/events').then(response => response.json()).then(data => {
    events = data;
});

document.getElementById('search').addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
    searchAndDisplaySongs(event, 'search-results');
});

function searchAndDisplaySongs(event, elementID) {
    const searchTerm = event.target.value.toLowerCase();
    const matchedSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm));
    displaySongs(matchedSongs, elementID);
}

function displaySongs(matchedSongs, elementID) {
    const songList = document.getElementById(elementID);
    songList.innerHTML = ''; // Clear the current list

    matchedSongs.forEach(song => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');

        input.type = 'checkbox';
        input.id = `song${song.songID}`;
        input.name = 'selected-songs';
        input.value = song.songID;

        label.htmlFor = input.id;
        label.innerText = song.title;

        li.appendChild(input);
        li.appendChild(label);
        songList.appendChild(li);
    });
}