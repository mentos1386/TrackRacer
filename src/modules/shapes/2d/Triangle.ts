import { IShape } from '../Shape.interface';
import Canvas from '../../Canvas';
import { mat3, mat4, vec3 } from 'gl-matrix';
import { Shape } from '../Shape';

export class Triangle extends Shape implements IShape {
  private itemSize = 2;
  private numItems = 3;

  constructor(canvas: Canvas, vertices: Float32Array, position: number[]) {
    super(canvas, vertices, position);
  }

  public draw(): void {
    // Now move the drawing position a bit to where we want to start
    // drawing the triangle.
    mat4.translate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, this.position);

    // Draw the triangle by binding the array buffer to the square's vertices
    // array, setting attributes, and pushing it to GL.
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.verticesBuffer);
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

  move(vector: vec3) {
    throw new Error('Not implemented!');
  }
}
