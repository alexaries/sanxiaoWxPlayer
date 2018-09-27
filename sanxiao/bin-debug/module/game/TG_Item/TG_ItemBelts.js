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
 * 传送带
 */
var TG_ItemBelts = (function (_super) {
    __extends(TG_ItemBelts, _super);
    function TG_ItemBelts() {
        return _super.call(this) || this;
    }
    TG_ItemBelts.prototype.Create = function (layerid, row, col) {
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = false;
        this.life = 0;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(false);
        this.canFallDown = false;
        var color = obj.color;
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
    /*普通爆炸*/
    TG_ItemBelts.prototype.DoExplode = function () {
        // 传送带不参与爆炸
    };
    /*移除对象*/
    TG_ItemBelts.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemBelts;
}(TG_Item));
__reflect(TG_ItemBelts.prototype, "TG_ItemBelts");
//# sourceMappingURL=TG_ItemBelts.js.map