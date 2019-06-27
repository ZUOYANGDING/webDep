var b1 = document.getElementById("b1");
var b2 = document.getElementById("b2");
var reset = document.getElementById("reset");
var total = parseInt(document.getElementById("total").textContent);
var numInput = document.querySelector("input");
var gameover = false;
b1.addEventListener("click", () => {
    var score1 = parseInt(document.getElementById("score_1").textContent);
    if (score1<total && !gameover) {
        score1 += 1;
        document.getElementById("score_1").textContent = score1.toString();
    }
    if (score1 == total){
        document.getElementById("score_1").classList.add("green");
        gameover = true;
    }
});

b2.addEventListener("click", () => {
    var score2 = parseInt(document.getElementById("score_2").textContent);
    if (score2<total && !gameover) {
        score2 += 1;
        document.getElementById("score_2").textContent = score2.toString();
    }
    if (score2 == total){
        document.getElementById("score_2").classList.add("green");
        gameover = true;
    }
});

reset.addEventListener("click", () => {
    document.getElementById("score_1").textContent = "0";
    document.getElementById("score_2").textContent = "0";
    document.getElementById("score_1").classList.remove("green");
    document.getElementById("score_2").classList.remove("green");
    gameover = false;
});

numInput.addEventListener("change", () => {
    var input= numInput.valueAsNumber;
    if (input <= 0){
        alert("Please enter a valid round number!");
    } else {
        total = numInput.valueAsNumber;
        document.getElementById("total").textContent = total.toString();
    }
});