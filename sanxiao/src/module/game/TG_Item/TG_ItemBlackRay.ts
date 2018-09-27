/**
 * Created by ZhangHui on 2018/6/28.
 */
/**
 * Created by ZhangHui on 2018/6/21.
 */
class TG_ItemBlackRay extends TG_Item{
    /*黑射线*/
    private static tG_ItemBird:TG_ItemBird;
    public static getInstance(){
        if(!this.tG_ItemBird){
            this.tG_ItemBird=new TG_ItemBird();
        }
        return this.tG_ItemBird;
    }
    //黑洞
    public Create(layerid:string="2098"){
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
    /*创建射线*/
    private line;
    public CreateLine(){
        this.line=TG_Object.Create("item_bullet_png");
        this.addChild(this.line);
        return this.line;
    }
    /*创建特效块*/
    public EffectType;
    public LastType;
    public  Color;
    private blackHole;
    private layerid;
    public CreateBlackHole(color,type,currentCount,temp){
        //temp 原位置的元素块
        this.EffectType = type;
        if (this.EffectType == Msg.EffectType.ET_Hor || this.EffectType == Msg.EffectType.ET_Vel){
            if(currentCount%2==0){
                this.LastType=type;
            }else {
                this.LastType = type == Msg.EffectType.ET_Hor ? Msg.EffectType.ET_Vel : Msg.EffectType.ET_Hor;
            }
        }else{
            this.LastType = this.EffectType;
        }
        this.Color = color;
        let layerid=TG_Blocks.GetBlockIdByEffectTypeAndColor(this.LastType,this.Color);
        this.layerid=layerid;
        this.blackHole= TG_CreateItem.CreateItems(this.layerid,-1,0,0,this.LastType);
        this.addChild(this.blackHole);
        this.SetEffectType(this.LastType);
        this.SetBlockId(this.layerid);
        temp.SetEffectType(this.LastType);
        temp.SetIsBullet(true);
        temp.SetBulletPos(temp.SitePos);
        temp.alpha=0;
        this.SetTargetIndex(currentCount);
        return this.blackHole;
    }
    private TargetIndex;
    private StartBlockHolePos;
    private IsEffectAlreadyExplode=false;
    public SetTargetIndex(index) {
        this.TargetIndex = index;
    }
    public GetTargetIndex(){
        return this.TargetIndex;
    }
    public SetStartBlockHolePos(pos) {
        this.StartBlockHolePos = pos;
        this.SitePos=this.StartBlockHolePos;
    }
    public GetStartBlockHolePos(){
        return this.StartBlockHolePos;
    }
    public SetAlreadyExplode(flag){
        this.IsEffectAlreadyExplode = flag;
    }
    public GetAlreadyExplode(){
        return this.IsEffectAlreadyExplode;
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}