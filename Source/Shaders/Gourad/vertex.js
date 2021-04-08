const GouradVertexShaderSrc = `
attribute vec3 aPosition;
    
uniform mat4 Model;
uniform mat4 View;
uniform mat4 Project;

uniform mat4 TransposeWorldMatrix; 
attribute vec3 aNormal;

// Point Light
uniform vec3 uLightWorldPosition;
uniform vec3 uViewWorldPosition;
uniform mat4 uWorld;

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

varying vec4 vColor;

void main() {
    gl_Position = Project * View * Model * vec4(aPosition, 1);
    gl_PointSize = 5.0;
    vec3 surfaceWorldPosition = (Model* vec4(aPosition,1)).xyz;
    vec3 normal = normalize(mat3(TransposeWorldMatrix) * aNormal);

    vec3 surfaceToLightDirection = normalize(uLightWorldPosition - surfaceWorldPosition);
    vec3 surfaceToViewDirection = normalize(uViewWorldPosition - surfaceWorldPosition);
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
    float d = length(uLightWorldPosition - surfaceWorldPosition);
    float c1 = 0.5;
    float c2 = 0.5;
    float c3 = 0.5;
    float attenuation = clamp(maxDist/(c1 + c2*d + c3*d*d), 0.0, 10.0);
    // float attenuation = 0.5;

    vColor = attenuation * vec4(Ka * AmbientColor +
                                      Kd * diffuse +
                                      Ks * specular * SpecularColor, 1.0);;
}

`;
export default GouradVertexShaderSrc;