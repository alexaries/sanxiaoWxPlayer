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
 * Created by Hu Dezheng on 2018/7/12.
 * 填充物
 */
var TG_ItemNull = (function (_super) {
    __extends(TG_ItemNull, _super);
    function TG_ItemNull() {
        return _super.call(this) || this;
    }
    TG_ItemNull.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.life = 1;
        this.SetColorType(color);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.setItemNone(true);
        if (obj.itemType == ItemType.TG_ITEM_TYPE_NULL) {
            //空块
            this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
            this.initItemW_H(); //初始化宽高
            this.addChild(this.item);
            this.SetItemWidth(this.item.width);
        }
        return this.item;
    };
    /*移除对象*/
    TG_ItemNull.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemNull;
}(TG_Item));
__reflect(TG_ItemNull.prototype, "TG_ItemNull");
//# sourceMappingURL=TG_ItemNull.js.map