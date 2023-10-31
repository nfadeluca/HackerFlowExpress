// Mock data fetch
let djs = [];
let songs = [];

// Fetch DJs and Songs
fetch('/api/djs').then(response => response.json()).then(data => {
    djs = data;
    populateDJDropdown();
});

fetch('/api/songs').then(response => response.json()).then(data => {
    songs = data;
});

function populateDJDropdown() {
    const djSelect = document.getElementById('dj-playlist-select');
    djs.forEach(dj => {
        const option = document.createElement('option');
        option.value = dj.djID;
        option.innerText = dj.name;
        djSelect.appendChild(option);
    });
}

document.getElementById('add-song-btn').addEventListener('click', function () {
    const selectedSongs = document.querySelectorAll('#add-dj-song-list input[name="selected-songs"]:checked');
    const selectedDJID = document.getElementById('dj-playlist-select').value;
    
    selectedSongs.forEach(input => {
        const songID = parseInt(input.value);
        const song = songs.find(s => s.songID === songID);
        
        if (song) {
            const dj = djs.find(dj => dj.djID === parseInt(selectedDJID));
            if (dj && !dj.songs.includes(song.songID)) {
                dj.songs.push(song.songID);
                console.log(`${song.title} added to ${dj.name}'s playlist.`);
            }
        }
    });
});

document.getElementById('add-song-to-dj').addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
    searchAndDisplaySongs(event, 'add-dj-song-list');
});

document.getElementById('theme-song-input').addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
    searchAndDisplaySongs(event, 'add-theme-song-list');
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

function displayDJSongs(dj) {
    const djSongsList = document.getElementById('dj-songs-list');
    djSongsList.innerHTML = '';  // Clear current list

    if(dj.songs.length === 0) {
        const li = document.createElement('li');
        li.innerText = 'No songs in playlist';
        djSongsList.appendChild(li);
        return;
    }

    dj.songs.forEach(songID => {
        const song = songs.find(s => s.songID === songID);
        if (song) {
            const li = document.createElement('li');
            li.innerText = song.title;
            djSongsList.appendChild(li);
        }
    });
}

// Listen for changes on the DJ dropdown
document.getElementById('dj-playlist-select').addEventListener('change', function() {
    const selectedDJID = this.value;
    const dj = djs.find(dj => dj.djID === parseInt(selectedDJID));
    if (dj) {
        displayDJSongs(dj);
    }
});

function updateDJOnServer(dj) {
    // Create a fetch request to update the DJ on the server
    fetch('/api/djs', {  // Update this endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dj) // Send the updated DJ object to the server
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Successfully updated DJ on server.');
        } else {
            console.error('Error updating DJ:', data.error);
        }
    });
}

document.getElementById('add-song-btn').addEventListener('click', function () {
    const selectedSongs = document.querySelectorAll('#add-dj-song-list input[name="selected-songs"]:checked');
    const selectedDJID = document.getElementById('dj-playlist-select').value;
    
    selectedSongs.forEach(input => {
        const songID = parseInt(input.value);
        const song = songs.find(s => s.songID === songID);
        
        if (song) {
            const dj = djs.find(dj => dj.djID === parseInt(selectedDJID));
            if (dj && !dj.songs.includes(song.songID)) {
                dj.songs.push(song.songID);
                console.log(`${song.title} added to ${dj.name}'s playlist.`);
            }
        }
    });

    const selectedDJ = djs.find(dj => dj.djID === parseInt(selectedDJID));
    if (selectedDJ) {
        displayDJSongs(selectedDJ);
        updateDJOnServer(selectedDJ); // Update the DJ data on the server
    }
});

