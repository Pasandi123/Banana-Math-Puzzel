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

function loadLeaderboard(){
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = "<tr><td colspan='4'>Loading...</td><tr>";

    const leaderboardQuery = ref(db, "/users");

    get(leaderboardQuery)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const users = [];
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                console.log("User data:", userData);

                if(userData && userData.username && userData.score !== undefined){
                    users.push({
                        username:userData.username,
                        score: userData.score,
                        email: userData.email
                    });
                }
            });

            users.sort((a,b) => b.score - a.score);

            if(users.length === 0 ) {
                leaderboardBody.innerHTML = "<tr><td colspan='4'>No scores available</td></tr>";
                return;
            }

            leaderboardBody.innerHTML = users.map((user, index) => `
            <tr>
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.score}</td>
            <td>${user.email}</td>
            </tr>
            `).join("");
        } else {
            leaderboardBody.innerHTML = "<tr><td colspan='4'>No score available</td></tr>";
        }
    })
    .catch((error) => {
        console.error("Error loading leaderboard:", error);
        leaderboardBody.innerHTML = "<tr><td colspan = '4'>Error loading leaderboard</td></tr>";
    });
}

document.getElementById("menu-btn").addEventListener("click", () => {
    window.location.href = "startpage.html";
});

document.getElementById("play-btn").addEventListener("click", () => {
    window.location.href = "gamepage.html";
});

onAuthStateChanged(auth, (user) => {
    if(user) {
        loadLeaderboard();
    }else{
        alert("You are not logged in.");
        window.location.href = "login.html";
    }
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
