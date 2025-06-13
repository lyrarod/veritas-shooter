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
    this.image = new Image();
    this.image.src = "/space_whales.png";
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
    this.draw();

    if (this.frametimer > this.frameinterval) {
      this.ifx < this.frameX.length - 1 ? this.ifx++ : (this.ifx = 0);
      this.frametimer = 0;
    } else {
      this.frametimer += deltaTime;
    }
  }
}

export class Boss2 extends Boss {
  constructor(game: Game) {
    super(game);
    this.width = 512 / 8;
    this.height = 272 / 4;
    this.x = game.canvas.width * 0.5 - this.width * 0.5;
    this.y = 0;
    this.frameX = Array.from({ length: 4 }, (_, i) => i);
    this.ifx = 0;
    this.frameY = 0;
    this.image.src = "/boss2.png";
  }

  hitbox = {
    w: 20,
    h: 20,
    x: 0,
    y: 0,
  };

  drawHitbox() {
    let { c, debug } = this.game;
    if (!c) return;

    if (debug) {
      c.strokeStyle = "cyan";
      c.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
    }
    this.hitbox.x = this.x + this.width * 0.5 - this.hitbox.w * 0.5;
    this.hitbox.y = this.y + this.height * 0.5 - this.hitbox.h * 0.2;
  }

  draw(): void {
    super.draw();
    this.drawHitbox();
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
  }
}
