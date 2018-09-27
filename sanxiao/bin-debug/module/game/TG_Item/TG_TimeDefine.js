var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/7/3.
 */
var TG_TimeDefine = (function () {
    function TG_TimeDefine() {
    }
    /*获取时间*/
    TG_TimeDefine.GetTimeDelay = function (type) {
        var delay = this.BattleParameterMap[type];
        return delay;
    };
    TG_TimeDefine.InitTimeDefine = function () {
        var BattleParameter = egret.XML.parse(RES.getRes("main.BattleParameter_xml"));
        for (var i = 0; i < BattleParameter.children.length; i++) {
            var id = 0;
            for (var j in BattleParameter.children[i]["attributes"]) {
                if (j == 'id') {
                    id = BattleParameter.children[i]["attributes"][j];
                }
            }
            // 将xml中数据加载到mapConfigData中
            this.BattleParameterMap[id] = BattleParameter.children[i]["attributes"].value * 1000;
        }
        this.NextDropDelay = 1,
            this.BlackBomoDelay = 2,
            this.NormalBomoDelay = 3,
            this.ReyFlyDelay = 4,
            this.ReyAlteDelay = 5,
            this.RefreshStage = 6,
            this.FlowIceMoveTime = 7,
            this.FreeFallAcceleration = 8,
            this.SingleRowRollDelay = 9,
            this.EggPopupTargetTime = 10,
            this.ReceiveTargetItems = 11,
            this.ItemExchangeAnimTime = 12,
            this.VenomInfectTime = 13,
            this.VenonatMoveTime = 14,
            this.VenonatSplitTime = 15,
            this.BirdFlyInterval = 16,
            this.BirdFlyTime = 17,
            this.CaterpillarFleeTime = 18,
            this.HorizontalExplodeInterval = 19,
            this.VerticalExplodeInterval = 20,
            this.CompoundEffectMoveTime = 21,
            this.UsePongToolTime = 22,
            this.UseHorToolTime = 23,
            this.UseVerToolTime = 24,
            this.UseAdd3StepToolTime = 25,
            this.UseAdd5StepToolTime = 26,
            this.BlockHoleItemLargenTime = 27,
            this.BlockHoleItemRotationTime = 28,
            this.BlockHoleItemDisappearTime = 29,
            this.BeDisoriganziedTime = 30,
            this.HandReadyMoveTime = 31,
            this.BlockHoleExchangeEffectTime = 36,
            this.DelayCreateBulletTime = 37,
            this.UseGoldToolTime = 38,
            this.UseResetToolTime = 39,
            this.PeaToTargetTime = 40,
            this.PeaToTargetWaitTime = 41,
            this.PeaToTargetMove = 42,
            this.BlockHoleItemSpeed = 43,
            this.BlockHoleItemRotateTime = 44,
            this.DropDiffValue = 45,
            this.DropDiffDownTime = 46,
            this.DropDiffUpTime = 47,
            this.CompoundEffectScaleTime = 48,
            this.CompoundEffectInScaleTime = 49,
            this.CompoundEffectOutScaleTime = 50,
            this.BirdRotateLoopTime = 51,
            this.GlodBoomWaitDropTime = 52,
            this.BoomAndHContinueTime = 53,
            this.BoomAndVContinueTime = 54,
            this.BoomAndHVIntervalTime = 55,
            this.BoomAndHVScaleTime = 56,
            this.TargetReceiveTime = 57,
            this.TargetReceiveFromScale = 58,
            this.TargetReceiveToScale = 59,
            this.MagicStoneStartTime = 60,
            this.MagicStoneInterval = 61,
            this.MagicStoneDifferenceInterval = 62,
            this.MagicStoneFourthInterval = 63,
            this.MagicStoneFifthInterval = 64,
            this.MagicStoneAllTime = 65,
            this.TargetReceiveAllTime = 66,
            this.TargetReceiveAlphaInterval = 67,
            this.TargetReceiveAlphaTime = 68,
            this.TargetReceiveScaleMagnify = 69,
            this.ItemNotExchangeAnimTime = 70;
    };
    //激活下次掉落的延迟等待时长
    TG_TimeDefine.NextDropDelay = 0;
    //黑洞表演时间
    TG_TimeDefine.BlackBomoDelay = 0;
    //普通爆炸的时间
    TG_TimeDefine.NormalBomoDelay = 0;
    // 黑洞和鸟结合时，众鸟起飞时的间隔
    TG_TimeDefine.BirdFlyInterval = 0;
    // 鸟飞行到目标块的时间
    TG_TimeDefine.BirdFlyTime = 0;
    // 射线飞行时间
    TG_TimeDefine.ReyFlyDelay = 0;
    //射线之间的间隔时间
    TG_TimeDefine.ReyAlteDelay = 0;
    //刷新道具的展示时间
    TG_TimeDefine.RefreshStage = 0;
    //流冰移动时间
    TG_TimeDefine.FlowIceMoveTime = 0;
    //自由落体加速度(格子掉落的加速度)
    TG_TimeDefine.FreeFallAcceleration = 0;
    //单行滚动时间
    TG_TimeDefine.SingleRowRollDelay = 0;
    //鸡蛋弹出目标块，目标块飞行动画用时
    TG_TimeDefine.EggPopupTargetTime = 0;
    //收取目标块动画的时长
    TG_TimeDefine.ReceiveTargetItems = 0;
    //元素交换的动画时长
    TG_TimeDefine.ItemExchangeAnimTime = 0;
    //毒液感染时间
    TG_TimeDefine.VenomInfectTime = 0;
    //毛球移动时间
    TG_TimeDefine.VenonatMoveTime = 1;
    //毛球分裂时间
    TG_TimeDefine.VenonatSplitTime = 1;
    //毛毛虫逃跑时间
    TG_TimeDefine.CaterpillarFleeTime = 0;
    //横消时元素爆炸间隔
    TG_TimeDefine.HorizontalExplodeInterval = 0;
    //竖消时元素爆炸间隔
    TG_TimeDefine.VerticalExplodeInterval = 0;
    //合成特效时元素块的动作时长
    TG_TimeDefine.CompoundEffectMoveTime = 0;
    //使用锤子道具表现时间
    TG_TimeDefine.UsePongToolTime = 0;
    //使用炸弹道具表现时间
    TG_TimeDefine.UseGoldToolTime = 0;
    //使用重置道具表现时间
    TG_TimeDefine.UseResetToolTime = 0;
    //使用横消道具表现时间
    TG_TimeDefine.UseHorToolTime = 0;
    //豌豆收集表现时间
    TG_TimeDefine.PeaToTargetTime = 0;
    //豌豆收集等待时间
    TG_TimeDefine.PeaToTargetWaitTime = 0;
    //没有豌豆收集目标时 上移格子数
    TG_TimeDefine.PeaToTargetMove = 0;
    //使用竖消道具表现时间
    TG_TimeDefine.UseVerToolTime = 0;
    //使用加3步道具表现时间
    TG_TimeDefine.UseAdd3StepToolTime = 0;
    //使用加5步道具表现时间
    TG_TimeDefine.UseAdd5StepToolTime = 0;
    //黑洞元素块被引爆时，自身变大阶段时长
    TG_TimeDefine.BlockHoleItemLargenTime = 0;
    //黑洞元素块放大完毕后，自由旋转阶段的时长
    TG_TimeDefine.BlockHoleItemRotationTime = 0;
    //黑洞元素块动画表现后，消失阶段时长
    TG_TimeDefine.BlockHoleItemDisappearTime = 0;
    //元素被黑洞吸收(或者元素飞向黑洞)的动画的时长
    TG_TimeDefine.BeDisoriganziedTime = 0;
    //提示移动手从角色移动到交换起点的动画的时长
    TG_TimeDefine.HandReadyMoveTime = 0;
    //黑洞和其他特效块交换返回时的动画时长
    TG_TimeDefine.BlockHoleExchangeEffectTime = 0;
    //黑洞和其他特效块交换后，子弹延迟生成的时间
    TG_TimeDefine.DelayCreateBulletTime = 0;
    //黑洞和普通块交换吸收旋转时间差值
    TG_TimeDefine.BlockHoleItemRotateTime = 0;
    //黑洞和普通块交换吸收速度
    TG_TimeDefine.BlockHoleItemSpeed = 0;
    //掉落蹲的位移
    TG_TimeDefine.DropDiffValue = 0;
    //掉落蹲的位移时间
    TG_TimeDefine.DropDiffDownTime = 0;
    //掉落弹的位移时间
    TG_TimeDefine.DropDiffUpTime = 0;
    //合成特效时特效块的动作时长，如果有掉落合成 也是掉落所等待的时间
    TG_TimeDefine.CompoundEffectScaleTime = 0;
    //合成特效时特效块的缩放动作时长
    TG_TimeDefine.CompoundEffectInScaleTime = 0;
    //合成特效时特效块的恢复动作时长
    TG_TimeDefine.CompoundEffectOutScaleTime = 0;
    // 鸟的旋转循环时间 / 720°
    TG_TimeDefine.BirdRotateLoopTime = 0;
    //炸弹一次爆炸时的等待掉落时长
    TG_TimeDefine.GlodBoomWaitDropTime = 0;
    //炸弹和横竖消 横消持续时长
    TG_TimeDefine.BoomAndHContinueTime = 0;
    //炸弹和横竖消 竖消持续时长
    TG_TimeDefine.BoomAndVContinueTime = 0;
    //炸弹和横竖消间隔等待时长
    TG_TimeDefine.BoomAndHVIntervalTime = 0;
    //炸弹和横竖消放大色块时长
    TG_TimeDefine.BoomAndHVScaleTime = 0;
    //收集目标时长
    TG_TimeDefine.TargetReceiveTime = 0;
    //收集目标起始大小
    TG_TimeDefine.TargetReceiveFromScale = 0;
    //收集目标结束大小
    TG_TimeDefine.TargetReceiveToScale = 0;
    //魔法石爆炸延时启动的时间 -- 给引爆块用的
    TG_TimeDefine.MagicStoneStartTime = 0;
    //魔法石爆炸间隔
    TG_TimeDefine.MagicStoneInterval = 0;
    //魔法石加速度爆炸间隔
    TG_TimeDefine.MagicStoneDifferenceInterval = 0;
    //魔法石加速度第四组爆炸间隔
    TG_TimeDefine.MagicStoneFourthInterval = 0;
    //魔法石加速度第五组爆炸间隔
    TG_TimeDefine.MagicStoneFifthInterval = 0;
    //魔法石表演总时长
    TG_TimeDefine.MagicStoneAllTime = 0;
    /// 收集目标总时长
    TG_TimeDefine.TargetReceiveAllTime = 0;
    //收集目标触发透明度时机
    TG_TimeDefine.TargetReceiveAlphaInterval = 0;
    //收集目标触发透明度表现时长
    TG_TimeDefine.TargetReceiveAlphaTime = 0;
    //收集目标触发透明度表现时长
    TG_TimeDefine.TargetReceiveScaleMagnify = 0;
    //交换不可交换色块的动画等待时常
    TG_TimeDefine.ItemNotExchangeAnimTime = 0;
    /*初始化游戏消除延迟时间*/
    TG_TimeDefine.BattleParameterMap = {};
    return TG_TimeDefine;
}());
__reflect(TG_TimeDefine.prototype, "TG_TimeDefine");
//# sourceMappingURL=TG_TimeDefine.js.map