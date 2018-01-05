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
import treeObj from './objects/tree.obj';
import tree2Obj from './objects/tree2.obj';

import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { MeshShape } from './modules/MeshShape';
import { Camera } from './modules/Camera';
import { Layout } from 'webgl-obj-loader';

export default class Main {
  private canvas: Canvas;
  private camera: Camera;
  private shapes: MeshShape[] = [];

  constructor() {
    // Create canvas
    this.canvas = new Canvas('gameCanvas');

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
    this.shapes.push(new MeshShape(this.canvas, shader, exampleObj, vec3.fromValues(0, 2, 0)));

    /**
     * Example 2
     */
    this.shapes.push(new MeshShape(this.canvas, shader, cubeObj, vec3.fromValues(0, 2, 0)));


    this.shapes.push(new MeshShape(
      this.canvas,
      shader,
      tree2Obj,
      vec3.fromValues(0, 2, 5),
      true));

    /**
     * Ground
     */
    this.shapes.push(new MeshShape(this.canvas, shader, worldObj, vec3.fromValues(0, 2, 0)));

    this.camera = new Camera(this.canvas);

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');

    // Clear
    this.canvas.clear();

    // Render camera/car
    this.camera.move(elapsed);

    // Render other shapes
    this.shapes.forEach(shape => shape.render());

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
