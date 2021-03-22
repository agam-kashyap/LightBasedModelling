export default class Shader
{
    constructor(gl, vertexShaderSrc, fragmentShaderSrc)
    {
        this.gl = gl;
        this.vertexShaderSrc = vertexShaderSrc;
        this.fragmentShaderSrc = fragmentShaderSrc;

        this.vertexShader = this.compile(gl.VERTEX_SHADER, this.vertexShaderSrc);
        this.fragmentShader = this.compile(gl.FRAGMENT_SHADER, this.fragmentShaderSrc);

        this.program = this.link(this.vertexShader, this.fragmentShader);
    }

    compile(type, shaderSrc)
    {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderSrc);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
        {
            console.error(`Error while compiling shader ${shaderSrc}`);
            throw new Error(this.gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    link(vertexShader, fragmentShader)
    {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
        {
            console.error(`Error while linking shaders`);
            throw new Error(this.gl.getProgramInfoLog(program));
        }

        return program;
    }

    attribute(attributeName)
    {
        return this.gl.getAttribLocation(this.program, attributeName);
    }

    use()
    {
        this.gl.useProgram(this.program);
    }
    cleanup()
    {
        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteProgram(this.program);       
    }

    uniform(uniformName)
	{
		return this.gl.getUniformLocation(this.program, uniformName);
	}

	setUniform4f(uniformLocation, vec4)
	{
		this.gl.uniform4f(uniformLocation, ...vec4);
    }
    
    setUniformMatrix4fv(uniformLocation, mat4)
    {
        this.gl.uniformMatrix4fv(uniformLocation, false, mat4);
    }
}