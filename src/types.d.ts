interface Mesh {
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

  makeBufferData(layout: Layout): ArrayBufferD;

  makeIndexBufferData(layout: Layout): ArrayBufferD;
}

interface ArrayBufferD extends ArrayBuffer {
  numItems: number;
}

interface Layout {
  POSITION: Attribute;
  NORMAL: Attribute;
  TANGENT: Attribute;
  BITANGENT: Attribute;
  UV: Attribute;
  MATERIAL_INDEX: Attribute;
  MATERIAL_ENABLED: Attribute;
  AMBIENT: Attribute;
  DIFFUSE: Attribute;
  SPECULAR: Attribute;
  SPECULAR_EXPONENT: Attribute;
  EMISSIVE: Attribute;
  TRANSMISSION_FILTER: Attribute;
  DISSOLVE: Attribute;
  ILLUMINATION: Attribute;
  REFRACTION_INDEX: Attribute;
  SHARPNESS: Attribute;
  MAP_DIFFUSE: Attribute;
  MAP_AMBIENT: Attribute;
  MAP_SPECULAR: Attribute;
  MAP_SPECULAR_EXPONENT: Attribute;
  MAP_DISSOLVE: Attribute;
  ANTI_ALIASING: Attribute;
  MAP_BUMP: Attribute;
  MAP_DISPLACEMENT: Attribute;
  MAP_DECAL: Attribute;
  MAP_EMISSIVE: Attribute;
}

interface Attribute {
  key: string;
  size: 1 | 2 | 3 | 4;
  type: 'BYTE' | 'SHORT' | 'UNSIGNED_BYTE' | 'UNSIGNED_SHORT' | 'FLOAT';
  normalized: boolean;

  // Not on class, but added in layout!
  offset: number;
  stride: number;
}

declare module 'webgl-obj-loader';

declare module '*.glsl';
declare module '*.fs';
declare module '*.vs';

declare module '*.gif';
declare module '*.png';
declare module '*.svg';

declare module '*.obj' {
  const mesh: Mesh;
  export default mesh;
}

declare interface WebGLBufferD extends WebGLBuffer {
  itemSize?: number;
  numItems?: number;
  layout?: Layout;
}
