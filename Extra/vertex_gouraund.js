const vertexShaderSrc = `      
    attribute vec3 aPosition;  
    attribute vec3 aColor;
    attribute vec3 aNormal;

		uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    uniform mat4 mWorldInverseTranspose;

    struct PointLight{
      vec3 uLightPosition;
      vec3 uAmbientLightColor;
      vec3 uDiffuseLightColor;
      vec3 uSpecularLightColor;
    
      float k_a;
      float k_d;
      float k_s;

      float shininess;
    };

    uniform PointLight pointLights[4];
    uniform vec3 uViewWorldPosition;
    
    varying vec3 vColor; 

    void main () {             
      gl_Position = mProj * mView * mWorld * vec4(aPosition, 1.0); 
      
      vec3 normal = normalize(mat3(mWorldInverseTranspose)*aNormal);

      vec4 surfaceWorldPosition = mWorld * vec4(aPosition,1.0);
      
      vec3 result = vec3(0.0,0.0,0.0);
      for(int i=0; i<4;i++){
        vec3 v_surfaceToLight = normalize(pointLights[i].uLightPosition - vec3(surfaceWorldPosition));
        vec3 v_surfaceToView = normalize(uViewWorldPosition - vec3(surfaceWorldPosition));

        vec3 halfVector = normalize(v_surfaceToLight + v_surfaceToView);
        float nDotLight = max(dot(v_surfaceToLight,normal),0.0);
      
        float spec = 0.0;
        float light = dot(normal,v_surfaceToLight);
        if(light > 0.0){
          spec = max(pow(dot(halfVector,normal),pointLights[i].shininess),0.0);
        }

        float dis = distance(vec3(surfaceWorldPosition),pointLights[i].uLightPosition);
        float attenuation = 1.0/(1.0 + (0.1*dis) + (0.01*dis*dis));

        // color due to diffuse and ambient reflection
        vec3 ambient = pointLights[i].uAmbientLightColor * aColor * pointLights[i].k_a;
        vec3 diffuse = pointLights[i].uDiffuseLightColor * aColor * nDotLight * pointLights[i].k_d;
        vec3 specular = pointLights[i].uSpecularLightColor * aColor * spec * pointLights[i].k_s;

        result += ambient + (diffuse + specular)*attenuation;
      }

      vColor = result;
    }         
	  `;

export default vertexShaderSrc;
