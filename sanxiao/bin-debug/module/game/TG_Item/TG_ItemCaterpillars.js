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
 * Created by Wang Guang on 2018/09/21.\
 *毛虫层 id:98 layerid:8001  itemType:81
 *
 */
var TG_ItemCaterpillars = (function (_super) {
    __extends(TG_ItemCaterpillars, _super);
    function TG_ItemCaterpillars() {
        return _super.call(this) || this;
    }
    TG_ItemCaterpillars.prototype.Create = function (layerid, row, col, preIndex, curIndex, behindIndex) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        if (preIndex === void 0) { preIndex = -1; }
        if (curIndex === void 0) { curIndex = -1; }
        if (behindIndex === void 0) { behindIndex = -1; }
        var prePos = this.GetPosByIndex(preIndex);
        var curPos = this.GetPosByIndex(curIndex);
        var behindPos = this.GetPosByIndex(behindIndex);
        if (curPos == prePos) {
            //头部
            this.SetCaterpillarHeadRotation(curPos, behindPos);
        }
        else if (curPos == behindPos) {
            //尾部
        }
        else if (curPos != prePos && curPos != behindPos) {
            //身体
        }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var color = obj.color;
        this.itemType = obj.itemType;
        this.CanFallThrough = obj.canFallThrough == "1" ? true : false;
        this.SetColorType(color);
        this.item = this.SetCaterpillarHeadRotation(curPos, behindPos);
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /**
     * 头部方向
     */
    TG_ItemCaterpillars.prototype.SetCaterpillarHeadRotation = function (curPos, behindPos) {
        this.item = TG_Object.Create("item_chongzi1_png");
        // this.item.rotation = 180;
        return this.item;
    };
    /*移除对象*/
    TG_ItemCaterpillars.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemCaterpillars;
}(TG_Item));
__reflect(TG_ItemCaterpillars.prototype, "TG_ItemCaterpillars");
//# sourceMappingURL=TG_ItemCaterpillars.js.map