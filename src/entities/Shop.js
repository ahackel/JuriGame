import { tileCenter } from '../utils/IsoMath.js';

const TARGET_HEIGHT = 94;

export class Shop {
  constructor(scene, col, row) {
    const pos = tileCenter(col, row);
    const houseImg = scene.textures.get('house').getSourceImage();
    const scale = TARGET_HEIGHT / houseImg.height;

    this.sprite = scene.add.image(pos.x, pos.y, 'house')
      .setOrigin(0.5, 1.0)
      .setScale(scale)
      .setDepth(pos.y);

    scene.tweens.add({
      targets: this.sprite,
      scaleY: { from: 0, to: scale },
      duration: 400,
      ease: 'Back.easeOut',
    });
  }
}
