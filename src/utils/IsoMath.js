import { TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, MAP_COLS, MAP_ROWS } from '../constants.js';

export function tileToScreen(col, row) {
  return {
    x: ORIGIN_X + (col - row) * (TILE_W / 2),
    y: ORIGIN_Y + (col + row) * (TILE_H / 2)
  };
}

export function screenToTile(x, y) {
  const rx = x - ORIGIN_X;
  const ry = y - ORIGIN_Y;
  return {
    col: (rx / (TILE_W / 2) + ry / (TILE_H / 2)) / 2,
    row: (ry / (TILE_H / 2) - rx / (TILE_W / 2)) / 2
  };
}

export function tileCenter(col, row) {
  const pos = tileToScreen(col, row);
  return { x: pos.x, y: pos.y + TILE_H / 2 };
}

export function worldBounds() {
  // Bounding rectangle of the full isometric diamond in screen space
  const topLeft = tileToScreen(0, 0);
  const topRight = tileToScreen(MAP_COLS - 1, 0);
  const bottomLeft = tileToScreen(0, MAP_ROWS - 1);
  const bottomRight = tileToScreen(MAP_COLS - 1, MAP_ROWS - 1);

  const minX = Math.min(topLeft.x, bottomLeft.x);
  const maxX = Math.max(topRight.x, bottomRight.x) + TILE_W;
  const minY = Math.min(topLeft.y, topRight.y);
  const maxY = Math.max(bottomLeft.y, bottomRight.y) + TILE_H;

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
