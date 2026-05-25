export class WoodCounter {
  constructor(scene, resources) {
    const iconSize = 40;
    const padding  = 12;

    this.icon = scene.add.image(padding, padding, 'wood-icon')
      .setOrigin(0, 0)
      .setDisplaySize(iconSize, iconSize)
      .setScrollFactor(0)
      .setDepth(100);

    this.text = scene.add.text(padding + iconSize + 6, padding + iconSize / 2, '0', {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(100);

    resources.on('wood-changed', (count) => {
      this.text.setText(`${count}`);
    });
  }
}
