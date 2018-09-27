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
 * Created by Administrator on 2018/6/14.
 *
 * 备注 玩家信息
 */
var PbPlayer = (function (_super) {
    __extends(PbPlayer, _super);
    function PbPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PbPlayer.prototype, "Init_Wx_UserInfo", {
        /**
         * 初始化微信用户资料
         * @param obj
         * @constructor
         */
        set: function (obj) {
            this.OpenId = obj["openid"];
            this.HeadUrl = obj["headimgurl"];
            this.Sex = obj["sex"];
            this.NickName = obj["nickname"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PbPlayer.prototype, "openid", {
        get: function () {
            return this.OpenId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PbPlayer.prototype, "headimg", {
        get: function () {
            return this.HeadUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PbPlayer.prototype, "sex", {
        get: function () {
            return this.Sex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PbPlayer.prototype, "nickname", {
        get: function () {
            return this.NickName;
        },
        enumerable: true,
        configurable: true
    });
    return PbPlayer;
}(BaseClass));
__reflect(PbPlayer.prototype, "PbPlayer");
//# sourceMappingURL=PbPlayer.js.map