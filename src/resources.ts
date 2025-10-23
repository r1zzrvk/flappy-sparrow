import { ImageFiltering, ImageSource, ImageWrapping, Sound } from "excalibur";


const Images = {
  SparrowImage: new ImageSource("./images/Sparrow_Sprite.png"),
  PipeImage: new ImageSource("./images/Pipe.png", { wrapping: ImageWrapping.Clamp }),
  GroundImage: new ImageSource("./images/Ground.png", { wrapping: ImageWrapping.Repeat }),
  BackgroundImage: new ImageSource("./images/Background.png", { wrapping: ImageWrapping.Repeat, filtering: ImageFiltering.Pixel}),
}

const Sounds = {
  JumpSound: new Sound('./sounds/wing.mp3'),
  FailSound: new Sound('./sounds/failed.mp3'),
  ScoreSound: new Sound('./sounds/coin.mp3'),
}

const Music = {
  BackgroundMusic: new Sound('./sounds/background.mp3'),
}

export const Resources = {
  ...Images,
  ...Sounds,
  ...Music,
 } as const;