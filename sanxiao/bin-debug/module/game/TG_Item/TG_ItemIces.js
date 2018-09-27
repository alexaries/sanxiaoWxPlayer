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
 * 冰层
 * （表现层: 第三层）
 */
var TG_ItemIces = (function (_super) {
    __extends(TG_ItemIces, _super);
    function TG_ItemIces() {
        return _super.call(this) || this;
    }
    TG_ItemIces.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.life = Number(layerid) % 10;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.initItemW_H(); //初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isIces = true;
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemIces.prototype.DoExplode = function () {
        this.life -= 1;
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeIce);
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else {
            this.BlockId -= 1;
            var imageName = TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            this.item.texture = RES.getRes(imageName + "_png");
        }
    };
    /*移除对象*/
    TG_ItemIces.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemIces;
}(TG_Item));
__reflect(TG_ItemIces.prototype, "TG_ItemIces");
//# sourceMappingURL=TG_ItemIces.js.map