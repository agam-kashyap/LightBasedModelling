import Renderer from './renderer.js';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Mesh from './3DMesh.js';

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
        z: 300,
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
    radius: 300,
}

var CameraAngleX = Math.PI/1000;
var CameraAngleY = Math.PI/1000;
var CameraAxis = vec3.fromValues(0,1,0);
var CameraTransformMatrix = mat4.create();
mat4.identity(CameraTransformMatrix);

/************************* 
** Reading Mesh objects **
*************************/
// var CubeAngle = 0;
// var CubeRead=false;
// var CubeAngleX=0;
// var CubeRotationAxis= vec3.create();
// vec3.set(CubeRotationAxis, 1, 0, 0);
// var CubeColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
// var CubeToggle=false;
// var CubeSelected = false;
// var CubeMesh;

// fetch('./models/Cube/cube.obj')
//     .then(response => response.text())
//     .then(data => {
//         var CubeMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
//         console.log(CubeMeshObject);
//         CubeMesh = new Mesh(gl, CubeMeshObject, CubeAngleX, CubeRotationAxis, proj, CubeColor, camera);
//         CubeRead = true;
//     })

var CubeAngle = 0;
var CubeRead=false;
var CubeAngleX=0;
var CubeRotationAxis= vec3.create();
vec3.set(CubeRotationAxis, 1, 0, 0);
var CubeColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var CubeToggle=false;
var CubeSelected = false;
var CubeMesh;

fetch('./models/sphere.obj')
    .then(response => response.text())
    .then(data => {
        var CubeMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        console.log(CubeMeshObject);
        CubeMesh = new Mesh(gl, CubeMeshObject, CubeAngleX, CubeRotationAxis, proj, CubeColor, camera);
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
        if(CameraMouseDragY == true)
        {
            var moveX = MouseCoordinates[0] - MouseDownX;
            var moveY = MouseCoordinates[1] - MouseDownY;

            // var tempCamera = camera;
            if(moveX > 0)
                {CameraAngleX = moveX/camera.radius;}
            else
                {CameraAngleX = moveX/camera.radius;}
            
            if(moveY > 0)
                {
                    CameraAngleY = moveY/camera.radius;
                }
            else
                    CameraAngleY = moveY/camera.radius;}

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

            if(CubeRead)
                CubeMesh.updateCamera(camera);
        }
    );


    document.addEventListener("keydown", (ev) => {

        if(ev.key == "ArrowLeft")
        {   
            console.log(CubeMesh.translation);
            CubeMesh.translateX -= 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();
        }
        
        else if(ev.key == "ArrowRight")
        {
            console.log(CubeMesh.translation);
            CubeMesh.translateX += 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();
        }

        if(ev.key == "ArrowUp")
        {   
            console.log(CubeMesh.translation);
            CubeMesh.translateY += 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();
        }
        
        else if(ev.key == "ArrowDown")
        {
            console.log(CubeMesh.translation);
            CubeMesh.translateY -= 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();
        }

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

    //     else 
        if(ev.key == 'Escape')
        {
            terminate = true;
        }
    });


};


//////////////////////////////////////////////////////
////////////////////////////////////////////////////
function animate()
{

    renderer.clear();

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