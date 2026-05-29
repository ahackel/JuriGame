import { PLAYER_SPEED, TILE_W, TILE_H, MAP_COLS, MAP_ROWS, ORIGIN_X, ORIGIN_Y } from '../constants.js';
import { tileCenter, screenToTile } from '../utils/IsoMath.js';

const FRAME_COUNT    = 8;
const FRAME_INTERVAL = 0.1;
const DISPLAY_SCALE  = 0.22;

export class Player {
  constructor(scene, spawnCol, spawnRow) {
    this.scene = scene;
    const pos = tileCenter(spawnCol, spawnRow);

    this.sprite = scene.add.sprite(pos.x, pos.y, 'player', 'down_0');
    this.sprite.setOrigin(0.5, 1.0);
    this.sprite.setScale(DISPLAY_SCALE);
    this.sprite.setDepth(pos.y);

    this._dir         = 'down';
    this._frame       = 0;
    this._frameTimer  = 0;
  }

  get isoCol() { return screenToTile(this.sprite.x, this.sprite.y).col - 0.5; }
  get isoRow() { return screenToTile(this.sprite.x, this.sprite.y).row - 0.5; }

  update(dt, inputVector) {
    const moving = inputVector.x !== 0 || inputVector.y !== 0;

    if (moving) {
      const len = Math.hypot(inputVector.x, inputVector.y) || 1;
      const newX = this.sprite.x + (inputVector.x / len) * PLAYER_SPEED * dt;
      const newY = this.sprite.y + (inputVector.y / len) * PLAYER_SPEED * dt;

      const tile = screenToTile(newX, newY);
      const tc   = Phaser.Math.Clamp(tile.col, 0.5, MAP_COLS - 0.5);
      const tr   = Phaser.Math.Clamp(tile.row, 0.5, MAP_ROWS - 0.5);

      this.sprite.x = ORIGIN_X + tc * TILE_W;
      this.sprite.y = ORIGIN_Y + tr * TILE_H;

      // Direction
      const dir = this._resolveDir(inputVector);
      if (dir !== this._dir) { this._dir = dir; this._frame = 0; this._frameTimer = 0; }

      this._frameTimer += dt;
      if (this._frameTimer >= FRAME_INTERVAL) {
        this._frameTimer -= FRAME_INTERVAL;
        this._frame = (this._frame + 1) % FRAME_COUNT;
      }
    } else {
      this._frame      = 0;
      this._frameTimer = 0;
    }

    this.sprite.setFrame(`${this._dir}_${this._frame}`);
    this.sprite.setDepth(this.sprite.y);
  }

  _resolveDir(v) {
    if (Math.abs(v.x) >= Math.abs(v.y)) return v.x > 0 ? 'right' : 'left';
    return v.y > 0 ? 'down' : 'up';
  }
}
