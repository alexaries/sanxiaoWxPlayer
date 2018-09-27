/**
 * Created by ZhangHui on 2018/6/4.
 * 月饼类 皇冠
 */
class TG_ItemPea extends TG_Item{
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

        this.text = new ImageTextShow().drawText(this.item.width,this.item.height);
        if(this.text){
            this.addChild(this.text);
        }
        this.initItemW_H();//初始化宽高
        return this.item;
    }

    /*普通爆炸*/
    public DoExplode(){
        console.info(456);
        // this.life -= 1;
        // if (this.life <= 0)
        // {
        //     //设置爆炸状态为true
        //     this.SetExploding(true);
        //     this.isDetonate = true;
        //     TG_Game.getInstance().DoExplode(this);
        // }
        // else
        // {
        //
        // }
    }

    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }


    /*改变文字*/
    public changeText(row,col,rowMarkNum=0,colMarkNum=0){
        if(this.text){
            this.text.text="["+col+","+row+"]"+"\n"+"【"+colMarkNum+","+rowMarkNum+"】";
        }
    }


}