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
 * Created by HuDe Zheng on 2018/8/10.
 */
var PropNewItem = (function (_super) {
    __extends(PropNewItem, _super);
    function PropNewItem() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.currentIndex = 0; //当前处于的位置
        /**道具的类型
         * */
        _this.type = 0;
        /**
         * 可用数量
         * @type {number}
         */
        _this.num = 0;
        /**
         *  灰色滤镜
         */
        _this.colorFililter = new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ]);
        _this.skinName = "propNewItem";
        _this.cacheAsBitmap = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.selectHandler, _this);
        return _this;
    }
    PropNewItem.prototype.selectHandler = function () {
        if (TG_Game.currentHairState != 1) {
            Panel_PopupLayer.getInstance().myAlert("毛球移动中！", 2000);
            return;
        }
        if (this.num <= 0) {
            Panel_PopupLayer.getInstance().myAlert("没有足够数量无法使用此道具！", 2000);
            return;
        }
        //被选中
        App.MessageCenter.dispatch(Msg.Event.SelectProp, this);
    };
    PropNewItem.prototype.refreshData = function (num, _type) {
        if (_type == 1) {
            this.num += num;
        }
        else {
            this.num -= num;
        }
        if (this.num < 0) {
            this.num = 0;
        }
        this.refreshData2();
    };
    /**
     *  刷新状态
     */
    PropNewItem.prototype.refreshData2 = function () {
        if (this.num <= 0) {
            this.hs();
        }
        else {
            this.bs();
            this.numTex.text = "免费" + this.num;
        }
    };
    PropNewItem.prototype.hs = function () {
        this.title.visible = false;
        //变成灰色
        this.filters = [this.colorFililter];
    };
    PropNewItem.prototype.bs = function () {
        //变亮
        this.title.visible = true;
        this.filters = [];
    };
    return PropNewItem;
}(eui.ItemRenderer));
__reflect(PropNewItem.prototype, "PropNewItem");
//# sourceMappingURL=PropNewItem.js.map