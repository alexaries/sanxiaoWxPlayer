/**
 * Created by HuDe Zheng on 2018/8/10.
 */
class PropNewItem extends eui.ItemRenderer {

    public title:Group;
    public numTex:eui.Label;
    public propImg:eui.Image;
    public index:number = 0;
    public currentIndex:number=0;//当前处于的位置
    /**道具的类型
     * */
    public type:number = 0;
    /**
     * 可用数量
     * @type {number}
     */
    public num:number = 0;
    public constructor() {
        super();
        this.skinName = "propNewItem";
        this.cacheAsBitmap = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectHandler,this);

    }
    private selectHandler()
    {
        if (TG_Game.currentHairState != 1)
        {
            Panel_PopupLayer.getInstance().myAlert("毛球移动中！",2000);
            return;
        }
        if(this.num <= 0)
        {
            Panel_PopupLayer.getInstance().myAlert("没有足够数量无法使用此道具！",2000);
            return;
        }
        //被选中
        App.MessageCenter.dispatch(Msg.Event.SelectProp,this);
    }
    public itemData:any;

    /**
     *  灰色滤镜
     */
    public colorFililter = new egret.ColorMatrixFilter([
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ]
    );
    public refreshData(num:number,_type:number):void
    {
        if(_type == 1) {
            this.num += num;
        }
        else
        {
            this.num -= num;
        }
        if(this.num < 0)
        {
            this.num = 0;
        }
        this.refreshData2();
    }

    /**
     *  刷新状态
     */
    public refreshData2()
    {
        if(this.num <= 0)//this.itemData.rect == "mianfeidaoju_png")
        {
            this.hs();
        }
        else
        {
            this.bs();
            this.numTex.text = "免费" + this.num;
        }
    }
    public hs()
    {
        this.title.visible = false;
        //变成灰色
        this.filters = [this.colorFililter];
    }
    public bs()
    {
        //变亮
        this.title.visible = true;
        this.filters=[];
    }
}