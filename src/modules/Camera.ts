import Canvas from './Canvas';
import { MeshShape } from './MeshShape';
import { Vec3, RigidVehicle } from 'cannon';
import { mat4, vec3 } from 'gl-matrix';

export class Camera {

  constructor(private canvas: Canvas, private mesh: MeshShape, private vehicle: RigidVehicle) {
    window.addEventListener('keydown', event => this.keyEvent(event, 'down'));
    window.addEventListener('keyup', event => this.keyEvent(event, 'up'));
  }

  public render(elapsed: number) {

    const cameraPosition = vec3.fromValues(
      this.mesh.body.position.x,
      this.mesh.body.position.y + 1,
      this.mesh.body.position.z + 2);

    const carPosition = vec3.fromValues(
      this.mesh.body.position.x,
      this.mesh.body.position.y,
      this.mesh.body.position.z);

    this.canvas.viewMatrix = mat4.lookAt(mat4.create(), cameraPosition, carPosition, [0, 1, 0]);

    this.mesh.render();
  }

  private keyEvent(event: KeyboardEvent, direction: 'up' | 'down') {
    const maxForce = 100;
    const maxSteerVal = Math.PI / 8;
    const up = direction === 'up';

    switch (event.key) {
      case 'w':
        this.vehicle.setWheelForce(up ? 0 : maxForce, 2);
        this.vehicle.setWheelForce(up ? 0 : -maxForce, 3);
        break;
      case 's':
        this.vehicle.setWheelForce(up ? 0 : -maxForce / 2, 2);
        this.vehicle.setWheelForce(up ? 0 : maxForce, 3);
        break;
      case 'd':
        this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0);
        this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1);
        break;
      case 'a':
        this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0);
        this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1);
    }

    console.log(this.vehicle);
  }

}
