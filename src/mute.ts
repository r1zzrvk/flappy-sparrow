import { Keys } from "excalibur";
import { Resources } from "./resources";

export function initMuteButton () {
  const muteButton = document.getElementById('mute-button') as HTMLButtonElement | null;

  if (!muteButton) return;

  muteButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleButtonState(muteButton);
    muteButton.blur();
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === Keys.M) {
      event.preventDefault();
      toggleButtonState(muteButton);
    }
  });
}

function toggleButtonState(button: HTMLButtonElement) {
  const isPressed = button.getAttribute('aria-pressed') === 'true';

  button.setAttribute('aria-pressed', isPressed ? 'false' : 'true');

  if (isPressed) {
    Resources.BackgroundMusic.volume = 0.5;
    Resources.FailSound.volume = 1;
    Resources.JumpSound.volume = 1;
    Resources.ScoreSound.volume = 1;
  } else {
    Resources.BackgroundMusic.volume = 0;
    Resources.FailSound.volume = 0;
    Resources.JumpSound.volume = 0;
    Resources.ScoreSound.volume = 0;
  }
}
