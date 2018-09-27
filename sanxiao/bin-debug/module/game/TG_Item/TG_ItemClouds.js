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
 * 创建云层数据 第八层
 */
var TG_ItemClouds = (function (_super) {
    __extends(TG_ItemClouds, _super);
    function TG_ItemClouds() {
        return _super.call(this) || this;
    }
    TG_ItemClouds.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        // let imageName=obj.image;
        var color = obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item = TG_Object.Create(str);
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        // 5001 life =1 5002 life = 2
        this.life = Number(layerid) % 10;
        this.SetIsCanAroundDetonate(true);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemClouds.prototype.DoExplode = function () {
        this.life -= 1;
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeCloud);
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoCloudExplode(this);
        }
        else {
            this.BlockId -= 1;
            this.item.texture = RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId));
        }
    };
    /*移除对象*/
    TG_ItemClouds.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemClouds;
}(TG_Item));
__reflect(TG_ItemClouds.prototype, "TG_ItemClouds");
//# sourceMappingURL=TG_ItemClouds.js.map