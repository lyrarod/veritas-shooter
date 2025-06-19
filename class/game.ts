import { Boss } from "./boss";
import { Hero } from "./hero";
import { Shot } from "./shot";
import { Enemy } from "./enemy";
import { Keyboard } from "./keyboard";
import { Explosion } from "./explosion";

export class Game {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D | null;
  hero: Hero;
  boss: Boss;
  shot: Shot;
  enemy: Enemy;
  keyboard: Keyboard;
  assets: (HTMLImageElement | HTMLAudioElement)[];
  countAssets: number;
  assetsLoaded: boolean;
  gameObjects: (Hero | Boss | Shot | Enemy | Explosion)[];
  bosses: Boss[];
  enemies: Enemy[];
  windex: number;
  waves: {
    enemy: { qty: number; isComplete: boolean };
    boss: { qty: number; isComplete: boolean };
    isComplete: boolean;
  }[];
  ctx: any;
  explosion: Explosion;
  ambientAudio: HTMLAudioElement;
  impactAudio: HTMLAudioElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.c = canvas.getContext("2d");

    this.keyboard = new Keyboard(this);
    this.windex = 0;
    this.waves = [
      {
        enemy: {
          qty: 50,
          isComplete: false,
        },
        boss: {
          qty: 5,
          isComplete: false,
        },
        isComplete: false,
      },
    ];

    this.bosses = [];
    this.enemies = [];

    this.hero = new Hero(this);
    this.boss = new Boss(this);
    this.enemy = new Enemy(this);
    this.shot = new Shot(this);
    this.explosion = new Explosion(this);

    this.gameObjects = [
      this.shot,
      this.hero,
      this.enemy,
      this.boss,
      this.explosion,
    ];

    this.ambientAudio = new Audio("/audio/dark_world.mp3");
    this.impactAudio = new Audio("/audio/EXPLDsgn_Explosion_Impact_14.wav");

    this.countAssets = 0;
    this.assetsLoaded = false;

    this.assets = [
      ...this.hero.assets,
      this.boss.image,
      this.enemy.image,
      this.shot.sprite,
      ...this.explosion.assets,
      this.ambientAudio,
      this.impactAudio,
    ];

    this.assets.map((asset, i) => {
      asset.onload = async () => {
        this.countAssets++;
        // console.log(`Asset ${i} loaded: `, asset);
      };

      asset.oncanplay = async () => {
        this.countAssets++;
        // console.log(`Asset ${i} loaded: `, asset);
        if (this.countAssets === this.assets.length) {
          let play = document.getElementById("play");
          let loading = document.getElementById("loading");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.assetsLoaded = true;
          play?.classList.remove("hidden");
          loading?.classList.add("hidden");
        }
        // console.log(`Total assets loaded:`, this.countAssets);
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

  playImpactAudio() {
    this.impactAudio.currentTime = 0;
    this.impactAudio.play();
  }

  async playAmbientAudio() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.ambientAudio.currentTime = 0;
    this.ambientAudio.volume = 0.5;
    this.ambientAudio.play().then(() => {});
  }

  start() {
    let screen = document.getElementById("screen");
    screen?.classList.add("hidden");
    this.playAmbientAudio();
    this.enemy.spawnEnemies();
    requestAnimationFrame(this.loop);
  }
}
