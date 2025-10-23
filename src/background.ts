
import { Resources } from './resources';
import { Config } from '../config';
import { Actor, vec } from 'excalibur';

export class Background extends Actor {
  moving = false;
  backgroundSprite = Resources.BackgroundImage.toSprite();
  backgroundOffset: number = Config.BackgroundOffset;
  backgroundSpeed: number = Config.BackgroundSpeed;

  constructor() {
    super({
      pos: vec(0, 0),
      anchor: vec(0, -0.3),
      z: -2,
    })
  }

  override onPreUpdate(_engine: ex.Engine, delta: number): void {
    if (!this.moving) return;
    this.backgroundOffset += (this.backgroundSpeed * delta) / 1000;

    const imageWidth = Resources.BackgroundImage.width;
    this.backgroundSprite.sourceView.x = this.backgroundOffset % imageWidth;
  }

  override onInitialize(): void {
    this.start();
    this.graphics.use(this.backgroundSprite);
  }

  start() {
    this.moving = true;
  }

  stop() {
    this.moving = false;
  }
}