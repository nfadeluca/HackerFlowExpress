// Search song form
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

    // Change username
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

    const buttons = document.querySelectorAll("[class^='genre-button']");
    const songsTable = document.getElementById("songs-table");
    
    // Event Listener: change preference according to button color and index
    buttons.forEach(function(button, index) {
        button.addEventListener("click", function() {
            const preferences = JSON.parse(localStorage.getItem("preferences"));
    
            // Turn off genre preference, button switches to black
            if (button.style.backgroundColor === "grey") {
                button.style.backgroundColor = "#1a1a1a";
    
                // Update the genre preference to false
                switch (index) {
                    case 0:
                        preferences.genre.Electronic = false;
                        break;
                    case 1:
                        preferences.genre.LoFi = false;
                        break;
                    case 2:
                        preferences.genre.Ambient = false;
                        break;
                    case 3:
                        preferences.genre.Classical = false;
                        break;
                    default:
                        break;
                }
            } else { // Turn on genre preference, button switches to grey
                button.style.backgroundColor = "grey";
    
                // Update the genre preference to true
                switch (index) {
                    case 0:
                        preferences.genre.Electronic = true;
                        break;
                    case 1:
                        preferences.genre.LoFi = true;
                        break;
                    case 2:
                        preferences.genre.Ambient = true;
                        break;
                    case 3:
                        preferences.genre.Classical = true;
                        break;
                    default:
                        break;
                }
            }

            if (preferences.genre.Electronic || preferences.genre.LoFi || preferences.genre.Ambient || preferences.genre.Classical) {
                filterByGenre(JSON.stringify(preferences.genre));
            }
    
            localStorage.setItem("preferences", JSON.stringify(preferences));
            console.log("Selected Preferences: ", preferences.genre);

        });
    });

    function filterByGenre(genres) {
        //console.log(genres);
        const table = document.getElementById("songs-table");
        const tr = table.getElementsByTagName("tr");

        fetch(`/api/songs/findByGenre`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: genres,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //console.log("Data: ", data);
                const songs = data.songs;
                console.log("Songs: ", songs);
                if (songs.length > 0) { 
                    // filter the table by songs existing in data
                    for (let i = 0; i < tr.length; i++) {
                        const td = tr[i].getElementsByTagName("td")[1];
                        if (td) {
                            const txtValue = td.textContent || td.innerText;
                            //console.log(txtValue.trim())
                            const songExists = songs.some(song => song.title.toUpperCase() === txtValue.trim().toUpperCase());
                            //console.log(songExists);
                            tr[i].style.display = songExists ? "" : "none";
                        }
                    }
                }
            } else {
                // Handle the error
                console.error('Error:', data.message);
            }
        })
            
        
    }
    
const djSelect = document.getElementById("DJ");
// Event Listener: change the DJ preference
djSelect.addEventListener("change", function () {
    const preferences = JSON.parse(localStorage.getItem("preferences"));
    preferences.DJ = djSelect.value; // new property

    localStorage.setItem("preferences", JSON.stringify(preferences));
    console.log("Selected DJ: ", preferences.DJ);
    console.log(preferences);
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Display searched songs
function searchSong(song) {
    console.log("Searching a song '" + song + "'...")
    filterBySearch();
}

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

//const songsTable = document.getElementById("songs-table");
const djSelector = document.getElementById("DJ");

djSelector.addEventListener("change", function () {
    const selectedDJ = djSelector.value;
    const djRows = document.querySelectorAll(".dj-row");

    djRows.forEach((row) => {
        const djName = row.classList[1].substring(3); 
        if (selectedDJ === "AllDJ" || selectedDJ === djName) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });
});

function clearSearch() {
    document.getElementById("search-song"). value = "";
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    // clear table
}