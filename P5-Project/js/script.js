let sceneIndex = 0;
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending

var startButton;
let buttonCount = 0;

let timerStart;
let timer;

let score = 0;
let lives = 3;
let difficulty = 1;
let yThreshold;
let numberCount = 3;
let numbers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    // /noLoop();
    yThreshold = height - 100;
}

function draw() {
    switch (sceneIndex) { //scene management
        case 0:
            mainMenu();
            break;
        case 1:
            countdown();
            break;
        case 2:
            game();
            break;
        case 3:
            end();
            break;
    }

    // print(sceneIndex);
}

function mainMenu() {
    //drawing title
    textSize(180);
    fill(255);
    textAlign(CENTER, CENTER);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4);

    //likely should replace this with a custom button (she is ugly)
    if (buttonCount < 1) {//drawing start button
        startButton = createButton('Start');
        startButton.size(200, 200)
        startButton.position(width / 2, height / 1.5);
        startButton.mousePressed(startCountdown);
        buttonCount++;
    }
}

function countdown() {
    background(0);
    if (millis() <= timerStart + 1000) {
        timer = 3;
    } else if (millis() <= timerStart + 2000) {
        timer = 2;
    }
    else if (millis() <= timerStart + 3000) {
        timer = 1;
    } else {
        startGame();
    }

    textSize(240);
    fill(255);
    textAlign(CENTER, CENTER);
    text(timer, width / 2, height / 2);
}

function game() {
    background(0);
    fill(255, 0, 0);
    rect(0, yThreshold, width, 100);

    if (numbers.length < numberCount) {
        numbers.push(new Numbers(-500 * numbers.length));
    }

    for (i = 0; i < numbers.length; i++) {
        numbers[i].move();
        if (numbers[i].y > yThreshold) {
            lives--;
            print('lives ' + lives);
        } if (numbers[i].y > height) {
            numbers.splice(i, 1);
        }
    }
}

function end() {
    background(0);
}

function startCountdown() {
    timerStart = millis();
    sceneIndex = 2;
    print(sceneIndex);
    startButton.hide();
}

function startGame() {
    sceneIndex = 2;
}

class Numbers {
    constructor(value) {
        this.x = width / 2;
        this.y = value;
        this.speed = 5;
        this.number = int(random(0, 9));
    }

    move() {
        text(this.number, this.x, this.y);
        this.y += this.speed;
    }
}