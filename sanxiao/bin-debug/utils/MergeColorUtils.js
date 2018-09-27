var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MergeColorUtils = (function () {
    function MergeColorUtils() {
    }
    /**
     * rgb数值转egret rect颜色数值
     * @param r
     * @param g
     * @param b
     */
    MergeColorUtils.mergeColor = function (r, g, b) {
        return Math.floor((r * 256 + g) * 256 + b);
    };
    return MergeColorUtils;
}());
__reflect(MergeColorUtils.prototype, "MergeColorUtils");
//# sourceMappingURL=MergeColorUtils.js.map