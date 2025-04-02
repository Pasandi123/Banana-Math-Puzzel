import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIajj3vQed9DndpqovRZdNZOUr8R6zUn8",
    authDomain: "bananamathpuzzel.firebaseapp.com",
    projectId: "bananamathpuzzel",
    storageBucket: "bananamathpuzzel.appspot.com",
    messagingSenderId: "317182880009",
    appId: "1:317182880009:web:55e4f7f5a0eca2641c0bd8",
    measurementId: "G-GWM46LSVEK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const usernameDisplay = document.getElementById("profile-username");
const emailDisplay = document.getElementById("profile-email");
const scoreDisplay = document.getElementById("profile-score");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                usernameDisplay.textContent = data.username || "Unknown User";
                emailDisplay.textContent = data.email || "No Email";
                scoreDisplay.textContent = data.score || 0;
            } else {
                usernameDisplay.textContent = "User not found";
                emailDisplay.textContent = "N/A";
                scoreDisplay.textContent = "0";
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    } else {
        window.location.href = "login.html";
    }
});

document.getElementById("menu-btn").addEventListener("click", () => {
    window.location.href = "startpage.html";
});

document.getElementById("play-again-btn").addEventListener("click", () => {
    window.location.href = "gamepage.html";
});

let inactivityTimer;
const inactivityTimeout = 1 * 60 * 1000;

function resetInactivityTimer(){
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutUser, inactivityTimeout);
}

function logoutUser(){
    alert("You have been logged out due to inactivity.");
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Error during automatic logout:", error);
    });
}

window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("keypress", resetInactivityTimer);
window.addEventListener("click", resetInactivityTimer);
window.addEventListener("touchstart", resetInactivityTimer);

resetInactivityTimer();
