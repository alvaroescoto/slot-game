import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";

const SYMBOL_TEXTURES = [
  "symbol1.png",
  "symbol2.png",
  "symbol3.png",
  "symbol4.png",
  "symbol5.png"
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
  public container: PIXI.Container;
  private symbols: PIXI.Sprite[];
  private symbolSize: number;
  private symbolCount: number;
  private speed: number = 0;
  private isSpinning: boolean = false;

  constructor(symbolCount: number, symbolSize: number) {
    this.container = new PIXI.Container();
    this.symbols = [];
    this.symbolSize = symbolSize;
    this.symbolCount = symbolCount;

    this.createSymbols();
  }

  private createSymbols(): void {
    for (let i = 0; i < this.symbolCount; i++) {
      const symbol = this.createRandomSymbol();
      symbol.x = i * this.symbolSize; // horizontal layout
      this.symbols.push(symbol);
      this.container.addChild(symbol);
    }
  }

  private createRandomSymbol(): PIXI.Sprite {
    const textureName =
      SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
    const texture = AssetLoader.getTexture(textureName);
    return new PIXI.Sprite(texture);
  }

  public update(delta: number): void {
    if (!this.isSpinning && this.speed === 0) return;

    for (const symbol of this.symbols) {
      symbol.x -= this.speed * delta;
    }

    // Loop symbols back when they go out of view
    while (this.symbols[0].x <= -this.symbolSize) {
      const first = this.symbols.shift()!;
      first.x = this.symbols[this.symbols.length - 1].x + this.symbolSize;
      this.symbols.push(first);
    }

    if (!this.isSpinning && this.speed > 0) {
      this.speed *= SLOWDOWN_RATE;
      if (this.speed < 0.5) {
        this.speed = 0;
        this.snapToGrid();
      }
    }
  }

  public getSymbolAt(index: number): any | undefined  {
    return this.symbols[index] || undefined ;
  }

  private snapToGrid(): void {
    for (const symbol of this.symbols) {
      symbol.x = Math.round(symbol.x / this.symbolSize) * this.symbolSize;
    }
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = SPIN_SPEED;
  }

  public stopSpin(): void {
    this.isSpinning = false;
    // The reel will gradually slow down in the update method
  }
}
