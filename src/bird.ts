import * as ex from 'excalibur';
import { Ground } from './ground';
import { Pipe } from './pipe';
import { Config } from '../config';
import { Level } from './level';
import { Resources } from './resources';

export class Bird extends ex.Actor {
  playing = false;

  constructor(private level: Level) {
    console.log('Bird constructor');
    super({
      pos: Config.BirdStartPos,
      radius: Config.BirdSize / 3,
    });
  }

  upAnimation!: ex.Animation;
  downAnimation!: ex.Animation;

  override onInitialize(): void {
    const spriteSheet = ex.SpriteSheet.fromImageSource({
      image: Resources.SparrowImage,
      grid: {
        rows: 1,
        columns: 2,
        spriteWidth: Config.BirdSize,
        spriteHeight: Config.BirdSize,
      },
    });

    this.upAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [1],
      150,
      ex.AnimationStrategy.Freeze
    );
    this.downAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [0],
      150,
      ex.AnimationStrategy.Freeze
    );
    
    this.graphics.add('up', this.upAnimation);
    this.graphics.add('down', this.downAnimation);
    this.graphics.use('down');

    this.on('exitviewport', () => {
      this.level.triggerGameOver();
    });
  }

  jumping = false;

  private isInputActive(engine: ex.Engine) {
    return (
      engine.input.keyboard.isHeld(ex.Keys.Space) ||
      engine.input.pointers.isDown(0)
    );
  }

  override onPostUpdate(engine: ex.Engine, elapsed: number): void {
    if (!this.playing) return;

    if (!this.jumping && this.isInputActive(engine)) {
      this.graphics.use('up');
      this.upAnimation.reset();
      this.downAnimation.reset();
      this.vel.y += Config.BirdJumpVelocity;
      this.jumping = true;
      Resources.JumpSound.play()
    }

    if (!this.isInputActive(engine)) {
      this.jumping = false;
    }
  
    this.vel.y = ex.clamp(this.vel.y, Config.BirdMinVelocity, Config.BirdMaxVelocity);

    if (this.vel.y > 0) {
      this.graphics.use('down');
    }
  }

  override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
    if (other.owner instanceof Ground || other.owner instanceof Pipe) {
      this.level.triggerGameOver();
    }
  }

  start() {
    this.playing = true;
    this.pos = Config.BirdStartPos;
    this.acc = ex.vec(0, Config.BirdAcceleration);
  }

  reset() {
    this.pos = Config.BirdStartPos;
    this.stop();
  }

  stop() {
    this.playing = false;
    this.vel = ex.vec(0, 0);
    this.acc = ex.vec(0, 0);
  }
}
