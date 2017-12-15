// atribute for setting vertex position
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;	// model-view matrix
uniform mat4 uPMatrix;	// projection matrix
void main(void) {
    // calculate the vertex position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}