import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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

let correctSolution = null;
let score = 0;
let timeLeft = 30;
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
    timeLeft = 30;
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
        score += 10;
        document.getElementById("score").textContent = `Score: ${score}`;
        document.getElementById("nextButton").style.display = "inline";
    }else{
        dropBanana();
    }
}

document.getElementById("toggleMusicButton").addEventListener("click", function() {
    const music = document.getElementById("backgroundMusic");
    if (music.muted){
        music.muted = false;
        this.textContent = "Mute Music";
    }else{
        music.muted = true;
        this.textContent = "Unmute Music";
    }
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

window.onload = fetchPuzzle;