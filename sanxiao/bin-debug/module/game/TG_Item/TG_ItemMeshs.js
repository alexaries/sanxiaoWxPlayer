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
 * 铁丝网层 第五层
 *
 */
var TG_ItemMeshs = (function (_super) {
    __extends(TG_ItemMeshs, _super);
    function TG_ItemMeshs() {
        return _super.call(this) || this;
    }
    TG_ItemMeshs.prototype.Create = function (layerid, row, col) {
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
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemMeshs.prototype.DoExplode = function () {
        this.SetExploding(true);
        //游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeMesh);
        //爆炸
        TG_Game.getInstance().DoMeshExplode(this);
    };
    /*移除对象*/
    TG_ItemMeshs.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemMeshs;
}(TG_Item));
__reflect(TG_ItemMeshs.prototype, "TG_ItemMeshs");
//# sourceMappingURL=TG_ItemMeshs.js.map