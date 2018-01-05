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
import { Body, Vec3, Plane, Material, Box, ContactMaterial, Sphere, RigidVehicle } from 'cannon';

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
     * Materials
     */
    const groundMaterial = new Material('groundMaterial');
    const wheelMaterial = new Material('wheelMaterial');

    const wheelGroundContactMaterial = new ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000,
    });
    this.canvas.world.addContactMaterial(wheelGroundContactMaterial);

    /**
     * Ground
     */
    const groundBody = new Body({
      mass: 0,
      shape: new Plane(),
      material: groundMaterial,
    });

    groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    this.shapes.push(new MeshShape(this.canvas, shader, groundBody, worldObj));

    /**
     * Camera
     */
    const centerOfMassAdjust = new Vec3(0, 1, 0);
    const chassisShape = new Box(new Vec3(5, 0.5, 2));
    const chassisBody = new Body({
      mass: 1,
    });
    chassisBody.addShape(chassisShape, centerOfMassAdjust);
    const axisWidth = 7;
    const wheelShape = new Sphere(1.5);
    const down = new Vec3(0, -1, 0);

    const vehicle = new RigidVehicle({ chassisBody });

    const wheelBody1 = new Body({ mass: 1, material: wheelMaterial });
    wheelBody1.addShape(wheelShape);
    vehicle.addWheel({
      body: wheelBody1,
      position: new Vec3(5, axisWidth / 2, 0).vadd(centerOfMassAdjust),
      axis: new Vec3(1, 0, 0),
      direction: down,
    });
    const wheelBody2 = new Body({ mass: 1, material: wheelMaterial });
    wheelBody2.addShape(wheelShape);
    vehicle.addWheel({
      body: wheelBody2,
      position: new Vec3(5, -axisWidth / 2, 0).vadd(centerOfMassAdjust),
      axis: new Vec3(-1, 0, 0),
      direction: down,
    });
    const wheelBody3 = new Body({ mass: 1, material: wheelMaterial });
    wheelBody3.addShape(wheelShape);
    vehicle.addWheel({
      body: wheelBody3,
      position: new Vec3(-5, axisWidth / 2, 0).vadd(centerOfMassAdjust),
      axis: new Vec3(1, 0, 0),
      direction: down,
    });
    const wheelBody4 = new Body({ mass: 1, material: wheelMaterial });
    wheelBody4.addShape(wheelShape);
    vehicle.addWheel({
      body: wheelBody4,
      position: new Vec3(-5, -axisWidth / 2, 0).vadd(centerOfMassAdjust),
      axis: new Vec3(-1, 0, 0),
      direction: down,
    });
    // Some damping to not spin wheels too fast
    vehicle.wheelBodies.forEach(wheel => wheel.angularDamping = 0.4);

    this.camera = new Camera(
      this.canvas,
      new MeshShape(this.canvas, shader, chassisBody, volksObj),
      vehicle);

    vehicle.addToWorld(this.canvas.world);

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }

  private draw(elapsed: number) {
    console.log('Drawing');

    // Clear
    this.canvas.clear();

    // Step physics
    this.canvas.world.step(1 / 60, elapsed, 3);

    // Render camera/car
    this.camera.render(elapsed);

    // Render other shapes
    this.shapes.forEach(shape => shape.render());

    window.requestAnimationFrame(elapsed => this.draw(elapsed));
  }
}

new Main();
