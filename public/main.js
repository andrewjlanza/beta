let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
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
}

let platforms

let player

let cursors

let mortyheads
let score = 0
let scoreText

let bombs

let game = new Phaser.Game(config)

function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('ground', 'assets/platform.png')
  this.load.image('mortyhead', 'assets/mortyhead.png')
  this.load.image('rickrunning', 'assets/rickrunning.png')
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  })
}
function create() {
  this.add.image(400, 300, 'sky')

  platforms = this.physics.add.staticGroup()

  platforms
    .create(400, 568, 'ground')
    .setScale(2)
    .refreshBody()

  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')
  platforms.create(400, 500, 'ground')
  platforms.create(200, 200, 'ice-platform')
  platforms.create(600, 97, 'ice-platform')
  platforms.create(40, 450, 'ice-platform')
  platforms.create(340, 330, 'ice-platform')

  player = this.physics.add.sprite(200, 450, 'dude')

  player.setBounce(0.1)
  player.setCollideWorldBounds(true)

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { mortyhead: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  })

  this.anims.create({
    key: 'right',

    frames: this.anims.generateFrameNumbers('dude', { mortyheadt: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })

  this.physics.add.collider(player, platforms)

  cursors = this.input.keyboard.createCursorKeys()

  mortyheads = this.physics.add.group({
    key: 'mortyhead',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  })

  mortyheads.children.iterate(mortyhead => {
    mortyhead.setBounceY(Phaser.Math.FloatBetween(0.6, 1.0))
  })

  this.physics.add.collider(mortyheads, platforms)

  this.physics.add.overlap(player, mortyheads, collectmortyhead, null, this)

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  })

  bombs = this.physics.add.group()

  this.physics.add.collider(bombs, platforms)

  this.physics.add.collider(player, bombs, hitBomb, null, this)
}

function collectmortyhead(player, mortyhead) {
  mortyhead.disableBody(true, true)

  score += 10
  scoreText.setText('Score: ' + score)

  if (mortyheads.countActive(true) === 0) {
    mortyheads.children.iterate(mortyhead => {
      mortyhead.enableBody(true, mortyhead.x, 0, true, true)
    })

    let bombX =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400)

    let bomb = bombs.create(bombX, 16, 'rickrunning')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    bomb.allowGravity = false
  }
}

function hitBomb(player, bomb) {
  this.physics.pause()

  player.setTint(0xff0000)

  player.anims.play('turn')

  gameOver = true
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160)

    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)

    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)

    player.anims.play('turn')
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330)
  }
}
