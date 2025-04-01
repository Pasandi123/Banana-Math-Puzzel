function selectLevel1(){
    alert("Starting Level Easy!");
    window.location.href = "gamepage.html";
}

function selectLevel2(){
    alert("Starting Level Medium!");
    window.location.href = "gamepage2.html";
}
function selectLevel3(){
    alert("Starting Level Hard!");
    window.location.href = "gamepage3.html";
}

document.getElementById("gotomenu").addEventListener("click", () => {
    window.location.href="startpage.html";
});
