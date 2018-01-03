import Canvas from './Canvas';
import { Shader } from './Shader';
import { mat4, vec3 } from 'gl-matrix';
import { Layout } from 'webgl-obj-loader';
import Shape from './Shape.interface';

export class MeshShape implements Shape {
  protected normalBuffer: WebGLBufferD;
  protected textureBuffer: WebGLBufferD;
  protected indexBuffer: WebGLBufferD;
  protected vertexBuffer: WebGLBufferD;
  protected rotation = 0;

  constructor(
    protected canvas: Canvas,
    protected shader: Shader,
    protected position: vec3,
    protected mesh: Mesh,
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
    console.log(vertexData);
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

  move(vector: vec3): void {
    this.position = vector;
  }

  render() {
    this.shader.use();

    this.canvas.mvPush();
    mat4.rotate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, this.rotation, [0, 1, 0]);
    mat4.translate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, this.position);

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

  rotate(degree: number) {
    this.rotation = degree;
  }

}
