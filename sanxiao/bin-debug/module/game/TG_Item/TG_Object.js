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
var TG_Object = (function (_super) {
    __extends(TG_Object, _super);
    function TG_Object(texture, textureName) {
        var _this = _super.call(this, texture) || this;
        _this.textureName = textureName;
        return _this;
    }
    //创建对象
    TG_Object.Create = function (textureName) {
        if (TG_Object.cacheDict[textureName] == null) {
            TG_Object.cacheDict[textureName] = [];
        }
        var dict = TG_Object.cacheDict[textureName];
        var obj;
        if (dict.length > 0) {
            obj = dict.pop();
            obj.texture = RES.getRes(textureName);
        }
        else {
            obj = new TG_Object(RES.getRes(textureName), textureName);
        }
        return obj;
    };
    //回收对象
    TG_Object.Release = function (bit) {
        var textureName = bit.textureName;
        if (TG_Object.cacheDict[textureName] == null) {
            TG_Object.cacheDict[textureName] = [];
        }
        var dict = TG_Object.cacheDict[textureName];
        if (dict.indexOf(bit) == -1) {
            dict.push(bit);
        }
    };
    /*简易对象池*/
    TG_Object.cacheDict = [];
    return TG_Object;
}(egret.Bitmap));
__reflect(TG_Object.prototype, "TG_Object");
//# sourceMappingURL=TG_Object.js.map