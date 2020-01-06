var config = {
    type: Phaser.CANVAS,
    width: 1200,
    height: 735,
    physics: {
        default: 'arcade',
        arcade: {
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

function preload ()
{
    this.load.image('sky', 'img/sky.png');
    this.load.image('bird', 'img/bird.png');
    this.load.image('pipe', 'img/pipe.png');
    // Feeding in spritesheets
    // this.load.spritesheet('dude',
    //     'img/dude.png',
    //     { frameWidth: 32, frameHeight: 48 }
    // );
}

// Play Bindings
var walls;
var score = 0;
var scoreText;
var flap_tween;
function create ()
{
    cursors = this.input.keyboard.createCursorKeys();
    p2_key = this.input.keyboard.addKey('w');  // Get key object

    // Background
    sky = this.add.image(200, 300, 'sky'); // todo scale up instead
    sky.setScale(3);

    // Daring
    player_one = this.physics.add.sprite(250, 245, 'bird');
    player_one.body.setGravityY(1000);
    player_one.setCollideWorldBounds(true);

    player_two = this.physics.add.sprite(750, 245, 'bird');
    player_two.body.setGravityY(1000);
    player_two.setCollideWorldBounds(true);

    walls = this.physics.add.group();

    var timer = this.time.addEvent({
        delay: 1500,
        callback: genWall,
        //args: [],
        callbackScope: this,
        loop: true
    });

    scoreText = this.add.text(16, 16, '0', { fontSize: '32px', fill: '#FFF' });
    this.physics.add.collider(player_one, walls, restarter, null, this);
    this.physics.add.collider(player_two, walls, restarter, null, this);

    flap_tween = game.scene.keys['main'].tweens.add({
        targets: player_one, player_two,
        angle: -20,
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 100,
        repeat: 0,            // -1: infinity
    });

    this.input.addPointer();
    var zone1 = this.add.zone(0, 0, 600, 735).setOrigin(0).setName('p1touch').setInteractive();
    var zone2 = this.add.zone(600, 0, 600, 735).setOrigin(0).setName('p2touch').setInteractive();

    this.input.on('gameobjectdown', function (pointer, gameObject) {
        if (pointer.x < 600) {
            jump(player_one);
        }

        if (pointer.x >= 600) {
            jump(player_two);
        }
    })
}

function restarter() {
    score = 0;
    this.scene.restart();
}

function brickGen(x, y) {
    var brick = game.scene.keys['main'].physics.add.sprite(x, y, 'pipe');
    walls.add(brick);
    brick.body.velocity.x = -200;
    brick.checkWorldBounds = true;
    brick.outOfBoundsKill = true;
}

function genWall() {
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes with one two-part hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 12; i++)
        if (i != hole && i != hole + 1 && i != hole + 2)
            brickGen(1200, i * 60 + 35);

    score += 1;
    scoreText.text = score;
}

function jump(p) {
    p.body.velocity.y = -350;
    this.flap_tween.play();
}

function update () {
    if (player_one.y < 25 || player_one.y > 700) {
        this.scene.restart();
        score = 0;
    }

    if (cursors.up.isDown)
        jump(player_two);

    if (p2_key.isDown)
        jump(player_one);

    if (player_one.angle < 20) {
        player_one.angle += 1;
    }
    scoreText.text = score;
}
