precision mediump float;
// uniform attribute for setting texture coordinates
varying vec2 vTextureCoord;
// uniform attribute for setting 2D sampler
uniform sampler2D uSampler;
// uniform attribute for setting color
uniform vec3 uColor;
void main(void) {
    // sample the fragment color from texture
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = textureColor * vec4(uColor, 1.0); // adapt texture color with custom color
}