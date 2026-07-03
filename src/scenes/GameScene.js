import { WorldMap } from '../world/WorldMap.js';
import { TileLayer } from '../world/TileLayer.js';
import { Player } from '../entities/Player.js';
import { Tree } from '../entities/Tree.js';
import { PaymentField } from '../entities/PaymentField.js';
import { Shop } from '../entities/Shop.js';
import { SeedPlant } from '../entities/SeedPlant.js';
import { InputManager } from '../systems/InputManager.js';
import { ResourceManager } from '../systems/ResourceManager.js';
import { WoodCounter } from '../ui/WoodCounter.js';
import { CoinCounter } from '../ui/CoinCounter.js';
import { SeedCounter } from '../ui/SeedCounter.js';
import { VirtualJoystick } from '../ui/VirtualJoystick.js';
import { ShopUI } from '../ui/ShopUI.js';
import { CheatMenu } from '../ui/CheatMenu.js';
import { SowButton } from '../ui/SowButton.js';
import { worldBounds, tileCenter } from '../utils/IsoMath.js';
import { TILE_W } from '../constants.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // World data
    const worldMap = new WorldMap();
    new TileLayer(this);

    // Resources
    this.resources = new ResourceManager();

    // Trees
    this.trees = worldMap.getTreePositions().map(({ col, row }) => new Tree(this, col, row));
    this.plantedSeeds = [];

    // Player
    const spawn = worldMap.getSpawnTile();
    this.player = new Player(this, spawn.col, spawn.row);

    // Input
    this.joystick = new VirtualJoystick(this);
    this.input_ = new InputManager(this, this.joystick);

    // HUD
    new WoodCounter(this, this.resources);
    new CoinCounter(this, this.resources);
    new SeedCounter(this, this.resources);
    this.shopUI = new ShopUI(this, this.resources);
    this.sowButton = new SowButton(this, this.resources, () => this._sow());
    this.nearShop = false;

    // Cheat menu
    this.cheatMenu = new CheatMenu(this, this.resources);
    this.input.keyboard.on('keydown-C', () => this.cheatMenu.toggle());

    // Click/tap to move
    this.moveTarget = null;
    this.input.on('pointerdown', (pointer, currentlyOver) => {
      if (currentlyOver.length > 0) return;
      if (this.shopUI.isOpen || this.cheatMenu.isOpen) return;
      this.moveTarget = { x: pointer.worldX, y: pointer.worldY };
    });

    // Camera
    const bounds = worldBounds();
    this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // Payment fields
    this.paymentFields = worldMap.getPaymentFields().map(({ col, row, cost, label, shopCol, shopRow }) =>
      new PaymentField(this, col, row, {
        cost,
        label,
        onPurchase: () => {
          new Shop(this, shopCol, shopRow);
          this.shopCenter = tileCenter(shopCol, shopRow);
        },
      })
    );

    // Tree collection event
    this.events.on('tree-collected', (amount) => this.resources.addWood(amount));
  }

  update(_time, delta) {
    const dt = delta / 1000;

    if (this.shopUI.isOpen || this.cheatMenu.isOpen) {
      this.input_.update();
      return;
    }

    let inputVector = this.input_.update();

    if (inputVector.x !== 0 || inputVector.y !== 0) {
      this.moveTarget = null;
    } else if (this.moveTarget) {
      const dx = this.moveTarget.x - this.player.sprite.x;
      const dy = this.moveTarget.y - this.player.sprite.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        this.moveTarget = null;
      } else {
        inputVector = { x: dx / dist, y: dy / dist };
      }
    }

    this.player.update(dt, inputVector);

    const playerCol = this.player.isoCol;
    const playerRow = this.player.isoRow;

    for (const tree of this.trees) {
      tree.checkCollection(playerCol, playerRow);
    }

    for (const field of this.paymentFields) {
      field.checkTrigger(playerCol, playerRow, this.resources);
    }

    if (this.shopCenter) {
      const dist = Math.hypot(this.player.sprite.x - this.shopCenter.x, this.player.sprite.y - this.shopCenter.y);
      const near = dist < TILE_W * 1.2;

      if (near && !this.nearShop) {
        this._growSeeds();
        this.shopUI.open();
      }
      this.nearShop = near;
    }
  }

  _sow() {
    if (!this.resources.spendSeeds(1)) return;
    const col = Math.round(this.player.isoCol);
    const row = Math.round(this.player.isoRow);
    this.plantedSeeds.push(new SeedPlant(this, col, row));
  }

  _growSeeds() {
    for (const seed of this.plantedSeeds) {
      seed.destroy();
      this.trees.push(new Tree(this, seed.col, seed.row));
    }
    this.plantedSeeds = [];
  }
}
