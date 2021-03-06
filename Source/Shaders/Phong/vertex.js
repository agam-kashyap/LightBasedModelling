const PhongVertexShaderSrc= `
    attribute vec3 aPosition;
    
    uniform mat4 Model;
    uniform mat4 View;
    uniform mat4 Project;

    uniform mat4 TransposeWorldMatrix; 
    attribute vec3 aNormal;
    varying vec3 vNormal;
    
    // Point Light
    
    uniform mat4 uWorld;

    varying vec3 surfaceWorldPosition;

    
    void main() {

        gl_Position = Project * View * Model * vec4(aPosition, 1);
        gl_PointSize = 5.0;
        vNormal = mat3(TransposeWorldMatrix) * aNormal;

        vec3 surfaceWorldPosition = (Model* vec4(aPosition,1)).xyz;
    }
`;

export default PhongVertexShaderSrc;