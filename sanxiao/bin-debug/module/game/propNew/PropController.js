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
 */
var PropController = (function (_super) {
    __extends(PropController, _super);
    function PropController() {
        var _this = _super.call(this) || this;
        _this.propView = new PropNewView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Prop, _this.propView);
        App.MessageCenter.addListener(Msg.Event.SelectProp, _this.selectPropHandler, _this);
        App.MessageCenter.addListener(Msg.Event.CancelSelectProp, _this.cancelSelectProp, _this); //取消选择道具
        App.MessageCenter.addListener(Msg.Event.UseProp, _this.useProp, _this); //使用道具事件 更新道具数量
        return _this;
    }
    //更新道具数量
    PropController.prototype.useProp = function (propId, type, num, isAddUsedToolTimes) {
        if (type === void 0) { type = 0; }
        if (num === void 0) { num = 1; }
        if (isAddUsedToolTimes === void 0) { isAddUsedToolTimes = true; }
        if (isAddUsedToolTimes) {
            TG_Game.getInstance().usedToolTimes++;
        }
        this.propView.useProp(propId, type, num);
        // App.TimerManager.doTimer(2000, 0, TG_Game.getInstance().doDrop(), this)
        // TG_Game.getInstance().doCheckMoved();
    };
    PropController.prototype.getItems = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (id == arr[i]["id"]) {
                return arr[i]["num"];
            }
        }
        return 0;
    };
    PropController.prototype.cancelSelectProp = function (item) {
        if (item) {
            item.filters = [];
            this.previousItem = null;
        }
    };
    /**
     *  被点击道具
     * @param item
     */
    PropController.prototype.selectPropHandler = function (item) {
        var type = item.type; //道具类型
        var gl = new egret.GlowFilter(0xff0000, 1, 10, 10);
        if (this.previousItem) {
            this.previousItem.filters = [];
        }
        if (this.previousItem == item) {
            this.previousItem = null;
            //取消选择道具
            return;
        }
        item.filters = [gl];
        this.previousItem = item;
    };
    return PropController;
}(BaseController));
__reflect(PropController.prototype, "PropController");
//# sourceMappingURL=PropController.js.map