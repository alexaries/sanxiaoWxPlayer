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
var Panel_PopupLayer = (function (_super) {
    __extends(Panel_PopupLayer, _super);
    function Panel_PopupLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Panel_PopupLayer.prototype.myAlert = function (str, time, vy) {
        if (time === void 0) { time = 700; }
        if (vy === void 0) { vy = Main.stageHeight * .5; }
        if (this.myAlertSp) {
            egret.Tween.removeTweens(this.myAlertSp);
            App.DisplayUtils.removeFromParent(this.myAlertSp);
            this.myAlertSp = null;
        }
        try {
            this.myAlertSp = new egret.Sprite();
            this.addChild(this.myAlertSp);
            var bg = new egret.Bitmap(RES.getRes("common_bg1"));
            this.myAlertSp.addChild(bg);
            var txt = new egret.TextField();
            this.myAlertSp.addChild(txt);
            txt.textAlign = "center";
            txt.verticalAlign = "middle";
            txt.textColor = 0xffffff;
            txt.text = str;
            txt.size = 50;
            bg.width = txt.width * 1.2;
            bg.height = 120;
            txt.x = txt.width * .1;
            txt.y = 35;
            this.myAlertSp.x = Main.stageWidth / 2 - bg.width / 2;
            this.myAlertSp.y = vy - bg.height / 2 + 20;
            this.myAlertSp.alpha = 0;
            egret.Tween.get(this.myAlertSp).to({ y: this.myAlertSp.y - 20, alpha: 1 }, 100).wait(time).to({ y: this.myAlertSp.y - 40, alpha: 0 }, 150).call(function () {
                if (this.myAlertSp) {
                    App.DisplayUtils.removeFromParent(this.myAlertSp);
                    this.myAlertSp = null;
                }
            }.bind(this), this);
        }
        catch (e) {
            console.log("浮框背景未加载...");
        }
    };
    return Panel_PopupLayer;
}(BaseClassSprite));
__reflect(Panel_PopupLayer.prototype, "Panel_PopupLayer");
//# sourceMappingURL=Panel_PopupLayer.js.map