/**
 * Created by HuDe Zheng on 2018/8/07.
 */
class ExitController extends BaseController
{
    private view:ExitView


    public constructor() {
        super();
        this.view = new ExitView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameExit, this.view);

        this.view.bg.touchEnabled = true;
        this.view.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backHandler,this);
        this.view.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backHandler,this);
        this.view.replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rePlayHandler,this);


        this.view.musicGroup1.touchChildren = false;
        this.view.musicGroup2.touchChildren = false;

        this.view.musicGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.musicHandler,this);
        this.view.musicGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.musicHandler,this);

        //本关详情按钮
        this.view.gameDetailBtn.touchEnabled=true;
        this.view.gameDetailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameDetailBtnEvent,this);
    }
    //本关详情按钮点击事件
    public gameDetailBtnEvent(){
        alert("关卡详情介绍,敬请期待!")
    }
    public musicHandler(e:egret.TouchEvent)
    {
        if(e.target ==  this.view.musicGroup1)
        {
            App.SoundManager.setBgOn(!App.SoundManager.getBgOn());
        }
        else if(e.target ==  this.view.musicGroup2)
        {
           alert("敬请期待!")
             // App.SoundManager.setEffectOn(!App.SoundManager.getEffectOn());
        }
        this.view.refreshIconState();
    }
    public rePlayHandler()
    {
        this.backHandler(null);
        App.MessageCenter.dispatch(Msg.Event.RePlay);
    }
    private backHandler(e)
    {
         App.ViewManager.close(ViewConst.GameExit);
    }
    public init()
    {

    }


}
