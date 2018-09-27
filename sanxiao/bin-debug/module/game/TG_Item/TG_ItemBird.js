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
 * Created by ZhangHui on 2018/6/21.
 */
var TG_ItemBird = (function (_super) {
    __extends(TG_ItemBird, _super);
    function TG_ItemBird() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.IsFlying = false;
        return _this;
    }
    TG_ItemBird.getInstance = function () {
        if (!this.tG_ItemBird) {
            this.tG_ItemBird = new TG_ItemBird();
        }
        return this.tG_ItemBird;
    };
    TG_ItemBird.prototype.Create = function (layerid) {
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var color = obj.color;
        var str = obj.image + "_png";
        this.item = TG_Object.Create(str);
        this.addChild(this.item);
        this.SetColorType(color);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*移除对象*/
    TG_ItemBird.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    TG_ItemBird.prototype.SetStartIndex = function (index) {
        this.StartIndex = index;
    };
    TG_ItemBird.prototype.GetStartIndex = function () {
        return this.StartIndex;
    };
    TG_ItemBird.prototype.SetStartPos = function (pos) {
        this.StartPos = pos;
    };
    TG_ItemBird.prototype.GetStartPos = function () {
        return this.StartPos;
    };
    TG_ItemBird.prototype.SetTargetPos = function (pos) {
        this.TargetPos = pos;
    };
    TG_ItemBird.prototype.GetTargetPos = function () {
        return this.TargetPos;
    };
    TG_ItemBird.prototype.SetTargetIndex = function (index) {
        this.TargetIndex = index;
    };
    TG_ItemBird.prototype.GetTargetIndex = function () {
        return this.TargetIndex;
    };
    TG_ItemBird.prototype.StartFly = function () {
        this.IsFlying = true;
    };
    return TG_ItemBird;
}(TG_Item));
__reflect(TG_ItemBird.prototype, "TG_ItemBird");
//# sourceMappingURL=TG_ItemBird.js.map