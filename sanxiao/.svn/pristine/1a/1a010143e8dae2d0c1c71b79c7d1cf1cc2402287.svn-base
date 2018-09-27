/**
 * Created by ZhangHui on 2018/6/21.
 */
class TG_ItemBird extends TG_Item{
    /*飞鸟*/
    private static tG_ItemBird:TG_ItemBird;
    public static getInstance(){
        if(!this.tG_ItemBird){
            this.tG_ItemBird=new TG_ItemBird();
        }
        return this.tG_ItemBird;
    }
    /*创建对象*/
    public text:egret.TextField;
    public Create(layerid:string){
        //layerid
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let color=obj.color;
        let str=obj.image+"_png";
        this.item=TG_Object.Create(str);
        this.addChild(this.item);
         this.SetColorType(color);
        this.initItemW_H();//初始化宽高
          return this.item;
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
    public StartIndex;
    public StartPos;
    public TargetPos;
    public IsFlying=false;
    public TargetIndex;

    public SetStartIndex(index) {
        this.StartIndex = index;
    }
    public GetStartIndex(){
        return this.StartIndex;
    }
    public SetStartPos(pos) {
        this.StartPos = pos;
    }
    public GetStartPos(){
        return this.StartPos;
    }
    public SetTargetPos(pos) {
        this.TargetPos = pos;
    }
    public GetTargetPos(){
        return this.TargetPos;
    }
    public SetTargetIndex(index) {
        this.TargetIndex = index;
    }
    public GetTargetIndex(){
        return this.TargetIndex;
    }
    public StartFly() {
        this.IsFlying = true;
    }




}