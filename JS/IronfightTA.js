//Game Code
var config = {
  type: Phaser.CANVAS,
  width: 800,
  parent: "timeattackgame",
  height: 600,
  canvas: document.getElementById("timeattackgame"),
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
  this.load.image("background", "../Assets/SkyBG.png");
  this.load.image("platform", "../Assets/platform copy.png");
  this.load.image("ground", "../Assets/Floor.png");
  this.load.spritesheet(
    "dino1single",
    "../Assets/DinoSprites - vita.png",
    { frameWidth: 23, frameHeight: 23 } //Set width and height for frame
  );
  this.load.spritesheet(
    "dino2",
    "../Assets/DinoSprites - mort.png",
    { frameWidth: 23, frameHeight: 23 } //Set width and height for frame
  );
  this.load.spritesheet(
    "bullet",
    "../Assets/16_sunburn_spritesheet.png",
    { frameWidth: 100, frameHeight: 100 } //Set width and height for frame
  );
  this.load.image("bacon", "../Assets/Food/Bacon.png");
  this.load.image("beer", "../Assets/Food/Beer.png");
  this.load.image("asteroid", "../Assets/asteroid.png");
  this.load.audio("main", "../Assets/02 - Getting Started.mp3");
}

function create() {
  //Creating Game Assets

  //Adding background and platforms as STATIC Objects
  this.add.image(300, 290, "background");

  platforms = this.physics.add.staticGroup();
  platforms
    .create(400, 600, "ground")
    .setScale(7 / 8)
    .refreshBody();

  platforms
    .create(398, 350, "platform")
    .setScale(3 / 4)
    .refreshBody();
  platforms
    .create(50, 190, "platform")
    .setScale(3 / 4)
    .refreshBody();
  platforms
    .create(750, 190, "platform")
    .setScale(3 / 4)
    .refreshBody();

  //Creating of Player 1 and 2 Sprite
  player3 = this.physics.add.sprite(100, 350, "dino1single").setScale(2);

  //Timer countdown
  //TIMER CODE:
  time = 30;
  function startCountDown(seconds) {
    var counter = seconds;
    var interval = setInterval(() => {
      console.log(counter);
      counter--;
      if (counter <= 0) {
        // code here will run when the counter reaches zero.
        $("canvas")
          .delay(500)
          .fadeOut();
        $("#timeattack")
          .delay(800)
          .fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "500");
        //$(".spscore").html(score);
        clearInterval(interval);
        console.log("Ding!");
      }
      timeText.setText("Time Left: " + counter);
      var x =
        player3.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = asteroids.create(x, 16, "asteroid").setScale(1 / 30);
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);
    }, 1000);
  }

  timeText = this.add.text(270, 16, startCountDown(30), {
    fontSize: "32px",
    fill: "#000"
  });

  asteroids = this.physics.add.group(); //Add Asteroids

  this.physics.add.collider(asteroids, platforms); //Make sure asteroids do not go through platforms

  this.physics.add.collider(player3, asteroids, hitAST, null, this); //When player1 hits asteroid

  function hitAST(player3, asteroids) {
    this.physics.pause();
    player3.anims.play("turn");
    this.cameras.main.shake(50);
    $("canvas")
      .delay(500)
      .fadeOut();
    $("#Asteroidhit")
      .delay(800)
      .fadeIn();
    $("html, body").animate({ scrollTop: 0 }, "500");
  }

  player3.setBounce(0.15); //Bounce when hitting ground
  player3.setCollideWorldBounds(true); //setting boundaries for player

  //Create animations
  this.anims.create({
    key: "turn",
    frames: [{ key: "dino1single", frame: 1 }],
    frameRate: 20
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("dino1single", {
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

  this.physics.add.collider(player3, platforms);
  cursors2 = this.input.keyboard.createCursorKeys();
  player3.body.setGravityY(300);

  this.bgMusic = this.sound.add("main", { volume: 0.5, loop: true });
}

//Executing actions
function update() {
  if (cursors2.left.isDown) {
    //Left Control
    player3.setVelocityX(-160); //How fast player should move

    player3.anims.play("walk", true); //What animation to use

    player3.flipX = true; //Flip so that do not have to create seperate animation
  } else if (cursors2.right.isDown) {
    //Reight Control
    player3.setVelocityX(160);

    player3.anims.play("walk", true);

    player3.flipX = false; //Do not flip on right as animation is already for right
  } else {
    player3.setVelocityX(0);

    player3.anims.play("turn");
  }

  if (cursors2.up.isDown && player3.body.touching.down) {
    //If statement for jumping
    player3.setVelocityY(-450);
  }
  if (cursors2.down.isDown) {
    player3.setVelocityY(600);
  }
}
