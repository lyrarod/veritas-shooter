import { Game } from "./game";

export class Keyboard {
  up: HTMLElement | null;
  down: HTMLElement | null;
  left: HTMLElement | null;
  right: HTMLElement | null;
  shoot: HTMLElement | null;
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.keyPressed = {} as any;

    this.up = document.getElementById("up");
    this.down = document.getElementById("down");
    this.left = document.getElementById("left");
    this.right = document.getElementById("right");
    this.shoot = document.getElementById("shoot");

    this.up?.addEventListener("touchstart", () => {
      this.keyPressed.ArrowUp = true;
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: false,
        up: true,
        down: false,
      };
    });

    this.down?.addEventListener("touchstart", () => {
      this.keyPressed.ArrowDown = true;
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: false,
        up: false,
        down: true,
      };
    });

    this.left?.addEventListener("touchstart", () => {
      this.keyPressed.ArrowLeft = true;
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: true,
        right: false,
        up: false,
        down: false,
      };
    });

    this.right?.addEventListener("touchstart", () => {
      this.keyPressed.ArrowRight = true;
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: true,
        up: false,
        down: false,
      };
    });

    this.shoot?.addEventListener("touchstart", () => {
      this.game.hero.shooter();
    });

    this.up?.addEventListener(
      "touchend",
      () => (this.keyPressed.ArrowUp = false)
    );
    this.down?.addEventListener(
      "touchend",
      () => (this.keyPressed.ArrowDown = false)
    );
    this.left?.addEventListener(
      "touchend",
      () => (this.keyPressed.ArrowLeft = false)
    );
    this.right?.addEventListener(
      "touchend",
      () => (this.keyPressed.ArrowRight = false)
    );

    window.addEventListener("keydown", ({ code }) => this.keyDown(code));
    window.addEventListener("keyup", ({ code }) => this.keyUp(code));
  }

  lastKey: string | null = null;
  keyPressed: {} | any = {};

  get isMovingLeft() {
    return this.keyPressed.ArrowLeft || this.keyPressed.KeyA;
  }

  get isMovingRight() {
    return this.keyPressed.ArrowRight || this.keyPressed.KeyD;
  }

  get isMovingUp() {
    return this.keyPressed.ArrowUp || this.keyPressed.KeyW;
  }

  get isMovingDown() {
    return this.keyPressed.ArrowDown || this.keyPressed.KeyS;
  }

  get isShoot() {
    return (
      this.keyPressed.Space ||
      this.keyPressed.Enter ||
      this.keyPressed.NumpadEnter
    );
  }

  keyDown(code: string) {
    if (this.lastKey === code || !this.game.assetsLoaded) return;
    this.lastKey = code;
    this.keyPressed[code] = true;
    // console.log(this.keyPressed);

    if (this.isMovingLeft) {
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: true,
        right: false,
        up: false,
        down: false,
      };
    }

    if (this.isMovingRight) {
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: true,
        up: false,
        down: false,
      };
    }

    if (this.isMovingUp) {
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: false,
        up: true,
        down: false,
      };
    }

    if (this.isMovingDown) {
      this.game.hero.isShooting = false;
      this.game.hero.direction = {
        left: false,
        right: false,
        up: false,
        down: true,
      };
    }

    if (
      this.isShoot &&
      (this.lastKey === "Enter" ||
        this.lastKey === "Space" ||
        this.lastKey === "NumpadEnter")
    ) {
      this.game.hero.shooter();
    }
  }

  keyUp(code: string) {
    this.lastKey = null;
    this.keyPressed[code] = false;
    // console.log(this.keyPressed);
    delete this.keyPressed[code];
  }
}
