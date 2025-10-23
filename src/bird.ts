import { Ground } from './ground';
import { Pipe } from './pipe';
import { Config } from '../config';
import { Level } from './level';
import { Resources } from './resources';
import { Actor, Animation, AnimationStrategy, clamp, Collider, Engine, Keys, SpriteSheet, vec } from 'excalibur';

export class Bird extends Actor {
  playing = false;

  constructor(private level: Level) {
    super({
      pos: Config.BirdStartPos,
      radius: Config.BirdSize / 3,
    });
  }

  upAnimation!: Animation;
  downAnimation!: Animation;
  deathAnimation!: Animation;

  override onInitialize(): void {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.SparrowImage,
      grid: {
        rows: 1,
        columns: 2,
        spriteWidth: Config.BirdSize,
        spriteHeight: Config.BirdSize,
      },
    });

    this.upAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      [1],
      150,
      AnimationStrategy.Freeze
    );
    this.downAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      [0],
      150,
      AnimationStrategy.Freeze
    );
    this.deathAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1],
      150,
      AnimationStrategy.Freeze
    );
    
    this.graphics.add('up', this.upAnimation);
    this.graphics.add('down', this.downAnimation);
    this.graphics.add('death', this.deathAnimation);
    this.graphics.use('down');

    this.on('exitviewport', () => {
      this.level.triggerGameOver();
    });
  }

  jumping = false;

  private isInputActive(engine: Engine) {
    return (
      engine.input.keyboard.isHeld(Keys.Space) ||
      engine.input.pointers.isDown(0)
    );
  }

  override onPostUpdate(engine: Engine): void {
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
  
    this.vel.y = clamp(this.vel.y, Config.BirdMinVelocity, Config.BirdMaxVelocity);

    if (this.vel.y > 0) {
      this.graphics.use('down');
    }
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Ground || other.owner instanceof Pipe) {
      this.level.triggerGameOver();
    }
  }

  start() {
    this.playing = true;
    this.pos = Config.BirdStartPos;
    this.acc = vec(0, Config.BirdAcceleration);
  }

  reset() {
    this.pos = Config.BirdStartPos;
    this.stop();
    this.rotation = 0;
  }

  stop() {
    this.playing = false;
    this.vel = vec(0, 0);
    this.acc = vec(0, 0);
  }

  die() {
    this.pos = vec(this.pos.x, 600);
    this.rotation = Config.BirdRotationAngle;
    this.graphics.use('death');
    this.jumping = false;
    this.stop();
  }
}
