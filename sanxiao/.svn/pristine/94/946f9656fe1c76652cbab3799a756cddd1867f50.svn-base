/**
 * Created by ZhangHui on 2018/5/31.
 */
class BaseController1{
    /*单例*/
    private static baseController:BaseController1;
    public static getInstance(){
        if(!this.baseController){
            this.baseController=new BaseController1();
        }
        return this.baseController;
    }
    /*启动控制器*/
    public startBaseController(){
        /*连接服务器*/
        this.connectServerNet();
        /*启动离开页面，重新切回的时间*/
        this.welcomeBack();
    }
    /*连接服务器*/
    private connectServerNet(){
        BaseController_Proxy.getInstance().connectServer();
    }
    /*启动离开页面，重新切回的时间*/
    public autoBackFunWelcome:Function;
    private welcomeBack(){
        BaseController_welcomeBack.getInstance().autoBackFunWelcome=this.autoBackFunWelcomeEvent.bind(this);
        BaseController_welcomeBack.getInstance().initWelcomeBack();
    }
    /*监听切回事件*/
    private autoBackFunWelcomeEvent(){
        Log.getInstance().trace("监听到切回事件")
    }
    /*监听游戏开始事件*/
    public gameStartEvent(){
        //移除加载页面
        // LoadView.getInstance().removeLoadingView();
        //通知开始
        Panel_GameLayerCtr.getInstance().gameStart();
    }








}