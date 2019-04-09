var config = {
  type: Phaser.CANVAS,
  width: 800,
  parent: "canvas",
  height: 600,
  //parent: 'canvas',
  canvas: document.getElementById("myCustomCanvas"),
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  //Loading Game Assets
  this.load.image("background", "Assets/SkyBG.png");
  this.load.image("platform", "Assets/platform copy.png");
  this.load.image("ground", "Assets/Floor.png");
  this.load.spritesheet(
    "dino1",
    "Assets/DinoSprites - vita.png",
    { frameWidth: 23, frameHeight: 23 } //Set width and height for frame
  );
  this.load.spritesheet(
    "dino2",
    "Assets/DinoSprites - mort.png",
    { frameWidth: 23, frameHeight: 23 } //Set width and height for frame
  );
  this.load.image("bacon", "Assets/Food/Bacon.png");
  this.load.image("beer", "Assets/Food/Beer.png");

}

//Creating Game Assets
function create() {
  //Adding background and platforms as STATIC Objects
  this.add.image(300, 290, "background");
  //this.add.image(400, 470, 'ground').setScale(1/2);

  platforms = this.physics.add.staticGroup();
  platforms
    .create(400, 600, "ground")
    .setScale(7/8)
    .refreshBody();

  platforms.create(398, 350, "platform").setScale(3/4).refreshBody();
  platforms.create(50, 190, "platform").setScale(3/4).refreshBody();
  platforms.create(750, 190, "platform").setScale(3/4).refreshBody();

  //Creating of Player 1 and 2 Sprite
  player1 = this.physics.add.sprite(100, 350, "dino1").setScale(2);
  player2 = this.physics.add.sprite(690, 350, "dino2").setScale(2);

  //Creating Prizes
  bacon = this.physics.add.group({
    key: "bacon",
    repeat: 2,
    setXY: { x: 25, y: 0, stepX: 150 }
  });
  //Set bounce for bacon pieces
  bacon.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setScale(2);
  });

  this.physics.add.collider(bacon, platforms); //Make sure prize does not collide with platform
  this.physics.add.overlap(player1, bacon, collectBacon, null, this); //If player overlaps with bacon, run function collectBacon

  //Make bacon dissappear on collection
  function collectBacon(player1, bacon) {
    bacon.disableBody(true, true);

    score += 10; //Every time bacon collected add 10 to score
    scoreText.setText("Score: " + score);


  }

  beers = this.physics.add.group({
    key: "beer",
    repeat: 2,
    setXY: { x: 450, y: 0, stepX: 150 }
  });
  //Set bounce for beer pieces
  beers.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setScale(2);
  });

  this.physics.add.collider(beers, platforms); //Make sure prize does not collide with platform
  this.physics.add.overlap(player2, beers, collectBeer, null, this); //If player overlaps with beer, run function collectBacon

  //Make beer dissappear on collection
  function collectBeer(player2, beer) {
    beer.disableBody(true, true);

    score2 += 10; //Every time bacon collected add 10 to score
    score2Text.setText("Score: " + score2);

    if (beers.countActive() == 0){
      beers.children.iterate(function (child) {
        var xc = Math.random() * 700
        var xy = Math.random()*600
        console.log(xc)
        child.enableBody(true, xc,0, true, true);

    })
    }
  }

  //Player 1 and 2 Phjysics
  player1.setBounce(0.15); //Bounce when hitting ground
  player1.setCollideWorldBounds(true); //setting boundaries for player
  player2.setBounce(0.15); //Bounce when hitting ground
  player2.setCollideWorldBounds(true); //setting boundaries for player

  //Create animations
  this.anims.create({
    key: "turn",
    frames: [{ key: "dino1", frame: 1 }],
    frameRate: 20
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("dino1", {
      start: 20,
      end: 23
    }), //Start and end set frame from sprite map
    frameRate: 12,
    repeat: -1
  });

  this.anims.create({
    key: "walk2",
    frames: this.anims.generateFrameNumbers("dino2", {
      start: 20,
      end: 23
    }), //Start and end set frame from sprite map
    frameRate: 12,
    repeat: -1
  });

  this.anims.create({
    key: "turn2",
    frames: [{ key: "dino2", frame: 1 }],
    frameRate: 20
  });

  this.physics.add.collider(player1, platforms);
  this.physics.add.collider(player2, platforms);
  cursors = this.input.keyboard.createCursorKeys();
  player1.body.setGravityY(300);

  //Creating variables to collect score for collecting items
  var score = 0;
  var scoreText;
  var score2 = 0;
  var score2Text;

  scoreText = this.add.text(16, 16, "P1 score: 0", {
    fontSize: "32px",
    fill: "#000"
  });
  score2Text = this.add.text(500, 16, "P2 score: 0", {
    fontSize: "32px",
    fill: "#000"
  });

  //Plaeyer 2 key settings...

  upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

  downButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

  rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

//Executing actions
function update() {
  if (cursors.left.isDown) {
    //Left Control
    player1.setVelocityX(-160); //How fast player should move

    player1.anims.play("walk", true); //What animation to use

    player1.flipX = true; //Flip so that do not have to create seperate animation
  } else if (cursors.right.isDown) {
    //Reight Control
    player1.setVelocityX(160);

    player1.anims.play("walk", true);

    player1.flipX = false; //Do not flip on right as animation is already for right
  } else {
    player1.setVelocityX(0);

    player1.anims.play("turn");
  }

  if (cursors.up.isDown && player1.body.touching.down) {
    //If statement for jumping
    player1.setVelocityY(-450);
  }
  if (cursors.down.isDown) {
    player1.setVelocityY(600);
  }

  // Player2 controls

  if (leftButton.isDown) {
    player2.setVelocityX(-160); //How fast player should move

    player2.anims.play("walk2", true); //What animation to use

    player2.flipX = true;
  } else if (rightButton.isDown) {
    //Reight Control
    player2.setVelocityX(160);

    player2.anims.play("walk2", true);

    player2.flipX = false;
  } else {
    player2.setVelocityX(0);

    player2.anims.play("turn2");
  }

  if (upButton.isDown && player2.body.touching.down) {
    player2.setVelocityY(-450);
  }
}