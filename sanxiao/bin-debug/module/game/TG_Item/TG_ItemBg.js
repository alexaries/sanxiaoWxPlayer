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
 * Created by ZhangHui on 2018/6/11.
 */
var TG_ItemBg = (function (_super) {
    __extends(TG_ItemBg, _super);
    /*深浅背景块*/
    function TG_ItemBg() {
        return _super.call(this) || this;
    }
    /*创建对象*/
    TG_ItemBg.prototype.Create = function (id) {
        var str = "gamePanel_Bg" + id;
        this.item = TG_Object.Create(str);
        this.addChild(this.item);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*移除对象*/
    TG_ItemBg.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemBg;
}(TG_Item));
__reflect(TG_ItemBg.prototype, "TG_ItemBg");
//# sourceMappingURL=TG_ItemBg.js.map