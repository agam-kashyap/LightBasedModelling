import Renderer from './renderer.js';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Arrow from './Arrow.js';
import Triangle from './Triangle.js';
import Mesh from './3DMesh.js';
import SuperMesh from './SuperMesh.js';

/* Canvas Setup Begins */
const renderer = new Renderer();
const gl = renderer.webGlContext();

// renderer.clear();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
/* Canvas Setup Ends */


/************************* 
** Projection values **
*************************/  

var proj = {
    fovy: Math.PI/3,
    aspect: window.innerWidth/ window.innerHeight,
    near: 1,
    far: 10000,
}
/************************* 
******* Camera Setup *****
*************************/
var camera = {
    eye: {
        x: 150,
        y: 150,
        z: 150,
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
    radius: 1000,
}

var CameraAngle = Math.PI/1000;
var CameraAxis = vec3.fromValues(0,1,0);
var CameraTransformMatrix = mat4.create();
mat4.identity(CameraTransformMatrix);

/************************* 
** Reading Mesh objects **
*************************/
var CubeAngle = 0;
var CubeRead=false;
var CubeAngleX=0;
var CubeRotationAxis= vec3.create();
vec3.set(CubeRotationAxis, 1, 0, 0);
var CubeColor = new Float32Array([0.2, 0.7, 0.6, 1.0]);
var CubeToggle=false;
var CubeSelected = false;
var CubeMesh;

fetch('./models/Cube/cube.obj')
    .then(response => response.text())
    .then(data => {
        var CubeMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        console.log(CubeMeshObject);
        CubeMesh = new Mesh(gl, CubeMeshObject, CubeAngleX, CubeRotationAxis, proj, new Float32Array([0.2, 0.7, 0.6, 1.0]), camera);
        CubeRead = true;
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
/////////////////////////////////////////////////////
window.onload = () => 
{
    // renderer.getCanvas().addEventListener('click', (event) =>
    // {
    //     animate();
    //     let pointerX = event.clientX;
    //     let pointerY = event.clientY;

    //     let render_area = renderer.getCanvas().getBoundingClientRect();
    //     pointerX = pointerX - render_area.left;
    //     pointerY = render_area.bottom - pointerY;

    //     var pixels = new Uint8Array(4);
    //     gl.readPixels(pointerX, pointerY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    //     if(SelectMode == true && mode_value==7)
    //     {
    //         // Face Selection
    //         var FaceCube = CubeMesh.isFaceSelected(pixels);
    //         var FaceRandom = RandomMesh.isFaceSelected(pixels);
    //         var FaceTorus = TorusMesh.isFaceSelected(pixels);
    //         if(FaceCube == 1)
    //         {
    //             RandomMesh.resetSelected();
    //             TorusMesh.resetSelected();
    //         }
    //         else if(FaceRandom == 1)
    //         {
    //             CubeMesh.resetSelected();
    //             TorusMesh.resetSelected();
    //         }
    //         else if(FaceTorus == 1)
    //         {
    //             CubeMesh.resetSelected();
    //             RandomMesh.resetSelected();
    //         }
    //         else
    //         {
    //             CubeMesh.resetSelected();
    //             RandomMesh.resetSelected();
    //             TorusMesh.resetSelected();
    //         }
    //     }
    //     else if(SelectMode == false && mode_value==7)
    //     {
    //         // Object Selection

    //         if(pixels[0] == Math.round(CubeColor[0]*255) && pixels[1] == Math.round(CubeColor[1]*255) &&
    //             pixels[2] >= Math.round(CubeColor[2]*255) && pixels[2] <= Math.round((CubeColor[2]+0.05)*255) && pixels[3] == Math.round(CubeColor[3]*255))
    //             {
    //                 CubeSelected = true;
    //                 RandomSelected = false;
    //                 TorusSelected = false;
    //             }
    //         else if(pixels[0] == Math.round(RandomColor[0]*255) && pixels[1] == Math.round(RandomColor[1]*255) &&
    //             pixels[2] >= Math.round(RandomColor[2]*255) && pixels[2] <= Math.round((RandomColor[2]+0.03)*255) && pixels[3] == Math.round(RandomColor[3]*255))
    //             {
    //                 CubeSelected = false;
    //                 RandomSelected = true;
    //                 TorusSelected = false;
    //             }
    //         else if(pixels[0] == Math.round(TorusColor[0]*255) && pixels[1] == Math.round(TorusColor[1]*255) &&
    //         pixels[2] >= Math.round(TorusColor[2]*255) && pixels[2] <= Math.round((TorusColor[2]+0.03)*255) && pixels[3] == Math.round(TorusColor[3]*255))
    //             {
    //                 CubeSelected = false;
    //                 RandomSelected = false;
    //                 TorusSelected = true;
    //             }
    //         else
    //         {
    //             CubeSelected = false;
    //             RandomSelected = false;
    //             TorusSelected = false;
    //         }
    //     }
    // });

    // renderer.getCanvas().addEventListener("mousedown", (event) => {
    //     if(mode_value == 6)
    //     {
    //         let mouseX = event.clientX;
    //         let mouseY = event.clientY;

    //         let render_area = renderer.getCanvas().getBoundingClientRect();
    //         mouseX = mouseX - render_area.left;
    //         mouseY = mouseY - render_area.top;

    //         MouseCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);
            
    //         [MouseDownX, MouseDownY] = MouseCoordinates;
    //         CameraMouseDragY = true;
    //     }
    // });
    // renderer.getCanvas().addEventListener("mouseup", (event) => {
    //     CameraMouseDragY = false;
    // });
 
    // document.addEventListener("mousemove" , (ev)=> {
    //     let mouseX = ev.clientX;
    //     let mouseY = ev.clientY;

    //     let render_area = renderer.getCanvas().getBoundingClientRect();
    //     mouseX = mouseX - render_area.left;
    //     mouseY = mouseY - render_area.top;

    //     MouseCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);
    //     if(CameraMouseDragY == true && mode_value == 6)
    //     {
    //         var moveX = MouseCoordinates[0] - MouseDownX;
    //         var radius = 100;
    //         if(moveX >= 0) //Moved in positive X direction
    //         {
    //             // radius*theta = moveX
    //             CameraAngle = moveX/radius;
    //             var tempCamera = camera;
    //             tempCamera.eye.x = camera.radius * Math.sin(CameraAngle);
    //             tempCamera.eye.y = camera.eye.y;
    //             tempCamera.eye.z = camera.radius * Math.cos(CameraAngle);

    //             ArrowY.updateCamera(tempCamera);
    //             ArrowX.updateCamera(tempCamera);
    //             ArrowZ.updateCamera(tempCamera);
    //             CubeMesh.updateCamera(tempCamera);
    //             RandomMesh.updateCamera(tempCamera);
    //             TorusMesh.updateCamera(tempCamera);
    //             CentreTriangle.updateCamera(tempCamera);
    //         }
    //         else
    //         {
    //             CameraAngle = moveX/radius;
    //             var tempCamera = camera;
    //             tempCamera.eye.x = camera.radius * Math.sin(CameraAngle);
    //             tempCamera.eye.y = camera.eye.y;
    //             tempCamera.eye.z = camera.radius * Math.cos(CameraAngle);

    //             ArrowY.updateCamera(tempCamera);
    //             ArrowX.updateCamera(tempCamera);
    //             ArrowZ.updateCamera(tempCamera);
    //             CubeMesh.updateCamera(tempCamera);
    //             RandomMesh.updateCamera(tempCamera);
    //             TorusMesh.updateCamera(tempCamera);
    //             CentreTriangle.updateCamera(tempCamera);
    //         }
    //     }
    // });


    // document.addEventListener("keydown", (ev) => {

    //     if(ev.key == "ArrowLeft" && mode_value == 6)
    //     {
    //         CameraAngle += Math.PI/100;
    //         var tempCamera = camera;
    //         tempCamera.eye.x = camera.radius * Math.sin(CameraAngle);
    //         tempCamera.eye.y = camera.eye.y;
    //         tempCamera.eye.z = camera.radius * Math.cos(CameraAngle);

    //         ArrowY.updateCamera(tempCamera);
    //         ArrowX.updateCamera(tempCamera);
    //         ArrowZ.updateCamera(tempCamera);
    //         CubeMesh.updateCamera(tempCamera);
    //         RandomMesh.updateCamera(tempCamera);
    //         TorusMesh.updateCamera(tempCamera);
    //         CentreTriangle.updateCamera(tempCamera);
    //     }
        
    //     else if(ev.key == "ArrowRight" && mode_value == 6)
    //     {
    //         CameraAngle -= Math.PI/100;
    //         var tempCamera = camera;
    //         tempCamera.eye.x = camera.radius * Math.sin(CameraAngle);
    //         tempCamera.eye.y = camera.eye.y;
    //         tempCamera.eye.z = camera.radius * Math.cos(CameraAngle);

    //         ArrowY.updateCamera(tempCamera);
    //         ArrowX.updateCamera(tempCamera);
    //         ArrowZ.updateCamera(tempCamera);
    //         CubeMesh.updateCamera(tempCamera);
    //         RandomMesh.updateCamera(tempCamera);
    //         TorusMesh.updateCamera(tempCamera);
    //         CentreTriangle.updateCamera(tempCamera);
    //     }

    //     else if(ev.key == "r" && mode_value == 5)
    //     {
    //         CentreTriangleToggle=true;

    //         // Place Cube at the center of side AB of the triangle
    //         CubeToggle = true;
    //         CubeMesh.setRotate(vec3.fromValues(0,1,0), CubeAngle += Math.PI/2);
    //         CubeMesh.updateMVPMatrix();
    //         // Place Random at the center of side BC of triangle
    //         RandomToggle = true;
    //         RandomMesh.setRotate(vec3.fromValues(0,0,1), RandomAngle += Math.PI/2);
    //         RandomMesh.updateMVPMatrix();
    //         // Place Torus at the center of side CA of triangle
    //         TorusToggle = true;
    //         TorusMesh.setRotate(vec3.fromValues(1,0,0), TorusAngle += Math.PI/2);
    //         TorusMesh.updateMVPMatrix();        
    //     }

    //     else if(ev.key == 'Escape')
    //     {
    //         terminate = true;
    //     }
    // });


};


//////////////////////////////////////////////////////
////////////////////////////////////////////////////

// Mouse Coordinates in Canvas system
var mouseXElement = document.querySelector('#mousex');
var mouseX = document.createTextNode("");
mouseXElement.appendChild(mouseX);

var mouseYElement = document.querySelector('#mousey');
var mouseY = document.createTextNode("");
mouseYElement.appendChild(mouseY);


function animate()
{

    renderer.clear();
    if(typeof MouseCoordinates[0] != 'undefined')
    {
        mouseX.nodeValue = MouseCoordinates[0].toPrecision(4);
        mouseY.nodeValue = MouseCoordinates[1].toPrecision(4);
    }
    if(CubeRead== true)
        CubeMesh.draw(shader, false);
    
    // Activated by pressing 'Escape' key
    if(terminate == false)
        window.requestAnimationFrame(animate);
    else
        window.cancelAnimationFrame(animate);
}

animate();
shader.cleanup();

// Key Presses link = https://keycode.info/