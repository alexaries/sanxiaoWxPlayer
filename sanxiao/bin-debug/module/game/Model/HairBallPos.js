var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 *  毛球移动坐标位置模型
 */
var HairBallPos = (function () {
    function HairBallPos() {
        // 是否移动过
        this.is_move = false;
        this.is_update = false;
        this.hairBall = null;
        this.item = null;
    }
    return HairBallPos;
}());
__reflect(HairBallPos.prototype, "HairBallPos");
//# sourceMappingURL=HairBallPos.js.map