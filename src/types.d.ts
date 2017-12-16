declare module '*.glsl';
declare module '*.fs';
declare module '*.vs';

declare module '*.gif';
declare module '*.png';
declare module '*.svg';

declare interface WebGLBufferD extends WebGLBuffer {
  itemSize?: number;
  numItems?: number;
}
