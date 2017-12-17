import Canvas from './Canvas';
import { degToRad } from '../utils/math';
import { mat4, vec3 } from 'gl-matrix';

export class Camera {
  private position = { x: 0, y: 0.3, z: 3.7 };
  private pitchFactor = 1;
  private direction = 0;
  private speed = 0.00001;
  private pitch = 0;
  private sensitivity = 10;

  constructor(private canvas: Canvas) {
  }

  get positionVector(): vec3 {
    return vec3.fromValues(this.position.x, this.position.y, this.position.z);
  }

  get inversePositionVector(): vec3 {
    return vec3.negate(vec3.create(), this.positionVector);
  }

  public onKey(key: string, elapsed: number) {
    const distance = elapsed * this.speed;

    let x = 0;
    let z = 0;

    switch (key) {
      case 'w':
        x += distance * Math.sin(degToRad(this.direction)) * this.pitchFactor;
        z += distance * Math.cos(degToRad(this.direction)) * this.pitchFactor * -1.0;
        break;
      case 's':
        x += distance * Math.sin(degToRad(this.direction)) * this.pitchFactor * -1.0;
        z += distance * Math.cos(degToRad(this.direction)) * this.pitchFactor;
        break;
      case 'd':
        x += distance * Math.cos(degToRad(this.direction)) * this.pitchFactor;
        z += distance * Math.sin(degToRad(this.direction)) * this.pitchFactor;
        break;
      case 'a':
        x += distance * Math.cos(degToRad(this.direction)) * -1.0;
        z += distance * Math.sin(degToRad(this.direction)) * -1.0;
    }

    if (x > distance)
      x = distance;
    if (x < -distance)
      x = -distance;
    if (z > distance)
      z = distance;
    if (z < -distance)
      z = -distance;

    this.position.x += x;
    this.position.z += z;

    this.moveCamera();
    console.log(`[CAMERA] [${key}] x:${this.position.x} y:${this.position.y} z:${this.position.z}`);
  }

  moveCamera() {
    mat4.rotate(
      this.canvas.modelViewMatrix,
      this.canvas.modelViewMatrix,
      degToRad(this.pitch),
      [1, 0, 0]);
    mat4.rotate(
      this.canvas.modelViewMatrix,
      this.canvas.modelViewMatrix,
      degToRad(this.direction),
      [0, 1, 0]);
    mat4.translate(
      this.canvas.modelViewMatrix,
      this.canvas.modelViewMatrix,
      this.inversePositionVector);

    console.log(`[CAMERA] [MVm]`, this.canvas.modelViewMatrix);
  }

}
