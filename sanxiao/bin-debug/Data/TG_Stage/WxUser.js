var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var WxUser = (function () {
    function WxUser() {
    }
    WxUser.getInstance = function () {
        if (!this.wxUser) {
            this.wxUser = new WxUser();
        }
        return this.wxUser;
    };
    return WxUser;
}());
__reflect(WxUser.prototype, "WxUser");
//# sourceMappingURL=WxUser.js.map