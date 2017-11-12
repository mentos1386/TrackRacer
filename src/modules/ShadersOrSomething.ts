import someRealShaderGlsl from '../shaders/someRealShader.glsl';

export default class ShadersOrSomething {

  constructor() {
    this.doStuff();
  }

  private doStuff() {
    console.log('ShadersOrSomehting => Yeey, stuff!');
    console.log(someRealShaderGlsl);
  }

}
