"use strict";

let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'gameCanvasDiv',
        // mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoResize: true,
    width: 800,
    height: 600,
    physics: {
        default: `arcade`
    },
    scene: [Boot,Play],

    canvas: document.querySelector('canvas')
};

let game = new Phaser.Game(config);
