import { MAP_COLS, MAP_ROWS, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y } from '../constants.js';

export class TileLayer {
  constructor(scene) {
    scene.add.tileSprite(ORIGIN_X, ORIGIN_Y, MAP_COLS * TILE_W, MAP_ROWS * TILE_H, 'ground')
      .setOrigin(0, 0)
      .setTileScale(0.25, 0.17)
      .setDepth(-1);
  }
}
