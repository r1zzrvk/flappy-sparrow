import { Actor, Color, Engine, Font, Label, TextAlign } from "excalibur";


export class Scoreboard extends Actor {
  score: number = 0;
  bestScore: number = 0;

  scoreLabel = new Label({

    text: 'Score: 0',
    x: 16,
    y: 16,
    z: 1,
    font: new Font({
      size: 20,
      color: Color.White,
      bold: true,
      strokeColor: Color.Black,
    }),
  });

  bestScoreLabel = new Label({
    text: 'Best Score: 0',
    x: 300,
    y: 16,
    z: 1,
    font: new Font({
      size: 20,
      color: Color.White,
      textAlign: TextAlign.End,
      bold: true,
      strokeColor: Color.Black,
    }),
  });

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

  reset() {
    this.score = 0;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  override onInitialize(engine: Engine): void {
    engine.add(this.scoreLabel);
    engine.add(this.bestScoreLabel);

    const bestScore = localStorage.getItem('bestScore');
  
    if (bestScore) {
      this.bestScore = +bestScore;
      this.setBestScore(Number(bestScore));
    } else {
      this.setBestScore(0);
    }
  }
}