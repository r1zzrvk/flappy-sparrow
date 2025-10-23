
import { Actor, vec, Vector } from 'excalibur';
import { Config } from '../config';
import { Resources } from './resources';
import { Scoreboard } from './scoreboard';

export class ScoreTrigger extends Actor {
  constructor(pos: Vector, private scoreboard: Scoreboard) {
    super({
      pos,
      width: 32,
      height: Config.PipeGap,
      anchor: vec(0,0),
      vel: vec(-Config.PipeSpeed, 0),
    })

    this.on('exitviewport', () => {
      this.kill()
    })
  }

  override onCollisionStart(): void {
    this.scoreboard.incrementScore();
    Resources.ScoreSound.play()
  }
} 