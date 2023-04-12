//MCBLING SPEED TEXTER 3000
//Created by Thomas Rompre, Jenna Brown, & Carolie Delisle 
//Created in April 2023 for CART263 at Concordia University

let sceneIndex = 0; // directs program to various scenes:
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending

var playerCount = 0; // number of players
let buttonCount = 0; // number of buttons

let timerStart; // time (millis()) when timer begins
let timer; //countdown timer

let score = 0; // P1 scores
let score2 = 0; // P2 scores

let yThreshold; // Y co-ord where numbers should be input
var thresholdHeight = 100; // height of threshold area

let numberCount = 3; // # of numbers
let numbers = []; // arrays storing numbers for P1
let numbers2 = []; // arrays storing numbers for P2

//Input variables
var p1Input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; //keyTyped inputs for player 1, numbers 0 through 9
var p2Input = ['p', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o']; //same but for player2, represents numbers 0 through 9

//score multiplier
var scoreMult1 = 1;// score multipliers for P1
var scoreMult2 = 1; // score multipliers for P2
var scoreMultInc = 0.1; // increments by which score multiplier increases
var hitScore = 100; //base value for a hit is 100 * by the position difference between the letter and the hitbox

//number spawning timer management;
var timer1 = 0;
var timer2 = 0;
var timerLimit1 = 1000;
var timerLimit2 = 1000;
var timerMIN = 500;
var timerMAX = 2000;
//timers are in milliseconds, so 1000 is one second

//audio
var songNames = []; // song titles
var songList = []; // song directory
var songIndex = 0; // index
var prevSong;
var songTitle = "";
var songPlaying = true; //turns to false when song is completed playing

//colors
let bgStart; // lerp starting color
let bgNew; // lerp end color
let bgColor; // current color
let amt = 0; // lerp step

//images
var corners; // corner cutout (rounds upper rect corners)

//fonts
var font;

//perfect 
//these are timers used to track how long the "perfect" texts are gonna be up
var perf1 = 1000;
var perf2 = 1000;

//confetti
var ConfettiList = []; // particle effect

//gifs
//blingeecore early internet stuff i found, stored here
var giflist = [];
var gifCount = 67;
var activeGifList = [];
var maxActiveGifs = 1;
var gifTimerLimit = 0;
var gifTimer = 0;

//waveform
var fft; // waveform var (fast fourier transform - analyzes audio)

//ripples
var rippleList = []; //expanding circles created when a number is hit

function preload() {
    //loads songs, fonts and images
    loadSongs();
    loadGifs();
    corners = loadImage('assets/images/corners.png');
    font = loadFont('assets/fonts/DS.ttf');
    gifTimerLimit = random(1000, 5000);
}

function loadGifs() {
    for (var i = 0; i < gifCount - 1; i++) {
        giflist.push(loadImage('gif/gif(' + (i + 1) + ').gif')); // loads GIFs
    }
}

function loadSongs() {  // Loads all songs, identifies titles
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
    songList.push(loadSound('song/Axel_F.mp3'));
    songNames.push("Crazy Frog - Axel F");
    songList.push(loadSound('song/hampsterdance.mp3'));
    songNames.push("The HampsterDance Song");
    songList.push(loadSound('song/sandstorm.mp3'));
    songNames.push("Darude - Sandstorm");
    songList.push(loadSound('song/bambambam.mp3'));
    songNames.push("BAMBEE - Bam Bam Bam");
    songList.push(loadSound('song/blue.mp3'));
    songNames.push("Eiffel 65 - Blue (Da Ba Dee)");
    songList.push(loadSound('song/kiss.mp3'));
    songNames.push("Vengaboys - Kiss");
    songList.push(loadSound('song/getgetdown.mp3'));
    songNames.push("Paul Johnson - Get Get Down");
    songList.push(loadSound('song/basshunter.mp3'));
    songNames.push("Basshunter - I Can Walk On Water");
    songList.push(loadSound('song/scatman.mp3'));
    songNames.push("Scatman John - Scatman");
    songList.push(loadSound('song/everytime_we_touch.mp3'));
    songNames.push("CASCADA - Everytime We Touch");
    songList.push(loadSound('song/daftpunk.mp3'));
    songNames.push("Daft Punk - Harder,Better,Faster,Stronger");
    songList.push(loadSound('song/boom.mp3'));
    songNames.push("Vengaboys - Boom Boom Boom Boom");
    songList.push(loadSound('song/50.mp3'));
    songNames.push("50 Cent - In Da Club");
    songList.push(loadSound('song/caramelldansen.mp3'));
    songNames.push("Caramella Girls - Caramelldansen");
}

function setup() {
    createCanvas(1440, 1080);
    yThreshold = height - 200; // y-coord at which numbers can be input

    bgStart = color(190, 150, 30); // background lerp starting color
    bgNew = color(255, 50, 255); // background lerp ending color

    songIndex = int(random(songNames.length)); // randomly selects song from list

    textFont(font); // assigns font

    fft = new p5.FFT(); // creates new fast fourier transform to analyze audio
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
    bgColor = (lerpColor(bgStart, bgNew, amt)); // lerps color
    amt += 0.003;
    if (amt >= 1.5) {
        amt = 0.0;
        bgStart = bgNew;
        bgNew = color(random(255), random(255), random(255)); // re-randomizes color
    }
    background(bgColor);

    rectMode(CENTER);
    noStroke();
    fill(255, 100);
    rect(width / 2, height / 2 + 20, width / 1.13, height / 1.2, 40); // translucent white screen outline
    fill(0);
    rect(width / 2, height / 2 + 20, width / 1.2, height / 1.3, 20); // black 'screen' rect

    image(corners, 0, 0, 1440, 1080); //draws corner cutouts

}

function mainMenu() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(135);
    stroke(255, 100);
    strokeWeight(20);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4); //draws game title
    noStroke();
    drawSongTitles() // draws song title;
    textSize(60);
    text('Answer call to start', width / 2, height - 250); // start instructions
    text('Decline call to change song', width / 2, height - 200); // new song instructions
}

function drawSongTitles() {
    textSize(100);
    text('Now playing...', width / 2, height / 2 - 70);
    textSize(120);
    textWrap(WORD);
    textLeading(105);
    songTitle = text(songNames[songIndex], width / 2, height / 1.6 - 90, height / 1.25); //displays song title as text
}

function countdown() {
    timer = int(map(millis(), timerStart, timerStart + 3000, 4, 1)); // maps time to seconds (3, 2, 1...)

    textSize(340);
    fill(255);
    textAlign(CENTER, CENTER);
    text(timer, width / 2, height / 2); // displays timer as text

    if (timer <= 0) { // starts game when timer reaches 0
        startGame();
    }
}

function game() {
    //draw and manage gifs
    renderGifs();
    //draw waveForm
    drawWaveForm();
    //draw ripples
    renderRipples();

    rectMode(CENTER);
    if (playerCount == 1) { // if singleplayer.. 
        fill(166, 123, 0, 255 * 0.2);
        strokeWeight(2.5);
        stroke(166, 123, 0);
        square(width / 2, yThreshold - 5, thresholdHeight); // displays single hit zone where numbers can be input
    } else if (playerCount == 2) { // if multiplayer...
        //p1: 
        fill(166, 123, 0, 255 * 0.2);
        strokeWeight(2.5);
        stroke(166, 123, 0);
        square(width / 4, yThreshold - 5, thresholdHeight); // displays P1's hit zone where numbers can be input
        //p2
        fill(193, 193, 193, 255 * 0.2);
        stroke(193, 193, 193);
        square(width * 0.75, yThreshold - 5, thresholdHeight); // displays P2's hit zone where numbers can be input

    }

    //Settings:
    rectMode(CORNER);
    fill(255);
    noStroke();

    //draws confetti
    drawConfetti();

    //draw perfect texts and manages their timers
    perfectVisual();

    //spawns numbers
    NumberSpawnerTimer();

    for (i = 0; i < numbers.length; i++) { // controls P1 number behaviours
        numbers[i].move(); // moves numbers
        if (numbers[i].y > height) { //if numbers go off screen...
            scoreMult1 = 1; // score multiplier is reset
            numbers.splice(i, 1); // off-screen number is removed
        }
    }

    if (playerCount == 2) { // controls P2 number behaviours
        for (var j = 0; j < numbers2.length; j++) {
            numbers2[j].move(); // moves numbers
            if (numbers2[j].y > height) { // if numbers go offscreen
                scoreMult2 = 1; // score multiplier is reset
                numbers2.splice(j, 1); // off-screen number is removed
            }
        }
    }

    drawBorder(); // 'Phone' border is drawn
    drawProgress(); // Song progress bar is drawn

    //game title:
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(80);
    stroke(255, 100);
    strokeWeight(10);
    text('MCBLING SPEED TEXTER 3000', width / 2, 50); // displays game title
    noStroke();

    printScore(); // draws player scores onscreen
}

function drawProgress() {
    // draws a progress bar which fills throughout the song
    var x1 = width / 2 - 500;
    var rectWidth = map(songList[songIndex].currentTime(), 0, songList[songIndex].duration(), 0, 1000); // displays current time as a portion of a bar

    noFill();
    stroke(255);
    strokeWeight(1);
    rect(x1, height - 50, 1000, 20); // bar outline
    noStroke()
    fill(255, 200);
    rect(x1, height - 50, rectWidth, 20); // progress bar fill
}

function drawBorder() {
    //border overlays so numbers dont show off 'screen'
    noStroke();
    //upper
    fill(bgColor);
    rect(270, 0, 110, 144); // left
    rect(width - 390, 0, 110, 144); // right
    rect(width / 2 - 55, 0, 110, 144); //middle
    // middle
    fill(255, 100);
    rect(270, 110, 110, 34); //l
    rect(width - 390, 110, 110, 34); //r
    rect(width / 2 - 55, 110, 110, 34); //m

    //lower
    fill(bgColor);
    rect(305, height - 104, 110, 144); // l
    rect(width - 415, height - 104, 110, 144); // r
    rect(width / 2 - 55, height - 104, 110, 144); // m
    fill(255, 100);
    rect(305, height - 104, 110, 34);//l
    rect(width - 415, height - 104, 110, 34);//r
    rect(width / 2 - 55, height - 104, 110, 34); //m

    image(corners, 0, 0, 1440, 1080); //draws corner cutouts
}

function end() { // called when song ends
    textSize(70);
    fill(255);
    if (playerCount == 1) { // if singleplayer... 
        text("Score: " + score, width / 2, height / 2); // draw score
    } else if (playerCount == 2) { // if multiplayer...
        text("" + score, width / 4, height / 4); // displays P1's score
        text("" + score2, width * 0.75, height / 4); //displays P2's score
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width / 2 + random(-300, 300), height / 2, random(5, 20)); // draws confetti
        textSize(140);
        if (score > score2) { // if P1 wins..
            text("Player 1 Wins!", width / 2, height / 2);
        } else { // if P2 wins...
            text("Player 2 Wins!", width / 2, height / 2);
        }
    }
    drawConfetti();
}

function startCountdown() { //Begins countdown, registers game as singleplayer
    playerCount = 1; //registers singleplayer
    timerStart = millis(); // sets timer start time
    sceneIndex = 1; // changes scene
}

function startCountdown2() {
    playerCount = 2; //registers multiplayer
    timerStart = millis(); // sets timer start time
    sceneIndex = 1; // changes scene
}

function startGame() {
    sceneIndex = 2; // changes scene, starts game
    songList[songIndex].play(); // begins playing song
    songList[songIndex].onended(endsong); // when song ends, call endsong();
}

function endsong() {
    songPlaying = false; // sets var to false, registers song has ended
}

function printScore() {
    textSize(46);
    fill(255);
    //P1:
    textAlign(LEFT);
    text("Score: " + score, 150, 170); // prints score
    textSize(46 * scoreMult1) //changes font size in accordance to score multiplier
    text("x" + scoreMult1, 150, 205 + (5 * scoreMult1)); // prints score multipler

    if (playerCount == 2) { // if multiplayer...
        //P2:
        textSize(46);
        textAlign(RIGHT);
        text("Score: " + score2, width - 150, 170); // prints score
        textSize(46 * scoreMult2) //changes font size in accordance to score multiplier
        text("x" + scoreMult2, width - 150, 205 + (5 * scoreMult2)); // prints score multipler
    }
    textAlign(CENTER);
}

class Numbers { // class describing numbers 
    constructor(value, xPos, playerID) {
        this.playerID = playerID; //identifies owner (P1 v. P2)
        this.x = xPos;
        this.y = value;
        this.speed = 5; // speed at which numbers move
        this.number = int(random(0, 9)); // randomly chooses number
    }

    move() {
        textSize(112);
        text(this.number, this.x, this.y); // draws number
        if (this.playerID == 1) { // if belonging to P1:
            this.y += this.speed * scoreMult1; // multiply by P1's score multiplier
        } else if (this.playerID == 2) { // if belonging to P2:
            this.y += this.speed * scoreMult2; // multiply by P2's score multiplier
        }
    }
}

function keyTyped() { //automatically receives key inputs
    getInput(key);
}

function getInput(value) { //sorts out what to do with key input based on scene index
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

function menuInput(value) { // registers key inputs on menu
    switch (value) {
        case "Enter": // if enter (or P1 answer call button) is pressed:
            startCountdown(); // starts single player game
            break;

        case ' ': // if tab (or P2 answer call button) is pressed:
            startCountdown2(); // starts multiplayer game
            break;

        //Changes song:
        case '6': // next song
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

function endInput(value) { // registers key inputs on end screen
    switch (value) {
        case "Enter": // if enter/P1 answer call is pressed
        case ' ': // if tab/P2 answer call is pressed
            restart(); // game restarts
            break;
    }
}

function gameInput(value) { // registers key inputs on game screen 
    var numberID; //which number is this key associated with
    var playerID; //which player is this key associated with
    for (var i = 0; i < p1Input.length; i++) { // sets number and player ID vars
        if (p1Input[i] == value) {
            numberID = i;
            playerID = 1;
        }
    }

    for (var j = 0; j < p2Input.length; j++) { // sets number and player ID vars
        if (p2Input[j] == value) {
            numberID = j;
            playerID = 2;
        }
    }
    //checks if an onscreen number matches the input
    if (playerID == 1) { //P1
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for (var l = 0; l < numbers.length; l++) {
            if (!received) {
                if (numberID == numbers[l].number) { // if number pressed matches number onscreen
                    if (numbers[l].y >= yThreshold - (thresholdHeight) && numbers[l].y <= yThreshold + (thresholdHeight)) { // if number is within hit zone when pressed
                        scorePoints(1, numbers[l].y); // increase score
                        numbers.splice(l, 1); // remove number
                        received = true;
                    }
                }
            }
        }

    } else if (playerID == 2) { //P2
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for (var l = 0; l < numbers2.length; l++) {
            if (!received) {
                if (numberID == numbers2[l].number) { // if number pressed matches number onscreen
                    if (numbers2[l].y >= yThreshold - (thresholdHeight) && numbers2[l].y <= yThreshold + (thresholdHeight)) { // if number is within hit zone when pressed
                        scorePoints(2, numbers2[l].y);// increase score
                        numbers2.splice(l, 1); // remove number
                        received = true;
                    }
                }
            }
        }

    }

}

function scorePoints(player, ypos) {
    var confettiCount = random(5, 25); // random amount of confetti
    var reward = 0;
    var posbonus = 0;
    if (player == 1) { // P1:
        if (ypos < yThreshold) { // checks position
            posbonus = ypos / yThreshold;
        } else {
            posbonus = yThreshold / ypos;
        }
        posbonus = (posbonus - 0.9) * 10; // applies bonus based on number position
        scoreMult1 += scoreMultInc; // score multiplier increases
        scoreMult1 = Math.round(scoreMult1 * 10) / 10; //rounds score multiplier
        reward = hitScore * scoreMult1; // calculates reward 
        reward *= posbonus; // scales reward to positional bonus
        if (posbonus >= 0.9) {//scoring a perfect hit
            reward = reward * 2;
            perf1 = 0;
            confettiCount *= random(1, 10);
        }
        score += reward; // increases score
        score = Math.round(score); // rounds score
        if (playerCount == 1) { // draws confetti: position changes if singleplayer v. multiplayer
            createConfetti(width / 2, yThreshold, confettiCount);
        } else {
            createConfetti(width / 4, yThreshold, confettiCount);
        }
        rippleList.push(new ripple(scoreMult1)); // draws ripple effect
    }

    if (player == 2) { // P2:

        if (ypos < yThreshold) { // checks position
            posbonus = ypos / yThreshold;
        } else {
            posbonus = yThreshold / ypos;
        }
        posbonus = (posbonus - 0.9) * 10; // applies bonus based on number position
        scoreMult2 += scoreMultInc; // score multiplier increases
        scoreMult2 = Math.round(scoreMult2 * 10) / 10; //rounds score multiplier
        reward = hitScore * scoreMult2; // calculates reward 
        reward *= posbonus; // scales reward to positional bonus
        if (posbonus >= 0.9) {//scoring a perfect hit
            reward = reward * 2;
            perf2 = 0;
            confettiCount *= random(1, 10);
        }
        score2 += reward; // increases score
        score2 = Math.round(score2); // rounds score
        createConfetti(width * 0.75, yThreshold, confettiCount);
        rippleList.push(new ripple(scoreMult2)); // draws ripple effect
    }
}

function DoWeCreateGif(player) { //determines whether or not we create a new gif and if so where to create it, it adds one for every 0.5 multiplier gained.
    if (player == 1) {
        if (scoreMult1 % 1 == 0 || scoreMult1 % 1 == 0.5) {
            if (playerCount == 1) {
                activeGifList.push(new blingee(random(width), random(height)));
            } else {
                activeGifList.push(new blingee(random(width / 2), random(height)));
            }
        }
    } else {
        if (scoreMult2 % 1 == 0 || scoreMult2 % 1 == 0.5) {
            activeGifList.push(new blingee(random(width / 2, width), random(height)));
        }
    }
}

function NumberSpawnerTimer() { //manages timers to spawn numbers for players
    if (songPlaying == true) { // if song is playing
        //p1
        timer1 += deltaTime; // timer increases
        if (timer1 >= timerLimit1) { // if timer exceeds limit...
            SpawnNumber(1); // spawn a number
            timer1 = 0; // reset timer
            timerLimit1 = random(timerMIN * scoreMult1, timerMAX); // randomize timer limit within range
        }
        //p2
        if (playerCount == 2) { // if multiplayer
            timer2 += deltaTime; // timer increases
            if (timer2 >= timerLimit2) { // if timer exceeds limit
                SpawnNumber(2); // spawn a number
                timer2 = 0; // reset timer
                timerLimit2 = random(timerMIN * scoreMult2, timerMAX); // randomize timer limit within range
            }
        }
    } else {
        sceneIndex = 3; // if song is not playing, change scene
    }
}

function SpawnNumber(player) { //called by NumberSpawnerTimer when a timer runs out to ACTUALLY spawn a number
    if (playerCount == 1) { // if single player
        numbers.push(new Numbers(-500 * numbers.length, width / 2, 1)); // spawn number in center screen for player 1
    } else if (playerCount == 2) { // if multiplayer
        if (player == 1) { // if spawning for player 1
            numbers.push(new Numbers(-500 * numbers.length, width / 4, 1)); // spawn number in P1 x position (left screen)
        } else if (player == 2) { // if spawning for player 2
            numbers2.push(new Numbers(-500 * numbers2.length, width * 0.75, 2)); // spawn number in P2 x position (right screen)
        }
    }
}

function keyPressed() { // re-randomizes song if decline call button (BS/Tab) are pressefd while on menu
    if (sceneIndex == 0) { // if on menu.. 
        if (keyCode === BACKSPACE || keyCode === TAB) { //if tab or backspace are pressed
            prevSong = songIndex; // stores previous song
            songIndex = int(random(songNames.length)); // rerandomizes song
            if (songIndex == prevSong && songIndex < songNames.length) { // if regenerates the same song
                songIndex++; // increases song index by 1
                songIndex %= songNames.length; // mods by array length
            }
        }
    }
}

function perfectVisual() { //draws a PERFECT!!! text whenever a perfect hit is scored (theres an error margin, perfect hits grant full score and double multiplier value)
    if (perf1 < 1000) {
        textSize(224 * ((1000 - perf1) / 1000));
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width / 5 + random(-200, 200), height / 2, random(1, 5));
        text("PERFECT!!!", width / 5, height / 2);
        perf1 += deltaTime;
    }

    if (perf2 < 1000) {
        textSize(224 * ((1000 - perf2) / 1000));
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width * 0.8 + random(-200, 200), height / 2, random(1, 5));
        text("PERFECT!!!", width * 0.8, height / 2);
        perf2 += deltaTime;
    }
}

function drawConfetti() { // draws confetti
    for (var i = 0; i < ConfettiList.length; i++) {
        if (ConfettiList[i].x < 0 || ConfettiList[i].x > width || ConfettiList[i].y < 0 || ConfettiList[i].y > height) { // if confetti is offscreen
            ConfettiList.splice(i, 1); // removes confetti
        } else {
            ConfettiList[i].Move(); // moves confetti
        }
    }
}

function createConfetti(x, y, count) {
    for (var i = 0; i < count; i++) {
        ConfettiList.push(new confetti(x, y)); // pushes confetti to array
    }
}

class confetti {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.velocity = 1 + random(25); // initial velocity
        this.falloff = this.velocity / random(1, 10); // velocity decreases
        this.dir = random(-1, 1); // direction 
        this.speed = random(10); // random velocity multiplier
    }

    Move() {
        this.y -= this.velocity; // moves on y-axis according to velocity
        this.velocity -= this.falloff; // velocity is reduced by falloff value
        this.x += this.dir * this.speed; // moves on x-axis according to direction and speed
        fill(random(155) + 100, random(155) + 100, random(155) + 100); // randomizes color
        square(this.x, this.y, 5); // draws confetti square
    }
}

function renderGifs() {
    //cleanup gifs if framerate drops
    if (frameRate() <= 40) { // if framerate is too low
        activeGifList.splice(0, activeGifList.length); // remove gif
    }

    for (var i = 0; i < activeGifList.length; i++) {
        activeGifList[i].bling(); // calls bling method for active gifs
    }
    gifTimer += deltaTime; // gif timer increases with time
    if (gifTimer >= gifTimerLimit) { // if timer exceeds limit
        for (var i = 0; i < activeGifList.length; i++) {
            activeGifList.splice(i, 1); // remove gif
        }
        maxActiveGifs = 1; // maximum number of gifs onscreen at once
        gifTimerLimit = random(1000, 5000); // randomizes gif timer limit
        gifTimer = 0; // resets gif timer
    }

    if (activeGifList.length < maxActiveGifs) { // if there are fewer than 1 gifs on screen
        activeGifList.push(new blingee(width / 2 + random(-400, 400), height / 2 + random(-250, 250))); // push new gif
    }

}

function cleanUpGifs(player) {
    //removes gif(s) when called
    if (playerCount == 1) {
        activeGifList.splice(0, activeGifList.length);
    } else {
        if (player == 1) {
            for (var i = 0; i < activeGifList.length; i++) {
                if (activeGifList[i].x <= width / 2) {
                    activeGifList.splice(i, 1);
                }
            }
        } else {
            for (var i = 0; i < activeGifList.length; i++) {
                if (activeGifList[i].x >= width / 2) {
                    activeGifList.splice(i, 1);
                }
            }
        }
    }
}

class blingee { // gif class
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.i = Math.round(random(giflist.length - 1)); // index
        this.w = random(100, 500); // randomizes width
        this.h = random(100, 500); // randomizes height
        this.a = 255 * random(0.1, 0.75); //alpha values work on the 255 RGB scale (randomizes alpha)
        this.lifetime = random(10) * 1000; // timer limit
        this.timer = 0; // timer starts at 0
    }

    correctPos() {
        //ensures gifs spawn within bounds
        if (this.x > width / 2) {
            this.x -= this.w / 2;
        } else {
            this.x += this.w / 2;
        }

        if (this.y > height / 2) {
            this.y -= this.h / 2;
        } else {
            this.y += this.h / 2;
        }
    }

    bling() {
        //draws gif
        imageMode(CENTER);
        tint(255, this.a);
        image(giflist[this.i], this.x, this.y);
        noTint();
        imageMode(CORNER)
    }
}

function drawWaveForm() { //renders a waveform visual based on the audio currently playing, based off https://www.youtube.com/watch?v=uk96O7N1Yo0
    stroke(bgColor); // stroke lerps with background
    noFill();
    strokeWeight(1.5);
    var wave = fft.waveform(); // analyzes audio levels to create waveform
    var waveMult;
    if (scoreMult1 > scoreMult2) { // waveform is scaled by highest score multiplier
        waveMult = scoreMult1;
    } else {
        waveMult = scoreMult2
    }

    beginShape();
    for (var i = 0; i < width; i++) { // constructs waveform
        var index = floor(map(i, 0, width, 0, wave.length));
        var x = i;
        var y = wave[index] * (100 * waveMult) + height / 2;
        vertex(x, y);
    }
    endShape();
}

function renderRipples() {
    for (var i = 0; i < rippleList.length; i++) { // draws ripples around number. Called after hit
        rippleList[i].render();
        if (rippleList[i].r >= width * 2) {
            rippleList.splice(i, 1);
        }
    }
}

class ripple {
    constructor(mult) {
        this.x = random(width);
        this.y = random(height);
        this.r = 1;
        this.speed = mult;
    }

    render() {
        this.r += this.speed * deltaTime;
        stroke(bgColor);
        strokeWeight(1);
        noFill();
        circle(this.x, this.y, this.r);
    }
}

function restart() {
    //called when game resets
    //resets score, song index, and splices all numbers, gifs, confetti & ripples
    score = 0;
    score2 = 0;
    numbers.splice(0, numbers.length);
    numbers2.splice(0, numbers.length);
    activeGifList.splice(0, activeGifList.length);
    ConfettiList.splice(0, ConfettiList.length);
    rippleList.splice(0, rippleList.length);
    playerCount = 0;
    songPlaying = true;
    songIndex = 0;
    sceneIndex = 0;
}