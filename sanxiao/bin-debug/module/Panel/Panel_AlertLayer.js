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
var Panel_AlertLayer = (function (_super) {
    __extends(Panel_AlertLayer, _super);
    function Panel_AlertLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Panel_AlertLayer.getInstance = function () {
        if (!this.panel_AlertLayer) {
            this.panel_AlertLayer = new Panel_AlertLayer();
        }
        return this.panel_AlertLayer;
    };
    return Panel_AlertLayer;
}(egret.Sprite));
__reflect(Panel_AlertLayer.prototype, "Panel_AlertLayer");
//# sourceMappingURL=Panel_AlertLayer.js.map