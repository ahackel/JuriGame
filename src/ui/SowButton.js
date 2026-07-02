export class SowButton {
  constructor(scene, resources, onSow) {
    const cam = scene.cameras.main;
    const margin = 12;
    const w = 110;
    const h = 44;
    const x = cam.width - margin - w / 2;
    const y = margin + h / 2;
    const depth = 100000;

    this.rect = scene.add.rectangle(x, y, w, h, 0x2d6e2d, 0.9)
      .setStrokeStyle(2, 0xffffff)
      .setScrollFactor(0)
      .setDepth(depth)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onSow);

    this.text = scene.add.text(x, y, 'Säen', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);

    this.setVisible(false);
    resources.on('seeds-changed', (count) => this.setVisible(count > 0));
  }

  setVisible(visible) {
    this.rect.setVisible(visible);
    this.text.setVisible(visible);
  }
}
