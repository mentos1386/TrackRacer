import { mat4, vec3 } from 'gl-matrix';
import { Shape } from '../Shape';
import Canvas from '../../Canvas';
import { Shader } from '../../Shader';

export class Pyramid extends Shape {

  constructor(
    canvas: Canvas,
    shader: Shader,
    colors: Float32Array,
    position: vec3,
  ) {
    const pyramidVertices = [
      // Front face
      0.0, 1.0, 0.0,
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      // Right face
      0.0, 1.0, 0.0,
      1.0, -1.0, 1.0,
      1.0, -1.0, -1.0,
      // Back face
      0.0, 1.0, 0.0,
      1.0, -1.0, -1.0,
      -1.0, -1.0, -1.0,
      // Left face
      0.0, 1.0, 0.0,
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
    ];

    super(canvas, shader, new Float32Array(pyramidVertices), colors, position);

    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 12;

    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 3;
  }

  draw() {
    mat4.identity(this.modelViewMatrix);
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.position);
    mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.rotation, [1, 1, 1]);
    this.rotation = 0;

    this.shader.use();

    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexPositionBuffer);
    this.canvas.webgl.vertexAttribPointer(
      this.shader.shaderVariables.vertexPositionAttribute,
      this.vertexPositionBuffer.itemSize,
      this.canvas.webgl.FLOAT,
      false,
      0,
      0);

    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexColorBuffer);
    this.canvas.webgl.vertexAttribPointer(
      this.shader.shaderVariables.vertexColorAttribute,
      this.vertexColorBuffer.itemSize,
      this.canvas.webgl.FLOAT,
      false,
      0,
      0);

    // Draw the pyramid.
    this.shader.setMatrixUniforms(this.modelViewMatrix);
    this.canvas.webgl.drawArrays(
      this.canvas.webgl.TRIANGLES,
      0,
      this.vertexPositionBuffer.numItems);
  }
}
