import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import * as StarUrl from '../assets/star.gif';

import { Cube } from './modules/shapes/3d/Cube';
import Texture from './modules/Texture';

export default class Main {
  private canvas: Canvas;
  private cube: Cube;

  constructor() {
    // Create canvas
    this.canvas = new Canvas('gameCanvas');

    this.init().catch(console.error);
  }

  private async init() {

    const textureCoordinates = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ]);
    const cubeTexture = new Texture(this.canvas, StarUrl, textureCoordinates);
    await cubeTexture.load();

    const cubeVertices = new Float32Array([
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
    ]);
    this.cube = new Cube(this.canvas, cubeVertices, [-1.5, 0.0, -7.0]);
    this.cube.setTexture(cubeTexture);
    this.cube.setColor(0, 125, 255);

    window.requestAnimationFrame(() => this.draw());
  }

  private draw() {
    console.log('Drawing');
    this.canvas.clear();
    this.cube.draw();

    window.requestAnimationFrame(() => this.draw());
  }
}

new Main();
