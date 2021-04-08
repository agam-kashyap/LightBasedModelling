const PhongVertexShaderSrc= `
    attribute vec3 aPosition;
    
    uniform mat4 Model;
    uniform mat4 View;
    uniform mat4 Project;

    uniform mat4 TransposeWorldMatrix; 
    attribute vec3 aNormal;
    varying vec3 vNormal;
    
    // Point Light
    uniform vec3 uLightWorldPosition;
    uniform vec3 uViewWorldPosition;
    uniform mat4 uWorld;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfacetoView;

    varying vec3 vertPos;
    void main() {
    //     vec4 vertPos4 = View * Model * vec4(aPosition, 1.0);
    //     vertPos = vec3(vertPos4)/ vertPos4.w;

    //     vNormal = mat3(TransposeWorldMatrix) * aNormal;
    //     gl_Position = Project * vertPos4;

        gl_Position = Project * View * Model * vec4(aPosition, 1);
        gl_PointSize = 5.0;
        vNormal = mat3(TransposeWorldMatrix) * aNormal;

        vec3 surfaceWorldPosition = (Model* vec4(aPosition,1)).xyz;
        vSurfaceToLight = uLightWorldPosition - surfaceWorldPosition;
        vSurfacetoView = uViewWorldPosition - surfaceWorldPosition;
    }
`;

export default PhongVertexShaderSrc;