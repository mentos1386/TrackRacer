attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec3 aDiffuse;
attribute vec3 aSpecular;
attribute float aSpecularExponent;
attribute vec3 aColor;

uniform mat4 uMVMatrix; // Model view matrix
uniform mat4 uVMatrix;  // View matrix
uniform mat4 uPMatrix;  // Projection matrix
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

varying vec3 vDiffuse;
varying vec3 vSpecular;
varying float vSpecularExponent;

void main() {
    vDiffuse = aDiffuse;
    vSpecular = aSpecular;
    vSpecularExponent = aSpecularExponent;

    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * uVMatrix * vPosition; // projection * view * model view * position
    vTextureCoord = aTextureCoord;
    vTransformedNormal = uNMatrix * aVertexNormal;
}