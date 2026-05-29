import { WorldMap } from '../world/WorldMap.js';
import { TileLayer } from '../world/TileLayer.js';
import { Player } from '../entities/Player.js';
import { Tree } from '../entities/Tree.js';
import { PaymentField } from '../entities/PaymentField.js';
import { Shop } from '../entities/Shop.js';
import { InputManager } from '../systems/InputManager.js';
import { ResourceManager } from '../systems/ResourceManager.js';
import { CustomerManager } from '../systems/CustomerManager.js';
import { WoodCounter } from '../ui/WoodCounter.js';
import { CoinCounter } from '../ui/CoinCounter.js';
import { VirtualJoystick } from '../ui/VirtualJoystick.js';
import { worldBounds } from '../utils/IsoMath.js';

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

    // Player
    const spawn = worldMap.getSpawnTile();
    this.player = new Player(this, spawn.col, spawn.row);

    // Input
    this.joystick = new VirtualJoystick(this);
    this.input_ = new InputManager(this, this.joystick);

    // HUD
    new WoodCounter(this, this.resources);
    new CoinCounter(this, this.resources);

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
          this.customerManager = new CustomerManager(this, shopCol, shopRow);
        },
      })
    );

    // Tree collection event
    this.events.on('tree-collected', (amount) => this.resources.addWood(amount));
  }

  update(_time, delta) {
    const inputVector = this.input_.update();
    this.player.update(delta / 1000, inputVector);

    const playerCol = this.player.isoCol;
    const playerRow = this.player.isoRow;

    for (const tree of this.trees) {
      tree.checkCollection(playerCol, playerRow);
    }

    for (const field of this.paymentFields) {
      field.checkTrigger(playerCol, playerRow, this.resources);
    }

    if (this.customerManager) {
      this.customerManager.update(delta / 1000, this.player.sprite.x, this.player.sprite.y, this.resources);
    }
  }
}
