var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * Created by ZhangHui on 2018/6/1.
 */
var BaseController_welcomeBack = (function (_super) {
    __extends(BaseController_welcomeBack, _super);
    function BaseController_welcomeBack() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*刷新时间*/
        _this.lastTime = 0; //上个时间段的时间数值
        return _this;
    }
    BaseController_welcomeBack.getInstance = function () {
        if (!this.baseController_welcomeBack) {
            this.baseController_welcomeBack = new BaseController_welcomeBack();
        }
        return this.baseController_welcomeBack;
    };
    BaseController_welcomeBack.prototype.initWelcomeBack = function () {
        // egret.lifecycle.onPause = () => {
        //     egret.Ticker.getInstance().pause();
        // };
        // egret.lifecycle.onResume = () => {
        //     egret.Ticker.getInstance().resume();
        // };
        //用于统计暂时离开网页的时间
        App.TimerManager.doFrame(5, 0, this.update, this);
    };
    BaseController_welcomeBack.prototype.update = function () {
        //获取当前时间数值
        var cTime = (new Date()).valueOf();
        if (this.lastTime != 0 && (cTime - this.lastTime) > 5000) {
            Log.getInstance().trace("用户从后台切回H5");
            Panel_PopupLayer.getInstance().myAlert(PopupType.Pop_WelcomeBack, 2000);
            this.autoBackFunWelcome();
        }
        //临时赋值上个时间段的时间数值
        this.lastTime = Number(cTime);
    };
    return BaseController_welcomeBack;
}(BaseController1));
__reflect(BaseController_welcomeBack.prototype, "BaseController_welcomeBack");
//# sourceMappingURL=BaseController_welcomeBack.js.map