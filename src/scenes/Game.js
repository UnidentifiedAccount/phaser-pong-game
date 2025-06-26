import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball=null;
        this.leftpaddle=null;
        this.rightpaddle=null;
    }

    preload() {
        this.load.image('background', 'assets/background.png')
        this.load.image('ball', 'assets/ball.png')
        this.load.image('paddle', 'assets/paddle.png')
    }

    create() {
    }

    update() {
    }

}