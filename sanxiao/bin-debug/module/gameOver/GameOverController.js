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
var GameOverController = (function (_super) {
    __extends(GameOverController, _super);
    function GameOverController() {
        var _this = _super.call(this) || this;
        _this.view = new GameOverView(_this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameOverRank, _this.view);
        return _this;
    }
    return GameOverController;
}(BaseController));
__reflect(GameOverController.prototype, "GameOverController");
//# sourceMappingURL=GameOverController.js.map