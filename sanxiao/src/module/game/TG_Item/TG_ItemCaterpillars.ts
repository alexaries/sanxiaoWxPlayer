/**
 * Created by Wang Guang on 2018/09/21.\
 *毛虫层 id:98 layerid:8001  itemType:81
 *
 */
class TG_ItemCaterpillars  extends TG_Item {
    public constructor(){
        super();
    }
    public Create(layerid,row =-1,col = -1,preIndex = -1, curIndex = -1, behindIndex = -1){

        let prePos = this.GetPosByIndex(preIndex);
        let curPos = this.GetPosByIndex(curIndex);
        let behindPos = this.GetPosByIndex(behindIndex);
        if(curPos == prePos){
            //头部
            this.SetCaterpillarHeadRotation(curPos,behindPos);
        }else if(curPos == behindPos){
            //尾部

        }else if(curPos != prePos && curPos != behindPos){
            //身体

        }
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let color=obj.color;
        this.itemType = obj.itemType;
        this.CanFallThrough=obj.canFallThrough=="1"?true:false;
        this.SetColorType(color);
        this.item=this.SetCaterpillarHeadRotation(curPos,behindPos);
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H();//初始化宽高
        return this.item;
    }
    /**
     * 头部方向
     */
    public SetCaterpillarHeadRotation(curPos, behindPos){
        this.item = TG_Object.Create("item_chongzi1_png");
        // this.item.rotation = 180;
        return this.item;
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}