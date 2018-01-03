import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import fragmentShader from './shaders/mesh/fragmentShader.fs';
import vertexShader from './shaders/mesh/vertexShader.vs';

import exampleObj from './objects/example.obj';
import cubeObj from './objects/cube.obj';
import worldObj from './objects/world.obj';

import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { MeshShape } from './modules/MeshShape';
import { Car } from './modules/Car';
import { Layout } from 'webgl-obj-loader';

export default class Main {
  private canvas: Canvas;
  private car: Car;
  private shapes: MeshShape[] = [];
  private world: MeshShape;
  private keyDown: string;

  constructor() {
    console.log(exampleObj);

    // Create canvas
    this.canvas = new Canvas('gameCanvas');

    window.addEventListener('keydown', ({ key }) => this.keyDown = key);
    window.addEventListener('keyup', () => this.keyDown = null);

    this.init().catch(console.error);
  }

  private async init() {
    const shader = new Shader(
      this.canvas,
      vertexShader,
      fragmentShader,
      new Layout(
        Layout.POSITION,
        Layout.NORMAL,
        Layout.UV,
        Layout.DIFFUSE,
        Layout.SPECULAR,
        Layout.SPECULAR_EXPONENT),
      {
        aVertexPosition: Layout.POSITION,
        aVertexNormal: Layout.NORMAL,
        aTextureCoord: Layout.UV,
        aDiffuse: Layout.DIFFUSE,
        aSpecular: Layout.SPECULAR,
        aSpecularExponent: Layout.SPECULAR_EXPONENT,
      });

    this.shapes.push(new MeshShape(this.canvas, shader, vec3.fromValues(0, 1, -2), exampleObj));
    this.shapes.push(new MeshShape(this.canvas, shader, vec3.fromValues(2, 1, -2), exampleObj));

    this.world = new MeshShape(this.canvas, shader, vec3.fromValues(0, 0, 0), worldObj);
    this.car = new Car(
      this.canvas,
      new MeshShape(this.canvas, shader, vec3.fromValues(-2, 1, -2), cubeObj));

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');
    this.canvas.clear();

    this.car.onKey(this.keyDown, elapsed);

    this.world.render();

    this.shapes.forEach((shape) => {
      shape.rotate(elapsed / 1000);
      shape.render();
    });

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
