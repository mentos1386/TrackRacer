import Canvas from './Canvas';
import { createShader, SHADER_TYPE } from '../utils/shaders';
import { mat3, mat4 } from 'gl-matrix';
import { Layout } from 'webgl-obj-loader';

export class Shader {
  private variables: { [key: string]: number } = {};
  private mvMatrixUniform?: WebGLUniformLocation;
  private vMatrixUniform?: WebGLUniformLocation;
  private pMatrixUniform?: WebGLUniformLocation;
  private nMatrixUniform?: WebGLUniformLocation;
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;

  constructor(
    private canvas: Canvas,
    private vertexShaderString: string,
    private fragmentShaderString: string,
    private layout: Layout,
    private attributes: { [name: string]: Attribute },
  ) {
    this.vertexShader = createShader(
      this.canvas.webgl,
      vertexShaderString,
      SHADER_TYPE.VERTEX_SHADER);

    this.fragmentShader = createShader(
      this.canvas.webgl,
      fragmentShaderString,
      SHADER_TYPE.FRAGMENT_SHADER);

    this.program = this.canvas.webgl.createProgram();
    this.canvas.webgl.attachShader(this.program, this.vertexShader);
    this.canvas.webgl.attachShader(this.program, this.fragmentShader);

    this.canvas.webgl.linkProgram(this.program);

    if (!this.canvas.webgl.getProgramParameter(this.program, this.canvas.webgl.LINK_STATUS))
      throw new Error(`Failed to link shader program!
      log: ${this.canvas.webgl.getProgramInfoLog(this.program)}`);

    this.canvas.webgl.useProgram(this.program);

    this.initVariables();
    this.initUniformVariables();
  }

  /**
   * Set the uniform values in shaders for model-view, view and projection matrix.
   */
  public setMatrixUniforms() {
    this.canvas.webgl.uniformMatrix4fv(
      this.pMatrixUniform,
      false,
      this.canvas.projectionMatrix);

    this.canvas.webgl.uniformMatrix4fv(
      this.vMatrixUniform,
      false,
      this.canvas.viewMatrix);

    this.canvas.webgl.uniformMatrix4fv(
      this.mvMatrixUniform,
      false,
      this.canvas.modelViewMatrix);

    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, this.canvas.modelViewMatrix);

    this.canvas.webgl.uniformMatrix3fv(
      this.nMatrixUniform,
      false,
      normalMatrix);
  }

  /**
   * Make WebGL use this shader
   */
  public use() {
    this.canvas.webgl.useProgram(this.program);
  }

  /**
   * Create vertex buffer data
   * @param {Mesh} mesh
   * @returns {ArrayBufferD}
   */
  public makeVertexBufferData(mesh: Mesh): ArrayBufferD {
    return mesh.makeBufferData(this.layout);
  }

  /**
   * Create index buffer data
   * @param {Mesh} mesh
   * @returns {ArrayBufferD}
   */
  public makeIndexBufferData(mesh: Mesh): ArrayBufferD {
    return mesh.makeIndexBufferData(this.layout);
  }

  /**
   * Set variables from mesh
   */
  public setVariables() {
    for (const attributeName in this.attributes) {
      if (!this.attributes.hasOwnProperty(attributeName)) continue;
      if (this.variables[attributeName] === -1) continue;

      const attribute = this.layout[this.attributes[attributeName].key];

      this.canvas.webgl.vertexAttribPointer(
        this.variables[attributeName],
        attribute.size,
        this.canvas.webgl[attribute.type],
        attribute.normalized,
        attribute.stride,
        attribute.offset,
      );
    }
  }

  /**
   * Go through all variables and initialize them
   */
  private initVariables() {
    for (const attributeName in this.attributes) {
      if (!this.attributes.hasOwnProperty(attributeName)) continue;

      this.variables[attributeName] = this.canvas.webgl.getAttribLocation(
        this.program,
        attributeName);
      if (this.variables[attributeName] !== -1)
        this.canvas.webgl.enableVertexAttribArray(this.variables[attributeName]);
      else
        console.warn(
          `Shader attribute ${attributeName} not found in shader.`
          + ` Is it undeclared or unused in the shader code?`,
        );
    }
  }

  private initUniformVariables() {

    // store location of uPMatrix variable defined in shader - projection matrix
    this.pMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uPMatrix');

    // store location of vMatrix variable defined in shader - view matrix
    this.vMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uVMatrix');

    // store location of uMVMatrix variable defined in shader - model-view matrix
    this.mvMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uMVMatrix');

    // store location of uNVMatrix variable defined in shader - normal ? matrix
    this.nMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uNMatrix');
  }
}
