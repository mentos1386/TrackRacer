import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import fragmentShader from './shaders/fragmentShader.fs';
import vertexShader from './shaders/vertexShader.vs';

import exampleObj from './objects/example.obj';

import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { MeshShape } from './modules/MeshShape';
import { Camera } from './modules/Camera';

export default class Main {
  private canvas: Canvas;
  private camera: Camera;
  private shapes: MeshShape[] = [];
  private keyDown: string;

  constructor() {
    console.log(exampleObj);

    // Create canvas
    this.canvas = new Canvas('gameCanvas');
    this.camera = new Camera(this.canvas);

    window.addEventListener('keydown', ({ key }) => this.keyDown = key);
    window.addEventListener('keyup', () => this.keyDown = null);

    this.init().catch(console.error);
  }

  private async init() {
    const shader = new Shader(this.canvas, vertexShader, fragmentShader);

    this.shapes.push(new MeshShape(this.canvas, shader, vec3.fromValues(0, 0, -2), exampleObj));

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');
    this.canvas.clear();
    this.camera.onKey(this.keyDown, elapsed);

    this.shapes.forEach((shape) => {
      // shape.rotate(elapsed / 1000);
      shape.render();
    });

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
