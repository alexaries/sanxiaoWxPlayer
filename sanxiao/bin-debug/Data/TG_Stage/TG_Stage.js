var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/6/13.
 * 关卡信息
 *
 */
var TG_Stage = (function () {
    function TG_Stage() {
    }
    // 函数方法
    TG_Stage.init = function () {
        var stageData = TG_MapData.getInstance().stageData;
        // console.info(stageData);
        var blocks = stageData["Stage"]["Blocks"];
        // 将皇冠坑拿出来存起来
        for (var oneIndex in blocks) {
            var one = blocks[oneIndex];
            if (one["Id1"] == 1006) {
                one["Id0"] = 1006;
                one["Id1"] = 1002;
            }
            else {
                one["Id0"] = -1;
            }
        }
        // 关卡信息
        var Stage = stageData["Stage"];
        if (ConfigConst.env == "dev") {
            this.DropBlocks = [
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2042, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2003, 2002, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] },
                { "DropIds": [2001, 2002, 2003, 2004, 2005, 2006] }
            ];
            this.Belts = [];
        }
        else {
            this.DropBlocks = Stage["DropBlocks"];
            this.Belts = Stage["Belts"];
        }
        Log.getInstance().trace("===========TG_Stage 数据初始化============");
        this.IsStepLimit = Stage["IsStepLimit"];
        this.IsConditionLimit = Stage["IsConditionLimit"];
        this.IsElementLimit1 = Stage["IsElementLimit1"];
        this.IsElementLimit2 = Stage["IsElementLimit2"];
        // 关卡id信息
        this.StageId = Stage["StageId"];
        this.Name = Stage["Name"];
        // Log.getInstance().trace("Name"+this.Name, 0);
        this.Dec = Stage["Dec"];
        // Log.getInstance().trace("Dec"+this.Dec, 0);
        this.Author = Stage["Author"];
        if (!this.Author) {
            this.Author = { "Avatar": "", "Name": "作者名称" };
        }
        // Log.getInstance().trace("Author==========");
        // Log.getInstance().trace(this.Author, 0);
        this.TextureUrl = Stage["TextureUrl"];
        if (!this.TextureUrl) {
            this.TextureUrl = "";
        }
        // Log.getInstance().trace("TextureUrl"+this.TextureUrl, 0);
        this.MoneyType = Stage["MoneyType"];
        // Log.getInstance().trace("MoneyType"+this.MoneyType, 0);
        this.Cost = Stage["Cost"];
        // Log.getInstance().trace("Cost"+this.Cost, 0);
        this.VoiceUrl = Stage["VoiceUrl"];
        // Log.getInstance().trace("VoiceUrl"+this.VoiceUrl, 0);
        this.VoiceTime = Stage["VoiceTime"];
        // Log.getInstance().trace("VoiceTime"+this.VoiceTime, 0);
        this.SingelModel = Stage["SingelModel"];
        // Log.getInstance().trace("SingelModel"+this.SingelModel, 0);
        this.RuleType = Stage["RuleType"];
        // Log.getInstance().trace("RuleType"+this.RuleType, 0);
        this.IsTimeLimit = Stage["IsTimeLimit"];
        // Log.getInstance().trace("IsTimeLimit"+this.IsTimeLimit, 0);
        this.StageVictoryType = Stage["StageVictoryType"];
        // Log.getInstance().trace("StageVictoryType"+this.StageVictoryType, 0);
        this.Step = Stage["Step"];
        // Log.getInstance().trace("Step"+this.Step, 0);
        this.StoryType = Stage["StoryType"];
        // Log.getInstance().trace("StoryType"+this.StoryType, 0);
        this.Time = Stage["Time"];
        // Log.getInstance().trace("Time"+this.Time, 0);
        this.FishNum = Stage["FishNum"];
        // Log.getInstance().trace("FishNum"+this.FishNum, 0);
        this.TimeLimitLength = Stage["TimeLimitLength"];
        // Log.getInstance().trace("TimeLimitLength"+this.TimeLimitLength, 0);
        this.LinkNum = Stage["LinkNum"];
        // Log.getInstance().trace("LinkNum"+this.LinkNum, 0);
        this.PropNum = Stage["PropNum"];
        // Log.getInstance().trace("PropNum"+this.PropNum, 0);
        this.CanCreateFish = Stage["CanCreateFish"];
        // Log.getInstance().trace("CanCreateFish"+this.CanCreateFish, 0);
        this.DropModel = Stage["DropModel"];
        this.DropModels = Stage["DropModels"];
        // Log.getInstance().trace("DropModel"+this.DropModel, 0);
        this.IsAddTarget = Stage["IsAddTarget"];
        // Log.getInstance().trace("IsTargetAdd"+this.IsTargetAdd, 0);
        this.RollTargetIsVictory = Stage["RollTargetIsVictory"];
        // Log.getInstance().trace("RollTargetIsVictory"+this.RollTargetIsVictory, 0);
        this.IsCanUseProp = Stage["IsCanUseProp"];
        // Log.getInstance().trace("IsCanUseProp"+this.IsCanUseProp, 0);
        this.IsUsePropInBag = Stage["IsUsePropInBag"];
        // Log.getInstance().trace("IsUsePropInBag"+this.IsUsePropInBag, 0);
        this.IsAddInfectJudge = Stage["IsAddInfectJudge"];
        // Log.getInstance().trace("IsAddInfectJudge"+this.IsAddInfectJudge, 0);
        this.IsOfficial = Stage["IsOfficial"];
        // Log.getInstance().trace("IsOfficial"+this.IsOfficial, 0);
        this.IsDefaultMotif = Stage["IsDefaultMotif"];
        // Log.getInstance().trace("IsDefaultMotif"+this.IsDefaultMotif, 0);
        this.Blocks = Stage["Blocks"];
        // Log.getInstance().trace("Blocks"+this.Blocks, 0);
        // Log.getInstance().trace("DropBlocks"+this.DropBlocks, 0);
        this.Targets1 = Stage["Targets1"];
        // Log.getInstance().trace("Targets1"+this.Targets1, 0);
        this.Targets2 = Stage["Targets2"];
        // Log.getInstance().trace("Targets2"+this.Targets2, 0);
        this.ItemIds = Stage["ItemIds"];
        this.ItemNums = Stage["ItemNums"];
        this.Items = [];
        for (var i = 0; i < this.ItemIds.length; i++) {
            var obj = { "id": this.ItemIds[i], "num": this.ItemNums[i] };
            this.Items.push(obj);
        }
        // Log.getInstance().trace("Items"+this.Items, 0);
        this.PropChests = Stage["PropChests"];
        // Log.getInstance().trace("PropChests"+this.PropChests, 0);
        this.ARollTargets = Stage["ARollTargets"] ? Stage["ARollTargets"] : [];
        // Log.getInstance().trace("ARollTargets"+this.ARollTargets, 0);
        this.BRollTargets = Stage["BRollTargets"] ? Stage["BRollTargets"] : [];
        // Log.getInstance().trace("BRollTargets"+this.BRollTargets, 0);
        this.AutoRollTargets = Stage["AutoRollTargets"];
        // Log.getInstance().trace("AutoRollTargets"+this.AutoRollTargets, 0);
        this.Caterpillars = Stage["Caterpillars"] ? Stage["Caterpillars"] : [];
        // Log.getInstance().trace("Caterpillars:"+this.Caterpillars, 0);
        this.SetColorNumElement = Stage["SetColorNumElement"];
        // Log.getInstance().trace("SetColorNumElement:"+this.SetColorNumElement, 0);
        this.ItemMotifs = Stage["ItemMotifs"];
        // Log.getInstance().trace("ItemMotifs"+this.ItemMotifs, 0);
        this.setColorNumElement = Stage["SetColorNumElement"];
        this.ALimitTargets1 = Stage["ALimitTargets1"];
        this.BLimitTargets1 = Stage["BLimitTargets1"];
        this.ALimitTargets2 = Stage["ALimitTargets2"];
        this.BLimitTargets2 = Stage["BLimitTargets2"];
        this.IsSyncCollectTarget = Stage["IsSyncCollectTarget"];
        this.IsLimitUsePropCount = Stage["IsLimitUsePropCount"];
        // test
        this.Step = 1;
        // this.Targets1[0]["Num"] = 1;
        // console.info(this.Targets1);
        // console.info(1234567)
        App.MessageCenter.dispatch(Msg.Event.NetDataInitComplete);
    };
    TG_Stage.FishNum = 2; //鱼数量
    TG_Stage.DropModel = false; // 是否为随机掉落 true 顺序掉落 false 为随机掉落 老数据
    TG_Stage.DropModels = []; ////掉落模式   1 顺序掉落  0 随机掉落 新数据
    TG_Stage.Blocks = []; //棋盘块
    TG_Stage.DropBlocks = []; //掉落块
    TG_Stage.Targets1 = []; //A任务目标（存在服务器真实数据）
    TG_Stage.Targets2 = []; //B任务目标（存在服务器真实数据）
    TG_Stage.Items = []; //可使用物品
    TG_Stage.ItemIds = []; // 可使用物品id列表
    TG_Stage.ItemNums = []; // 可使用物品数量列表
    TG_Stage.PropChests = []; // 道具宝箱
    TG_Stage.ARollTargets = []; // 目标滚动类型的任务目标
    TG_Stage.BRollTargets = []; // 目标滚动类型的任务目标
    TG_Stage.AutoRollTargets = []; // 自动滚动棋盘的任务目标
    TG_Stage.Caterpillars = []; // 毛毛虫列表
    TG_Stage.SetColorNumElement = []; //保存棋盘选中的颜色块
    TG_Stage.ItemMotifs = []; // 元素主题列表
    TG_Stage.setColorNumElement = []; // 预设掉落块
    TG_Stage.ALimitTargets1 = []; //玩家1 失败条件1
    TG_Stage.ALimitTargets2 = []; //玩家1 失败条件2
    TG_Stage.BLimitTargets1 = []; //玩家2 失败条件1
    TG_Stage.BLimitTargets2 = []; //玩家2 失败条件2
    TG_Stage.IsStepLimit = false; //是否限制回合
    TG_Stage.IsConditionLimit = false; //是否条件限制
    TG_Stage.IsElementLimit1 = false; //是否限制元素1
    TG_Stage.IsElementLimit2 = false; //是否限制元素2
    TG_Stage.IsSyncCollectTarget = false; //直接收集任务目标
    TG_Stage.IsLimitUsePropCount = false; //道具使用限制
    TG_Stage.Belts = []; //传送带
    return TG_Stage;
}());
__reflect(TG_Stage.prototype, "TG_Stage");
//# sourceMappingURL=TG_Stage.js.map