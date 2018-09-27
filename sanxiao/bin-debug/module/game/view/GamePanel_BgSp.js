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
 * Created by ZhangHui on 2018/6/1.
 */
var GamePanel_BgSp = (function (_super) {
    __extends(GamePanel_BgSp, _super);
    function GamePanel_BgSp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePanel_BgSp.prototype.initView = function () {
        //上部背景
        this.topBg = new eui.Image();
        this.addChild(this.topBg);
        this.topBg.source = "ui_battle_BG_jpg";
        this.topBg.width = Main.stageWidth;
        this.topBg.height = Main.stageHeight;
    };
    return GamePanel_BgSp;
}(BaseClassSprite));
__reflect(GamePanel_BgSp.prototype, "GamePanel_BgSp");
//# sourceMappingURL=GamePanel_BgSp.js.map