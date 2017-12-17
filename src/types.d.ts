declare module '*.glsl';
declare module '*.fs';
declare module '*.vs';

declare module '*.gif';
declare module '*.png';
declare module '*.svg';

declare module 'webgl-obj-loader';

declare interface Mesh {
  name: string;
  has_materials: boolean;

  indices: number[];
  vertices: number[];
  textures: number[];

  materials: { [name: string]: number };
  materialsByIndex: { [index: number]: string };
  materialIndices: { [name: string]: number };
  materialNames: string[];

  vertexMaterialIndices: number[];
  vertexNormals: number[];
}

declare module '*.obj' {
  const mesh: Mesh;
  export default mesh;
}

declare module '*.mtl' {
  const mtl: any;
  export default mtl;
}

declare interface WebGLBufferD extends WebGLBuffer {
  itemSize?: number;
  numItems?: number;
}
