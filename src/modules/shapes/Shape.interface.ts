import { vec3 } from 'gl-matrix';

export interface IShape {

  draw(): void;

  move(vector: vec3): void;
}
