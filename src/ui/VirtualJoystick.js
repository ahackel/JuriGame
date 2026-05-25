export class VirtualJoystick {
  constructor(scene) {
    this.scene = scene;
    this._joystick = null;
    this._create();
  }

  _create() {
    const scene = this.scene;
    const x = 100;
    const y = scene.scale.height - 100;

    this._joystick = scene.plugins.get('rexVirtualJoystick').add(scene, {
      x,
      y,
      radius: 55,
      base: scene.add.circle(0, 0, 55, 0x444466, 0.55).setDepth(200),
      thumb: scene.add.circle(0, 0, 28, 0x8888bb, 0.85).setDepth(201),
      forceMin: 16,
      fixed: true
    });

    scene.scale.on('resize', (gameSize) => {
      this._joystick.x = 100;
      this._joystick.y = gameSize.height - 100;
    });
  }

  get force() {
    return this._joystick ? this._joystick.force : 0;
  }

  get forceX() {
    return this._joystick ? this._joystick.forceX / this._joystick.radius : 0;
  }

  get forceY() {
    return this._joystick ? this._joystick.forceY / this._joystick.radius : 0;
  }
}
