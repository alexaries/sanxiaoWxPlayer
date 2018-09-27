/**
 * Created by HuDe Zheng on 2018/7/17.
 * 简易加载进度
 */
class EasyLoading extends BaseClass {

    private content:egret.Sprite = null;
    private speed:number = 10 / (1000 / 60);
    private averageUtils:AverageUtils;
    private uiImageContainer:egret.DisplayObjectContainer;

    constructor() {
        super();
        this.init();
    }

    private init():void {
        this.averageUtils = new AverageUtils();


        this.content = new egret.Sprite();
        this.content.graphics.beginFill(0x000000, 0.2);
        this.content.graphics.drawRect(0, 0,  Main.stageWidth,  Main.stageHeight);
        this.content.graphics.endFill();
        this.content.touchEnabled = true;

        this.uiImageContainer = new egret.DisplayObjectContainer();
        this.uiImageContainer.x = this.content.width * 0.5;
        this.uiImageContainer.y = this.content.height * 0.5;
        this.content.addChild(this.uiImageContainer);

        RES.getResByUrl("resource/assets/load_Reel.png", function(texture:egret.Texture):void{
            var img:egret.Bitmap = new egret.Bitmap();
            img.texture = texture;
            img.x = -img.width * 0.5;
            img.y = -img.height * 0.5;
            this.uiImageContainer.addChild(img);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }

    public showLoading():void {

        App.StageScaleMode.getStage().addChild(this.content);
        App.TimerManager.doFrame(1, 0, this.enterFrame, this);
    }

    public hideLoading():void {
        if (this.content && this.content.parent) {
            this.content.parent.removeChild(this.content);
            this.uiImageContainer.rotation = 0;
        }
        App.TimerManager.remove(this.enterFrame, this);
    }

    private enterFrame(time:number) {
        this.averageUtils.push(this.speed * time);
        this.uiImageContainer.rotation += this.averageUtils.getValue();
    }
    public onProgress(current: number, total: number): void {
        let wid1 = current/total;
        if(Math.floor(wid1) * 100 >= 100)
        {
           App.MessageCenter.dispatch(Msg.Event.NetLoadComplete);
        }
    }
}
