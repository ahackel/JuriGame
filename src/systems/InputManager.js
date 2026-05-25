export class InputManager {
  constructor(scene, joystick) {
    this.joystick = joystick;
    const kb = scene.input.keyboard;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D');
  }

  update() {
    const { cursors, wasd, joystick } = this;

    // Joystick takes priority over keyboard if active
    if (joystick && joystick.force > 16) {
      // Joystick gives screen-space direction; rotate 45° to iso tile axes
      const fx = joystick.forceX;
      const fy = joystick.forceY;
      const isoX = (fx + fy);
      const isoY = (-fx + fy);
      const len = Math.hypot(isoX, isoY);
      return len > 0 ? { x: isoX / len, y: isoY / len } : { x: 0, y: 0 };
    }

    // Keyboard: map to iso tile axes
    // W/Up → -col-row (northwest), S/Down → +col+row (southeast)
    // A/Left → -col+row (southwest), D/Right → +col-row (northeast)
    let dx = 0;
    let dy = 0;
    if (cursors.up.isDown    || wasd.W.isDown) { dx -= 1; dy -= 1; }
    if (cursors.down.isDown  || wasd.S.isDown) { dx += 1; dy += 1; }
    if (cursors.left.isDown  || wasd.A.isDown) { dx -= 1; dy += 1; }
    if (cursors.right.isDown || wasd.D.isDown) { dx += 1; dy -= 1; }

    const len = Math.hypot(dx, dy);
    return len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
  }
}
