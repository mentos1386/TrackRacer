import { mat4 } from 'gl-matrix';
import { createShader, SHADER_TYPE } from '../utils/shaders';
import vertexShaderString from '../shaders/vertexShader.vs';
import fragmentShaderString from '../shaders/fragmentShader.fs';

export default class Canvas {

  public readonly CANVAS_ID: string;
  public canvas: HTMLCanvasElement;
  public webgl: WebGLRenderingContext;
  public shaderProgram: WebGLProgram | any;
  public projectionMatrix: mat4;
  public modelViewMatrix: mat4;

  constructor(id: string) {
    this.CANVAS_ID = id;
    this.canvas = <HTMLCanvasElement> document.getElementById(this.CANVAS_ID);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initiateWebgl();
    this.initShaders();
    this.setPerspective();
  }

  /**
   * Prepare canvas for drawing
   */
  public clear(): void {
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    this.setPerspective();
  }

  /**
   * Set the uniform values in shaders for model-view and projection matrix.
   */
  public setMatrixUniforms() {
    this.webgl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
    this.webgl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
  }

  /**
   * Create vertex and fragment shader
   */
  private initShaders(): void {

    const vertexShader = createShader(
      this.webgl,
      vertexShaderString,
      SHADER_TYPE.VERTEX_SHADER);

    const fragmentShader = createShader(
      this.webgl,
      fragmentShaderString,
      SHADER_TYPE.FRAGMENT_SHADER);

    this.shaderProgram = this.webgl.createProgram();
    this.webgl.attachShader(this.shaderProgram, vertexShader);
    this.webgl.attachShader(this.shaderProgram, fragmentShader);

    this.webgl.linkProgram(this.shaderProgram);

    if (!this.webgl.getProgramParameter(this.shaderProgram, this.webgl.LINK_STATUS))
      throw new Error(`Failed to link shader program! log: ${this.webgl.getProgramInfoLog(this.shaderProgram)}`);

    this.webgl.useProgram(this.shaderProgram);

    // store location of aVertexPosition variable defined in shader
    this.shaderProgram.vertexPositionAttribute = this.webgl.getAttribLocation(
      this.shaderProgram,
      'aVertexPosition');

    // turn on vertex position attribute at specified position
    this.webgl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    // store location of aVertexNormal variable defined in shader
    this.shaderProgram.textureCoordAttribute = this.webgl.getAttribLocation(
      this.shaderProgram,
      'aTextureCoord');

    // store location of aTextureCoord variable defined in shader
    this.webgl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    // store location of uPMatrix variable defined in shader - projection matrix
    this.shaderProgram.pMatrixUniform = this.webgl.getUniformLocation(
      this.shaderProgram,
      'uPMatrix');

    // store location of uMVMatrix variable defined in shader - model-view matrix
    this.shaderProgram.mvMatrixUniform = this.webgl.getUniformLocation(
      this.shaderProgram,
      'uMVMatrix');

    // store location of uSampler variable defined in shader
    this.shaderProgram.samplerUniform = this.webgl.getUniformLocation(
      this.shaderProgram,
      'uSampler');

    // store location of uColor variable defined in shader
    this.shaderProgram.colorUniform = this.webgl.getUniformLocation(
      this.shaderProgram,
      'uColor');
  }

  private initiateWebgl() {
    this.webgl = this.canvas.getContext('webgl');

    this.webgl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webgl.clearDepth(1.0);
    this.webgl.enable(this.webgl.DEPTH_TEST);
    this.webgl.depthFunc(this.webgl.LEQUAL);
    this.webgl.blendFunc(this.webgl.SRC_ALPHA, this.webgl.ONE);
    this.webgl.enable(this.webgl.BLEND);
  }

  private setPerspective() {
    this.projectionMatrix = mat4.create();
    mat4.perspective(this.projectionMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100);

    this.modelViewMatrix = mat4.create();
    mat4.identity(this.modelViewMatrix);
  }
}
