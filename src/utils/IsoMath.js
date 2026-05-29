import { TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, MAP_COLS, MAP_ROWS } from '../constants.js';

export function tileToScreen(col, row) {
  return {
    x: ORIGIN_X + col * TILE_W,
    y: ORIGIN_Y + row * TILE_H
  };
}

export function screenToTile(x, y) {
  return {
    col: (x - ORIGIN_X) / TILE_W,
    row: (y - ORIGIN_Y) / TILE_H
  };
}

export function tileCenter(col, row) {
  return {
    x: ORIGIN_X + col * TILE_W + TILE_W / 2,
    y: ORIGIN_Y + row * TILE_H + TILE_H / 2
  };
}

export function worldBounds() {
  return {
    x: ORIGIN_X,
    y: ORIGIN_Y,
    width: MAP_COLS * TILE_W,
    height: MAP_ROWS * TILE_H
  };
}
