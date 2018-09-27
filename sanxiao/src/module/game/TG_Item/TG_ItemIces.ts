/**
 * Created by Administrator on 2018/6/28.
 * 冰层
 * （表现层: 第三层）
 */
class TG_ItemIces extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.life = Number(layerid)%10;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));

        this.initItemW_H();//初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isIces = true;
        return this.item;
    }
    /*普通爆炸*/
    public DoExplode(){
        this.life -= 1;
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeIce);
        if (this.life <= 0)
        {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else
        {
            this.BlockId-=1;
            let imageName=TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            this.item.texture=RES.getRes(imageName+"_png")
        }
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}