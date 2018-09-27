/**
 * Created by ZhangHui on 2018/7/10.
 * 礼品盒
 */
class TG_ItemGift extends TG_Item {
    public constructor(){
        super();
    }
    public text:egret.TextField;
    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
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
        this.canFallDown = obj.canFallDown=="0"?false:true;
        this.isMove = false;
        this.itemType = obj.itemType;
        this.life=Number(layerid)%10;
        this.SetIsCanAroundDetonate(true);

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
            // 游戏中，飞到消除目标位置的动画
            TG_Game.getInstance().ItemFlyToGoal(this);
            //加分数
            TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeGift);
            this.BlockId-=1;
            let imageName=TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            this.item.texture=RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId));
        }
    }

    /*移除对象*/
    public Release(){
        if(this.item){
            this.life=0;
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