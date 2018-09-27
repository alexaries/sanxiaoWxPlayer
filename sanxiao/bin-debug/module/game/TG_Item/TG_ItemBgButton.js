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
 * Created by Administrator on 2018/6/28.\
 * 棋盘背景层 -1 1001-1006
 *
 */
var TG_ItemBgButton = (function (_super) {
    __extends(TG_ItemBgButton, _super);
    function TG_ItemBgButton() {
        return _super.call(this) || this;
    }
    TG_ItemBgButton.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        //layerid
        var layeridStr = layerid.toString();
        // 先创建地板层
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        // let imageName=obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.CanFallThrough = obj.canFallThrough == "1" ? true : false;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*移除对象*/
    TG_ItemBgButton.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemBgButton;
}(TG_Item));
__reflect(TG_ItemBgButton.prototype, "TG_ItemBgButton");
//# sourceMappingURL=TG_ItemBgButton.js.map