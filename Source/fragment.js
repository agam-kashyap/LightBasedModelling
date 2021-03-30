const fragmentShaderSrc = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;

    uniform vec4 uColor;

    void main () {
        vec3 normal = normalize(vNormal);

        vec3 surfaceToLightDirection = normalize(vSurfaceToLight);

        float light = dot(normal, surfaceToLightDirection);
        gl_FragColor = uColor;
        
        // For now multiplying only the rgb values with the light value
        gl_FragColor.rgb *= light;
    }
`;

export default fragmentShaderSrc;