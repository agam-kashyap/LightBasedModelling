const fragmentShaderSrc = `
    precision mediump float;
    // uniform vec4 uColor;
    varying vec3 vNormal;

    uniform vec3 uReverseLightDirection;
    uniform vec4 uColor;

    void main () {
        vec3 normal = normalize(vNormal);

        float light = dot(normal, uReverseLightDirection);
        gl_FragColor = uColor;
        
        // For now multiplying only the rgb values with the light value
        gl_FragColor.rgb *= light;
    }
`;

export default fragmentShaderSrc;