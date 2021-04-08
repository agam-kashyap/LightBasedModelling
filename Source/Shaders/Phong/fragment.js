const PhongFragmentShaderSrc = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfacetoView;


    uniform float uShininess;
    uniform vec3 uLightDirection;
    uniform float uLimit;
    
    uniform float Ka;
    uniform float Kd;
    uniform float Ks;
    uniform float maxDist;
    uniform vec3 AmbientColor;
    uniform vec3 DiffuseColor;
    uniform vec3 SpecularColor;

    uniform vec3 uLightWorldPosition;
    varying vec3 vertPos;
    void main () {  
        // Since for each point on the surface we need to provide separate colour based on lighting
        // hence we make normal as being varying in Vertex shader and pass it to frag shader
        vec3 normal = normalize(vNormal);

        vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
        vec3 surfaceToViewDirection = normalize(vSurfacetoView);
        vec3 halfvector = normalize(surfaceToLightDirection + surfaceToViewDirection);


        float light = 0.0;
        float specular = 0.0;

        float dotFromDirection = dot(surfaceToLightDirection, -uLightDirection);
        
        // Diffuse Color Calculation
        float diff = max(dot(normal, surfaceToLightDirection), 0.0);
        vec3 diffuse = diff * DiffuseColor;

        light = dot(normal, surfaceToLightDirection);
        specular = pow(dot(normal, halfvector), uShininess);

        // Adding Attenuation
        float d = length(vSurfaceToLight);
        float c1 = 0.5;
        float c2 = 0.5;
        float c3 = 0.5;
        float attenuation = clamp(maxDist/(c1 + c2*d + c3*d*d), 0.0, 10.0);
        // float attenuation = 0.5;

        gl_FragColor = attenuation * vec4(Ka * AmbientColor +
                                          Kd * diffuse +
                                          Ks * specular * SpecularColor, 1.0);

    }
`;

export default PhongFragmentShaderSrc;