import { tileCenter } from '../utils/IsoMath.js';

export class Shop {
  constructor(scene, col, row) {
    const pos = tileCenter(col, row);

    this.sprite = scene.add.image(pos.x, pos.y, 'shop')
      .setOrigin(0.5, 1.0)
      .setDepth(pos.y);

    scene.tweens.add({
      targets: this.sprite,
      scaleY: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
    });
  }
}
