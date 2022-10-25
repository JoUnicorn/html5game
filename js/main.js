var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 800,
        height: 600
    },
/*    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: 800,
        height: 600,
        min: {
            width: 400,
            height: 300
        },
        max: {
            width: 800,
            height: 600
        }
    },
*/
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: true
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var girl;
var robot;
var girl2;
var zombie;
var mushroom;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var timedEvent;
var rt;
var fireball;
var fireFX;

// modal
var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 120;
var lineDelay = 400;
var content;
var content2;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map2.json');
    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    //this.load.image('coin', 'assets/coinGold.png');
    this.load.image('mushroom', 'assets/mushroom.png');
    this.load.image('fire', 'assets/muzzleflash3.png');
    // player animations
    this.load.atlas('player', 'assets/jo.png', 'assets/jo.json');
    this.load.atlas('girl', 'assets/girl.png', 'assets/girl.json');
    this.load.atlas('ennemy1', 'assets/ennemy1.png', 'assets/ennemy1.json');
    this.load.atlas('ennemy2', 'assets/ennemy2.png', 'assets/ennemy2.json');
    this.load.atlas('robot', 'assets/ennemy3.png', 'assets/ennemy3.json');
    this.load.atlas('zombie', 'assets/ennemy4.png', 'assets/ennemy4.json');
}

function create() {
    // load the map
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // coin image used as tileset
    //var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    //coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite
    player = this.physics.add.sprite(100, 200, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-40);
    player.body.setOffset(0, 40);
    //player.setScale(.6);
    player.scaleX=.6;
    player.scaleY=.6;

    // player will collide with the level tiles
    this.physics.add.collider(groundLayer, player);

    //coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin
    // will be called
    //this.physics.add.overlap(player, coinLayer);

    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'character_maleAdventurer_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'character_maleAdventurer_idle'}],
        frameRate: 10,
    });

    //////////
    //gitl
    girl = this.physics.add.sprite(700, 200, 'girl');
    girl.setBounce(0.2); // our player will bounce from items
    girl.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, girl);
    // player walk animation
    this.anims.create({
        key: 'walk_g',
        frames: this.anims.generateFrameNames('girl', {prefix: 'character_femalePerson_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle_g',
        frames: [{key: 'girl', frame: 'character_femalePerson_idle'}],
        frameRate: 10,
    });
    girl.body.setSize(girl.width, girl.height-40);
    girl.body.setOffset(0, 40);
    girl.scaleX=.9;
    girl.scaleY=.9;
    //////
    //////////
    //robot
    robot = this.physics.add.sprite(600, 200, 'robot');
    robot.setBounce(0.2); // our player will bounce from items
    robot.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, robot);
    this.anims.create({
        key: 'walk_r',
        frames: this.anims.generateFrameNames('robot', {prefix: 'character_robot_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle_r',
        frames: [{key: 'robot', frame: 'character_robot_idle'}],
        frameRate: 10,
    });
    robot.body.setSize(robot.width, robot.height-40);
    robot.body.setOffset(0, 40);
    //////
    //mushroom
    mushroom = this.physics.add.sprite(458, 200, 'mushroom');
    mushroom.setBounce(0.2); // our player will bounce from items
    mushroom.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, mushroom);
    mushroom.scaleX=2;
    mushroom.scaleY=2;
    mushroom.alpha = 0;
    robot.anims.play('idle_r', true);
    //////
    //zombie
    zombie = this.physics.add.sprite(3000, 200, 'zombie');
    zombie.setBounce(0.2); // our player will bounce from items
    zombie.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, zombie);
    this.anims.create({
        key: 'walk_z',
        frames: this.anims.generateFrameNames('zombie', {prefix: 'character_zombie_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle_z',
        frames: [{key: 'zombie', frame: 'character_zombie_idle'}],
        frameRate: 10,
    });
    zombie.body.setSize(zombie.width, zombie.height-40);
    zombie.body.setOffset(0, 40);
    zombie.scaleX=3;
    zombie.scaleY=3;
    zombie.anims.play('idle_z', true);
    //////
    //fire
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    fireball = this.add.follower(null, 50, 350, 'fire');
    fireball.visible=false;

    fireFX = this.tweens.add({
        targets: fireball,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 300,
        ease: "Cubic.easeOut",
        onComplete: function () { rt.clear(); fireball.alpha = 0 },
        paused: true
    });

    fireFX.setCallback('onUpdate', draw, [], this);
    /////

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    // modal
    var bubbleWidth = 320;
    var bubbleHeight = 160;
    var bubblePadding = 10;
    var bubble = this.add.graphics({ x: 20, y: 100 });
    bubble.setScrollFactor(0);
    var bubble2 = this.add.graphics({ x: 460, y: 100 });
    bubble2.setScrollFactor(0);
    timedEvent = this.time.delayedCall(5000, createSpeechBubble, [bubble, bubbleWidth, bubbleHeight, bubblePadding], this);
    timedEvent = this.time.delayedCall(5000, createSpeechBubble2, [bubble2, bubbleWidth, bubbleHeight, bubblePadding], this);
    timedEvent = this.time.delayedCall(7000, createSpeechBubbleVisible, [bubble, 0], this);
    timedEvent = this.time.delayedCall(7000, createSpeechBubbleVisible, [bubble2, 0], this);
    //timedEvent = this.time.delayedCall(13000, createSpeechBubbleVisible, [bubble, 1], this);

    var quote="The sky above the port was the color of television, tuned to a dead channel."
    content = this.add.text(0, 0, "", { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
    content.setPosition(bubble.x + 10, bubble.y + 10);
    content.setScrollFactor(0);
    var quote2="Get the source and assets for every Phaser example from"
    content2 = this.add.text(0, 0, "", { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
    content2.setPosition(bubble2.x + 10, bubble2.y + 10);
    content2.setScrollFactor(0);
    timedEvent = this.time.delayedCall(5500, createSpeechInBubble, [quote], this);
    timedEvent = this.time.delayedCall(5500, createSpeechInBubble2, [quote2], this);
    timedEvent = this.time.delayedCall(12000, createSpeechInBubbleDestroy, [], this);


    // gr
    timedEvent = this.time.delayedCall(3000, startWalking_gr, [], this);
    timedEvent = this.time.delayedCall(10300, stopWalking_gr, [], this);

    //jo
    timedEvent = this.time.delayedCall(6000, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(7800, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(8300, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(8350, mushroom_ease, [], this);
    timedEvent = this.time.delayedCall(8500, startWalking_mus, [], this);
    timedEvent = this.time.delayedCall(12500, stopWalking_mus, [], this);
    timedEvent = this.time.delayedCall(10500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(12500, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(12500, eat_mus, [], this);
    timedEvent = this.time.delayedCall(15500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(19500, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(23500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(33500, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(30500, generate, [3500,1700], this);

    //timedEvent = this.time.delayedCall(10000, rescale_jo, [], this);
    //timedEvent = this.time.delayedCall(10500, startWalking_jo, [], this);
    //timedEvent = this.time.delayedCall(12500, stopWalking_jo, [], this);
}

function generate(x, y)
{
    fireball.setPosition(player.x, player.y).setScale(0.5).setAlpha(1);

    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(player.x, player.y), new Phaser.Math.Vector2(x, y));

    fireball.setPath(curve);
    fireball.startFollow(300);

    fireFX.restart();
}

function draw()
{
    rt.draw(fireball);
}

function startWalking_gr()
{
    girl.body.setVelocityX(200);
    girl.anims.play('walk_g', true);
    girl.flipX = false; // use the original sprite looking to the right
    robot.body.setVelocityX(200);
    robot.anims.play('walk_r', true);
    robot.flipX = false; // use the original sprite looking to the right
}
function stopWalking_gr()
{
    girl.body.setVelocityX(0);
    girl.anims.play('idle_g', true);
    robot.body.setVelocityX(0);
    robot.anims.play('idle_r', true);
}

function startWalking_mus()
{
    mushroom.body.setVelocityX(100);
    mushroom.flipX = false; // use the original sprite looking to the right
}
function stopWalking_mus()
{
    mushroom.body.setVelocityX(0);
}

function startWalking_jo()
{
    player.body.setVelocityX(200);
    player.anims.play('walk', true);
    player.flipX = false; // use the original sprite looking to the right
}
function stopWalking_jo()
{
    player.body.setVelocityX(0);
    player.anims.play('idle', true);
}

function startJumping_jo()
{
    player.body.setVelocityY(-500);
}

function mushroom_ease()
{
    this.tweens.add({
        targets: mushroom,
        alpha: 1,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });
}

function rescale_jo()
{
    this.tweens.add({
        targets: player,
        scale: 1,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });

}

// this function will be called when the player touches a coin
function eat_mus() {
  this.tweens.add({
      targets: mushroom,
      alpha: 0,
      yoyo: false,
      duration: 2000,
      ease: 'Sine.easeInOut'
  });
  this.tweens.add({
      targets: player,
      scale: 1,
      yoyo: false,
      duration: 2000,
      ease: 'Sine.easeInOut'
  });

}

function createSpeechBubble (bubble, width, height,padding)
{
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = padding;
    var arrowHeight = bubbleHeight / 4;

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 7);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) * 2);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 7);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

}

function createSpeechBubbleVisible(bubble,yn)
{
    if (yn==0)
    {
        bubble.visible=false;
    }else{
        bubble.visible=true;
    }
}

function createSpeechInBubbleVisible(content,yn)
{
    if (yn==0)
    {
        content.visible=false;
    }else{
        content.visible=true;
    }
}

function createSpeechInBubbleDestroy()
{
    content.text ="";
}

function createSpeechInBubbleDestroy2()
{
    content2.text ="";
}

function createSpeechBubble2 (bubble, width, height,padding)
{
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = padding;
    var arrowHeight = bubbleHeight / 4;

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor((bubbleWidth / 7)*5);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) )+Math.floor((bubbleWidth / 7)*5);
    var point2Y = bubbleHeight;
    var point3X = Math.floor((bubbleWidth / 7) )+Math.floor((bubbleWidth / 7)*5);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

}

function createSpeechInBubble (quote)
{

  //console.log(quote)

  line = quote.split(' ');
  //console.log(line)
  wordIndex = 0;

  //console.log(line.length)
  //console.log(this.time)
  this.time.addEvent({
      delay: wordDelay,                // ms
      callback: nextWord,
      //args: [],
      callbackScope: this,
      repeat: line.length
  });
  //this.time.events.repeat(wordDelay, line.length, nextWord, this);

}

function nextWord() {

    //  Add the next word onto the text string, followed by a space
    //console.log(content)
    if (typeof line[wordIndex] !== 'undefined')
    {
        content.text = content.text.concat(line[wordIndex] + " ");
    }

    //  Advance the word index to the next word in the line
    wordIndex++;

    //  Last word?
    if (wordIndex === line.length)
    {
        //  Add a carriage return
        content.text = content.text.concat("");
    }

}

function createSpeechInBubble2 (quote)
{

  //console.log(quote)

  line2 = quote.split(' ');
  //console.log(line)
  wordIndex2 = 0;

  //console.log(line2.length)
  //console.log(this.time)
  this.time.addEvent({
      delay: wordDelay,                // ms
      callback: nextWord2,
      //args: [],
      callbackScope: this,
      repeat: line2.length
  });
  //this.time.events.repeat(wordDelay, line.length, nextWord, this);

}

function nextWord2() {

    //  Add the next word onto the text string, followed by a space
    //console.log(content)
    //console.log(line2[wordIndex2])
    if (typeof line2[wordIndex2] !== 'undefined')
    {
        content2.text = content2.text.concat(line2[wordIndex2] + " ");
    }

    //  Advance the word index to the next word in the line
    wordIndex2++;

    //  Last word?
    if (wordIndex2 === line2.length)
    {
        //  Add a carriage return
        content2.text = content2.text.concat("");
    }

}

function update(time, delta) {
    // anim


/*
    // controller
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump
    if (cursors.up.isDown && player.body.onFloor())
    {
        //infoText.setText('compt: ' + player.body.velocity.y);
        player.body.setVelocityY(-500);
        //infoText.setText('compt: ' + player.body.velocity.y);
    }
*/
}
