const SEED_BUYER_CHANCE = 0.3;

export class ShopUI {
  constructor(scene, resources) {
    this.scene = scene;
    this.resources = resources;
    this.isOpen = false;

    const cam = scene.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 2;
    const depth = 200000;
    const margin = 24;

    this.elements = [];

    const bgImg = scene.textures.get('shop-bg').getSourceImage();
    this.bg = scene.add.image(centerX, centerY, 'shop-bg')
      .setScrollFactor(0)
      .setDepth(depth)
      .setDisplaySize(cam.width, cam.height);
    this.elements.push(this.bg);

    this.title = scene.add.text(centerX, margin + 8, 'Shop', {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.title);

    const resourcesY = margin + 40;

    this.woodIcon = scene.add.image(centerX - 60, resourcesY, 'wood-icon')
      .setDisplaySize(28, 28)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.woodIcon);

    this.woodText = scene.add.text(centerX - 40, resourcesY, '0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.woodText);

    this.coinIcon = scene.add.image(centerX + 20, resourcesY, 'coin-icon')
      .setDisplaySize(28, 28)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.coinIcon);

    this.coinText = scene.add.text(centerX + 40, resourcesY, '0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.coinText);

    this.seedIcon = scene.add.image(centerX + 100, resourcesY, 'seed-icon')
      .setDisplaySize(28, 28)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.seedIcon);

    this.seedText = scene.add.text(centerX + 120, resourcesY, '0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 2);
    this.elements.push(this.seedText);

    this.sellButton = this._makeButton(margin + 75, margin + 24, 150, 48, 'Verkaufen', depth + 2, () => this._sell());
    this.leaveButton = this._makeButton(cam.width - margin - 75, margin + 24, 150, 48, 'Verlassen', depth + 2, () => this.close());

    this.setVisible(false);

    resources.on('wood-changed', (count) => this.woodText.setText(`${count}`));
    resources.on('coins-changed', (count) => this.coinText.setText(`${count}`));
    resources.on('seeds-changed', (count) => this.seedText.setText(`${count}`));
  }

  _makeButton(x, y, w, h, label, depth, onClick) {
    const rect = this.scene.add.rectangle(x, y, w, h, 0x2d6e2d, 0.9)
      .setStrokeStyle(2, 0xffffff)
      .setScrollFactor(0)
      .setDepth(depth)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick);
    this.elements.push(rect);

    const text = this.scene.add.text(x, y, label, {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.elements.push(text);

    return { rect, text };
  }

  _sell() {
    if (this.resources.wood <= 0) return;
    const amount = Math.min(this.resources.wood, Phaser.Math.Between(1, 20));
    this.resources.spendWood(amount);
    const reward = Math.floor(amount / 2);
    if (Math.random() < SEED_BUYER_CHANCE) {
      this.resources.addSeeds(reward);
    } else {
      this.resources.addCoins(reward);
    }
  }

  setVisible(visible) {
    this.elements.forEach((el) => el.setVisible(visible));
  }

  open() {
    this.isOpen = true;
    this.woodText.setText(`${this.resources.wood}`);
    this.coinText.setText(`${this.resources.coins}`);
    this.seedText.setText(`${this.resources.seeds}`);
    this.setVisible(true);
  }

  close() {
    this.isOpen = false;
    this.setVisible(false);
  }
}
