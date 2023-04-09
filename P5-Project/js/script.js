let sceneIndex = 0;
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending

var startButton, startButton2; // single and multiplayer start buttons
var playerCount = 0; // number of players
let buttonCount = 0; // number of buttons

let timerStart; // time (millis()) when timer begins
let timer; //countdown timer

let score, score2 = 0; // P1 & P2 scores
let lives = 3; // number of lives

let yThreshold; // Y co-ord where numbers should be input
let numberCount = 3; // # of numbers
let numbers, numbers2 = []; // arrays storing numbers for P1 & P2

//Input variables
var p1Input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; //keyTyped inputs for player 1, numbers 0 through 9
var p2Input = ['p', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o']; //same but for player2, represents numbers 0 through 9

//score multiplier
var scoreMult1, scoreMult2 = 1; // score multipliers for P1 & P2
var scoreMultInc = 0.1;
var thresholdHeight = 100;
var hitScore = 100; //base value for a hit is 100 * by the position difference between the letter and the hitbox

//number spawning timer management;
var timer1 = 0;
var timer2 = 0;
var timerLimit1 = 1000;
var timerLimit2 = 1000;
var timerMIN = 250;
var timerMAX = 1000;
//timers are in milliseconds, so 1000 is one second

//audio
var songNames = [];
var songList = [];
var songIndex = 0;
var songTitle = "";
var songPlaying = true; //turns to false when song is completed playing

//colors
let bgStart = (190, 150, 30);
let bgNew = (255, 50, 255);
let amt = 0;

//images
var corners;

function preload() {
    //loads songs and images
    loadSongs();
    corners = loadImage('assets/images/corners.png');
}

function loadSongs() { //put all audio file loading in here
    soundFormats('mp3');
    songList.push(loadSound('song/Butterfly-Smile.dk.mp3'));
    songNames.push("Butterfly - Smile.dk");
    songList.push(loadSound('song/Captain_Jack-Captain_Jack.mp3'));
    songNames.push("Captain Jack - Captain Jack");
    songList.push(loadSound('song/Dreamscape-009_Sound_System.mp3'));
    songNames.push("Dreamscape - 009 Sound System");
    songList.push(loadSound('song/Stamp_On_The_Ground-Italobrothers.mp3'));
    songNames.push("Stamp On The Ground - Italobrothers");
    songList.push(loadSound('song/STEALTH-Love,Life,Happiness.mp3'));
    songNames.push("Love, Life, & Happiness - STEALTH");
}

function setup() {
    createCanvas(1440, 1080);
    yThreshold = height - 100;

    bgStart = color(190, 150, 30);
    bgNew = color(255, 50, 255);
}

function draw() {
    bg(); // draws background graphics

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

function bg() {
    // color changing gradient background 
    background(lerpColor(bgStart, bgNew, amt));
    amt += 0.003;
    if (amt >= 1.5) {
        amt = 0.0;
        bgStart = bgNew;
        bgNew = color(random(255), random(255), random(255));
    }

    rectMode(CENTER);
    noStroke();
    fill(255, 100);
    rect(width / 2, height / 2 + 20, width / 1.13, height / 1.2, 40); // translucent white screen outline
    fill(0);
    rect(width / 2, height / 2 + 20, width / 1.2, height / 1.3, 20); // translucent white screen outline

    image(corners, 0, 0, 1440, 1080); //draws corner cutouts
}

function mainMenu() {
    //drawing title
    textSize(72);
    fill(255);
    textAlign(CENTER, CENTER);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4);
    drawSongTitles();

    //likely should replace this with a custom button (she is ugly)
    if (buttonCount < 1) {//drawing start button
        startButton = createButton('Start');
        startButton.size(200, 100)
        startButton.position(width / 2, height / 1.5);
        startButton.mousePressed(startCountdown);
        buttonCount++;
    }

    if (buttonCount < 2) {
        startButton2 = createButton('Start 2 player');
        startButton2.size(200, 100);
        startButton2.position(width / 4, height / 1.5);
        startButton2.mousePressed(startCountdown2);
        buttonCount++;
    }

    if (buttonCount > 1) {
        //startButton.remove();
        //startButton2.remove();
    }

}

function drawSongTitles() {
    songTitle = text("< " + songNames[songIndex] + " >", width / 2, height / 2); //displays song title as text
}

function countdown() {
    timer = int(map(millis(), timerStart, timerStart + 3000, 4, 1)); // maps time to seconds (3, 2, 1...)

    textSize(240);
    fill(255);
    textAlign(CENTER, CENTER);
    text(timer, width / 2, height / 2); // displays timer as text

    if (timer <= 0) { // starts game when timer reaches 0
        startGame();
    }
}

function game() {
    // fill(255, 0, 0);
    //rect(0, yThreshold, width, 100);
    rectMode(CENTER);
    if (playerCount == 1) {
        // fill(0, 255, 0);
        noFill();
        strokeWeight(5);
        stroke(0, 255, 0);
        square(width / 2, yThreshold - 5, thresholdHeight);
    } else if (playerCount == 2) {
        //p1
        // fill(0, 255, 0);
        noFill();
        strokeWeight(5);
        stroke(0, 255, 0);
        square(width / 4, yThreshold - 5, thresholdHeight);
        //p2
        // fill(0, 0, 255);
        stroke(0, 0, 255);
        square(width * 0.75, yThreshold - 5, thresholdHeight);

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

    if (playerCount == 2) { //manages movement of numbers for player 2
        for (var j = 0; j < numbers2.length; j++) {
            numbers2[j].move();
            if (numbers2[j].y > height) {
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
    textSize(70);
    if (playerCount == 1) {
        //  text("Game Over :(", width / 2, height / 2);
        text("Score:" + score, width / 2, height / 2);
    } else if (playerCount == 2) {
        text("Player 1 Score:" + score, width / 4, height / 4);
        text("Player 2 Score:" + score2, width * 0.75, height / 4);
        if (score > score2) {
            text("Player 1 Wins!", width / 2, height / 2);
        } else {
            text("Player 2 Wins!", width / 2, height / 2);
        }
    }

    /*
    startButton.show();
    startButton2.show();*/
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
function startCountdown2() {
    playerCount = 2;
    timerStart = millis();
    sceneIndex = 1;
    print(sceneIndex);
    startButton.hide();
    startButton2.hide();
}

function startGame() {
    sceneIndex = 2;
    songList[songIndex].play();
    songList[songIndex].onended(endsong);
}

function endsong() {
    print("song has ended");
    songPlaying = false
};

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

    if (playerCount == 2) {
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
        if (this.playerID == 1) {
            this.y += this.speed * scoreMult1;
        } else if (this.playerID == 2) {
            this.y += this.speed * scoreMult2;
        }

    }
}

//Thomas made this
function keyTyped() { //automatically receives key inputs
    getInput(key);
}

function getInput(value) { //sorts out what to do with key input based on scene index
    print(value);
    switch (sceneIndex) {
        case 2: //game input
            gameInput(value);
            break;
        case 0: //main menu
            menuInput(value);
            break;
        case 3:
            endInput(value);
            break;
    }
}

function menuInput(value) {
    switch (value) {
        case "Enter":
            startCountdown(); //1 player start
            break;

        case ' ': //2 player start
            startCountdown2();
            break;

        case '6': //next song
        case '8':
        case 'i':
        case 'y':
            songIndex++;
            if (songIndex > songList.length - 1 || songIndex > songNames.length - 1) {
                songIndex = 0;
            }
            break;

        case '4': //previous song
        case '2':
        case 'r':
        case 'w':
            songIndex--;
            if (songIndex < 0) {
                songIndex = songList.length - 1;
            }
            break;
    }
}

function endInput(value) {
    switch (value) {
        case "Enter":
        case ' ':
            sceneIndex = 0;
            songPlaying = true;
            break;
    }
}

function gameInput(value) {
    var numberID; //which number is this key associated with
    var playerID; //which player is this key associated with
    for (var i = 0; i < p1Input.length; i++) {
        if (p1Input[i] == value) {
            numberID = i;
            playerID = 1;
        }
    }

    for (var j = 0; j < p2Input.length; j++) {
        if (p2Input[j] == value) {
            numberID = j;
            playerID = 2;
        }
    }
    print("received input " + numberID + "for player " + playerID);
    //check if an onscreen number matches the input
    //the copy pasting of stuff did a fucking number on the formatting fml
    if (playerID == 1) {
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for (var l = 0; l < numbers.length; l++) {
            if (!received) {
                if (numberID == numbers[l].number) {
                    if (numbers[l].y >= yThreshold - (thresholdHeight / 2)) {
                        //score++;
                        scorePoints(1, numbers[l].y);
                        numbers.splice(l, 1);
                        received = true;
                    }
                }
            }
        }

    } else if (playerID == 2) {
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for (var l = 0; l < numbers2.length; l++) {
            if (!received) {
                if (numberID == numbers2[l].number) {
                    if (numbers2[l].y >= yThreshold - (thresholdHeight / 2)) {
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

function scorePoints(player, ypos) {
    var reward = 0;
    var posbonus = 0;
    if (player == 1) {
        if (ypos < yThreshold) {
            posbonus = ypos / yThreshold;
        } else {
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

    if (player == 2) {
        if (ypos < yThreshold) {
            posbonus = ypos / yThreshold;
        } else {
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

function NumberSpawnerTimer() { //manages timers to spawn numbers for players
    if (songPlaying == true) {
        //p1
        timer1 += deltaTime;
        if (timer1 >= timerLimit1) {
            SpawnNumber(1);
            timer1 = 0;
            timerLimit1 = random(timerMIN, timerMAX);
        }

        //p2
        if (playerCount == 2) {
            timer2 += deltaTime;
            if (timer2 >= timerLimit2) {
                SpawnNumber(2);
                timer2 = 0;
                timerLimit2 = random(timerMIN, timerMAX);
            }
        }
    } else {
        sceneIndex = 3;
    }

}

function SpawnNumber(player) { //called by NumberSpawnerTimer when a timer runs out to ACTUALLY spawn a timer
    if (playerCount == 1) {
        numbers.push(new Numbers(-500 * numbers.length, width / 2, 1));
    } else if (playerCount == 2) {
        if (player == 1) {
            numbers.push(new Numbers(-500 * numbers.length, width / 4, 1)); // needs to be changed to be flexible
        } else if (player == 2) {
            numbers2.push(new Numbers(-500 * numbers2.length, width * 0.75, 2));
        }
    }
}

