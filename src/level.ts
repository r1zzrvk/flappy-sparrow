
import { Bird } from './bird';
import { Ground } from './ground';
import { PipeFactory } from './pipe-factory';
import { Config } from '../config';
import { Resources } from './resources';
import { Menu } from './menu';
import { Scoreboard } from './scoreboard';
import { Background } from './background';
import { Engine, KeyEvent, Keys, Random, Scene, vec } from 'excalibur';

export class Level extends Scene {

  background = new Background();
  random = new Random()
  scoreboard = new Scoreboard();
  pipeFactory = new PipeFactory(this, this.random, Config.PipeInterval, this.scoreboard);
  bird: Bird = new Bird(this);
  ground!: Ground;
  menu = new Menu(vec(0, 0), this);


  override onActivate(): void {
    Resources.BackgroundMusic.loop = true;
    Resources.BackgroundMusic.volume = 0.5;
  }

  override onInitialize(engine: Engine): void {

    this.ground = new Ground(vec(0, engine.screen.drawHeight - 64));

    this.add(this.bird);
    this.add(this.menu);
    this.add(this.background);
    this.add(this.scoreboard);
    this.add(this.ground)
    
    this.showMenu();
  }

  showMenu() {
    this.menu.show();

    const startGame = () => {
      this.engine.input.keyboard.off('press', keyboardHandler);
      this.reset();
    };

    const keyboardHandler = (evt: KeyEvent) => {
      if (evt.key === Keys.Space) {
        startGame();
      }
    };

    this.engine.input.pointers.once('down', () => {
      startGame();
    });

    this.engine.input.keyboard.on('press', keyboardHandler);
  }

  reset() {
    this.bird.reset();
    this.pipeFactory.reset();
    this.scoreboard.reset();
    this.menu.hide();
    this.bird.start();
    this.pipeFactory.start();
    this.ground.start();

    Resources.BackgroundMusic.play();
  }

  triggerGameOver() {
    this.pipeFactory.stop();
    this.bird.die();
    // this.bird.stop();
    this.ground.stop();
    this.showMenu();

    Resources.BackgroundMusic.stop();
    Resources.FailSound.play();
  }
}
