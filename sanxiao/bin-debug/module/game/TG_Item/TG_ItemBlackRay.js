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
 * Created by ZhangHui on 2018/6/28.
 */
/**
 * Created by ZhangHui on 2018/6/21.
 */
var TG_ItemBlackRay = (function (_super) {
    __extends(TG_ItemBlackRay, _super);
    function TG_ItemBlackRay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.IsEffectAlreadyExplode = false;
        return _this;
    }
    TG_ItemBlackRay.getInstance = function () {
        if (!this.tG_ItemBird) {
            this.tG_ItemBird = new TG_ItemBird();
        }
        return this.tG_ItemBird;
    };
    //黑洞
    TG_ItemBlackRay.prototype.Create = function (layerid) {
        if (layerid === void 0) { layerid = "2098"; }
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var color = obj.color;
        var str = obj.image + "_png";
        this.item = TG_Object.Create(str);
        this.addChild(this.item);
        this.SetColorType(color);
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    TG_ItemBlackRay.prototype.CreateLine = function () {
        this.line = TG_Object.Create("item_bullet_png");
        this.addChild(this.line);
        return this.line;
    };
    TG_ItemBlackRay.prototype.CreateBlackHole = function (color, type, currentCount, temp) {
        //temp 原位置的元素块
        this.EffectType = type;
        if (this.EffectType == Msg.EffectType.ET_Hor || this.EffectType == Msg.EffectType.ET_Vel) {
            if (currentCount % 2 == 0) {
                this.LastType = type;
            }
            else {
                this.LastType = type == Msg.EffectType.ET_Hor ? Msg.EffectType.ET_Vel : Msg.EffectType.ET_Hor;
            }
        }
        else {
            this.LastType = this.EffectType;
        }
        this.Color = color;
        var layerid = TG_Blocks.GetBlockIdByEffectTypeAndColor(this.LastType, this.Color);
        this.layerid = layerid;
        this.blackHole = TG_CreateItem.CreateItems(this.layerid, -1, 0, 0, this.LastType);
        this.addChild(this.blackHole);
        this.SetEffectType(this.LastType);
        this.SetBlockId(this.layerid);
        temp.SetEffectType(this.LastType);
        temp.SetIsBullet(true);
        temp.SetBulletPos(temp.SitePos);
        temp.alpha = 0;
        this.SetTargetIndex(currentCount);
        return this.blackHole;
    };
    TG_ItemBlackRay.prototype.SetTargetIndex = function (index) {
        this.TargetIndex = index;
    };
    TG_ItemBlackRay.prototype.GetTargetIndex = function () {
        return this.TargetIndex;
    };
    TG_ItemBlackRay.prototype.SetStartBlockHolePos = function (pos) {
        this.StartBlockHolePos = pos;
        this.SitePos = this.StartBlockHolePos;
    };
    TG_ItemBlackRay.prototype.GetStartBlockHolePos = function () {
        return this.StartBlockHolePos;
    };
    TG_ItemBlackRay.prototype.SetAlreadyExplode = function (flag) {
        this.IsEffectAlreadyExplode = flag;
    };
    TG_ItemBlackRay.prototype.GetAlreadyExplode = function () {
        return this.IsEffectAlreadyExplode;
    };
    /*移除对象*/
    TG_ItemBlackRay.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    return TG_ItemBlackRay;
}(TG_Item));
__reflect(TG_ItemBlackRay.prototype, "TG_ItemBlackRay");
//# sourceMappingURL=TG_ItemBlackRay.js.map