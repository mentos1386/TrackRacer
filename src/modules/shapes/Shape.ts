import Canvas from '../Canvas';
import Texture from '../Texture';

export abstract class Shape {
  protected verticesBuffer: WebGLBuffer;
  protected texture: Texture;
  protected color = { r: 0, g: 0, b: 0 };

  constructor(
    protected canvas: Canvas,
    protected vertices: Float32Array,
    protected position: number[],
  ) {
    this.verticesBuffer = this.canvas.webgl.createBuffer();
    this.canvas.webgl.bindBuffer(this.canvas.webgl.ARRAY_BUFFER, this.verticesBuffer);
    this.canvas.webgl.bufferData(
      this.canvas.webgl.ARRAY_BUFFER,
      vertices,
      this.canvas.webgl.STATIC_DRAW);
  }

  public setColor(r: number, g: number, b: number) {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
  }

  public setTexture(texture: Texture) {
    this.texture = texture;
  }
}
