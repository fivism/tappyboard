class GameScene extends Phaser.Scene {
    constructor() {
		super({key:'gameScene'});
    }
    preload() {
        this.load.image('sky', require('../img/sky.png'));
        this.load.image('bird', require('../img/bird.png'));
        this.load.image('pipe', require('../img/pipe.png'));
    }
    
    create() {
        var score = 0;
        var cursors = this.input.keyboard.createCursorKeys();
        var p2_key = this.input.keyboard.addKey('w');  // Get key object
    
        // Background
        var sky = this.add.image(200, 300, 'sky');
        sky.setScale(3);
    
        // Daring
        var player_one = this.physics.add.sprite(250, 245, 'bird');
        player_one.body.setGravityY(1000);
        player_one.setCollideWorldBounds(true);
    
        var player_two = this.physics.add.sprite(750, 245, 'bird');
        player_two.body.setGravityY(1000);
        player_two.setCollideWorldBounds(true);
    
        var walls = this.physics.add.group();
    
        var timer = this.time.addEvent({
            delay: 1500,
            callback: this.genWall,
            //args: [],
            callbackScope: this,
            loop: true
        });
    
        this.scoreText = this.add.text(16, 16, '0', { fontSize: '32px', fill: '#FFF' });
        this.physics.add.collider(player_one, walls, this.restarter, null, this);
        this.physics.add.collider(player_two, walls, this.restarter, null, this);
    
        var flap_tween = this.game.scene.keys['gameScene'].tweens.add({
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
    
    restarter() {
        score = 0;
        this.scene.restart();
    }
    
    brickGen(x, y) {
        var brick = game.scene.keys['main'].physics.add.sprite(x, y, 'pipe');
        walls.add(brick);
        brick.body.velocity.x = -200;
        brick.checkWorldBounds = true;
        brick.outOfBoundsKill = true;
    }
    
    genWall() {
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes with one two-part hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 12; i++)
            if (i != hole && i != hole + 1 && i != hole + 2)
                brickGen(1200, i * 60 + 35);
    
        score += 1;
        scoreText.text = score;
    }
    
    jump(p) {
        p.body.velocity.y = -350;
        this.flap_tween.play();
    }
    
    update() {
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
    
}

export default GameScene;