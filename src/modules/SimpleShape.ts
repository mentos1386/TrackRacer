import { mat4, vec3 } from 'gl-matrix';
import Shape from './Shape.interface';
import { Shader } from './Shader';
import Canvas from './Canvas';

export abstract class SimpleShape implements Shape {
  protected rotation = 0;
  protected vertexPositionBuffer: WebGLBufferD;
  protected vertexColorBuffer: WebGLBufferD;
  protected vertexIndexBuffer?: WebGLBufferD;
  protected modelViewMatrix: mat4;

  constructor(
    protected canvas: Canvas,
    protected shader: Shader,
    protected vertices: Float32Array,
    protected colors: Float32Array,
    protected position: vec3,
    protected indices?: Uint16Array,
  ) {
    this.vertexPositionBuffer = this.canvas.webgl.createBuffer();
    this.vertexColorBuffer = this.canvas.webgl.createBuffer();
    this.vertexIndexBuffer = this.canvas.webgl.createBuffer();

    this.modelViewMatrix = mat4.create();
    mat4.identity(this.modelViewMatrix);

    // Vertex position
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexPositionBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      this.vertices,
      this.canvas.webgl.STATIC_DRAW);

    // Vertex color
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexColorBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      this.colors,
      this.canvas.webgl.STATIC_DRAW);

    if (this.indices) {
      // Vertex indices
      this.canvas.webgl.bindBuffer(this.canvas.webgl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
      this.canvas.webgl.bufferData(
        this.canvas.webgl.ELEMENT_ARRAY_BUFFER,
        this.indices,
        this.canvas.webgl.STATIC_DRAW);
    }
  }

  render(): void {
    throw new Error('Method not implemented.');
  }

  setColor(colors: number[][]) {
    this.colors = new Float32Array(colors.reduce((all, face) => [...all, ...face], []));
  }

  rotate(degree: number) {
    this.rotation += degree;
  }

  move(vector: vec3) {
    this.position = vector;
  }
}
