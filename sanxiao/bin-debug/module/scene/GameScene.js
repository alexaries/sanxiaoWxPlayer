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
 * Created by HuDe Zheng on 2018/7/17.
 * 游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    /**
     * 构造函数
     */
    function GameScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    GameScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.addLayerAt(LayerManager.Game_Main, 0);
        this.addLayer(LayerManager.Game_UI);
        this.addLayer(LayerManager.UI_Message);
        LayerManager.Game_UI.addChild(Panel_PopupLayer.getInstance());
        // App.ViewManager.open(ViewConst.Game);
        // App.ViewManager.open(ViewConst.GameUI);
    };
    /**
     * 退出Scene调用
     */
    GameScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return GameScene;
}(BaseScene));
__reflect(GameScene.prototype, "GameScene");
//# sourceMappingURL=GameScene.js.map