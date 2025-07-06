import * as PIXI from "pixi.js";
import "pixi-spine";
import { Reel } from "./Reel";
import { sound } from "../utils/sound";
import { AssetLoader } from "../utils/AssetLoader";
import { Spine } from "pixi-spine";

const REEL_COUNT = 4;
const SYMBOLS_PER_REEL = 6;
const SYMBOL_SIZE = 150;
const REEL_HEIGHT = SYMBOL_SIZE;
const REEL_SPACING = 10;

export class SlotMachine {
  public container: PIXI.Container;
  private reels: Reel[];
  private app: PIXI.Application;
  private isSpinning: boolean = false;
  private spinButton: PIXI.Sprite | null = null;
  private frameSpine: Spine | null = null;
  private winAnimation: Spine | null = null;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.reels = [];

    // Center the slot machine
    this.container.x =
      this.app.screen.width / 2 - (SYMBOL_SIZE * SYMBOLS_PER_REEL) / 2;
    this.container.y =
      this.app.screen.height / 2 -
      (REEL_HEIGHT * REEL_COUNT + REEL_SPACING * (REEL_COUNT - 1)) / 2;

    this.createBackground();

    this.createReels();

    this.initSpineAnimations();
  }

  private createBackground(): void {
    try {
      const background = new PIXI.Graphics();
      background.beginFill(0x000000, 0.5);
      background.drawRect(
        -20,
        -20,
        SYMBOL_SIZE * SYMBOLS_PER_REEL + 40, // Width now based on symbols per reel
        REEL_HEIGHT * REEL_COUNT + REEL_SPACING * (REEL_COUNT - 1) + 40 // Height based on reel count
      );
      background.endFill();
      this.container.addChild(background);
    } catch (error) {
      console.error("Error creating background:", error);
    }
  }

  private createReels(): void {
    // Create each reel
    for (let i = 0; i < REEL_COUNT; i++) {
      const reel = new Reel(SYMBOLS_PER_REEL, SYMBOL_SIZE);
      reel.container.y = i * (REEL_HEIGHT + REEL_SPACING);
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  public update(delta: number): void {
    // Update each reel
    for (const reel of this.reels) {
      reel.update(delta);
    }
  }

  public spin(): void {
    const canvas = this.app.view as HTMLCanvasElement;
    if (canvas) {
      canvas.setAttribute("aria-disabled", "true");
    }

    if (this.isSpinning) return;

    this.isSpinning = true;

    // Play spin sound
    sound.play("Reel spin", true); // loop true

    // Disable spin button
    if (this.spinButton) {
      this.spinButton.texture = AssetLoader.getTexture(
        "button_spin_disabled.png"
      );
      this.spinButton.interactive = false;
    }

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].startSpin();
      }, i * 200);
    }

    // Stop all reels after a delay
    setTimeout(() => {
      this.stopSpin();
    }, 500 + (this.reels.length - 1) * 200);
  }

  private stopSpin(): void {
    const canvas = this.app.view as HTMLCanvasElement;
    if (canvas) {
      canvas.removeAttribute("aria-disabled");
    }

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stopSpin();

        // If this is the last reel, check for wins and enable spin button
        if (i === this.reels.length - 1) {
          setTimeout(() => {
            sound.stop("Reel spin"); // stop reel spin sound

            this.checkWin();
            this.isSpinning = false;

            if (this.spinButton) {
              this.spinButton.texture =
                AssetLoader.getTexture("button_spin.png");
              this.spinButton.interactive = true;
            }
          }, 500);
        }
      }, i * 400);
    }
  }

  private checkWin(): void {
    const randomWin = true;

    if (randomWin) {
      sound.play("win");
      console.log("Winner!");

      const winIndicator = document.getElementById("win-indicator");
      if (winIndicator) {
        winIndicator.style.display = "block";
      }

      if (this.winAnimation) {
        this.winAnimation.visible = true;
        this.winAnimation.state.setAnimation(0, "start", false); // Make sure "boom" is a valid animation name in your spine file
        this.winAnimation.state.addListener({
          complete: () => {
            this.winAnimation!.visible = false;
          }
        });
      }
    }
  }

  public setSpinButton(button: PIXI.Sprite): void {
    this.spinButton = button;
  }

  private initSpineAnimations(): void {
    try {
      const frameSpineData = AssetLoader.getSpine("base-feature-frame.json");
      if (frameSpineData) {
        this.frameSpine = new Spine(frameSpineData.spineData);

        this.frameSpine.y =
          (REEL_HEIGHT * REEL_COUNT + REEL_SPACING * (REEL_COUNT - 1)) / 2;
        this.frameSpine.x = (SYMBOL_SIZE * SYMBOLS_PER_REEL) / 2;

        if (this.frameSpine.state.hasAnimation("idle")) {
          this.frameSpine.state.setAnimation(0, "idle", true);
        }

        this.container.addChild(this.frameSpine);
      }

      const winSpineData = AssetLoader.getSpine("big-boom-h.json");
      if (winSpineData) {
        this.winAnimation = new Spine(winSpineData.spineData);
        console.log(
          "Available animations:",
          this.winAnimation.state.data.skeletonData.animations.map(
            (a) => a.name
          )
        );
        this.winAnimation.x =
          (REEL_HEIGHT * REEL_COUNT + REEL_SPACING * (REEL_COUNT - 1)) / 2;
        this.winAnimation.y = (SYMBOL_SIZE * SYMBOLS_PER_REEL) / 2;

        this.winAnimation.visible = false;

        this.container.addChild(this.winAnimation);
      }
    } catch (error) {
      console.error("Error initializing spine animations:", error);
    }
  }
}
