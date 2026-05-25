import { MAP_COLS, MAP_ROWS, TREE_DENSITY, SPAWN_EXCLUSION } from '../constants.js';

export class WorldMap {
  constructor() {
    this.treePositions = [];
    this._generate();
  }

  _generate() {
    const spawnCol = Math.floor(MAP_COLS / 2);
    const spawnRow = Math.floor(MAP_ROWS / 2);

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const dx = Math.abs(col - spawnCol);
        const dy = Math.abs(row - spawnRow);
        if (dx <= SPAWN_EXCLUSION && dy <= SPAWN_EXCLUSION) continue;
        if (Math.random() < TREE_DENSITY) {
          this.treePositions.push({ col, row });
        }
      }
    }
  }

  getTreePositions() {
    return this.treePositions;
  }

  getSpawnTile() {
    return { col: Math.floor(MAP_COLS / 2), row: Math.floor(MAP_ROWS / 2) };
  }
}
