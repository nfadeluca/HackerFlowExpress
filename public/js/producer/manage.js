// Mock data fetch
let djs = [];
let songs = [];
let events = [];

// Fetch DJs from the server
fetch('/api/djs').then(response => response.json()).then(data => {
    djs = data;
    populateDJDropdown();
});

// Fetch songs from the server
fetch('/api/songs').then(response => response.json()).then(data => {
    songs = data;
});

// Fetch events from the server
fetch('/api/events').then(response => response.json()).then(data => {
    events = data;
    populateEventDropdown();
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

function populateEventDropdown() {
    const eventSelect = document.getElementById('event-select');
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.innerText = `${event.dj} (${event.timeslot})`;
        eventSelect.appendChild(option);
    });
}

function displayDJEvents(dj) {
    const djEventsList = document.getElementById('dj-events-list');
    djEventsList.innerHTML = '';  // Clear current list

    if (!dj.events || dj.events.length === 0) {
        const li = document.createElement('li');
        li.innerText = 'No events scheduled';
        djEventsList.appendChild(li);
        return;
    }

    dj.events.forEach(event => {
        const li = document.createElement('li');

        const djName = document.createElement('p');
        djName.innerText = `DJ: ${event.dj}`;
        li.appendChild(djName);

        const timeSlot = document.createElement('p');
        timeSlot.innerText = `TIME: ${event.time}`;
        li.appendChild(timeSlot);

        const songList = document.createElement('p');
        songList.innerText = `SONGS: ${event.songs.join(', ')}`;
        li.appendChild(songList);

        djEventsList.appendChild(li);
    });
}

document.getElementById('dj-playlist-select').addEventListener('change', function() {
    const selectedDJID = this.value;
    const dj = djs.find(dj => dj.djID === parseInt(selectedDJID));
    if (dj) {
        displayDJSongs(dj);
        displayDJEvents(dj);
    }
});

document.getElementById('add-song-btn').addEventListener('click', function () {
    const selectedSongs = document.querySelectorAll('#add-dj-song-list input[name="selected-songs"]:checked');
    const selectedDJID = document.getElementById('dj-playlist-select').value;
    
    selectedSongs.forEach(input => {
        const songID = parseInt(input.value);
        addSongToDJ(songID, selectedDJID);
    });
});

document.getElementById('add-song-to-dj').addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
    searchAndDisplaySongs(event, 'add-dj-song-list');
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
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'delete-song-btn';
            deleteButton.onclick = function() {
                deleteSongFromDJ(song.songID, dj.djID);
            };
            li.innerText = song.title;
            li.appendChild(deleteButton);
            djSongsList.appendChild(li);
        }
    });
}

function addSongToDJ(songID, djID) {
    fetch(`/api/djs/${djID}/addsong`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songID }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayDJSongs(data.updatedDJ);
        } else {
            console.error('Error adding song:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteSongFromDJ(songID, djID) {
    fetch(`/api/djs/${djID}/deletesong`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songID }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayDJSongs(data.updatedDJ);
        } else {
            console.error('Error deleting song:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
