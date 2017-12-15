export enum SHADER_TYPE {
  VERTEX_SHADER = 'VERTEX_SHADER',
  FRAGMENT_SHADER = 'FRAGMENT_SHADER',
}

export function createShader(
  webgl: WebGLRenderingContext,
  shaderString: string,
  type: SHADER_TYPE,
): WebGLShader {
  const shader = webgl.createShader(webgl[type]);
  webgl.shaderSource(shader, shaderString);
  webgl.compileShader(shader);

  if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS))
    throw new Error(`Failed creating shader! \nlog: ${webgl.getShaderInfoLog(shader)}`);

  return shader;
}
