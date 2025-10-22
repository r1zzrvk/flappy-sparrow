import * as ex from 'excalibur';
import { Config } from '../config';
import { Pipe } from './pipe';
import { ScoreTrigger } from './score-trigger';
import { Level } from './level';

export class PipeFactory {
  private timer: ex.Timer;

  constructor(
    private level: ex.Scene,
    private random: ex.Random,
    intervalMs: number
  ) {
    this.timer = new ex.Timer({
      interval: intervalMs,
      repeats: true,
      action: () => this.spawnPipes(),
    });
    this.level.add(this.timer);
  }

  spawnPipes() {
    const randonPipePos = this.random.floating(
      0,
      this.level.engine.screen.resolution.height - Config.PipeGap
    );

    const bottomPipe = new Pipe(
      ex.vec(
        this.level.engine.screen.drawWidth,
        randonPipePos + Config.PipeGap
      ),
      'bottom'
    );
    const topPipe = new Pipe(
      ex.vec(this.level.engine.screen.drawWidth, randonPipePos),
      'top'
    );

    this.level.add(bottomPipe);
    this.level.add(topPipe);

    const scoreTrigger = new ScoreTrigger(
      ex.vec(this.level.engine.screen.drawWidth, randonPipePos),
      this.level as Level
    );

    this.level.add(scoreTrigger);
  }

  start() {
    this.timer.start();
  }

  reset() {
    for (const actor of this.level.actors) {
      if (actor instanceof Pipe || actor instanceof ScoreTrigger) {
        actor.kill();
      }
    }
  }

  stop() {
    this.timer.stop();
    for (const actor of this.level.actors) {
      if (actor instanceof Pipe || actor instanceof ScoreTrigger) {
        actor.vel = ex.vec(0, 0);
      }
    }
  }
}
