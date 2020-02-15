require('../img/sky.png')

// titleScene.js
class TitleScene extends Phaser.Scene {
    constructor() {
		super({key:'titleScene'});
    }
    
    preload() {
        this.load.image('sky', require('../img/sky.png'));
    }
    
    create() {
        var sky = this.add.image(0, 0, 'sky');
        sky.setOrigin(0,0);
        sky.setScale(2);
    
        var text = this.add.text(300,350, 'Flappy Board');
        text.setScale(2);
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());

    }

    update() {

    }
    clickButton() {
        this.scene.switch('gameScene');
    }
}

export default TitleScene;