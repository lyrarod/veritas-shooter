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

  constructor(
    game: Game,
    position: { x: number; y: number } = { x: 0, y: 0 },
    direction: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this.game = game;
    this.hero = game.hero;
    this.canvas = game.canvas;
    this.c = game.canvas.getContext("2d");

    this.width = this.hero.direction.left || this.hero.direction.right ? 10 : 2;
    this.height = this.hero.direction.up || this.hero.direction.down ? 10 : 2;
    this.x = position.x;
    this.y = position.y;
    this.direction = direction;
    this.speed = 10;
    this.shots = [] as Shot[];
    this.isRemoved = false;
  }

  addShot() {
    let position = { x: 0, y: 0 };
    let direction = { x: 0, y: 0 };

    if (this.hero.direction.left) {
      direction = { x: -1, y: 0 };
      position = {
        x: this.hero.sprite.x - 7,
        y: this.hero.sprite.y + 65,
      };
    }

    if (this.hero.direction.right) {
      direction = { x: 1, y: 0 };
      position = {
        x: this.hero.sprite.x + this.hero.sprite.width - 3,
        y: this.hero.sprite.y + 65,
      };
    }

    if (this.hero.direction.up) {
      direction = { x: 0, y: -1 };
      position = {
        x: this.hero.sprite.x + this.hero.sprite.width - 19,
        y: this.hero.sprite.y + 36,
      };
    }

    if (this.hero.direction.down) {
      direction = { x: 0, y: 1 };
      position = {
        x: this.hero.sprite.x + 18,
        y: this.hero.sprite.y + 71,
      };
    }
    this.shots.push(new Shot(this.game, position, direction));
  }

  draw() {
    if (!this.c) return;
    this.c.fillStyle = "cyan";
    this.c.fillRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime: number) {
    this.shots.forEach((shot, sid) => {
      shot.draw();
      shot.x += shot.speed * shot.direction.x;
      shot.y += shot.speed * shot.direction.y;

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
