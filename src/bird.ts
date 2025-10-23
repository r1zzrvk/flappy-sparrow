import { Ground } from './ground';
import { Pipe } from './pipe';
import { Config } from '../config';
import { Level } from './level';
import { Resources } from './resources';
import {
  Actor,
  Animation,
  AnimationStrategy,
  clamp,
  Collider,
  Engine,
  EasingFunctions,
  Keys,
  SpriteSheet,
  vec,
  Vector,
} from 'excalibur';

export class Bird extends Actor {
  playing = false;
  jumping = false;
  startPos: Vector = Config.BirdStartPosDesktop;

  constructor(private level: Level) {
    super({
      pos: Config.BirdStartPosDesktop,
      radius: Config.BirdSize / 3,
    });
  }

  upAnimation!: Animation;
  downAnimation!: Animation;
  deathAnimation!: Animation;

  private setStartPos(engine: Engine) {
    const isMobile = engine.screen.resolution.width < 600;
    this.startPos = isMobile
      ? Config.BirdStartPosMobile
      : Config.BirdStartPosDesktop;
    this.pos = this.startPos;
  }

  private initAnimations() {
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
  }

  private isInputActive(engine: Engine) {
    return (
      engine.input.keyboard.isHeld(Keys.Space) ||
      engine.input.pointers.isDown(0)
    );
  }

  private jump() {
    this.graphics.use('up');
    this.upAnimation.reset();
    this.downAnimation.reset();
    this.vel.y += Config.BirdJumpVelocity;
    this.jumping = true;
    Resources.JumpSound.play();
  }

  override onPostUpdate(engine: Engine): void {
    if (!this.playing) return;

    if (!this.jumping && this.isInputActive(engine)) {
      this.jump();
    }

    if (!this.isInputActive(engine)) {
      this.jumping = false;
    }

    this.vel.y = clamp(
      this.vel.y,
      Config.BirdMinVelocity,
      Config.BirdMaxVelocity
    );

    if (this.vel.y > 0) {
      this.graphics.use('down');
    }
  }

  start() {
    this.playing = true;
    this.pos = this.startPos;
    this.acc = vec(0, Config.BirdAcceleration);
  }

  reset() {
    this.pos = this.startPos;
    this.stop();
    this.rotation = 0;
  }

  stop() {
    this.playing = false;
    this.vel = vec(0, 0);
    this.acc = vec(0, 0);
  }

  die() {
    const targetY = 600;
    const fallSpeed = Config.BirdFallSpeed;

    this.rotation = Config.BirdRotationAngle;
    this.graphics.use('death');
    this.jumping = false;

    this.actions.clearActions();
    this.stop();

    if (this.pos.y >= targetY) {
      this.pos = vec(this.pos.x, targetY);
      return;
    }

    const durationMs = Math.max(
      200,
      ((targetY - this.pos.y) / fallSpeed) * 1000
    );

    this.actions.easeTo(
      vec(this.pos.x, targetY),
      durationMs,
      EasingFunctions.EaseInQuad
    );
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Ground || other.owner instanceof Pipe) {
      if (this.playing) {
        this.level.triggerGameOver();
      }
    }
  }

  override onInitialize(engine: Engine): void {
    this.setStartPos(engine);
    this.initAnimations();

    this.graphics.use('down');

    this.on('exitviewport', () => {
      this.level.triggerGameOver();
    });
  }
}
