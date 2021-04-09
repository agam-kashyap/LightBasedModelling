import Transform from './transform.js';
import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class LightProperties
{
    constructor()
    {
        this.LightStruct = {
            ka : 1.0,
            kd : 1.0,
            ks : 1.0,

            AmbientColor : vec3.fromValues(1.0, 1.0, 1.0),
            DiffuseColor : vec3.fromValues(1.0, 1.0, 1.0),
            SpecularColor : vec3.fromValues(1.0, 1.0, 1.0), 
            LightPos : vec3.fromValues(0,0,0),
            isOn : 1,
        }

        this.shininess = 10;
        this.limit = 0.5;
    }

    setKa(ka){this.LightStruct.ka = ka;}
    setKd(kd){this.LightStruct.kd = kd;}
    setKs(ks){this.LightStruct.ks = ks;}
    setAmbient(Color){this.LightStruct.AmbientColor = Color;}
    setDiffuse(Color){this.LightStruct.DiffuseColor = Color;}
    setSpecular(Color){this.LightStruct.SpecularColor = Color;}
    setShine(shine){this.shininess = shine;}

    getKa(){return this.LightStruct.ka;}
    getKd(){return this.LightStruct.kd;}
    getKs(){return this.LightStruct.ks;}
    getAmbient(){return this.LightStruct.AmbientColor;}
    getDiffuse(){return this.LightStruct.DiffuseColor;}
    getSpecular(){return this.LightStruct.SpecularColor;}
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
        return this.LightStruct.LightPos;
    }
    setPosition(LightPos)
    {
        this.LightStruct.LightPos = LightPos;
    }
    getStruct()
    {
        return this.LightStruct;
    }

    setLight(val)
    {
        this.LightStruct.isOn = val;
    }

};