var rectangle = require('./rect');

function solveRect (a, b) {
    // if (a<=0 || b<=0){
    //     console.log("length must large then zero");
    // } else {
    //     console.log("perimeter is ", rect.perimeter(a, b));
    //     console.log("area is ", rect.area(a, b));
    // }
    console.log("start to comput the area and perimeter for a " + a + " and " + b);
    rectangle(a, b, (err, rect) => {
        if (err){
            console.log(err.message);
        } else {
            console.log("a " + a + " and " + b + " perimeter is " + rect.perimeter());
            console.log("a " + a + " and " + b + " area is " + rect.area());
        }
    });
    console.log("this is after the rectangle call");
}

solveRect(1, 2);
solveRect(-1, 2);
solveRect(-4, -5);
solveRect(1, 0);
solveRect(1, -2);