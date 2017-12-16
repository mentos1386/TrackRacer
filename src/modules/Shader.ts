import Canvas from './Canvas';
import { createShader, SHADER_TYPE } from '../utils/shaders';
import { mat4 } from 'gl-matrix';

export class Shader {
  public shaderVariables: {
    vertexPositionAttribute?: number,
    vertexColorAttribute?: number,
    mvMatrixUniform?: WebGLUniformLocation,
    pMatrixUniform?: WebGLUniformLocation,
  } = {};
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;

  constructor(
    protected canvas: Canvas,
    protected vertexShaderString: string,
    protected fragmentShaderString: string,
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
    this.canvas.webgl.attachShader(this.program, this.fragmentShader);
    this.canvas.webgl.attachShader(this.program, this.vertexShader);

    this.canvas.webgl.linkProgram(this.program);

    if (!this.canvas.webgl.getProgramParameter(this.program, this.canvas.webgl.LINK_STATUS))
      throw new Error(`Failed to link shader program!
      log: ${this.canvas.webgl.getProgramInfoLog(this.program)}`);

    this.canvas.webgl.useProgram(this.program);

    this.initVariables();
  }

  /**
   * Set the uniform values in shaders for model-view and projection matrix.
   */
  public setMatrixUniforms(modelViewMatrix: mat4) {
    this.canvas.webgl.uniformMatrix4fv(
      this.shaderVariables.pMatrixUniform,
      false,
      this.canvas.projectionMatrix);
    this.canvas.webgl.uniformMatrix4fv(
      this.shaderVariables.mvMatrixUniform,
      false,
      modelViewMatrix);
  }

  public use() {
    this.canvas.webgl.useProgram(this.program);
  }

  private initVariables() {
    // store location of aVertexPosition variable defined in shader
    this.shaderVariables.vertexPositionAttribute = this.canvas.webgl.getAttribLocation(
      this.program,
      'aVertexPosition');

    // turn on vertex position attribute at specified position
    this.canvas.webgl.enableVertexAttribArray(this.shaderVariables.vertexPositionAttribute);

    // store location of aVertexColor variable defined in shader
    this.shaderVariables.vertexColorAttribute = this.canvas.webgl.getAttribLocation(
      this.program,
      'aVertexColor');

    // turn on vertex color attribute at specified position
    this.canvas.webgl.enableVertexAttribArray(this.shaderVariables.vertexColorAttribute);

    // store location of uPMatrix variable defined in shader - projection matrix 
    this.shaderVariables.pMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uPMatrix');

    // store location of uMVMatrix variable defined in shader - model-view matrix 
    this.shaderVariables.mvMatrixUniform = this.canvas.webgl.getUniformLocation(
      this.program,
      'uMVMatrix');
  }
}
