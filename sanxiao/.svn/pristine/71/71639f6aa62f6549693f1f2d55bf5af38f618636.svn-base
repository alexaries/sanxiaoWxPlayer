/**
 * Created by Hu Dezheng on 2018/7/12.
 * 填充物
 */
class TG_ItemNull extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.life = 1;
        this.SetColorType(color);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.setItemNone(true);
        if(obj.itemType==ItemType.TG_ITEM_TYPE_NULL){
            //空块
            this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
            this.initItemW_H();//初始化宽高
            this.addChild(this.item);
            this.SetItemWidth(this.item.width);
        }
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