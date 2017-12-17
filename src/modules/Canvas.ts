import { mat4 } from 'gl-matrix';

export default class Canvas {

  public readonly CANVAS_ID: string;
  public canvas: HTMLCanvasElement;
  public webgl: WebGLRenderingContext;
  public projectionMatrix: mat4;
  public modelViewMatrix: mat4;
  private modelViewMatrixes: mat4[];

  constructor(id: string) {
    this.CANVAS_ID = id;
    this.canvas = <HTMLCanvasElement> document.getElementById(this.CANVAS_ID);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initiateWebgl();
    this.setProjection();
  }

  /**
   * Add new identity to stack
   */
  mvPush() {
    this.modelViewMatrixes.push(this.modelViewMatrix);
  }

  /**
   * Remove top matrix from stack
   */
  mvPop() {
    this.modelViewMatrix = this.modelViewMatrixes.pop();
  }

  /**
   * Prepare canvas for drawing
   */
  public clear(): void {
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    this.setProjection();
    this.setModelView();
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

  private setProjection() {
    this.projectionMatrix = mat4.create();
    mat4.perspective(this.projectionMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 1000);
  }

  private setModelView() {
    this.modelViewMatrix = mat4.identity(mat4.create());
    this.modelViewMatrixes = [];
  }
}
