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
 * Created by HuDe Zheng on 2018/8/07.
 */
var ExitController = (function (_super) {
    __extends(ExitController, _super);
    function ExitController() {
        var _this = _super.call(this) || this;
        _this.view = new ExitView(_this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameExit, _this.view);
        _this.view.bg.touchEnabled = true;
        _this.view.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.backHandler, _this);
        _this.view.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.backHandler, _this);
        _this.view.replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.rePlayHandler, _this);
        _this.view.musicGroup1.touchChildren = false;
        _this.view.musicGroup2.touchChildren = false;
        _this.view.musicGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.musicHandler, _this);
        _this.view.musicGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.musicHandler, _this);
        //本关详情按钮
        _this.view.gameDetailBtn.touchEnabled = true;
        _this.view.gameDetailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.gameDetailBtnEvent, _this);
        return _this;
    }
    //本关详情按钮点击事件
    ExitController.prototype.gameDetailBtnEvent = function () {
        alert("关卡详情介绍,敬请期待!");
    };
    ExitController.prototype.musicHandler = function (e) {
        if (e.target == this.view.musicGroup1) {
            App.SoundManager.setBgOn(!App.SoundManager.getBgOn());
        }
        else if (e.target == this.view.musicGroup2) {
            alert("敬请期待!");
            // App.SoundManager.setEffectOn(!App.SoundManager.getEffectOn());
        }
        this.view.refreshIconState();
    };
    ExitController.prototype.rePlayHandler = function () {
        this.backHandler(null);
        App.MessageCenter.dispatch(Msg.Event.RePlay);
    };
    ExitController.prototype.backHandler = function (e) {
        App.ViewManager.close(ViewConst.GameExit);
    };
    ExitController.prototype.init = function () {
    };
    return ExitController;
}(BaseController));
__reflect(ExitController.prototype, "ExitController");
//# sourceMappingURL=ExitController.js.map