import * as ex from "excalibur";
import { Resources } from "./resources";
import { Config } from "../config";

export class Ground extends ex.Actor {
  moving = false;
  groundSprite = Resources.GroundImage.toSprite();

  constructor(pos: ex.Vector) {
    super({
      pos,
      anchor: ex.vec(0,0),
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

  onInitialize(engine: ex.Engine): void {
    this.groundSprite.sourceView.width = engine.screen.drawWidth;
    this.groundSprite.destSize.width = engine.screen.drawWidth;

    this.graphics.use(this.groundSprite);
  }

  override onPostUpdate(engine: ex.Engine, elapsed: number): void {
    if (!this.moving) return 

    this.groundSprite.sourceView.x += Config.PipeSpeed * (elapsed / 1000);
    this.groundSprite.sourceView.x = this.groundSprite.sourceView.x % Resources.GroundImage.width;
  }
}