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
 * 月饼类 皇冠
 */
var TG_ItemPea = (function (_super) {
    __extends(TG_ItemPea, _super);
    /*普通元素块*/
    function TG_ItemPea() {
        return _super.call(this) || this;
    }
    TG_ItemPea.prototype.Create = function (layerid, row, col) {
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = true;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(false);
        this.canFallDown = true;
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
    TG_ItemPea.prototype.DoExplode = function () {
        console.info(456);
        // this.life -= 1;
        // if (this.life <= 0)
        // {
        //     //设置爆炸状态为true
        //     this.SetExploding(true);
        //     this.isDetonate = true;
        //     TG_Game.getInstance().DoExplode(this);
        // }
        // else
        // {
        //
        // }
    };
    /*移除对象*/
    TG_ItemPea.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    /*改变文字*/
    TG_ItemPea.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    return TG_ItemPea;
}(TG_Item));
__reflect(TG_ItemPea.prototype, "TG_ItemPea");
//# sourceMappingURL=TG_ItemPea.js.map