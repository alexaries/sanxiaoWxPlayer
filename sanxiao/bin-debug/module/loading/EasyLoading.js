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
 * Created by HuDe Zheng on 2018/7/17.
 * 简易加载进度
 */
var EasyLoading = (function (_super) {
    __extends(EasyLoading, _super);
    function EasyLoading() {
        var _this = _super.call(this) || this;
        _this.content = null;
        _this.speed = 10 / (1000 / 60);
        _this.init();
        return _this;
    }
    EasyLoading.prototype.init = function () {
        this.averageUtils = new AverageUtils();
        this.content = new egret.Sprite();
        this.content.graphics.beginFill(0x000000, 0.2);
        this.content.graphics.drawRect(0, 0, Main.stageWidth, Main.stageHeight);
        this.content.graphics.endFill();
        this.content.touchEnabled = true;
        this.uiImageContainer = new egret.DisplayObjectContainer();
        this.uiImageContainer.x = this.content.width * 0.5;
        this.uiImageContainer.y = this.content.height * 0.5;
        this.content.addChild(this.uiImageContainer);
        RES.getResByUrl("resource/assets/load_Reel.png", function (texture) {
            var img = new egret.Bitmap();
            img.texture = texture;
            img.x = -img.width * 0.5;
            img.y = -img.height * 0.5;
            this.uiImageContainer.addChild(img);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    EasyLoading.prototype.showLoading = function () {
        App.StageScaleMode.getStage().addChild(this.content);
        App.TimerManager.doFrame(1, 0, this.enterFrame, this);
    };
    EasyLoading.prototype.hideLoading = function () {
        if (this.content && this.content.parent) {
            this.content.parent.removeChild(this.content);
            this.uiImageContainer.rotation = 0;
        }
        App.TimerManager.remove(this.enterFrame, this);
    };
    EasyLoading.prototype.enterFrame = function (time) {
        this.averageUtils.push(this.speed * time);
        this.uiImageContainer.rotation += this.averageUtils.getValue();
    };
    EasyLoading.prototype.onProgress = function (current, total) {
        var wid1 = current / total;
        if (Math.floor(wid1) * 100 >= 100) {
            App.MessageCenter.dispatch(Msg.Event.NetLoadComplete);
        }
    };
    return EasyLoading;
}(BaseClass));
__reflect(EasyLoading.prototype, "EasyLoading");
//# sourceMappingURL=EasyLoading.js.map