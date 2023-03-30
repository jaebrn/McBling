let sceneIndex = 0;
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending
let startButton;
let timerStart;
let timer;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
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
}

function mainMenu() {
    //drawing title
    textSize(120);
    fill(255);
    textAlign(CENTER, CENTER);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4);

    //drawing start button
    startButton = createButton('Start');
    startButton.size(200, 200)
    startButton.position(width / 2, height / 1.5);
    startButton.mousePressed(startCountdown);

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

    textSize(120);
    fill(255);
    textAlign(CENTER, CENTER);
    text(timer, width / 2, height / 4);
}

function game() {
    background(0);
}

function end() {
    background(0);
}

function startCountdown() {
    timerStart = millis();
    sceneIndex = 1;
    print(sceneIndex);
}

function startGame() {
    sceneIndex = 2;
}