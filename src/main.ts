import Canvas from './modules/canvas/Canvas';
import './style.css';

import { Triangle } from './modules/shapes/Triangle';
import { mat3 } from 'gl-matrix';

export default class Main {
  private canvas: Canvas;

  constructor() {
    // Create canvas
    this.canvas = new Canvas('gameCanvas');

    const triangle = new Triangle(this.canvas, mat3.fromValues(
      0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
    ));

    this.canvas.clear();
    triangle.draw();
  }
}

new Main();
