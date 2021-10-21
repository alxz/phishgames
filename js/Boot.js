class Boot extends Phaser.Scene {
    // background = Phaser.GameObjects.Image;
    constructor() {
        super({
            key: `boot`
        });
    }

    preload() {
        //brickwall
        this.load.image(`brickwall`, `assets/images/brickwall.png`);

        //block20x20light | block20x20red
        this.load.image(`blockInvis`, `assets/images/block20x20.png`);
        //this.load.image(`blockInvis`, `assets/images/block20x20red.png`);


        this.load.image(`wall`, `assets/images/wall.png`);
        // background image:
        this.load.image(`background`, `assets/images/room_upscaled_cleaned.png`);

        this.load.image(`laptop`, `assets/images/laptop50x34face.png`);
        this.load.image(`monitor`, `assets/images/monitor60x49face.png`);
        this.load.image(`smartphone`, `assets/images/smartphone20x37face.png`);

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

        //dude_Sprite.png
        this.load.spritesheet(`dudeWalk`, `assets/images/dude_Sprite.png`, {
            frameWidth: 50,
            frameHeight: 75,
            endFrame: 15
        });
    }

    // init() {
    //     // background
    //     this.background = this.add.image(0, 0, "background")
    //     .setOrigin(.5, .5);
    //     // Based on your game size, it may "stretch" and distort.
    //     this.background.displayWidth = this.sys.canvas.width;
    //     this.background.displayHeight = this.sys.canvas.height;
        
    // }

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