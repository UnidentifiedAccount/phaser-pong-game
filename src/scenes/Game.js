import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.leftPaddle = null;
        this.rightPaddle = null;
        this.middlePaddle = null;
        this.middlePaddle2 = null;
        this.middlePaddleActive = false;
        this.middlePaddle2Active = false;
        this.middlePaddleDirection = 1;
        this.middlePaddle2Direction = -1;
        this.ballInMotion = false;
        this.leftScore = 0;
        this.rightScore = 0;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background').setScale(0.8, 0.8);

        this.ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        this.leftPaddle = this.physics.add.image(50, 384, "paddle").setImmovable(true);
        this.rightPaddle = this.physics.add.image(974, 384, "paddle").setImmovable(true);

        // Input
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Colliders for player paddles
        this.physics.add.collider(this.ball, this.leftPaddle, this.handlePaddleBounce, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.handlePaddleBounce, null, this);

        // Score
        this.leftScore = 0;
        this.rightScore = 0;
        this.scoreText = this.add.text(WIDTH / 2, 50, '0 : 0', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0);

        // Ball start
        this.input.keyboard.on('keydown-SPACE', this.startBall, this);

        this.resetBall();
    }

    update() {
        // Left paddle movement (W/S)
        if (this.wKey.isDown) {
            this.leftPaddle.y -= 5;
        } else if (this.sKey.isDown) {
            this.leftPaddle.y += 5;
        }
        // Right paddle movement (Up/Down)
        if (this.cursors.up.isDown) {
            this.rightPaddle.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.rightPaddle.y += 5;
        }

        // Clamp paddles to screen
        this.leftPaddle.y = Phaser.Math.Clamp(this.leftPaddle.y, 50, this.scale.height - 50);
        this.rightPaddle.y = Phaser.Math.Clamp(this.rightPaddle.y, 50, this.scale.height - 50);

        this.leftPaddle.body.updateFromGameObject();
        this.rightPaddle.body.updateFromGameObject();

        // --- Third Paddle logic (appears after 3 points) ---
        if (this.middlePaddleActive && this.middlePaddle) {
            this.middlePaddle.y += 4 * this.middlePaddleDirection;
            if (this.middlePaddle.y <= 50) {
                this.middlePaddle.y = 50;
                this.middlePaddleDirection = 1;
            } else if (this.middlePaddle.y >= this.scale.height - 50) {
                this.middlePaddle.y = this.scale.height - 50;
                this.middlePaddleDirection = -1;
            }
            this.middlePaddle.body.updateFromGameObject();
        }

        // --- Fourth Paddle logic (appears after 6 points) ---
        if (this.middlePaddle2Active && this.middlePaddle2) {
            this.middlePaddle2.y += 4 * this.middlePaddle2Direction;
            if (this.middlePaddle2.y <= 50) {
                this.middlePaddle2.y = 50;
                this.middlePaddle2Direction = 1;
            } else if (this.middlePaddle2.y >= this.scale.height - 50) {
                this.middlePaddle2.y = this.scale.height - 50;
                this.middlePaddle2Direction = -1;
            }
            this.middlePaddle2.body.updateFromGameObject();
        }

        // Scoring: If the ball passes behind the left paddle, right player scores
        if (this.ball.x < this.leftPaddle.x - this.leftPaddle.width / 2) {
            this.rightScore++;
            this.updateScore();
            this.resetBall(1);
            this.spawnMiddlePaddleIfNeeded();
            this.spawnMiddlePaddle2IfNeeded();
        }
        // Scoring: If the ball passes behind the right paddle, left player scores
        else if (this.ball.x > this.rightPaddle.x + this.rightPaddle.width / 2) {
            this.leftScore++;
            this.updateScore();
            this.resetBall(-1);
            this.spawnMiddlePaddleIfNeeded();
            this.spawnMiddlePaddle2IfNeeded();
        }
    }

    spawnMiddlePaddleIfNeeded() {
        // Appear after either player reaches 3 points
        if (!this.middlePaddleActive && (this.leftScore >= 3 || this.rightScore >= 3)) {
            this.middlePaddleActive = true;
            this.middlePaddle = this.physics.add.image(this.scale.width / 2, 50, "paddle").setImmovable(true);
            this.middlePaddle.setAlpha(0.7);
            this.middlePaddleDirection = 1;
            this.physics.add.collider(this.ball, this.middlePaddle, this.handlePaddleBounce, null, this);
        }
    }

    spawnMiddlePaddle2IfNeeded() {
        // Appear after either player reaches 6 points
        if (!this.middlePaddle2Active && (this.leftScore >= 6 || this.rightScore >= 6)) {
            this.middlePaddle2Active = true;
            this.middlePaddle2 = this.physics.add.image(this.scale.width / 2, this.scale.height - 50, "paddle").setImmovable(true);
            this.middlePaddle2.setAlpha(0.7);
            // Move in the opposite direction of the third paddle
            this.middlePaddle2Direction = -this.middlePaddleDirection;
            this.physics.add.collider(this.ball, this.middlePaddle2, this.handlePaddleBounce, null, this);
        }
    }

    startBall() {
        if (!this.ballInMotion) {
            let initialVelocityX = 300 * (this.nextDirection || (Phaser.Math.Between(0, 1) ? 1 : -1));
            let initialVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(initialVelocityX, initialVelocityY);
            this.ballInMotion = true;
        }
    }

    resetBall(direction = Phaser.Math.Between(0, 1) ? 1 : -1) {
        this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
        this.ball.setVelocity(0, 0);
        this.ballInMotion = false;
        this.nextDirection = direction;
    }

    handlePaddleBounce(ball, paddle) {
        // Let Arcade Physics handle the bounce naturally.
        let tweak = Phaser.Math.Between(-30, 30);
        ball.setVelocityY(ball.body.velocity.y + tweak);

        // Speed up the ball a little on each paddle hit:
        let speed = ball.body.velocity.length() * 1.05;
        ball.body.velocity.normalize().scale(speed);
    }

    updateScore() {
        this.scoreText.setText(`${this.leftScore} : ${this.rightScore}`);
    }
}