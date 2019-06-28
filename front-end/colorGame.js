var nums = 6;
var colors = generateColors(nums);
var squares = document.querySelectorAll(".square");
var colorSelect = document.getElementById("colorSelect");
var colorPick = pickColor();
colorSelect.textContent = colorPick;
var answer = document.getElementById("answer");
var h1 = document.querySelector("h1");
var reset = document.querySelector("#reset");
var easyBt = document.querySelector("#easy");
var hardBt = document.querySelector("#hard");

easyBt.addEventListener("click", function() {
    nums = 3;
    resetParams();
    reset.textContent = "Reset";
    easyBt.classList.add("modselect");
    hardBt.classList.remove("modselect");
    for (var i=0; i<squares.length; i++) {
        if (colors[i]) {
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
});

hardBt.addEventListener("click", function() {
    nums = 6;
    resetParams();
    reset.textContent = "Reset";
    easyBt.classList.remove("modselect");
    hardBt.classList.add("modselect");
    for (var i=0; i<squares.length; i++) {
        squares[i].style.backgroundColor = colors[i];
        squares[i].style.display = "block";
    }
});


reset.addEventListener("click", function() {
    // reset some parameters
    resetParams();
    this.textContent = "Reset";
    // reset colors in all squares
    for (var i=0; i<squares.length; i++) {
        squares[i].style.backgroundColor = colors[i];
    }
});

for (var i=0; i<squares.length; i++) {
    squares[i].style.backgroundColor = colors[i];
    
    squares[i].addEventListener("click", function() {
        var c = this.style.backgroundColor;
        console.log(c);
        console.log(colorPick);
        if (c === colorPick) {
            answer.textContent = "Correct";
            setColor(colorPick);
            h1.style.background = colorPick;
            reset.textContent = "Play again?"
        } else {
            answer.textContent = "Try again"
            this.style.backgroundColor = "#232323";
        }
    });
}

// set the color to all squares
function setColor(color) {
    for (var i=0; i<squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

// pick random colors from colors array
function pickColor() {
    var index = Math.floor(Math.random() * nums);
    return colors[index];
}

// generate the colors array
function generateColors(n) {
    var arr = [];
    for (var i=0; i<n; i++) {
        arr.push(randomColor());
    }
    return arr;
}

// random rgb color
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return ("rgb(" + r + ", " + g + ", " + b + ")");
}

// reset some parameters
function resetParams () {
    // regenerate colors
    colors = generateColors(nums);
    // repick color
    colorPick = pickColor();
    // reset other parameters
    colorSelect.textContent = colorPick;
    h1.style.backgroundColor = "steelblue";
    answer.textContent="";
}