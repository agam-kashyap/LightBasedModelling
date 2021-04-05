import Transform from './transform.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class LightProperties
{
    constructor()
    {
        this.ka = 1.0;
        this.kd = 1.0;
        this.ks = 1.0;

        this.amColor = vec3.fromValues(1.0, 1.0, 1.0);
        this.difColor = vec3.fromValues(1.0, 1.0, 1.0);
        this.specColor = vec3.fromValues(1.0, 1.0, 1.0);

        this.shininess = 10;
        this.limit = 0.5;

        this.LightPos = vec3.fromValues(0,0,0);
        this.transform = new Transform();
        
    }

    setKa(ka){this.ka = ka;}
    setKd(kd){this.kd = kd;}
    setKs(ks){this.ks = ks;}
    setAmbient(Color){this.amColor = Color;}
    setDiffuse(Color){this.difColor = Color;}
    setSpecular(Color){this.specColor = Color;}
    setShine(shine){this.shininess = shine;}

    getKa(){return this.ka;}
    getKd(){return this.kd;}
    getKs(){return this.ks;}
    getAmbient(){return this.amColor;}
    getDiffuse(){return this.difColor;}
    getSpecular(){return this.specColor;}
    getShine(){return this.shininess;}

    getLimit()
    {
        return this.limit;
    }
    setLimit(limit)
    {
        this.limit = limit;
    }
    getPosition()
    {
        return this.LightPos;
    }
    setPosition(LightPos)
    {
        this.LightPos = LightPos;
    }

};