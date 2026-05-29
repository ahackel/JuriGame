const SPEED          = 58;
const FRAME_INTERVAL = 0.12;
const SCALE          = 0.22;
const TINTS          = [0xff9999, 0x99ff99, 0x9999ff, 0xffff99, 0xff99ff];
let   tintIdx        = 0;

export class Customer {
  constructor(scene, startX, startY, targetX, targetY) {
    this.scene   = scene;
    this.targetX = targetX;
    this.targetY = targetY;
    this.state   = 'walking'; // 'walking' | 'queued' | 'leaving'
    this.done    = false;

    this.sprite = scene.add.sprite(startX, startY, 'player', 'down_0')
      .setOrigin(0.5, 1.0)
      .setScale(SCALE)
      .setTint(TINTS[tintIdx++ % TINTS.length])
      .setDepth(startY);

    this._dir        = 'down';
    this._frame      = 0;
    this._frameTimer = 0;
  }

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    if (this.state === 'queued') this.state = 'walking';
  }

  leave(exitX, exitY) {
    this.state   = 'leaving';
    this.targetX = exitX;
    this.targetY = exitY;
  }

  update(dt) {
    if (this.done) return;

    const dx   = this.targetX - this.sprite.x;
    const dy   = this.targetY - this.sprite.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 2) {
      this.sprite.x = this.targetX;
      this.sprite.y = this.targetY;
      if (this.state === 'leaving') {
        this.sprite.destroy();
        this.done = true;
      } else if (this.state === 'walking') {
        this.state = 'queued';
        this.sprite.setFrame('down_0');
      }
      return;
    }

    const step = Math.min(dist, SPEED * dt);
    this.sprite.x += (dx / dist) * step;
    this.sprite.y += (dy / dist) * step;
    this.sprite.setDepth(this.sprite.y);

    const dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    if (dir !== this._dir) { this._dir = dir; this._frame = 0; this._frameTimer = 0; }
    this._frameTimer += dt;
    if (this._frameTimer >= FRAME_INTERVAL) {
      this._frameTimer -= FRAME_INTERVAL;
      this._frame = (this._frame + 1) % 8;
    }
    this.sprite.setFrame(`${this._dir}_${this._frame}`);
  }
}
