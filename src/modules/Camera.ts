import Canvas from './Canvas';
import { mat4, vec3 } from 'gl-matrix';
import { degToRad } from '../utils/math';

export class Camera {

  private x = 0;
  private y = 0;
  private z = 0;
  private speed = 0;
  private yaw = 0;
  private pitch = 0;
  private yawRate = 0;
  private pitchRate = 0;

  constructor(private canvas: Canvas) {
    window.addEventListener('keydown', event => this.keyEvent(event, 'down'));
    window.addEventListener('keyup', event => this.keyEvent(event, 'up'));
  }

  public move(elapsed: number) {

    if (this.speed !== 0) {
      this.x -= Math.sin(degToRad(this.yaw)) * this.speed * elapsed;
      this.z -= Math.cos(degToRad(this.yaw)) * this.speed * elapsed;
    }

    this.yaw += this.yawRate * elapsed;
    this.pitch += this.pitchRate * elapsed;

    mat4.rotate(this.canvas.viewMatrix, this.canvas.viewMatrix, degToRad(-this.pitch), [1, 0, 0]);
    mat4.rotate(this.canvas.viewMatrix, this.canvas.viewMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.translate(this.canvas.viewMatrix, this.canvas.viewMatrix, [-this.x, -this.y, -this.z]);
  }

  private keyEvent(event: KeyboardEvent, direction: 'up' | 'down') {
    event.preventDefault();
    switch (event.keyCode) {
      case 87: // W
        this.speed = 0.003;
        break;
      case 83: // S
        this.speed = -0.003;
        break;
      case 68: // D
        this.yawRate = -0.1;
        break;
      case 65: // A
        this.yawRate = 0.1;
        break;
      case 32: // Space
        break;
      case 78: // M
        this.pitchRate = 0.08;
        break;
      case 77: // N
        this.pitchRate = -0.08;
    }
  }

}
