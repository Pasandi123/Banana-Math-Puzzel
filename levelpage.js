function selectLevel(button){
    alert(`Starting Level ${button}!`);
    window.location.href = `gamepage.html?button=${button}`;
}

document.getElementById("gotomenu").addEventListener("click", () => {
    window.location.href="startpage.html";
});
