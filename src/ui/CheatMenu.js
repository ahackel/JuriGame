export class CheatMenu {
  constructor(scene, resources, onRestart) {
    this.scene = scene;
    this.resources = resources;
    this.onRestart = onRestart;
    this.isOpen = false;

    const cam = scene.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 2;
    const depth = 300000;

    this.elements = [];

    this.bg = scene.add.rectangle(centerX, centerY, cam.width, cam.height, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(depth)
      .setInteractive()
      .on('pointerdown', () => this.close());
    this.elements.push(this.bg);

    this.title = scene.add.text(centerX, centerY - 120, 'Cheats', {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.elements.push(this.title);

    const cheats = [
      { label: '100 Gold', onClick: () => resources.addCoins(100) },
      { label: '100 Holz', onClick: () => resources.addWood(100) },
      { label: '100 Samen', onClick: () => resources.addSeeds(100) },
    ];

    cheats.forEach((cheat, i) => {
      this._makeButton(centerX, centerY - 60 + i * 56, 200, 48, cheat.label, depth + 1, () => {
        cheat.onClick();
        this.close();
      });
    });

    const restartButton = this._makeButton(
      centerX, centerY - 60 + cheats.length * 56, 200, 48, 'Spiel neu starten', depth + 1,
      () => this.onRestart && this.onRestart()
    );
    restartButton.rect.setFillStyle(0x8a2020, 0.9);

    this.setVisible(false);
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

  setVisible(visible) {
    this.elements.forEach((el) => el.setVisible(visible));
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.setVisible(true);
  }

  close() {
    this.isOpen = false;
    this.setVisible(false);
  }
}
