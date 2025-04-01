function selectLevel(easyButton){
    alert(`Starting Level ${easyButton}!`);
    window.location.href = `gamepage.html?button=${easyButton}`;
}

function selectLevel(mediumButton){
    alert(`Starting Level ${mediumButton}!`);
    window.location.href = `gamepage2.html?button=${mediumButton}`;
}

function selectLevel(hardButton){
    alert(`Starting Level ${hardButton}!`);
    window.location.href = `gamepage3.html?button=${hardButton}`;
}

document.getElementById("gotomenu").addEventListener("click", () => {
    window.location.href="startpage.html";
});
