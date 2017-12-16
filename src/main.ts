import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import * as StarUrl from '../assets/star.gif';
import fragmentShader from './shaders/fragmentShader.fs';
import vertexShader from './shaders/vertexShader.vs';

import { Cube } from './modules/shapes/3d/Cube';
import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { Shape } from './modules/shapes/Shape';
import { Pyramid } from './modules/shapes/3d/Pyramid';

export default class Main {
  private canvas: Canvas;
  private shapes: Shape[] = [];

  constructor() {
    // Create canvas
    this.canvas = new Canvas('gameCanvas');

    this.init().catch(console.error);
  }

  private async init() {
    const shader = new Shader(this.canvas, vertexShader, fragmentShader);

    const cubeColor = new Float32Array([
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0],  // Left face
    ].reduce((all, face) => [...all, ...face, ...face, ...face, ...face], []));

    const pyramidColor = new Float32Array([
      // Front face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      // Right face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      // Back face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      // Left face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
    ]);

    for (let i = 0; i < 10; i += 1) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);

      if (Math.random() < 0.5) x = -x;
      if (Math.random() < 0.5) y = -y;

      const position = vec3.fromValues(x, y, -30);
      if (Math.random() < 0.5)
        this.shapes.push(new Cube(this.canvas, shader, cubeColor, position));
      else
        this.shapes.push(new Pyramid(this.canvas, shader, pyramidColor, position));
    }

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');
    this.canvas.clear();

    this.shapes.forEach((shape) => {
      shape.rotate(elapsed / 1000);
      shape.draw();
    });

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
