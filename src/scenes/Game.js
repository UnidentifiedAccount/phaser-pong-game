import { Scene } from 'phaser';

const width = 1024;
const height = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball=null;
        this.leftPaddle=null;
        this.rightPaddle=null;

    }

    preload() {
        this.load.image('background', 'assets/background.png')
        this.load.image('ball', 'assets/ball.png')
        this.load.image('paddle', 'assets/paddle.png')
    }

    create() {
        this.add.image(width/2, height/2, 'background').setScale(0.8,0.8);
        this.ball=this.add.image(width/2, height/2, 'ball').setScale(0.1,0.1);
        this.leftPaddle= this.add.image(50,384, "paddle");
        this.rightPaddle= this.add.image(974,384, "paddle");
        this.ball=this.physics.add.image(width/2, height/2, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1,1);
        this.cursors=this.input.keyboard.createCursorKeys();
        this.wasd=this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W
            down:Phaser.Input.Keyboard.KeyCodes.S
        });
    

        this.input.keyboard.on('keydown-SPACE', this.StartBall, this);
    }

    update() {

    }

    StartBall() {
        if(!this.ballInMotion){
            this.ball.setVelocity(200,200);
            this.ballInMotion=true
        }

    }
    

    

}