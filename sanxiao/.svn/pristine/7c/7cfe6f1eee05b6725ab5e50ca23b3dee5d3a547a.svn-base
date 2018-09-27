/**
 * Created by ZhangHui on 2018/8/16.
 * 魔法石
 */
class TG_ItemMagicStone extends TG_Item {
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
        this.SetIsCanAroundDetonate(true);
        this.Name=obj.name;
        this.CheckOrientation();
        this.NextId=obj.nextID;
        this.ExplodeCount=0;
        this.text = new ImageTextShow().drawText(this.item.width,this.item.height);
        if(this.text){
            this.addChild(this.text);
        }
        return this.item;
    }
    public Orientation=1;//方向
    public ExplodeCount=0;//爆炸次数
    public Name="";
    /*魔法石的方向*/
    private CheckOrientation() {
        if (this.Name.indexOf("上")>-1){
            this.Orientation = 1;
        }
        else if (this.Name.indexOf("下")>-1){
            this.Orientation = 2;
        }
        else if (this.Name.indexOf("左")>-1){
            this.Orientation = 3;
        }
        else if (this.Name.indexOf("右")>-1){
            this.Orientation = 4;
        }
    }

    /*普通爆炸*/
    public DoExplode(){
        if(!this.IsAsyncExplode){
            if (TG_Game.getInstance().DoCheck2FloorExplode(this)){
                return;
            }
            // 当达到爆炸状态
            if (this.BlockId == this.NextId){
                this.SetAsyncExplode(true);
            }
            else{
                TG_Game.getInstance().DoMagicStoneExplode(this);
            }
        }
    }
    public DoAsyncExplode(){
        if (this.IsAsyncExplode){
            if (!this.Exploding && this.ExplodeCount < 3)
            {
                this.SetExploding(true);
                this.ExplodeCount++;
                TG_Game.getInstance().SpecialExplodeTriangle(this.SitePos, this.Orientation);
            }
            this.SetAsyncExplode(false);
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