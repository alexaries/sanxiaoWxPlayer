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
 * Created by HuDe Zheng on 2018/7/9.
 */
var BaseProxy = (function (_super) {
    __extends(BaseProxy, _super);
    function BaseProxy(_controller) {
        var _this = _super.call(this) || this;
        _this._controller = _controller;
        return _this;
    }
    return BaseProxy;
}(BaseClass));
__reflect(BaseProxy.prototype, "BaseProxy");
//# sourceMappingURL=BaseProxy.js.map