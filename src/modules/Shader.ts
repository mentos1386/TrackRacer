import Canvas from './Canvas';
import { createShader, SHADER_TYPE } from '../utils/shaders';
import { mat3, mat4 } from 'gl-matrix';
import { Layout } from 'webgl-obj-loader';

export class Shader {
  public variables: {
    vertexPositionAttribute?: number,
    textureCoordAttribute?: number,
    vertexNormalAttribute?: number,
    mvMatrixUniform?: WebGLUniformLocation,
    pMatrixUniform?: WebGLUniformLocation,
    nMatrixUniform?: WebGLUniformLocation,
  } = {};
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;

  constructor(
    private canvas: Canvas,
    private vertexShaderString: string,
    private fragmentShaderString: string,
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
   * Set the uniform values in shaders for model-view and projection matrix.
   */
  public setMatrixUniforms() {
    this.canvas.webgl.uniformMatrix4fv(
      this.variables.pMatrixUniform,
      false,
      this.canvas.projectionMatrix);

    this.canvas.webgl.uniformMatrix4fv(
      this.variables.mvMatrixUniform,
      false,
      this.canvas.modelViewMatrix);

    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, this.canvas.modelViewMatrix);

    this.canvas.webgl.uniformMatrix3fv(
      this.variables.nMatrixUniform,
      false,
      normalMatrix);
  }

  public use() {
    this.canvas.webgl.useProgram(this.program);
  }

  private initVariables() {

    /**
     * vertexPositionAttribute
     */
    this.variables.vertexPositionAttribute = this.canvas.webgl.getAttribLocation(
      this.program,
      'aVertexPosition');
    this.canvas.webgl.enableVertexAttribArray(this.variables.vertexPositionAttribute);

    /**
     * vertexNormalAttribute
     */
    this.variables.vertexNormalAttribute = this.canvas.webgl.getAttribLocation(
      this.program,
      'aVertexNormal');
    if (this.variables.vertexNormalAttribute !== -1)
      this.canvas.webgl.enableVertexAttribArray(this.variables.vertexNormalAttribute);

    /**
     * textureCoordAttribute
     */
    this.variables.textureCoordAttribute = this.canvas.webgl.getAttribLocation(
      this.program,
      'aTextureCoord');
    if (this.variables.textureCoordAttribute !== -1)
      this.canvas.webgl.enableVertexAttribArray(this.variables.textureCoordAttribute);

  }

  private initUniformVariables() {

    // store location of uPMatrix variable defined in shader - projection matrix 
    this.variables.pMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uPMatrix');

    // store location of uMVMatrix variable defined in shader - model-view matrix 
    this.variables.mvMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uMVMatrix');

    // store location of uNVMatrix variable defined in shader - normal ? matrix
    this.variables.nMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uNMatrix');
  }
}
