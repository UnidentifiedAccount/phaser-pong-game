import { Game as MainGame } from './scenes/Game';

import { AUTO, Scale, Game } from 'phaser';

//  Find out more information about the Game Config at:

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config = {

    // Sets the physics engine used to arcade

    physics: {

        default: 'arcade',

        arcade: {

            debug: false

        }

    },

    type: AUTO,

    width: 1024,

    height: 768,

    parent: 'game-container',

    backgroundColor: '#000',

    scale: {

        mode: Scale.FIT,

        autoCenter: Scale.CENTER_BOTH

    },

    scene: [

        MainGame

    ]

};

export default new Game(config);