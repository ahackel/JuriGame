import { TILE_W, TILE_H } from '../constants.js';

// Sprite sheet layout (from pixel analysis of Player.png 1369×1149)
const PLAYER_FRAME_W = 146;
const PLAYER_START_X = 202;
const PLAYER_ROWS = [
  { dir: 'down',  y: 62,  h: 132 },
  { dir: 'up',    y: 206, h: 119 },
  { dir: 'left',  y: 336, h: 125 },
  { dir: 'right', y: 477, h: 125 },
];
const PLAYER_FRAMES = 8;

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('ground',      'assets/Ground.png');
    this.load.image('tree-raw',   'assets/Tree.png');
    this.load.image('player-raw', 'assets/Player.png');
    this.load.image('wood-icon',  'assets/Wood.webp');
    this.load.image('coin-icon',  'assets/Coin.png');
    this.load.image('seed-icon',  'assets/Seed.png');
    this.load.image('plant',      'assets/Plant.png');
    this.load.image('shop-bg',    'assets/Shop.png');
    this.load.image('house',      'assets/House.png');
  }

  create() {
    this._makeTreeTexture();
    this._makePlayerTexture();
    this.scene.start('GameScene');
  }

  _makeTreeTexture() {
    const treeImg = this.textures.get('tree-raw').getSourceImage();
    const W = 48, H = 64;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(treeImg, 0, 0, W, H);
    this._removeWhite(ctx, W, H);
    this.textures.addCanvas('tree', canvas);
  }

  _makePlayerTexture() {
    const playerImg = this.textures.get('player-raw').getSourceImage();
    const { width, height } = playerImg;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(playerImg, 0, 0);
    this._removeWhite(ctx, width, height);

    this.textures.addCanvas('player', canvas);

    const tex = this.textures.get('player');
    PLAYER_ROWS.forEach(({ dir, y, h }) => {
      for (let f = 0; f < PLAYER_FRAMES; f++) {
        tex.add(`${dir}_${f}`, 0, PLAYER_START_X + f * PLAYER_FRAME_W, y, PLAYER_FRAME_W, h);
      }
    });
  }

  _removeWhite(ctx, w, h) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
