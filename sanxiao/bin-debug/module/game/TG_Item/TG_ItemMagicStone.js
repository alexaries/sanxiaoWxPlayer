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
 * Created by ZhangHui on 2018/8/16.
 * 魔法石
 */
var TG_ItemMagicStone = (function (_super) {
    __extends(TG_ItemMagicStone, _super);
    function TG_ItemMagicStone() {
        var _this = _super.call(this) || this;
        _this.Orientation = 1; //方向
        _this.ExplodeCount = 0; //爆炸次数
        _this.Name = "";
        return _this;
    }
    TG_ItemMagicStone.prototype.Create = function (layerid, row, col) {
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
        this.SetIsCanAroundDetonate(true);
        this.Name = obj.name;
        this.CheckOrientation();
        this.NextId = obj.nextID;
        this.ExplodeCount = 0;
        this.text = new ImageTextShow().drawText(this.item.width, this.item.height);
        if (this.text) {
            this.addChild(this.text);
        }
        return this.item;
    };
    /*魔法石的方向*/
    TG_ItemMagicStone.prototype.CheckOrientation = function () {
        if (this.Name.indexOf("上") > -1) {
            this.Orientation = 1;
        }
        else if (this.Name.indexOf("下") > -1) {
            this.Orientation = 2;
        }
        else if (this.Name.indexOf("左") > -1) {
            this.Orientation = 3;
        }
        else if (this.Name.indexOf("右") > -1) {
            this.Orientation = 4;
        }
    };
    /*普通爆炸*/
    TG_ItemMagicStone.prototype.DoExplode = function () {
        if (!this.IsAsyncExplode) {
            if (TG_Game.getInstance().DoCheck2FloorExplode(this)) {
                return;
            }
            // 当达到爆炸状态
            if (this.BlockId == this.NextId) {
                this.SetAsyncExplode(true);
            }
            else {
                TG_Game.getInstance().DoMagicStoneExplode(this);
            }
        }
    };
    TG_ItemMagicStone.prototype.DoAsyncExplode = function () {
        if (this.IsAsyncExplode) {
            if (!this.Exploding && this.ExplodeCount < 3) {
                this.SetExploding(true);
                this.ExplodeCount++;
                TG_Game.getInstance().SpecialExplodeTriangle(this.SitePos, this.Orientation);
            }
            this.SetAsyncExplode(false);
        }
    };
    /*移除对象*/
    TG_ItemMagicStone.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    /*改变文字*/
    TG_ItemMagicStone.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    return TG_ItemMagicStone;
}(TG_Item));
__reflect(TG_ItemMagicStone.prototype, "TG_ItemMagicStone");
//# sourceMappingURL=TG_ItemMagicStone.js.map