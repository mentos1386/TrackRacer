import { IShape } from '../Shape.interface';
import Canvas from '../../Canvas';
import { mat4, vec3 } from 'gl-matrix';
import { Shape } from '../Shape';

export class Cube extends Shape implements IShape {

  private itemSize: 3;
  private numItems: 4;

  constructor(canvas: Canvas, vertices: Float32Array, position: number[]) {
    super(canvas, vertices, position);
  }

  draw() {
    mat4.translate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, this.position);

    this.texture.draw();

    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.verticesBuffer);
    this.canvas.webgl.vertexAttribPointer(
      this.canvas.shaderProgram.vertexPositionAttribute,
      3,
      this.canvas.webgl.FLOAT,
      false,
      0,
      0);

    this.canvas.setMatrixUniforms();
    this.canvas.webgl.drawArrays(
      this.canvas.webgl.TRIANGLE_STRIP,
      0,
      4);
  }

  move(vector: vec3) {

  }
}
