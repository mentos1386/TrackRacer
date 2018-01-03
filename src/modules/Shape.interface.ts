import { vec3 } from 'gl-matrix';

export default interface Shape {
  render(): void;

  rotate(degree: number): void;

  move(vector: vec3): void;
}
