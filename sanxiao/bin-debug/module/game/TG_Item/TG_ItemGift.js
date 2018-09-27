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
 * Created by ZhangHui on 2018/7/10.
 * 礼品盒
 */
var TG_ItemGift = (function (_super) {
    __extends(TG_ItemGift, _super);
    function TG_ItemGift() {
        return _super.call(this) || this;
    }
    TG_ItemGift.prototype.Create = function (layerid, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var imageName = obj.image;
        var color = obj.color;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.initItemW_H(); //初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.canFallDown = obj.canFallDown == "0" ? false : true;
        this.isMove = false;
        this.itemType = obj.itemType;
        this.life = Number(layerid) % 10;
        this.SetIsCanAroundDetonate(true);
        this.text = new ImageTextShow().drawText(this.item.width, this.item.height);
        if (this.text) {
            this.addChild(this.text);
        }
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemGift.prototype.DoExplode = function () {
        this.life -= 1;
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else {
            // 游戏中，飞到消除目标位置的动画
            TG_Game.getInstance().ItemFlyToGoal(this);
            //加分数
            TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeGift);
            this.BlockId -= 1;
            var imageName = TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            this.item.texture = RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(this.BlockId));
        }
    };
    /*移除对象*/
    TG_ItemGift.prototype.Release = function () {
        if (this.item) {
            this.life = 0;
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    /*改变文字*/
    TG_ItemGift.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    return TG_ItemGift;
}(TG_Item));
__reflect(TG_ItemGift.prototype, "TG_ItemGift");
//# sourceMappingURL=TG_ItemGift.js.map