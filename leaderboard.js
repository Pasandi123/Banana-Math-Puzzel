import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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

function loadLeaderboard() {
    const leaderboardTable = document.getElementById("leaderboardTable");
    leaderboardTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    const leaderboardQuery = ref(db, "/");

    get(leaderboardQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    console.log("User data:", userData); // Debugging log
                    Object.values(userData).forEach((user) => {
                        if (user && user.username && user.score !== undefined) {
                            users.push({
                                username: user.username,
                                score: user.score,
                                email: user.email
                            });
                        }
                    });
                });
                users.sort((a, b) => b.score - a.score);

                if (users.length === 0) {
                    leaderboardTable.innerHTML = "<tr><td colspan='4'>No scores available</td></tr>";
                    return;
                }

                leaderboardTable.innerHTML = users.map((user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.score}</td>
                        <td>${user.email}</td>
                    </tr>
                `).join("");
            } else {
                leaderboardTable.innerHTML = "<tr><td colspan='4'>No scores available</td></tr>";
            }
        })
        .catch((error) => {
            console.error("Error loading leaderboard:", error);
            leaderboardTable.innerHTML = "<tr><td colspan='4'>Error loading leaderboard</td></tr>";
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadLeaderboard();
    } else {
        alert("You are not logged in.");
        window.location.href = "login.html";
    }
});
