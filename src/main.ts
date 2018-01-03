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
import { Body, Vec3, Plane, Quaternion } from 'cannon';

export default class Main {
  private canvas: Canvas;
  private car: Car;
  private shapes: MeshShape[] = [];
  private ground: MeshShape;
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

    const exampleBody1 = new Body({
      mass: 1,
      position: new Vec3(0, 3, 0),
    });
    const exampleBody2 = new Body({
      mass: 0,
      position: new Vec3(2, 3, 0),
    });
    this.shapes.push(new MeshShape(this.canvas, shader, exampleBody1, exampleObj));
    this.shapes.push(new MeshShape(this.canvas, shader, exampleBody2, exampleObj));

    const groundBody = new Body({
      mass: 0,
    });
    groundBody.addShape(new Plane());
    groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    this.ground = new MeshShape(this.canvas, shader, groundBody, worldObj);

    const carBody = new Body({
      mass: 1,
      position: new Vec3(2, 20, 0),
    });
    this.car = new Car(
      this.canvas,
      new MeshShape(this.canvas, shader, carBody, cubeObj));

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');
    this.canvas.clear();
    this.canvas.world.step(1 / 60, elapsed / 1000, 3);

    this.car.onKey(this.keyDown, elapsed);

    this.ground.render();

    this.shapes.forEach((shape) => {
      shape.rotate(elapsed / 1000);
      shape.render();
    });

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
