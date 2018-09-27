/**
 * Created by Administrator on 2018/6/28.
 */
class TG_ItemHairBall extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item=TG_Object.Create(imageName+"_png");
        this.initItemW_H();//初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isMove = false;
        // this.CanAroundDetonate = true;
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