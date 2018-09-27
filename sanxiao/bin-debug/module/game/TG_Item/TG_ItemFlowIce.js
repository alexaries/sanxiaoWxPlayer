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
 * Created by Hu Dezheng on 2018/7/11.
 * 流沙
 * （表现层: 第三层）
 */
var TG_ItemFlowIce = (function (_super) {
    __extends(TG_ItemFlowIce, _super);
    function TG_ItemFlowIce() {
        return _super.call(this) || this;
    }
    TG_ItemFlowIce.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.life = 1;
        this.SetColorType(color);
        this.item = TG_Object.Create(imageName + "_png");
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.isFlowIces = true; //冰和流沙都通用
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /**
     * 开始流动
     * @constructor
     */
    TG_ItemFlowIce.prototype.DoFlow = function () {
        this.isFlow = true;
        TG_Game.getInstance().DoIceFlow(this);
        // Game.DoIceFlow(this);
    };
    /**
     * 流动结束
     * @constructor
     */
    TG_ItemFlowIce.prototype.DoFlowEnd = function () {
        this.isFlow = false;
    };
    /*普通爆炸*/
    TG_ItemFlowIce.prototype.DoExplode = function () {
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeFlowIce);
        this.life -= 1;
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else {
            this.BlockId -= 1;
            this.item.texture = RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId));
        }
    };
    /*移除对象*/
    TG_ItemFlowIce.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemFlowIce;
}(TG_Item));
__reflect(TG_ItemFlowIce.prototype, "TG_ItemFlowIce");
//# sourceMappingURL=TG_ItemFlowIce.js.map