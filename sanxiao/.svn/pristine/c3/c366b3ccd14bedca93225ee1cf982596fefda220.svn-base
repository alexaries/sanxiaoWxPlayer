/**
 * Created by Administrator on 2018/6/28.
 * 创建云层数据 第八层
 */
class TG_ItemClouds extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let str= LoadNetworkImageUtils.getResNameByLayerId(layerid);
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        // let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item=TG_Object.Create(str);
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        // 5001 life =1 5002 life = 2
        this.life=Number(layerid)%10;
        this.SetIsCanAroundDetonate(true);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H();//初始化宽高
        return this.item;
    }

    /*普通爆炸*/
    public DoExplode(){
        this.life -= 1;
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeCloud);
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoCloudExplode(this);
        }  else{
            this.BlockId-=1;
            this.item.texture=RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId))
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