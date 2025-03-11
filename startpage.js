function startGame() {
    window.location.href = 'levelpage.html';
}
function exitGame(){
    if(confirm('Are you sure you want to exit?')) {
        window.close();
    }
}