import { IShape } from './Shape.interface';
import Canvas from '../canvas/Canvas';
import { mat3, mat4 } from 'gl-matrix';

export class Triangle implements IShape {
  private positionBuffer: WebGLBuffer;
  private itemSize = 3;
  private numItems = 3;

  constructor(private canvas: Canvas, private vertices: Float32Array) {
    this.positionBuffer = this.canvas.webgl.createBuffer();
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.positionBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      vertices,
      this.canvas.webgl.STATIC_DRAW);
  }

  public draw(): void {
    // Now move the drawing position a bit to where we want to start
    // drawing the triangle.
    mat4.translate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, [-1.5, 0.0, -7.0]);

    // Draw the triangle by binding the array buffer to the square's vertices
    // array, setting attributes, and pushing it to GL.
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.positionBuffer);
    this.canvas.webgl.vertexAttribPointer(
      this.canvas.shaderProgram.vertexPositionAttribute,
      this.itemSize,
      this.canvas.webgl.FLOAT,
      false,
      0,
      0);
    this.canvas.setMatrixUniforms();
    this.canvas.webgl.drawArrays(this.canvas.webgl.TRIANGLES, 0, this.numItems);
  }
}
