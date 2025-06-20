import { spawn } from "child_process";
import { Game } from "./game";

export class Enemy {
  game: Game;
  width: number;
  height: number;
  x: number;
  y: number;
  frameX: number[];
  ifx: number;
  frameY: number;
  speed: number;
  health: number;
  frametimer: number;
  frameinterval: number;
  image: HTMLImageElement;
  startFrameX: number;
  lastFrameX: number;
  direction: { x: number; y: number };

  constructor(game: Game) {
    this.game = game;
    this.width = 512 / 8;
    this.height = 260 / 4;
    this.x = Math.random() * (game.canvas.width - this.width);
    this.y = -this.height;
    this.startFrameX = 0;
    this.lastFrameX = 4;
    this.ifx = this.startFrameX;
    this.frameX = Array.from({ length: this.lastFrameX }, (_, i) => i);
    this.frameY = 0;
    this.frametimer = 0;
    this.frameinterval = 1000 / 30;
    this.speed = 0.25 + Math.random() * 0.75;
    this.direction = { x: 0, y: 0 };
    this.health = 3;
    this.image = new Image();
    this.image.src = "/enemy.png";
  }

  hitbox = {
    width: 20,
    height: 10,
    x: 0,
    y: 0,
  };

  async spawnEnemies() {
    const qty = this.game.waves[this.game.windex].enemy.qty;
    await new Promise((resolve) => setTimeout(resolve, 4000));
    for (let i = 0; i < qty; i++) {
      this.game.enemies.push(new Enemy(this.game));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  takeDamage(index: number) {
    if (this.health < 1 || this.y < 0) return;
    this.health--;
    this.game.playImpactAudio();
    this.y -= this.height * 0.05;

    const hitChangeSprite = (fy: number = 0) => {
      this.frameY = fy;
      this.startFrameX = 0;
      this.lastFrameX = 8;
      this.ifx = this.startFrameX;
      this.frameX = Array.from({ length: this.lastFrameX }, (_, i) => i);
    };

    if (this.health === 2) {
      hitChangeSprite(2);
    } else if (this.health === 1) {
      hitChangeSprite(3);
      this.direction.x = Math.random() < 0.5 ? -0.1 : 0.1;
    } else {
      this.game.enemies.splice(index, 1);
      this.game.explosion.show({
        x: this.x + this.width * 0.5,
        y: this.y + this.height * 0.5,
      });
    }
    // console.log(this.game.enemies);

    if (this.game.enemies.length < 1) {
      this.game.waves[this.game.windex].enemy.isComplete = true;
      this.game.boss.spawnBoss();
    }
    // console.log(this.game.waves[this.game.windex].enemy.isComplete);
  }

  drawHitbox() {
    let { c, debug } = this.game;
    if (!c) return;

    this.hitbox.x = this.x + this.width * 0.5 - this.hitbox.width * 0.5;
    this.hitbox.y = this.y + this.height * 0.5 - this.hitbox.height * 0.5 + 8;

    if (debug) {
      c.strokeStyle = "cyan";
      c.strokeRect(
        this.hitbox.x,
        this.hitbox.y,
        this.hitbox.width,
        this.hitbox.height
      );
    }
  }

  draw() {
    let { c, debug } = this.game;
    if (!c) return;

    c.drawImage(
      this.image,
      this.frameX[this.ifx] * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (debug) {
      c.strokeStyle = "silver";
      c.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  update(deltaTime: number): void {
    this.game.enemies.forEach((enemy) => {
      enemy.draw();
      enemy.drawHitbox();
      enemy.y += enemy.speed;
      enemy.x += enemy.speed * enemy.direction.x;

      if (enemy.frametimer > enemy.frameinterval) {
        enemy.ifx < enemy.frameX.length - 1
          ? enemy.ifx++
          : (enemy.ifx = enemy.startFrameX);
        enemy.frametimer = 0;
      } else {
        enemy.frametimer += deltaTime;
      }

      if (enemy.y > this.game.canvas.height) {
        // this.game.enemyes.splice(index, 1);
        enemy.speed += 0.01;
        enemy.y = -enemy.height;
        enemy.x = Math.random() * (this.game.canvas.width - enemy.width);
      }
      // console.log(this.game.enemies);
    });
  }
}
