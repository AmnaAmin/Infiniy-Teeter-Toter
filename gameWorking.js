// data set starts
let cSawSupport;
let cSaw; // shape of weight balancer
let bigMass; 
let degree = 0;
let smMass = []; // list of small masses
let i = -1; // for rotaion in smMass array
let totalWeight = 0;
let colors = ['red', 'yellow', 'green']
let shapes = ['box', 'circle']
let weights = [30, 20, 10]
let winText = ''
// alert(randomNUm)

// data set ends here
function createSmMass() {
    let randomNUm = (Math.random() * (1- 0 + 1)) << 0
    i++;
    smMass[i] = new component(30, 30, colors[i % 3], 130, 0, shapes[randomNUm], weights[randomNUm]); // small one which can move
    smMass[i].speedY = +1;
}

function startGame() { // will start game on window load
    createSmMass();
    degree = 10
    bigMass = new component(50, 50, 'yellow', 280, 160, 'circle', 60 );
    cSawSupport = new component(50, 50, 'brown', 200, 210, 'triangle', 0, false);
    cSaw = new component(200, 10, "green", 130, 200, 'box', 0, false);
    myGameArea.start();
}

let myGameArea = {
    canvas: document.getElementById('myCanvas'),
    start: function () {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        gameOver()
    }
}

function component(width, height, color, x, y, shape, weight, drawText = true ) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.shape = shape;
    this.x = x;
    this.y = y;
    this.weight = weight
    this.color = color;
    this.drawText = drawText;
    ctx = myGameArea.context;
    this.rotate = function () {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        // rotate the rect with degree mentioned
        ctx.rotate(degree  * Math.PI / 180);
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
    this.update = function () {
        ctx.fillStyle = this.color;
        switch (this.shape) {
            case 'box':
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.width / 2, this.width / 2, 0, 2 * Math.PI)
                ctx.fill();
                break;
            case 'triangle':
                ctx.strokeStyle = "green";
                ctx.moveTo(x + width/2, y); 
                ctx.lineTo(x, y + height); 
                ctx.lineTo(x + width, y + height); 
                ctx.closePath();
                ctx.stroke();
                break;
            default: 
                break;
        }
        if(this.drawText) {
            ctx.fillStyle = 'black';
            ctx.font = "15px Arial";
            let calX = this.x + (this.width / 2 - 10)
            let calY = this.y + (this.height / 2) + 5
            ctx.fillText(this.weight, calX, calY)
        }
    }
    this.crashWith = function (otherObj) {
        let myLeft = this.x;
        let myRight = this.x + (this.width);
        let myTop = this.y;
        let myBottom = this.y + (this.height);
        let otherLeft = otherObj.x;
        let otherRight = otherObj.x + (otherObj.width / 2);
        let otherTop = otherObj.y;
        let otherBottom = otherObj.y + (otherObj.height);
        let crash = true;
        if (
            (myBottom < otherTop) ||
            (myTop > otherBottom) ||
            (myRight < otherLeft) ||
            (myLeft > otherRight)
        ) {
            crash = false;
        } else {
            this.x = otherObj.x
            this.y = otherObj.y
        }
        return crash;
    }
    this.pass = function () {
        let top = this.y + this.height
        let left = this.x + this.width
        let pass = false
        if (top > 270 || left < 0 || left > 480) {
            pass = true 
        } 
        return pass
    }
}

function updateGameArea() {
    if (
        smMass[i].crashWith(cSaw) ||
        (i > 0 && smMass[i].crashWith(smMass[i - 1])) 
    ) {
        let index = i > 0 ? i -1 : i;
        degree = 5
        totalWeight += smMass[i].weight;
        updateMainScore()
        if (totalWeight >= bigMass.weight) {
            degree = totalWeight > bigMass.weight ? -5 : 0 
            winText = totalWeight > bigMass.weight ? 'You Lost' : 'You Win'
            myGameArea.clear();
            cSaw.rotate();
            cSawSupport.update()
            smMass.forEach(r => {
                r.update();
            });
            bigMass.update();
            updateMainScore();
            myGameArea.stop();
            
        } else {
            smMass[i].x = smMass[index].x + 8;
            smMass[i].y = 180;
            smMass[i].update()
            createSmMass();
        }
       
    } else if (smMass[i].pass()){
        i-- // deleting missed object
        createSmMass();
    }
     else {
         // default condition of start game
        myGameArea.clear();
        updateMainScore();
        cSaw.rotate();
        smMass[i].x += smMass[i].speedX;
        smMass[i].y += smMass[i].speedY;
        smMass.forEach(r => {
            r.update();
        });
        bigMass.update();
        cSawSupport.update()
    }
}
function myKeyPress(e) {
    var keyNum;
    keyNum = e.keyCode
    switch (keyNum) {
        case 37:
            moveLeft()
            break;
        case 39:
            moveRight()
            break;
        default:
            break;
    }
}

function moveLeft() {
    smMass[i].speedX = -1;
}
function moveRight() {
    smMass[i].speedX = 1;
}
function clearMove() {
    smMass[i].speedY = 0;
    smMass[i].speedX = 0;
}
function startAgain() {
    smMass[i].speedY = 1;
    smMass[i].speedX = 0;
}

function updateMainScore() {
    ctx = myGameArea.context;
    ctx.font = "20px Arial";
    ctx = myGameArea.context;
    ctx.fillStyle = 'red'
    ctx.fillText(`Score = ${totalWeight}`, 10, 50);
}

function gameOver () {
    ctx = myGameArea.context
    ctx.fillStyle = "black";
    ctx.font = "25px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", 240, 100);
    ctx.fillText(winText, 240, 140);
    ctx.font = "20px Helvetica"
}