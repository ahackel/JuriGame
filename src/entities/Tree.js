import { tileCenter } from '../utils/IsoMath.js';

export class Tree {
  constructor(scene, col, row, woodYield = null) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.alive = true;

    this.woodYield = woodYield ?? (Math.random() < 0.4 ? 3 : 2);

    const pos = tileCenter(col, row);
    this.sprite = scene.add.image(pos.x, pos.y, 'tree');
    this.sprite.setOrigin(0.5, 1.0);
    this.sprite.setDepth(pos.y);
  }

  checkCollection(playerCol, playerRow) {
    if (!this.alive) return false;
    if (Math.abs(playerCol - this.col) <= 0.7 && Math.abs(playerRow - this.row) <= 0.7) {
      this._collect();
      return true;
    }
    return false;
  }

  _collect() {
    this.alive = false;
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => this.sprite.destroy()
    });
    this.scene.events.emit('tree-collected', this.woodYield);
  }
}
