// atributes for setting vertex position and texture coordinates
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uMVMatrix;	// model-view matrix
uniform mat4 uPMatrix;	// projection matrix
// variable for passing texture coordinates
// from vertex shader to fragment shader
varying vec2 vTextureCoord;
void main(void) {
    // calculate the vertex position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
}
