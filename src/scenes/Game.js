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
        this.ball=this.add.image(width/2, height/2, 'background').setScale(0.8,0.8);
        this.leftPaddle(50,384, "paddle");
        this.rightPaddle(974,384, "paddle");
    }

    update() {
    }

}