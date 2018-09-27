/**
 * 传送带出入口
 *
 */
class TG_ItemBeltsColor extends TG_Item{
   public constructor(){
       super();
   }
    public Create(layerid,direction,row,col){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = false;
        this.life = 0;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(false);
        this.canFallDown = false;
        let color=obj.color;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H();//初始化宽高
        this.SetDirection(direction);
        if(obj.portalColor){
            let portalColor=obj.portalColor;
            if (portalColor.length>0){
                let arr=portalColor.split("|");
                this.portalColor=arr;
            }
        }
        return this.item;
    }

    /*普通爆炸*/
    public DoExplode(){
        // 传送带不参与爆炸
    }

    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}