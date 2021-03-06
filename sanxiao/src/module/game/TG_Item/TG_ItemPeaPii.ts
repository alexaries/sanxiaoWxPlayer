/**
 * Created by ZhangHui on 2018/6/4.
 * 月饼类 皇冠坑
 */
class TG_ItemPeaPii extends TG_Item{
     /*普通元素块*/
   public constructor(){
       super();
   }
    public text:egret.TextField;
    public Create(layerid,row,col){
        //layerid
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];

        this.isMove = true;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(false);
        this.canFallDown = true;
        let color=obj.color;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);

        // this.text = new ImageTextShow().drawText(this.item.width,this.item.height);
        // if(this.text){
        //     this.addChild(this.text);
        // }
        this.initItemW_H();//初始化宽高
        return this.item;
    }

    /*普通爆炸*/
    public DoExplode(){

    }

    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}