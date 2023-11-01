// Fetch data from the JSON files
let songs = [];
let djs = [];
let timeslots = [];

fetch('/api/timeslots')
  .then(response => response.json())
  .then(data => {
    timeslots = data;
    populateTimeSlots(); // Populate the time slot dropdown once the data is fetched
  });

fetch('/api/songs')
  .then(response => response.json())
  .then(data => {
    songs = data;
  });

fetch('/api/djs')
  .then(response => response.json())
  .then(data => {
    djs = data;
    populateDJs(); // Populate the DJ dropdown once the data is fetched
  });

// Function to populate time slots
function populateTimeSlots() {
  const timeslotSelect = document.getElementById('time-slot');
  timeslots.forEach(slot => {
    const option = document.createElement('option');
    option.value = slot;
    option.innerText = slot;
    timeslotSelect.appendChild(option);
  });
}

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

// Handle form submission
document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  const djDropdown = document.getElementById('dj-select');
  const selectedDJ = djDropdown.options[djDropdown.selectedIndex].textContent;

  // Get all checked songs
  const selectedSongs = Array.from(document.querySelectorAll('#song-list input:checked'))
    .map(input => input.value);

  const selectedTimeSlot = document.getElementById('time-slot').value;

  // Validation
  if (selectedSongs.length === 0) {
    document.getElementById('message').textContent = 'Please select at least one song.';
    return;  // Exit the function to prevent submission
  }
  if (!selectedTimeSlot) {  // If timeslot is empty or not selected
    document.getElementById('message').textContent = 'Please select a timeslot.';
    return;  // Exit the function to prevent submission
  }

  const eventObj = {
    dj: selectedDJ,
    songs: selectedSongs,
    timeslot: selectedTimeSlot
  };

  fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventObj)
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('message').textContent = data.message;
    })
    .catch(error => {
      console.error('Error:', error);
    });
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

document.getElementById('add-event-to-dj-btn').addEventListener('click', function() {
  addEventToDJ();
});

function addEventToDJ() {
  // Get the selected timeslot, songs, and DJ details
  const selectedTimeSlot = document.getElementById('time-slot').value;
  const selectedDJID = parseInt(document.getElementById('dj-select').value);
  const selectedDJName = document.getElementById('dj-select').options[document.getElementById('dj-select').selectedIndex].textContent;
  const selectedSongs = Array.from(document.querySelectorAll('#song-list input:checked'))
    .map(input => input.value);

  // Create the new event object
  const newEvent = {
    dj: selectedDJName,
    time: selectedTimeSlot,
    songs: selectedSongs
  };

  // Find the selected DJ by ID
  const dj = djs.find(dj => dj.djID === selectedDJID);

  // Add the new event to the DJ's events array
  if (dj) {
    dj.events.push(newEvent);
    console.log(`Event added to ${dj.name}'s event list.`);
    updateDJOnServer(dj);  // Update the DJ on the server side
  }
}

document.getElementById('dj-select').addEventListener('change', function () {
  // Trigger a search again to filter songs based on the new DJ selection
  const searchTerm = document.getElementById('song-search').value.toLowerCase();
  
  const matchedSongs = songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm)
  );

  displaySongs(matchedSongs);
});

