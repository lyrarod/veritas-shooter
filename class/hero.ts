import { Game } from "./game";

export class Hero {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;
  sprite: {
    width: number;
    height: number;
    x: number;
    y: number;
    frameX: number[];
    ifx: number;
    frameY: number;
    frameTimer: number;
    frameInterval: number;
    image: HTMLImageElement;
    isMoving: boolean;
    speed: number;
  };
  assets: HTMLImageElement[];
  sprite_shoot: {} | any;
  direction: { left: boolean; right: boolean; up: boolean; down: boolean };
  game: Game;
  RIGHT: number;
  LEFT: number;
  UP: number;
  DOWN: number;
  shotAudio: HTMLAudioElement;

  constructor(game: Game) {
    this.game = game;
    this.canvas = game.canvas;
    this.c = game.canvas.getContext("2d");

    this.RIGHT = 3;
    this.LEFT = 2;
    this.UP = 1;
    this.DOWN = 0;

    this.sprite = {
      width: 232 / 4,
      height: 2088 / 18,
      x: 0,
      y: 0,
      speed: 2,
      frameX: Array.from({ length: 4 }, (_, i) => i),
      ifx: 0,
      frameY: this.UP,
      frameTimer: 0,
      frameInterval: 1000 / 6,
      image: new Image(),
      isMoving: false,
    };
    this.sprite.image.src = "/sprite.png";

    this.sprite_shoot = {
      width: 58,
      height: 116,
      x: 0,
      y: 0,
      image: {
        left: new Image(),
        right: new Image(),
        up: new Image(),
        down: new Image(),
      },
    };
    this.sprite_shoot.image["left"].src = "/left.png";
    this.sprite_shoot.image["right"].src = "/right.png";
    this.sprite_shoot.image["up"].src = "/up.png";
    this.sprite_shoot.image["down"].src = "/down.png";

    this.direction = {
      left: false,
      right: false,
      up: true,
      down: false,
    };

    this.shotAudio = new Audio(
      "/audio/LASRGun_Particle_Compressor_Fire_01.wav"
    );

    this.assets = [
      this.sprite.image,
      this.sprite_shoot.image.left,
      this.sprite_shoot.image.right,
      this.sprite_shoot.image.up,
      this.sprite_shoot.image.down,
      this.shotAudio,
    ];

    this.startPosition();
  }

  canShot = false;
  isShooting = false;

  playShotAudio() {
    this.shotAudio.currentTime = 0;
    this.shotAudio.volume = 0.3;
    this.shotAudio.play();
  }

  shooter() {
    if (!this.canShot) return;
    this.playShotAudio();
    this.isShooting = true;
    this.game.hero.direction = {
      left: false,
      right: false,
      up: true,
      down: false,
    };
    this.game.shot.addShot();
  }

  drawSpriteShooterDirection() {
    let { c } = this;
    if (!c || !this.isShooting) return;

    this.sprite_shoot.x = this.sprite.x;
    this.sprite_shoot.y = this.sprite.y;

    if (this.direction.left) {
      c?.drawImage(
        this.sprite_shoot.image.left,
        this.sprite_shoot.x,
        this.sprite_shoot.y,
        this.sprite_shoot.width,
        this.sprite_shoot.height
      );
    }
    if (this.direction.right) {
      c?.drawImage(
        this.sprite_shoot.image.right,
        this.sprite_shoot.x,
        this.sprite_shoot.y,
        this.sprite_shoot.width,
        this.sprite_shoot.height
      );
    }
    if (this.direction.up) {
      c?.drawImage(
        this.sprite_shoot.image.up,
        this.sprite_shoot.x,
        this.sprite_shoot.y,
        this.sprite_shoot.width,
        this.sprite_shoot.height
      );
    }
    if (this.direction.down) {
      c?.drawImage(
        this.sprite_shoot.image.down,
        this.sprite_shoot.x,
        this.sprite_shoot.y,
        this.sprite_shoot.width,
        this.sprite_shoot.height
      );
    }
  }

  draw() {
    let { c } = this;
    if (!c) return;

    this.drawSpriteShooterDirection();

    if (this.game.debug) {
      c.strokeStyle = "silver";
      c.strokeRect(
        this.sprite.x,
        this.sprite.y,
        this.sprite.width,
        this.sprite.height
      );
    }

    if (this.isShooting) return;

    c.drawImage(
      this.sprite.image,
      this.sprite.frameX[this.sprite.ifx] * this.sprite.width,
      this.sprite.frameY * this.sprite.height,
      this.sprite.width,
      this.sprite.height,
      this.sprite.x,
      this.sprite.y,
      this.sprite.width,
      this.sprite.height
    );
  }

  update(deltaTime: number) {
    this.draw();

    this.canShot = true;
    this.sprite.isMoving = false;

    if (this.sprite.y + this.sprite.height > this.canvas.height) {
      this.sprite.y -= 1;
      this.canShot = false;
      this.sprite.isMoving = true;
      this.game.keyboard.keyPressed.KeyA = false;
      this.game.keyboard.keyPressed.KeyD = false;
      this.game.keyboard.keyPressed.ArrowLeft = false;
      this.game.keyboard.keyPressed.ArrowRight = false;
    }

    if (this.isShooting === false) {
      this.sprite.frameY = this.UP;

      if (this.game.keyboard.isMovingRight) {
        this.sprite.frameY = this.RIGHT;
        if (this.sprite.x + this.sprite.width < this.canvas.width) {
          this.sprite.isMoving = true;
          this.sprite.x += this.sprite.speed;
        }
      }

      if (this.game.keyboard.isMovingLeft) {
        this.sprite.frameY = this.LEFT;
        if (this.sprite.x > 0) {
          this.sprite.isMoving = true;
          this.sprite.x -= this.sprite.speed;
        }
      }

      // if (this.game.keyboard.isMovingUp) {
      //   this.sprite.frameY = this.UP;
      //   if (this.sprite.y > -this.sprite.height * 0.3) {
      //     this.sprite.isMoving = true;
      //     this.sprite.y -= this.sprite.speed;
      //   }
      // }

      // if (this.game.keyboard.isMovingDown) {
      //   this.sprite.frameY = this.DOWN;
      //   if (this.sprite.y + this.sprite.height < this.canvas.height) {
      //     this.sprite.isMoving = true;
      //     this.sprite.y += this.sprite.speed;
      //   }
      // }
    }

    if (this.sprite.frameTimer > this.sprite.frameInterval) {
      this.sprite.isMoving === true ? this.sprite.ifx++ : (this.sprite.ifx = 0);

      if (this.sprite.ifx >= this.sprite.frameX.length) {
        this.sprite.ifx = 0;
      }
      this.sprite.frameTimer = 0;
    } else {
      this.sprite.frameTimer += deltaTime;
    }
  }

  startPosition() {
    this.sprite.y = this.canvas.height;
    this.sprite.x = this.canvas.width * 0.5 - this.sprite.width * 0.5;
  }
}
