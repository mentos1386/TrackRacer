import Canvas from './Canvas';
import { MeshShape } from './MeshShape';
import { mat4, vec3 } from 'gl-matrix';

export class Camera {

  constructor(private canvas: Canvas, private mesh: MeshShape) {
    window.addEventListener('keydown', event => this.keyEvent(event, 'down'));
    window.addEventListener('keyup', event => this.keyEvent(event, 'up'));
  }

  public render(elapsed: number) {

    this.canvas.setTextForElement(
      'car-pos',
      `x: ${this.mesh.position[0].toFixed(2)}; ` +
      `y: ${this.mesh.position[1].toFixed(2)}; ` +
      `z: ${this.mesh.position[2].toFixed(2)}`,
    );

    this.canvas.setTextForElement(
      'car-speed',
      `x: ${this.mesh.velocity[0].toFixed(2)}; ` +
      `y: ${this.mesh.velocity[1].toFixed(2)}; ` +
      `z: ${this.mesh.velocity[2].toFixed(2)}`,
    );

    const cameraPosition = vec3.fromValues(
      this.mesh.position[0],
      this.mesh.position[1] + 1,
      this.mesh.position[2] + 2);

    const carPosition = vec3.fromValues(
      this.mesh.position[0],
      this.mesh.position[1],
      this.mesh.position[2]);

    this.canvas.viewMatrix = mat4.lookAt(mat4.create(), cameraPosition, carPosition, [0, 1, 0]);

    this.mesh.render();
  }

  private keyEvent(event: KeyboardEvent, direction: 'up' | 'down') {
    event.preventDefault();
    switch (event.keyCode) {
      case 87: // W
        this.mesh.velocity = vec3.fromValues(0, 0, -1);
        break;
      case 83: // S
        this.mesh.velocity = vec3.fromValues(0, 0, 1);
        break;
      case 68: // D
        this.mesh.velocity = vec3.fromValues(1, 0, 0);
        break;
      case 65: // A
        this.mesh.velocity = vec3.fromValues(-1, 0, 0);
        break;
      case 32: // Space
        this.mesh.velocity = vec3.fromValues(0, 0, 0);
        break;
    }
  }

}
