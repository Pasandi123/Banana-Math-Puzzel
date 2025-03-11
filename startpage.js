function startGame() {
    window.location.href = 'levelpage.html';
    alert(`Choose Difficulty Level`);
}
function exitGame(){
    if(confirm('Are you sure you want to exit?')) {
        window.close();
    }
}