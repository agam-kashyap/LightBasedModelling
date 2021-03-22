import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
    constructor()
	{
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 1, 0);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.mvpMatrix = this.modelTransformMatrix;

		this.updateMVPMatrix();
		this.tempTranslate = vec3.fromValues(0, 0, 0);
		this.tempX = 0;
		this.tempY = 0;
	}
    
    getModelMatrix()
	{
		return this.modelTransformMatrix;
	}

	// Keep in mind that modeling transformations are applied to objects in the opposite of the order in which they occur in the code
	updateMVPMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
        mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);
        mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}

	resetMVPMatrix()
	{
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues(0,0,0);
		this.updateMVPMatrix();
	}
	setRotateTranslate(bigX, bigY)
	{
		this.tempX = bigX;
		this.tempY = bigY;
	}
	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}

	getRotate()
	{
		return this.rotate;
	}
};