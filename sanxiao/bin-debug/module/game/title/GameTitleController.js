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
var GameTitleController = (function (_super) {
    __extends(GameTitleController, _super);
    function GameTitleController() {
        var _this = _super.call(this) || this;
        //初始化页面
        _this.titleView = new GameTitleView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Title, _this.titleView);
        //初始化事件监听
        _this.InitEventListen();
        //初始化胜利目标位置
        _this.initVictoryPos();
        return _this;
    }
    /*初始化事件监听*/
    GameTitleController.prototype.InitEventListen = function () {
        this.RemoveEventListen();
        //返回按钮
        this.titleView.backBtn.touchEnabled = true;
        this.titleView.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backBtnEvent, this);
        //监听切换回合事件
        App.MessageCenter.addListener(Msg.Event.ChaneRound, this.updateRole, this);
        //监听时间模式321倒计时
        App.MessageCenter.addListener(Msg.Event.StartTimeLimitCountdown, this.startCountdown, this);
        //监听刷新游戏时间显示
        App.MessageCenter.addListener(Msg.Event.refreshTimeShow, this.refreshTime, this);
        //监听刷新游戏步数显示
        App.MessageCenter.addListener(Msg.Event.refreshStepShow, this.refreshStep, this);
        //监听刷新游戏分数显示
        App.MessageCenter.addListener(Msg.Event.refreshScoreShow, this.refreshScore, this);
        //监听刷新胜利目标
        App.MessageCenter.addListener(Msg.Event.refreshVictoryTask, this.refreshVictoryTask, this);
        //监听刷新失败目标
        App.MessageCenter.addListener(Msg.Event.refreshDefeatTask, this.refreshDefeatTask, this);
        //监听消除元素块飞到胜利目标位置
        App.MessageCenter.addListener(Msg.Event.itemFlyToVictoryTask, this.itemFlyToVictoryTask, this);
    };
    /*移除事件监听*/
    GameTitleController.prototype.RemoveEventListen = function () {
        App.MessageCenter.removeListener(Msg.Event.ChaneRound, this.updateRole, this);
        App.MessageCenter.removeListener(Msg.Event.StartTimeLimitCountdown, this.startCountdown, this);
        App.MessageCenter.removeListener(Msg.Event.refreshTimeShow, this.refreshTime, this);
        App.MessageCenter.removeListener(Msg.Event.refreshStepShow, this.refreshStep, this);
        App.MessageCenter.removeListener(Msg.Event.refreshScoreShow, this.refreshScore, this);
        App.MessageCenter.removeListener(Msg.Event.refreshVictoryTask, this.refreshVictoryTask, this);
        App.MessageCenter.removeListener(Msg.Event.refreshDefeatTask, this.refreshDefeatTask, this);
        App.MessageCenter.removeListener(Msg.Event.itemFlyToVictoryTask, this.itemFlyToVictoryTask, this);
    };
    /*刷新胜利目标*/
    GameTitleController.prototype.refreshVictoryTask = function (type, target) {
        this.titleView.refreshVictoryTask(type, target);
    };
    /*刷新失败目标*/
    GameTitleController.prototype.refreshDefeatTask = function (type, target) {
        this.titleView.refreshDefeatTask(type, target);
    };
    /*消除元素块飞到胜利目标位置*/
    GameTitleController.prototype.itemFlyToVictoryTask = function (type, temp) {
        if (type == GameStatus.GS_ARound) {
            this.titleView.flyToA(temp);
        }
        else if (type == GameStatus.GS_BRound) {
            this.titleView.flyToB(temp);
        }
    };
    /*返回按钮点击事件*/
    GameTitleController.prototype.backBtnEvent = function (e) {
        App.ViewManager.open(ViewConst.GameExit);
    };
    /*时间模式下的321倒计时*/
    GameTitleController.prototype.startCountdown = function () {
        this.titleView.begin_times();
    };
    /*刷新游戏时间显示*/
    GameTitleController.prototype.refreshTime = function (timeNum) {
        if (!TG_Stage.IsTimeLimit)
            return;
        this.titleView.updateTime(timeNum);
    };
    /*刷新游戏步数显示*/
    GameTitleController.prototype.refreshStep = function (type, stepNum) {
        if (TG_Stage.IsTimeLimit)
            return;
        if (type == GameStatus.GS_ARound) {
            //A
            this.titleView.updateStepNum(stepNum);
        }
        else {
            //B
        }
    };
    /*刷新游戏分数显示*/
    GameTitleController.prototype.refreshScore = function (type, score) {
        this.titleView.updateScore(type, score);
    };
    /*胜利目标显示位置*/
    GameTitleController.prototype.initVictoryPos = function () {
        if (!TG_Stage.SingelModel) {
            //pk模式
            this.titleView.winGroup.x = 301;
            this.titleView.winGroup.y = 290;
        }
    };
    /*切换小人的状态*/
    GameTitleController.prototype.updateRole = function (type) {
        if (TG_Stage.SingelModel) {
            return;
        }
        if (type == "我的回合") {
            //A回合
            this.titleView.roleBSp.stop();
            this.titleView.roleSp.play();
        }
        else {
            this.titleView.roleBSp.play();
            this.titleView.roleSp.stop();
        }
    };
    return GameTitleController;
}(BaseController));
__reflect(GameTitleController.prototype, "GameTitleController");
//# sourceMappingURL=GameTitleController.js.map