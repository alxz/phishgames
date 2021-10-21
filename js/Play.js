class Play extends Phaser.Scene {
    count = 0;
    
    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        /*
        this.wall = this.physics.add.image(100, 100, `wall`);       
        this.wall.setImmovable(true); // if you set it to false - the object will go away ...
        this.wall.setTint(0xff00dd);
        */
        let background = Phaser.GameObjects.Image;
        background = this.add
            .image(this.sys.canvas.width /2, this.sys.canvas.height / 2, `background`)
            .setOrigin(0.5, 0.5);
        // Based on your game size, it may "stretch" and distort.
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;


        this.wallS = this.physics.add.staticGroup();
        this.buildWalls();

        /*
        this.wallS = this.physics.add.group({
            key: `brickwall`,
            immovable: true,
            quantity: 16
        });

        this.wallS.children.each(function(wall) {
            let x = Math.random() * this.sys.canvas.width;
            let y = Math.random() * this.sys.canvas.height;
            wall.setPosition( x, y );
            wall.setTint(0xdd3333);
        }, this );
        */

        // this.collectable = this.physics.add.sprite(260,200, `bell`);
        // this.collectable.setTint(0x88ff00);

        this.collectableS = this.physics.add.group({
            key: `bellsShaking`,
            immovable: true,
            quantity: 10
        });

        this.collectableS.children.each(function(collectable) {
            let x = 10 + Math.random() * (this.sys.canvas.width - 20);
            let y = 250 + Math.random() * this.sys.canvas.height / 2;
            collectable.setPosition( x, y );
            collectable.setTint(0x88ff00);
        }, this );

        this.avatar = this.physics.add.sprite(200,200, `avatar`);

        //dudeWalk
        this.dude = this.physics.add.sprite(400,500, `dudeWalk`).setScale(3);

        this.createAnimations(); // add some animation for movements and for idle state(s)

        this.collectableS.children.each(function(collectable) {            
            collectable.play(`bell-shake`);
        }, this );

        // this.avatar.setVelocity(100, 200);
        // this.avatar.setVelocityX(100);        
        // this.avatar.setBounce(1, 1);
        this.avatar.setCollideWorldBounds(true);
        this.dude.setCollideWorldBounds(true);

        this.avatar.play(`avatar-idle`);        
        this.dude.play(`dude-idle`);        

        // this.physics.add.collider(this.avatar, this.wallS);
        // this.physics.add.overlap(this.avatar, this.collectableS, this.collectiItem, null, this);

        this.physics.add.collider(this.dude, this.wallS);
        this.physics.add.overlap(this.dude, this.collectableS, this.collectiItem, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        /*
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
        let gameDescription = `Think of a number... wrong!`;
        //  Pass in a basic style object with the constructor
        this.add.text(100, 100, gameDescription, styleShade);
        this.add.text(98, 98, gameDescription, style);

        this.wall = this.physics.add.image(100,100, `wall`);
        this.wall.setTint(0xdd3333);

        this.avatar = this.physics.add.sprite(200,200, `avatar`);

        this.createAnimations();

        this.avatar.setVelocityX(100);
        this.avatar.play(`avatar-idle`);
        */
    }
    collectiItem(avatar, collectable) {
        console.log("Overlap!");
        collectable.destroy();
        this.count ++;
        if (this.count >= 10) {
            console.log("All object collected!");
        }
    }

    update() {
        // console.log(`Play scene uopdated`);

        this.dude.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.dude.setVelocityX(-300);
            this.dude.play(`dude-walk-left`, true);
        }
        else if (this.cursors.right.isDown)
        {
            this.dude.setVelocityX(300);
            this.dude.play(`dude-walk-right`, true);
        }
    
        if (this.cursors.up.isDown)
        {
            this.dude.setVelocityY(-300);
            this.dude.play(`dude-walk-up`, true);
        }
        else if (this.cursors.down.isDown)
        {
            this.dude.setVelocityY(300);
            this.dude.play(`dude-walk-down`, true);
        }

        if (this.dude.body.velocity.x !== 0 || this.dude.body.velocity.y !== 0) {
            //this.dude.play(`dude-walk-left`, true);
        } else {
            this.dude.play(`dude-idle`, true);
        }

        /*
        this.avatar.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.avatar.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.avatar.setVelocityX(300);
        }
    
        if (this.cursors.up.isDown)
        {
            this.avatar.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown)
        {
            this.avatar.setVelocityY(300);
        }

        if (this.avatar.body.velocity.x !== 0 || this.avatar.body.velocity.y !== 0) {
            this.avatar.play(`avatar-moving`, true);
        } else {
            this.avatar.play(`avatar-idle`, true);
        }
        */
    }

    createAnimations() {
        this.anims.create({
            key: `avatar-moving`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 0,
                end: 6
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: `avatar-idle`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: `bell-shake`,
            frames: this.anims.generateFrameNumbers(`bell`, {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `dude-idle`,
            frames: this.anims.generateFrameNumbers(`dudeWalk`, {
                start: 6,
                end: 6
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: `dude-walk-left`,
            frames: this.anims.generateFrameNumbers(`dudeWalk`, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `dude-walk-right`,
            frames: this.anims.generateFrameNumbers(`dudeWalk`, {
                start: 12,
                end: 15
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `dude-walk-down`,
            frames: this.anims.generateFrameNumbers(`dudeWalk`, {
                start: 4,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `dude-walk-up`,
            frames: this.anims.generateFrameNumbers(`dudeWalk`, {
                start: 8,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });

    }


    buildWalls() {

        this.wallS = this.physics.add.group({
            key: `blockInvis`,
            immovable: true,
            quantity: 160
        });

        for (let i=0; i< 18; i++) {
            this.wallS.create(40 + (i * 40), 240, 'blockInvis').setScale(1).refreshBody();            

        }

        for (let i=0; i< 1 ; i++) {
            this.wallS.create(50, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(100, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();
            this.wallS.create(200, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(250, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(520, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(570, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();  
            this.wallS.create(120, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(640, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
        }
    }
}