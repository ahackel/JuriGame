import { tileCenter } from '../utils/IsoMath.js';
import { TILE_W, TILE_H } from '../constants.js';

export class PaymentField {
  constructor(scene, col, row, config, active = true) {
    this.scene   = scene;
    this.col     = col;
    this.row     = row;
    this.config  = config;
    this.active  = active;
    if (this.active) this._build();
  }

  _build() {
    const { scene, col, row, config } = this;
    const pos = tileCenter(col, row);
    const depth = pos.y + 0.5;

    this.highlight = scene.add.rectangle(pos.x, pos.y, TILE_W, TILE_H, 0x222222, 0.72)
      .setDepth(0);

    this.icon = scene.add.image(pos.x - 10, pos.y, 'wood-icon')
      .setDisplaySize(20, 20)
      .setOrigin(0.5, 0.5)
      .setDepth(1);

    this.costText = scene.add.text(pos.x + 4, pos.y, `${config.cost.wood}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })
      .setOrigin(0, 0.5)
      .setDepth(1);
  }

  checkTrigger(playerCol, playerRow, resources) {
    if (!this.active) return false;
    if (Math.abs(playerCol - this.col) > 1.0 || Math.abs(playerRow - this.row) > 1.0) return false;
    if (!resources.spendWood(this.config.cost.wood)) return false;

    this.active = false;
    this.highlight.destroy();
    this.icon.destroy();
    this.costText.destroy();
    this.config.onPurchase();
    return true;
  }
}
