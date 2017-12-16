import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import * as StarUrl from '../assets/star.gif';
import fragmentShader from './shaders/fragmentShader.fs';
import vertexShader from './shaders/vertexShader.vs';

import { Cube } from './modules/shapes/3d/Cube';
import { Shader } from './modules/Shader';

export default class Main {
  private canvas: Canvas;
  private cube: Cube;

  constructor() {
    // Create canvas
    this.canvas = new Canvas('gameCanvas');

    this.init().catch(console.error);
  }

  private async init() {
    const shader = new Shader(this.canvas, vertexShader, fragmentShader);

    const cubeVertices = new Float32Array([
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
    ]);

    const cubeColor = new Float32Array([
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0],  // Left face
    ].reduce((all, face) => [...all, ...face, ...face, ...face, ...face], []));

    console.log(cubeColor);

    this.cube = new Cube(this.canvas, shader, cubeVertices, cubeColor);

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');
    this.canvas.clear();
    const rotation = this.cube.rotation;

    this.cube.rotate(rotation + (elapsed) / 1000);
    this.cube.draw();

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
