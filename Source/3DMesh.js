import Transform from './transform.js';
import LightProperties from './Light.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh 
{
    constructor(gl, MeshOBJect, proj, color, camera, scaling, ID)
    {
        this.id = ID;

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
        this.scale = vec3.create();
        this.translateX = 0;
        this.translateY = 0;
        this.scalingVal = scaling;
        vec3.set(this.translation, this.translateX, this.translateY, 0);
        vec3.set(this.scale, this.scalingVal, this.scalingVal, this.scalingVal);
        this.transform.setScale(this.scale);
        this.transform.setTranslate(this.translation);
        this.transform.updateMVPMatrix();

        this.proj = proj;

        this.eye = vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z);
        this.center = vec3.fromValues(camera.center.x, camera.center.y, camera.center.z);
        this.up = vec3.fromValues(camera.up.x, camera.up.y, camera.up.z);


        this.lightProps = new LightProperties();
        var [maxX,minX,maxY,minY,maxZ,minZ] = this.findBBox();
        var tempPos = vec4.fromValues(1.05*maxX, 1.05*maxY, 1.05*maxZ,1);
        vec4.transformMat4(tempPos, tempPos, this.transform.getModelMatrix());
        tempPos = vec3.fromValues(tempPos[0], tempPos[1], tempPos[2]);
        this.lightProps.setPosition(tempPos);
        console.log(this.lightProps.getPosition());

        this.LightSources = [];

        this.shader = 0;
    }

    getShader()
    {
        return this.shader;
    }
    setShader()
    {
        this.shader += 1;
        this.shader %= 2;
    }
    getID()
    {
        return this.id;
    }
    getMaxDistanceFromSurface(LightPos)
    {
        var [maxX,minX,maxY,minY,maxZ,minZ] = this.findBBox();
        var MaxDistancefromSurface = 0;
        var LightPosition = vec3.fromValues(LightPos[0], LightPos[1], LightPos[2]);
        for(var i=0;i<this.vertexAttributesData.length/3;i+=1)
        {
            var tempPosition = vec4.fromValues(this.vertexAttributesData[i], this.vertexAttributesData[i+1], this.vertexAttributesData[i+2],1)
            vec4.transformMat4(tempPosition, tempPosition, this.transform.getModelMatrix());
            tempPosition = vec3.fromValues(tempPosition[0], tempPosition[1], tempPosition[2]);

            i+=2;
            if(vec3.sqrDist(tempPosition, LightPosition) > MaxDistancefromSurface)
            {
                MaxDistancefromSurface = vec3.sqrDist(tempPosition, LightPosition);
            }
        }
        return MaxDistancefromSurface;
    }

    getLightPos()
    {
        return this.lightProps.getPosition();
    }
    translateLight(position)
    {
        var dum;
        var tempPos = position;
        var [maxX,minX,maxY,minY,maxZ,minZ] = this.findBBox();
        debugger;
        var tempMax = vec4.fromValues(maxX, maxY, maxZ, 1);
        var tempMin = vec4.fromValues(minX, minY, minZ, 1);
        vec4.transformMat4(tempMax, tempMax, this.transform.getModelMatrix());
        vec4.transformMat4(tempMin, tempMin, this.transform.getModelMatrix());

        [maxX, maxY, maxZ, dum] = tempMax;
        [minX, minY, minZ, dum] = tempMin;
        debugger;
        if(position[0] > 1.25*maxX)
        {
            tempPos[0] = 1.25*minX;
        }
        else if(position[0] < 1.25*minX)
        {
            tempPos[0] = 1.25*maxX;
        }
        else
        {
            tempPos[0] = position[0];
        }

        if(position[1] > 1.25*maxY)
        {
            tempPos[1] = 1.25*minY;
        }
        else if(position[1] < 1.25*minY)
        {
            tempPos[1] = 1.25*maxY;
        }
        else
        {
            tempPos[1] = position[1];
        }

        if(position[2] > 1.25*maxZ)
        {
            tempPos[2] = 1.25*minZ;
        }
        else if(position[2] < 1.25*minZ)
        {
            tempPos[2] = 1.25*maxZ;
        }
        else
        {
            tempPos[2] = position[2];
        }
        this.lightProps.setPosition(tempPos);
    }

    setAllLights(array)
    {
        this.LightSources = array;
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
        const AmbientCoefficient = shader.uniform("Ka");
        const DiffuseCoefficient = shader.uniform("Kd");
        const SpecularCoefficient = shader.uniform("Ks"); 
        const viewWorldPosition = shader.uniform("uViewWorldPosition");
        const Shininess = shader.uniform("uShininess");


        // Setting the numerator for attenuation

        // Object Properties
        var shininessVal = this.lightProps.getShine();
        var Ka = this.lightProps.getKa();
        var Kd = this.lightProps.getKd();
        var Ks = this.lightProps.getKs();
        

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

        // uViewWorldPosition
        shader.setUniform3fv(viewWorldPosition, this.eye); 
        
        // Set Reflection Coefficients (Object Property)
        shader.setUniform1f(AmbientCoefficient, Ka);
        shader.setUniform1f(DiffuseCoefficient, Kd);
        shader.setUniform1f(SpecularCoefficient, Ks);


        // Set Shininess
        shader.setUniform1f(Shininess, shininessVal);


        // Setting Light Properties
        for(var i in this.LightSources)
        {
            var LightWorldLocation = shader.uniform("LightPositions[" + i + "].uLightWorldPosition");
            var lightDirectionLocation = shader.uniform("LightPositions[" + i + "].uLightDirection");
            var Ambient = shader.uniform("LightPositions[" + i + "].AmbientColor");
            var Diffuse = shader.uniform("LightPositions[" + i + "].DiffuseColor");
            var Specular = shader.uniform("LightPositions[" + i + "].SpecularColor");
            var maxDist = shader.uniform("LightPositions[" + i + "].maxDist");
            var isOn = shader.uniform("LightPositions[" + i + "].isOn");

            shader.setUniform3fv(Ambient, this.LightSources[i].AmbientColor);
            shader.setUniform3fv(Diffuse, this.LightSources[i].DiffuseColor);
            shader.setUniform3fv(Specular, this.LightSources[i].SpecularColor);

            //Point the light source at the object
            var lightDirection;
            var lmat = mat4.create();
            mat4.lookAt(lmat, this.LightSources[i].LightPos, this.center, this.up);
            lightDirection = [-lmat[8], -lmat[9], -lmat[10]];
            shader.setUniform3fv(lightDirectionLocation, lightDirection);

            var MaxDistance = this.getMaxDistanceFromSurface(this.LightSources[i].LightPos);
            shader.setUniform1f(maxDist, MaxDistance);
            shader.setUniform3fv(LightWorldLocation, this.LightSources[i].LightPos);
            shader.setUniform1i(isOn, this.LightSources[i].isOn);
        }

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