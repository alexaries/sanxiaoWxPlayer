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
 * Created by HuDe Zheng on 2018/7/6.
 */
var ConfigGameData = (function (_super) {
    __extends(ConfigGameData, _super);
    function ConfigGameData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.PropImage = {
            1: "refresh_png",
            2: "hammer_png",
            3: "heng_png",
            4: "shu_png",
            5: "bomb_png",
            6: "exchange_png",
            7: "addstep3_png",
            8: "addstep5_png",
            9: "addtime10_png",
            10: "addtime20_png"
        };
        return _this;
    }
    return ConfigGameData;
}(BaseClass));
__reflect(ConfigGameData.prototype, "ConfigGameData");
//# sourceMappingURL=ConfigGameData.js.map