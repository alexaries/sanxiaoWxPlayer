var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by HuDe Zheng on 2018/7/9.
 */
/**
 * Model基类
 */
var BaseModel = (function () {
    function BaseModel() {
    }
    return BaseModel;
}());
__reflect(BaseModel.prototype, "BaseModel");
//# sourceMappingURL=BaseModel.js.map