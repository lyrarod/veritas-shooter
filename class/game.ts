import { Boss, Boss2 } from "./boss";
import { Hero } from "./hero";
import { Shot } from "./shot";
import { Keyboard } from "./keyboard";

export class Game {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;
  hero: Hero;
  boss: Boss;
  boss2: Boss2;
  shot: Shot;
  keyboard: Keyboard;
  assets: HTMLImageElement[];
  loadedImages: number;
  assetsLoaded: boolean;
  gameObjects: (Hero | Boss | Shot)[];
  bosses: Boss[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.c = canvas.getContext("2d");

    this.keyboard = new Keyboard(this);

    this.hero = new Hero(this);
    this.boss = new Boss(this);
    this.boss2 = new Boss2(this);
    this.shot = new Shot(this);

    this.gameObjects = [
      this.hero,
      // this.boss,
      this.boss2,
      this.shot,
    ];

    this.bosses = [];

    this.loadedImages = 0;
    this.assetsLoaded = false;

    this.assets = [...this.hero.assets, this.boss.image, this.boss2.image];

    this.assets.map((asset, i) => {
      asset.onload = async () => {
        this.loadedImages++;
        // console.log(`Asset ${i} loaded: `, asset);

        if (this.loadedImages === this.assets.length) {
          let loader = document.getElementById("canvasLoader");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.assetsLoaded = true;
          loader?.classList.add("hidden");
        }
      };

      asset.onerror = () => {
        console.error(`Asset ${i} failed to load: `, asset);
      };
    });
  }

  lastTime = 0;
  debug = false;

  update(deltaTime: number) {
    if (!this.assetsLoaded) return;
    this.gameObjects.forEach((gameObject) => gameObject.update(deltaTime));
  }

  loop = (timeStamp: number = 0) => {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    // console.log(Math.floor(deltaTime));

    requestAnimationFrame(this.loop);
    this.c?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.update(deltaTime);
  };

  collisionDetection(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  start() {
    requestAnimationFrame(this.loop);
  }
}
