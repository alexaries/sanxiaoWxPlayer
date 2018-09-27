var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/5/31.
 */
var BaseController1 = (function () {
    function BaseController1() {
    }
    BaseController1.getInstance = function () {
        if (!this.baseController) {
            this.baseController = new BaseController1();
        }
        return this.baseController;
    };
    /*启动控制器*/
    BaseController1.prototype.startBaseController = function () {
        /*连接服务器*/
        this.connectServerNet();
        /*启动离开页面，重新切回的时间*/
        this.welcomeBack();
    };
    /*连接服务器*/
    BaseController1.prototype.connectServerNet = function () {
        BaseController_Proxy.getInstance().connectServer();
    };
    BaseController1.prototype.welcomeBack = function () {
        BaseController_welcomeBack.getInstance().autoBackFunWelcome = this.autoBackFunWelcomeEvent.bind(this);
        BaseController_welcomeBack.getInstance().initWelcomeBack();
    };
    /*监听切回事件*/
    BaseController1.prototype.autoBackFunWelcomeEvent = function () {
        Log.getInstance().trace("监听到切回事件");
    };
    /*监听游戏开始事件*/
    BaseController1.prototype.gameStartEvent = function () {
        //移除加载页面
        // LoadView.getInstance().removeLoadingView();
        //通知开始
        Panel_GameLayerCtr.getInstance().gameStart();
    };
    return BaseController1;
}());
__reflect(BaseController1.prototype, "BaseController1");
//# sourceMappingURL=BaseController.js.map