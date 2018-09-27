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
 * 传送带出入口
 *
 */
var TG_ItemBeltsColor = (function (_super) {
    __extends(TG_ItemBeltsColor, _super);
    function TG_ItemBeltsColor() {
        return _super.call(this) || this;
    }
    TG_ItemBeltsColor.prototype.Create = function (layerid, direction, row, col) {
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
        this.SetDirection(direction);
        if (obj.portalColor) {
            var portalColor = obj.portalColor;
            if (portalColor.length > 0) {
                var arr = portalColor.split("|");
                this.portalColor = arr;
            }
        }
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemBeltsColor.prototype.DoExplode = function () {
        // 传送带不参与爆炸
    };
    /*移除对象*/
    TG_ItemBeltsColor.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemBeltsColor;
}(TG_Item));
__reflect(TG_ItemBeltsColor.prototype, "TG_ItemBeltsColor");
//# sourceMappingURL=TG_ItemBeltsColor.js.map