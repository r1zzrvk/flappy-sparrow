import * as ex from 'excalibur'

const birdConfig = {
  BirdSize: 64, // body size of the bird
  BirdStartPos: ex.vec(200,300), // starting position of the bird
  BirdAcceleration: 1200, // acceleration of the bird when falling
  BirdJumpVelocity: -800, // velocity of the bird when jumping (speed up when pressing space)
  BirdMinVelocity: -500, // minimum velocity of the bird when falling
  BirdMaxVelocity: 500, // maximum velocity of the bird when falling
  BirdRotationAngle: 1800, // angle of the bird's rotation
  BirdFallSpeed: 600, // speed of the bird when falling
} as const;

const pipeConfig = {
  PipeSpeed: 200, // speed of the pipes
  PipeInterval: 1500, // interval between pipes
  PipeGap: 200, // gap between pipes
} as const;

const backgroundConfig = {
  BackgroundOffset: 0, // offset of the background
  BackgroundSpeed: 20, // speed of the background
} as const;

export const Config = {
  ...birdConfig,
  ...pipeConfig,
  ...backgroundConfig
} as const;