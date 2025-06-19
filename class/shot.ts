import { Game } from "./game";
import { Hero } from "./hero";

export class Shot {
  game: Game;
  hero: Hero;
  width: number;
  height: number;
  x: number;
  y: number;
  direction: { x: number; y: number };
  speed: number;
  shots: Shot[];
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;
  isRemoved: boolean;
  sprite: HTMLImageElement;
  frameX: number[];
  ifx: number;
  frameY: number;
  frameTimer: number;
  frameInterval: number;
  startFrameX: number;
  lastFrameX: number;

  constructor(
    game: Game,
    position: { x: number; y: number } = { x: 0, y: 0 },
    direction: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this.game = game;
    this.hero = game.hero;
    this.canvas = game.canvas;
    this.c = game.canvas.getContext("2d");

    this.width = 576 / 24;
    this.height = 360 / 15;
    this.x = position.x;
    this.y = position.y;
    this.direction = direction;
    this.speed = 5;
    this.startFrameX = 16;
    this.lastFrameX = 24;
    this.ifx = this.startFrameX;
    this.frameX = Array.from({ length: this.lastFrameX }, (_, i) => i);
    this.frameY = 1;
    this.frameTimer = 0;
    this.frameInterval = 1000 / 30;
    this.isRemoved = false;
    this.shots = [] as Shot[];
    this.sprite = new Image();
    this.sprite.src = "/bullet/bullet_1A.png";
  }

  addShot() {
    let position = { x: 0, y: 0 };
    let direction = { x: 0, y: 0 };

    if (this.hero.direction.left) {
      direction = { x: -1, y: 0 };
      position = {
        x: this.hero.sprite.x - 20,
        y: this.hero.sprite.y + 54,
      };
    }

    if (this.hero.direction.right) {
      direction = { x: 1, y: 0 };
      position = {
        x: this.hero.sprite.x + this.hero.sprite.width - 4,
        y: this.hero.sprite.y + 54,
      };
    }

    if (this.hero.direction.up) {
      direction = { x: 0, y: -1 };
      position = {
        x: this.hero.sprite.x + this.hero.sprite.width * 0.48,
        y: this.hero.sprite.y + 30,
      };
    }

    if (this.hero.direction.down) {
      direction = { x: 0, y: 1 };
      position = {
        x: this.hero.sprite.x + 6,
        y: this.hero.sprite.y + 70,
      };
    }
    this.shots.push(new Shot(this.game, position, direction));
  }

  draw() {
    if (!this.c) return;

    this.c.drawImage(
      this.sprite,
      this.frameX[this.ifx] * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (this.game.debug) {
      this.c.strokeStyle = "silver";
      this.c.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  update(deltaTime: number) {
    this.shots.forEach((shot, sid) => {
      shot.draw();
      shot.x += shot.speed * shot.direction.x;
      shot.y += shot.speed * shot.direction.y;

      if (shot.frameTimer > shot.frameInterval) {
        shot.ifx < shot.frameX.length - 1
          ? shot.ifx++
          : (shot.ifx = shot.startFrameX);
        shot.frameTimer = 0;
      } else {
        shot.frameTimer += deltaTime;
      }

      this.game.enemies.forEach((enemy, eid) => {
        if (this.game.collisionDetection(enemy.hitbox, shot)) {
          enemy.takeDamage(eid);
          shot.isRemoved = true;
        }
      });

      this.game.bosses.forEach((boss, bid) => {
        if (this.game.collisionDetection(boss.hitbox, shot)) {
          boss.takeDamage(bid);
          shot.isRemoved = true;
        }
      });

      if (
        shot.isRemoved ||
        shot.x < -shot.width ||
        shot.x > this.canvas.width ||
        shot.y < -shot.height ||
        shot.y > this.canvas.height
      ) {
        this.shots.splice(sid, 1);
      }

      // console.log(this.shots);
    });
  }
}
