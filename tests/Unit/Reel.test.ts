import { describe, it, expect } from "@jest/globals";
import { Reel } from "../../src/slots/Reel";

describe("Reel", () => {
  it("starts spinning when startSpin() is called", () => {
    const reel = new Reel(5, 100);
    reel.startSpin();
    expect(reel['isSpinning']).toBe(true);
  });

  it("getSymbolAt returns a symbol for valid index", () => {
    const reel = new Reel(5, 100);
    const symbol = reel.getSymbolAt(0); // index 0 should exist
    expect(symbol).toBeDefined();
  });

  it("getSymbolAt returns undefined for out-of-bounds index", () => {
    const reel = new Reel(5, 100);
    const symbol = reel.getSymbolAt(10); // index 10 should be invalid
    expect(symbol).toBeUndefined();
  });
});
