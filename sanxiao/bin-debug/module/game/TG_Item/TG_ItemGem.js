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
 * Created by ZhangHui on 2018/6/4.
 * 宝石类
 */
var TG_ItemGem = (function (_super) {
    __extends(TG_ItemGem, _super);
    /*普通元素块*/
    function TG_ItemGem() {
        return _super.call(this) || this;
    }
    TG_ItemGem.prototype.Create = function (layerid, row, col) {
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = false;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(true);
        this.canFallDown = obj.canFallDown == "0" ? false : true;
        var imageName = obj.image;
        var color = obj.color;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.text = new ImageTextShow().drawText(this.item.width, this.item.height);
        if (this.text) {
            this.addChild(this.text);
        }
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemGem.prototype.DoExplode = function () {
        this.life -= 1;
        if (this.life <= 0) {
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else {
        }
    };
    /*移除对象*/
    TG_ItemGem.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    /*改变文字*/
    TG_ItemGem.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    return TG_ItemGem;
}(TG_Item));
__reflect(TG_ItemGem.prototype, "TG_ItemGem");
//# sourceMappingURL=TG_ItemGem.js.map