import { MeshShape } from '../modules/MeshShape';
import { Shader } from '../modules/Shader';
import Shape from '../modules/Shape.interface';
import { vec3 } from 'gl-matrix';
import Canvas from '../modules/Canvas';

export function degToRad(degrees: number) {
  return degrees * Math.PI / 180;
}

export function normalizeArray(array: number[], maxNew = 1, minNew = -1) {
  const max = Math.max(...array);
  const min = Math.min(...array);
  const c = (maxNew - minNew) / (max - min);

  return array.map((i) => {
    return c * ((i - max) + max);
  });
}


export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function forIn(num: number, fun: (i: number) => void) {
  for (let i = 0; i < num; i += 1) fun(i);
}

export function generate(
  from: number,
  to: number,
  elements: { mesh: Mesh, scale: vec3 }[],
  shader: Shader,
  canvas: Canvas,
) {
  const x = randomInt(from, to);
  const z = randomInt(from, to);

  const elementIndex = randomInt(0, elements.length - 1);
  const element = elements[elementIndex];

  return new MeshShape(
    canvas,
    shader,
    element.mesh,
    vec3.fromValues(x, 0, z),
    true,
    element.scale,
    vec3.fromValues(0, 1, 0),
    randomInt(0, 180),
  );
}

export function makeVisible(id: string) {
  document.getElementById(id).className += ' visible';
}
