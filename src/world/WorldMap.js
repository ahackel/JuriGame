import { MAP_COLS, MAP_ROWS, TREE_DENSITY, SPAWN_EXCLUSION, TOP_ROW_EXCLUSION } from '../constants.js';

export class WorldMap {
  constructor() {
    this.treePositions = [];
    this._paymentFields = this._buildPaymentFields();
    this._generate();
  }

  _buildPaymentFields() {
    const spawnCol = Math.floor(MAP_COLS / 2);
    const spawnRow = Math.floor(MAP_ROWS / 2);
    return [
      {
        col:     spawnCol + 4,
        row:     spawnRow + 3,
        cost:    { wood: 30 },
        label:   '30 Holz -> Shop bauen',
        shopCol: spawnCol + 7,
        shopRow: spawnRow + 3,
      },
    ];
  }

  _generate() {
    const spawnCol = Math.floor(MAP_COLS / 2);
    const spawnRow = Math.floor(MAP_ROWS / 2);

    // Tiles to keep tree-free: payment fields + shop footprints
    const clearZones = [];
    for (const pf of this._paymentFields) {
      clearZones.push({ col: pf.col, row: pf.row, r: 1 });
      clearZones.push({ col: pf.shopCol, row: pf.shopRow, r: 2 });
    }

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        if (row < TOP_ROW_EXCLUSION) continue;
        const dx = Math.abs(col - spawnCol);
        const dy = Math.abs(row - spawnRow);
        if (dx <= SPAWN_EXCLUSION && dy <= SPAWN_EXCLUSION) continue;
        if (clearZones.some(z => Math.abs(col - z.col) <= z.r && Math.abs(row - z.row) <= z.r)) continue;
        if (Math.random() < TREE_DENSITY) {
          this.treePositions.push({ col, row });
        }
      }
    }
  }

  getTreePositions()    { return this.treePositions; }
  getSpawnTile()        { return { col: Math.floor(MAP_COLS / 2), row: Math.floor(MAP_ROWS / 2) }; }
  getPaymentFields()    { return this._paymentFields; }
}
