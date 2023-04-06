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

//Thomas variables
var p1Input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; //keyTyped inputs for player 1, numbers 0 through 9
var p2Input = ['p' ,'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o']; //same but for player2, represents numbers 0 through 9
let numbers2 = [];
let score2 = 0;
var playerCount = 0;
var startButton2;

//score multiplier
var scoreMult1 = 1;
var scoreMult2 = 1;
var scoreMultInc = 0.1;
var thresholdHeight = 100;
var hitScore = 100; //base value for a hit is 100 * by the position difference between the letter and the hitbox

//number spawning timer management;
var timer1 = 0;
var timer2 = 0;
var timerLimit1 = 1000;
var timerLimit2 = 1000;
var timerMIN = 100;
var timerMAX = 1000;
//timers are in milliseconds, so 1000 is one second


function setup() {
    createCanvas(1440, 1080);
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
    textSize(72);
    fill(255);
    textAlign(CENTER, CENTER);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4);

    //likely should replace this with a custom button (she is ugly)
    if (buttonCount < 1) {//drawing start button
        startButton = createButton('Start');
        startButton.size(200, 100)
        startButton.position(width / 2, height / 1.5);
        startButton.mousePressed(startCountdown);
        buttonCount++;
    }

    if(buttonCount < 2){
        startButton2 = createButton('Start 2 player');
        startButton2.size(200, 100);
        startButton2.position(width / 4, height / 1.5);
        startButton2.mousePressed(startCountdown2);
        buttonCount++;
    }

    if(buttonCount > 1){
        //startButton.remove();
        //startButton2.remove();
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
   // fill(255, 0, 0);
    //rect(0, yThreshold, width, 100);
    rectMode(CENTER);
    if(playerCount == 1){
       // fill(0, 255, 0);
        noFill();
        strokeWeight(5);
        stroke(0, 255, 0);
        square(width / 2, yThreshold, thresholdHeight);
    }else if(playerCount == 2){
        //p1
       // fill(0, 255, 0);
        noFill();
        strokeWeight(5);
        stroke(0, 255, 0);
        square(width / 4, yThreshold, thresholdHeight);
        //p2
       // fill(0, 0, 255);
       stroke(0, 0, 255);
        square(width * 0.75, yThreshold, thresholdHeight);

    }
    rectMode(CORNER); //just using CENTER to draw the hit zones tbh
    fill(255);
    noStroke();
    //spawn numbers
    NumberSpawnerTimer();
   
    

    for (i = 0; i < numbers.length; i++) {
        numbers[i].move();
        if (numbers[i].y > height) { //height was yThreshold, now using it as the "hit" area to hit numbers in
          //  lives--; commented out for testing purposes heehee
          scoreMult1 = 1;
            print('lives ' + lives);
            numbers.splice(i, 1);
        }
    }

    if(playerCount == 2){ //manages movement of numbers for player 2
        for(var j = 0; j < numbers2.length; j++){
            numbers2[j].move();
            if(numbers2[j].y > height){
                //there should be player 2 lives here but whatever
                scoreMult2 = 1;
                numbers2.splice(j, 1);
            }
        }
    }
  

    printScore();
   // printLives();

    if (lives <= 0) {
        sceneIndex = 3;
    }
}

function end() {
    background(0);
    textSize(70);
    text("Game Over :(", width / 2, height / 2);
    startButton.show();
}

function startCountdown() { //start button ID is used to tell how many players are playing
    playerCount = 1;
    timerStart = millis();
    sceneIndex = 1;
    print(sceneIndex);
    startButton.hide();
    startButton2.hide();
}

//also thomas
function startCountdown2(){
    playerCount = 2;
    timerStart = millis();
    sceneIndex = 1;
    print(sceneIndex);
    startButton.hide();
    startButton2.hide();
}

function startGame() {
    sceneIndex = 2;
}

function printLives() {
    textSize(46);
    fill(255);
    text("Lives: " + lives, 100, 100);
}

function printScore() {
    textSize(46);
    fill(255);
    // text("Score: " + score, width - 100, 100);
    //p1
    textAlign(LEFT);
   text("Score: " + score, 0, 100);
   text("x" + scoreMult1, 0, 200);

   if(playerCount == 2){
    //p2
    textAlign(RIGHT);
    text("Score: " + score2, width, 100);
    text("x" + scoreMult2, width, 200);
   }
   

   textAlign(CENTER);
}

class Numbers {
    constructor(value, xPos, playerID) {
        this.playerID = playerID; //identify owner
        this.x = xPos;
        this.y = value;
        this.speed = 5; // should increase with difficulty 
        this.number = int(random(0, 9));
    }

    move() {
        textSize(96);
        text(this.number, this.x, this.y);
        if(this.playerID == 1){
            this.y += this.speed * scoreMult1;
        }else if(this.playerID == 2){
            this.y += this.speed * scoreMult2;
        }
        
    }
}

//Thomas made this
function keyTyped(){ //automatically receives key inputs
    getInput(key);
}

function getInput(value){ //sorts out what to do with key input based on scene index
    print(value);
    switch(sceneIndex){
        case 2: //game input
            gameInput(value);
        break;
    }
}

function gameInput(value){
    var numberID; //which number is this key associated with
    var playerID; //which player is this key associated with
    for(var i = 0; i < p1Input.length; i++){
        if(p1Input[i] == value){
            numberID = i;
            playerID = 1;
        }
    }

    for(var j = 0; j < p2Input.length; j++){
        if(p2Input[j] == value){
            numberID = j;
            playerID = 2;
        }
    }
    print("received input " + numberID + "for player " + playerID);
    //check if an onscreen number matches the input
    //the copy pasting of stuff did a fucking number on the formatting fml
    if(playerID == 1){
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
    for(var l = 0; l < numbers.length; l++){
        if(!received){
            if(numberID == numbers[l].number){
                if(numbers[l].y >= yThreshold - (thresholdHeight / 2)){
                    //score++;
                    scorePoints(1, numbers[l].y);
                    numbers.splice(l, 1);
                    received = true;
                }
            }
        }
    }

    }else if(playerID == 2){
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for(var l = 0; l < numbers2.length; l++){
            if(!received){
                if(numberID == numbers2[l].number){
                    if(numbers2[l].y >= yThreshold - (thresholdHeight / 2)){
                    //score++;
                    scorePoints(2, numbers2[l].y);
                    numbers2.splice(l, 1);
                    received = true;
                }
            }
        }
    }

    }
    
}

function scorePoints(player, ypos){
    var reward = 0;
    var posbonus = 0;
    if(player == 1){
        if(ypos < yThreshold){
            posbonus = ypos / yThreshold;
        }else{
            posbonus = yThreshold / ypos;
        }
        scoreMult1 += scoreMultInc;
        scoreMult1 = Math.round(scoreMult1 * 10) / 10; //the additional math being done makes it so the multiplier is rounded up to 1 digit
        reward = hitScore * scoreMult1;
        reward *= posbonus;
        score += reward;
        score = Math.round(score);
        print("posBonus is " + posbonus);
    }

    if(player == 2){
        if(ypos < yThreshold){
            posbonus = ypos / yThreshold;
        }else{
            posbonus = yThreshold / ypos;
        }
        scoreMult2 += scoreMultInc;
        scoreMult2 = Math.round(scoreMult2 * 10) / 10;
        reward = hitScore * scoreMult2;
        reward *= posbonus;
        score2 += reward;
        score2 = Math.round(score2);
        print("posBonus is " + posbonus);
    }

    print("player " + player + " gains " + reward + " points");
}

function NumberSpawnerTimer(){ //manages timers to spawn numbers for players
    //p1
    timer1 += deltaTime;
    if(timer1 >= timerLimit1){
        SpawnNumber(1);
        timer1 = 0;
        timerLimit1 = random(timerMIN, timerMAX);
    }

    //p2
    if(playerCount == 2){
        timer2 += deltaTime;
        if(timer2 >= timerLimit2){
            SpawnNumber(2);
            timer2 = 0;
            timerLimit2 = random(timerMIN, timerMAX);
        }
    }
}

function SpawnNumber(player){ //called by NumberSpawnerTimer when a timer runs out to ACTUALLY spawn a timer
    if(playerCount == 1){
        numbers.push(new Numbers(-500 * numbers.length, width / 2, 1));
    }else if(playerCount == 2){
        if(player == 1){
            numbers.push(new Numbers(-500 * numbers.length, width / 4, 1)); // needs to be changed to be flexible
        }else if(player == 2){
            numbers2.push(new Numbers(-500 * numbers2.length, width * 0.75, 2));
        }
    }
}

/*
 //Number spawning
    if(playerCount == 1){ //single player
        if (numbers.length < numberCount) {
            numbers.push(new Numbers(-500 * numbers.length, width / 2)); // needs to be changed to be flexible
        }
    }else{ //two player
        if (numbers.length < numberCount) { //for player 1
            numbers.push(new Numbers(-500 * numbers.length, width / 4)); // needs to be changed to be flexible
        }

        if(numbers2.length < numberCount){ //for player 2
            numbers2.push(new Numbers(-500 * numbers2.length, width * 0.75));
        }
    }
     */