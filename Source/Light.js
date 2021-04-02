export default class LightProperties
{
    constructor(Ka, Kd, Ks, AmbientColor, DiffuseColor, SpecularColor, shininess, limit=0.5, LightPos)
    {
        this.ka = Ka;
        this.kd = Kd;
        this.ks = Ks;

        this.amColor = AmbientColor;
        this.difColor = DiffuseColor;
        this.specColor = SpecularColor;

        this.shininess = shininess;
        this.limit = limit;

        this.LightPos = LightPos;
    }

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