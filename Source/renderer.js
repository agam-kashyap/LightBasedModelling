export default class Renderer
{
    constructor()
    {
        this.canvas = document.createElement("canvas");
        this.canvas.className = 'Canvas1'
        document.querySelector("body").appendChild(this.canvas);
        
        const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

        if (!gl) throw new Error("WebGL not supported");
        // gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.ALWAYS);
        this.gl = gl;

        this.resizeCanvas();
    }

    webGlContext()
    {
        return this.gl;
    }

    mouseToClipCoord(mouseX,mouseY) {

		// convert the position from pixels to 0.0 to 1.0
		mouseX = mouseX - this.canvas.width/2;
		mouseY = mouseY - this.canvas.height/2;	
		mouseY = -mouseY; // Coordinates in clip space

		return [mouseX, mouseY]
    }
    
    resizeCanvas()
    {
        this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    getCanvas()
    {
        return this.canvas;
    }
    clear()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.0,0.0,0.0,0.1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}