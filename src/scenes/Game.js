import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.leftScore = 0;
        this.rightscore = 0;
        this.leftScoreText = null;
        this.rightScoreText = null;
        this.ballInMotion = false;
        this.balls = [];
        this.baseBallSpeed = 300;
        this.ballSpeedMultiplier = 1.2;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background').setScale(0.8, 0.8);

        this.leftPaddle = this.physics.add.image(50, 384, "paddle");
        this.leftPaddle.setImmovable(true);

        this.rightPaddle = this.physics.add.image(974, 384, "paddle");
        this.rightPaddle.setImmovable(true);

        this.input.keyboard.on('keydown-SPACE', this.startBalls, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S
        });

        this.leftScoreText = this.add.text(100, 50, '0', { fontSize: '50px' });
        this.rightScoreText = this.add.text(924, 50, '0', { fontSize: '50px' });

        // Add the first ball, but do NOT start it moving
        this.addBall(0); // speed 0, stationary
    }

    addBall(speed) {
        const ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball').setScale(0.05, 0.05).refreshBody();
        ball.setCollideWorldBounds(true);
        ball.setBounce(1, 1);
        ball.setVelocity(0, 0); // Always start stationary
        ball.deflectionCount = 0; // Track paddle hits
        this.physics.add.collider(ball, this.leftPaddle, this.hitPaddle, null, this);
        this.physics.add.collider(ball, this.rightPaddle, this.hitPaddle, null, this);
        this.balls.push(ball);

        // If this is NOT the first ball, start it immediately
        if (this.balls.length > 1 && speed > 0) {
            const directionX = Phaser.Math.Between(0, 1) ? 1 : -1;
            const directionY = Phaser.Math.Between(0, 1) ? 1 : -1;
            ball.setVelocity(
                this.baseBallSpeed * directionX,
                this.baseBallSpeed * directionY
            );
        }
    }

    hitPaddle(ball, paddle) {
        // Speed up by 1%
        ball.setVelocity(ball.body.velocity.x * 1.01, ball.body.velocity.y * 1.01);

        // Add random Y velocity and slightly increase X speed for more dynamic bounce
        const newVelY = Phaser.Math.Between(-200, 200);
        const newVelX = ball.body.velocity.x > 0 ? 
            Math.abs(ball.body.velocity.x) + Phaser.Math.Between(10, 30) : 
            -Math.abs(ball.body.velocity.x) - Phaser.Math.Between(10, 30);
        ball.setVelocity(newVelX, newVelY);

        // Track deflections
        ball.deflectionCount = (ball.deflectionCount || 0) + 1;
        if (ball.deflectionCount >= 5) { // 5 deflections for new ball
            this.addBall(this.baseBallSpeed);
            ball.deflectionCount = 0;
        }
    }

    update() {
        // Paddle movement
        if (this.wasd.up.isDown && this.leftPaddle.y > 0) {
            this.leftPaddle.y -= 20;
        } else if (this.wasd.down.isDown && this.leftPaddle.y < HEIGHT) {
            this.leftPaddle.y += 20;
        }
        if (this.cursors.up.isDown && this.rightPaddle.y > 0) {
            this.rightPaddle.y -= 20;
        } else if (this.cursors.down.isDown && this.rightPaddle.y < HEIGHT) {
            this.rightPaddle.y += 20;
        }

        // Scoring and ball reset
        const margin = 30;
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (ball.x < margin) {
                this.rightscore += 1;
                this.rightScoreText.setText(this.rightscore);
                this.resetSingleBall(ball, 'right');
                break;
            } else if (ball.x > WIDTH - margin) {
                this.leftScore += 1;
                this.leftScoreText.setText(this.leftScore);
                this.resetSingleBall(ball, 'left');
                break;
            }
        }
    }

    // Only reset the scored ball, not all balls
    resetSingleBall(ball, scoredSide) {
        ball.setPosition(WIDTH / 2, 384);
        ball.setVelocity(0, 0);
        ball.deflectionCount = 0;

        // Only require SPACE if both scores are zero (game start)
        if (this.leftScore === 0 && this.rightscore === 0) {
            this.ballInMotion = false;
        } else {
            // Start this ball immediately after a score
            const speed = this.baseBallSpeed;
            const directionX = scoredSide === 'right' ? -1 : 1;
            const directionY = Phaser.Math.Between(0, 1) ? 1 : -1;
            ball.setVelocity(
                speed * directionX,
                speed * directionY
            );
            this.ballInMotion = true;
        }
    }

    // Start all balls moving (only if not already in motion and score is 0-0)
    startBalls() {
        if (!this.ballInMotion && this.leftScore === 0 && this.rightscore === 0) {
            for (let i = 0; i < this.balls.length; i++) {
                const directionX = Phaser.Math.Between(0, 1) ? 1 : -1;
                const directionY = Phaser.Math.Between(0, 1) ? 1 : -1;
                this.balls[i].setVelocity(
                    this.baseBallSpeed * directionX,
                    this.baseBallSpeed * directionY
                );
            }
            this.ballInMotion = true;
        }
    }
}