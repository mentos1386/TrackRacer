import Canvas from './Canvas';
import { mat4, vec3 } from 'gl-matrix';
import { degToRad } from '../utils/math';

export class Camera {

  private speedFactor = 0.01;
  private yawFactor = 0.1;
  private pitchFactor = 0.1;

  private lastMove = 0;

  private x = 0;
  private y = 3;
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

  public move(now: number) {
    const elapsed = now - this.lastMove;
    this.lastMove = now;

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

    if (direction === 'down') {
      switch (event.keyCode) {
        case 87: // W
          this.speed = this.speedFactor;
          break;
        case 83: // S
          this.speed = -this.speedFactor;
          break;
        case 68: // D
          this.yawRate = -this.yawFactor;
          break;
        case 65: // A
          this.yawRate = this.yawFactor;
          break;
        case 32: // Space
          break;
        case 73: // I
          this.pitchRate = this.pitchFactor;
          break;
        case 74: // J
          this.pitchRate = -this.pitchFactor;
      }
    }

    if (direction === 'up') {
      this.speed = 0;
      this.yawRate = 0;
      this.pitchRate = 0;
    }
  }

}
