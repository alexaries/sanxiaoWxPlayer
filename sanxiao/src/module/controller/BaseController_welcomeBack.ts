/**
 * Created by ZhangHui on 2018/6/1.
 */
class BaseController_welcomeBack extends BaseController1{
    /*单例*/
    private static baseController_welcomeBack:BaseController_welcomeBack;
    public static getInstance(){
        if(!this.baseController_welcomeBack){
            this.baseController_welcomeBack=new BaseController_welcomeBack();
        }
        return this.baseController_welcomeBack;
    }
    public initWelcomeBack(){
        // egret.lifecycle.onPause = () => {
        //     egret.Ticker.getInstance().pause();
        // };
        // egret.lifecycle.onResume = () => {
        //     egret.Ticker.getInstance().resume();
        // };
        //用于统计暂时离开网页的时间
        App.TimerManager.doFrame(5,0,this.update,this);
    }
    /*刷新时间*/
    private lastTime:number=0;//上个时间段的时间数值
    private update(){
        //获取当前时间数值
        let cTime=(new Date()).valueOf();
        if(this.lastTime!=0&&(cTime-this.lastTime)>5000){
            Log.getInstance().trace("用户从后台切回H5");
            Panel_PopupLayer.getInstance().myAlert(PopupType.Pop_WelcomeBack,2000);
            this.autoBackFunWelcome();
        }
        //临时赋值上个时间段的时间数值
        this.lastTime=Number(cTime);
    }

}