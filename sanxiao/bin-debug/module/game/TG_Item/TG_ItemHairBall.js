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
 * Created by Administrator on 2018/6/28.
 */
var TG_ItemHairBall = (function (_super) {
    __extends(TG_ItemHairBall, _super);
    function TG_ItemHairBall() {
        return _super.call(this) || this;
    }
    TG_ItemHairBall.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item = TG_Object.Create(imageName + "_png");
        this.initItemW_H(); //初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isMove = false;
        // this.CanAroundDetonate = true;
        return this.item;
    };
    /*移除对象*/
    TG_ItemHairBall.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemHairBall;
}(TG_Item));
__reflect(TG_ItemHairBall.prototype, "TG_ItemHairBall");
//# sourceMappingURL=TG_ItemHairBall.js.map