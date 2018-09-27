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
 * Created by HuDe Zheng on 2018/6/28.
 * 所有view类的基类
 */
var BaseClassSprite = (function (_super) {
    __extends(BaseClassSprite, _super);
    function BaseClassSprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 返回该类对象的单例
     * 最多支持携带2个参数，如果需要，可以再进行扩展
     * */
    BaseClassSprite.getInstance = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var Class = this;
        var len = param.length;
        if (!Class._instance) {
            if (len == 0)
                Class._instance = new Class();
            else if (len == 1)
                Class._instance = new Class(param[0]);
            else if (len == 2)
                Class._instance = new Class(param[0], param[1]);
        }
        return Class._instance;
    };
    BaseClassSprite.prototype.removeself = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    return BaseClassSprite;
}(egret.DisplayObjectContainer));
__reflect(BaseClassSprite.prototype, "BaseClassSprite");
//# sourceMappingURL=BaseClassSprite.js.map