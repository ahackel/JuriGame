export class CoinCounter {
  constructor(scene, resources) {
    const iconSize = 40;
    const padding  = 12;
    const rowY     = padding + iconSize + 8;

    this.icon = scene.add.image(padding, rowY, 'coin-icon')
      .setOrigin(0, 0)
      .setDisplaySize(iconSize, iconSize)
      .setScrollFactor(0)
      .setDepth(100000);

    this.text = scene.add.text(padding + iconSize + 6, rowY + iconSize / 2, '0', {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(100000);

    resources.on('coins-changed', (count) => {
      this.text.setText(`${count}`);
    });
  }
}
