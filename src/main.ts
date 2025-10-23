import { Level } from "./level";
import { Resources } from "./resources";
import { initMuteButton } from "./mute";
import { Color, DisplayMode, Engine, Loader, Resolution, vec } from "excalibur";

const positionUI = (game: Engine) => {
  const ui = document.getElementsByClassName("ui")[0] as HTMLElement;
  if (ui) {
    const topLeft = game.screen.screenToPageCoordinates(vec(10, 500 - 40));
    ui.style.visibility = 'visible';
    ui.style.left = topLeft.x + 'px';
    ui.style.top = topLeft.y + 'px';
  }
}

const game = new Engine({
  width: 300,
  height: 300,
  backgroundColor: Color.fromHex("#0051CB"),
  pixelArt: true,
  antialiasing: false,
  pixelRatio: 2,
  displayMode: DisplayMode.FillScreen,
  scenes: { level: new Level },
  resolution: Resolution.GameBoy,
})


const loader = new Loader(Object.values(Resources));

game.start(loader).then(() => {
  game.goToScene("level")
  positionUI(game);
  initMuteButton();
});

game.screen.events.on('resize', () => positionUI(game));