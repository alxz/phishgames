class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        //brickwall
        this.load.image(`brickwall`, `assets/images/brickwall.png`);
        this.load.image(`wall`, `assets/images/wall.png`);
        this.load.spritesheet(`avatar`, `assets/images/avatar.png`, {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 6
        });

        this.load.spritesheet(`bell`, `assets/images/movingBell.png`, {
            frameWidth: 32,
            frameHeight: 32,
            endFrame: 7
        });

        this.load.on(`complete`, () => {
            this.scene.start(`play`);    
        });
    }

    create() {

        let style = { 
            fontFamily: 'sans-serif', 
            fontSize: `40px`, 
            color: '#ff00dd' 
        };
        let styleShade = { 
            fontFamily: 'sans-serif', 
            fontSize: `40px`, 
            color: '#bba2b6' 
        };
        let loadingStr = `Loading...`;
        //  Pass in a basic style object with the constructor
        this.add.text(100, 100, loadingStr, styleShade);
        this.add.text(98, 98, loadingStr, style);
        // setTimeout(() => {  console.log("World!"); }, 2000);
        
        
        // this.scene.start(`play`);

    }

    update() {

    }
}