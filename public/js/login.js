/****** GENERIC LOGIN CODE (FREE TO USE) ******/

/* Page onload:
Checks cookies and local storage. Reloads the page state if user is logged in. */
window.onload = function() {
    const cookies = document.cookie.split("; ");
    const ls = localStorage.getItem("preferences");
    console.log("(Window Onload) Cookies: ", cookies);
    console.log("(Window Onload) Local Storage: ", ls);
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "username") {
            const username = decodeURIComponent(value);
            console.log("(Window Onload) ", username +" already logged in");

            // Reload page state
            reloadListener(username);
            return
        }
    }
    // No cookie with username found
    login();
}

/* Login:
- Authentication information like username and password are stored in JWT (JSON Web Tokens), 
and are temporarily stored in a httpOnly cookie. This is safe and encypted.
- User Preferences are saved as an object in local storage and persists until the user logs out. T
hey are modifiable by the user. */
// Mock example of authentication without password, using a prompt (no login page yet)
function login() {
    let username; 
    // let password;
    do {
        username = prompt("Please enter your username:"); 
        if (username == null) {
            window.location.href = "/";
        }
    } while (username !== null && username.trim() === "");
    console.log(username + " tried to logged in...");

    // Username and password sent to server for verification...

    if (username) { // (note: This will work because login() will accept any non-empty string)
        // Login Success
        console.log(username +" logged in successfully");
        document.cookie = "username=" + username + "; SameSite=Lax"; // Save encrypted user session in cookie

        // Login event
        welcomeListener(username); // Listener login
    } else {
        // Login Fail
        console.log("Login Failed!") // Login failure handler or redirection to login page to be implemented
    }
}

/* Logout: clear listener data from cookies and local storage*/
function logout() {
    console.log("Logging out");
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=../pages/listerner.html; SameSite=Lax;";   
    localStorage.removeItem("preferences");
    localStorage.removeItem("currentSong");
    //window.location.href = "../index.html";
}


/****** LISTENER CODE ******/

function welcomeListener(username) {
    // Init Local Storage Preferences
    const userPreferences = {
        "genre": {
            "electronic": false,
            "lofi": false,
            "ambient": false,
            "classical": false
        },
        "DJ": "AllDJ"
    }
    const userPreferencesJSON = JSON.stringify(userPreferences);
    localStorage.setItem("preferences", userPreferencesJSON);
    console.log("Current Preferences: ", localStorage.getItem("preferences"));
    
    // Init Local Storage Current Song
    localStorage.setItem("currentSong", JSON.stringify(null))
    
    // Display welcome user
    const text = "Hello " + username + "!";
    document.getElementById("listener-name")
    .innerHTML = text;
}

// Reload and restore UI components when user returns to the page
function reloadListener(username) {
    // Reload Username
    let text = "Hello " + username + "!";
    document.getElementById("listener-name").innerHTML = text;

    // Reload Preferences
    const preferences = JSON.parse(localStorage.getItem("preferences"));
    console.log("Saved Preferences: ", preferences);

    // Restore Genre Button colors
    const buttons = document.querySelectorAll("[class^='genre-button']");
    buttons.forEach( (button, index) => {
        switch (index) {
            case 0:
                if(preferences.genre.electronic) {
                    button.style.backgroundColor = "grey";
                }
                break;
            case 1:
                if(preferences.genre.lofi) {
                    button.style.backgroundColor = "grey";
                }
                break;
            case 2:
                if(preferences.genre.ambient) {
                    button.style.backgroundColor = "grey";
                }
                break;
            case 3:
                if(preferences.genre.classical) {
                    button.style.backgroundColor = "grey";
                }
                break;
            default:
                break;
        }
    });

    // Restore DJ Selection
    const djSelector = document.getElementById("DJ");
    for (let i = 0; i < djSelector.options.length; i++) {
        if (djSelector.options[i].value === preferences.DJ) {
            djSelector.selectedIndex = i;
            break;
        }
    }

    // Restore Table and last played song
    restoreSavedTableData()
    setCurrentSong()
}
