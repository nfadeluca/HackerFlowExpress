//Audio
let audio = null
let songPlaying = null
let muted = false
let paused = true
let ended = false
let repeatCode = 0 // 0: no repeat, 1: repeat all, 2: repeat one
let volume = 0.5
let liked = false // dummy


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
function filterByGenre(songs, genres) {
    const table = document.getElementById("songs-table");
    const tr = table.getElementsByTagName("tr");

    if (songs.length > 0) {
        const filteredSongs = songs.filter(song => {
        // Check if at least one preference is true for the current song
        return Object.keys(genres).some(genre => genres[genre] && song.genre[genre]);
        });
        //console.log("Filtered Songs: ", filteredSongs)
        return filteredSongs
    } else {
        console.error("Called filterByGenre with no songs to filter (songs.lentgh <= 0)")
    }
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

    // Remove event listeners from rows and clear table
    const rowsWithListeners = document.querySelectorAll('[class^="dj-row"]');
    rowsWithListeners.forEach(row => {
        //console.log(row)
        row.removeEventListener("click", onClickSong);
    });
    table.innerHTML = '';

    // Add new header row with styles
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
            
            row.addEventListener("click", function() {
                onClickSong(song)
            })
        });
        
    });

    console.log('Table updated with with data:', djs_data, songs_data);
}

function onClickSong(song) {
    if(song) {
        localStorage.setItem("currentSong", JSON.stringify(song))
        console.log("Current song set: ", song)
        setCurrentSong()
        play()
        liked = true
        like()
    }
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

playPauseButton = document.getElementById("playPauseButton")
playPauseButton.addEventListener("click", function() {
    if(paused) {
        play()
    } else {
        pause()
    }
})

function play() {
    currentSong = localStorage.getItem("currentSong")
    if(currentSong) {
        currentSong = JSON.parse(currentSong)
        //console.log(currentSong)

        if(audio && songPlaying === currentSong.title) {
            // Resume current song
            audio.play(); 
            console.log("Resuming song")
        } else if(currentSong.filename) {
            firstSong = (audio == null)

            // Pause if another song is currently playing
            if(audio) {
                audio.pause()
            }

            // Open new Song to play
            audio = new Audio(`/assets/songFiles/${currentSong.filename}`)
            
            // Set songSlider if first song
            if (firstSong) {
                setSongSlider()
            }
            
            // Play new song
            audio.play()
            songPlaying = currentSong.title
            console.log("New song playing: ", currentSong.title)
        }

        // Unpause (only if a song is playing)
        paused = false
        playPauseButton.src = "/assets/pause-button.png"
    }
}

function pause() {
    // Play only if a song is playing
    if(audio) {
        audio.pause()

        console.log("Song paused: ", currentSong.title)

        paused = true
        playPauseButton.src = "/assets/play-button.png"
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

repeatButton = document.getElementById("repeatButton")
repeatButton.addEventListener("click", function() {
    console.log(`Changing repeat code from ${repeatCode} to ${repeatCode+1}`)
    switch (repeatCode) {
        case 0: // no repeat -> repeat all
            repeatButton.style.filter="invert(100%)"
            repeatCode = 1
            break
        case 1: // repeat all -> repeat one
            repeatButton.src = "/assets/repeatone.png"
            repeatButton.style.filter="invert(100%)"
            repeatCode = 2
            audio.addEventListener("ended", repeatOne)
            break
        case 2:  // repeat one -> no repeat
            repeatButton.src = "/assets/repeat.png"
            repeatButton.style.filter="invert(30%)"
            repeatCode = 0
            audio.removeEventListener("ended", repeatOne)
            break
    } 
})

function repeatOne() {
    audio.currentTime = 0
    audio.play()
    playPauseButton.src = "/assets/pause-button.png" // remove later
}

function setSongSlider() {
    console.log("Song Slider event listener set")
    // Update the time slider value as the audio progresses
    var timeSlider = document.getElementById("timeSlider");
    audio.addEventListener("timeupdate", function() {
        timeSlider.value = audio.currentTime
    });

      // Set the maximum value of the time slider to the duration of the audio
    audio.addEventListener("loadedmetadata", function() {
        timeSlider.max = audio.duration
        timeSlider.value = 0
    });

    // Handle the ended event to reset the audio playback position
    audio.addEventListener("ended", function() {
        audio.currentTime = 0;
        timeSlider.value = 0;
        pause()
        console.log("Song ended ")
    });

    // Update the audio playback position when the slider is changed
    timeSlider.addEventListener("input", function() {
        audio.currentTime = timeSlider.value
    });
}


// Event listener for the queue icon
document.getElementById("queue-icon").addEventListener("click", function() {
    var queuePopup = document.getElementById("queuePopup");
    if (queuePopup.style.display === "block") {
        queuePopup.style.display = "none";
    } else {
        queuePopup.style.display = "block";
    }
});

likeButton = document.getElementById("likeButton")
numLikes = document.getElementById("num-likes")
likeButton.addEventListener("click", like)

function like() {
    n = parseInt(numLikes.textContent)
    if (liked) {
        likeButton.src = "/assets/not-liked.png"
        numLikes.textContent = `${n-1}`
        liked = false
    } else {
        likeButton.src = "/assets/liked.png"
        numLikes.textContent = `${n+1}`
        liked = true
    }
}

// function updateLike(numLikes) {
//     fetch(``)
// }
