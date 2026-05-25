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
      const screenDx = (inputVector.x - inputVector.y) * (TILE_W / 2);
      const screenDy = (inputVector.x + inputVector.y) * (TILE_H / 2);
      const len = Math.hypot(screenDx, screenDy);

      const newX = this.sprite.x + (screenDx / len) * PLAYER_SPEED * dt;
      const newY = this.sprite.y + (screenDy / len) * PLAYER_SPEED * dt;

      // Clamp to isometric diamond: convert to screenToTile coords, clamp, convert back
      // screenToTile gives (col+0.5, row+0.5) for a position at tileCenter(col, row)
      const tile = screenToTile(newX, newY);
      const tc   = Phaser.Math.Clamp(tile.col, 0.5, MAP_COLS - 0.5);
      const tr   = Phaser.Math.Clamp(tile.row, 0.5, MAP_ROWS - 0.5);

      this.sprite.x = ORIGIN_X + (tc - tr) * (TILE_W / 2);
      this.sprite.y = ORIGIN_Y + (tc + tr) * (TILE_H / 2);

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

  // Map iso tile-axis input vector to sprite direction
  // s = x+y: positive → south, e = x-y: positive → east
  _resolveDir(v) {
    const s = v.x + v.y;
    const e = v.x - v.y;
    if (Math.abs(e) >= Math.abs(s)) return e > 0 ? 'right' : 'left';
    return s > 0 ? 'down' : 'up';
  }
}
