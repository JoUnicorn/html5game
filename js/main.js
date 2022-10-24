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
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var distanceText;
var infoText;
var timedEvent;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map2.json');
    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/jo.png', 'assets/jo.json');
    this.load.atlas('girl', 'assets/girl.png', 'assets/girl.json');
    this.load.atlas('ennemy1', 'assets/ennemy1.png', 'assets/ennemy1.json');
    this.load.atlas('ennemy2', 'assets/ennemy2.png', 'assets/ennemy2.json');
    this.load.atlas('robot', 'assets/ennemy3.png', 'assets/ennemy3.json');
    this.load.atlas('ennemy4', 'assets/ennemy4.png', 'assets/ennemy4.json');
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
    var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

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
    player.setScale(.6);

    // player will collide with the level tiles
    this.physics.add.collider(groundLayer, player);

    coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin
    // will be called
    this.physics.add.overlap(player, coinLayer);

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
    //////
    //////////
    //robot
    robot = this.physics.add.sprite(600, 200, 'robot');
    robot.setBounce(0.2); // our player will bounce from items
    robot.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(groundLayer, robot);
    // player walk animation
    this.anims.create({
        key: 'walk_r',
        frames: this.anims.generateFrameNames('robot', {prefix: 'character_robot_walk', end: 7, zeroPad: 1}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle_r',
        frames: [{key: 'robot', frame: 'character_robot_idle'}],
        frameRate: 10,
    });
    robot.body.setSize(robot.width, robot.height-40);
    robot.body.setOffset(0, 40);
    //////


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

    distanceText = this.add.text(20, 480, 'Click to set target', { fill: '#00ff00' });
    infoText = this.add.text(20, 500, 'info: ', { fill: '#00ff00' });
    distanceText.setScrollFactor(0);
    infoText.setScrollFactor(0);
    // gr
    timedEvent = this.time.delayedCall(3000, startWalking_gr, [], this);
    timedEvent = this.time.delayedCall(5300, stopWalking_gr, [], this);

    //jo
    timedEvent = this.time.delayedCall(6000, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(7800, stopWalking_jo, [], this);
    timedEvent = this.time.delayedCall(8300, startJumping_jo, [], this);
    timedEvent = this.time.delayedCall(9500, startWalking_jo, [], this);
    timedEvent = this.time.delayedCall(11500, stopWalking_jo, [], this);
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


function startWalking_jo()
{
    player.body.setVelocityX(200);
    player.anims.play('walk', true);
    player.flipX = false; // use the original sprite looking to the right
    distanceText.setText('Distance x: ' + player.x +" distance y: " + player.y);
}
function stopWalking_jo()
{
    player.body.setVelocityX(0);
    player.anims.play('idle', true);
    distanceText.setText('Distance x: ' + player.x +" distance y: " + player.y);
}

function startJumping_jo()
{
    player.body.setVelocityY(-500);
}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
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
