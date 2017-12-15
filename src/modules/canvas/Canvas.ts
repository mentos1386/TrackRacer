export default class Canvas {

  private readonly CANVAS_ID: string;
  private canvas: HTMLCanvasElement;
  private webgl: WebGLRenderingContext;

  constructor(id: string) {
    this.CANVAS_ID = id;
    this.canvas = <HTMLCanvasElement> document.getElementById(this.CANVAS_ID);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initiateWebgl();
  }

  private initiateWebgl() {
    this.webgl = this.canvas.getContext('webgl');

    this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webgl.clearDepth(1.0);
    this.webgl.enable(this.webgl.DEPTH_TEST);
    this.webgl.depthFunc(this.webgl.LEQUAL);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
  }

}
