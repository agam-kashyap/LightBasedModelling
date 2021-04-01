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

        // Setting All the Variables
        const modelUniform = shader.uniform("Model");
        const projectUniform = shader.uniform("Project");
        const viewUniform = shader.uniform("View");
        const aPosition = shader.attribute("aPosition");
        const normalLocation = shader.attribute("aNormal");
        const transposeWorld = shader.uniform("TransposeWorldMatrix");
        const worldLocation = shader.uniform("uWorld");
        const LightWorldLocation = shader.uniform("uLightWorldPosition");
        const viewWorldPosition = shader.uniform("uViewWorldPosition");
        const lightDirectionLocation = shader.uniform("uLightDirection");
        const limitLocation = shader.uniform("uLimit");
        const Shininess = shader.uniform("uShininess");
        const Ambient = shader.uniform("AmbientColor");
        const Diffuse = shader.uniform("DiffuseColor");
        const Specular = shader.uniform("SpecularColor");
        const AmbientCoefficient = shader.uniform("Ka");
        const DiffuseCoefficient = shader.uniform("Kd");
        const SpecularCoefficient = shader.uniform("Ks"); 
        const maxDist = shader.uniform("maxDist");

        // Light Position inside BBox * 1.25
        var [maxX,minX,maxY,minY,maxZ,minZ] = this.findBBox();
        var LightPos = vec4.fromValues(1.25*maxX,1.25*maxY,1.25*maxZ,1);
        vec4.transformMat4(LightPos, LightPos, this.transform.getModelMatrix());
        var MaxDistancefromSurface = 0;
        var LightPosition = vec3.fromValues(LightPos[0], LightPos[1], LightPos[2]);
        for(var i=0;i<this.vertexAttributesData.length/3;i+=1)
        {
            var tempPosition = vec3.fromValues(this.vertexAttributesData[i], this.vertexAttributesData[i+1], this.vertexAttributesData[i+2])
            i+=2;
            if(vec3.sqrDist(tempPosition, LightPosition) > MaxDistancefromSurface)
            {
                MaxDistancefromSurface = vec3.sqrDist(tempPosition, LightPosition);
            }
        }

        // Setting the numerator for attenuation
        shader.setUniform1f(maxDist, MaxDistancefromSurface);

        var limit = 0.5 * (180/ Math.PI);
        // Object Properties
        var shininessVal = 150;
        var Ka = 1.0;
        var Kd = 1.0;
        var Ks = 1.0;
        var AmbientColor = vec3.fromValues(0.0,0.0,0.0);
        var DiffuseColor = vec3.fromValues(0.1, 0.4, 0.0);
        var SpecularColor = vec3.fromValues(1.0,1.0,1.0);
        

        // Model Matrix
        shader.setUniformMatrix4fv(modelUniform, this.transform.getModelMatrix());
        
        // Projection Matrix
        const project = mat4.create();
        mat4.perspective(project, this.proj.fovy, this.proj.aspect, this.proj.near, this.proj.far);
        shader.setUniformMatrix4fv(projectUniform, project);

        // View Matrix
        const view = mat4.create();
        mat4.lookAt(view, this.eye, this.center, this.up);
        shader.setUniformMatrix4fv(viewUniform, view);
        
        // Vertex Positions Matrix
        let elementPerVertex = 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 0,0);
        
        // Normals Matrix
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexNormals, this.gl.DYNAMIC_DRAW);

        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation, elementPerVertex, this.gl.FLOAT, false,0, 0);

        // Inverse Transpose World Matrix
        const transposeWorldMatrix = mat4.create();
        mat4.invert(transposeWorldMatrix, this.transform.getModelMatrix());
        mat4.transpose(transposeWorldMatrix, transposeWorldMatrix);
        shader.setUniformMatrix4fv(transposeWorld, transposeWorldMatrix);

        // uWorld
        const worldMatrix = mat4.create();
        mat4.multiply(worldMatrix, this.transform.getModelMatrix(), view);
        shader.setUniformMatrix4fv(worldLocation, worldMatrix);

        // uLightWorldPosition
        shader.setUniform3fv(LightWorldLocation, LightPosition);
        

        // uViewWorldPosition
        shader.setUniform3fv(viewWorldPosition, this.eye); 
        
        // Set Different Colors and Reflection Coefficients
        shader.setUniform3fv(Ambient, AmbientColor);
        shader.setUniform3fv(Diffuse, DiffuseColor);
        shader.setUniform3fv(Specular, SpecularColor);
        shader.setUniform1f(AmbientCoefficient, Ka);
        shader.setUniform1f(DiffuseCoefficient, Kd);
        shader.setUniform1f(SpecularCoefficient, Ks);

        // Light Related Variables
        var lightDirection;
        //Point the light source at the object
        var lmat = mat4.create();
        mat4.lookAt(lmat, LightPosition, this.center, this.up);
        lightDirection = [-lmat[8], -lmat[9], -lmat[10]];
        
        shader.setUniform3fv(lightDirectionLocation, lightDirection);
        shader.setUniform1f(limitLocation, Math.cos(limit));

        // Set Shininess
        shader.setUniform1f(Shininess, shininessVal);

        // Setting up of Vertices
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

    findBBox()
    {
        var maxX = -10000;
        var maxY = -10000;
        var maxZ = -10000;
        var minX = 10000;
        var minY = 10000;
        var minZ = 10000;

        for(var i=0; i< this.vertexAttributesData.length;i+=1)
        {
            if(i%3 == 0)
            {
                if(this.vertexAttributesData[i] > maxX)
                {
                    maxX = this.vertexAttributesData[i]*this.scalingVal;
                }
                if(this.vertexAttributesData[i] < minX)
                {
                    minX = this.vertexAttributesData[i]*this.scalingVal;
                }
            }
            else if(i%3 == 1)
            {
                if(this.vertexAttributesData[i] > maxY)
                {
                    maxY = this.vertexAttributesData[i]*this.scalingVal;
                }
                if(this.vertexAttributesData[i] < minY)
                {
                    minY = this.vertexAttributesData[i]*this.scalingVal;
                }
            }
            else
            {
                if(this.vertexAttributesData[i] > maxZ)
                {
                    maxZ = this.vertexAttributesData[i]*this.scalingVal;
                }
                if(this.vertexAttributesData[i] < minZ)
                {
                    minZ = this.vertexAttributesData[i]*this.scalingVal;
                }
            }
        }
        return [maxX, minX, maxY, minY, maxZ, minZ];
    }
};