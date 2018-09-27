var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StorageUtils = (function () {
    function StorageUtils() {
    }
    /**
     * 存
     *
     * @param key
     * @param value
     */
    StorageUtils.setItem = function (key, value) {
        egret.localStorage.setItem(key, value);
    };
    /**
     * 读
     * @param key
     */
    StorageUtils.getItem = function (key) {
        egret.localStorage.getItem(key);
    };
    /**
     * 删
     * @param key
     */
    StorageUtils.removeItem = function (key) {
        egret.localStorage.removeItem(key);
    };
    /**
     * 删所有
     */
    StorageUtils.clearAll = function () {
        egret.localStorage.clear();
    };
    StorageUtils.wxUserId = "wxUserId";
    return StorageUtils;
}());
__reflect(StorageUtils.prototype, "StorageUtils");
//# sourceMappingURL=StorageUtils.js.map