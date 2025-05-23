//code was writting with the help of chatGPT
//https://firebase.google.com/docs/web/setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCUmHXH1AOact926P2GNAtDY_sbIvCpY0",
    authDomain: "bananagame-4f75b.firebaseapp.com",
    databaseURL: "https://bananagame-4f75b-default-rtdb.firebaseio.com/",
    projectId: "bananagame-4f75b",
    storageBucket: "bananagame-4f75b.firebasestorage.app",
    messagingSenderId: "641695960260",
    appId: "1:641695960260:web:f1d54dba8d12a65fc44d91",
    measurementId: "G-58HYY7SW1C"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let correctSolution = null;
let score = 0;
let timeLeft = 20;
let timer;
let questionCount = 0;
const maxQuestions = 5;
let boyPosition = 0;
const stepSize = 100;

onAuthStateChanged(auth, async (user) => {
    if(user) {
        try {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get (userRef);
            if(snapshot.exists() && snapshot.val().username) {
                document.getElementById("usernameDisplay").textContent = `welcome, ${snapshot.val().username}!`;
            }else{
                document.getElementById("usernameDisplay").textContent = `welcome, Player!`;
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            document.getElementById("usernameDisplay").textContent = `Welcome, Player!`;
        }
    }else{
        window.location.href = "login.html";
    }
});

function fetchPuzzle(){
    if (questionCount >= maxQuestions){
        endGame(`Congratulations! You reached the flag! Your Score: ${score}`);
        moveBoyToFlag();
        updateUserScore();
        return;
    }
//https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
    fetch("https://marcconrad.com/uob/banana/api.php")
    .then(response => response.json())
    .then(data => {
        document.getElementById("puzzleImage").src = data.question;
        correctSolution = data.solution;
        document.getElementById("feedback").textContent = "";
        document.getElementById("answerInput").value = "";
        document.getElementById("nextButton"). style.display = "none";
        startTimer();
    })
    .catch(() => {
        document.getElementById("feedback").textContent = "Failed to load puzzle.";
    });
}

function startTimer(){
    clearInterval(timer);
    timeLeft = 20;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame("Time's up! Try again.");
            updateUserScore();
        }
    }, 1000);
}

function moveBoy(){
    boyPosition += stepSize;
    document.getElementById("boy").style.left = `${boyPosition}px`;
    document.getElementById("banana").style.left = `${boyPosition + 40}px`;
}

function moveBoyToFlag() {
    document.getElementById("boy").style.left = "450px";
    document.getElementById("banana").style.left ="490px";
}

function dropBanana() {
    const banana = document.getElementById("banana");
    banana.style.bottom = "50px";
    setTimeout(() => {
        endGame("A Banana fell down! Game Over.");
        updateUserScore();
    }, 500);
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    if(isNaN(userAnswer)) {
        document.getElementById("feedback").textContent = "Enter a valid number!";
        return;
    }
    if(userAnswer === correctSolution) {
        moveBoy();
        questionCount++;
        score += 20;
        document.getElementById("score").textContent = `Score: ${score}`;
        document.getElementById("nextButton").style.display = "inline";
    }else{
        dropBanana();
    }
}
//https://stackoverflow.com/questions/66528033/set-cookie-for-mute-unmute-sound-in-website
document.getElementById("toggleMusicButton").addEventListener("click", function() {
    const music = document.getElementById("backgroundMusic");
    if (music.muted){
        music.muted = false;
        this.textContent = "Mute Music";
        setCookie('musicMuted', 'false', 365);
    }else{
        music.muted = true;
        this.textContent = "Unmute Music";
        setCookie('musicMuted', 'true', 365);
    }
});

document.getElementById("backButton").addEventListener("click", function() {
    window.location.href = "levelpage.html";
});

document.getElementById("checkButton").addEventListener("click", checkAnswer);
document.getElementById("nextButton").addEventListener("click",fetchPuzzle);

document.getElementById("gameOverScreen").style.display = "none";

document.querySelector(".gameOverButton[onclick='startNewGame()']").addEventListener("click", startNewGame);

function startNewGame() {
    fetchPuzzle();
    score = 0;
    questionCount = 0;
    boyPosition = 0;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("boy").style.left = `${boyPosition}px`;
    document.getElementById("banana").style.left = `${boyPosition + 40}px`;
    document.getElementById("banana").style.bottom = "100px";
    document.getElementById("feedback").textContent = "";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("checkButton").disabled = false;
    document.getElementById("answerInput").value = "";
    fetchPuzzle();
}

document.querySelector(".gameOverButton[onclick = 'changeLevel()']").addEventListener("click", function () {
    window.location.href = "levelpage.html";
});

function endGame(message) {
    clearInterval(timer);
    document.getElementById("gameOverMessage").textContent=message;
    document.getElementById("gameOverScreen").style.display="block";
}

async function updateUserScore() {
    const user = auth.currentUser;
    if(user){
        try{
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get (userRef);
            let currentScore = 0;
            if(snapshot.exists() && snapshot.val().score){
                currentScore = snapshot.val().score;
            }
            await update(userRef, {
                score: currentScore + score
            });
            console.log("Score updated successfully.");
        }catch(error){
            console.error("Error updating score:", error);
        }
    }
}
//https://stackoverflow.com/questions/50041235/create-cookie-for-audio-play-mute-setting
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.onload = function() {
    const musicPreference = getCookie('musicMuted');
    if (musicPreference === 'true') {
        document.getElementById("backgroundMusic").muted = true;
        document.getElementById("toggleMusicButton").textContent = "Unmuted Music";
    }else{
        document.getElementById("backgroundMusic").muted = false;
        document.getElementById("toggleMusicButton").textContent = "Mute Music";
    }
    fetchPuzzle();
};
//https://stackoverflow.com/questions/16351737/log-out-automatically-when-there-is-no-use-of-keyboard-or-mouse
//https://stackoverflow.com/questions/9462497/javascript-cleartimeout-not-clearing-timeout-this-shouldnt-be-hard
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

