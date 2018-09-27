/**
 * Created by Hu Dezheng on 2018/7/11.
 * 流沙
 * （表现层: 第三层）
 */
class TG_ItemFlowIce extends TG_Item {
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
        this.item=TG_Object.Create(imageName+"_png");
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isFlowIces = true;//冰和流沙都通用
        this.initItemW_H();//初始化宽高
        return this.item;
    }
    /**
     * 开始流动
     * @constructor
     */
    public  DoFlow()
    {
        this.isFlow = true;
        TG_Game.getInstance().DoIceFlow(this)
        // Game.DoIceFlow(this);
    }

    /**
     * 流动结束
     * @constructor
     */
    public  DoFlowEnd()
    {
        this.isFlow = false;
    }
    /*普通爆炸*/
    public DoExplode(){
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeFlowIce);
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
            this.BlockId-=1;
            this.item.texture=RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId));
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