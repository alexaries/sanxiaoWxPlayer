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
var Panel_GameLayer = (function (_super) {
    __extends(Panel_GameLayer, _super);
    function Panel_GameLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Panel_GameLayer.getInstance = function () {
        if (!this.panel_GameLayer) {
            this.panel_GameLayer = new Panel_GameLayer();
        }
        return this.panel_GameLayer;
    };
    /*开始游戏*/
    Panel_GameLayer.prototype.initPanel = function () {
        // this.addChild(GamePanel.getInstance());
        LayerManager.Game_Main.addChild(GamePanel.getInstance());
        GamePanel.getInstance().initGamePanel();
        // App.ViewManager.open(ViewConst.Prop);
    };
    return Panel_GameLayer;
}(egret.Sprite));
__reflect(Panel_GameLayer.prototype, "Panel_GameLayer");
//# sourceMappingURL=Panel_GameLayer.js.map