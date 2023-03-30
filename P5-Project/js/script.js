let sceneIndex = 0;
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending
let startButton;

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
    startButton.mousePressed(nextScene);

}

function countdown() {
    background(0);
}

function game() {
    background(0);
}

function end() {
    background(0);
}

function nextScene() {
    sceneIndex++;
    print(sceneIndex);
}