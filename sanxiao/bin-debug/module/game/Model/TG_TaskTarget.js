var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/9/7.
 * 任务目标
 */
var TG_TaskTarget = (function () {
    function TG_TaskTarget() {
        this.Num = 0;
        this.Target = 0;
        this.Cur = 0;
    }
    /*增加*/
    TG_TaskTarget.prototype.DoIncreaseTarget = function () {
        var Num = this.Num;
        var Cur = this.Cur;
        if (Num < 0) {
            // 无限模式
            Cur += 1;
        }
        else {
            Cur = Math.min(Num, ++Cur);
        }
        this.Cur = Cur;
    };
    /*减少*/
    TG_TaskTarget.prototype.DoReduceTarget = function () {
        var Cur = this.Cur;
        Cur = Math.max(0, --Cur);
        this.Cur = Cur;
    };
    return TG_TaskTarget;
}());
__reflect(TG_TaskTarget.prototype, "TG_TaskTarget");
//# sourceMappingURL=TG_TaskTarget.js.map