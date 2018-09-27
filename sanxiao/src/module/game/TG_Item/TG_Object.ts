/**
 * Created by ZhangHui on 2018/6/11.
 */
class TG_Object extends egret.Bitmap{
    /*简易对象池*/
    public static  cacheDict=[];
    public textureName:string;
    public constructor(texture:any,textureName:string){
        super(texture);
        this.textureName=textureName;
    }
    //创建对象
    public static Create(textureName:string):TG_Object{
        if(TG_Object.cacheDict[textureName]==null){
            TG_Object.cacheDict[textureName]=[];
        }
        let dict=TG_Object.cacheDict[textureName];
        let obj:TG_Object;
        if(dict.length>0){
            obj=dict.pop();
            obj.texture = RES.getRes(textureName);
        }else {
            obj= new TG_Object(RES.getRes(textureName),textureName);
        }
        return obj;
    }
    //回收对象
    public static Release(bit:any){
        let textureName:string=bit.textureName;
        if(TG_Object.cacheDict[textureName]==null){
            TG_Object.cacheDict[textureName]=[];
        }
        let dict=TG_Object.cacheDict[textureName];
        if(dict.indexOf(bit)==-1){
            dict.push(bit);
        }
    }
}