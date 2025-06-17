import { Game } from "@/class/game";

export class Boss {
  game: Game;
  width: number;
  height: number;
  x: number;
  y: number;
  frameX: number[];
  ifx: number;
  frameY: number;
  frametimer: number;
  frameinterval: number;
  image: HTMLImageElement;
  health: number;
  speed: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 1260 / 7;
    this.height = 262 / 2;
    this.x = game.canvas.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.frameX = Array.from({ length: 7 }, (_, i) => i);
    this.ifx = 0;
    this.frameY = 0;
    this.frametimer = 0;
    this.frameinterval = 1000 / 30;
    this.speed = 0;
    this.health = 10;
    this.image = new Image();
    this.image.src = "/metroid.png";
  }

  hitbox = {
    width: 40,
    height: 20,
    x: 0,
    y: 0,
  };

  async spawnBoss() {
    const qty = this.game.waves[this.game.windex].boss.qty;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    for (let i = 0; i < qty; i++) {
      this.game.bosses.push(new Boss(this.game));
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  initPosition() {
    if (this.y < 0) {
      this.y += 0.5;
    }
  }

  takeDamage(index: number) {
    if (this.health < 1 || this.y < 0) return;
    this.health--;
    // console.log(this.health);
    this.y -= this.height * 0.05;

    if (this.health === 0) {
      this.game.bosses.splice(index, 1);
    }
  }

  drawHitbox() {
    let { c, debug } = this.game;
    if (!c) return;

    this.hitbox.x = this.x + this.width * 0.5 - this.hitbox.width * 0.5;
    this.hitbox.y = this.y + this.height * 0.5 - this.hitbox.height * 0.5;

    if (debug) {
      c.strokeStyle = "red";
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

  update(deltaTime: number) {
    this.game.bosses.forEach((boss) => {
      boss.draw();
      boss.drawHitbox();
      boss.initPosition();
      boss.y += boss.speed;

      if (boss.frametimer > boss.frameinterval) {
        boss.ifx < boss.frameX.length - 1 ? boss.ifx++ : (boss.ifx = 0);
        boss.frametimer = 0;
      } else {
        boss.frametimer += deltaTime;
      }

      if (boss.y > this.game.canvas.height) {
        // this.game.bosses.splice(index, 1);
        boss.speed += 0.01;
        boss.y = -boss.height;
        boss.x = Math.random() * (this.game.canvas.width - boss.width);
      }
      // console.log(this.game.bosses);
    });
  }
}
