import { expect } from "@jest/globals";

jest.useFakeTimers(); // control setTimeout

const mockStartSpin = jest.fn();

jest.mock("../../src/slots/Reel", () => {
  return {
    Reel: jest.fn().mockImplementation(() => ({
      container: { y: 0 },
      startSpin: mockStartSpin,
      stopSpin: jest.fn(),
      update: jest.fn()
    }))
  };
});

jest.mock("pixi.js", () => {
  const actualPixi = jest.requireActual("pixi.js");
  return {
    ...actualPixi,
    Application: class {
      screen = { width: 800, height: 600 };
      stage = { addChild: jest.fn() };
    },
    Container: class {
      addChild() {}
    },
    Sprite: class {},
    Graphics: class {
      beginFill() {
        return this;
      }
      drawRect() {
        return this;
      }
      endFill() {
        return this;
      }
    }
  };
});

jest.mock("../../src/utils/sound", () => ({
  sound: {
    play: jest.fn(),
    stop: jest.fn()
  }
}));

import { SlotMachine } from "../../src/slots/SlotMachine";
import * as PIXI from "pixi.js";

describe("SlotMachine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls startSpin on all reels when spin() is called", () => {
    const app = new PIXI.Application();
    const slotMachine = new SlotMachine(app);

    slotMachine.spin();

    expect((slotMachine as any).isSpinning).toBe(true);

    // Fast-forward all timers
    jest.runAllTimers();

    expect(mockStartSpin).toHaveBeenCalledTimes(4); // REEL_COUNT
  });
});
