import Canvas from './Canvas';
import { Shader } from './Shader';
import { mat4, quat, vec3 } from 'gl-matrix';
import Shape from './Shape.interface';
import { degToRad } from '../utils/math';

export class MeshShape implements Shape {
  private normalBuffer: WebGLBufferD;
  private textureBuffer: WebGLBufferD;
  private indexBuffer: WebGLBufferD;
  private vertexBuffer: WebGLBufferD;

  constructor(
    private canvas: Canvas,
    private shader: Shader,
    private mesh: Mesh,
    public position: vec3,
    public axis: vec3 = vec3.fromValues(1, 0, 0),
    public angle: number = 0,
  ) {

    this.normalBuffer = this.canvas.webgl.createBuffer();
    this.normalBuffer.numItems = mesh.vertexNormals.length;
    this.normalBuffer.itemSize = 3;

    this.textureBuffer = this.canvas.webgl.createBuffer();
    this.textureBuffer.numItems = mesh.textures.length;
    this.textureBuffer.itemSize = 2;

    this.indexBuffer = this.canvas.webgl.createBuffer();
    this.indexBuffer.numItems = mesh.indices.length;
    this.indexBuffer.itemSize = 1;

    this.vertexBuffer = this.canvas.webgl.createBuffer();
    this.vertexBuffer.numItems = mesh.vertices.length;
    this.vertexBuffer.itemSize = 3;

    /**
     * Normals
     */
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.normalBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      new Float32Array(mesh.vertexNormals),
      this.canvas.webgl.STATIC_DRAW);

    /**
     * Textures
     */
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.textureBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      new Float32Array(mesh.textures),
      this.canvas.webgl.STATIC_DRAW);

    /**
     * Vertex
     */
    const vertexData = this.shader.makeVertexBufferData(this.mesh);
    this.vertexBuffer.numItems = vertexData.numItems;
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      vertexData,
      this.canvas.webgl.STATIC_DRAW);

    /**
     * Index
     */
    const indexData = this.shader.makeIndexBufferData(this.mesh);
    this.indexBuffer.numItems = indexData.numItems;
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ELEMENT_ARRAY_BUFFER,
      indexData,
      this.canvas.webgl.STATIC_DRAW);
  }

  render() {
    this.shader.use();

    this.canvas.mvPush();

    // Position
    mat4.translate(
      this.canvas.modelViewMatrix,
      this.canvas.modelViewMatrix,
      this.position);

    // Rotate
    mat4.rotate(
      this.canvas.modelViewMatrix,
      this.canvas.modelViewMatrix,
      degToRad(this.angle),
      this.axis);


    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.shader.setVariables();

    /**
     * Index
     */
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.shader.setMatrixUniforms();
    this.canvas.webgl.drawElements(
      this.canvas.webgl.TRIANGLES,
      this.indexBuffer.numItems,
      this.canvas.webgl.UNSIGNED_SHORT,
      0);

    this.canvas.mvPop();
  }

}
