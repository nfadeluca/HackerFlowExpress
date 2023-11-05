/****** GENERIC LOGIN CODE (FREE TO USE) ******/

/* Page onload:
Checks cookies and local storage. Reloads the page state if user is logged in. */
window.onload = function() {
    const cookies = document.cookie.split("; ");
    const ls = localStorage.getItem("preferences");
    console.log("(onload) Cookies: ", cookies);
    console.log("(onload) Local Storage: ", ls);
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "username") {
            const username = decodeURIComponent(value);
            console.log("(onload) ", username +" already logged in");

            // Reload page state
            reloadListener(username);
            break;
        } else {
            login();
        }
    }
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
    //window.location.href = "../index.html";
}


/****** LISTENER CODE ******/

function welcomeListener(username) {
    const userPreferences = {
        "genre": {
            "Electronic": false,
            "LoFi": false,
            "Ambient": false,
            "Classical": false
        },
        // "DJ": "" // Field set by user
    }
    const userPreferencesJSON = JSON.stringify(userPreferences);
    // Initialize preferences in local storage
    localStorage.setItem("preferences", userPreferencesJSON);
    console.log(localStorage.getItem("preferences"));
    // Display welcome user
    const text = "Hello " + username + "!";
    document.getElementById("listener-name")
    .innerHTML = text;
}

function reloadListener(username) {
    let text = "Hello " + username + "!";
    document.getElementById("listener-name").innerHTML = text;
}