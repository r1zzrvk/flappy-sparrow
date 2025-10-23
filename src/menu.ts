
import { Actor, Color, Font, Label, vec, Vector } from "excalibur";
import { Level } from "./level";

export class Menu extends Actor {
  visible = false;

  constructor(pos: Vector, private level: Level) {
    super({
      pos,
      anchor: vec(0,0),
      z: 3,
    })
  }

  startGameLabel = new Label({
    text: 'Tap or press Space to Start',
    x: 200,
    y: 200,
    z: 2,
    font: new Font({
      size: 30,
      color: Color.White,
    }),
  });

  onInitialize(): void {
    this.level.add(this.startGameLabel);
  }

  show() {
    this.visible = true;
    this.startGameLabel.graphics.isVisible = true;
  }

  hide() {
    this.visible = false;
    this.startGameLabel.graphics.isVisible = false;
  }
}