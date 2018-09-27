/**
 * Created by Administrator on 2018/6/28.\
 * 棋盘背景层 -1 1001-1006
 *
 */
class TG_ItemBgButton  extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        //layerid
        let layeridStr = layerid.toString();
        // 先创建地板层
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        // let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.CanFallThrough=obj.canFallThrough=="1"?true:false;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
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
}