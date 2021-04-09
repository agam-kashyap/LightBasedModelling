const PhongFragmentShaderSrc = `
    precision mediump float;
    varying vec3 vNormal;
    uniform vec3 uViewWorldPosition;

    uniform float uShininess;

    uniform float Ka;
    uniform float Kd;
    uniform float Ks;
    
    struct Light {
        vec3 uLightWorldPosition;
        vec3 uLightDirection;
        float maxDist;
        vec3 AmbientColor;
        vec3 DiffuseColor;
        vec3 SpecularColor;
        bool isOn;
    };

    #define NUM_OF_LIGHTS 4
    uniform Light LightPositions[NUM_OF_LIGHTS];

    varying vec3 surfaceWorldPosition;


    void main () {  
        // Since for each point on the surface we need to provide separate colour based on lighting
        // hence we make normal as being varying in Vertex shader and pass it to frag shader
        vec3 normal = normalize(vNormal);

        vec4 Color = vec4(0.0,0.0,0.0,1.0);
        for(int i=0;i < NUM_OF_LIGHTS; i++)
        {
            vec3 surfaceToLightDirection = normalize(LightPositions[i].uLightWorldPosition - surfaceWorldPosition);
            vec3 surfaceToViewDirection = normalize(uViewWorldPosition - surfaceWorldPosition);
            vec3 halfvector = normalize(surfaceToLightDirection + surfaceToViewDirection);


            float light = 0.0;
            float specular = 0.0;

            float dotFromDirection = dot(surfaceToLightDirection, -LightPositions[i].uLightDirection);
            
            // Diffuse Color Calculation
            float diff = max(dot(normal, surfaceToLightDirection), 0.0);
            vec3 diffuse = diff * LightPositions[i].DiffuseColor;

            light = dot(normal, surfaceToLightDirection);
            specular = pow(dot(normal, halfvector), uShininess);

            // Adding Attenuation
            float d = length(LightPositions[i].uLightWorldPosition - surfaceWorldPosition);
            float c1 = 0.0000001;
            float c2 = 0.0000001;
            float c3 = 0.0000001;
            // float attenuation = clamp((LightPositions[i].maxDist*1.0)/(c1 + c2*d + c3*d*d), 0.0, 10.0);
            float attenuation = clamp(1.0/(c1 + c2*d + c3*d*d), 0.0, 1.0);

            if(LightPositions[i].isOn)
            {
                Color += vec4(Ka * LightPositions[i].AmbientColor,1.0) + attenuation * vec4(Kd * diffuse +
                                                                                    Ks * specular * LightPositions[i].SpecularColor, 1.0);
            }
            }
        
        gl_FragColor = Color;

    }
`;

export default PhongFragmentShaderSrc;