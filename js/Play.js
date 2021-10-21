class Play extends Phaser.Scene {

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

        // this.collectable = this.physics.add.sprite(260,200, `bell`);
        // this.collectable.setTint(0x88ff00);

        this.collectableS = this.physics.add.group({
            key: `brickwall`,
            immovable: true,
            quantity: 16
        });

        this.collectableS.children.each(function(collectable) {
            let x = Math.random() * this.sys.canvas.width;
            let y = Math.random() * this.sys.canvas.height;
            collectable.setPosition( x, y );
            collectable.setTint(0x88ff00);
        }, this );

        this.avatar = this.physics.add.sprite(200,200, `avatar`);
        

        this.createAnimations(); // add some animation for movements and for idle state(s)
        this.collectableS.children.each(function(collectable) {            
            collectable.play(`bell-shake`);
        }, this );
        // this.avatar.setVelocity(100, 200);
        // this.avatar.setVelocityX(100);        
        // this.avatar.setBounce(1, 1);
        this.avatar.setCollideWorldBounds(true);

        this.avatar.play(`avatar-idle`);        

        this.physics.add.collider(this.avatar, this.wallS);
        this.physics.add.overlap(this.avatar, this.collectableS, this.collectiItem, null, this);

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
    }

    update() {
        // console.log(`Play scene uopdated`);
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
    }
}