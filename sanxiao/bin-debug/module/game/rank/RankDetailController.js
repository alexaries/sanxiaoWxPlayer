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
 * Created by HuDe Zheng on 2018/8/07.
 */
var RankDetailController = (function (_super) {
    __extends(RankDetailController, _super);
    function RankDetailController() {
        var _this = _super.call(this) || this;
        _this.view = new RankDetailView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.GameRankDetail, _this.view);
        _this.view.begin_rank_detail_rect.touchEnabled = true;
        _this.view.begin_rank_detail_rect.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.backHandler, _this);
        return _this;
    }
    RankDetailController.prototype.backHandler = function (e) {
        App.ViewManager.close(ViewConst.GameRankDetail);
    };
    RankDetailController.prototype.init = function () {
    };
    return RankDetailController;
}(BaseController));
__reflect(RankDetailController.prototype, "RankDetailController");
//# sourceMappingURL=RankDetailController.js.map