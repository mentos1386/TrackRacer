import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import fragmentShader from './shaders/mesh/fragmentShader.fs';
import vertexShader from './shaders/mesh/vertexShader.vs';

import exampleObj from './objects/example.obj';
import cubeObj from './objects/cube.obj';
import worldObj from './objects/world.obj';
import carObj from './objects/car.obj';
import car2Obj from './objects/car2.obj';
import volksObj from './objects/volks.obj';

import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { MeshShape } from './modules/MeshShape';
import { Camera } from './modules/Camera';
import { Layout } from 'webgl-obj-loader';
import { Body, Vec3, Plane, Trimesh, Box } from 'cannon';

export default class Main {
  private canvas: Canvas;
  private camera: Camera;
  private shapes: MeshShape[] = [];
  private keyDown: string;

  constructor() {
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

    /**
     * Example 1
     */
    /*    const exampleBody1 = new Body({
          mass: 1,
          position: new Vec3(2, 2, 2),
        });
        exampleBody1.addShape(new Trimesh(exampleObj.vertices, exampleObj.indices));
        this.shapes.push(new MeshShape(this.canvas, shader, exampleBody1, exampleObj));*/

    /**
     * Example 2
     */
    /*    const exampleBody2 = new Body({
          mass: 0,
          position: new Vec3(-2, 2, -2),
        });

        exampleBody2.addShape(new Trimesh(cubeObj.vertices, cubeObj.indices));
        this.shapes.push(new MeshShape(this.canvas, shader, exampleBody2, cubeObj));*/

    /**
     * Camera
     */
    const carBody = new Body({
      mass: 10,
      position: new Vec3(0, 5, 0),
      // shape: new Trimesh(volksObj.vertices, volksObj.indices),
      shape: new Box(new Vec3(1, 1, 1)),
    });
    this.camera = new Camera(this.canvas, new MeshShape(this.canvas, shader, carBody, volksObj));


    /**
     * Ground
     */
    const groundBody = new Body({
      mass: 0,
      shape: new Plane(),
    });
    groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    this.shapes.push(new MeshShape(this.canvas, shader, groundBody, worldObj));

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');

    // Clear
    this.canvas.clear();

    // Step physics
    this.canvas.world.step(1 / 60, elapsed, 3);

    // Render camera/car
    this.camera.render(this.keyDown, elapsed);

    // Render other shapes
    this.shapes.forEach(shape => shape.render());

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
