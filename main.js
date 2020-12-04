// Created by Arb Rahim Badsa

//</script><script type="text/babel">
// Thanks a lot to burey sir for suggesting to use babel - you rock sir.



/*///////////////////////////////////////////

Fighting Mania 2.0 

Making an online game was just like a dream to me. And only those who have made their dreans come true, know, how it feels when it truly comes. Now I am feeling like I can do anything. Whatever comes in my mind, I think I can implement via codes. I hope I'll be able to keep it up. Hopefully, no quiz this time (because of having no time). See you next time. And I must, must, obviously thank my dog bro (Raj - Rick Grimes) to help me out test the code. Thanks man. May your phone lives forever. 😐
            
            -- Arb
            -- Dhaka, Bangladesh
            -- 03-04-2020

This is my first ever try to make a fighting game! Hope y'all will like it! Thanks!

    Name : FIGHTING MANIA
    Date : 06 - 09 - 2019
            -- Arb
            
//////////////////////////////////////////*/



////////// Comp. /////////////

let w = innerWidth, h = 544;
let player;
let bgImg;
let bg1, bg2;
let startGame = false;
let toastdelay = 300;
let enemy;
let enemies = [];
let enemies1 = [];
let murder = 0;
let frames = [];
let enemyFrames = [];
let sprites2 = [];
let side = 'left';
/* New Edit */

const db = firebase.database();
const allPlayers = [];
const bgs = [];
let currentUid;
let murders;
let mySudoPlayer;
let allEnemies = [];
let onlineCount = 0;
let clicked = false;



/////// SpriteSheet /////////

let SpriteSheet = {
    Playerlinks : [
    
        {
            l : 'https://i.ibb.co/f2KmkH9/ezgif-4-7e2cbd34f924.png',
            f : 4 // Idle Left - 0
        },
        {
            l : 'https://i.ibb.co/gwNR9HL/Pink-Monster-Idle-4.png',
            f : 4  // Idle Right - 1
        },
        {
            l : 'https://i.ibb.co/nBxpzDr/ezgif-com-reverse-1.png',
            f : 6 // Run Left - 2
        },
        {
            l : 'https://i.ibb.co/y48jg39/Pink-Monster-Run-6.png',
            f : 6 // Run Right - 3
        },
        {
            l : 'https://i.ibb.co/bvnb1qw/ezgif-com-reverse.png',
            f : 6 // Attack Left - 4
        },
        {
            l : 'https://i.ibb.co/89M87Zt/Pink-Monster-Attack2-6.png',
            f : 6  // Attack right - 5
        }
        
    ],
    


    EnemyLinks : [
        
        {
            l : 'https://i.ibb.co/cbSs6Cr/Owlet-Monster-Run-6.png',
            f : 6 // Right
        },
        {
            l : 'https://i.ibb.co/PD5ZxN5/Owlet-Monster-Attack2-6.png',
            f : 6 // Attack Right
        },
        {
            l : 'https://i.ibb.co/8zVgmys/ezgif-com-reverse-2.png',
            f : 6 // Left
        },
        {
            l : 'https://i.ibb.co/dkhFTV8/ezgif-com-reverse-3.png',
            f : 6 // Left Attack
        }
    ],
    
    h : 32,
    w : 32
    
}, sprites = [];

const makeToast = (text, delay) => {
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.classList.add('toast');
    div.innerText = text;
    body.appendChild(div);
    
    setTimeout(() => {
        div.style.bottom = '0';
        
        setTimeout(() => {
            div.style.bottom = '-50px';
        }, 2000);
        
        
    }, delay);
}

const drawToast = () => {
    makeToast('Hello World!', toastdelay);
    makeToast('I am your assistant!', toastdelay + 3000);
    makeToast('Swipe right to go right!', toastdelay + 6000);
    makeToast('Swipe left to go left!', toastdelay + 9000);
    makeToast('Click on the screen to punch!', toastdelay + 12000);
    makeToast('Good Luck, Enjoy - Arb ! 😜', toastdelay + 15000);
    
    
    setInterval(() => {
        makeToast('Kill the blue enemies to get more health!', 0);
    }, toastdelay + 25000);
    
}

/* New Addition - Function */

const addPlayer = () => {
    const uid = uuid();
    const names = ['Arb', 'Ador', 'Tushar'];
    const ranName = names[Math.floor(Math.random() * names.length)];
    currentUid = uid; // set current uid ;)
    const ref = db.ref('/connected/' + uid);
    let name = document.getElementById('name').value;
    name = name.length == 0 ? 'Guest' : name;
    const isOnline = db.ref('.info/connected');
    isOnline.on('value', snap => {
        if (snap.val == false) return;
        ref.onDisconnect().set(null)
        .then(() => {
            const initPlayer = {
                id: uid,
                name: name,
                x: random(0, w-70), // random place for new player
                y: h - 235,
                h: 70,
                w: 70,
                frame: 0, // initial frame (idle),
                punchable: true,
                goLeft: false,
                goRight: false,
                health: 40,
                murder: 0
            };
            ref.set(initPlayer, err => {
                if (!err) {
                    mur.style
                    .display = 'block';
                    load.style
                    .display = 'none';
                    splash.style.display = 'none';
                    bg1 = new Bg(-w, 0, w * 2, h, bgImg);
                    bg2 = new Bg(w, 0, (w * 2) + 5, h, bgImg);
                    bgs.push(bg1);
                    bgs.push(bg2);
                    makeToast(name + ' has joined the game!', 150);
                    document
                    .getElementById('online')
                    .style.display = 'none';
                }
            }); // initial data of user
        });
    });
}

const onlinePlayerCount = () => {
    const ref = db.ref('/connected/');
    ref.once('value').then(snap => {
        let count = 0; 
        const val = snap.val();
        const keys = Object.keys(snap.val());
        for (let i = 0; i < 
        keys.length; i++) {
            const k = keys[i];
            if (val[k].id) count++;
            else {
                if (!val[k].id && val[k].health) db.ref('/connected/' + k).set(null);
            }
        }
        onln.innerText = count;
    }).catch(() => {});
}

const playerEntered = () => {
    const ref = db.ref('/connected/');
    ref.on('child_added', snap => {
        const val = snap.val();
        const player = new Player(val.id, val.name, val.x, val.y, val.w, val.h, frames[val.frame]);
        allPlayers.push(player); // add player to the global all players variable 😁
        const currentPlayer = currentUid == val.id;
        if (!currentPlayer) {
            allEnemies.push(player);
        }
        else {
            mySudoPlayer = player;
        }
    }); // this function initializes the player when someone starts the game <=>[[]]!
}

const playerLeft = () => {
    const ref = db.ref('/connected/');
    ref.on('child_removed' /* newly learned listener, very cool indeed */, snap => {
        const val = snap.val();
        const playerToRemove = val.id;
        for (let i = 0; i < 
        allEnemies.length; i++) {
            // forced to use for loop with i 😆
            const matched = allEnemies[i].id == playerToRemove; // check if matched
            if (matched) {
                const name = allEnemies[i].name; // player name
                const msg = name + ' has left the game';
                //makeToast(msg, 150); // make a toast (not for eating tho)
                //gm.style.height = '100vh';
                allEnemies.splice(i, 1); // if the player left the game, then shouldn't we remove it? We should xD. <!--<_>--[[]]--!> 😉
            }
        }
    });
}

const getPlayerInfo = (id) => {
    return new Promise((resolve, reject) => {
        const ref = db.ref('/connected/' + id);
        ref.once('value').then(snap => {
            const val = snap.val();
            if (!val) return;
            resolve({
                x: val.x,
                y: val.y,
                frame: val.frame,
                punchable: val.punchable,
                goLeft: val.goLeft,
                goRight: val.goRight,
                health: val.health,
                murder: val.murder,
                name: val.name
            });
        });
    });
}

const runLeft = () => {
    if (allPlayers.length > 0) {
        // make sure that at least one player exists ! 
        const ref = db.ref('/connected/' + currentUid);
        const player = allPlayers.find(p => {
            if (p.id == currentUid) return p;
        });
        if (player && player.goLeft) {
            player.runLeft(); // check if player already exits!
            ref.update({x: player.x});
        } 
    }
}

const runRight = () => {
    if (allPlayers.length > 0) {
        // make sure that at least one player exists ! 
        const ref = db.ref('/connected/' + currentUid);
        const player = allPlayers.find(p => {
            if (p.id == currentUid) return p;
        });
        if (player && player.goRight) {
            player.runRight(); // check if player already exits!
            ref.update({x: player.x});
        } 
    }
}

const updatePlayer = (x, frame, punchable, goLeft, goRight, health) => {
    const ref = db.ref('/connected/' + currentUid());
    
}

const detectCollision = (o1, o2) => {
    try {
    if (o1 && o2) {
    const distance = dist(o1.x, o1.y, o2.x, o2.y); // get the distance between the two object;
    const totalWidth = 45; // total width of the two Objects
    if (distance < totalWidth) return true; // if the distance between the objects is less than the total width of the Objects, then they are colliding.. right? 😜 this wasn't that difficult to find. Third chapter is full of this type maths. 😆
    return false;
    }
    } catch(err) {
        return;
    }
}

const fight = () => {
    
    for (let i = 0; 
    i < allEnemies.length; i++) {
        const e = allEnemies[i];
        const collided = detectCollision(mySudoPlayer, e); // detect collision between you and the enemy 😂
        
        if (collided && mySudoPlayer.frames == frames[4] /* Punch frame - left */ || collided && mySudoPlayer.frames == frames[5] /* punch frame - right */) {
            const eHasHealth = e.x + e.health > e.x;
            if (eHasHealth) {
                if (floor(e.health) > 0) {
                    e.health -= 0.1;
                }
                const ref = db.ref('/connected/' + e.id); // if you punch and you are near the enemy, then the enemy should be sick, i mean health should be decrease.... blah blah blah...
                ref.update({health: floor(e.health)});
            }
            else {
                /*const ref = db.ref('/connected/' + e.id);
                ref.set(null); // death 🤪
                makeToast(mySudoPlayer.name + ' murdered ' + e.name, 150);*/
                mySudoPlayer.murder += 1; // you have murdered successfully
                mySudoPlayer.health += 0.3;
                db.ref('/connected/' + mySudoPlayer.id).update({murder: mySudoPlayer.murder});
                db.ref('/connected/' + mySudoPlayer.id).update({health: mySudoPlayer.health});
            }
        }
    }
}

const initFighting = () => {
    const you = allPlayers.find(p => {
        if (p.id == currentUid) return p;
    });
    const enemies = [];
    allPlayers.forEach(p => {
        if (p.id !== currentUid) enemies.push(p);
    });
    
    if (you && allPlayers.length > 0) {
        // make sure that both enemy and player exist.
            fight(); // init fighting
    }
    
}

function preload(){
    
    
    for (let i = 0; i < SpriteSheet.Playerlinks.length; i++){
        sprites[i] = loadImage('https://cors-anywhere.herokuapp.com/' + SpriteSheet.Playerlinks[i].l);
    }
    
    for (let i = 0; i < SpriteSheet.EnemyLinks.length; i++){
        sprites2[i] = loadImage('https://cors-anywhere.herokuapp.com/' + SpriteSheet.EnemyLinks[i].l);
    }
    
    
    
    
    bgImg = loadImage('https://cors-anywhere.herokuapp.com/' + 'https://i.ibb.co/9NYRQ7h/images.jpg');
    
    startGame = true;
    
}



function setup(){
    createCanvas(w, h);
    
    /*if (startGame == true){
        
        //drawToast();
    }*/
    
    ////////// Make Frames ////////
    
    for (let i = 0; i < SpriteSheet.Playerlinks.length; i++){
        frames[i] = __splice__(sprites[i], SpriteSheet.Playerlinks[i].f,  SpriteSheet.w, SpriteSheet.h);
    }
    
     for (let i = 0; i < SpriteSheet.EnemyLinks.length; i++){
        enemyFrames[i] = __splice__(sprites2[i], SpriteSheet.EnemyLinks[i].f,  SpriteSheet.w, SpriteSheet.h);
    }
    
    /* New Addition - 02-04-2020 */
    const start = document.getElementById('startGame');
    start
    .addEventListener('click', () => {
        load.style.display = 'block';
        if (!clicked) addPlayer(); // start adding player ;>
        clicked = true;
        playerEntered(); // when player enters
        playerLeft(); // when player leaves
    });
    /////////////////////////////////////
    
    const restartGame = document.getElementById('restart');
    
    restartGame
    .addEventListener('click', () => {
        addPlayer(); // start adding player ;>
        gm.style.display = 'none';
    });
    
    canvas = document.querySelector('canvas');
    window
    .addEventListener('click', () => {
        allPlayers.forEach(player => {
            const myPlayer = player.id == currentUid;
            if (myPlayer && 
            player.punchable && mySudoPlayer.health > 0) {
                const ref = db.ref('/connected/' + currentUid);
                ref.update({punchable: false});
                if (side === 'left') ref.update({frame: 4});
                else if (side === 'right') ref.update({frame: 5});
                setTimeout(() => {
                    if (side === 'left') ref.update({frame: 0});
                    else if (side === 'right') ref.update({frame: 1});
                    
                    ref.update({punchable: true});
                }, 800);
            }
        }); 
    });
    
    canvas
    .addEventListener('touchend', e => {
        
        allPlayers.forEach(player => {
            const ref = db.ref('/connected/' + currentUid);
            const myPlayer = player.id == currentUid;
            if (myPlayer && mySudoPlayer.health > 0) {
                ref.update({
                    goLeft: false,
                    goRight: false
                });
                if (player.frames == frames[3]) ref.update({frame: 1});
                else if (player.frames == frames[2]) ref.update({frame: 0});
            }
        }); 
    });
    
    
    canvas.addEventListener('touchstart', handleTouchStart, false);

    canvas.addEventListener('touchmove', handleTouchMove, false); 

var xDown = null, yDown = null;
 
function getTouches(evt) { 
    return evt.touches  ||  
    evt.originalEvent.touches;
    } 

function handleTouchStart(evt) { 
    const firstTouch = getTouches(evt)[0]; 
    xDown = firstTouch.clientX; 
    yDown = firstTouch.clientY; 
    }; 
    
function handleTouchMove(evt)   { 
    
    if ( ! xDown || ! yDown ) 
    {  return;  } 
        
    var xUp = evt.touches[0].clientX; 
    var yUp = evt.touches[0].clientY; 
    var xDiff = xDown - xUp; 
    var yDiff = yDown - yUp;
    
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) )     {
        if ( xDiff > 0 ) {
           /* New Additon - 03-04-2020 */
           //allPlayers.forEach(player => {
               const myPlayer = mySudoPlayer.id == currentUid;
               if(myPlayer && mySudoPlayer.health > 0) {
               const ref = db.ref('/connected/' + currentUid);
               ref
               .update({
                   //x: 10,
                   frame: 2,
                   goLeft: true,
                   goRight: false
               });
               side = 'left';
                }
           //});
       } else { 
           /* New Additon - 03-04-2020 */
           //allPlayers.forEach(player => {
               const myPlayer = mySudoPlayer.id == currentUid;
               if(myPlayer && mySudoPlayer.health > 0) {
               const ref = db.ref('/connected/' + currentUid);
               ref
               .update({
                   frame: 3,
                   goLeft: false,
                   goRight: true
               });
               side = 'right';
                }
           //});
       } 
    } 
    
 xDown = null; yDown = null; 
};

    
    /* Deprecated in new addtion instead addPlayer function used - 03-04-2020 */
    
    
    /*player = new Player(w/2 - 70/2, h - 235, 70, 70, frames[0]);
    
    player2 = new Player(random(0, w), h - 235, 70, 70, frames[0]);*/
    
    /* Deprecated in new addtion instead addPlayer function used - 03-04-2020 */
    
    /*setTimeout(() => {
        //setInterval(pushEnemy, 10000);pushEnemy();
        //makeToast('Enemies are coming! Be ready to kill!', 500);
    //}, 18000);
    
    //setTimeout(() => {
        //setInterval(pushEnemy1, 9000);pushEnemy1();
    //}, 20000);
    
    
    function pushEnemy(){
        let enemy = new Enemy(-70, h - 235, 70, 70, enemyFrames[0], 0.5);
        enemies.push(enemy);
    }
    
    function pushEnemy1(){
        let e = new Enemy(w, h - 235, 70, 70, enemyFrames[2], 0.3);
        enemies1.push(e);
    }*/
    //////////////////////
    
}

function draw(){
    background(0);
    /* New Addition Draw Setup */
    /* Bg Setup */
    bgs.forEach(bg => {
        bg.show();
        bg.update();
    });
    //////////////
    /* Player Setup */
    /*for (let player of allPlayers) {
        player.drawPlayer();
        player.updateBydb();
        player.updatePlayer();
    }*/
    if (mySudoPlayer) {
        mySudoPlayer.drawPlayer();
        mySudoPlayer.updateBydb();
        mySudoPlayer.updatePlayer();
    }
    for (let i = 0; i < allEnemies.length; i++) {
        const e = allEnemies[i];
        e.drawPlayer();
        e.updateBydb();
        e.updatePlayer();
    }
    runLeft();
    runRight();
    initFighting();  
    onlinePlayerCount();
    ///////////////
}


/*/-/-/-/-/-/-/ Cut SpriteSheet /-/-/-/-/-/*/


function __splice__(s, n, w, h){

    let frames = [];
    
    for (let i = 0; i < n; i++){
        let span = s.get(i * w, 0, w, h);
        frames.push(span);
    }
    
    return frames;
}

/*/-/-/-/-/-/-/-/ Classes /-/-/-/-/-/-/-/-/*/


class Player{
    
    constructor(id, name, x, y, w, h, fms){
        /* New Edit */
        this.id = id;
        this.name = name;
        ///////////
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.frames = fms;
        this.fps = 0;
        this.speed = 0.35;
        this.punchable = true;
        this.goRight = false;
        this.goLeft = false;
        this.walkspeed = 2.5;
        this.runningSpeed = 2.5 // ms^-1 😆
        this.health = 40;
        this.murder = 0;
    }
    
    /* New addition */
    
    updateBydb() {
        getPlayerInfo(this.id).then(data => {
            this.x = data.x;
            this.frames = frames[data.frame] || frames[0];
            this.punchable = data.punchable;
            this.goRight = data.goRight;
            this.goLeft = data.goLeft;
            this.health = data.health > 40 ? 40 : data.health;
            this.murder = data.murder;
            this.name = data.name;
        });
    }
    
    ////////////////////
    
    drawPlayer(){
        try {
        if (this.health > 0) {
        let i = floor(this.fps) % this.frames.length;
    
        image(this.frames[i], this.x, this.y, this.w, this.h);
        
        noFill();
        rect(this.x + this.w/4, this.y, 40, 5);
        fill('green');
        //noStroke();
        rect((this.x + this.w/4), this.y, this.health, 5);
        fill('red');
        textSize(10);
        text(this.name, (this.x + this.w/2.5), this.y - 5); 
        }
        }
        catch(err) {
            return;
        }
    }
    
    updatePlayer(){
        
        this.fps += this.speed;
        
        if (this.id == currentUid) m.innerText = this.murder;
        
        if (this.health > 40){
            this.health = 40;
        }
        else if (this.health <= 0){
            if (this.id == currentUid) {
                this.health = 0;
                gm.style.display = 'flex';
                gm.style.height = '100vh';
                db.ref('/connected/' + this.id).set(null);
                //noLoop();
            }
        }
        
        
        
    }
    
    /* New Addition */
    
    runLeft() {
        if (this.x > 0 && this.runningSpeed == 2.5) this.x -= this.runningSpeed;
    }
    
    runRight() {
        if (this.x < w - this.w && this.runningSpeed == 2.5) this.x += this.runningSpeed;
    }
    
    /////////////////   
    
}


class Bg{
    constructor(x, y, w, h, img){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.speed = 1;
    }
    
    show(){
        image(this.img, this.x, this.y, this.w, this.h);
    }
    
    update(){
        
        const player = allPlayers.find(p => {
            if (p.id == currentUid) return p;
        });
        
        if (player && player.goLeft == true){
            if (this.x < w * 2){
                this.x += this.speed;
            }
            else
            {
                this.x = -w*2;
            }
        }
        
        if (player && player.goRight == true){
            if (this.x > -w*2){
                this.x -= this.speed;
            }
            else
            {
                this.x = w*2;
            }
        }
        
    }
}

/* Deprecated in new Addtion // instead used player class - 03-04-2020 */

/*class Enemy{
    constructor(x, y, w, h, f, ws){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.frames = f;
        this.speed = 0.15;
        this.fps = 0;
        this.walkspeed = ws;
        this.health = 40;
    }
    
    drawEnemy(){
        this.i = floor(this.fps) % this.frames.length;
        image(this.frames[this.i], this.x, this.y, this.w, this.h);
        
        noFill();
        rect(this.x + this.w/4, this.y, 40, 5);
        fill('green');
        rect((this.x + this.w/4), this.y, this.health, 5);
        fill('red');
        textSize(10);
        text('Enemy', (this.x + this.w/2.5), this.y - 5);
        
    }
    
    updateEnemy(){
        
        this.fps += this.speed;
        
    }
}
*/
console.log = () => {}
