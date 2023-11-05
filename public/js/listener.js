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

function selectGenre() {
    const buttons = document.querySelectorAll("[class^='genre-button']");

    // Event Listener: change preference according to button color and index
    buttons.forEach(function(button, index) {
        button.addEventListener("click", function() {
            const preferences = JSON.parse(localStorage.getItem("preferences"));
            //console.log(preferences);
            // Turn off genre preference, button switches to black
            if (button.style.backgroundColor === "grey") {
                button.style.backgroundColor = "#1a1a1a";
                switch(index) {
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
                button.style.backgroundColor = "grey"
                //console.log("A genre was selected");
                switch(index) {
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
            localStorage.setItem("preferences", JSON.stringify(preferences));
            console.log("Selected Preferences: ", preferences.genre);
        });
    });
}

function selectDJ() {
    const djSelect = document.getElementById("DJ");
    // Event Listener: change the DJ preference
    djSelect.addEventListener("change", function () {
        const preferences = JSON.parse(localStorage.getItem("preferences"));
        preferences.DJ = djSelect.value; // new property

        localStorage.setItem("preferences", JSON.stringify(preferences));
        console.log("Selected DJ: ", preferences.DJ);
        console.log(preferences);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Display searched songs
function searchSong(song) {
    console.log("Searching a song '" + song + "'...")
    filterTable();
    // Get Preferences
    // Call server API
    // Display Table
}

function filterTable() {
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


function renderTable(preferences) {
    const songs = loadSongsFromJson(); // Load songs from JSON file
    const filteredSongs = filterSongsByGenre(songs, preferences);
    const table = document.getElementById('songs-table'); // Assuming you have an id on your table

    // Clear the existing table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Add rows for filtered songs
    filteredSongs.forEach(song => {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        // Customize your table cell content here, e.g., cell1.innerHTML = song.artist;
        // cell2.innerHTML = song.title;
    });
}





selectGenre();
selectDJ();