import Renderer from './renderer.js';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Mesh from './3DMesh.js';
import LightProperties from './Light.js';

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

/******************
 * 
 * Object Light based Properties
 *****************/
var Matte = new LightProperties(0.33, 0.27, 0, 
    vec3.fromValues(0.81, 0.81, 0.81),
    vec3.fromValues(0.666, 0, 0.8),
    vec3.fromValues(1.0,1.0,1.0),
    20,
    0.5,
    vec3.fromValues(100,100,100));

var Gold = new LightProperties(1.0, 1.0, 1.0,
    vec3.fromValues(0.0, 0.0, 0.0),
    vec3.fromValues(0.752, 0.606, 0.226),
    vec3.fromValues(0.628, 0.556, 0.366),
    10,
    Math.PI/6,
    vec3.fromValues(100,100,100))
/************************* 
** Reading Mesh objects **
*************************/
var CubeAngle = 0;
var CubeRead=false;
var CubeAngleX=0;
var CubeRotationAxis= vec3.create();
vec3.set(CubeRotationAxis, 1, 0, 0);
var CubeColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var CubeToggle=false;
var CubeSelected = false;
var CubeScaling = 70;
var CubeMesh;

fetch('./models/Cube/cube.obj')
    .then(response => response.text())
    .then(data => {
        var CubeMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(CubeMeshObject);
        CubeMesh = new Mesh(gl, CubeMeshObject, CubeAngleX, CubeRotationAxis, proj, CubeColor, camera, CubeScaling, Gold);
        CubeRead = true;
    })

////////////////////////////////////////////////////
////////////////////Sphere//////////////////////////
var SphereAngle = 0;
var SphereRead=false;
var SphereAngleX=0;
var SphereRotationAxis= vec3.create();
vec3.set(SphereRotationAxis, 1, 0, 0);
var SphereColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var SphereToggle=false;
var SphereSelected = false;
var SphereScaling = 70;
var SphereMesh;

fetch('./models/Sphere/sphere.obj')
    .then(response => response.text())
    .then(data => {
        var SphereMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(SphereMeshObject);
        SphereMesh = new Mesh(gl, SphereMeshObject, SphereAngleX, SphereRotationAxis, proj, SphereColor, camera, SphereScaling, Gold);
        SphereRead = true;
    })

////////////////////////////////////////////////////
////////////////////Deer//////////////////////////
var DeerAngle = 0;
var DeerRead=false;
var DeerAngleX=0;
var DeerRotationAxis= vec3.create();
vec3.set(DeerRotationAxis, 1, 0, 0);
var DeerColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var DeerToggle=false;
var DeerSelected = false;
var DeerScaling = 0.1;
var DeerMesh;

fetch('./models/Deer/deer.obj')
    .then(response => response.text())
    .then(data => {
        var DeerMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(DeerMeshObject);
        DeerMesh = new Mesh(gl, DeerMeshObject, DeerAngleX, DeerRotationAxis, proj, DeerColor, camera, DeerScaling, Matte);
        DeerRead = true;
    })

////////////////////////////////////////////////////
////////////////////Monkey//////////////////////////
var MonkeyAngle = 0;
var MonkeyRead=false;
var MonkeyAngleX=0;
var MonkeyRotationAxis= vec3.create();
vec3.set(MonkeyRotationAxis, 1, 0, 0);
var MonkeyColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var MonkeyToggle=false;
var MonkeySelected = false;
var MonkeyScaling = 70;
var MonkeyMesh;

fetch('./models/monkey.obj')
    .then(response => response.text())
    .then(data => {
        var MonkeyMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(MonkeyMeshObject);
        MonkeyMesh = new Mesh(gl, MonkeyMeshObject, MonkeyAngleX, MonkeyRotationAxis, proj, MonkeyColor, camera, MonkeyScaling, Gold);
        MonkeyRead = true;
    })
////////////////////////////////////////////////////
////////////////////Aircraft//////////////////////////
var AircraftAngle = 0;
var AircraftRead=false;
var AircraftAngleX=0;
var AircraftRotationAxis= vec3.create();
vec3.set(AircraftRotationAxis, 1, 0, 0);
var AircraftColor = new Float32Array([0.7, 0.1, 0.2, 1.0]);
var AircraftToggle=false;
var AircraftSelected = false;
var AircraftScaling = 70;
var AircraftMesh;

fetch('./models/Aircraft/Aircraft.obj')
    .then(response => response.text())
    .then(data => {
        var AircraftMeshObject = JSON.parse(JSON.stringify(new objLoader.Mesh(data)));
        // console.log(AircraftMeshObject);
        AircraftMesh = new Mesh(gl, AircraftMeshObject, AircraftAngleX, AircraftRotationAxis, proj, AircraftColor, camera, AircraftScaling);
        AircraftRead = true;
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
            if(SphereRead)
                SphereMesh.updateCamera(camera);
            if(MonkeyRead)
                MonkeyMesh.updateCamera(camera);
            if(DeerRead)
                DeerMesh.updateCamera(camera);
        }
    );


    document.addEventListener("keydown", (ev) => {

        if(ev.key == "ArrowLeft")
        {   
            CubeMesh.translateX -= 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();

            MonkeyMesh.translateX -= 10
            vec3.set(MonkeyMesh.translation, MonkeyMesh.translateX, MonkeyMesh.translateY, 0);
            MonkeyMesh.transform.setTranslate(MonkeyMesh.translation);
            MonkeyMesh.transform.updateMVPMatrix();
        }
        
        else if(ev.key == "ArrowRight")
        {
            CubeMesh.translateX += 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();

            MonkeyMesh.translateX += 10
            vec3.set(MonkeyMesh.translation, MonkeyMesh.translateX, MonkeyMesh.translateY, 0);
            MonkeyMesh.transform.setTranslate(MonkeyMesh.translation);
            MonkeyMesh.transform.updateMVPMatrix();
        }

        if(ev.key == "ArrowUp")
        {   
            CubeMesh.translateY += 10
            vec3.set(CubeMesh.translation, CubeMesh.translateX, CubeMesh.translateY, 0);
            CubeMesh.transform.setTranslate(CubeMesh.translation);
            CubeMesh.transform.updateMVPMatrix();
        }
        
        else if(ev.key == "ArrowDown")
        {
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
    
    // if(SphereRead== true)
    //     SphereMesh.draw(shader, false);

    // if(MonkeyRead== true)
    //     MonkeyMesh.draw(shader, false);
    
    // if(DeerRead== true)
        // DeerMesh.draw(shader, false);

    // if(SwordRead== true)
    //     SwordMesh.draw(shader, false);

    // if(AircraftRead== true)
    //     AircraftMesh.draw(shader, false);
    
    // if(BugattiRead== true)
    //     BugattiMesh.draw(shader, false);
    // Activated by pressing 'Escape' key
    if(terminate == false)
        window.requestAnimationFrame(animate);
    else
        window.cancelAnimationFrame(animate);
}

animate();
shader.cleanup();

// Key Presses link = https://keycode.info/