/**
 * Created by Hu Dezheng on 2018/7/11.
 * 榛子类
 */
class TG_ItemHazel extends TG_Item{
     /*普通元素块*/
   public constructor(){
       super();
   }
    public text:egret.TextField;
    public Create(layerid,row,col){
        //layerid
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        //不可以被特效穿过
        this.canThrough = false;
        this.isMove = true;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(true);
        this.canFallDown = obj.canFallDown=="0"?false:true;
        let imageName=obj.image;
        let color=obj.color;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.initItemW_H();//初始化宽高
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

        return this.item;
    }
    /*普通爆炸*/
    public DoExplode(){
        this.life -= 1;
        if (this.life <= 0)
        {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else
        {

        }
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