import { Hero } from "./hero";
import { Keyboard } from "./keyboard";
import { Shot } from "./shot";

export class Game {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;
  hero: Hero;
  shot: Shot;
  keyboard: Keyboard;
  assets: HTMLImageElement[];
  loadedImages: number;
  assetsLoaded: boolean;
  gameObjects: (Hero | Shot)[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.c = canvas.getContext("2d");

    this.keyboard = new Keyboard(this);

    this.hero = new Hero(this);
    this.shot = new Shot(this);

    this.gameObjects = [this.hero, this.shot];

    this.loadedImages = 0;
    this.assetsLoaded = false;

    this.assets = [...this.hero.assets];

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

  update(deltaTime: number) {
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

  start() {
    requestAnimationFrame(this.loop);
  }
}
