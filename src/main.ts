import * as ex from "excalibur";
import { Level } from "./level";
import { Resources } from "./resources";

const game = new ex.Engine({
  width: 300,
  height: 300,
  backgroundColor: ex.Color.fromHex("#0051CB"),
  pixelArt: true,
  antialiasing: false,
  pixelRatio: 2,
  displayMode: ex.DisplayMode.FillScreen,
  scenes: { level: new Level },
  resolution: ex.Resolution.GameBoy,
})


const loader = new ex.Loader(Object.values(Resources));

game.start(loader).then(() => {
  game.goToScene("level")
});