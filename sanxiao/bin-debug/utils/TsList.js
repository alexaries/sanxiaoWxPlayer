var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/7/17.
 */
var TsList = (function () {
    function TsList() {
    }
    TsList.size = function (arr) {
        return arr.length;
    };
    TsList.contains = function (arr, one) {
        var oneTemp;
        for (var i = 0; i < arr.length; i++) {
            oneTemp = arr[i];
            if (oneTemp == one) {
                return true;
            }
        }
        return false;
    };
    return TsList;
}());
__reflect(TsList.prototype, "TsList");
//# sourceMappingURL=TsList.js.map