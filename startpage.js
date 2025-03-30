function startGame() {
    window.location.href = 'levelpage.html';
    alert(`Choose Difficulty Level`);
}

function profile() {
    window.location.href = 'profile.html';
    alert(`Successfully Open User Profile`);
}

function leaderBoard() {
    window.location.href = 'leaderboard.html';
    alert(`Successfully Open LeaderBoard`);
}

function exitGame(){
    if(confirm('Are you sure you want to exit?')) {
        window.close();
    }
}