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
//https://stackoverflow.com/questions/52697055/how-to-use-sessionstorage-for-a-webpage-for-a-login-user
function exitGame(){
    if(confirm('Are you sure you want to exit?')) {
        sessionStorage.removeItem("user");
        window.location.href = "login.html";
    }
}