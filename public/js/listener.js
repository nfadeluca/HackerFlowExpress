//Audio
let audio = null
let songPlaying = null
let muted = false
let volume = 0.5

// Handle search song form event
function validateForm(event) {
    event.preventDefault(); // prevent page refresh
    const inputField = document.getElementById("search-song");
    const errorMessage = document.getElementById("error-message");
    if (inputField.value.trim() === "") {
        errorMessage.textContent = "Please enter a song name.";
        errorMessage.style.color = "red"; 
        return false; // Prevent form submission
    }
    errorMessage.textContent = "";
    searchSong(inputField.value);
    return true; // Allow form submission
}

// Event Listener: change username
const element = document.querySelector(".change-name");
element.addEventListener("click", function() {
    let newUsername;
    do {
        newUsername = prompt("Please enter your new name:");
        if (newUsername == null) {
            return;
        }
    } while (newUsername !== null && newUsername.trim() === "");
    document.cookie = "username=" + newUsername + "; SameSite=Lax";
    document.getElementById("listener-name").innerHTML = "Hello " + newUsername + "!";
});

// Retrieve user data stored in cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Event Listener: change the DJ preference
const djSelect = document.getElementById("DJ");
djSelect.addEventListener("change", function () {
    const preferences = JSON.parse(localStorage.getItem("preferences"));
    preferences.DJ = djSelect.value; 

    localStorage.setItem("preferences", JSON.stringify(preferences));
    console.log("Selected DJ Preference: ", preferences.DJ);
    //console.log(preferences);
});

// Display searched songs
function searchSong(song) {
    console.log("Searching a song '" + song + "'...")
    filterBySearch();
}

// Show table rows matching the search input
function filterBySearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-song");
    filter = input.value.toUpperCase();
    table = document.getElementById("songs-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Show table rows that match user preferences (stored in local storage)
function filterByGenre(djs, songs, genres) {
    const table = document.getElementById("songs-table");
    const tr = table.getElementsByTagName("tr");

    if (songs.length > 0) {
        const filteredSongs = songs.filter(song => {
        // Check if at least one preference is true for the current song
        return Object.keys(genres).some(genre => genres[genre] && song.genre[genre]);
        });
        //console.log("Filtered Songs: ", filteredSongs)
        updateTableData(djs, filteredSongs);
    } // else do nothing
}

// Event Listener: Filter by DJ
const djSelector = document.getElementById("DJ");
djSelector.addEventListener("change", function () {
    const selectedDJ = djSelector.value;
    filterByDJ(selectedDJ);
});

// Show table rows that match the selected DJ
function filterByDJ(selectedDJ) {
    const djRows = document.querySelectorAll(".dj-row");

    djRows.forEach((row) => {
        const djName = row.classList[1].substring(3); 
        if (selectedDJ === "AllDJ" || selectedDJ === djName) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
}

// Recreate the table with give DJ and Song Data
function updateTableData(djs_data, songs_data) {
    const table = document.getElementById('songs-table');
    table.innerHTML = '';

    // Add header row with styles
    table.innerHTML = `
        <tr style="background-color: gray;">
            <th style="width: 35%;">DJ</th>
            <th style="width: 65%;">Songs</th>
        </tr>
    `;

    // Iterate through DJs and songs to update the table
    djs_data.forEach((dj) => {
        const djSongs = songs_data.filter(song => dj.songs.includes(song.songID));

        djSongs.forEach((song) => {
            const row = table.insertRow();

            row.innerHTML = `
                <td>
                    <img width="25" height="25" src="https://img.icons8.com/ultraviolet/40/test-account.png" alt="test-account" style="padding-right: 10px;" />
                    ${dj.name}
                </td>
                <td>${song.title}</td>
            `;

            row.classList.add(`dj-row`, `dj-${dj.name}`);

            // Make each song selectable for playing
            row.addEventListener("click", function(event) {
                currentSongTitle = document.getElementById("current-song-title")
                currentSongArtist = document.getElementById("current-song-artist")
                
                currentSongTitle.textContent = `${song.title}`
                currentSongTitle.style.fontWeight = "bold"

                currentSongArtist.textContent = `${song.artist}`
                currentSongArtist.style.fontStyle = "italic"
                
                //console.log(row)

                // Set as current song
                localStorage.setItem("currentSong", JSON.stringify(song))
                console.log("Current song set: ", song)

                // Play
                play()
            })
        });
        
    });

    //console.log('Table updated with new data:', djs_data, songs_data);
}

// Volume slider
var volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", function() {
    v = volumeSlider.value
    if(v == 0) {
        mute()
    } else if(muted) {
        volume = v
        unmute()
    } else if(audio) {
        audio.volume = v
        volume = v
    }
});

function play() {
    currentSong = localStorage.getItem("currentSong")
    if(currentSong) {
        currentSong = JSON.parse(currentSong)
        //console.log(currentSong)
        if(audio && songPlaying === currentSong.title) {
            audio.play(); // Resume current song
        } else if(currentSong.filename) {
            if(audio) {
                audio.pause() // Pause if song already playing
            }
             // Play new song
            audio = new Audio(`/assets/songFiles/${currentSong.filename}`)
            audio.play()
            songPlaying = currentSong.title
        }
    }
}

function pause() {
    if(audio) {
        audio.pause()
    }
}

volumeButton = document.getElementById("volume-icon")
volumeButton.addEventListener("click", function() {
    if(muted) {
        unmute()
    } else {
        mute()
    }
})

function mute() {
    if (audio && audio.volume > 0) {
        audio.volume = 0
    }
    volumeSlider.value = 0
    volumeButton.src = "/assets/volume-muted-icon.png"; 
    muted = true;
}

function unmute() {
    if(audio && audio.volume == 0) {
        audio.volume = volume
        volumeSlider.value = volume
    }
    volumeButton.src = "/assets/volume-icon.png"; 
    muted = false;
}