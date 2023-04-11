let sceneIndex = 0;
// 0 = main menu
// 1 = 3,2,1
// 2 = gameplay
// 3 = ending

var startButton; // singleplayer start button
var startButton2; // multiplayer start button
var playerCount = 0; // number of players
let buttonCount = 0; // number of buttons

let timerStart; // time (millis()) when timer begins
let timer; //countdown timer

let score = 0; // P1 scores
let score2 = 0; // P2 scores
let lives = 3; // number of lives

let yThreshold; // Y co-ord where numbers should be input
let numberCount = 3; // # of numbers
let numbers = []; // arrays storing numbers for P1
let numbers2 = []; // arrays storing numbers for P2

//Input variables
var p1Input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; //keyTyped inputs for player 1, numbers 0 through 9
var p2Input = ['p', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o']; //same but for player2, represents numbers 0 through 9

//score multiplier
var scoreMult1 = 1;// score multipliers for P1
var scoreMult2 = 1; // score multipliers for P2
var scoreMultInc = 0.1;
var thresholdHeight = 100;
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
var songNames = [];
var songList = [];
var songIndex = 0;
var prevSong;
var songTitle = "";
var songPlaying = true; //turns to false when song is completed playing

//colors
let bgStart = (190, 150, 30);
let bgNew = (255, 50, 255);
let bgColor;
let amt = 0;

//images
var corners;

//fonts
var font;

//perfect 
//these are timers used to track how long the "perfect" texts are gonna be up
var perf1 = 1000;
var perf2 = 1000;

//confetti
//little particle effects you can have here and there
var ConfettiList = [];

//gifs
//blingeecore early internet stuff i found, stored here
var giflist = [];
var gifCount = 67;
var activeGifList = [];
var maxActiveGifs = 0;
var gifTimerLimit = 0;
var gifTimer = 0;

//waveform
var fft; //idk what this is but the waveform requires it.
var lerpColorSave; //saves the color used for jenna's borders to use for the waveform

//ripples
//expanding hollow circles that are created whenever a number is hit
var rippleList = [];

function preload() {
    //loads songs, fonts and images
    loadSongs();
    loadGifs();
    corners = loadImage('assets/images/corners.png');
    font = loadFont('assets/fonts/DS.ttf');
    maxActiveGifs = 1;
    gifTimerLimit = random(1000, 5000);
}

function loadGifs(){
    //giflist.push(loadImage('assets/gif/gif (1).gif'));
    //testgif = loadImage('gif/gif(1).gif');
    
   for(var i = 0; i < gifCount - 1; i++){
    giflist.push(loadImage('gif/gif(' + (i + 1) + ').gif'));
   }
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
    yThreshold = height - 200;

    bgStart = color(190, 150, 30);
    bgNew = color(255, 50, 255);

    songIndex = int(random(songNames.length));

    textFont(font);

    fft = new p5.FFT();
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
    bgColor = (lerpColor(bgStart, bgNew, amt));
    amt += 0.003;
    if (amt >= 1.5) {
        amt = 0.0;
        bgStart = bgNew;
        bgNew = color(random(255), random(255), random(255));
    }
    background(bgColor);
    lerpColorSave = bgColor;

    rectMode(CENTER);
    noStroke();
    fill(255, 100);
    rect(width / 2, height / 2 + 20, width / 1.13, height / 1.2, 40); // translucent white screen outline
    fill(0);
    rect(width / 2, height / 2 + 20, width / 1.2, height / 1.3, 20); // translucent white screen outline

    image(corners, 0, 0, 1440, 1080); //draws corner cutouts

}

function mainMenu() {
   // print(songIndex);
    //drawing title
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(135);
    stroke(255, 100);
    strokeWeight(20);
    text('MCBLING SPEED TEXTER 3000', width / 2, height / 4);
    noStroke();
    drawSongTitles();
    textSize(60);
    text('Answer call to start', width / 2, height - 250);
    text('Decline call to change song', width / 2, height - 200);

    // old start button code:
    // if (buttonCount < 1) {//drawing start button
    //     startButton = createButton('Start');
    //     startButton.size(200, 100)
    //     startButton.position(width / 2, height / 1.5);
    //     startButton.mousePressed(startCountdown);
    //     buttonCount++;
    // }

    // if (buttonCount < 2) {
    //     startButton2 = createButton('Start 2 player');
    //     startButton2.size(200, 100);
    //     startButton2.position(width / 4, height / 1.5);
    //     startButton2.mousePressed(startCountdown2);
    //     buttonCount++;
    // }

    // if (buttonCount > 1) {
    //     //startButton.remove();
    //     //startButton2.remove();
    // }
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
    // fill(255, 0, 0);
    //rect(0, yThreshold, width, 100);
    //draw and manage gifs
    renderGifs();
    //draw waveForm
    drawWaveForm();
    //draw ripples
    renderRipples();

    rectMode(CENTER);
    if (playerCount == 1) {
        // fill(0, 255, 0, 255 * 0.2);
        fill(166, 123, 0, 255 * 0.2);
        //noFill();
        strokeWeight(2.5);
        stroke(166, 123, 0);
        square(width / 2, yThreshold - 5, thresholdHeight);
    } else if (playerCount == 2) {
        //p1
       //  fill(0, 255, 0, 255 * 0.2);
       fill(166, 123, 0, 255 * 0.2);
       // noFill();
        strokeWeight(2.5);
        stroke(166, 123, 0);
        square(width / 4, yThreshold - 5, thresholdHeight);
        //p2
         fill(193, 193, 193, 255 * 0.2);
        stroke(193, 193, 193);
        square(width * 0.75, yThreshold - 5, thresholdHeight);

    }
    rectMode(CORNER); //just using CENTER to draw the hit zones tbh
    fill(255);
    noStroke();

    

    //draw confetti
    drawConfetti();

    //draw perfect texts and manage their timers
    perfectVisual();

    //spawn numbers
    NumberSpawnerTimer();



    for (i = 0; i < numbers.length; i++) {
        numbers[i].move();
        if (numbers[i].y > height) { //height was yThreshold, now using it as the "hit" area to hit numbers in
            //  lives--; commented out for testing purposes heehee
            scoreMult1 = 1;
            //print('lives ' + lives);
            numbers.splice(i, 1);
          //  cleanUpGifs(1);
        }
    }

    if (playerCount == 2) { //manages movement of numbers for player 2
        for (var j = 0; j < numbers2.length; j++) {
            numbers2[j].move();
            if (numbers2[j].y > height) {
                //there should be player 2 lives here but whatever
                scoreMult2 = 1;
                numbers2.splice(j, 1);
              //  cleanUpGifs(2);
            }
        }
    }

    

    drawBorder();
    drawProgress();

    //game title:
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(80);
    stroke(255, 100);
    strokeWeight(10);
    text('MCBLING SPEED TEXTER 3000', width / 2, 50);
    noStroke();

    printScore();
    // printLives();

    if (lives <= 0) {
        sceneIndex = 3;
    }
    
}

function drawProgress() {
    // draws a progress bar which fills throughout the song
    var x1 = width / 2 - 500;
    var rectWidth = map(songList[songIndex].currentTime(), 0, songList[songIndex].duration(), 0, 1000);
   // print(songList[songIndex].currentTime())

    noFill();
    stroke(255);
    strokeWeight(1);
    rect(x1, height - 50, 1000, 20);
    noStroke()
    fill(255, 200);
    rect(x1, height - 50, rectWidth, 20);


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

    //jenna hotfix from discord
    image(corners, 0, 0, 1440, 1080); //draws corner cutouts
}

function end() {
   // print("running end()");
    textSize(70);
    fill(255);
   // square(width/2, height/2, 100);
    if (playerCount == 1) {
        //  text("Game Over :(", width / 2, height / 2);
        text("Score: " + score, width / 2, height / 2);
    } else if (playerCount == 2) {
        text("" + score, width / 4, height / 4);
        text("" + score2, width * 0.75, height / 4);
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width/2 + random(-300, 300), height/2, random(5, 20));
        textSize(140);
        if (score > score2) {
            text("Player 1 Wins!", width / 2, height / 2);
        } else {
            text("Player 2 Wins!", width / 2, height / 2);
        }
    }
    drawConfetti();
    /*
    startButton.show();
    startButton2.show();*/
}

function startCountdown() { //start button ID is used to tell how many players are playing
    playerCount = 1;
    timerStart = millis();
    sceneIndex = 1;
   // print(sceneIndex);
    startButton.hide();
    startButton2.hide();
}

function startCountdown2() {
    playerCount = 2;
    timerStart = millis();
    sceneIndex = 1;
 //   print(sceneIndex);
    startButton.hide();
    startButton2.hide();
}

function startGame() {
    sceneIndex = 2;
    songList[songIndex].play();
    songList[songIndex].onended(endsong);
}

function endsong() {
  //  print("song has ended");
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
    text("Score: " + score, 150, 170);
    textSize(46 * scoreMult1)
    text("x" + scoreMult1, 150, 205 + (5 * scoreMult1));

    if (playerCount == 2) {
        //p2
        textSize(46);
        textAlign(RIGHT);
        text("Score: " + score2, width - 150, 170);
        textSize(46 * scoreMult2)
        text("x" + scoreMult2, width - 150, 205 + (5 * scoreMult2));
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
        textSize(112);
        text(this.number, this.x, this.y);
        if (this.playerID == 1) {
            this.y += this.speed * scoreMult1;
        } else if (this.playerID == 2) {
            this.y += this.speed * scoreMult2;
        }

    }
}

function keyTyped() { //automatically receives key inputs
    getInput(key);
}

function getInput(value) { //sorts out what to do with key input based on scene index
   // print(value);
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
 //   print("key " + value + " pressed");
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
        //testing purposes
        case 'x':
            sceneIndex = 3;
        break;
    }
}

function endInput(value) {
    switch (value) {
        case "Enter":
        case ' ':
           // sceneIndex = 0;
            restart();
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
   // print("received input " + numberID + "for player " + playerID);
    //check if an onscreen number matches the input
    //the copy pasting of stuff did a fucking number on the formatting fml
    if (playerID == 1) {
        var received = false; //basically if this is true it will stop checking for a number onscreen, so if theres duplicate numbers on screen it should only destroy the closest one.
        for (var l = 0; l < numbers.length; l++) {
            if (!received) {
                if (numberID == numbers[l].number) {
                    if (numbers[l].y >= yThreshold - (thresholdHeight) && numbers[l].y <= yThreshold + (thresholdHeight)){
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
                    if (numbers2[l].y >= yThreshold - (thresholdHeight) && numbers2[l].y <= yThreshold + (thresholdHeight)) {
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
    var confettiCount = random(5, 25);
    var reward = 0;
    var posbonus = 0;
    if (player == 1) {
        if (ypos < yThreshold) {
            posbonus = ypos / yThreshold;
        } else {
            posbonus = yThreshold / ypos;
        }
        posbonus = (posbonus - 0.9) * 10;
        scoreMult1 += scoreMultInc;
        scoreMult1 = Math.round(scoreMult1 * 10) / 10; //the additional math being done makes it so the multiplier is rounded up to 1 digit
        reward = hitScore * scoreMult1;
        reward *= posbonus;
        if(posbonus >= 0.9){//scoring a perfect hit
           // scoreMult1 += scoreMultInc;
            reward = reward * 2;
            perf1 = 0;
            confettiCount *= random(1, 10);
        }
        score += reward;
        score = Math.round(score);
      //  print("posBonus is " + posbonus);
        if(playerCount == 1){
            createConfetti(width / 2, yThreshold, confettiCount);
           // activeGifList.push(new blingee(random(width), random(height)));
        }else{
            createConfetti(width / 4, yThreshold, confettiCount);
           // activeGifList.push(new blingee(random(width/2), random(height)));
        }
        rippleList.push(new ripple(scoreMult1));
       // DoWeCreateGif(1);
    }

    if (player == 2) {
        
        if (ypos < yThreshold) {
            posbonus = ypos / yThreshold;
        } else {
            posbonus = yThreshold / ypos;
        }
        posbonus = (posbonus - 0.9) * 10;
        scoreMult2 += scoreMultInc;
        scoreMult2 = Math.round(scoreMult2 * 10) / 10;
        reward = hitScore * scoreMult2;
        reward *= posbonus;
        if(posbonus >= 0.9){//scoring a perfect hit
         //   scoreMult2 += scoreMultInc;
            reward = reward * 2;
            perf2 = 0;
            confettiCount *= random(1, 10);
        }
        score2 += reward;
        score2 = Math.round(score2);
       // print("posBonus is " + posbonus);
        createConfetti(width * 0.75, yThreshold, confettiCount);
      //  DoWeCreateGif(1);
        //activeGifList.push(new blingee(random(width/2, width), random(height)));
        rippleList.push(new ripple(scoreMult2));
    }

   // print("player " + player + " gains " + reward + " points" + " score multiplier is " + scoreMult1);
}

function DoWeCreateGif(player){ //determines whether or not we create a new gif and if so where to create it, it adds one for every 0.5 multiplier gained.
    if(player == 1){
        if(scoreMult1 % 1 == 0 || scoreMult1 % 1 == 0.5){
            if(playerCount == 1){
                activeGifList.push(new blingee(random(width), random(height)));
            }else{
                activeGifList.push(new blingee(random(width/2), random(height)));
            }
        }
    }else{
        if(scoreMult2 % 1 == 0 || scoreMult2 % 1 == 0.5){
            activeGifList.push(new blingee(random(width/2, width), random(height)));
        }
    }
}

function NumberSpawnerTimer() { //manages timers to spawn numbers for players
    if (songPlaying == true) {
        //p1
        timer1 += deltaTime;
        if (timer1 >= timerLimit1) {
            SpawnNumber(1);
            timer1 = 0;
            timerLimit1 = random(timerMIN * scoreMult1, timerMAX);
        }

        //p2
        if (playerCount == 2) {
            timer2 += deltaTime;
            if (timer2 >= timerLimit2) {
                SpawnNumber(2);
                timer2 = 0;
                timerLimit2 = random(timerMIN * scoreMult2, timerMAX);
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

function keyPressed() {
    if (sceneIndex == 0) { // if on menu.. 
        if (keyCode === BACKSPACE || keyCode === TAB) { //if tab or backspace are pressed
            prevSong = songIndex; // stores previous song
            songIndex = int(random(songNames.length)); // rerandomizes song
            if (songIndex == prevSong && songIndex < songNames.length) {
                songIndex++;
                songIndex %= songNames.length;
            }
        }
    }
}

function perfectVisual(){ //draws a PERFECT!!! text whenever a perfect hit is scored (theres an error margin, perfect hits grant full score and double multiplier value)
    if(perf1 < 1000){
        textSize(224 * ((1000 - perf1) / 1000));
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width / 5 + random(-200, 200), height / 2, random(1, 5));
        text("PERFECT!!!", width / 5, height / 2);
        perf1 += deltaTime;
    }

    if(perf2 < 1000){
        textSize(224 * ((1000 - perf2) / 1000));
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        createConfetti(width * 0.8 + random(-200, 200), height / 2, random(1, 5));
        text("PERFECT!!!", width * 0.8, height / 2);
        perf2 += deltaTime;
    }
}

function drawConfetti(){
    for(var i = 0; i < ConfettiList.length; i++){
        if(ConfettiList[i].x < 0 || ConfettiList[i].x > width || ConfettiList[i].y < 0 || ConfettiList[i].y > height){
            ConfettiList.splice(i, 1);
        }else{
            ConfettiList[i].Move();
        }
    }
}

function createConfetti(x, y, count){
    for(var i = 0; i < count; i++){
        ConfettiList.push(new confetti(x, y));
    }
}

class confetti{
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
       // this.color = color(random(155) + 100, random(155) + 100, random(155) + 100);
        this.velocity = 1 + random(25);
        this.falloff = this.velocity / random(1, 10);
        this.dir = random(-1, 1);
        this.speed = random(10);
    }

    Move(){
        this.y -= this.velocity;
        this.velocity -= this.falloff;
        this.x += this.dir * this.speed;
        fill(random(155) + 100, random(155) + 100, random(155) + 100);
        square(this.x, this.y, 5);
    }
}

function renderGifs(){
    //cleanup gifs if framerate drops
    if(frameRate() <= 40){
        activeGifList.splice(0,activeGifList.length);
    }

    for(var i = 0; i < activeGifList.length; i++){
        activeGifList[i].bling();
    }
    gifTimer += deltaTime;
    if(gifTimer >= gifTimerLimit){
        for(var i = 0; i < activeGifList.length; i++){
            activeGifList.splice(i,1);
        }
        maxActiveGifs = 1;
        gifTimerLimit = random(1000, 5000);
        gifTimer = 0;
    }

    if(activeGifList.length < maxActiveGifs){
        activeGifList.push(new blingee(width/2 + random(-400, 400),height/2 + random(-250, 250)));
    }
    
}

function cleanUpGifs(player){
    if(playerCount == 1){
        activeGifList.splice(0, activeGifList.length);
    }else{
        if(player == 1){
            for(var i = 0; i < activeGifList.length; i++){
                if(activeGifList[i].x <= width/2){
                    activeGifList.splice(i, 1);
                }
            }
        }else{
            for(var i = 0; i < activeGifList.length; i++){
                if(activeGifList[i].x >= width/2){
                    activeGifList.splice(i, 1);
                }
            }
        }
    }
}

class blingee{
    constructor(posX, posY){
        this.x = posX;
        this.y = posY;
        this.i = Math.round(random(giflist.length - 1));
        this.w = random(100, 500);
        this.h = random(100, 500);
        this.a = 255 * random(0.1, 0.75); //alpha values work on the 255 RGB scale
        this.lifetime = random(10) * 1000;
        this.timer = 0;
        //this.correctPos();
    }

    correctPos(){ //this makes it so the gifs should be rendered out of bounds, ish
      //  print("running correctPos");
        if(this.x > width / 2){
            this.x -= this.w / 2;
        }else{
            this.x += this.w / 2;
        }

        if(this.y > height/2){
            this.y -= this.h / 2;
        }else{
            this.y += this.h / 2;
        }
    }

    bling(){
        imageMode(CENTER);
        tint(255, this.a);
       // image(this.image, this.x, this.y);
       // image(this.i, this.x, this.y, 100, 100);
        image(giflist[this.i], this.x, this.y);
        noTint();
        imageMode(CORNER)
       // this.timer += deltaTime;
    }
}

function drawWaveForm(){ //renders a waveform visual based on the audio currently playing, based off https://www.youtube.com/watch?v=uk96O7N1Yo0
   // rectMode(CORNER);
    //print("running drawWaveForm");
   // stroke(random(155) + 100, random(155) + 100, random(155) + 100);
    stroke(bgColor);
    noFill();
    strokeWeight(1.5);
    var wave = fft.waveform();
    var waveMult;
    if(scoreMult1 > scoreMult2){
        waveMult = scoreMult1;
    }else{
        waveMult = scoreMult2
    }

    beginShape();
    for(var i = 0; i < width; i++){
      //  print("drawing point " + i);
        //var index = floor(map((i, 0, width, 0, wave.length)));
        var index = floor(map(i, 0, width,0, wave.length));
        var x = i;
        var y = wave[index] * (100 * waveMult) + height / 2;
       // point(x, y);
        //square(x, y, 5);
        vertex(x, y);

    }
    endShape();
}

function renderRipples(){
    for(var i = 0;i < rippleList.length; i++){
        rippleList[i].render();
        if(rippleList[i].r >= width * 2){
            rippleList.splice(i, 1);
        }
    }
}

class ripple{
    constructor(mult){
        this.x = random(width);
        this.y = random(height);
        this.r = 1;
        this.speed = mult;
    }

    render(){
        this.r += this.speed * deltaTime;
        stroke(bgColor);
        strokeWeight(1);
        noFill();
        circle(this.x, this.y, this.r);
    }
}

function restart(){
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