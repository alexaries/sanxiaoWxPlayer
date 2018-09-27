var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by HuDe Zheng on 2018/6/28.
 * 所有类的基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    /**
     * 返回该类对象的单例
     * 最多支持携带2个参数，如果需要，可以再进行扩展
     * */
    BaseClass.getInstance = function () {
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
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
//# sourceMappingURL=BaseClass.js.map