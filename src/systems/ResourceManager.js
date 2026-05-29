export class ResourceManager extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.wood = 0;
    this.coins = 0;
  }

  addWood(n = 1) {
    this.wood += n;
    this.emit('wood-changed', this.wood);
  }

  spendWood(n) {
    if (this.wood < n) return false;
    this.wood -= n;
    this.emit('wood-changed', this.wood);
    return true;
  }

  addCoins(n = 1) {
    this.coins += n;
    this.emit('coins-changed', this.coins);
  }
}
