precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec3 vDiffuse;
varying vec3 vSpecular;
varying float vSpecularExponent;

varying vec4 vColor;

void main(void) {
    vec3 vertex = -normalize(vPosition.xyz);
    vec3 lightPosition = normalize(vec3(0.0,3.0,3.0));
    vec3 H = normalize(lightPosition + vertex);
    vec3 normal = normalize(vTransformedNormal);
    vec3 color = vDiffuse * dot(normal, lightPosition) + vSpecular * pow(dot(H, normal), vSpecularExponent);
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vColor;
    // gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
