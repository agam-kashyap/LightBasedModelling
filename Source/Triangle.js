import Transform from './transform.js'
import { vec4, vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Triangle
{
    constructor(gl,scale, color, proj, camera)
    {

        this.vertexAttributesData = new Float32Array([
            0, 8, 0.0, // A
            -8, -4, 0.0, // B
            8, -4, 0.0, // C
        ]);

        this.vertexIndices = new Uint16Array([
            0, 1, 2,
        ]);
        this.color = color;
        this.gl = gl;

        this.vertexAttributesBuffer = this.gl.createBuffer();
        if(!this.vertexAttributesBuffer)
        {
            throw new Error("Buffer for Rectangle's vertices could Not be allocated");
        }		
        this.transform = new Transform();

        this.translation = vec3.create();
        this.rotationAngle = 0;
        this.rotationAxis = vec3.create();
        this.scale = vec3.create();
        this.translateX = 0;
        this.translateY = 0;
        this.scalingVal = scale;
        vec3.set(this.rotationAxis, 0, 1, 0);
        vec3.set(this.translation, this.translateX, this.translateY, 0);
        vec3.set(this.scale, this.scalingVal, this.scalingVal, 1);
        this.transform.setScale(this.scale);
        this.transform.setTranslate(this.translation);
        this.transform.setRotate(this.rotationAxis, this.rotationAngle);
        this.transform.updateMVPMatrix();
        this.proj = proj;
        
        this.eye = vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z);
        this.center = vec3.fromValues(camera.center.x, camera.center.y, camera.center.z);
        this.up = vec3.fromValues(camera.up.x, camera.up.y, camera.up.z);
    }

    draw(shader)
    {
        const modelUniform = shader.uniform("Model");
        shader.setUniformMatrix4fv(modelUniform, this.transform.getModelMatrix());
        
        const project = mat4.create();
        // mat4.ortho(project, this.proj['left'], this.proj['right'], this.proj['bottom'], this.proj['top'], this.proj['near'], this.proj['far']);
        mat4.perspective(project, this.proj.fovy, this.proj.aspect, this.proj.near, this.proj.far);
        const projectUniform = shader.uniform("Project");
        shader.setUniformMatrix4fv(projectUniform, project);

        const view = mat4.create();
        mat4.lookAt(view, this.eye, this.center, this.up);
        const viewUniform = shader.uniform("View");
        shader.setUniformMatrix4fv(viewUniform, view);

        let elementPerVertex = 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

        const aPosition = shader.attribute("aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 0,0)

        const u_color = shader.uniform("u_color");
        this.gl.uniform4fv(u_color, this.color);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.DYNAMIC_DRAW);

        this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer);
    }

    getCorners()
    {
        // Projection * view * Model * vertices
        const iter = this.vertexAttributesData.values();
        var i=0;
        var TransformedVertices = [];
        for(var values of iter)
        {
            if(i%3 == 0 & i!= 0)
            {
                TransformedVertices.push(1);
            }
            TransformedVertices.push(values);
            i+=1;
        }
        TransformedVertices.push(1);
        mat4.multiply(TransformedVertices, this.transform.getModelMatrix(), TransformedVertices);
        
        return TransformedVertices;
    }

    updateCamera(camera)
    {
        this.eye = vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z);
        this.center = vec3.fromValues(camera.center.x, camera.center.y, camera.center.z);
        this.up = vec3.fromValues(camera.up.x, camera.up.y, camera.up.z);
    }
};