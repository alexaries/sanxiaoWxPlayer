class Button extends egret.Sprite{
    public card:egret.Bitmap;
    private str1="";
    public constructor(str1) {
        super();
        this.str1 = str1;
        this.addCard(this.str1);
        this.anchorOffsetX=this.width/2;
        this.anchorOffsetY=this.height/2;
    }
    //添加事件
    public addTouchEvent():void{
        this.touchEnabled=true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
    }
    //鼠标按下事件
    private touchBegin(e:egret.TouchEvent):void{
        egret.Tween.get(this).to({scaleX:1.04,scaleY:1.04},50);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchEnd,this);
    }
    //鼠标弹起
    private touchEnd(e:egret.TouchEvent):void{
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchEnd,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEnd,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchEnd,this);
        this.scaleX=this.scaleY=1;
        //派发点击事件
        this.dispatchEvent(new egret.Event("click"));
    }
    //销毁
    public clear():void{
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
    }
    private addCard(str1) {
        if (this.card == null) {
            this.card = new egret.Bitmap();
            this.addChild(this.card);
        }
        this.card.texture = RES.getRes(str1);
        this.card.anchorOffsetX = this.card.width / 2;
        this.card.anchorOffsetY = this.card.height / 2;
        this.card.x=this.card.width/2;
        this.card.y=this.card.height/2;
    }
}



