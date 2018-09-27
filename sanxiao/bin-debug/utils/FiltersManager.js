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
 * RGB管理类
 */
var FiltersManager = (function (_super) {
    __extends(FiltersManager, _super);
    /**
     * 构造函数
     */
    function FiltersManager() {
        return _super.call(this) || this;
    }
    FiltersManager.prototype.Setfilters = function (image, arr) {
        if (arr.length < 3) {
            return;
        }
        var red = Number(arr[0]);
        var green = Number(arr[1]);
        var blue = Number(arr[2]);
        var colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = red / 255;
        colorMatrix[6] = green / 255;
        colorMatrix[12] = blue / 255;
        var colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        image.filters = [colorFilter];
    };
    return FiltersManager;
}(BaseClass));
__reflect(FiltersManager.prototype, "FiltersManager");
//# sourceMappingURL=FiltersManager.js.map