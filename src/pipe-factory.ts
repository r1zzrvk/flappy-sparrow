
import { Random, Scene, Timer, vec } from 'excalibur';
import { Config } from '../config';
import { Pipe } from './pipe';
import { ScoreTrigger } from './score-trigger';
import { Scoreboard } from './scoreboard';

export class PipeFactory {
  private timer: Timer;

  constructor(
    private level: Scene,
    private random: Random,
    intervalMs: number,
    private scoreboard: Scoreboard
  ) {
    this.timer = new Timer({
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
      vec(
        this.level.engine.screen.drawWidth,
        randonPipePos + Config.PipeGap
      ),
      'bottom'
    );
    const topPipe = new Pipe(
      vec(this.level.engine.screen.drawWidth, randonPipePos),
      'top'
    );

    this.level.add(bottomPipe);
    this.level.add(topPipe);

    const scoreTrigger = new ScoreTrigger(
      vec(this.level.engine.screen.drawWidth, randonPipePos),
      this.scoreboard
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
        actor.vel = vec(0, 0);
      }
    }
  }
}
