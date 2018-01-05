import Canvas from './Canvas';
import { mat4, vec3 } from 'gl-matrix';

export class Camera {

  constructor(private canvas: Canvas) {
    window.addEventListener('keydown', event => this.keyEvent(event, 'down'));
    window.addEventListener('keyup', event => this.keyEvent(event, 'up'));
  }

  public move(elapsed: number) {

    // TODO: Tle daj kamero
    // this.canvas.viewMatrix = mat4.lookAt(mat4.create(), cameraPosition, carPosition, [0, 1, 0]);


  }

  private keyEvent(event: KeyboardEvent, direction: 'up' | 'down') {
    event.preventDefault();
    switch (event.keyCode) {
      case 87: // W
        this.mesh.velocity = vec3.fromValues(0, 0, -1);
        this.mesh.angle = 0;
        break;
      case 83: // S
        this.mesh.velocity = vec3.fromValues(0, 0, 1);
        this.mesh.axis = vec3.fromValues(0, 1, 0);
        this.mesh.angle = 180;
        break;
      case 68: // D
        this.mesh.velocity = vec3.fromValues(1, 0, 0);
        this.mesh.axis = vec3.fromValues(0, 1, 0);
        this.mesh.angle = -90;
        break;
      case 65: // A
        this.mesh.velocity = vec3.fromValues(-1, 0, 0);
        this.mesh.axis = vec3.fromValues(0, 1, 0);
        this.mesh.angle = 90;
        break;
      case 32: // Space
        this.mesh.velocity = vec3.fromValues(0, 0, 0);
        break;
    }
  }

}
