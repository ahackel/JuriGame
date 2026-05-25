export class ResourceManager extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.wood = 0;
  }

  addWood(n = 1) {
    this.wood += n;
    this.emit('wood-changed', this.wood);
  }
}
