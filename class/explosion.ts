import { Game } from "./game";

export class Explosion {
  game: Game;
  explosion: {
    width: number;
    height: number;
    x: number;
    y: number;
    frameX: number[];
    ifx: number;
    frameY: number;
    frameTimer: number;
    frameInterval: number;
    isVisible: boolean;
    sound: HTMLAudioElement;
    sprite: HTMLImageElement;
    playExplosionSound: () => void;
  };
  explosions: Explosion[];
  assets: (HTMLAudioElement | HTMLImageElement)[];

  constructor(game: Game, position = { x: 0, y: 0 }) {
    this.game = game;

    this.explosion = {
      width: 512 / 8,
      height: 64,
      x: position.x,
      y: position.y,
      frameX: Array.from({ length: 8 }, (_, index) => index),
      ifx: 0,
      frameY: 0,
      frameTimer: 0,
      frameInterval: 1000 / 30,
      isVisible: true,
      sprite: new Image(),
      sound: new Audio(
        "/audio/explosion/public_audio_explosion_explosionCrunch_004.ogg"
      ),
      playExplosionSound: () => {
        this.explosion.sound.currentTime = 0;
        this.explosion.sound.play();
      },
    };
    this.explosion.sprite.src = "/explosion.png";

    this.explosions = [];

    this.assets = [this.explosion.sprite, this.explosion.sound];
  }

  show(position = { x: 0, y: 0 }) {
    let x = position.x - this.explosion.width * 0.5;
    let y = position.y - this.explosion.height * 0.5;
    this.explosions.push(new Explosion(this.game, { x, y }));
    this.explosion.playExplosionSound();
  }

  drawAndDebug() {
    if (!this.game.c) return;

    this.game.c.drawImage(
      this.explosion.sprite,
      this.explosion.frameX[this.explosion.ifx] * this.explosion.width,
      this.explosion.frameY * this.explosion.height,
      this.explosion.width,
      this.explosion.height,
      this.explosion.x,
      this.explosion.y,
      this.explosion.width,
      this.explosion.height
    );

    if (this.game.debug) {
      this.game.c.strokeStyle = "orangered";
      this.game.c.strokeRect(
        this.explosion.x,
        this.explosion.y,
        this.explosion.width,
        this.explosion.height
      );
    }
  }

  render(deltaTime: number) {
    this.drawAndDebug();

    if (this.explosion.frameTimer > this.explosion.frameInterval) {
      this.explosion.ifx++;
      if (this.explosion.ifx >= this.explosion.frameX.length) {
        this.explosion.isVisible = false;
      }
      this.explosion.frameTimer = 0;
    } else {
      this.explosion.frameTimer += deltaTime;
    }
  }

  update(deltaTime: number) {
    this.explosions.forEach((exp, index) => {
      exp.render(deltaTime);

      if (exp.explosion.isVisible === false) {
        this.explosions.splice(index, 1);
      }
      // console.log(this.explosions);
    });
  }
}
