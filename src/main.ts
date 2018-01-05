import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import fragmentShader from './shaders/mesh/fragmentShader.fs';
import vertexShader from './shaders/mesh/vertexShader.vs';

import exampleObj from './objects/example.obj';
import cubeObj from './objects/cube.obj';
import worldObj from './objects/world.obj';
import volksObj from './objects/volks.obj';

import treeSmallObj from './objects/treeSmall.obj';
import treeSmallSnowObj from './objects/treeSmallSnow.obj';
import treeBigObj from './objects/treeBig.obj';
import shrubObj from './objects/shrub.obj';
import trunkObj from './objects/trunk.obj';

import { Shader } from './modules/Shader';
import { vec3 } from 'gl-matrix';
import { MeshShape } from './modules/MeshShape';
import { Camera } from './modules/Camera';
import { Layout } from 'webgl-obj-loader';
import { normalizeArray, randomInt } from './utils/math';

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


    const elements = [
      {
        mesh: treeSmallObj,
        scale: vec3.fromValues(5, 5, 5),
      },
      {
        mesh: treeBigObj,
        scale: vec3.fromValues(10, 10, 10),
      },
      {
        mesh: shrubObj,
        scale: vec3.fromValues(2, 2, 2),
      },
      {
        mesh: trunkObj,
        scale: vec3.fromValues(2, 2, 2),
      },
    ];

    for (let i = 0; i < 40; i += 1) {
      const x = randomInt(-100, 100);
      const z = randomInt(-100, 100);

      const elementIndex = randomInt(0, elements.length - 1);
      const element = elements[elementIndex];

      this.shapes.push(new MeshShape(
        this.canvas,
        shader,
        element.mesh,
        vec3.fromValues(x, 0, z),
        true,
        element.scale,
      ));
    }

    /**
     * Ground
     */
    this.shapes.push(new MeshShape(this.canvas, shader, worldObj, vec3.fromValues(0, 0, 0)));

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
