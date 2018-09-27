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
 * Created by HuDe Zheng on 2018/7/30.
 */
var BeginController = (function (_super) {
    __extends(BeginController, _super);
    function BeginController() {
        var _this = _super.call(this) || this;
        _this.currTabIndex = 0;
        _this.view = new BeginView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Begin, _this.view);
        _this.view.beginBtn.visible = false;
        //默认打开loding背景
        _this.view.LodingBack.visible = true;
        App.MessageCenter.addListener("jiazaijindu", _this.jindu, _this);
        _this.view.datile_view.init();
        _this.view.datile_view.rankViewId.init();
        return _this;
        //this.view.rank_view.init();
        // this.view.rank_group.init();
    }
    BeginController.prototype.jindu = function (current, total) {
        var wid1 = current / total;
        this.view.loadingBar.width = (this.view.loadingBarBg.width) * wid1;
        this.view.numField.text = Math.floor(wid1 * 100) + "%";
        if (Math.floor(wid1) * 100 >= 100) {
            this.LodingOver();
        }
    };
    BeginController.prototype.LodingOver = function () {
        this.view.BeginRect.visible = true;
        this.view.tabBar.setContainer(this.view.datile_group, this.view.rank_group);
        this.view.tabBar.setSelectCallFun(this.changePageViewHandler, this);
        var author = TG_MapData.getInstance().stageData.Stage.Author;
        var TextureUrl = TG_MapData.getInstance().stageData.Stage.TextureUrl; //封面信息
        this.view.LodingBack.visible = false;
        this.initStartBtn();
    };
    BeginController.prototype.initStartBtn = function () {
        this.view.beginBtn.visible = true;
        this.view.loadingBar.visible = false;
        this.view.loadingBarBg.visible = false;
        this.view.numField.visible = false;
        this.view.beginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginGame, this);
        this.view.beginBtn.alpha = 0;
        egret.Tween.get(this.view.beginBtn).to({ alpha: 1 }, 500).call(function () {
            egret.Tween.removeTweens(this.view.beginBtn);
        }.bind(this));
    };
    BeginController.prototype.beginGame = function (e) {
        var stageData = TG_MapData.getInstance().stageData;
        Log.getInstance().trace(stageData, 0);
        if (!stageData) {
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        var stage = stageData.Stage;
        Log.getInstance().trace(stage, 0);
        if (!stage) {
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        var blocks = stage.Blocks;
        Log.getInstance().trace(blocks, 0);
        if (!blocks) {
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        if (stageData && stage && blocks) {
            App.ViewManager.close(ViewConst.Begin); //关闭详情页面
            App.SceneManager.runScene(SceneConsts.Game); //进入游戏场景
            BaseController1.getInstance().gameStartEvent();
            // App.MessageCenter.dispatch(Msg.Event.BeginGame2)
        }
    };
    BeginController.prototype.changePageViewHandler = function () {
        var index = this.view.tabBar.getCurrentPageIndex();
        this.currTabIndex = index;
        this.refreshTabViewHandler();
    };
    BeginController.prototype.refreshTabViewHandler = function () {
        switch (this.currTabIndex) {
            case 0:
                Log.getInstance().trace("选择了详情页面");
                this.view.numField.text = "选择了详情页面";
                break;
            case 1:
                this.view.tabBar.setSelect(0);
                Panel_PopupLayer.getInstance().myAlert("排行榜暂未开放，敬请期待！", 2000);
                Log.getInstance().trace("选择了排行榜页面");
                this.view.numField.text = "选择了排行榜页面";
                break;
        }
    };
    return BeginController;
}(BaseController));
__reflect(BeginController.prototype, "BeginController");
//# sourceMappingURL=BeginController.js.map