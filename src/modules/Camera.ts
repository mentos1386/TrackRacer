import Canvas from './Canvas';
import { MeshShape } from './MeshShape';
import { Vec3 } from 'cannon';
import { mat4, vec3 } from 'gl-matrix';
import { degToRad } from '../utils/math';

export class Camera {

  constructor(private canvas: Canvas, private mesh: MeshShape) {
  }

  public render(key: string, elapsed: number) {

    const velocityFactor = 1000;

    let x = 0;
    let z = 0;

    switch (key) {
      case 'w':
        z += -velocityFactor;
        break;
      case 's':
        z += velocityFactor;
        break;
      case 'd':
        x += velocityFactor;
        break;
      case 'a':
        x += -velocityFactor;
    }

    const accelerationForce = this.mesh.body.quaternion.vmult(new Vec3(x, 0, z));
    // this.mesh.body.applyForce(accelerationForce, this.mesh.body.position);
    this.mesh.body.applyLocalForce(accelerationForce, new Vec3(0,0,0));
    console.log(this.mesh.body.velocity, this.mesh.body.force);

    // this.mesh.body.linearDamping = 0.5;
    // this.mesh.body.angularDamping = 0.9;

    const cameraPosition = vec3.fromValues(
      this.mesh.body.position.x,
      this.mesh.body.position.y + 1,
      this.mesh.body.position.z + 2);

    const carPosition = vec3.fromValues(
      this.mesh.body.position.x,
      this.mesh.body.position.y,
      this.mesh.body.position.z);

    this.canvas.viewMatrix = mat4.lookAt(mat4.create(), cameraPosition, carPosition, [0, 1, 0]);

    this.canvas.setTextForElement(
      'car-pos',
      `x: ${carPosition[0].toFixed(2)}; y: ${carPosition[1].toFixed(2)}; z: ${carPosition[2].toFixed(
        2)}`);
    this.canvas.setTextForElement(
      'car-velocity',
      `x: ${accelerationForce.x.toFixed(2)}; y: ${accelerationForce.y.toFixed(2)}; z: ${accelerationForce.z.toFixed(
        2)}`);
    this.canvas.setTextForElement(
      'camera-pos',
      `x: ${cameraPosition[0].toFixed(2)}; y: ${cameraPosition[1].toFixed(2)}; z: ${cameraPosition[2].toFixed(
        2)}`);

    this.mesh.render();
  }

}
