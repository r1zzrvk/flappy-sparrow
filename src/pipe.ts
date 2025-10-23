
import { Actor, Color, vec, Vector } from 'excalibur';
import { Resources } from './resources';

export class Pipe extends Actor {
  constructor(pos: Vector, private type: 'top' | 'bottom') {
    super({
      pos,
      width: 32,
      height: 1000,
      anchor: type === 'bottom' ? vec(0, 0) : vec(0, 1),
      color: Color.Green,
      vel: vec(-200, 0),
      z: -1,
    });

    this.on('exitviewport', () => this.kill())
  }

  override onInitialize(): void {
    const pipeEnd = Resources.PipeImage.toSprite();

    pipeEnd.sourceView.height = 1000;
    pipeEnd.destSize.height = 1000;

    if (this.type === 'top') {
      pipeEnd.flipVertical = true;
    }

    this.graphics.use(pipeEnd);
  }
}