var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/6/26.
 *  运行常量
 */
var Msg = (function () {
    function Msg() {
    }
    //特效块类型
    Msg.EffectType = {
        ET_none: 0,
        ET_Hor: 1,
        ET_Vel: 2,
        ET_Gold: 5,
        ET_Black: 10,
        ET_Bird: 20,
        ET_ChangeColor: 50,
        ET_Egg: 100,
        ET_SecondBoom: 99,
        ET_SuperBoom: 999
    };
    //事件名
    Msg.Event = {
        AddScore: "AddScoreEvent",
        RePlay: "RePlayEvent",
        BeginGame: "BeginGameEvent",
        BeginGame2: "BeginGame2Event",
        BeginTimeDrop: "BeginTimeDropEvent",
        SelectProp: "SelectPropEvent",
        CancelSelectProp: "CancelSelectPropEvent",
        GameResize: "10000",
        NetLoadComplete: "NetLoadCompleteEvent",
        NetDataInitComplete: "NetDataInitCompleteEvent",
        H5ServerDataInitComplete: "H5ServerDataInitComplete",
        UseProp: "UsePropEvent",
        CreateHairBall: "CreateHairBall",
        BrowseGameBeginRoll: "BrowseGameBeginRollEvent",
        BrowseRollUp: "BrowseRollUpEvent",
        ClearBeginRollItem: "ClearBeginRollItem",
        CreateGameItem: "CreateGameItemEvent",
        cleatDoStartDrop: "cleatDoStartDropEvent",
        StartHintFunction: "StartHintFunctionEvent",
        StopHintFunction: "StopHintFunctionEvent",
        AIMoveFunction: "AIMoveFunction",
        RoundTime: "RoundTimeEvent",
        StopRoundTime: "stopRoundTimeEvent",
        ChaneRound: "ChaneRoundEvent",
        StartTimeLimitCountdown: "StartTimeLimitCountdownEvent",
        StopTimeLimitCountdown: "StopTimeLimitCountdownEvent",
        refreshTimeShow: "refreshTimeShowEvent",
        refreshStepShow: "refreshStepShowEvent",
        refreshScoreShow: "refreshScoreShowEvent",
        refreshVictoryTask: "refreshVictoryTaskEvent",
        refreshDefeatTask: "refreshDefeatTask",
        itemFlyToVictoryTask: "itemFlyToVictoryTaskEvent",
    };
    //socket和http 事件
    Msg.NetEvent = {
        Get_UserInfo: "Get_UserInfoEvent",
        Send_GameScore: "Send_GameScoreEvent",
        Get_RankData: "Get_RankDataEvent",
    };
    return Msg;
}());
__reflect(Msg.prototype, "Msg");
/*加分类型对应分数*/
var ScoreType;
(function (ScoreType) {
    ScoreType[ScoreType["ST_Normal"] = 10] = "ST_Normal";
    ScoreType[ScoreType["ST_CreateBird"] = 10] = "ST_CreateBird";
    ScoreType[ScoreType["ST_CreateHor"] = 10] = "ST_CreateHor";
    ScoreType[ScoreType["ST_CreateVel"] = 10] = "ST_CreateVel";
    ScoreType[ScoreType["ST_CreateGold"] = 20] = "ST_CreateGold";
    ScoreType[ScoreType["ST_CreateBlack"] = 50] = "ST_CreateBlack";
    ScoreType[ScoreType["ST_Normal_Black"] = 300] = "ST_Normal_Black";
    ScoreType[ScoreType["ST_ExplodeBB"] = 400] = "ST_ExplodeBB";
    ScoreType[ScoreType["ST_ExplodeHor_Bird"] = 450] = "ST_ExplodeHor_Bird";
    ScoreType[ScoreType["ST_ExplodeVel_Bird"] = 450] = "ST_ExplodeVel_Bird";
    ScoreType[ScoreType["ST_ExplodeGold_Bird"] = 450] = "ST_ExplodeGold_Bird";
    ScoreType[ScoreType["ST_ExplodeHV"] = 500] = "ST_ExplodeHV";
    ScoreType[ScoreType["ST_ExplodeGHV"] = 1000] = "ST_ExplodeGHV";
    ScoreType[ScoreType["ST_ExplodeGG"] = 1500] = "ST_ExplodeGG";
    ScoreType[ScoreType["ST_ExplodeBlackB"] = 1500] = "ST_ExplodeBlackB";
    ScoreType[ScoreType["ST_ExplodeBlackHV"] = 2000] = "ST_ExplodeBlackHV";
    ScoreType[ScoreType["ST_ExplodeBlackG"] = 2500] = "ST_ExplodeBlackG";
    ScoreType[ScoreType["ST_ExplodeBlackBlack"] = 5000] = "ST_ExplodeBlackBlack";
    ScoreType[ScoreType["ST_STEPSCORE"] = 2500] = "ST_STEPSCORE";
    ScoreType[ScoreType["ST_ExplodeGift"] = 100] = "ST_ExplodeGift";
    ScoreType[ScoreType["ST_ExplodeCloud"] = 100] = "ST_ExplodeCloud";
    ScoreType[ScoreType["ST_ExplodePea"] = 100] = "ST_ExplodePea";
    ScoreType[ScoreType["ST_ExplodeHairBall"] = 100] = "ST_ExplodeHairBall";
    ScoreType[ScoreType["ST_ExplodeMesh"] = 100] = "ST_ExplodeMesh";
    ScoreType[ScoreType["ST_ExplodeFlowIce"] = 100] = "ST_ExplodeFlowIce";
    ScoreType[ScoreType["ST_ExplodeIce"] = 100] = "ST_ExplodeIce";
})(ScoreType || (ScoreType = {}));
/*当前游戏状态*/
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["GS_PARPER"] = 0] = "GS_PARPER";
    GameStatus[GameStatus["GS_ARound"] = 1] = "GS_ARound";
    GameStatus[GameStatus["GS_BRound"] = 2] = "GS_BRound";
    GameStatus[GameStatus["GS_AVictory"] = 3] = "GS_AVictory";
    GameStatus[GameStatus["GS_BVictory"] = 4] = "GS_BVictory";
})(GameStatus || (GameStatus = {}));
/*胜利方式*/
var VictoryType;
(function (VictoryType) {
    VictoryType[VictoryType["VT_ScoreOnTime"] = 0] = "VT_ScoreOnTime";
    VictoryType[VictoryType["VT_TargetOnTime"] = 1] = "VT_TargetOnTime";
})(VictoryType || (VictoryType = {}));
var RankData = (function () {
    function RankData() {
        this.stage_id = "1"; //排行榜id
        this.type = 0; // 0 失败 1 成功
        this.stage_type = 0; //排行榜关卡类型 0 消除 1收集
        this.condition_limit = 0; // -1 不限制 0 步数 1 时间
        this.player_id = "0"; //玩家id
        this.used_step_num = 0; //使用步数
        this.used_time = 0; //使用时间
        this.remove_block_num = 0; //消除的方块
        this.score_num = 0; //分数
        this.respData = null; // 响应数据
    }
    return RankData;
}());
__reflect(RankData.prototype, "RankData");
/*毛虫身体部位*/
var CaterpillarsData;
(function (CaterpillarsData) {
    CaterpillarsData[CaterpillarsData["CD_TOP"] = 0] = "CD_TOP";
    CaterpillarsData[CaterpillarsData["CD_BODY_BODY"] = 1] = "CD_BODY_BODY";
    CaterpillarsData[CaterpillarsData["CD_TOP_BUTTON"] = 0] = "CD_TOP_BUTTON";
})(CaterpillarsData || (CaterpillarsData = {}));
//# sourceMappingURL=RuningConst.js.map