import { MAP_COLS, TILE_W } from '../constants.js';
import { tileCenter } from '../utils/IsoMath.js';
import { Customer } from '../entities/Customer.js';

const MAX_QUEUE            = 3;
const INITIAL_SPAWN_DELAY  = 3;
const RESPAWN_DELAY        = 12;
const TRADE_COOLDOWN       = 1.2;

export class CustomerManager {
  constructor(scene, shopCol, shopRow) {
    this.scene      = scene;
    this.queue      = [];
    this.leaving    = [];
    this.spawnTimer = INITIAL_SPAWN_DELAY;
    this.tradeTimer = 0;

    this.shopCenter = tileCenter(shopCol, shopRow);
    this.queueSlots = [1, 2, 3].map(i => tileCenter(shopCol - i, shopRow));
    const exitCol   = Math.min(shopCol + 10, MAP_COLS - 1);
    this.spawnPos   = tileCenter(exitCol, shopRow);
    this.exitPos    = this.spawnPos;
  }

  update(dt, playerX, playerY, resources) {
    // Spawn next customer
    if (this.queue.length < MAX_QUEUE) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this._spawn();
        this.spawnTimer = RESPAWN_DELAY;
      }
    }

    for (const c of this.queue)        c.update(dt);
    for (const c of [...this.leaving]) {
      c.update(dt);
      if (c.done) this.leaving.splice(this.leaving.indexOf(c), 1);
    }

    // Trade when player is near shop, front customer is ready, player has wood
    const nearShop  = Math.hypot(playerX - this.shopCenter.x, playerY - this.shopCenter.y) < TILE_W * 2;
    const frontReady = this.queue.length > 0 && this.queue[0].state === 'queued';

    if (nearShop && frontReady && resources.wood >= 2) {
      this.tradeTimer -= dt;
      if (this.tradeTimer <= 0) {
        this._trade(resources);
        this.tradeTimer = TRADE_COOLDOWN;
      }
    } else if (!nearShop) {
      this.tradeTimer = 0;
    }
  }

  _spawn() {
    const slotIdx = this.queue.length;
    if (slotIdx >= this.queueSlots.length) return;
    const slot = this.queueSlots[slotIdx];
    this.queue.push(new Customer(this.scene, this.spawnPos.x, this.spawnPos.y, slot.x, slot.y));
  }

  _trade(resources) {
    const customer = this.queue.shift();
    resources.spendWood(2);
    resources.addCoins(1);
    customer.leave(this.exitPos.x, this.exitPos.y);
    this.leaving.push(customer);

    // Shift queue forward
    this.queue.forEach((c, i) => c.moveTo(this.queueSlots[i].x, this.queueSlots[i].y));

    // Schedule next customer sooner if queue got shorter
    this.spawnTimer = Math.min(this.spawnTimer, RESPAWN_DELAY);

    // Floating feedback text
    const popup = this.scene.add.text(this.shopCenter.x, this.shopCenter.y - 20, '+1  -2', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 1).setDepth(100000);
    this.scene.tweens.add({
      targets: popup,
      y: popup.y - 28,
      alpha: 0,
      duration: 900,
      onComplete: () => popup.destroy(),
    });
  }
}
