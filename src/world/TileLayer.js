import { MAP_COLS, MAP_ROWS, TILE_W, TILE_H } from '../constants.js';
import { tileToScreen, worldBounds } from '../utils/IsoMath.js';

export class TileLayer {
  constructor(scene) {
    this.scene = scene;
    this._render();
  }

  _render() {
    const bounds = worldBounds();

    const canvas = document.createElement('canvas');
    canvas.width  = Math.ceil(bounds.width);
    canvas.height = Math.ceil(bounds.height);
    const ctx = canvas.getContext('2d');

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const pos = tileToScreen(col, row);
        const tx  = pos.x - bounds.x;
        const ty  = pos.y - bounds.y;

        ctx.beginPath();
        ctx.moveTo(tx + TILE_W / 2, ty);
        ctx.lineTo(tx + TILE_W,     ty + TILE_H / 2);
        ctx.lineTo(tx + TILE_W / 2, ty + TILE_H);
        ctx.lineTo(tx,              ty + TILE_H / 2);
        ctx.closePath();

        ctx.fillStyle   = '#5a8a3c';
        ctx.fill();
        ctx.strokeStyle = '#3d6128';
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    this.scene.textures.addCanvas('ground-layer', canvas);
    this.scene.add.image(bounds.x, bounds.y, 'ground-layer')
      .setOrigin(0, 0)
      .setDepth(-1);
  }
}
