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
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(str1) {
        var _this = _super.call(this) || this;
        _this.str1 = "";
        _this.str1 = str1;
        _this.addCard(_this.str1);
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        return _this;
    }
    //添加事件
    Button.prototype.addTouchEvent = function () {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
    };
    //鼠标按下事件
    Button.prototype.touchBegin = function (e) {
        egret.Tween.get(this).to({ scaleX: 1.04, scaleY: 1.04 }, 50);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchEnd, this);
    };
    //鼠标弹起
    Button.prototype.touchEnd = function (e) {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchEnd, this);
        this.scaleX = this.scaleY = 1;
        //派发点击事件
        this.dispatchEvent(new egret.Event("click"));
    };
    //销毁
    Button.prototype.clear = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
    };
    Button.prototype.addCard = function (str1) {
        if (this.card == null) {
            this.card = new egret.Bitmap();
            this.addChild(this.card);
        }
        this.card.texture = RES.getRes(str1);
        this.card.anchorOffsetX = this.card.width / 2;
        this.card.anchorOffsetY = this.card.height / 2;
        this.card.x = this.card.width / 2;
        this.card.y = this.card.height / 2;
    };
    return Button;
}(egret.Sprite));
__reflect(Button.prototype, "Button");
//# sourceMappingURL=Button.js.map