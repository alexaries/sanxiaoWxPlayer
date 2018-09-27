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
 * Created by HuDe Zheng on 2018/7/30.
 */
var UiScene = (function (_super) {
    __extends(UiScene, _super);
    /**
     * 构造函数
     */
    function UiScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    UiScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //初始化添加ui层级
        this.addLayer(LayerManager.UI_Main);
        // this.addLayer(LayerManager.UI_Popup);
        // this.addLayer(LayerManager.UI_Tips);
        this.addLayer(LayerManager.UI_Message);
        LayerManager.UI_Message.addChild(Panel_PopupLayer.getInstance()); //弹窗
    };
    /**
     * 退出Scene调用
     */
    UiScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return UiScene;
}(BaseScene));
__reflect(UiScene.prototype, "UiScene");
//# sourceMappingURL=UiScene.js.map