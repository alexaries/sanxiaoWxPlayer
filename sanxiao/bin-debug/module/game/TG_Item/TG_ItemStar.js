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
var TG_ItemStar = (function (_super) {
    __extends(TG_ItemStar, _super);
    function TG_ItemStar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TG_ItemStar.getInstance = function () {
        if (!this.tG_ItemStar) {
            this.tG_ItemStar = new TG_ItemStar();
        }
        return this.tG_ItemStar;
    };
    TG_ItemStar.prototype.Create = function (str) {
        //str纹理
        this.item = TG_Object.Create(str);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*移除对象*/
    TG_ItemStar.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemStar;
}(TG_Item));
__reflect(TG_ItemStar.prototype, "TG_ItemStar");
//# sourceMappingURL=TG_ItemStar.js.map