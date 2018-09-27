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
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Panel.getInstance = function () {
        if (!this.panel) {
            this.panel = new Panel();
        }
        return this.panel;
    };
    /*初始化层级*/
    Panel.prototype.initLayerLev = function () {
        /*游戏层*/
        this.MainThis.addChild(Panel_GameLayer.getInstance());
        /*弹框层*/
        this.MainThis.addChild(Panel_AlertLayer.getInstance());
        /*浮框层*/
        this.MainThis.addChild(Panel_PopupLayer.getInstance());
        /*加载层*/
        // this.MainThis.addChild(Panel_LoadLayer.getInstance());
    };
    return Panel;
}(Main));
__reflect(Panel.prototype, "Panel");
//# sourceMappingURL=Panel.js.map