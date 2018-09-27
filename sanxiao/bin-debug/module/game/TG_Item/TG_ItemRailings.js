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
 * 栏杆数据层 第七层
 *
 */
var TG_ItemRailings = (function (_super) {
    __extends(TG_ItemRailings, _super);
    function TG_ItemRailings() {
        return _super.call(this) || this;
    }
    TG_ItemRailings.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.initItemW_H(); //初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.SetStopMoveMask(layerid);
        return this.item;
    };
    TG_ItemRailings.prototype.SetStopMoveMask = function (id) {
        this.StopMoveMask = id % 10;
    };
    TG_ItemRailings.prototype.CheckStopMove = function (direction) {
        if ((this.StopMoveMask >> (direction - 1) & 0x01) == 1) {
            return true;
        }
        return false;
    };
    /*移除对象*/
    TG_ItemRailings.prototype.Release = function () {
        if (this.item) {
            this.StopMoveMask = 0;
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemRailings;
}(TG_Item));
__reflect(TG_ItemRailings.prototype, "TG_ItemRailings");
//# sourceMappingURL=TG_ItemRailings.js.map