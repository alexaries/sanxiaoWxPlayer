/**
 * Created by HuDe Zheng on 2018/7/5.
 */

class TG_Role_Model extends BaseClassSprite
{
    //缩放比
    public pxy:number = 1;

    //阴影
    // public roleShadow:egret.Sprite;
    //人物模型容器
    public roleSp:egret.Sprite;

    //第一层 面妆 和 鞋子
    public layer1:egret.Sprite = new egret.Sprite();
    //第2层 套装 和 发型
    public layer2:egret.Sprite = new egret.Sprite();
    //第3层 头饰 和 套装
    public layer3:egret.Sprite = new egret.Sprite();
    //第4层 丝袜  和 发型
    public layer4:egret.Sprite = new egret.Sprite();
    //第五层 裤子
    public layer5:egret.Sprite = new egret.Sprite();
    //第六层 上衣
    public layer6:egret.Sprite = new egret.Sprite();
    //第七层 外套
    public layer7:egret.Sprite = new egret.Sprite();
    //第八层 鞋子
    public layer8:egret.Sprite = new egret.Sprite();
    private bg:egret.Bitmap;
    private bodyArr:Array<egret.Bitmap>;


    private roleSp1:egret.Sprite;

    private allSp:egret.Sprite;

    public constructor(_sex:number,roleArr:Array<any>,_pxy:number)
    {
        super();
        this.pxy = _pxy;
        this.allSp = new egret.Sprite();
        this.addChild(this.allSp);
        if(_sex == 1)
        {
            this.bg = ObjectPool.pop("egret.Bitmap");
            this.bg.texture = RES.getRes("nv_suti_png");
        }
        else
        {
            this.bg = ObjectPool.pop("egret.Bitmap");
            this.bg.texture = RES.getRes("nan_suti_png");
        }
        this.bg.x = 0;
        this.bg.y = 0;

        this.roleSp1 = new egret.Sprite();
        this.allSp.addChild(this.roleSp1);
        this.roleSp1.addChild( this.bg);
        for(let i=0;i < 8;i++)
        {
            this.roleSp1.addChild(this["layer"+(i+1)]);
        }

        this.bodyArr = [];

        this.init(roleArr)

        this.scaleX = this.pxy;
        this.scaleY = this.pxy;

        // this.roleShadow = new egret.Sprite();
        // // this.roleShadow.visible = false;
        // this.roleShadow.graphics.beginFill(0,1);
        // this.roleShadow.graphics.drawEllipse(0,0,this.width1,this.width1/4);
        // this.roleShadow.graphics.endFill();
        //
        // Tool.getInstance().setAnchorPoint(this.roleShadow);
        // this.roleShadow.x = (this.width )/2 ;
        // this.roleShadow.y = (this.height ) + this.roleShadow.height/2 + 60;
        // // var gl = new GlowFilter(0,0.8,30,30);
        // // this.roleShadow.filters = [gl,gl];
        // this.allSp.addChild( this.roleShadow);
        // this.cacheAsBitmap = true;
        // this.roleShadow.alpha = 0.4;
        // this.roleShadow.scaleX = 0.4;
        // this.roleShadow.scaleY = 0.4;
        // this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    public get height1():number
    {
        return this.height * this.pxy;
    }
    public get width1():number
    {
        return this.width * this.pxy;
    }
    public avaterObj_xy = {
        1: {
            1: [140, 155],
            2: [270, 290],
            3: [140, 0],
            4: [160, 597],
            5: [160, 597],
            6: [160, 597],
            7: [160, 800],
            8: [160, 800],
            9: [285, 1015],
            10: [0, 0]
        },
        2:{
            1:[140,155],
            2:[268,220],
            3:[140,0],
            4:[160,470],
            5:[160,800],
            6:[265,1015],
            7:[0,0]
        }
    }
    public init(roleArr:Array<any>)
    {
        for(let i =0 ;i < roleArr.length;i++)
        {
            let av_id = roleArr[i];
            if(av_id <= 0 )
                continue;
            let obj = TG_MapData.getInstance().userAvaterConfigXml[av_id];
            let avaterType = obj.AvaterType;//装备类型
            let iconName = obj.IconName;//图标纹理名称
            let avaterSex = obj.AvaterSex;//性别 1女孩 2男孩
            let avaterDepth = obj.AvaterDepth;//装备层
            let iconStr = iconName + "_png";
            let bit:egret.Bitmap = ObjectPool.pop("egret.Bitmap");
            bit.texture = RES.getRes(iconStr)
            this.bodyArr.push(bit);
            this["layer"+ avaterDepth].addChild(bit);
            bit.x =   this.avaterObj_xy[avaterSex][avaterType][0];
            bit.y =   this.avaterObj_xy[avaterSex][avaterType][1];
        }
    }
    public clear()
    {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
        this.bg.texture = null;
        App.DisplayUtils.removeFromParent(this.bg);
        ObjectPool.push(this.bg);
        for(let i = 0;i <   this.bodyArr.length;i++)
        {
            let bit =   this.bodyArr[i];
            App.DisplayUtils.removeFromParent(bit);
            bit.texture = null;
            ObjectPool.push(bit);
        }
    }

    /**
     * 播放上下浮动动画
     */
    public play()
    {
        this.stop()
        App.TimerManager.doFrame(2,0,this.runRoleFrame,this);
    }

    /**
     * 停止播放动画
     */
    public stop()
    {
        App.TimerManager.remove(this.runRoleFrame,this);
    }
    //0下降 2上升
    public frameType = 1;
    public temp = 60;

    public runRoleFrame()
    {
        if(this.frameType)
        {
            this.temp --;
            if( this.temp <= 0)
                this.frameType = 0;
            this.roleSp1.y += 1;
            // this.roleShadow.scaleX += 0.005;
            // this.roleShadow.scaleY += 0.005;
        }
        else
        {
            this.temp ++;
            if( this.temp >= 60)
                this.frameType = 1;
            this.roleSp1.y -= 1;
            // this.roleShadow.scaleX -= 0.005;
            // this.roleShadow.scaleY += 0.005;
        }
        // this.roleShadow.scaleY =  this.roleShadow.scaleX;
    }

    public static createModel(avatar,roleArr,pxy:number = 0.3):TG_Role_Model
    {
        let role:TG_Role_Model = new TG_Role_Model(avatar,roleArr,pxy);

        // let roleSp:egret.Sprite = new egret.Sprite();
        //
        //
        // roleSp.addChild(role);
        return role;

        // this.role.width = 880 * 0.2;
        // this.role.height = 1186 * 0.2;


        // this.roleSp.graphics.beginFill(0,0.6);
        // this.roleSp.graphics.drawRect(0,0,this.roleSp.width,this.roleSp.height);
        // this.roleSp.graphics.endFill();

        // this.roleSp.x = bm1_1.x + bm1_1.height;
        // this.roleSp.y = 50;

        // this.gatherSp.x = this.roleSp.x + this.roleSp.width;
    }
}