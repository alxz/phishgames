class Play extends Phaser.Scene {
    count = 0;
    gameState = {
        isPaused: false
    };
    isPaused = false;
    cWidth = 800; //canvas width
    cHeight = 600; //canvas height
    questionWindow = document.getElementById("questionWindow");
    questionsArray = [];
    questionBank = [];
    questionOrder = [];
    caption;
    captionStyle = {
        fill: `#F4D03F`,
        fontFamily: `monospace`,
        lineSpacing: 4
    };
    captionTextFormat = (
        'Player.old X:       %1\n' +
        'Player.old Y:       %2\n' +
        'Player.current X:   %3\n' +
        'Player.current Y:   %4\n' +
        'isPaused:          %5'
    );
    oldCoord = {
        x: 0, y: 0
    };
    currentCoord = {
        x: 0, y: 0
    };


    devices = {
        imgKey: {
            0: `laptop`, 
            1: `monitor`, 
            2: `smartphone`
        },
        imgScale: {
            0: 1.9,
            1: 1.8,
            2: 1
        },
        objName: {
            0: `laptop`, 
            1: `monitor`, 
            2: `smartphone`
        },
        imgCoord: {
            0: {
                x: 160,
                y: 420
            },
            1: {
                x: 750,
                y: 260
            },
            2: {
                x: 550,
                y: 400
            }
        }      
    }
    
    questions = {
            imgKey: {
                0: `question`, 
                1: `question`, 
                2: `question`
            },
            imgScale: {
                0: 1,
                1: 1,
                2: 1
            },
            objName: {
                0: `questionLaptop`, 
                1: `questionMonitor`, 
                2: `questionSmartPhone`
            },
            imgCoord: {
                0: {
                    x: 170,
                    y: 420
                },
                1: {
                    x: 750,
                    y: 260
                },
                2: {
                    x: 550,
                    y: 400
                }
            },
            id: {
                0: "0",
                1: "1",
                2: "2"
            } 
    }   

    constructor() {
        super({
            key: `play`
        });
    }

    create() {
        this.loadData();
        this.cameras.main.setBackgroundColor('#333');
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
        background.displayWidth = this.sys.canvas.width * 1.05;
        background.displayHeight = this.sys.canvas.height;

        this.wallS = this.physics.add.staticGroup();
        this.buildWalls();

        /*
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
        */

        this.interactObjs = this.physics.add.group({
            key: `interactObjs`,
            immovable: true,
            quantity: 3
        });

        let idx = 0;
        this.interactObjs.children.each(function(interactiveObject) {
            // building  devices  group:
            let x = this.devices.imgCoord[idx].x;
            let y = this.devices.imgCoord[idx].y;
            let name = this.devices.objName[idx];
            let texture = this.devices.imgKey[idx];
            let scale = this.devices.imgScale[idx];
            interactiveObject.setPosition( x, y );
            interactiveObject.setName(name);
            interactiveObject.setTexture(texture).setScale(scale); 
            idx++;
        }, this );

        // this.avatar = this.physics.add.sprite(200,200, `avatar`);
        this.dude = this.physics.add.sprite(400,500, `dudeWalk`).setScale(2);
        this.dude.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.dude); /* This allow camera to follow the player character.  */

        this.createAnimations(); // add some animation for movements and for idle state(s)

        this.interactQuestions = this.physics.add.group({
            key: `interactQuestions`,
            immovable: true,
            quantity: 3
        });
        console.log('interactQuestions objec:');
        console.log(this.interactQuestions);
        console.log('< ======= <');

        /*
        this.collectableS.children.each(function(collectable) {            
            collectable.play(`bell-shake`);
        }, this );
        */              
        this.dude.play(`dude-idle`);        

        this.physics.add.collider(this.dude, this.wallS);
        // this.physics.add.overlap(this.dude, this.collectableS, this.collectiItem, null, this);

        // interaction with interactObjs:
        this.physics.add.overlap(this.dude, this.interactQuestions, this.collectiItem, null, this);
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
        */
        this.caption = this.add.text(16,16,'', this.captionStyle);
    }

    loadData() {

        function loadJSON(callback) {   
            var xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
            xobj.open('GET', './assets/data.json', true); 
            xobj.onreadystatechange = function () {
                  if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value 
                    // but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                  }
            };
            xobj.send(null);  
         }

        loadJSON((response) => {
            // Parse JSON string into object
              this.questionsArray = JSON.parse(response);
              console.log(this.questionsArray);
            this.generateQBank(this.questionsArray); 
            this.creteQObject(this.questionOrder[0]);
        });
    }

    collectiItem(avatar, collectable) {
        this.isPaused = true;
        this.setPlayerIdle(); 
        console.log('this.isPaused = ', this.isPaused);
        
        this.dude.x = this.oldCoord.x;
        this.dude.y = this.oldCoord.y;
        console.log("Overlap! ", collectable.getData(`name`), collectable.getData(`id`));
        let imgId = collectable.getData(`id`);
        let newImgId = collectable.getData(`id`);
        console.log('See the imgId= ', imgId, ' and newImgId: ', newImgId);
        //question-popup-show 
        document.getElementById("question").style.setProperty("display", "block")
        document.getElementById("question").className = "question_popup_show";

        //questionWindow - to show the image and question
        // document.getElementById("questionWindow").className = "question_container";

        document.getElementById("question_image").src = this.questionsArray[imgId].image;

        document.getElementById("yes").onclick = function(isPaused) {
            document.getElementById("question").style.setProperty("display", "none");
            // displayDiv("question", false);
            this.count ++;
            // this.gameState.isPaused = false;
            this.isPaused = false;
            console.log(`confirmed button clicked!`);
            console.log('this.isPaused = ', this.isPaused);
        };
        document.getElementById("no").onclick = function() {
            document.getElementById("question").style.setProperty("display", "none");
            // displayDiv("question", false);
            // this.gameState.isPaused = false;
            this.count ++;
            this.isPaused = false;
            console.log(`cancel button clicked!`);
            console.log('this.isPaused = ', this.isPaused);
        };

        console.log('Array/this.questionOrder/: ',this.questionOrder);
        let curIndex;
        let nextIndex;

        for (let i=0; i < this.questionOrder.length ; i++) {
            console.log('=>[',i,'] (this.questionOrder[i])= ', this.questionOrder[i] ); 
            if ( this.questionOrder[i] == newImgId ) {
                console.log('Identified newImgId= ', newImgId, ' and [i] as index is =', i );
                curIndex = i;
                break;
            }
        }
        console.log('Before update of newImgId (=',newImgId,'), check curIndex: ', curIndex );
        if ( curIndex == this.questionOrder.length -1 ) {
            console.log('Image Id reseet required!'); 
            newImgId = this.questionOrder[0];
            nextIndex = 0;
            console.log('New Image Id: ', newImgId);
        } else {
            console.log('Index could be incremented...'); 
            newImgId = this.questionOrder[curIndex+1];      
            nextIndex =  curIndex+1;      
            console.log('Updated to the next Image Id! newImgId: ', newImgId); 
        }
        
        console.log('At this point newImgId (=',newImgId,'), old index (curIndex) = ', curIndex, ' next Index (nextIndex) = ', nextIndex );
        this.creteQObject(newImgId);
        
        if (this.count >= 3) {
            console.log("All object collected!");
        }
        console.log(`collectable object: `, collectable);
        collectable.destroy();
        
    }

    updatePlayerPreCoord(x,y) {
        this.oldCoord.x = x;
        this.oldCoord.y = y;
    }

    updatePlayerPostCoord(x,y) {
        this.currentCoord.x = x;
        this.currentCoord.y = y;
    }

    setPlayerIdle() {
        this.dude.setVelocity(0);
        this.dude.play(`dude-idle`, true); 
    }

    update() {
        // console.log(`Play scene uopdated`);
        // if (this.isPaused  === true) {
        //     return;
        // }

        this.dude.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.updatePlayerPreCoord(this.dude.body.x,this.dude.body.y);
            this.dude.setVelocityX(-300);
            this.dude.play(`dude-walk-left`, true);
        }
        else if (this.cursors.right.isDown)
        {
            this.updatePlayerPreCoord(this.dude.body.x,this.dude.body.y);
            this.dude.setVelocityX(300);
            this.dude.play(`dude-walk-right`, true);
        }
    
        if (this.cursors.up.isDown)
        {
            this.updatePlayerPreCoord(this.dude.body.x,this.dude.body.y);
            this.dude.setVelocityY(-300);
            this.dude.play(`dude-walk-up`, true);
        }
        else if (this.cursors.down.isDown)
        {
            this.updatePlayerPreCoord(this.dude.body.x,this.dude.body.y);
            this.dude.setVelocityY(300);
            this.dude.play(`dude-walk-down`, true);
        }

        if (this.dude.body.velocity.x !== 0 || this.dude.body.velocity.y !== 0) {
            //this.dude.play(`dude-walk-left`, true);
            this.currentCoord.x = this.dude.body.x;
            this.currentCoord.y = this.dude.body.y;
        } else {
            // this.dude.play(`dude-idle`, true);
            this.setPlayerIdle();            
        }
        this.caption.x = 100 + this.dude.body.x - 400;
        this.caption.y = 100 + this.dude.body.y - 300;
        this.caption.setText(Phaser.Utils.String.Format(this.captionTextFormat,[
            this.oldCoord.x,
            this.oldCoord.y,
            this.currentCoord.x,
            this.currentCoord.y,
            this.isPaused
        ]))
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

        this.anims.create({
            key: `question-turning`,
            frames: this.anims.generateFrameNumbers(`question`, {
                start: 0,
                end: 9
            }),
            frameRate: 14,
            repeat: -1
        });

    }


    buildWalls() {

        this.wallS = this.physics.add.group({
            key: `blockInvis`,
            immovable: true,
            quantity: 100
        });

        for (let i=0; i< 10; i++) {
            this.wallS.create(200 + (i * 40), 280, 'blockInvis').setScale(1).refreshBody();            
        }
        for (let i=0; i< 3; i++) {
            this.wallS.create(690 + (i * 40), 260, 'blockInvis').setScale(1).refreshBody();            
        }


        for (let i=0; i< 2 ; i++) {
            // this.wallS.create(50, 290 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(80, 230 + ( i * 40), 'blockInvis').setScale(1).refreshBody();
            this.wallS.create(140, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody(); 
            this.wallS.create(210, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(270, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();   
            this.wallS.create(320, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();         
            this.wallS.create(550, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
            this.wallS.create(600, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();  
            this.wallS.create(650, 320 + ( i * 40), 'blockInvis').setScale(1).refreshBody();            
        }
    }


    creteQObject(currentIndex) {
        
        console.log('Passed to creteQObject(currentIndex) : ', currentIndex);
        console.log(this.interactQuestions);
        this.interactQuestions.children.each( (interactQuestion,index) => {
            // building  questions  group:            
            console.log('Index: ', index, ' currentIndex: ', currentIndex);
            if ( currentIndex == index ) {
                console.log('Got the index index: ', index);
                let x = this.questions.imgCoord[index].x;
                let y = this.questions.imgCoord[index].y;
                let imgKey = this.questions.imgKey[index];
                let name = this.questions.objName[index];
                let id = this.questions.id[index];
                let texture = this.questions.imgKey[index];
                let scale = this.questions.imgScale[index];
                interactQuestion.setPosition( x, y );
                interactQuestion.setName(name);
                interactQuestion.setTexture(texture).setScale(scale); 
                interactQuestion.setData( {name: name, imgKey: imgKey, id: id} );
                interactQuestion.play(`question-turning`);
                console.log('Creating sprite object: ', interactQuestion);
                console.log('this.questions.id: ', this.questions.id);
            }
            // interactQuestion.setActive(false).setVisible(false);
            //interactQuestion.visible = false;
        }, this );
    }

    displayDiv(id, display) {
        var x = document.getElementById(id);
        if (display) {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    generateQBank(questionsArray) {
        let qArrLen = questionsArray.length;
        if (qArrLen > 0) {
            for (let i = 0;  i < qArrLen; i ++ ){
                this.questionOrder.push(questionsArray[i].id);
            }

            this.shuffleFisherYates(this.questionOrder);
            console.log("question Queue: ",this.questionOrder);
        }
        
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    shuffleFisherYates(array) {
        let i = array.length;
        while (i--) {
          const ri = Math.floor(Math.random() * i);
          [array[i], array[ri]] = [array[ri], array[i]];
        }
        return array;
      }
      
}


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