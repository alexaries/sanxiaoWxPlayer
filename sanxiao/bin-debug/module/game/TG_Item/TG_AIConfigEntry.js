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
 * Created by ZhangHui on 2018/8/24.
 */
var TG_AIConfigEntry = (function (_super) {
    __extends(TG_AIConfigEntry, _super);
    function TG_AIConfigEntry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._aiConfigDic = {};
        return _this;
    }
    /*初始化*/
    TG_AIConfigEntry.prototype.InitAIConfigEntry = function () {
        var AIsystem = egret.XML.parse(RES.getRes("main.AIsystem_xml"));
        for (var i = 0; i < AIsystem.children.length; i++) {
            var id = 0;
            for (var j in AIsystem.children[i]["attributes"]) {
                if (j == 'id') {
                    id = AIsystem.children[i]["attributes"][j];
                }
            }
            this._aiConfigDic[id] = AIsystem.children[i]["attributes"];
        }
    };
    TG_AIConfigEntry.prototype.GetAiConfigEntry = function (id) {
        if (this._aiConfigDic.hasOwnProperty(id)) {
            return this._aiConfigDic[id];
        }
        return null;
    };
    return TG_AIConfigEntry;
}(BaseClass));
__reflect(TG_AIConfigEntry.prototype, "TG_AIConfigEntry");
//# sourceMappingURL=TG_AIConfigEntry.js.map