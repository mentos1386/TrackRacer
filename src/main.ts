import Canvas from './modules/Canvas';
import 'babel-polyfill';
import './style.css';

import fragmentShader from './shaders/mesh/fragmentShader.fs';
import vertexShader from './shaders/mesh/vertexShader.vs';

import monkeyObj from './objects/monkey.obj';
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
import { forIn, generate, makeVisible, normalizeArray, randomInt } from './utils/misc';
import { debugTick } from './modules/Debug';
import Shape from './modules/Shape.interface';

export default class Main {
  private canvas: Canvas;
  private camera: Camera;
  private ground: MeshShape;
  private monkey: MeshShape;
  private colidableShapes: MeshShape[] = [];
  private notColidableShapes: MeshShape[] = [];

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

    const trees = [
      {
        mesh: treeSmallObj,
        scale: vec3.fromValues(5, 5, 5),
      },
      {
        mesh: treeSmallObj,
        scale: vec3.fromValues(6, 6, 6),
      },
      {
        mesh: treeBigObj,
        scale: vec3.fromValues(10, 10, 10),
      },
      {
        mesh: treeBigObj,
        scale: vec3.fromValues(7, 7, 7),
      },
    ];
    forIn(200, () => this.colidableShapes.push(generate(
      -100,
      100,
      trees,
      shader,
      this.canvas,
    )));

    const trunks = [
      {
        mesh: trunkObj,
        scale: vec3.fromValues(1.5, 1.5, 1.5),
      },
      {
        mesh: trunkObj,
        scale: vec3.fromValues(1, 1, 1),
      },
    ];
    forIn(50, () => this.colidableShapes.push(generate(
      -100,
      100,
      trunks,
      shader,
      this.canvas,
    )));

    const shrubs = [
      {
        mesh: shrubObj,
        scale: vec3.fromValues(1.25, 1.25, 1.25),
      },
      {
        mesh: shrubObj,
        scale: vec3.fromValues(1, 1, 1),
      },
      {
        mesh: shrubObj,
        scale: vec3.fromValues(0.75, 0.75, 0.75),
      },
    ];
    forIn(1000, () => this.notColidableShapes.push(generate(
      -100,
      100,
      shrubs,
      shader,
      this.canvas,
    )));


    this.ground = new MeshShape(this.canvas, shader, worldObj, vec3.fromValues(0, 0, 0));
    this.monkey = new MeshShape(
      this.canvas,
      shader,
      monkeyObj,
      vec3.fromValues(randomInt(-100, 100), 2, randomInt(-100, 100)),
    );

    this.camera = new Camera(this.canvas);

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');

    debugTick(elapsed);

    // Clear
    this.canvas.clear();

    // let hit = false;
    // Check if we hit something
    // this.colidableShapes.forEach((shape) => {
    //   if (!hit) hit = shape.detHit(this.camera.x, this.camera.z);
    // });

    // Move camera
    // if (hit) this.camera.speed = 0;

    // Render camera
    this.camera.move(elapsed);
    // Render ground
    this.ground.render();
    // Render monkey
    this.monkey.render();

    // Render other things
    this.colidableShapes.forEach(shape => shape.render());
    this.notColidableShapes.forEach(shape => shape.render());

    if (!this.monkey.detHit(this.camera.x, this.camera.z)) {
      window.requestAnimationFrame(elapsed => this.draw(elapsed));
    } else {
      // END GAME
      console.log('END GAME');
      makeVisible('end-screen');
    }
  }
}

new Main();
