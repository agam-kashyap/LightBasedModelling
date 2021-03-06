import Renderer from './renderer.js';
import Shader from './shader.js';
import PhongVertexShaderSrc from './Shaders/Phong/vertex.js';
import PhongFragmentShaderSrc from './Shaders/Phong/fragment.js';
import GouradVertexShaderSrc from './Shaders/Gourad/vertex.js';
import GouradFragmentShaderSrc from './Shaders/Gourad/fragment.js';
import { vec3, mat4, vec4, quat } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Mesh from './3DMesh.js';
import LightProperties from './Light.js';

/* Canvas Setup Begins */
const renderer = new Renderer();
const gl = renderer.webGlContext();

// renderer.clear();

const PhongShader = new Shader(gl, PhongVertexShaderSrc, PhongFragmentShaderSrc);
const GouradShader = new Shader(gl, GouradVertexShaderSrc, GouradFragmentShaderSrc);
/* Canvas Setup Ends */


/************************* 
** Projection values **
*************************/  

var proj = {
    fovy: Math.PI/3,
    aspect: window.innerWidth/ window.innerHeight,
    near: 1,
    far: 2000,
}
/************************* 
******* Camera Setup *****
*************************/
var camera = {
    eye: {
        // x: 300/Math.sqrt(3),
        // y: 300/Math.sqrt(3),
        // z: 300/Math.sqrt(3),
        x: 0,
        y: 0,
        z: 30,
    },
    center: {
        x: 0,
        y: 0,
        z: 0,
    },
    up: {
        x: 0,
        y: 1,
        z: 0,
    },
    radius: 30,
}

var CameraAngleX = Math.PI/1000;
var CameraAngleY = Math.PI/1000;
var CameraAxis = vec3.fromValues(0,1,0);
var CameraTransformMatrix = mat4.create();
mat4.identity(CameraTransformMatrix);

/******************
 * 
 * Object Light based Properties
 *****************/
var Matte = {
    ka : 0.33, 
    kd : 0.27, 
    ks : 0, 
    Ambientcolor : vec3.fromValues(0.81, 0.81, 0.81),
    DiffuseColor : vec3.fromValues(0.666, 0, 0.8),
    SpecularColor : vec3.fromValues(1.0,1.0,1.0),
    Shine : 20,
    Limit : 0.5
};

var Gold = {
    ka : 1.0, 
    kd : 1.0, 
    ks : 1.0,
    Ambientcolor : vec3.fromValues(0.0, 0.0, 0.0),
    DiffuseColor : vec3.fromValues(0.752, 0.606, 0.226),
    SpecularColor : vec3.fromValues(0.628, 0.556, 0.366),
    Shine : 200,
    Limit : Math.PI/8
}
/************************* 
** Reading Mesh objects **
*************************/
var AllMeshArray = [];
////////////////////////////////////////////////////
////////////////////Sphere//////////////////////////
var CubeAngle = 0;
var CubeRead=false;
var CubeColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var CubeToggle=false;
var CubeSelected = false;
var CubeScaling = 4;
var CubeMesh;
var CubePosition = vec3.fromValues(10,10,0);
var CubeShader = 0; //Gourad

fetch('./models/Cube/cube.obj')
    .then(response => response.text())
    .then(data => {
        var CubeMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(CubeMeshObject);
        CubeMesh = new Mesh(gl, CubeMeshObject, proj, CubeColor, camera, CubeScaling,1);
        CubeMesh.lightProps.setKa(Gold.ka);
        CubeMesh.lightProps.setKd(Gold.kd);
        CubeMesh.lightProps.setKs(Gold.ks);
        CubeMesh.lightProps.setAmbient(Gold.Ambientcolor);
        CubeMesh.lightProps.setDiffuse(Gold.DiffuseColor);
        CubeMesh.lightProps.setSpecular(Gold.SpecularColor)
        CubeMesh.lightProps.setShine(Gold.Shine);
        CubeMesh.lightProps.setLimit(Gold.Limit);
        CubeMesh.transform.setTranslate(CubePosition);
        CubeMesh.transform.updateMVPMatrix();
        CubeRead = true;
        AllMeshArray.push(CubeMesh);
    })

////////////////////////////////////////////////////
////////////////////Sphere//////////////////////////
var SphereAngle = 0;
var SphereRead=false;
var SphereColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var SphereToggle=false;
var SphereSelected = false;
var SphereScaling = 4;
var SphereMesh;
var SpherePosition = vec3.fromValues(10, -10, 0)
var SphereShader = 0; //Gourad

fetch('./models/Sphere/sphere.obj')
    .then(response => response.text())
    .then(data => {
        var SphereMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(SphereMeshObject);
        SphereMesh = new Mesh(gl, SphereMeshObject, proj, SphereColor, camera, SphereScaling,2);
        SphereMesh.lightProps.setKa(Gold.ka);
        SphereMesh.lightProps.setKd(Gold.kd);
        SphereMesh.lightProps.setKs(Gold.ks);
        SphereMesh.lightProps.setAmbient(Gold.Ambientcolor);
        SphereMesh.lightProps.setDiffuse(Gold.DiffuseColor);
        SphereMesh.lightProps.setSpecular(Gold.SpecularColor)
        SphereMesh.lightProps.setShine(Gold.Shine);
        SphereMesh.lightProps.setLimit(Gold.Limit);
        SphereMesh.transform.setTranslate(SpherePosition);
        SphereMesh.transform.updateMVPMatrix();
        SphereRead = true;
        AllMeshArray.push(SphereMesh);
    })

////////////////////////////////////////////////////
////////////////////Tennis//////////////////////////
var TennisAngle = 0;
var TennisRead=false;
var TennisColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var TennisToggle=false;
var TennisSelected = false;
var TennisScaling = 0.2;
var TennisMesh;
var TennisPosition = vec3.fromValues(-10, -10, 0);
var TennisShader = 0; //Gourad

fetch('./models/Tennis/tennis.obj')
    .then(response => response.text())
    .then(data => {
        var TennisMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(TennisMeshObject);
        TennisMesh = new Mesh(gl, TennisMeshObject, proj, TennisColor, camera, TennisScaling,3);
        TennisMesh.lightProps.setKa(Gold.ka);
        TennisMesh.lightProps.setKd(Gold.kd);
        TennisMesh.lightProps.setKs(Gold.ks);
        TennisMesh.lightProps.setAmbient(Gold.Ambientcolor);
        TennisMesh.lightProps.setDiffuse(Gold.DiffuseColor);
        TennisMesh.lightProps.setSpecular(Gold.SpecularColor)
        TennisMesh.lightProps.setShine(Gold.Shine);
        TennisMesh.lightProps.setLimit(Gold.Limit);
        TennisMesh.transform.setTranslate(TennisPosition);
        TennisMesh.transform.updateMVPMatrix();
        TennisRead = true;
        AllMeshArray.push(TennisMesh);
    })

////////////////////////////////////////////////////
////////////////////Monkey//////////////////////////
var MonkeyAngle = 0;
var MonkeyRead=false;
var MonkeyColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var MonkeyToggle=false;
var MonkeySelected = false;
var MonkeyScaling = 4;
var MonkeyMesh;
var MonkeyPosition = vec3.fromValues(-10, 10, 0);
var MonkeyShader = 0; //Gourad

fetch('./models/monkey.obj')
    .then(response => response.text())
    .then(data => {
        var MonkeyMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(MonkeyMeshObject);
        MonkeyMesh = new Mesh(gl, MonkeyMeshObject, proj, MonkeyColor, camera, MonkeyScaling,0);
        MonkeyMesh.lightProps.setKa(Gold.ka);
        MonkeyMesh.lightProps.setKd(Gold.kd);
        MonkeyMesh.lightProps.setKs(Gold.ks);
        MonkeyMesh.lightProps.setAmbient(Gold.Ambientcolor);
        MonkeyMesh.lightProps.setDiffuse(Gold.DiffuseColor);
        MonkeyMesh.lightProps.setSpecular(Gold.SpecularColor)
        MonkeyMesh.lightProps.setShine(Gold.Shine);
        MonkeyMesh.lightProps.setLimit(Gold.Limit);
        MonkeyMesh.transform.setTranslate(MonkeyPosition);
        MonkeyMesh.transform.updateMVPMatrix();
        MonkeyRead = true;
        AllMeshArray.push(MonkeyMesh);
    })
////////////////////////////////////////////////////
// Variables Relevant to all Modes
let mode_value = 0; 
let terminate = false;
let MouseCoordinates = 0;
var SelectMode=false;
var CameraMouseDragY = false;
var MouseDownX, MouseDownY;
var SetReset = false;
var CameraRotateMode = true;
var SelectedIndex = -1;
var LightTranslate = 0;
/////////////////////////////////////////////////////
window.onload = () => 
{
    renderer.getCanvas().addEventListener("mousedown", (event) => {
        if(1)
        {
            let mouseX = event.clientX;
            let mouseY = event.clientY;

            let render_area = renderer.getCanvas().getBoundingClientRect();
            mouseX = mouseX - render_area.left;
            mouseY = mouseY - render_area.top;

            MouseCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);
            
            [MouseDownX, MouseDownY] = MouseCoordinates;
            CameraMouseDragY = true;
        }
    });
    renderer.getCanvas().addEventListener("mouseup", (event) => {
        CameraMouseDragY = false;
    });
 
    document.addEventListener("mousemove" , (ev)=> {
        let mouseX = ev.clientX;
        let mouseY = ev.clientY;

        let render_area = renderer.getCanvas().getBoundingClientRect();
        mouseX = mouseX - render_area.left;
        mouseY = mouseY - render_area.top;

        MouseCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);
        if(CameraRotateMode == true)
        {
            if(CameraMouseDragY == true)
            {
                var moveX = MouseCoordinates[0] - MouseDownX;
                var moveY = MouseCoordinates[1] - MouseDownY;

                // var tempCamera = camera;
                if(moveX > 0)
                    {CameraAngleX = moveX/(20*camera.radius);}
                else
                    {CameraAngleX = moveX/(20*camera.radius);}
                
                if(moveY > 0)
                    {
                        CameraAngleY = moveY/(20*camera.radius);
                    }
                else
                        CameraAngleY = moveY/(20*camera.radius);}

                // console.log(CameraAngleX);
                if(CameraAngleX > 2*Math.PI | CameraAngleX < -2*Math.PI)
                {
                    CameraAngleX = 0;
                }
                if(CameraAngleY > 2*Math.PI | CameraAngleY < -2*Math.PI)
                {
                    CameraAngleY = 0;
                }
                camera.eye.x = camera.radius * Math.sin(CameraAngleX)*Math.cos(CameraAngleY);
                camera.eye.z = camera.radius * Math.cos(CameraAngleX)*Math.cos(CameraAngleY);
                camera.eye.y = camera.radius * Math.sin(CameraAngleY);

                if(CubeRead && SphereRead && MonkeyRead && TennisRead)
                {
                    for(var mesh in AllMeshArray)
                    {
                        AllMeshArray[mesh].updateCamera(camera);
                    }
                }
            }        
        else
        {
            if(CameraMouseDragY == true)
            {
                //Initial Vector P1
                var p1 = vec3.create();
                vec3.normalize(p1, vec3.fromValues(MouseDownX, MouseDownY, 1000));
                // Moved Vector P2
                var p2 = vec3.create();
                vec3.normalize(p2, vec3.fromValues(MouseCoordinates[0], MouseCoordinates[1], 1000));
                
                //Rotation Angle
                var theta = vec3.angle(p1, p2);
                
                // Rotation Axis
                var rotAxis = vec3.create();
                vec3.cross(rotAxis, p1, p2);

                for(var mesh in AllMeshArray)
                {
                    if(AllMeshArray[mesh].getID() == SelectedIndex)
                    {
                        var RotQuat = quat.create();
                        quat.setAxisAngle(RotQuat, rotAxis, theta);
                        quat.normalize(RotQuat, RotQuat);
                        var RotMat = mat4.create();
                        mat4.fromQuat(RotMat, RotQuat);

                        var CurrentRotMat = AllMeshArray[mesh].transform.getRotate();
                        mat4.multiply(CurrentRotMat, CurrentRotMat, RotMat);
                        AllMeshArray[mesh].transform.setRotate(CurrentRotMat);
                        AllMeshArray[mesh].transform.updateMVPMatrix();
                    }
                }
            }
        }    
    }   
    );


    document.addEventListener("keydown", (ev) => {

        if(ev.key == "3")
        {
            // Monkey
            SelectedIndex = 0;
            CameraRotateMode = false;
            LightTranslate = 0;
        }
        else if(ev.key == "4")
        {
            // Cube
            SelectedIndex = 1;
            CameraRotateMode = false;
            LightTranslate = 0;
        }
        else if(ev.key == "5")
        {
            // Sphere
            SelectedIndex = 2;
            CameraRotateMode = false;
            LightTranslate = 0;
        }
        else if(ev.key == "6")
        {
            // Tennis
            SelectedIndex = 3;
            CameraRotateMode = false;
            LightTranslate = 0;
        }
        else if(ev.key == "2" || ev.key == "7" || ev.key == "8" || ev.key == "9")
        {
            SelectedIndex = -1;
            CameraRotateMode = true;
            LightTranslate = 0;
        }

        if(ev.key == "i")
        {
            LightTranslate += 1;
            LightTranslate = LightTranslate%2;
        }
        if(ev.key == "0")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    AllMeshArray[mesh].lightProps.setLight(0);
                }
            }
        }
        if(ev.key == "1")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    AllMeshArray[mesh].lightProps.setLight(1);
                }
            }
        }

        if(ev.key == "h")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[0] -= 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        else if(ev.key == "l")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[0] += 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        else if(ev.key == "j")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[1] += 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        else if(ev.key == "k")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[1] -= 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        else if(ev.key == "a")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[2] -= 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        else if(ev.key == "d")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex && LightTranslate == 1)
                {
                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[2] += 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }

        if(ev.key == "ArrowLeft")
        {   
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var translation = AllMeshArray[mesh].transform.getTranslate();
                    translation[0] -= 1;
                    vec3.set(AllMeshArray[mesh].translation, translation[0], translation[1], translation[2]);
                    AllMeshArray[mesh].transform.setTranslate(AllMeshArray[mesh].translation);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();

                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[0] -= 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        
        else if(ev.key == "ArrowRight")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var translation = AllMeshArray[mesh].transform.getTranslate();
                    translation[0] += 1;
                    vec3.set(AllMeshArray[mesh].translation, translation[0], translation[1], translation[2]);
                    AllMeshArray[mesh].transform.setTranslate(AllMeshArray[mesh].translation);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();

                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[0] += 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }

        if(ev.key == "ArrowUp")
        {   
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var translation = AllMeshArray[mesh].transform.getTranslate();
                    translation[1] += 1;
                    vec3.set(AllMeshArray[mesh].translation, translation[0], translation[1], translation[2]);
                    AllMeshArray[mesh].transform.setTranslate(AllMeshArray[mesh].translation);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();

                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[1] += 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        
        else if(ev.key == "ArrowDown")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var translation = AllMeshArray[mesh].transform.getTranslate();
                    translation[1] -= 1;
                    vec3.set(AllMeshArray[mesh].translation, translation[0], translation[1], translation[2]);
                    AllMeshArray[mesh].transform.setTranslate(AllMeshArray[mesh].translation);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();

                    var lightPos = AllMeshArray[mesh].getLightPos();
                    lightPos[1] -= 1;
                    AllMeshArray[mesh].translateLight(lightPos);
                }
            }
        }
        
        if(ev.key == "+")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var scale = AllMeshArray[mesh].transform.getScale();
                    scale[0] += .1;
                    scale[1] += .1;
                    scale[2] += .1;
                    AllMeshArray[mesh].scalingVal = scale[0];
                    AllMeshArray[mesh].transform.setScale(scale);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();
                    debugger;
                }
            }
        }

        if(ev.key == "-")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    var scale = AllMeshArray[mesh].transform.getScale();
                    scale[0] -= .1;
                    scale[1] -= .1;
                    scale[2] -= .1;
                    AllMeshArray[mesh].scalingVal = scale[0];
                    AllMeshArray[mesh].transform.setScale(scale);
                    // AllMeshArray[mesh].transform.setTranslate(translation);
                    AllMeshArray[mesh].transform.updateMVPMatrix();
                }
            }
        }

        else if(ev.key == "s")
        {
            for(var mesh in AllMeshArray)
            {
                if(AllMeshArray[mesh].getID() == SelectedIndex)
                {
                    AllMeshArray[mesh].setShader();
                }
            }
        }

        if(ev.key == 'Escape')
        {
            terminate = true;
        }
    });


};


//////////////////////////////////////////////////////
function LightSourcesSetup(array)
{
    var lights = [];
    for(var i in array)
    {
        lights.push(array[i].lightProps.getStruct())
    }
    return lights;
}
//////////////////////////////////////////////////////
////////////////////////////////////////////////////
var mouseXElement = document.querySelector('#mousex');
var mouseX = document.createTextNode("");
mouseXElement.appendChild(mouseX);

var mouseYElement = document.querySelector('#mousey');
var mouseY = document.createTextNode("");
mouseYElement.appendChild(mouseY);

var SelectedObject = document.querySelector('#ObjSel');
var selObjName = document.createTextNode("");
SelectedObject.appendChild(selObjName);

var LightMode = document.querySelector('#Mode');
var lightMode = document.createTextNode("");
LightMode.appendChild(lightMode);

var Shading = document.querySelector('#shading');
var shadingMode = document.createTextNode("");
Shading.appendChild(shadingMode);
////////////////////////////////////////////////////
function animate()
{

    renderer.clear();

    
    if(SelectedIndex == 0)
    {
        selObjName.nodeValue = "Monkey";
        for(var i in AllMeshArray)
        {
            if(AllMeshArray[i].getID() == 0)
            {
                if(AllMeshArray[i].getShader() == 0)
                {
                    shadingMode.nodeValue = "Gourad";
                }
                else
                {
                    shadingMode.nodeValue = "Phong";
                }
            }
        }
    }
    else if(SelectedIndex == 1)
    {
        selObjName.nodeValue = "Cube";

    }
    else if(SelectedIndex == 2)
    {
        selObjName.nodeValue = "Sphere";
    }
    else if(SelectedIndex == 3)
    {
        selObjName.nodeValue = "Tennis";
    }
    else
    {
        selObjName.nodeValue = "None";
    }

    if(SelectedIndex != -1)
    {

        document.getElementsByClassName('shading')[0].style.display = 'block';
        document.getElementsByClassName('lightMode')[0].style.display = 'block';
        if(LightTranslate == 0)
        {
            lightMode.nodeValue = "OFF"
        }
        else
        {
            lightMode.nodeValue = "ON"
        }
        
    }
    else
    {
        document.getElementsByClassName('shading')[0].style.display = 'none';
        document.getElementsByClassName('lightMode')[0].style.display = 'none';
    }


    if(typeof MouseCoordinates[0] != 'undefined')
    {
        mouseX.nodeValue = MouseCoordinates[0].toPrecision(4);
        mouseY.nodeValue = MouseCoordinates[1].toPrecision(4);
    }
    
    if(CubeRead && SphereRead && MonkeyRead && TennisRead)
    {
        var CombinedLights = LightSourcesSetup(AllMeshArray);
        for(var i in AllMeshArray)
        {
            AllMeshArray[i].setAllLights(CombinedLights);
            if(AllMeshArray[i].getShader() == 0)
            {
                GouradShader.use();
                AllMeshArray[i].draw(GouradShader, false);
            }
            else
            {
                PhongShader.use();
                AllMeshArray[i].draw(PhongShader, false);
            }
            
        }
    }

    // Activated by pressing 'Escape' key
    if(terminate == false)
        window.requestAnimationFrame(animate);
    else
        window.cancelAnimationFrame(animate);
}

animate();

// Key Presses link = https://keycode.info/


