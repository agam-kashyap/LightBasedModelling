const vertexShaderSrc= `
    attribute vec3 aPosition;
    
    uniform mat4 Model;
    uniform mat4 View;
    uniform mat4 Project;

    attribute vec3 aNormal;
    varying vec3 vNormal;

    void main() {
        gl_Position = Project * View * Model * vec4(aPosition, 1);
        gl_PointSize = 5.0;
        vNormal = aNormal;
    }
`;

export default vertexShaderSrc;