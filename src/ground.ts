import { Resources } from "./resources";
import { Config } from "../config";
import { Actor, Engine, vec, Vector } from "excalibur";

export class Ground extends Actor {
  moving = false;
  groundSprite = Resources.GroundImage.toSprite();

  constructor(pos: Vector) {
    super({
      pos,
      anchor: vec(0,0),
      height: 100,
      width: 1000,
      z: 1,
    })
  }

  start() {
    this.moving = true;
  }

  stop() {
    this.moving = false;
  }

  override onInitialize(engine: Engine): void {
    this.groundSprite.sourceView.width = engine.screen.drawWidth;
    this.groundSprite.destSize.width = engine.screen.drawWidth;

    this.graphics.use(this.groundSprite);
  }

  override onPostUpdate(_engine: Engine, elapsed: number): void {
    if (!this.moving) return 

    this.groundSprite.sourceView.x += Config.PipeSpeed * (elapsed / 1000);
    this.groundSprite.sourceView.x = this.groundSprite.sourceView.x % Resources.GroundImage.width;
  }
}