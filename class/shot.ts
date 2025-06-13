import { Game } from "./game";
import { Hero } from "./hero";

export class Shot {
  width: number;
  height: number;
  speed: number;
  shots: Shot[];
  direction: { x: number; y: number };
  position: { x: number; y: number };
  game: Game;
  hero: Hero;
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;

  constructor(
    game: Game,
    position: { x: number; y: number } = { x: 0, y: 0 },
    direction: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this.game = game;
    this.canvas = game.canvas;
    this.c = game.canvas.getContext("2d");
    this.hero = game.hero;
    this.position = position;
    this.direction = direction;

    this.width = this.hero.direction.left || this.hero.direction.right ? 10 : 2;
    this.height = this.hero.direction.up || this.hero.direction.down ? 10 : 2;
    this.speed = 10;
    this.shots = [] as Shot[];
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
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltaTime: number) {
    this.shots.forEach((shot) => {
      shot.draw();
      shot.position.x += shot.speed * shot.direction.x;
      shot.position.y += shot.speed * shot.direction.y;
    });

    this.shots = this.shots.filter((shot) => {
      if (
        shot.position.x < -shot.width ||
        shot.position.x > this.canvas.width ||
        shot.position.y < -shot.height ||
        shot.position.y > this.canvas.height
      ) {
        return false;
      }
      return true;
    });

    // console.log(this.shots);
  }
}
