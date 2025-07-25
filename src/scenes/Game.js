import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        // Initialise necessary variables
        this.ball = null;
        this.leftPaddle = null;
        this.rightPaddle = null;

        // Flag to determine if the ball is in motion
        this.ballInMotion = false;
    }

    preload() {
        // Load necessary assets from the assets directory
        this.load.image('background', 'assets/background.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
    }

    create() {
        // Add background, ball, and paddles to the scene
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background').setScale(0.8, 0.8);

        this.ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        this.leftPaddle = this.add.image(50, 384, "paddle");
        this.rightPaddle = this.add.image(974, 384, "paddle");

        // Listen for "keyspace down" event, calling startBall function upon press
        this.input.keyboard.on('keydown-SPACE', this.startBall, this);
    }

    update() {
    }

    startBall() {
        if (!this.ballInMotion) { // checks flag to determine if ball is NOT in motion
            let initialVelocityX = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1); // sets to either 300 or -300
            let initialVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1); // sets to either 300 or -300
            this.ball.setVelocity(initialVelocityX, initialVelocityY); // sets ball to RANDOM velocity
            this.ballInMotion = true; // sets flag to ball is in motion
        }
    }
    
}