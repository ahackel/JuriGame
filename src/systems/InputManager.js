export class InputManager {
  constructor(scene, joystick) {
    this.joystick = joystick;
    const kb = scene.input.keyboard;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D');
  }

  update() {
    const { cursors, wasd, joystick } = this;

    if (joystick && joystick.force > 16) {
      const len = Math.hypot(joystick.forceX, joystick.forceY);
      return len > 0 ? { x: joystick.forceX / len, y: joystick.forceY / len } : { x: 0, y: 0 };
    }

    let dx = 0;
    let dy = 0;
    if (cursors.up.isDown    || wasd.W.isDown) dy -= 1;
    if (cursors.down.isDown  || wasd.S.isDown) dy += 1;
    if (cursors.left.isDown  || wasd.A.isDown) dx -= 1;
    if (cursors.right.isDown || wasd.D.isDown) dx += 1;

    const len = Math.hypot(dx, dy);
    return len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
  }
}
