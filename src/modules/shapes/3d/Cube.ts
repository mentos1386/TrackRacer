import { IShape } from '../Shape.interface';
import { mat4, vec3 } from 'gl-matrix';
import { Shape } from '../Shape';
import Canvas from '../../Canvas';
import { Shader } from '../../Shader';
import { degToRad } from '../../../utils/math';

export class Cube extends Shape implements IShape {

  constructor(
    canvas: Canvas,
    shader: Shader,
    vertices: Float32Array,
    colors: Float32Array,
  ) {
    const cubeVertexIndices = [
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11,  // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23,  // Left face
    ];

    super(canvas, shader, vertices, colors, new Uint16Array(cubeVertexIndices));

    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 24;

    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 24;

    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;
  }

  draw() {
    mat4.identity(this.modelViewMatrix);
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [3.0, 0.0, -15.0]);
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

    this.canvas.webgl.bindBuffer(this.canvas.webgl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    // Draw the cube.
    this.shader.setMatrixUniforms(this.modelViewMatrix);
    this.canvas.webgl.drawElements(
      this.canvas.webgl.TRIANGLES,
      this.vertexIndexBuffer.numItems,
      this.canvas.webgl.UNSIGNED_SHORT,
      0);
  }

  rotate(rotation: number) {
    this.rotation = rotation;
  }

  move(vector: vec3) {

  }
}
