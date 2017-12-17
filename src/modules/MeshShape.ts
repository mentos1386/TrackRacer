import Canvas from './Canvas';
import { Shader } from './Shader';
import { mat4, vec3 } from 'gl-matrix';

export class MeshShape {
  protected normalBuffer: WebGLBufferD;
  protected textureBuffer: WebGLBufferD;
  protected indexBuffer: WebGLBufferD;
  protected vertexBuffer: WebGLBufferD;

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
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      new Float32Array(mesh.vertices),
      this.canvas.webgl.STATIC_DRAW);

    /**
     * Index
     */
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(mesh.indices),
      this.canvas.webgl.STATIC_DRAW);
  }

  render() {
    this.shader.use();

    this.canvas.mvPush();
    mat4.translate(this.canvas.modelViewMatrix, this.canvas.modelViewMatrix, this.position);
    console.log(this.canvas.modelViewMatrix);

    // it's possible that the mesh doesn't contain
    // any texture coordinates (e.g. suzanne.obj in the development branch).
    // in this case, the texture vertexAttribArray will need to be disabled
    // before the call to drawElements
    if (this.shader.variables.textureCoordAttribute === -1) {
      //  console.warn('Shader doesn\'t support textures?');
    } else if (!this.textureBuffer.numItems) {
      this.canvas.webgl.disableVertexAttribArray(this.shader.variables.textureCoordAttribute);
    } else {
      // if the texture vertexAttribArray has been previously
      // disabled, then it needs to be re-enabled
      this.canvas.webgl.enableVertexAttribArray(this.shader.variables.textureCoordAttribute);
      this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.textureBuffer);
      this.canvas.webgl.vertexAttribPointer(
        this.shader.variables.textureCoordAttribute,
        this.textureBuffer.itemSize,
        this.canvas.webgl.FLOAT,
        false,
        0,
        0);
    }

    /**
     * Normal
     */
    if (this.shader.variables.vertexNormalAttribute !== -1) {
      this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.normalBuffer);
      this.canvas.webgl.vertexAttribPointer(
        this.shader.variables.vertexNormalAttribute,
        this.normalBuffer.itemSize,
        this.canvas.webgl.FLOAT,
        false,
        0,
        0);
    }

    /**
     * Vertex
     */
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.canvas.webgl.vertexAttribPointer(
      this.shader.variables.vertexPositionAttribute,
      this.vertexBuffer.itemSize,
      this.canvas.webgl.FLOAT,
      false,
      0,
      0);

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
