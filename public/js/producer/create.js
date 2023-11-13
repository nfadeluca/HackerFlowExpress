// Fetch data from the JSON files
let songs = [];
let djs = [];
let timeslots = [];

// Fetch DJs from the server
fetch('/api/djs')
  .then(response => response.json())
  .then(data => {
    djs = data;
    populateDJs(); // Populate the DJ dropdown once the data is fetched
  });

// Fetch songs from the server
fetch('/api/songs')
  .then(response => response.json())
  .then(data => {
    songs = data;
  });

// Fetch timeslots from the server
fetch('/api/timeslots')
  .then(response => response.json())
  .then(data => {
    timeslots = data;
    populateTimeSlots(); // Populate the time slot dropdown once the data is fetched
  });


// Function to populate DJ dropdown
function populateDJs() {
  const djSelect = document.getElementById('dj-select');
  djs.forEach(dj => {
    const option = document.createElement('option');
    option.value = dj.djID;
    option.innerText = dj.name;
    djSelect.appendChild(option);
  });
}

// Function to populate time slots
function populateTimeSlots() {
  const timeslotSelect = document.getElementById('time-slot');
  timeslots.forEach(timeslot => {
    const option = document.createElement('option');
    option.value = timeslot.slot;
    option.innerText = timeslot.slot;
    timeslotSelect.appendChild(option);
  });
}

// Search songs
document.getElementById('song-search').addEventListener('input', function (event) {
  event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
  const searchTerm = event.target.value.toLowerCase();

  // Filter out songs based on the search term and DJ's song list
  const selectedDJID = parseInt(document.getElementById('dj-select').value);
  const dj = djs.find(dj => dj.djID === selectedDJID);
  
  const matchedSongs = songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm) && dj.songs.includes(song.songID)
  );

  displaySongs(matchedSongs);
});

// Function to display matched songs
function displaySongs(matchedSongs) {
  const songList = document.getElementById('song-list');
  songList.innerHTML = ''; // Clear the current list

  const selectedDJID = parseInt(document.getElementById('dj-select').value);
    const dj = djs.find(dj => dj.djID === selectedDJID);
    
    const filteredSongs = matchedSongs.filter(song => dj.songs.includes(song.songID));

  filteredSongs.forEach(song => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'checkbox';
    input.id = `song${song.songID}`;
    input.name = 'selected-songs';
    input.value = song.title;

    label.htmlFor = input.id;
    label.innerText = song.title;

    li.appendChild(input);
    li.appendChild(label);
    songList.appendChild(li);
  });
}

function addEventToDJ() {
  const selectedDJID = document.getElementById('dj-select').value;
  const selectedTimeSlot = document.getElementById('time-slot').value;
  const selectedSongElements = document.querySelectorAll('#song-list input[name="selected-songs"]:checked');
  const selectedSongs = Array.from(selectedSongElements).map(element => element.value);

  fetch(`/api/djs/${selectedDJID}/addevent`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          time: selectedTimeSlot,
          songs: selectedSongs
      }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          document.getElementById('message').innerText = 'Event successfully created!';
      } else {
          // Handle the error
          console.error('Error:', data.message);
      }
  })
  .catch(error => console.error('Error:', error));
}

document.getElementById('add-event-to-dj-btn').addEventListener('click', function() {
  addEventToDJ();
});

document.getElementById('dj-select').addEventListener('change', function () {
  // Trigger a search again to filter songs based on the new DJ selection
  const searchTerm = document.getElementById('song-search').value.toLowerCase();
  const matchedSongs = songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm)
  );
  displaySongs(matchedSongs);
});

