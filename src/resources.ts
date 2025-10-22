import * as ex from 'excalibur';

const Images = {
  SparrowImage: new ex.ImageSource("./images/Sparrow_Sprite.png"),
  PipeImage: new ex.ImageSource("./images/Pipe.png", { wrapping: ex.ImageWrapping.Clamp }),
  GroundImage: new ex.ImageSource("./images/Ground.png", { wrapping: ex.ImageWrapping.Repeat }),
  BackgroundImage: new ex.ImageSource("./images/Background.png", { wrapping: ex.ImageWrapping.Repeat, filtering: ex.ImageFiltering.Blended}),
}

const Sounds = {
  JumpSound: new ex.Sound('./sounds/wing.mp3'),
  FailSound: new ex.Sound('./sounds/failed.mp3'),
  ScoreSound: new ex.Sound('./sounds/coin.mp3'),
}

const Music = {
  BackgroundMusic: new ex.Sound('./sounds/background.mp3'),
}

export const Resources = {
  ...Images,
  ...Sounds,
  ...Music,
 } as const;