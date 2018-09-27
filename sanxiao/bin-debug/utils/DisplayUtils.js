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
 * Created by Hu Dezheng on 2018/7/6.
 * 显示对象工具类
 */
var DisplayUtils = (function (_super) {
    __extends(DisplayUtils, _super);
    /**
     * 构造函数
     */
    function DisplayUtils() {
        return _super.call(this) || this;
    }
    /**
     * 从父级移除child
     * @param child
     */
    DisplayUtils.prototype.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    return DisplayUtils;
}(BaseClass));
__reflect(DisplayUtils.prototype, "DisplayUtils");
//# sourceMappingURL=DisplayUtils.js.map