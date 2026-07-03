import { tileCenter } from '../utils/IsoMath.js';

export class SeedPlant {
  constructor(scene, col, row) {
    this.col = col;
    this.row = row;

    const pos = tileCenter(col, row);
    this.sprite = scene.add.image(pos.x, pos.y, 'plant')
      .setOrigin(0.5, 1.0)
      .setDisplaySize(9, 9)
      .setDepth(pos.y);
  }

  destroy() {
    this.sprite.destroy();
  }
}
