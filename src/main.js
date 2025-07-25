import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {}

    create() {
        // Paddles
        this.leftPaddle = this.add.rectangle(50, this.scale.height / 2, 20, 100, 0xffffff);
        this.physics.add.existing(this.leftPaddle, true);

        this.rightPaddle = this.add.rectangle(this.scale.width - 50, this.scale.height / 2, 20, 100, 0xffffff);
        this.physics.add.existing(this.rightPaddle, true);

        // Ball
        this.ball = this.add.circle(this.scale.width / 2, this.scale.height / 2, 15, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.setBounce(1, 1);

        // Initial ball velocity
        this.resetBall();

        // Input
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collisions
        this.physics.add.collider(this.ball, this.leftPaddle, this.handlePaddleBounce, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.handlePaddleBounce, null, this);

        // Score
        this.leftScore = 0;
        this.rightScore = 0;
        this.scoreText = this.add.text(this.scale.width / 2, 50, '0 : 0', {
            fontSize: '48px',
            color: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    update() {
        // Left paddle movement (W/S)
        if (this.wKey.isDown) {
            this.leftPaddle.y -= 8;
        } else if (this.sKey.isDown) {
            this.leftPaddle.y += 8;
        }
        // Right paddle movement (Up/Down)
        if (this.cursors.up.isDown) {
            this.rightPaddle.y -= 8;
        } else if (this.cursors.down.isDown) {
            this.rightPaddle.y += 8;
        }

        // Clamp paddles to screen
        this.leftPaddle.y = Phaser.Math.Clamp(this.leftPaddle.y, 50, this.scale.height - 50);
        this.rightPaddle.y = Phaser.Math.Clamp(this.rightPaddle.y, 50, this.scale.height - 50);

        // Update paddle bodies
        this.leftPaddle.body.updateFromGameObject();
        this.rightPaddle.body.updateFromGameObject();

        // Scoring
        if (this.ball.x < 0) {
            this.rightScore++;
            this.updateScore();
            this.resetBall(-1);
        } else if (this.ball.x > this.scale.width) {
            this.leftScore++;
            this.updateScore();
            this.resetBall(1);
        }
    }

    handlePaddleBounce(ball, paddle) {
        // Add randomness to bounce angle
        let velocity = ball.body.velocity;
        let speed = velocity.length();
        let angle = Phaser.Math.Between(-45, 45);
        let sign = ball.x < this.scale.width / 2 ? 1 : -1;
        this.physics.velocityFromAngle(angle * sign, speed * 1.1, velocity);
        ball.body.setVelocity(velocity.x, velocity.y);
    }

    resetBall(direction = Phaser.Math.Between(0, 1) ? 1 : -1) {
        this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
        let angle = Phaser.Math.Between(-30, 30);
        let speed = 300;
        let velocity = new Phaser.Math.Vector2();
        this.physics.velocityFromAngle(angle * direction, speed, velocity);
        this.ball.body.setVelocity(velocity.x, velocity.y);
    }

    updateScore() {
        this.scoreText.setText(`${this.leftScore} : ${this.rightScore}`);
    }
}