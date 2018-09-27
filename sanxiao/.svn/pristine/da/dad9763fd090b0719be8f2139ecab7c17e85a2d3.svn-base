import numberToBlendMode = egret.sys.numberToBlendMode;
/**
 * Created by HuDe Zheng on 2018/7/24.
 */

//道具宝箱类
class TG_PropBox extends TG_Item
{
    public constructor()
    {
        super();
    }
    private num_Tex:egret.TextField;
    private prop_item:egret.Bitmap;

    public Create(layerid,row,col)
    {
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];

        this.isMove = false;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(true);
        this.canFallDown = obj.canFallDown=="0"?false:true;
        let imageName=obj.image;
        let color=obj.color;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);

        let porpObj =  TG_MapData.getInstance().stageData["Stage"].PropChests;

        this.setPropObj(porpObj);
        if(this.propObj.length <= 0) return null;

        this.prop_item = new egret.Bitmap();
        this.addChildAt(this.prop_item,0);
        this.num_Tex = Tool.getInstance().getText(40,this.life.toString());
        this.num_Tex.x = this.width/2 - this.num_Tex.width/2;
        this.num_Tex.y = 5;
        this.addChild(this.num_Tex);

        this.plays();//开始播放动画

       this.randomCreat();//生成道具
        this.prop_item.width = this.itemWidth *0.6;
        this.prop_item.height = this.itemWidth *0.6;
        this.prop_item.x = this.width/2 - this.prop_item.width/2;
        this.prop_item.y = this.height/2 - this.prop_item.height/2;
        this.isPropBox = true;//是宝箱

    }
    public randomCreat()
    {
        let n:number = Math.floor(Math.random()*this.propObj.length);
        let obj:any = this.propObj[n];
        this.propId =obj.type;
        this.propNum = obj.num;
    }
    //当前显示索引
    private playIndex:number = 0;
    private stop:boolean = false;


    public plays()
    {
        if(this.stop) return ;
        let img = ConfigGameData.getInstance().PropImage;

        if(this.playIndex >= this.propObj.length)
        {
            this.playIndex = 0;
        }
        let obj:any = this.propObj[ this.playIndex];
        if(!obj) return;




        let tween = egret.Tween.get(this.prop_item);
        tween.to({alpha:0},1000);
        //tween.wait(1000);
        tween.call(function (){
            egret.Tween.removeTweens(this.prop_item);
            let tween1 = egret.Tween.get(this.prop_item);
            tween1.to({alpha:1},1000);
            let texture:string = img[obj.type];
            this.prop_item.texture = RES.getRes(texture);
            tween1.call(function (){
                    egret.Tween.removeTweens(this.prop_item);
                    this.plays();
                },this
            )

            },this
        )
        this.playIndex++;
    }

    private propObj:any = [];

    public setPropObj(prop:any)
    {
        let index = this.Index; //根据index获取道具宝箱
        for(let i = 0;i < prop.length;i++)
        {
            let obj:any = prop[i];
            if(obj.Idx == index)
            {
                this.life = obj.HitTimes;
                let temp1:any = obj.PropIds;
                let temp2:any = obj.PropNums;//貌似默认都是1，暂时没啥用
                for(let j = 0;j <temp1.length;j++)
                {
                    let obj_temp:any = {type:temp1[j],num:1};
                    this.propObj.push(obj_temp);
                }


            }
        }
    }
    /*普通爆炸*/
    public DoExplode(){
        this.life -= 1;
        if (this.life <= 0)
        {
            this.stop = true;
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else
        {
            // this.BlockId-=1;
            // let imageName=TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            // this.item.texture=RES.getRes(imageName+"_png")
            this.num_Tex.text = this.life.toString();
        }
    }

}