import { Howl } from 'howler';

const soundMap: Record<string, Howl> = {};

export const sound = {
  add: (alias: string, url: string): void => {
    soundMap[alias] = new Howl({ src: [url] });
  },
  play: (alias: string, loop = false): void => {
    const sfx = soundMap[alias];
    if (sfx) {
      sfx.loop(loop);
      sfx.play();
    } else {
      console.warn(`Sound "${alias}" not found`);
    }
  },
  stop: (alias: string): void => {
    const sfx = soundMap[alias];
    if (sfx) {
      sfx.stop();
    }
  }
};
