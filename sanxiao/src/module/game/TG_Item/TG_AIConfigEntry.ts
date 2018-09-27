/**
 * Created by ZhangHui on 2018/8/24.
 */
class TG_AIConfigEntry extends BaseClass{
    public _aiConfigDic={};
    /*初始化*/
    public InitAIConfigEntry(){
        let AIsystem:egret.XML = egret.XML.parse(RES.getRes("main.AIsystem_xml"));
       for (let i=0;i<AIsystem.children.length;i++){
           let id=0;
           for (let j in AIsystem.children[i]["attributes"]) {
               if (j == 'id') {
                   id = AIsystem.children[i]["attributes"][j];
               }
           }
           this._aiConfigDic[id]=AIsystem.children[i]["attributes"]
       }
    }
    public GetAiConfigEntry(id){
        if (this._aiConfigDic.hasOwnProperty(id))
        {
            return this._aiConfigDic[id];
        }
        return null;
    }
}