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
    this.width = 16380 / 39;
    this.height = 1140 / 4;
    this.x = game.canvas.width * 0.5 - this.width * 0.5;
    this.y = 0;
    this.frameX = Array.from({ length: 39 }, (_, i) => i);
    this.ifx = 0;
    this.frameY = 3;
    this.frametimer = 0;
    this.frameinterval = 1000 / 60;
    this.speed = 0;
    this.health = 5;
    this.image = new Image();
    this.image.src = "/space_whales.png";
  }

  hitbox = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  spawn() {
    this.game.bosses.push(new Boss(this.game));
  }

  takeDamage(index: number) {
    if (this.health < 1 || this.y < 0) return;
    this.health--;
    // console.log(this.health);
    // this.y -= this.height * 0.05;

    if (this.health === 0) {
      this.game.bosses.splice(index, 1);
    }
  }

  drawHitbox() {
    let { c, debug } = this.game;
    if (!c) return;

    this.hitbox.width = this.width * 0.7;
    this.hitbox.height = this.height * 0.5;
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
    this.game.bosses.forEach((boss, index) => {
      boss.draw();
      boss.drawHitbox();
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

export class Boss2 extends Boss {
  constructor(game: Game) {
    super(game);
    this.width = 512 / 8;
    this.height = 272 / 4;
    this.x = Math.random() * (game.canvas.width - this.width);
    this.y = -this.height;
    this.frameX = Array.from({ length: 4 }, (_, i) => i);
    this.ifx = 0;
    this.frameY = 0;
    this.speed = 0.1 + Math.random() * 0.25;
    this.health = 3;
    this.image.src = "/boss2.png";
  }

  hitbox = {
    width: 20,
    height: 10,
    x: 0,
    y: 0,
  };

  takeDamage(index: number) {
    super.takeDamage(index);
    this.y -= this.height * 0.05;
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

  draw(): void {
    super.draw();
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.game.bosses.length < 10) {
      this.frametimer++;
      // console.log(this.frametimer);

      if (this.frametimer % 160 === 0) {
        this.game.bosses.push(new Boss2(this.game));
      }
    }
  }
}
