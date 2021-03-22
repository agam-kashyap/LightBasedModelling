import Transform from './transform.js'
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh 
{
    constructor(gl, MeshOBJect, rotationAngle, rotationAxis, proj, color, camera)
    {
        this.vertexAttributesData = new Float32Array(MeshOBJect.vertices);
        this.vertexIndices = new Uint16Array(MeshOBJect.indices);
        this.vertexNormals = new Float32Array(MeshOBJect.vertexNormals);
        
        this.color =  color;
        this.gl = gl;

        this.vertexAttributesBuffer = this.gl.createBuffer();
        this.vertexNormalBuffer = this.gl.createBuffer();

        if(!this.vertexAttributesBuffer)
        {
            throw new Error("Buffer for Mesh's vertices could Not be allocated");
        }
        if(!this.vertexNormalBuffer)
        {
            throw new Error("Buffer for Mesh's vertexNormals could Not be allocated");
        }	

        this.transform = new Transform();
        this.transform.setTranslate(vec3.fromValues(0, 0, 0));
        this.transform.updateMVPMatrix();

        this.translation = vec3.create();
        this.rotationAngle = rotationAngle;
        this.rotationAxis = rotationAxis;
        this.scale = vec3.create();
        this.translateX = 0;
        this.translateY = 0;
        this.scalingVal = 70.0;
        vec3.set(this.translation, this.translateX, this.translateY, 0);
        vec3.set(this.scale, this.scalingVal, this.scalingVal, this.scalingVal);
        this.transform.setScale(this.scale);
        this.transform.setTranslate(this.translation);
        this.transform.setRotate(this.rotationAxis, this.rotationAngle);
        this.transform.updateMVPMatrix();

        this.proj = proj;

        this.eye = vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z);
        this.center = vec3.fromValues(camera.center.x, camera.center.y, camera.center.z);
        this.up = vec3.fromValues(camera.up.x, camera.up.y, camera.up.z);

        this.selectedColor = vec4.fromValues(0.1, 0.1, 0.1, 1);
    }

    draw(shader, toggle)
    {
        // Model Matrix
        const modelUniform = shader.uniform("Model");
        shader.setUniformMatrix4fv(modelUniform, this.transform.getModelMatrix());
        
        // Projection Matrix
        const project = mat4.create();
        mat4.perspective(project, this.proj.fovy, this.proj.aspect, this.proj.near, this.proj.far);
        const projectUniform = shader.uniform("Project");
        shader.setUniformMatrix4fv(projectUniform, project);

        // View Matrix
        const view = mat4.create();
        mat4.lookAt(view, this.eye, this.center, this.up);
        const viewUniform = shader.uniform("View");
        shader.setUniformMatrix4fv(viewUniform, view);
        
        // Vertex Positions Matrix
        let elementPerVertex = 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

        const aPosition = shader.attribute("aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 0,0);
        
        // Normals Matrix
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexNormals, this.gl.DYNAMIC_DRAW);

        const normalLocation = shader.attribute("aNormal");
        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation, elementPerVertex, this.gl.FLOAT, false,0, 0);

        // Colors Matrix
        const uColor = shader.uniform("uColor");
        this.gl.uniform4fv(uColor, this.color);

        const uReverseLightDirection  = shader.uniform("uReverseLightDirection");
        let lightdirection = vec3.fromValues(0.5,0.7,1);
        lightdirection = vec3.normalize(lightdirection,lightdirection);
        this.gl.uniform3fv(uReverseLightDirection, lightdirection);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.DYNAMIC_DRAW);

        this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer); 
    }

    getScale()
    {
        return this.scale;
    }
    
    setScale(scale)
    {
        this.scalingVal = scale;
        this.scale = vec3.fromValues(this.scalingVal, this.scalingVal, this.scalingVal);
        this.transform.setScale(this.scale);
        this.transform.updateMVPMatrix();
    }

    updateCamera(camera)
    {
        this.eye = vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z);
        this.center = vec3.fromValues(camera.center.x, camera.center.y, camera.center.z);
        this.up = vec3.fromValues(camera.up.x, camera.up.y, camera.up.z);
    }
    
    getColor()
    {
        return this.color;
    }
};