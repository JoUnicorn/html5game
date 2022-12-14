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
            debug: false
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
var arrow;
var boom2;

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
    this.load.image('boom', 'assets/muzzleflash2.png');
    this.load.image('boom2', 'assets/sparkle1.png');
    this.load.image('arrow', 'assets/arrow.png');
    this.load.image('cherry', 'assets/Tiles/cherry.png');
    this.load.image('candyRed', 'assets/Tiles/candyRed.png');
    this.load.image('gummyWormGreenHead', 'assets/Tiles/gummyWormGreenHead.png');
    this.load.image('creamPink', 'assets/Tiles/creamPink.png');
    this.load.image('heart', 'assets/Tiles/heart.png');
    this.load.image('lollipopRed', 'assets/Tiles/lollipopRed.png');
    this.load.image('wafflePink', 'assets/Tiles/wafflePink.png');
    // player animations
    this.load.atlas('player', 'assets/jo.png', 'assets/jo.json');
    this.load.atlas('girl', 'assets/girl.png', 'assets/girl.json');
    this.load.atlas('ennemy1', 'assets/ennemy1.png', 'assets/ennemy1.json');
    this.load.atlas('girl2', 'assets/ennemy2.png', 'assets/ennemy2.json');
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

    //decors
    cherry = this.physics.add.sprite(4600, 200, 'cherry');
    cherry.setBounce(0.2); // our player will bounce from items
    cherry.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, cherry);
    candyRed = this.physics.add.sprite(4700, 200, 'candyRed');
    candyRed.setBounce(0.2); // our player will bounce from items
    candyRed.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, candyRed);
    gummyWormGreenHead = this.physics.add.sprite(4800, 200, 'gummyWormGreenHead');
    gummyWormGreenHead.setBounce(0.2); // our player will bounce from items
    gummyWormGreenHead.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, gummyWormGreenHead);
    creamPink = this.physics.add.sprite(4900, 200, 'creamPink');
    creamPink.setBounce(0.2); // our player will bounce from items
    creamPink.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, creamPink);
    heart = this.physics.add.sprite(5000, 200, 'heart');
    heart.setBounce(0.2); // our player will bounce from items
    heart.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, heart);
    heart = this.physics.add.sprite(5200, 200, 'heart');
    heart.setBounce(0.2); // our player will bounce from items
    heart.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, heart);
    lollipopRed = this.physics.add.sprite(5400, 200, 'lollipopRed');
    lollipopRed.setBounce(0.2); // our player will bounce from items
    lollipopRed.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, lollipopRed);
    wafflePink = this.physics.add.sprite(5300, 200, 'wafflePink');
    wafflePink.setBounce(0.2); // our player will bounce from items
    wafflePink.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, wafflePink);
    //////

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
    //gitl
    girlv = this.physics.add.sprite(7350, 200, 'girl');
    girlv.setBounce(0.2); // our player will bounce from items
    girlv.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, girlv);
    girlv.body.setSize(girlv.width, girlv.height-40);
    girlv.body.setOffset(0, 40);
    girlv.scaleX=.9;
    girlv.scaleY=.9;
    //////
    //////////
    //robot
    robot = this.physics.add.sprite(600, 200, 'robot');
    robot.setBounce(0.2); // our player will bounce from items
    robot.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, robot);
    this.anims.create({
        key: 'attack_r',
        frames: this.anims.generateFrameNames('robot', {prefix: 'character_robot_attack', end: 3, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
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
    robot.anims.play('idle_r', true);
    //////
    //robot2
    robot2 = this.physics.add.sprite(7200, 200, 'robot');
    robot2.setBounce(0.2); // our player will bounce from items
    robot2.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, robot2);
    robot2.body.setSize(robot2.width, robot2.height-40);
    robot2.body.setOffset(0, 40);
    robot2.anims.play('idle_r', true);
    this.anims.create({
        key: 'hit_r',
        frames: [{key: 'robot', frame: 'character_robot_hit'}],
        frameRate: 10,
    });
    //////
    //girl2
    girl2 = this.physics.add.sprite(5100, 200, 'girl2');
    girl2.setBounce(0.2); // our player will bounce from items
    girl2.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, girl2);
    this.anims.create({
        key: 'walk_gr',
        frames: this.anims.generateFrameNames('girl2', {prefix: 'character_femaleAdventurer_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle_gr',
        frames: [{key: 'girl2', frame: 'character_femaleAdventurer_idle'}],
        frameRate: 10,
    });
    girl2.body.setSize(girl2.width, girl2.height-40);
    girl2.body.setOffset(0, 40);
    girl2.anims.play('idle_gr', true);
    //////
    //mushroom
    mushroom = this.physics.add.sprite(458, 200, 'mushroom');
    mushroom.setBounce(0.2); // our player will bounce from items
    mushroom.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, mushroom);
    mushroom.scaleX=2;
    mushroom.scaleY=2;
    mushroom.alpha = 0;
    //////
    //zombie
    zombie = this.physics.add.sprite(3000, 1600, 'zombie');
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
    this.anims.create({
        key: 'hit_z',
        frames: [{key: 'zombie', frame: 'character_zombie_hit'}],
        frameRate: 10,
    });
    this.anims.create({
        key: 'kick_z',
        frames: [{key: 'zombie', frame: 'character_zombie_kick'}],
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
    //boom
    boom = this.physics.add.sprite(zombie.x, zombie.y, 'boom');
    boom.setBounce(0.2); // our player will bounce from items
    boom.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, boom);
    boom.scaleX=2;
    boom.scaleY=2;
    boom.alpha = 0;
    //////
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
    this.anims.create({
        key: 'shoveBack',
        frames: [{key: 'player', frame: 'character_maleAdventurer_shoveBack'}],
        frameRate: 10,
    });
    this.anims.create({
        key: 'down',
        frames: [{key: 'player', frame: 'character_maleAdventurer_down'}],
        frameRate: 10,
    });

    //camera
    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setFollowOffset(-250, 150);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '50', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    arrow = this.add.image(130, 577, 'arrow');
    arrow.setScrollFactor(0);
    arrow.visible=false;

    // modal
    var bubbleWidth = 320;
    var bubbleHeight = 160;
    var bubblePadding = 10;
    var bubble = this.add.graphics({ x: 20, y: 100 });
    bubble.setScrollFactor(0);
    var bubble2 = this.add.graphics({ x: 460, y: 100 });
    bubble2.setScrollFactor(0);

    content = this.add.text(0, 0, "", { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
    content.setPosition(bubble.x + 10, bubble.y + 10);
    content.setScrollFactor(0);
    content2 = this.add.text(0, 0, "", { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding ) } });
    content2.setPosition(bubble2.x + 10, bubble2.y + 10);
    content2.setScrollFactor(0);

    // dialog
    timedEvent = this.time.delayedCall(1000, createSpeechBubble, [bubble, bubbleWidth, bubbleHeight, bubblePadding], this);
    timedEvent = this.time.delayedCall(1000, createSpeechBubble2, [bubble2, bubbleWidth, bubbleHeight, bubblePadding], this);
    //timedEvent = this.time.delayedCall(13000, createSpeechBubbleVisible, [bubble, 1], this);
    var quote="Who are you? and what are you doing with my Vivi???????"
    timedEvent = this.time.delayedCall(1200, createSpeechInBubble, [quote], this);
    var quote2="My name is Vetrox and i just kidnapped your Vivi, you will never see her again"
    timedEvent = this.time.delayedCall(5000, createSpeechInBubble2, [quote2], this);
    timedEvent = this.time.delayedCall(8000, createSpeechInBubbleDestroy, [], this);

    quote="What???? You will never be able to escape!"
    timedEvent = this.time.delayedCall(8500, createSpeechInBubble, [quote], this);
    timedEvent = this.time.delayedCall(12000, createSpeechInBubbleDestroy, [], this);

    quote="If you let my Vivi go now, that'll be the end of it. I will not look for you, I will not pursue you. But if you don't, I will look for you, I will find you, and I will kill you. "
    timedEvent = this.time.delayedCall(12500, createSpeechInBubble, [quote], this);
    timedEvent = this.time.delayedCall(19500, createSpeechInBubbleDestroy2, [], this);
    quote2="Good luck!\n\n Save me Jooooooooooooo oooooooooooooo oooooooooooooooooo oooooooooooooooooooo"
    timedEvent = this.time.delayedCall(20000, createSpeechInBubble2, [quote2], this);
    timedEvent = this.time.delayedCall(23500, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(24500, createSpeechInBubbleDestroy2, [], this);
    quote="I am going to save you Viviiiiiiiiiiiii"
    timedEvent = this.time.delayedCall(24000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(26000, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(26000, createSpeechBubbleVisible, [bubble, 0], this);
    timedEvent = this.time.delayedCall(24500, createSpeechBubbleVisible, [bubble2, 0], this);

    // gr
    timedEvent = this.time.delayedCall(24500, startWalking_gr, [], this);
    timedEvent = this.time.delayedCall(32300, stopWalking_gr, [], this);

    //jo
    timedEvent = this.time.delayedCall(26000, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(27800, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(28300, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(28350, mushroom_ease, [], this);
    timedEvent = this.time.delayedCall(28500, startWalking_mus, [], this);
    timedEvent = this.time.delayedCall(32500, stopWalking_mus, [], this);
    timedEvent = this.time.delayedCall(30500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(32500, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(32500, eat_mus, [], this);
    quote="mmmmmmmmm a good salad with a lot of vegetables and avocado, I'm feeling much better now, and I have much more energy, I am going to save you Vivi! (my life is now equal to 200)"
    timedEvent = this.time.delayedCall(33000, createSpeechBubbleVisible, [bubble, 1], this);
    timedEvent = this.time.delayedCall(35000, createSpeechInBubble, [quote], this);
    for (let i = 0; i < 20; i++) {
        timedEvent = this.time.delayedCall(32000+i*200, lifebar_vis, [], this);
        timedEvent = this.time.delayedCall(32100+i*200, lifebar_nvis, [], this);
    }
    timedEvent = this.time.delayedCall(41000, createSpeechInBubbleDestroy, [], this);
    quote="I also ate vitamies B, Vivi :)"
    timedEvent = this.time.delayedCall(41000, createSpeechInBubble, [quote], this);
    timedEvent = this.time.delayedCall(45000, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(45000, createSpeechBubbleVisible, [bubble, 0], this);

    timedEvent = this.time.delayedCall(45500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(49800, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(53500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(59000, stopWalking_jo, [], this);
    quote="Who are you? What do you want?"
    timedEvent = this.time.delayedCall(59000, createSpeechBubbleVisible, [bubble, 1], this);
    timedEvent = this.time.delayedCall(59500, createSpeechInBubble, [quote], this);
    quote="My name is Zombia and I work for Vetrox. I am here to prevent you to catch Vetrox. Sorry but you have to die. I am going to kick your ass."
    timedEvent = this.time.delayedCall(59000, createSpeechBubbleVisible, [bubble2, 1], this);
    timedEvent = this.time.delayedCall(62000, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(68000, createSpeechInBubbleDestroy, [], this);
    quote="I m not afraid of you and i will kick you ass too. You are soooo ugly, your skin is green and ugly. You should use a moisturizing cream as Vivi taught me to do :)"
    timedEvent = this.time.delayedCall(68000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(78500, createSpeechInBubbleDestroy2, [], this);
    quote="Grrrrrrr, I am going to kill you, you filthy vermin."
    timedEvent = this.time.delayedCall(78500, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(82000, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(82000, createSpeechInBubbleDestroy2, [], this);
    timedEvent = this.time.delayedCall(82000, createSpeechBubbleVisible, [bubble2, 0], this);
    timedEvent = this.time.delayedCall(82500, fight, [], this);
    quote="Aughhhhhhhhhhh! I got hurt (I lost 50 points of life)"
    timedEvent = this.time.delayedCall(83000, createSpeechInBubble, [quote], this);
    for (let i = 0; i < 20; i++) {
        timedEvent = this.time.delayedCall(82000+i*200, lifebar_vis, [], this);
        timedEvent = this.time.delayedCall(82100+i*200, lifebar_nvis, [], this);
    }
    timedEvent = this.time.delayedCall(84500, idlezom, [], this);
    timedEvent = this.time.delayedCall(85000, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(85500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(87000, stopWalking_jo, [], this);
    //timedEvent = this.time.delayedCall(28100, move_camera, [], this);
    timedEvent = this.time.delayedCall(87000, createSpeechInBubbleDestroy, [], this);
    quote="I am going to kill you with the power of LOVE => be ready for my fireball, ugly green monster"
    timedEvent = this.time.delayedCall(87000, createSpeechInBubble, [quote], this);
    timedEvent = this.time.delayedCall(90500, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(90500, createSpeechBubbleVisible, [bubble, 0], this);
    timedEvent = this.time.delayedCall(90500, generate, [zombie.x,zombie.y], this);
    timedEvent = this.time.delayedCall(93500, burn, [], this);
    timedEvent = this.time.delayedCall(94500, boom_disa, [], this);

    // the ladder
    timedEvent = this.time.delayedCall(94500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(100300, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(103100, reverseWalking_jo, [], this);
    timedEvent = this.time.delayedCall(103600, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(106100, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(106600, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(108500, startJumping_jo, [], this);

    //the queen
    timedEvent = this.time.delayedCall(110500, stopWalking_jo, [], this);
    quote="A new ennemy? Who are you?"
    timedEvent = this.time.delayedCall(110500, createSpeechBubbleVisible, [bubble, 1], this);
    timedEvent = this.time.delayedCall(111000, createSpeechInBubble, [quote], this);
    quote="I am the queen of love and candies. I am here to push you to forget Vivi"
    timedEvent = this.time.delayedCall(110500, createSpeechBubbleVisible, [bubble2, 1], this);
    timedEvent = this.time.delayedCall(115000, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(125000, createSpeechInBubbleDestroy, [], this);
    quote="What?? What are you talking about? I will never forget Vivi, Vivi is my soulmate, our connection/love is stronger that anything in this world."
    timedEvent = this.time.delayedCall(125000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(135000, createSpeechInBubbleDestroy2, [], this);
    quote="Look at me, I am the queen of love, I am beautiful and I can make you happy Jo. Please forget Vivi and come with me, you won't regret it."
    timedEvent = this.time.delayedCall(135000, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(145000, createSpeechInBubbleDestroy, [], this);
    quote="Get out of my way and look for someone else. In Vivi's eyes i see a the reflection of my soul, she's the one I have been waiting for all my life. "
    timedEvent = this.time.delayedCall(145000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(155000, createSpeechInBubbleDestroy, [], this);
    quote="Spending time with Vivi is soooo precious for me, I love evey seconds we are together and no one in this world can prevent me to spend the rest of my life with her"
    timedEvent = this.time.delayedCall(155000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(165000, createSpeechInBubbleDestroy, [], this);
    quote="So, once again, get out my way and find someone else: you will never be able to be between Vivi and i, so forget this idea!"
    timedEvent = this.time.delayedCall(165000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(175000, createSpeechInBubbleDestroy2, [], this);
    quote="Oh my god, are you rejecting me right now. I have never been so humiliated. Go away bastard."
    timedEvent = this.time.delayedCall(175000, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(185000, createSpeechInBubbleDestroy, [], this);
    quote="Bye, and please eat a lot of candies and become the queen of fat people (and no more the queen of love) haha."
    timedEvent = this.time.delayedCall(185000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(195000, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(195000, createSpeechInBubbleDestroy2, [], this);
    timedEvent = this.time.delayedCall(195000, createSpeechBubbleVisible, [bubble, 0], this);
    timedEvent = this.time.delayedCall(195000, createSpeechBubbleVisible, [bubble2, 0], this);

    // the ladder
    timedEvent = this.time.delayedCall(196000, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(201000, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(202500, startJumping_jo, [], this);

    //the boss
    timedEvent = this.time.delayedCall(207000, stopWalking_jo, [], this);
    quote="I tracked you down Vetrox. You can't escape anymore. Are you ok Vivi?"
    timedEvent = this.time.delayedCall(207000, createSpeechBubbleVisible, [bubble, 1], this);
    timedEvent = this.time.delayedCall(207000, createSpeechInBubble, [quote], this);
    quote="Vivi: yes i am ok but please deliver me Jo"
    timedEvent = this.time.delayedCall(207000, createSpeechBubbleVisible, [bubble2, 1], this);
    timedEvent = this.time.delayedCall(210000, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(215000, createSpeechInBubbleDestroy, [], this);
    quote="I am going to deliver you Vivi, no worries. Ready to fight Vetrox?"
    timedEvent = this.time.delayedCall(215000, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(220000, createSpeechInBubbleDestroy2, [], this);
    quote="Yes i am ready and you are going to die bastard"
    timedEvent = this.time.delayedCall(220000, createSpeechInBubble2, [quote], this);

    boom2 = this.physics.add.sprite(robot2.x, robot2.y, 'boom2');
    boom2.setBounce(0.2); // our player will bounce from items
    boom2.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, boom2);
    boom2.alpha = 0;

    timedEvent = this.time.delayedCall(226000, startWalking_r, [], this);
    timedEvent = this.time.delayedCall(227000, stopWalking_r, [], this);
    timedEvent = this.time.delayedCall(226000, startWalking_bo, [], this);
    timedEvent = this.time.delayedCall(227000, stopWalking_bo, [], this);

    timedEvent = this.time.delayedCall(225000, rescale_ro, [], this);
    timedEvent = this.time.delayedCall(226000, startWalking_r, [], this);
    timedEvent = this.time.delayedCall(227000, stopWalking_r, [], this);
    timedEvent = this.time.delayedCall(227000, createSpeechInBubbleDestroy, [], this);
    timedEvent = this.time.delayedCall(227500, fight_r, [], this);
    quote="Aughhhhhhhhhhh! I got hurt (I lost 140 points of life)"
    timedEvent = this.time.delayedCall(228000, createSpeechInBubble, [quote], this);
    for (let i = 0; i < 20; i++) {
        timedEvent = this.time.delayedCall(227000+i*200, lifebar_vis, [], this);
        timedEvent = this.time.delayedCall(227100+i*200, lifebar_nvis, [], this);
    }
    timedEvent = this.time.delayedCall(228500, idlezom2, [], this);
    timedEvent = this.time.delayedCall(230000, down_jo, [], this);

    timedEvent = this.time.delayedCall(230500, createSpeechInBubbleDestroy, [], this);
    quote="Vivi, I got badly hit and i m about to die TT. (only 10 remining points of life). But before dying, please let me ask you something: ??????????"
    timedEvent = this.time.delayedCall(230500, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(238500, createSpeechInBubbleDestroy2, [], this);
    quote="Vivi: no, Jo, please don't die, i want to be with you and yes we can start a reationship :)"
    timedEvent = this.time.delayedCall(238500, createSpeechInBubble2, [quote], this);

    timedEvent = this.time.delayedCall(246500, createSpeechInBubbleDestroy, [], this);
    quote="Yeeeeeeees, so then let me stand up and kill this fucking robot."
    timedEvent = this.time.delayedCall(246500, createSpeechInBubble, [quote], this);

    timedEvent = this.time.delayedCall(254500, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(254500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(255500, stopWalking_jo, [], this);

    timedEvent = this.time.delayedCall(255500, createSpeechInBubbleDestroy, [], this);
    quote="Vetrox, here is the love fireball, you won't survive after the shock"
    timedEvent = this.time.delayedCall(255500, createSpeechInBubble, [quote], this);


    timedEvent = this.time.delayedCall(263500, generate2, [robot2.x,robot2.y], this);
    timedEvent = this.time.delayedCall(266500, burn2, [], this);
    timedEvent = this.time.delayedCall(267500, boom_disa2, [], this);

    timedEvent = this.time.delayedCall(267500, startWalking_v, [], this);
    timedEvent = this.time.delayedCall(269000, stopWalking_v, [], this);

    timedEvent = this.time.delayedCall(269500, createSpeechInBubbleDestroy2, [], this);
    quote="Vivi: thank you Jo, you are my heroe :)"
    timedEvent = this.time.delayedCall(269500, createSpeechInBubble2, [quote], this);

    //start
    startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Wait 3 seconds, it's loading .....",{ fontFamily: 'Arial', fontSize: 50, align: 'center'})
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: '#111' })
    this.scene.pause();
    //this.input.on('pointerdown', () => console.log('click'));
    setTimeout(() => {
        this.scene.resume();
        startButton.visible=false;
    }, 5000);

}

function startWalking_v()
{
    girlv.body.setVelocityX(-200);
    girlv.anims.play('walk_g', true);
    girlv.flipX = true; // use the original sprite looking to the right
}
function stopWalking_v()
{
    girlv.body.setVelocityX(0);
    girlv.anims.play('idle_g', true);
}


function down_jo()
{
    player.body.setVelocityX(0);
    player.anims.play('down', true);
}

function idlezom2()
{
    robot2.anims.play('idle_r', true);
}

function fight_r()
{
    robot2.anims.play('attack_r', true);
    robot2.flipX = true; // use the original sprite looking to the right
    player.anims.play('shoveBack', true);
    player.body.setVelocityX(-200);
    text.text=10;
}

function lifebar_vis()
{
    arrow.visible=true;
}

function lifebar_nvis()
{
    arrow.visible=false;
}

function reverseWalking_jo()
{
    player.body.setVelocityX(-200);
    player.anims.play('walk', true);
    player.flipX = true; // use the original sprite looking to the right
}

function idlezom()
{
    zombie.anims.play('idle_z', true);
}

function fight()
{
    zombie.anims.play('kick_z', true);
    zombie.flipX = true; // use the original sprite looking to the right
    player.anims.play('shoveBack', true);
    player.body.setVelocityX(-200);
    text.text=150;
}

function generate(x, y)
{
    //console.log(zombie.x)
    //console.log(zombie.y)
    fireball.setPosition(player.x, player.y).setScale(0.5).setAlpha(1);

    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(player.x, player.y), new Phaser.Math.Vector2(zombie.x, zombie.y));

    fireball.setPath(curve);
    fireball.startFollow(300);

    fireFX.restart();
    zombie.anims.play('hit_z', true);
    zombie.flipX = false; // use the original sprite looking to the right
    this.tweens.add({
        targets: boom,
        alpha: 1,
        yoyo: false,
        duration: 500,
        ease: 'Sine.easeInOut'
    });

}

function generate2(x, y)
{
    fireball.visible=true;
    fireball.scaleX=3;
    fireball.scaleY=3;
    fireball.setPosition(player.x, player.y).setScale(0.5).setAlpha(1);

    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(player.x, player.y), new Phaser.Math.Vector2(robot2.x, robot2.y));

    fireball.setPath(curve);
    fireball.startFollow(300);

    fireFX.restart();
    robot2.anims.play('hit_r', true);
    robot2.flipX = false; // use the original sprite looking to the right
    this.tweens.add({
        targets: boom2,
        alpha: 1,
        yoyo: false,
        duration: 500,
        ease: 'Sine.easeInOut'
    });

}

function burn2()
{
    robot2.anims.play('idle_r', true);
    fireball.visible=false;
    this.tweens.add({
        targets: robot2,
        scale: 0,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });
}

function burn()
{
    zombie.anims.play('idle_z', true);
    fireball.visible=false;
    this.tweens.add({
        targets: zombie,
        scale: 0,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });
}

function boom_disa2()
{
    this.tweens.add({
        targets: boom2,
        alpha: 0,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });
}

function boom_disa()
{
    this.tweens.add({
        targets: boom,
        alpha: 0,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });
}

function draw()
{
    rt.draw(fireball);
}

function startWalking_bo()
{
    boom2.body.setVelocityX(-200);
    boom2.flipX = true; // use the original sprite looking to the right
}

function stopWalking_bo()
{
    boom2.body.setVelocityX(0);
}

function startWalking_r()
{
    robot2.body.setVelocityX(-200);
    robot2.anims.play('walk_r', true);
    robot2.flipX = true; // use the original sprite looking to the right
}

function stopWalking_r()
{
    robot2.body.setVelocityX(0);
    robot2.anims.play('idle_r', true);
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
    girl.visible=false;
    robot.visible=false;
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

function rescale_ro()
{
    this.tweens.add({
        targets: robot2,
        scale: 3,
        yoyo: false,
        duration: 2000,
        ease: 'Sine.easeInOut'
    });

}

// this function will be called when the player touches a coin
function eat_mus() {
  fireball.visible=true;
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
  text.text=200;
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

  /*
    if (cursors.up.isDown)
    {
        this.cameras.main.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        this.cameras.main.y += 4;
    }

    if (cursors.left.isDown)
    {
        this.cameras.main.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        this.cameras.main.x += 4;
    }

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
