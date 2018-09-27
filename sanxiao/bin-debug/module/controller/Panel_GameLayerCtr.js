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
var Panel_GameLayerCtr = (function (_super) {
    __extends(Panel_GameLayerCtr, _super);
    function Panel_GameLayerCtr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Panel_GameLayerCtr.getInstance = function () {
        if (!this.panel_GameLayerCtr) {
            this.panel_GameLayerCtr = new Panel_GameLayerCtr();
        }
        return this.panel_GameLayerCtr;
    };
    /*开始游戏*/
    Panel_GameLayerCtr.prototype.gameStart = function () {
        /*刷新地图*/
        // Panel_GameLayer.getInstance().initPanel();
        //先加载游戏必要的网络资源
        var networkImageArr = LoadNetworkImageUtils.loadNetworkImage;
        if (networkImageArr.length == 0) {
            Panel_GameLayer.getInstance().initPanel();
        }
        else {
            App.MessageCenter.addListener(Msg.Event.NetLoadComplete, this.loadCompleteHandler, this);
            App.EasyLoading.showLoading();
            RES.loadGroup(LoadNetworkImageUtils.groupName, 0, App.EasyLoading);
        }
    };
    Panel_GameLayerCtr.prototype.loadCompleteHandler = function () {
        App.MessageCenter.removeListener(Msg.Event.NetLoadComplete, this.loadCompleteHandler, this);
        App.EasyLoading.hideLoading();
        Panel_GameLayer.getInstance().initPanel();
    };
    return Panel_GameLayerCtr;
}(BaseController1));
__reflect(Panel_GameLayerCtr.prototype, "Panel_GameLayerCtr");
//# sourceMappingURL=Panel_GameLayerCtr.js.map