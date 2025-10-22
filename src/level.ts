import * as ex from 'excalibur';
import { Bird } from './bird';
import { Ground } from './ground';
import { PipeFactory } from './pipe-factory';
import { Config } from '../config';
import { Resources } from './resources';

// TODO:
// Добавить бекграунд облаков, других птиц, деревьев и солнца
// Добавить очки
// Добавить меню
// Добавить паузу, рестарт, настройки звуки

export class Level extends ex.Scene {
  backgroundSprite = Resources.BackgroundImage.toSprite();
  backgroundOffset: number = 0;
  backgroundSpeed: number = 20; // pixels per second

  // scoring
  score: number = 0;
  bestScore: number = 0;
  scoreLabel = new ex.Label({
    text: 'Score: 0',
    x: 0,
    y: 0,
    z: 1,
    font: new ex.Font({
      size: 20,
      color: ex.Color.White,
    }),
  });
  bestScoreLabel = new ex.Label({
    text: 'Best Score: 0',
    x: 400,
    y: 0,
    z: 1,
    font: new ex.Font({
      size: 20,
      color: ex.Color.White,
      textAlign: ex.TextAlign.End,
    }),
  });
  // scoring

  // pipes
  random = new ex.Random();
  pipeFactory = new PipeFactory(this, this.random, Config.PipeInterval);
  // pipes

  // actors
  bird: Bird = new Bird(this);
  ground!: Ground;
  // actors

  // menu
  startGameLabel = new ex.Label({
    text: 'Tap to Start',
    x: 200,
    y: 200,
    z: 2,
    font: new ex.Font({
      size: 30,
      color: ex.Color.White,
    }),
  });
  // menu

  background = new ex.Actor({
    pos: ex.vec(0, 0),
    anchor: ex.vec(0, 0.1),
    z: -2,
  });


  override onActivate(): void {
    Resources.BackgroundMusic.loop = true;
    Resources.BackgroundMusic.volume = 0.5;
  }

  override onPreUpdate(engine: ex.Engine, delta: number): void {
    // Scroll background slowly to the left
    this.backgroundOffset += (this.backgroundSpeed * delta) / 1000;

    // Use sourceView to create scrolling effect
    const imageWidth = Resources.BackgroundImage.width;
    this.backgroundSprite.sourceView.x = this.backgroundOffset % imageWidth;
  }

  override onInitialize(engine: ex.Engine): void {

    this.add(this.bird);
    this.add(this.startGameLabel);
    this.add(this.background);
    this.add(this.scoreLabel);
    this.add(this.bestScoreLabel);
   
    this.ground = new Ground(ex.vec(0, engine.screen.drawHeight - 64));
    this.add(this.ground)
  
    this.background.graphics.use(this.backgroundSprite);

    const bestScore = localStorage.getItem('bestScore');
    if (bestScore) {
      this.bestScore = +bestScore;
      this.setBestScore(Number(bestScore));
    } else {
      this.setBestScore(0);
    }
  }

  showStartInstructions() {
    this.startGameLabel.graphics.isVisible = true;
    this.engine.input.pointers.once('down', () => {
      this.reset();

      this.startGameLabel.graphics.isVisible = false;
      this.bird.start();
      this.pipeFactory.start();
      this.ground.start();
      Resources.BackgroundMusic.play();
    });
  }

  reset() {
    this.bird.reset();
    this.pipeFactory.reset();
    this.score = 0;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  incrementScore() {
    this.scoreLabel.text = `Score: ${++this.score}`;
    this.setBestScore(this.score);
  }

  setBestScore(score: number) {
    if (score > this.bestScore) {
      localStorage.setItem('bestScore', this.score.toString());
      this.bestScore = score;
    }

    this.bestScoreLabel.text = `Best score: ${this.bestScore}`;
  }

  triggerGameOver() {
    this.pipeFactory.stop();
    this.bird.stop();
    this.ground.stop();
    this.showStartInstructions();
    Resources.BackgroundMusic.stop();
    Resources.FailSound.play();
  }
}
