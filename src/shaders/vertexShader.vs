// atributes for setting vertex position and color
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uMVMatrix;	// model-view matrix
uniform mat4 uPMatrix;	// projection matrix
// variable for passing color from vertex shader to fragment shader
varying vec4 vColor;
void main(void) {
    // calculate the vertex position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}