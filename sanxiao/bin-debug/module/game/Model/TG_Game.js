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
 * Created by ZhangHui on 2018/6/5.
 */
var List = eui.List;
var TG_Game = (function (_super) {
    __extends(TG_Game, _super);
    function TG_Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RowNum = TG_MapData.getInstance().rowNum; //行数
        _this.ColNum = TG_MapData.getInstance().colNum; //列数
        _this.MaxIndex = _this.RowNum * _this.ColNum - 1; //格子数
        /*滚动目标*/
        _this.aRollIndex = 0;
        _this.ARollTargets = [];
        _this.bRollIndex = 0;
        _this.BRollTargets = [];
        _this.AutoRollTargets = [];
        /*胜利任务目标*/
        _this.ATaskTargets = [];
        _this.BTaskTargets = [];
        /*失败任务目标1*/
        _this.ADefeatTaskTargets1 = [];
        _this.BDefeatTaskTargets1 = [];
        /*失败任务目标2*/
        _this.ADefeatTaskTargets2 = [];
        _this.BDefeatTaskTargets2 = [];
        //是否是时间模式
        _this.IsTimeLimit = false;
        _this.TimeLimitLength = 0;
        //游戏规则 消除0 收集1
        _this.RuleType = 0;
        //当前回合的掉落次数
        _this.combo = 0;
        // 无限掉落
        _this.infiniteDrop = false;
        // 收集模式无收集目标
        _this.advanceEnd = false;
        _this.m_Status = 0; //当前游戏状态
        _this.isAFirst = false; //A是否是先手
        /// 当前爆炸类型,0是普通块 1 黑洞 2 两个特殊块,3 黑洞加条消
        _this._explosiveType = 0;
        /*存储本回合爆炸的所有的鸟*/
        _this.birds = [];
        //鸟爆炸生成的飞鸟个数
        //创建的特效块
        _this.AsyncEffectParams = [];
        // 鸟的序号
        _this.birdIndex = 0;
        /*黑洞+条形*/
        _this.BlackHoles = [];
        /*射线形成特效块完毕 开始特效消除*/
        _this.BulletExplodeTime = 0;
        _this.isBulletExplode = false; //是否是子弹的爆炸
        _this.BulletExplodeIndex = -1;
        /**
         * 是否可以传染毒液
         */
        _this.venomExplode = true;
        _this.SpecialExplodeTriangleDelay = 0;
        /*垂直掉落*/
        _this.downGroups = []; //本回合掉落的块
        /*执行掉落表演*/
        _this.downRectTime = 150;
        /*初始化出生点*/
        _this.birthPosYs = []; //宝石出生点Y坐标
        /*出生点产生新块*/
        _this.createList = [];
        //初始化掉落游标
        _this.dropCursor = []; //掉落游标
        _this.m_Link = 0; //当前连击数 回合结束后重置
        _this.m_FirstLink = false;
        _this.m_FisrtMarkRemove = false;
        _this.isCombo = false;
        /*滚动逻辑*/
        _this.rollingTime = 0;
        /*滚动*/
        _this.realRollRow = 0;
        _this.curRollRow = 0;
        _this.rollLeaveDrops = []; //滚动遗留掉落
        _this.cRollClearItems = [];
        /*打乱所有元素块*/
        _this.cantRandomAllItem = false; //无法打乱棋盘
        /*判断是否有有效的道具  包括：横消、竖消、炸弹、金锤*/
        _this.usedToolTimes = 0; //回合内使用道具的次数
        return _this;
    }
    /*初始化游戏数据*/
    TG_Game.InitGame = function () {
        //数组清空
        this.Items = [];
        this.Buttons = [];
        this.Ices = [];
        this.Meshs = [];
        this.Clouds = [];
        this.Railings = [];
        this.Caterpillars = [];
        this.Infects = [];
        //默认为用户未有操作
        TG_Game.IsPlayerHasTouched = false;
        //初始化游戏消除延迟时间
        TG_TimeDefine.InitTimeDefine();
        //初始化AI分数权值配置
        TG_AIConfigEntry.getInstance().InitAIConfigEntry();
        //初始
        TG_Game.getInstance().initTG_GameData();
        this.MaxdropDelay = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        if (this.isNeedInitListenEvent) {
            this.isNeedInitListenEvent = false;
            TG_Game.getInstance().initListenEvent();
        }
        //初始化棋盘提示的倒计时功能
        TG_HintFunction.getInstance().initHintFunction();
    };
    TG_Game.prototype.initTG_GameData = function () {
        //初始化掉落游标
        this.initDropCursor();
        //当前游戏状态
        this.m_Status = GameStatus.GS_ARound;
        //当前连击数
        this.m_Link = 0;
        this.m_FirstLink = false;
        this.m_FisrtMarkRemove = false;
        this.isCombo = false;
        //道具使用次数
        this.usedToolTimes = 0;
        //失败条件1
        this.IsElementLimit1 = TG_Stage.IsElementLimit1;
        //失败条件2
        this.IsElementLimit2 = TG_Stage.IsElementLimit2;
        //初始化任务目标
        this.initTaskTarget();
        this.aRollIndex = 0;
        this.ARollTargets = TG_Stage.ARollTargets;
        this.bRollIndex = 0;
        this.BRollTargets = TG_Stage.BRollTargets;
        this.AutoRollTargets = TG_Stage.AutoRollTargets;
        //当前得分
        this.AScore = 0;
        this.BScore = 0;
        //当前步数
        this.AStepNum = TG_Stage.Step;
        this.BStepNum = TG_Stage.Step;
        this.AUsedStepNum = 0;
        this.BUsedStepNum = 0;
        //是否是时间模式
        this.IsTimeLimit = TG_Stage.IsTimeLimit;
        this.TimeLimitLength = TG_Stage.TimeLimitLength;
        //游戏规则
        this.RuleType = TG_Stage.RuleType;
        //当前回合的掉落次数
        this.combo = 0;
        //无限掉落
        this.infiniteDrop = false;
        //收集模式无收集目标
        this.advanceEnd = false;
        this.curRollRow = TG_Game.getInstance().RowNum;
        //无法打乱
        this.cantRandomAllItem = false;
        // 初始化滚动遗留掉落
        this.rollLeaveDrops = [];
        for (var i = 0; i < TG_Game.getInstance().ColNum; i++) {
            var drops = [];
            this.rollLeaveDrops.push(drops);
        }
    };
    /*设置游戏状态*/
    TG_Game.SetGameState = function (bool) {
        if (bool) {
            TG_Game.currentState = 1;
        }
        else {
            //结束
            TG_Game.currentState = 2;
        }
    };
    /*初始化任务目标*/
    TG_Game.prototype.initTaskTarget = function () {
        //A
        this.ATaskTargets = [];
        for (var _i = 0, _a = TG_Stage.Targets1; _i < _a.length; _i++) {
            var info = _a[_i];
            var target = new TG_TaskTarget();
            target.Target = info.Target;
            target.Num = info.Num;
            target.Cur = info.Cur;
            this.ATaskTargets.push(target);
        }
        if (this.IsElementLimit1) {
            this.ADefeatTaskTargets1 = [];
            for (var _b = 0, _c = TG_Stage.ALimitTargets1; _b < _c.length; _b++) {
                var info = _c[_b];
                var target = new TG_TaskTarget();
                target.Target = info.Target;
                target.Num = info.Num;
                target.Cur = info.Cur;
                this.ADefeatTaskTargets1.push(target);
            }
        }
        if (this.IsElementLimit2) {
            this.ADefeatTaskTargets2 = [];
            for (var _d = 0, _e = TG_Stage.ALimitTargets2; _d < _e.length; _d++) {
                var info = _e[_d];
                var target = new TG_TaskTarget();
                target.Target = info.Target;
                target.Num = info.Num;
                target.Cur = info.Cur;
                this.ADefeatTaskTargets2.push(target);
            }
        }
        //pk模式 B
        if (!TG_Stage.SingelModel) {
            this.BTaskTargets = [];
            for (var _f = 0, _g = TG_Stage.Targets2; _f < _g.length; _f++) {
                var info = _g[_f];
                var target = new TG_TaskTarget();
                target.Target = info.Target;
                target.Num = info.Num;
                target.Cur = info.Cur;
                this.BTaskTargets.push(target);
            }
            if (this.IsElementLimit1) {
                this.BDefeatTaskTargets1 = [];
                for (var _h = 0, _j = TG_Stage.BLimitTargets1; _h < _j.length; _h++) {
                    var info = _j[_h];
                    var target = new TG_TaskTarget();
                    target.Target = info.Target;
                    target.Num = info.Num;
                    target.Cur = info.Cur;
                    this.BDefeatTaskTargets1.push(target);
                }
            }
            if (this.IsElementLimit2) {
                this.BDefeatTaskTargets2 = [];
                for (var _k = 0, _l = TG_Stage.BLimitTargets2; _k < _l.length; _k++) {
                    var info = _l[_k];
                    var target = new TG_TaskTarget();
                    target.Target = info.Target;
                    target.Num = info.Num;
                    target.Cur = info.Cur;
                    this.BDefeatTaskTargets2.push(target);
                }
            }
        }
    };
    /*监听游戏事件*/
    TG_Game.prototype.initListenEvent = function () {
        //监听开始页面的开始事件
        App.MessageCenter.addListener(Msg.Event.BeginGame2, this.beginPanelStartEvent, this);
        //监听开始页面的开始事件
        App.MessageCenter.addListener(Msg.Event.CreateHairBall, this.createHairBall, this);
    };
    /**
     * 黑色块消失后开始创建新的白色毛球
     * @param pos
     */
    TG_Game.prototype.createHairBall = function (pos) {
        // let row = pos.Y;
        // let col = pos.X;
        // console.info(row+"====333==="+col);
        // 是否在生产一个白色方块
        var blockLst = this.canGeneOneBlockLst(pos);
        console.log(blockLst);
        if (blockLst.length > 0) {
            var oneBlock = blockLst[Math.floor(Math.random() * blockLst.length)];
            var layerId = "7001";
            // GamePanel_ItemSp.getInstance().createItemEffect(layerId,oneBlock.SitePos.Y,oneBlock.SitePos.X,Msg.EffectType.ET_none);
            if (oneBlock)
                oneBlock.CreateHair();
        }
    };
    /**
     * 根据块位置查看当前块能否向周围生成其他块
     * @param pos
     */
    TG_Game.prototype.canGeneOneBlockLst = function (pos) {
        var row = pos.Y;
        var col = pos.X;
        var topItemIndex = this.GetTopItem(this.GetIndexByPos(row, col));
        var letItemIndex = this.GetLeftItem(this.GetIndexByPos(row, col));
        var rightItemIndex = this.GetRightItem(this.GetIndexByPos(row, col));
        var bottomItemIndex = this.GetBottomItem(this.GetIndexByPos(row, col));
        var topItem = this.GetItemByIndex(topItemIndex);
        var letItem = this.GetItemByIndex(letItemIndex);
        var rightItem = this.GetItemByIndex(rightItemIndex);
        var bottomItem = this.GetItemByIndex(bottomItemIndex);
        var tgItemLst = [];
        if ((topItem && !topItem.getItemNone() && !topItem.IsItemNull() && (topItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || topItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT) && !this.CheckHasHighItems(topItemIndex))) {
            tgItemLst.push(topItem);
        }
        if ((letItem && !letItem.getItemNone() && !letItem.IsItemNull() && (letItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || letItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT) && !this.CheckHasHighItems(letItemIndex))) {
            tgItemLst.push(letItem);
        }
        if ((rightItem && !rightItem.getItemNone() && !rightItem.IsItemNull() && (rightItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || rightItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT) && !this.CheckHasHighItems(rightItemIndex))) {
            tgItemLst.push(rightItem);
        }
        if ((bottomItem && !bottomItem.getItemNone() && !bottomItem.IsItemNull() && (bottomItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || bottomItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT) && !this.CheckHasHighItems(bottomItemIndex))) {
            tgItemLst.push(bottomItem);
        }
        return tgItemLst;
    };
    TG_Game.prototype.beginPanelStartEvent = function () {
        if (TG_Stage.SingelModel) {
            //单人模式
            this.m_Status = GameStatus.GS_ARound;
        }
        else {
            this.m_Status = Math.floor(Math.random() * 2) == 0 ? GameStatus.GS_ARound : GameStatus.GS_BRound;
        }
        this.isAFirst = this.m_Status == GameStatus.GS_ARound;
        Log.getInstance().trace("游戏开始 当前回合为" + this.m_Status);
        this.SurplusTime = TG_Stage.TimeLimitLength;
        var obj = this.doBeginGame_Roll();
        if (!TG_Stage.IsTimeLimit) {
            if (obj.needBrowseChessboard) {
                //需要棋盘滚动
                Log.getInstance().trace("开始游戏的棋盘滚动总时间:" + obj.browseLineTime);
                //监听移除开始游戏滚动多余元素
                App.MessageCenter.addListener(Msg.Event.cleatDoStartDrop, this.cleatDoStartDrop, this);
            }
            else {
                App.MessageCenter.dispatch(Msg.Event.CreateGameItem);
                App.TimerManager.doTimer(500, 1, this.doStartDrop, this);
            }
        }
        else {
            //时间模式 不需要滚动
            if (!obj.needBrowseChessboard) {
                App.MessageCenter.dispatch(Msg.Event.CreateGameItem);
                this.cleatDoStartDrop();
            }
            else {
                //监听移除开始游戏滚动多余元素
                App.MessageCenter.addListener(Msg.Event.cleatDoStartDrop, this.cleatDoStartDrop, this);
            }
        }
    };
    TG_Game.prototype.cleatDoStartDrop = function () {
        if (TG_Stage.IsTimeLimit) {
            //时间模式
            App.MessageCenter.dispatch(Msg.Event.StartTimeLimitCountdown);
            App.MessageCenter.addListener(Msg.Event.StopTimeLimitCountdown, this.timeLimitDoStartDrop, this);
        }
        else {
            App.TimerManager.remove(this.doStartDrop, this);
            this.doStartDrop();
        }
    };
    /*时间模式下开始执行掉落*/
    TG_Game.prototype.timeLimitDoStartDrop = function () {
        TG_Game.SetGameState(true);
        this.doStartDrop();
        //开始时间模式的倒计时
        this.doGameCutTime();
    };
    /*检测棋盘是否需要滚动*/
    TG_Game.prototype.doBeginGame_Roll = function () {
        var obj = {
            "needBrowseChessboard": false,
            "browseLineTime": 0
        };
        var stageData = TG_MapData.getInstance().stageData.Stage;
        //检测是否可以滚动
        var totalLine = stageData.Blocks.length / this.ColNum;
        var needBrowseChessboard = totalLine > this.RowNum;
        //滚动行数
        var browseLineNum = totalLine - this.RowNum;
        //滚动所需时间
        var browseLineTime = browseLineNum * TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay) + 500;
        if (needBrowseChessboard) {
            //棋盘开始滚动
            TG_Game.SetGameState(false);
            App.MessageCenter.dispatch(Msg.Event.BrowseGameBeginRoll, browseLineNum);
        }
        obj.needBrowseChessboard = needBrowseChessboard;
        obj.browseLineTime = browseLineTime;
        return obj;
    };
    /**
     *
     *为鸡蛋块爆炸生成新的普通元素块
     *
     */
    TG_Game.prototype.createElementItemForEgg = function (layerid, origin, effectType) {
        if (effectType === void 0) { effectType = Msg.EffectType.ET_none; }
        var color = Number(layerid) % 10;
        var targetElementLst = this.getEggTargetElements(color);
        // Log.getInstance().trace(targetElementLst,0);
        for (var oneIndex in targetElementLst) {
            var oneItem = targetElementLst[oneIndex];
            GamePanel_ItemSp.getInstance().createElementItemForEgg(layerid, origin, oneItem.SitePos.Y, oneItem.SitePos.X, effectType);
        }
    };
    TG_Game.prototype.getEggTargetElements = function (color) {
        var items = TG_Game.Items;
        var targetElementLsts = [];
        var indexLsts = [];
        var number = 0;
        while (targetElementLsts.length < 3 && number < 30) {
            number++;
            var oneItemsIndex = Math.floor((Math.random() * items.length));
            var oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_NORMAL) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts, oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        var number2 = 0;
        while (targetElementLsts.length < 3 && number2 < 30) {
            number2++;
            var oneItemsIndex = Math.floor((Math.random() * items.length));
            var oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts, oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        var number3 = 0;
        while (targetElementLsts.length < 3 && number3 < 30) {
            number3++;
            var oneItemsIndex = Math.floor((Math.random() * items.length));
            var oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts, oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        return targetElementLsts;
    };
    TG_Game.prototype.geneElementTemp = function (setColorNumElement, setColorNumElementTemp) {
        for (var i in setColorNumElement) {
            setColorNumElementTemp[i] = setColorNumElement[i];
        }
    };
    /* 随机块生成某个具体方块 */
    TG_Game.prototype.geneSpecByRandom = function (setColorNumElement) {
        if (setColorNumElement === void 0) { setColorNumElement = [1, 2, 3, 4, 5, 6]; }
        var setColorNumElementTemp = [];
        this.geneElementTemp(setColorNumElement, setColorNumElementTemp);
        // 统一生成随机方块
        var blocksDataTemp = TG_MapData.getInstance().blocksDataTemp;
        for (var oneBlocks in blocksDataTemp) {
            var blocksData = blocksDataTemp[oneBlocks];
            if (blocksData.isRandom == 1) {
                // 如果是随机数块则生成一个不可三连消除的随机数块 横联三个相同块 竖联三个相同块 田字块
                var oneRandomNum = this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElementTemp);
                blocksData.layerId = oneRandomNum;
            }
            this.geneElementTemp(setColorNumElement, setColorNumElementTemp);
        }
    };
    /**
     * 只有layerId 以2开头才有可能出现随机块
     * @param blocksDataTemp
     * @param blocksData
     * @returns {any}
     */
    TG_Game.prototype.geneRandomNum = function (blocksDataTemp, blocksData, setColorNumElement) {
        if (setColorNumElement === void 0) { setColorNumElement = [1, 2, 3, 4, 5, 6]; }
        var layerId = blocksData.getLayerId();
        // let endNum = Math.floor(layerId/10) * 10 + Math.round(Math.random()*(6-1) +1);
        if (!setColorNumElement || setColorNumElement.length == 0) {
            return null;
        }
        var index = Math.floor(Math.random() * setColorNumElement.length);
        if (setColorNumElement.length == 1) {
            return Math.floor(layerId / 10) * 10 + setColorNumElement[index];
        }
        var endNum = Math.floor(layerId / 10) * 10 + setColorNumElement[index];
        setColorNumElement.splice(index, 1);
        var row = blocksData.getRow();
        var col = blocksData.getCol();
        var cellNum = blocksData.getCellNum();
        // 棋盘行号
        var rowNum = TG_MapData.getInstance().rowNum;
        // 横向检查 三个块横排检查
        // 前两个块和其组合不能组成消除块
        if (col >= 2 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var left2BlocksData = blocksDataTemp[cellNum - 2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和后面的两个固定块一起组成消除块
        if (col <= 6) {
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            var right2BlocksData = blocksDataTemp[cellNum + 2];
            if (right1BlocksData.isRandom == 0 && right2BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和后面一个固定块 前面一个块 组成消除块
        if (col >= 1 && col <= 7) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            if (right1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 纵向检查 三个块竖排检查
        // 和上面两个块组成消除块
        if (row >= 2 && row <= 8) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var top2BlocksData = blocksDataTemp[cellNum - 2 * rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和上面一个块 下面一个固定块 组成消除块
        if (row >= 1 && row <= 7) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            if (bottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和下面两个固定块 组成消除块
        if (row >= 0 && row <= 6) {
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var bottom2BlocksData = blocksDataTemp[cellNum + 2 * rowNum];
            if (bottom1BlocksData.isRandom == 0 && bottom2BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 纵向和横向 都考虑 四个方块组成田子块检查
        // 左上方
        if (row >= 1 && col >= 1 && row <= 8 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var lefttop1BlocksData = blocksDataTemp[cellNum - rowNum - 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(lefttop1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 右上方
        if (row >= 1 && col >= 0 && row <= 8 && col <= 7) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var rightTop1BlocksData = blocksDataTemp[cellNum - rowNum + 1];
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            if (right1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightTop1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 右下方
        if (row >= 0 && col >= 0 && row <= 7 && col <= 7) {
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var rightBottom1BlocksData = blocksDataTemp[cellNum + rowNum + 1];
            if (right1BlocksData.isRandom == 0 && bottom1BlocksData.isRandom == 0 && rightBottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightBottom1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 左下方
        if (row >= 0 && col >= 1 && row <= 7 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var leftBottom1BlocksData = blocksDataTemp[cellNum + rowNum - 1];
            if (leftBottom1BlocksData.isRandom == 0 && bottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(leftBottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        return endNum;
    };
    /**
     * 只有layerId 以2开头才有可能出现随机块
     * @param blocksDataTemp
     * @param blocksData
     * @returns {any}
     */
    TG_Game.prototype.geneRandomNum2 = function (blocksDataTemp, blocksData, setColorNumElement) {
        if (setColorNumElement === void 0) { setColorNumElement = [1, 2, 3, 4, 5, 6]; }
        var layerId = blocksData.getLayerId();
        // let endNum = Math.floor(layerId/10) * 10 + Math.round(Math.random()*(6-1) +1);
        if (!setColorNumElement || setColorNumElement.length == 0) {
            return null;
        }
        var index = Math.floor(Math.random() * setColorNumElement.length);
        if (setColorNumElement.length == 1) {
            return Math.floor(layerId / 10) * 10 + setColorNumElement[index];
        }
        var endNum = Math.floor(layerId / 10) * 10 + setColorNumElement[index];
        setColorNumElement.splice(index, 1);
        var row = blocksData.getRow();
        var col = blocksData.getCol();
        var cellNum = blocksData.getCellNum();
        // 棋盘行号
        var rowNum = TG_MapData.getInstance().rowNum;
        // 横向检查 三个块横排检查
        // 前两个块和其组合不能组成消除块
        if (col >= 2 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var left2BlocksData = blocksDataTemp[cellNum - 2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和后面的两个固定块一起组成消除块
        if (col <= 6) {
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            var right2BlocksData = blocksDataTemp[cellNum + 2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和后面一个固定块 前面一个块 组成消除块
        if (col >= 1 && col <= 7) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 纵向检查 三个块竖排检查
        // 和上面两个块组成消除块
        if (row >= 2 && row <= 8) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var top2BlocksData = blocksDataTemp[cellNum - 2 * rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和上面一个块 下面一个固定块 组成消除块
        if (row >= 1 && row <= 7) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 和下面两个固定块 组成消除块
        if (row >= 0 && row <= 6) {
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var bottom2BlocksData = blocksDataTemp[cellNum + 2 * rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 纵向和横向 都考虑 四个方块组成田子块检查
        // 左上方
        if (row >= 1 && col >= 1 && row <= 8 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var lefttop1BlocksData = blocksDataTemp[cellNum - rowNum - 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(lefttop1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 右上方
        if (row >= 1 && col >= 0 && row <= 8 && col <= 7) {
            var top1BlocksData = blocksDataTemp[cellNum - rowNum];
            var rightTop1BlocksData = blocksDataTemp[cellNum - rowNum + 1];
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightTop1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 右下方
        if (row >= 0 && col >= 0 && row <= 7 && col <= 7) {
            var right1BlocksData = blocksDataTemp[cellNum + 1];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var rightBottom1BlocksData = blocksDataTemp[cellNum + rowNum + 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightBottom1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        // 左下方
        if (row >= 0 && col >= 1 && row <= 7 && col <= 8) {
            var left1BlocksData = blocksDataTemp[cellNum - 1];
            var bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            var leftBottom1BlocksData = blocksDataTemp[cellNum + rowNum - 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(leftBottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp, blocksData, setColorNumElement);
            }
        }
        return endNum;
    };
    /**
     * 获取数字个位数字
     *
     * @param layerId
     * @returns {Number}
     */
    TG_Game.prototype.getLayerEndNum = function (layerId) {
        var layerEndNum = Number(layerId % 10);
        return layerEndNum;
    };
    /*是否可以进行交换位置*/
    TG_Game.prototype.IsCanExchange = function (row1, col1, row2, col2, needNeighbor) {
        if (needNeighbor === void 0) { needNeighbor = true; }
        this.m_FisrtMarkRemove = true;
        this.m_FirstLink = false;
        var isCanExchange = false;
        var item = this.GetItemByPos(row1, col1);
        var destItem = this.GetItemByPos(row2, col2);
        if (item == null || destItem == null || item == undefined || destItem == undefined) {
            isCanExchange = false;
        }
        if (needNeighbor && !this.checkIsNeighbor(row1, col1, row2, col2)) {
            isCanExchange = false;
        }
        var tempList = [];
        /*检查横向*/
        this.getRowChain(item, tempList);
        if (tempList.length >= 3) {
            isCanExchange = true;
        }
        tempList = [];
        this.getRowChain(destItem, tempList);
        if (tempList.length >= 3) {
            isCanExchange = true;
        }
        tempList = [];
        /*检查纵向*/
        this.getColChain(item, tempList);
        if (tempList.length >= 3) {
            isCanExchange = true;
        }
        tempList = [];
        this.getColChain(destItem, tempList);
        if (tempList.length >= 3) {
            isCanExchange = true;
        }
        //是否可以形成鸟
        if (this.CheckBird(item) || this.CheckBird(destItem)) {
            isCanExchange = true;
        }
        //是否有栏杆
        var isRailing = false;
        if (needNeighbor && !this.CheckRailingCouldMove(item, destItem)) {
            isCanExchange = false;
            isRailing = true;
        }
        //是否有铁丝网或者云层
        var idMeshOrCloud = false;
        if (!item.CheckCellCouldMove() || !destItem.CheckCellCouldMove()) {
            isCanExchange = false;
            idMeshOrCloud = true;
        }
        Log.getInstance().trace("是否可以交换位置======================================================" + isCanExchange);
        if (item.IsItemEffect() && destItem.IsItemEffect() && !isRailing && !idMeshOrCloud) {
            //两个都是特效块
            //减少步数
            this.ReduceStep();
            this.doSwapSpecialNeighbor(item, destItem);
        }
        else if ((item.IsEffectBlack() || destItem.IsEffectBlack()) && !isRailing && !idMeshOrCloud) {
            //如果有一块是黑洞
            //减少步数
            this.ReduceStep();
            this.doSwapBlackAndNormal(item, destItem);
        }
        else if (isCanExchange) {
            //交换位置
            if (!this.DoExchange(row1, col1, row2, col2)) {
                Log.getInstance().trace("DoExchange 不能交换,方块还原之前位置");
                GamePanel_ItemSp.getInstance().restorePositionMove();
            }
            else {
                Log.getInstance().trace("DoExchange 可以执行消除");
                //交换两个普通方块
                //减少步数
                this.ReduceStep();
                this.doSwapNeighbor(row1, col1, row2, col2);
            }
        }
        else {
            TG_Game.IsPlayerDoMove = false; //是否玩家移动
            TG_Game.IsPlayerDoMoveForHasPea1 = false; //月饼坑
            TG_Game.IsPlayerDoMoveForHasPea2 = false; //月饼坑
            TG_Game.IsPlayerDoMoveForFlowIceLogic = false; //流沙
            TG_Game.IsPlayerDoMoveForVenomInfect = false; //小恶魔
            TG_Game.IsPlayerDoMoveForChangeColorBlock = false; //变色块
            TG_Game.IsPlayerDoMoveForHairBallMove = false; //毛球
            TG_Game.IsPlayerDoMoveForBelts = false; //传送带
            //不可以进行交换位置（调用GamePanel_ItemSp的还原位置 restorePositionMove)
            GamePanel_ItemSp.getInstance().restorePositionMove();
        }
    };
    /*检测是否为相邻*/
    TG_Game.prototype.checkIsNeighbor = function (row1, col1, row2, col2) {
        var isNeighbor = false;
        if (row1 == row2 && Math.abs(col1 - col2) == 1) {
            isNeighbor = true;
        }
        if (col1 == col2 && Math.abs(row1 - row2) == 1) {
            isNeighbor = true;
        }
        return isNeighbor;
    };
    /*检测是否有栏杆*/
    TG_Game.prototype.CheckRailingCouldMove = function (des, target) {
        if (des == null || des == undefined || target == null || target == undefined) {
            return true;
        }
        var desIndex = this.GetIndexByPos(des.SitePos.Y, des.SitePos.X);
        var targetIndex = this.GetIndexByPos(target.SitePos.Y, target.SitePos.X);
        var railing = this.GetRailingItemByIndex(desIndex);
        var direction = this.getDirection(desIndex, targetIndex);
        if (railing) {
            if (railing.CheckStopMove(direction))
                return false;
        }
        railing = this.GetRailingItemByIndex(targetIndex);
        direction = this.getDirection(targetIndex, desIndex);
        if (railing) {
            if (railing.CheckStopMove(direction))
                return false;
        }
        return true;
    };
    /*是否可以移动*/
    TG_Game.prototype.CheckCellCouldMove = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        var mesh = this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh() && !mesh.getItemNone()) {
            return false;
        }
        var cloud = this.GetCloudItemByIndex(index);
        if (cloud.IsCloud() && !cloud.getItemNone()) {
            return false;
        }
        return true;
    };
    TG_Game.prototype.DoExchange = function (row1, col1, row2, col2) {
        var isCanExchange = true;
        if (row1 < 0 || col1 < 0 || row2 < 0 || col2 < 0) {
            isCanExchange = false;
        }
        var aItem = this.GetItemByPos(row1, col1);
        var bItem = this.GetItemByPos(row2, col2);
        if (aItem == null || bItem == null) {
            isCanExchange = false;
        }
        this._aExItem = aItem;
        this._bExItem = bItem;
        //检测是否相邻
        if (!this.checkIsNeighbor(row1, col1, row2, col2)) {
            isCanExchange = false;
        }
        aItem.SetMoveItem(true);
        bItem.SetMoveItem(true);
        return isCanExchange;
    };
    /*交换两个普通方块*/
    TG_Game.prototype.doSwapNeighbor = function (row1, col1, row2, col2) {
        //改变两个方块的位置
        this._explosiveType = 0;
        this.SwapItem(row1, col1, row2, col2);
        this.OnExchangeFinish();
    };
    /*黑洞和普通块交换的具体逻辑*/
    TG_Game.prototype.doSwapBlackAndNormal = function (aItem, bItem) {
        this._explosiveType = 1;
        this.SwapItem(aItem.SitePos.Y, aItem.SitePos.X, bItem.SitePos.Y, bItem.SitePos.X);
        this._aExItem = aItem;
        this._bExItem = bItem;
        this.OnExchangeFinish();
    };
    /*交换的两个块都是特效块*/
    TG_Game.prototype.doSwapSpecialNeighbor = function (aItem, bItem) {
        this._explosiveType = 2;
        var effectValue = this.GetEffectValue(aItem, bItem);
        // 黑洞+横消 或 黑洞+竖消 或 黑洞+炸弹 或 黑洞+风车
        if (effectValue == 11 || effectValue == 12 || effectValue == 15 || effectValue == 30) {
            this._explosiveType = 3;
        }
        this.SwapItem(aItem.SitePos.Y, aItem.SitePos.X, bItem.SitePos.Y, bItem.SitePos.X);
        this._aExItem = aItem;
        this._bExItem = bItem;
        this.OnExchangeFinish();
    };
    /*判断是否为两个黑洞特效的交换*/
    TG_Game.prototype.IsBBEffectExchange = function (aItem, bItem) {
        if (!aItem.IsItemEffect() || !bItem.IsItemEffect()) {
            return false;
        }
        var effectValue = aItem.GetEffectType() + bItem.GetEffectType();
        if (effectValue == 20) {
            return true;
        }
        return false;
    };
    /*改变两个方块的位置*/
    TG_Game.prototype.SwapItem = function (row1, col1, row2, col2) {
        //移除当前选中状态的方块
        GamePanel_ItemSp.getInstance().removeCurrentSetRect();
    };
    /*检测是否有高层快*/
    TG_Game.prototype.CheckHasHighItems = function (index) {
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        //云层块
        var cloud = this.GetCloudItemByIndex(index);
        if (!cloud.getItemNone()) {
            return true;
        }
        //铁丝网块
        var mesh = this.GetMeshItemByIndex(index);
        if (!mesh.getItemNone()) {
            return true;
        }
        var item = this.GetHairBallItemByIndex(index);
        if (item.venonatId > 0) {
            return true;
        }
        return false;
    };
    /*获取高层块*/
    TG_Game.prototype.GetHighItems = function (index) {
        var temp = null;
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            temp = null;
            return temp;
        }
        //云层块
        var cloud = this.GetCloudItemByIndex(index);
        if (!cloud.getItemNone()) {
            temp = cloud;
            return temp;
        }
        //铁丝网块
        var mesh = this.GetMeshItemByIndex(index);
        if (!mesh.getItemNone()) {
            temp = mesh;
            return temp;
        }
        //毛球所在元素块对象
        var item = this.GetHairBallItemByIndex(index);
        if (!item.getItemNone()) {
            temp = item;
            return temp;
        }
        return temp;
    };
    TG_Game.prototype.OnExchangeFinish = function () {
        if (this._explosiveType == 1) {
            // 黑洞与普通块
            this.m_FisrtMarkRemove = false;
            var color = -1;
            var pos = void 0;
            if (this._aExItem.IsEffectBlack()) {
                color = this._bExItem.GetColorType();
                pos = this._aExItem.GetSitPos();
            }
            else {
                color = this._aExItem.GetColorType();
                pos = this._bExItem.GetSitPos();
            }
            this.AddScore(ScoreType.ST_Normal_Black);
            var aItemIndex = this.GetIndexByPos(this._aExItem.SitePos.Y, this._aExItem.SitePos.X);
            var bItemIndex = this.GetIndexByPos(this._bExItem.SitePos.Y, this._bExItem.SitePos.X);
            var aButton = this.GetButtonItemByIndex(aItemIndex);
            var bButton = this.GetButtonItemByIndex(bItemIndex);
            var infectArr = [];
            infectArr.push(this._aExItem);
            infectArr.push(this._bExItem);
            if (aButton.IsFect || bButton.IsFect) {
                this.SuperEffectInfect(2, infectArr);
            }
            this.SpecialExplodeBlack(pos, color);
        }
        else if (this._explosiveType == 2) {
            // 除黑洞外的特效块
            this.m_FisrtMarkRemove = false;
            var isBB = this.IsBBEffectExchange(this._aExItem, this._bExItem);
            this.doSuperEffectExplode(this._aExItem, this._bExItem);
            var delayTime = TG_Game.MaxdropDelay;
        }
        else if (this._explosiveType == 3) {
            this.m_FisrtMarkRemove = false;
            //黑洞与条形  黑洞与小鸟 黑洞与炸弹  发射子弹逻辑
            this.doSuperEffectExplode(this._aExItem, this._bExItem);
        }
        else {
            this.doCheckMoved();
        }
    };
    /*消除逻辑*/
    TG_Game.prototype.doRemove = function () {
        var isSineRect = this.DoAddMark(); //
        Log.getInstance().trace("是否已经对方块打过标签======" + isSineRect);
        var blnHasEffect = false; //是否形成特效块
        var exsitExplode = false; //是否有爆炸消除
        var isPass3Hor = false; //是否是横向4连
        var isPass3Vel = false; //是否是纵向4连
        var isBlack = false; //是否是黑洞
        var isBird = false; //是否是鸟 fish ==田字形成
        if (isSineRect) {
            //黑洞
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = this.GetItemByPos(row, col);
                    if (item.GetMarkedHor() >= 5 || item.GetMarkedVel() >= 5 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindBlack(item) || exsitExplode;
                        blnHasEffect = true;
                        isBlack = true;
                    }
                }
            }
            //炸弹
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = this.GetItemByPos(row, col);
                    if (item.GetMarkedHor() >= 3 && item.GetMarkedVel() >= 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindGold(item) || exsitExplode;
                        blnHasEffect = true;
                    }
                }
            }
            //纵向4连
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = this.GetItemByPos(row, col);
                    if (item.GetMarkedVel() > 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindVelEffect(item) || exsitExplode;
                        blnHasEffect = true;
                        isPass3Vel = true;
                    }
                }
            }
            //横向4连
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = this.GetItemByPos(row, col);
                    if (item.GetMarkedHor() > 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindHorEffect(item) || exsitExplode;
                        blnHasEffect = true;
                        isPass3Hor = true;
                    }
                }
            }
            //风车
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = this.GetItemByPos(row, col);
                    if (item.CheckMatchSpecial() && item.GetMarkedHor() >= 2 && item.GetMarkedVel() >= 2
                        && this.CheckBird(item)) {
                        exsitExplode = this.FindBirdEffect(item) || exsitExplode;
                        blnHasEffect = true;
                        isBird = true;
                    }
                }
            }
            // 纵向3连
            var edVer = [];
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    edVer = [];
                    var item = this.GetItemByPos(row, col);
                    var color = item.GetColorType();
                    var index = this.GetIndexByPos(row, col);
                    edVer.push(item);
                    if (item.GetMarkedVel() >= 3 && this.CheckAddMark(item) && item.CheckMatchSpecial()) {
                        var topIndex = this.GetTopItem(index);
                        var topTopIndex = this.GetTopItem(topIndex);
                        if (topIndex < 0 || topTopIndex < 0)
                            continue;
                        var topItem = this.GetItemByIndex(topIndex);
                        var topTopItem = this.GetItemByIndex(topTopIndex);
                        if (topItem.GetColorType() == color && this.CheckAddMark(topItem)) {
                            edVer.push(topItem);
                        }
                        if (topTopItem.GetColorType() == color && this.CheckAddMark(topTopItem)) {
                            edVer.push(topTopItem);
                        }
                        if (edVer.length < 3)
                            continue;
                        if (!isPass3Hor && !isPass3Vel && !isBlack && !isBird) {
                        }
                        exsitExplode = true;
                        for (var _i = 0, edVer_1 = edVer; _i < edVer_1.length; _i++) {
                            var temp = edVer_1[_i];
                            temp.MarkedAlready = true;
                        }
                        //传染块逻辑
                        this.CheckInfect(edVer, false, 0);
                        for (var _a = 0, edVer_2 = edVer; _a < edVer_2.length; _a++) {
                            var temp = edVer_2[_a];
                            if (!temp.GetExploding()) {
                                temp.DoExplode();
                            }
                        }
                    }
                }
            }
            //横向3连
            var edHor = [];
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    edHor = [];
                    var item = this.GetItemByPos(row, col);
                    var color = item.GetColorType();
                    var index = this.GetIndexByPos(row, col);
                    edHor.push(item);
                    if (item.GetMarkedHor() >= 3 && this.CheckAddMark(item) && item.CheckMatchSpecial()) {
                        var rightIndex = this.GetRightItem(index);
                        var rightRightIndex = this.GetRightItem(rightIndex);
                        if (rightIndex < 0 || rightRightIndex < 0)
                            continue;
                        var rightItem = this.GetItemByIndex(rightIndex);
                        var rightRightItem = this.GetItemByIndex(rightRightIndex);
                        if (rightItem.GetColorType() == color && this.CheckAddMark(rightItem)) {
                            edHor.push(rightItem);
                        }
                        if (rightRightItem.GetColorType() == color && this.CheckAddMark(rightRightItem)) {
                            edHor.push(rightRightItem);
                        }
                        if (edHor.length < 3)
                            continue;
                        if (!isPass3Hor && !isPass3Vel && !isBlack && !isBird) {
                        }
                        exsitExplode = true;
                        for (var _b = 0, edHor_1 = edHor; _b < edHor_1.length; _b++) {
                            var temp = edHor_1[_b];
                            temp.MarkedAlready = true;
                        }
                        //传染块逻辑 异步执行
                        this.CheckInfect(edHor, false, 0);
                        for (var _c = 0, edHor_2 = edHor; _c < edHor_2.length; _c++) {
                            var temp = edHor_2[_c];
                            if (!temp.GetExploding()) {
                                //执行爆炸
                                temp.DoExplode();
                            }
                        }
                    }
                }
            }
        }
        if (this.m_FisrtMarkRemove && blnHasEffect) {
            this.m_FirstLink = true;
        }
        return exsitExplode;
    };
    /*黑洞*/
    TG_Game.prototype.FindBlack = function (item) {
        Log.getInstance().trace("+++++++++++FindBlack++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        //向上找
        var nIndex = index;
        for (var i = 0; i < 4; i++) {
            nIndex = this.GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            toFindSpecial.push(item);
            nIndex = index;
            //向右找
            for (var i = 0; i < 4; i++) {
                nIndex = this.GetRightItem(nIndex);
                if (nIndex == -1)
                    break;
                var temp = this.GetItemByIndex(nIndex);
                if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                    toFindSpecial.push(temp);
                }
                else {
                    break;
                }
            }
        }
        if (toFindSpecial.length < 5) {
            toFindSpecial = [];
            Log.getInstance().trace("FindBlack toFindSpecial count error");
            return false;
        }
        for (var _i = 0, toFindSpecial_1 = toFindSpecial; _i < toFindSpecial_1.length; _i++) {
            var temp = toFindSpecial_1[_i];
            temp.MarkedAlready = true;
        }
        //默认第二个
        var spIndex = 2;
        for (var i = 0; i < toFindSpecial.length; i++) {
            var temp = toFindSpecial[i];
            if (temp.GetMoveItem()) {
                spIndex = i;
                break;
            }
        }
        var fItem = toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc = true;
        //传染块逻辑
        this.CheckInfect(toFindSpecial, false, 3);
        for (var _a = 0, toFindSpecial_2 = toFindSpecial; _a < toFindSpecial_2.length; _a++) {
            var temp = toFindSpecial_2[_a];
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateBlack);
        //生成黑洞
        var layerid = 2098;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid, fItem.SitePos.Y, fItem.SitePos.X, Msg.EffectType.ET_Black);
        toFindSpecial = [];
        return true;
    };
    /*风车*/
    TG_Game.prototype.FindBirdEffect = function (item) {
        Log.getInstance().trace("+++++++++++FindBirdEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        //右
        var nIndex = this.GetRightItem(index);
        if (nIndex != -1) {
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && this.CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上
        nIndex = this.GetTopItem(index);
        if (nIndex != -1) {
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && this.CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        nIndex = this.GetTopRightItem(index);
        if (nIndex != -1) {
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && this.CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上上
        nIndex = this.GetTopItem(this.GetTopItem(index));
        if (nIndex != -1) {
            var temp = this.GetItemByIndex(nIndex);
            if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上上右
        if (toFindSpecial.length < 5) {
            nIndex = this.GetRightItem(nIndex);
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右
        if (toFindSpecial.length < 5) {
            nIndex = this.GetRightItem(this.GetRightItem(index));
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右上
        if (toFindSpecial.length < 5) {
            nIndex = this.GetTopItem(nIndex);
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //左
        if (toFindSpecial.length < 5) {
            nIndex = this.GetLeftItem(index);
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //左上
        if (toFindSpecial.length < 5) {
            nIndex = this.GetTopItem(this.GetLeftItem(index));
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //下
        if (toFindSpecial.length < 5) {
            nIndex = this.GetBottomItem(index);
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //下右
        if (toFindSpecial.length < 5) {
            nIndex = this.GetBottomRightItem(index);
            if (nIndex != -1) {
                var temp = this.GetItemByIndex(nIndex);
                if (this.CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //找到4个字方块，再判断周边有无相连
        if (toFindSpecial.length < 4) {
            Log.getInstance().trace("FindBirdEffect toFindSpecial count error");
            return false;
        }
        for (var _i = 0, toFindSpecial_3 = toFindSpecial; _i < toFindSpecial_3.length; _i++) {
            var temp = toFindSpecial_3[_i];
            temp.MarkedAlready = true;
        }
        //默认在左下角生成鸟
        var spIndex = 0;
        for (var i = 0; i < toFindSpecial.length; i++) {
            var temp = toFindSpecial[i];
            if (temp.GetMoveItem()) {
                spIndex = i;
                break;
            }
        }
        var fItem = toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc = true;
        //传染块逻辑
        this.CheckInfect(toFindSpecial, false, 1);
        for (var _a = 0, toFindSpecial_4 = toFindSpecial; _a < toFindSpecial_4.length; _a++) {
            var temp = toFindSpecial_4[_a];
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateBird);
        //生成风车
        var layerid = 2040 + color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid, fItem.SitePos.Y, fItem.SitePos.X, Msg.EffectType.ET_Bird);
        toFindSpecial = [];
        return true;
    };
    /*炸弹*/
    TG_Game.prototype.FindGold = function (item) {
        Log.getInstance().trace("+++++++++++FindGold++++++++++++++++");
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var bombItems = [item];
        //向左找
        var nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = this.GetLeftItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        //向右找
        nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = this.GetRightItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        //向上找
        nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = this.GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        //向下找
        nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = this.GetBottomItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        if (bombItems.length < 5) {
            Log.getInstance().trace("FindGold toFindSpecial count error");
            bombItems = [];
            return false;
        }
        for (var _i = 0, bombItems_1 = bombItems; _i < bombItems_1.length; _i++) {
            var temp = bombItems_1[_i];
            temp.MarkedAlready = true;
        }
        var isSelfMove = false;
        var effectCreateIndex = 0;
        if (this._aExItem != null && this._bExItem != null) {
            for (var _a = 0, bombItems_2 = bombItems; _a < bombItems_2.length; _a++) {
                var temp = bombItems_2[_a];
                var itemIdx = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                effectCreateIndex = itemIdx;
                var _aExItemIndex = this.GetIndexByPos(this._aExItem.SitePos.Y, this._aExItem.SitePos.X);
                var _bExItemIndex = this.GetIndexByPos(this._bExItem.SitePos.Y, this._bExItem.SitePos.X);
                if (effectCreateIndex == _aExItemIndex || effectCreateIndex == _bExItemIndex) {
                    isSelfMove = true;
                    temp.MarkedForExplodingCallfunc = true;
                    break;
                }
            }
        }
        if (!isSelfMove) {
            item.MarkedForExplodingCallfunc = true;
            var itemIdx = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            effectCreateIndex = itemIdx;
        }
        //传染块逻辑
        this.CheckInfect(bombItems, false, 2);
        for (var _b = 0, bombItems_3 = bombItems; _b < bombItems_3.length; _b++) {
            var temp = bombItems_3[_b];
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateGold);
        //生成炸弹
        var layerid = 2030 + color;
        var fItem = this.GetItemByIndex(effectCreateIndex);
        GamePanel_ItemSp.getInstance().createItemEffect(layerid, fItem.SitePos.Y, fItem.SitePos.X, Msg.EffectType.ET_Gold);
        bombItems = [];
        return true;
    };
    /*寻找纵向*/
    TG_Game.prototype.FindVelEffect = function (item) {
        Log.getInstance().trace("+++++++++++FindVelEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        var nIndex = index;
        //向上找
        for (var i = 0; i < 3; i++) {
            nIndex = this.GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        //向下找
        nIndex = index;
        for (var i = 0; i < 3; i++) {
            nIndex = this.GetBottomItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            Log.getInstance().trace("FindVelEffect toFindSpecial count error");
            return false;
        }
        for (var _i = 0, toFindSpecial_5 = toFindSpecial; _i < toFindSpecial_5.length; _i++) {
            var temp = toFindSpecial_5[_i];
            temp.MarkedAlready = true;
        }
        //默认在最上面生成特效块
        var spIndex = 3;
        for (var i = 0; i < toFindSpecial.length; i++) {
            var temp = toFindSpecial[i];
            if (temp.GetMoveItem()) {
                spIndex = i;
                break;
            }
        }
        var fItem = toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc = true;
        //传染块逻辑
        this.CheckInfect(toFindSpecial, false, 0);
        for (var _a = 0, toFindSpecial_6 = toFindSpecial; _a < toFindSpecial_6.length; _a++) {
            var temp = toFindSpecial_6[_a];
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateHor);
        //生成横消块
        var layerid = 2010 + color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid, fItem.SitePos.Y, fItem.SitePos.X, Msg.EffectType.ET_Hor);
        toFindSpecial = [];
        return true;
    };
    /*寻找横向*/
    TG_Game.prototype.FindHorEffect = function (item) {
        Log.getInstance().trace("+++++++++++FindHorEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        var nIndex = index;
        //向左找
        for (var i = 0; i < 3; i++) {
            nIndex = this.GetLeftItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        //向右找
        nIndex = index;
        for (var i = 0; i < 3; i++) {
            nIndex = this.GetRightItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = this.GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && this.CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            Log.getInstance().trace("FindHorEffect toFindSpecial count error");
            return false;
        }
        for (var _i = 0, toFindSpecial_7 = toFindSpecial; _i < toFindSpecial_7.length; _i++) {
            var temp = toFindSpecial_7[_i];
            temp.MarkedAlready = true;
        }
        // 默认在最左面生成特效块
        var spIndex = 0;
        for (var i = 0; i < toFindSpecial.length; i++) {
            var temp = toFindSpecial[i];
            if (temp.GetMoveItem()) {
                spIndex = i;
                break;
            }
        }
        var fItem = toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc = true;
        //传染块逻辑
        this.CheckInfect(toFindSpecial, false, 0);
        for (var _a = 0, toFindSpecial_8 = toFindSpecial; _a < toFindSpecial_8.length; _a++) {
            var temp = toFindSpecial_8[_a];
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateVel);
        //生成纵消块
        var layerid = 2020 + color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid, fItem.SitePos.Y, fItem.SitePos.X, Msg.EffectType.ET_Vel);
        toFindSpecial = [];
        return true;
    };
    /*是否可以形成鸟/风车*/
    TG_Game.prototype.CheckBird = function (item) {
        if (!TG_Stage.CanCreateFish) {
            return false;
        }
        if (item) {
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            var color = item.GetColorType();
            if (color < 0) {
                return false;
            }
            var leftIndex = this.GetLeftItem(index);
            var topIndex = this.GetTopItem(index);
            var topLeftIndex = this.GetTopLeftItem(index);
            if (leftIndex >= 0 && topIndex >= 0 && topLeftIndex >= 0) {
                var left = this.GetItemByIndex(leftIndex);
                var top_1 = this.GetItemByIndex(topIndex);
                var topLeft = this.GetItemByIndex(topLeftIndex);
                if (this.CheckAddMark(left) && this.CheckAddMark(top_1) && this.CheckAddMark(topLeft) &&
                    left.GetColorType() == color && top_1.GetColorType() == color && topLeft.GetColorType() == color) {
                    return true;
                }
            }
            var bottomIndex = this.GetBottomItem(index);
            var bottomLeftIndex = this.GetBottomLeftItem(index);
            if (leftIndex >= 0 && bottomIndex >= 0 && bottomLeftIndex >= 0) {
                var left = this.GetItemByIndex(leftIndex);
                var bottom = this.GetItemByIndex(bottomIndex);
                var bottomLeft = this.GetItemByIndex(bottomLeftIndex);
                if (this.CheckAddMark(left) && this.CheckAddMark(bottom) && this.CheckAddMark(bottomLeft) &&
                    left.GetColorType() == color && bottom.GetColorType() == color && bottomLeft.GetColorType() == color) {
                    return true;
                }
            }
            var rightIndex = this.GetRightItem(index);
            var topRightIndex = this.GetTopRightItem(index);
            if (rightIndex >= 0 && topIndex >= 0 && topRightIndex >= 0) {
                var right = this.GetItemByIndex(rightIndex);
                var top_2 = this.GetItemByIndex(topIndex);
                var topRight = this.GetItemByIndex(topRightIndex);
                if (this.CheckAddMark(right) && this.CheckAddMark(top_2) && this.CheckAddMark(topRight) &&
                    right.GetColorType() == color && top_2.GetColorType() == color && topRight.GetColorType() == color) {
                    return true;
                }
            }
            var bottomRightIndex = this.GetBottomRightItem(index);
            if (rightIndex >= 0 && bottomIndex >= 0 && bottomRightIndex >= 0) {
                var right = this.GetItemByIndex(rightIndex);
                var bottom = this.GetItemByIndex(bottomIndex);
                var bottomRight = this.GetItemByIndex(bottomRightIndex);
                if (this.CheckAddMark(right) && this.CheckAddMark(bottom) && this.CheckAddMark(bottomRight) &&
                    right.GetColorType() == color && bottom.GetColorType() == color && bottomRight.GetColorType() == color) {
                    return true;
                }
            }
            return false;
        }
        else {
            return false;
        }
    };
    /*特效元素块的爆炸*/
    TG_Game.prototype.doSuperEffectExplode = function (aItem, bItem) {
        if (!aItem.IsItemEffect() || !bItem.IsItemEffect())
            return;
        var effItem = aItem;
        var effDest = bItem;
        effItem.SetAlreadyExplode(true);
        effDest.SetAlreadyExplode(true);
        var SuperEffectArr = [];
        SuperEffectArr.push(effItem);
        SuperEffectArr.push(effDest);
        var effItemIndex = this.GetIndexByPos(effItem.SitePos.Y, effItem.SitePos.X);
        var effDestIndex = this.GetIndexByPos(effDest.SitePos.Y, effDest.SitePos.X);
        var effItemButtons = this.GetButtonItemByIndex(effItemIndex);
        var effDestButtons = this.GetButtonItemByIndex(effDestIndex);
        var effectValue = aItem.GetEffectType() + bItem.GetEffectType();
        if (effectValue < 5) {
            //横消和竖消
            if (effItemButtons.IsFect || effDestButtons.IsFect) {
                this.SuperEffectInfect(0, SuperEffectArr);
            }
            this.AddScore(ScoreType.ST_ExplodeHV);
            this.SpecialExplodeSuperHV(effDest.GetSitPos(), effDest.GetColorType(), -1);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, this.doDrop, this);
        }
        else if (effectValue < 10) {
            //横消或竖消  与 炸弹
            if (effItemButtons.IsFect || effDestButtons.IsFect) {
                this.SuperEffectInfect(0, SuperEffectArr);
            }
            var goldItem = null;
            var detonateColor = 0;
            if (effItem.IsEffectGold()) {
                goldItem = effItem;
                detonateColor = effDest.GetColorType();
            }
            else {
                goldItem = effDest;
                detonateColor = effItem.GetColorType();
            }
            this.AddScore(ScoreType.ST_ExplodeGHV);
            this.SpecialExplodeSuperGHV(effDest.GetSitPos(), detonateColor, -1, goldItem);
        }
        else if (effectValue == 10) {
            //双炸弹 effDest代表此次移动的块
            if (effItemButtons.IsFect || effDestButtons.IsFect) {
                this.SuperEffectInfect(0, SuperEffectArr);
            }
            effDest.SetAlreadyExplode(false);
            effDest.SetSecondBoomSuper(true);
            var color = effDest.GetColorType();
            var infect = -1;
            this.DoDetonate(effItem);
            var position = [effDest.SitePos.X, effDest.SitePos.Y];
            this.doItemDetonate(position, color, infect);
            this.AddScore(ScoreType.ST_ExplodeGG);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay) * 2.5, 1, this.doDrop, this);
        }
        else if (effectValue == 11 || effectValue == 12 || effectValue == 15 || effectValue == 30) {
            // 黑洞加 条消   15//黑洞加炸弹  30//黑洞加鸟
            var type = void 0;
            var color = -1;
            var blackItem = void 0;
            var blackItemPos = {
                "x": 0,
                "y": 0
            }; //形成黑洞的位置 实际坐标
            if (effItem.IsEffectVel() || effItem.IsEffectHor() || effItem.IsEffectGold() || effItem.IsEffectBird()) {
                blackItem = effDest;
                type = effItem.GetEffectType();
                color = effItem.GetColorType();
                effItem.isEffectExchangeWithBlack = true;
            }
            else {
                blackItem = effItem;
                type = effDest.GetEffectType();
                color = effDest.GetColorType();
                effDest.isEffectExchangeWithBlack = true;
            }
            blackItem.isEffectExchangeWithBlack = true;
            //黑洞位置
            var blackVx = void 0;
            var blackVy = void 0;
            var maxNum = void 0;
            if (effDest.SitePos.X != effItem.SitePos.X) {
                //横向移动
                blackVy = effDest.getPosByRowCol(effDest.SitePos.Y, effDest.SitePos.X).y;
                maxNum = Math.max(effDest.SitePos.X, effItem.SitePos.X);
                blackVx = effDest.getPosByRowCol(effDest.SitePos.Y, maxNum).x - effDest.width / 2;
            }
            else {
                //纵向移动
                blackVx = effDest.getPosByRowCol(effDest.SitePos.Y, effDest.SitePos.X).x;
                maxNum = Math.max(effDest.SitePos.Y, effItem.SitePos.Y);
                blackVy = effDest.getPosByRowCol(maxNum, effDest.SitePos.X).y - effDest.height / 2;
            }
            blackItemPos.x = blackVx;
            blackItemPos.y = blackVy;
            if (effectValue == 30) {
                this.AddScore(ScoreType.ST_ExplodeBlackB);
            }
            else if (effectValue == 11) {
                this.AddScore(ScoreType.ST_ExplodeBlackHV);
            }
            else if (effectValue == 12) {
                this.AddScore(ScoreType.ST_ExplodeBlackG);
            }
            var itemIndex = this.GetIndexByPos(effItem.SitePos.Y, effItem.SitePos.X);
            var destIndex = this.GetIndexByPos(effDest.SitePos.Y, effDest.SitePos.X);
            var itemButton = this.GetButtonItemByIndex(itemIndex);
            var destButton = this.GetButtonItemByIndex(destIndex);
            var infectBlock = this.GetButtonBlockIdByIndex(itemIndex);
            if (itemButton.IsFect || destButton.IsFect) {
                if (infectBlock == -1) {
                    return;
                }
                var infectArr = [];
                var infectItemArr = [];
                infectItemArr.push(effItem);
                infectItemArr.push(effDest);
                this.SuperEffectInfect(2, infectItemArr, infectBlock);
                for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    if (temp.CheckMatchSpecial() && temp.GetColorType() == color && this.CheckIsBlackTarget(temp)) {
                        infectArr.push(temp);
                    }
                }
                this.SuperEffectInfect(2, infectArr, infectBlock);
            }
            this.DoDetonate(effItem);
            this.DoDetonate(effDest);
            this.SpecialExplodeSuperBHV(color, type, blackItemPos);
        }
        else if (effectValue == 20) {
            //双黑洞
            this.AddScore(ScoreType.ST_ExplodeBlackBlack);
            //传染
            var itemIndexBB = this.GetIndexByPos(effItem.SitePos.Y, effItem.SitePos.X);
            var destIndexBB = this.GetIndexByPos(effDest.SitePos.Y, effItem.SitePos.X);
            var itemButtonBB = this.GetButtonItemByIndex(itemIndexBB);
            var infectBlock = this.GetButtonBlockIdByIndex(itemIndexBB);
            var ItemsBB = TG_Game.Items;
            if (itemButtonBB.IsFect || destIndexBB.IsFect) {
                if (infectBlock == -1) {
                    return;
                }
                var infectArrBB = [];
                for (var i = 0; i < this.ColNum * this.RowNum; i++) {
                    var itemBB = ItemsBB[i];
                    itemBB.BlackHolePos = effDest.GetSitPos();
                    if (itemBB.CheckMatchSpecial()) {
                        infectArrBB.push(itemBB);
                    }
                }
                this.SuperEffectInfect(2, infectArrBB, infectBlock);
            }
            this.SpecialExplodeSuperBB(effDest.GetSitPos());
        }
        else if (effectValue == 40) {
            //双鸟
            this.AddScore(ScoreType.ST_ExplodeBB);
            this.SpecialExplodeSuperDoubleBird(effItem, effDest);
        }
        else if (effectValue > 20) {
            //鸟加其他特效
            var otherType = void 0;
            var color = -1;
            if (effItem.IsEffectBird()) {
                color = effItem.GetColorType();
                otherType = effDest.GetEffectType();
            }
            else {
                color = effDest.GetColorType();
                otherType = effItem.GetEffectType();
            }
            this.AddScore(ScoreType.ST_ExplodeHor_Bird);
            //将要生成的风车注入特效块数组
            for (var i = 0; i < TG_Stage.FishNum; i++) {
                this.asyncCreateEffectItemAndInsertList(effDest.SitePos, color, true, otherType);
            }
            this.DoDetonate(effItem);
            this.DoDetonate(effDest);
            this.doDrop();
        }
    };
    /*鸟 风车的爆炸*/
    TG_Game.prototype.SpecialExplodeBird = function (item, et) {
        if (et === void 0) { et = Msg.EffectType.ET_Bird; }
        //将要生成的风车注入特效块数组
        for (var i = 0; i < TG_Stage.FishNum; i++) {
            this.asyncCreateEffectItemAndInsertList(item.SitePos, item.GetColorType(), true, et);
        }
        //引爆当前风车
        this.DoDetonate(item);
    };
    //特效块加入数组
    TG_Game.prototype.asyncCreateEffectItemAndInsertList = function (pos, color, IsBird, et) {
        if (IsBird === void 0) { IsBird = false; }
        if (et === void 0) { et = Msg.EffectType.ET_Bird; }
        var param = {
            "SitePos": pos,
            "Color": color,
            "IsBird": IsBird,
            "Et": et
        };
        this.AsyncEffectParams.push(param);
    };
    //创建本回合的特效块
    TG_Game.prototype.asyncCreateEffectItemAndInsert = function () {
        for (var i = 0; i < this.AsyncEffectParams.length; i++) {
            var p = this.AsyncEffectParams[i];
            if (p.IsBird) {
                //鸟
                this.createBirdItem(p.SitePos, p.Color, p.Et);
            }
            else {
                //其他特效块
            }
        }
        this.AsyncEffectParams = [];
    };
    TG_Game.prototype.createBirdItem = function (startPos, color, Et) {
        var layerid = 2040 + color;
        var StartIndex = this.GetIndexByPos(startPos.Y, startPos.X);
        GamePanel_ItemSp.getInstance().OnBirdCreate(layerid, startPos, StartIndex, this.birds, Et);
        this.birdIndex++;
    };
    /*检测鸟逻辑*/
    TG_Game.prototype.doCheckBirds = function () {
        for (var i = 0; i < this.birds.length; i++) {
            var bird = this.birds[i];
            if (bird == null)
                continue;
            if (bird.IsFlying)
                continue;
            var item = this.getBirdExplodeTarget(bird.GetStartIndex());
            if (item != null) {
                bird.SetTargetPos(item.SitePos);
                bird.SetTargetIndex(this.GetIndexByPos(item.SitePos.Y, item.SitePos.X));
                item.SetIsBirdTarget(true);
            }
            else {
                bird.SetTargetPos(bird.StartPos);
                bird.SetTargetIndex(this.GetIndexByPos(bird.StartPos.Y, bird.StartPos.X));
            }
        }
        /*--------------传染----------------*/
        var infectArr = [];
        var infectBool = false;
        for (var i = 0; i < this.birds.length; i++) {
            var bird = this.birds[i];
            var index = bird.GetTargetIndex(); //获取鸟飞向的目标index
            var item = this.GetItemByIndex(index);
            infectArr.push(item);
        }
        this.CheckInfect(infectArr, true, 2);
        /*--------------------------------*/
        for (var i = 0; i < this.birds.length; i++) {
            var bird = this.birds[i];
            if (bird == null)
                continue;
            if (bird.IsFlying)
                continue;
            bird.StartFly();
            this.OnBirdFly(bird.GetTargetIndex(), i);
        }
    };
    /*播放鸟飞的效果*/
    TG_Game.prototype.OnBirdFly = function (targetIndex, birdIndex) {
        //哪个飞鸟飞行
        var bird = this.birds[birdIndex];
        //目标点
        var endItem = this.GetItemByIndex(targetIndex);
        var endPos = endItem.getPosByRowCol(endItem.SitePos.Y, endItem.SitePos.X);
        egret.Tween.get(bird).to({ x: endPos.x, y: endPos.y, rotation: 360 }, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BirdFlyTime)).call(function () {
            egret.Tween.removeTweens(bird);
            this.BirdMoveOverCallback(bird);
        }.bind(this), this);
    };
    /*鸟的飞行结束*/
    TG_Game.prototype.BirdMoveOverCallback = function (bird) {
        var index = bird.GetTargetIndex();
        GamePanel_ItemSp.getInstance().OnBirdRemove(bird, this.birds);
        if (index < 0)
            return;
        if (this.CheckHasHighItems(index)) {
            //如果有高层块
            var highItem = this.GetHighItems(index);
            if (highItem != null) {
                if (!highItem.GetExploding()) {
                    highItem.DoExplode();
                }
                return;
            }
        }
        if (bird.GetEffectType() == Msg.EffectType.ET_Bird) {
            var temp = this.GetItemByIndex(index);
            if (temp != null)
                temp.SetIsBirdTarget(false);
            //普通鸟直接消除
            temp.DoExplode(true);
        }
        else if (bird.GetEffectType() == Msg.EffectType.ET_Hor) {
            //是横消鸟
            this.SpecialExplodeHorizonal(bird.GetTargetPos(), bird.GetColorType(), -1);
        }
        else if (bird.GetEffectType() == Msg.EffectType.ET_Vel) {
            //是纵消鸟
            this.SpecialExplodeVertical(bird.GetTargetPos(), bird.GetColorType(), -1);
        }
        else if (bird.GetEffectType() == Msg.EffectType.ET_Gold) {
            //是炸弹鸟
            this.SpecialExplodeCross(bird.GetTargetPos(), -1, true, false);
        }
    };
    /*寻找飞鸟的目标点*/
    TG_Game.prototype.getBirdExplodeTarget = function (startIndex, infect) {
        if (infect === void 0) { infect = -1; }
        var tempList = [];
        var items = TG_Game.Items;
        // 没有被传染的  特殊块
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            //铁丝网
            // let mesh=this.GetMeshItemByIndex(index);
            // if (mesh.IsItemMesh()&&!mesh.getItemNone()&&!mesh.GetIsBirdTarget()&&index!=startIndex&&this.CheckIsBlackTarget(mesh,false)) {
            //     tempList.push(mesh);
            // }
            if (!item.IsBirdPriorityTarget)
                continue;
            if (!item.getItemNone() && item.CheckMatchSpecial() && !item.GetIsBirdTarget() && index != startIndex && this.CheckIsBlackTarget(item, false)) {
                tempList.push(item);
            }
        }
        // 没有被传染的 普通块
        if (tempList.length <= 0) {
            for (var _a = 0, items_2 = items; _a < items_2.length; _a++) {
                var item = items_2[_a];
                var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                if (item.CheckMatchSpecial() && !item.GetIsBirdTarget() && index != startIndex && this.CheckIsBlackTarget(item, false)) {
                    tempList.push(item);
                }
            }
        }
        if (tempList.length < 0) {
            return null;
        }
        var random = Math.floor(Math.random() * tempList.length);
        var targetItem = tempList[random];
        return targetItem;
    };
    /// <summary>
    /// 流冰逻辑
    /// </summary>
    TG_Game.prototype.doFlowIceLogic = function () {
        // 回合前的等待时间
        var waitTime = 0;
        // 流冰逻辑
        for (var i_1 = 0; i_1 < TG_Game.Ices.length; i_1++) {
            var temp = TG_Game.Ices[i_1];
            if (temp.getItemNone())
                continue;
            if (temp.isFlowIces && !(temp.isFlow)) {
                temp.DoFlow();
                waitTime = TG_TimeDefine.FlowIceMoveTime;
            }
        }
        for (var i = 0; i < TG_Game.Ices.length; i++) {
            var temp = TG_Game.Ices[i];
            if (temp.getItemNone())
                continue;
            if (temp.isFlowIces && temp.isFlow) {
                temp.DoFlowEnd();
            }
        }
        return waitTime;
    };
    /** 流沙
     * */
    TG_Game.prototype.DoIceFlow = function (item) {
        var index = item.GetItemIndex(this.ColNum);
        if (index < 0)
            return;
        var list = [];
        var leftItemIndex = this.GetLeftItem(index);
        var rightItemIndex = this.GetRightItem(index);
        var topItemIndex = this.GetTopItem(index);
        var bottomIndex = this.GetBottomItem(index);
        if (leftItemIndex != -1) {
            var left = TG_Game.Ices[leftItemIndex];
            if (this.CheckFlowIce(left)) {
                list.push(left);
            }
        }
        if (rightItemIndex != -1) {
            var right = TG_Game.Ices[rightItemIndex];
            if (this.CheckFlowIce(right)) {
                list.push(right);
            }
        }
        if (topItemIndex != -1) {
            var top = TG_Game.Ices[topItemIndex];
            if (this.CheckFlowIce(top)) {
                list.push(top);
            }
        }
        if (bottomIndex != -1) {
            var bottom = TG_Game.Ices[bottomIndex];
            if (this.CheckFlowIce(bottom)) {
                list.push(bottom);
            }
        }
        if (list.length > 0) {
            var random = Math.floor(Math.random() * list.length);
            var target = list[random];
            var targetIndex = target.GetItemIndex(this.ColNum);
            GamePanel_ItemSp.getInstance().systemExchange(index, targetIndex);
        }
    };
    //是否是流沙
    TG_Game.prototype.CheckFlowIce = function (item) {
        var index = item.Index;
        if (index != undefined) {
            if (index < 0 || index > this.MaxIndex) {
                return false;
            }
        }
        var temp = this.GetItemByIndex(index);
        if (temp.getItemNone()) {
            return false;
        }
        var ice = TG_Game.Ices[index];
        if (ice.isFlowIces || ice.isIces)
            return false;
        var button = this.GetButtonItemByIndex(index);
        if (!button.IsCanEnterButton()) {
            return false;
        }
        return true;
    };
    /*垂直炸一竖排*/
    TG_Game.prototype.SpecialExplodeVertical = function (pos, detonateColor, detonateInfect) {
        if (detonateInfect === void 0) { detonateInfect = -1; }
        console.info("竖消开始...");
        if (pos.X < 0 || pos.X >= this.ColNum || pos.Y < 0 || pos.Y >= this.RowNum)
            return;
        var effectItems = [];
        var currentEffectItems = [];
        var index = this.GetIndexByPos(pos.Y, pos.X);
        var infect = detonateInfect;
        //原点
        var item = this.GetItemByIndex(index);
        if (item.IsItemEffect()) {
            currentEffectItems.push(index, infect);
            effectItems.push(currentEffectItems);
        }
        else {
            var position = [pos.X, pos.Y];
            this.doItemDetonate(position, detonateColor, infect);
        }
        //上面
        var oriPoint = pos.Y - 1;
        /*-----------传染-------------*/
        var InfectArr = [];
        //上面
        var oriPointUpper = pos.Y - 1;
        var oriPointLower = pos.Y + 1;
        for (var i = oriPointUpper; i >= 0; i--) {
            var tempIndex = i * this.ColNum + pos.X;
            var temp = this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        //下面
        for (var i = oriPointLower; i < this.RowNum; i++) {
            var tempIndex = i * this.ColNum + pos.X;
            var temp = this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        InfectArr.push(item);
        //传染块逻辑
        var selfIndex = this.GetIndexByPos(pos.Y, pos.X);
        this.CheckInfect(InfectArr, true, 1, selfIndex);
        /*------------------------*/
        for (var i = oriPoint; i >= 0; i--) {
            var tempIndex = i * this.ColNum + pos.X;
            var temp = this.GetItemByIndex(tempIndex);
            if (temp.IsItemEffect()) {
                currentEffectItems = [];
                currentEffectItems.push(tempIndex, infect);
                effectItems.push(currentEffectItems);
            }
            else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            }
            else {
                var position = [temp.SitePos.X, temp.SitePos.Y];
                this.doItemDetonate(position, detonateColor, infect);
            }
            if (!temp.canThrough)
                break;
        }
        //下面
        oriPoint = pos.Y + 1;
        for (var i = oriPoint; i < this.RowNum; i++) {
            var tempIndex = i * this.ColNum + pos.X;
            var temp = this.GetItemByIndex(tempIndex);
            if (temp.IsItemEffect()) {
                currentEffectItems = [];
                currentEffectItems.push(tempIndex, infect);
                effectItems.push(currentEffectItems);
            }
            else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            }
            else {
                var position = [temp.SitePos.X, temp.SitePos.Y];
                this.doItemDetonate(position, detonateColor, infect);
            }
            if (!temp.canThrough)
                break;
        }
        this.SetDropDelay(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay));
        for (var _i = 0, effectItems_1 = effectItems; _i < effectItems_1.length; _i++) {
            var effectPair = effectItems_1[_i];
            var tempIndex = effectPair[0];
            var temp = this.GetItemByIndex(tempIndex);
            var position = [temp.SitePos.X, temp.SitePos.Y];
            this.doItemDetonate(position, detonateColor, infect);
        }
    };
    /*水平炸一排*/
    TG_Game.prototype.SpecialExplodeHorizonal = function (pos, detonateColor, detonateInfect) {
        if (detonateInfect === void 0) { detonateInfect = -1; }
        // console.info("横消开始...");
        if (pos.X < 0 || pos.X >= this.ColNum || pos.Y < 0 || pos.Y >= this.RowNum)
            return;
        var effectItems = [];
        var currentEffectItems = [];
        var index = this.GetIndexByPos(pos.Y, pos.X);
        var infect = detonateInfect;
        //原点
        var item = this.GetItemByIndex(index);
        if (item.IsItemEffect()) {
            currentEffectItems.push(index, infect);
            effectItems.push(currentEffectItems);
        }
        else {
            var position = [pos.X, pos.Y];
            this.doItemDetonate(position, detonateColor, infect);
        }
        /*-----------传染-------------*/
        var InfectArr = [];
        //左边
        var oriPointUpper = pos.X - 1;
        var oriPointLower = pos.X + 1;
        for (var i = oriPointUpper; i >= 0; i--) {
            var tempIndex = pos.Y * this.ColNum + i;
            var temp = this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        //右边
        for (var i = oriPointLower; i < this.ColNum; i++) {
            var tempIndex = pos.Y * this.ColNum + i;
            var temp = this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        InfectArr.push(item);
        //传染块逻辑
        var selfIndex = this.GetIndexByPos(pos.Y, pos.X);
        var selfButton = this.GetButtonItemByIndex(selfIndex);
        this.CheckInfect(InfectArr, true, 0, selfIndex);
        /*------------------------*/
        //左侧
        var oriPoint = pos.X - 1;
        for (var i = oriPoint; i >= 0; i--) {
            var tempIndex = pos.Y * this.ColNum + i;
            var temp = this.GetItemByIndex(tempIndex);
            if (temp.IsItemEffect()) {
                currentEffectItems = [];
                currentEffectItems.push(tempIndex, infect);
                effectItems.push(currentEffectItems);
            }
            else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                // console.info(123456)
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            }
            else {
                var position = [temp.SitePos.X, temp.SitePos.Y];
                this.doItemDetonate(position, detonateColor, infect);
            }
            if (!temp.canThrough)
                break;
        }
        //右侧
        oriPoint = pos.X + 1;
        for (var i = oriPoint; i < this.ColNum; i++) {
            var tempIndex = pos.Y * this.ColNum + i;
            var temp = this.GetItemByIndex(tempIndex);
            if (temp.IsItemEffect()) {
                currentEffectItems = [];
                currentEffectItems.push(tempIndex, infect);
                effectItems.push(currentEffectItems);
            }
            else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                // console.info(789456);
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            }
            else {
                var position = [temp.SitePos.X, temp.SitePos.Y];
                this.doItemDetonate(position, detonateColor, infect);
            }
            if (!temp.canThrough)
                break;
        }
        this.SetDropDelay(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay));
        for (var _i = 0, effectItems_2 = effectItems; _i < effectItems_2.length; _i++) {
            var effectPair = effectItems_2[_i];
            var tempIndex = effectPair[0];
            var temp = this.GetItemByIndex(tempIndex);
            var position = [temp.SitePos.X, temp.SitePos.Y];
            this.doItemDetonate(position, detonateColor, infect);
        }
    };
    TG_Game.prototype.SpecialExplodeBlack = function (pos, detonateColor) {
        //pos 黑洞块的位置 detonateColor 被黑洞吸掉的元素块颜色值
        var toFindSpecial = [];
        var Items = TG_Game.Items;
        for (var _i = 0, Items_1 = Items; _i < Items_1.length; _i++) {
            var temp = Items_1[_i];
            if (temp.CheckMatchSpecial() && temp.GetColorType() == detonateColor && this.CheckIsBlackTarget(temp)) {
                toFindSpecial.push(temp);
            }
        }
        for (var _a = 0, Items_2 = Items; _a < Items_2.length; _a++) {
            var temp = Items_2[_a];
            if (temp.SitePos.X == pos.X && temp.SitePos.Y == pos.Y) {
                toFindSpecial.push(temp);
            }
        }
        //传染块
        var infectArr = [];
        for (var _b = 0, toFindSpecial_9 = toFindSpecial; _b < toFindSpecial_9.length; _b++) {
            var temp = toFindSpecial_9[_b];
            infectArr.push(temp);
        }
        var itemIndex = this.GetIndexByPos(pos.Y, pos.X);
        this.CheckInfect(infectArr, true, 4, itemIndex);
        for (var _c = 0, toFindSpecial_10 = toFindSpecial; _c < toFindSpecial_10.length; _c++) {
            var temp = toFindSpecial_10[_c];
            GamePanel_ItemSp.getInstance().ItemWaggleMove(temp, pos);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BeDisoriganziedTime), 1, this.SpecialExplodeBlackWaggleBack.bind(this, toFindSpecial), this);
    };
    /*黑洞效果下的晃动完毕*/
    TG_Game.prototype.SpecialExplodeBlackWaggleBack = function (list) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var temp = list_1[_i];
            temp.DoExplode(true);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, this.doDrop, this);
    };
    /*炸弹爆炸*/
    TG_Game.prototype.SpecialExplodeCross = function (pos, infect, createSecond, isSuper) {
        if (isSuper === void 0) { isSuper = false; }
        //infect 是否感染
        var index = this.GetIndexByPos(pos.Y, pos.X);
        var item = this.GetItemByIndex(index);
        var detonateColor = item.GetColorType();
        //传染
        var infectArr = [];
        if (isSuper) {
            var PosA = [-2, -1, 0, 1, 2];
            var PosB = [-2, -1, 0, 1, 2];
            for (var i = 0; i < PosA.length; i++) {
                for (var k = 0; k < PosB.length; k++) {
                    var m_PosX = (PosA[i] + pos.X);
                    var m_PosY = (PosB[k] + pos.Y);
                    var m_Pos = [m_PosX, m_PosY];
                    // console.log("pos==============>"+pos);
                    //传染
                    if (m_PosX < 0 || m_PosX >= this.ColNum || m_PosY < 0 || m_PosY >= this.RowNum) {
                        continue;
                    }
                    var infectIndex = this.GetIndexByPos(m_PosY, m_PosX);
                    var infectItem = this.GetItemByIndex(infectIndex);
                    infectArr.push(infectItem);
                }
            }
        }
        else {
            //普通 炸弹爆炸
            var PosA = [-1, 0, 1];
            var PosB = [-1, 0, 1];
            for (var i = 0; i < PosA.length; i++) {
                for (var k = 0; k < PosB.length; k++) {
                    var m_PosX = (PosA[i] + pos.X);
                    var m_PosY = (PosB[k] + pos.Y);
                    var m_Pos = [m_PosX, m_PosY];
                    // console.log("pos==============>"+pos);
                    //传染
                    var infectIndex = this.GetIndexByPos(m_PosY, m_PosX);
                    var infectItem = this.GetItemByIndex(infectIndex);
                    infectArr.push(infectItem);
                }
            }
        }
        var selfIndex = this.GetIndexByPos(pos.Y, pos.X);
        this.CheckInfect(infectArr, true, 3, selfIndex);
        //普通爆炸
        var self = [pos.X, pos.Y];
        var top = [0 + pos.X, -1 + pos.Y];
        var bottom = [0 + pos.X, 1 + pos.Y];
        var left = [-1 + pos.X, 0 + pos.Y];
        var right = [1 + pos.X, 0 + pos.Y];
        var leftTop = [-1 + pos.X, -1 + pos.Y];
        var rightTop = [1 + pos.X, -1 + pos.Y];
        var leftBottom = [-1 + pos.X, 1 + pos.Y];
        var rightBottom = [1 + pos.X, 1 + pos.Y];
        this.doItemDetonate(self, detonateColor, infect);
        this.doItemDetonate(top, detonateColor, infect);
        this.doItemDetonate(bottom, detonateColor, infect);
        this.doItemDetonate(left, detonateColor, infect);
        this.doItemDetonate(right, detonateColor, infect);
        this.doItemDetonate(leftTop, detonateColor, infect);
        this.doItemDetonate(rightTop, detonateColor, infect);
        this.doItemDetonate(leftBottom, detonateColor, infect);
        this.doItemDetonate(rightBottom, detonateColor, infect);
        if (isSuper) {
            var line1A = [-2 + pos.X, -2 + pos.Y];
            var line1B = [-1 + pos.X, -2 + pos.Y];
            var line1C = [0 + pos.X, -2 + pos.Y];
            var line1D = [1 + pos.X, -2 + pos.Y];
            var line1E = [2 + pos.X, -2 + pos.Y];
            var line2A = [-2 + pos.X, -1 + pos.Y];
            var line2E = [2 + pos.X, -1 + pos.Y];
            var line3A = [-2 + pos.X, 0 + pos.Y];
            var line3E = [2 + pos.X, 0 + pos.Y];
            var line4A = [-2 + pos.X, 1 + pos.Y];
            var line4E = [2 + pos.X, 1 + pos.Y];
            var line5A = [-2 + pos.X, 2 + pos.Y];
            var line5B = [-1 + pos.X, 2 + pos.Y];
            var line5C = [0 + pos.X, 2 + pos.Y];
            var line5D = [1 + pos.X, 2 + pos.Y];
            var line5E = [2 + pos.X, 2 + pos.Y];
            this.doItemDetonate(line1A, detonateColor, infect);
            this.doItemDetonate(line1B, detonateColor, infect);
            this.doItemDetonate(line1C, detonateColor, infect);
            this.doItemDetonate(line1D, detonateColor, infect);
            this.doItemDetonate(line1E, detonateColor, infect);
            this.doItemDetonate(line5A, detonateColor, infect);
            this.doItemDetonate(line5B, detonateColor, infect);
            this.doItemDetonate(line5C, detonateColor, infect);
            this.doItemDetonate(line5D, detonateColor, infect);
            this.doItemDetonate(line5E, detonateColor, infect);
            this.doItemDetonate(line2A, detonateColor, infect);
            this.doItemDetonate(line2E, detonateColor, infect);
            this.doItemDetonate(line3A, detonateColor, infect);
            this.doItemDetonate(line3E, detonateColor, infect);
            this.doItemDetonate(line4A, detonateColor, infect);
            this.doItemDetonate(line4E, detonateColor, infect);
        }
    };
    /*黑洞+黑洞*/
    TG_Game.prototype.SpecialExplodeSuperBB = function (pos) {
        var infect = -1;
        var Items = TG_Game.Items;
        var toFindSpecial = [];
        for (var i = 0; i < this.ColNum * this.RowNum; i++) {
            var item = Items[i];
            item.BlackHolePos = pos;
            if (item.CheckMatchSpecial()) {
                toFindSpecial.push(item);
            }
        }
        for (var _i = 0, toFindSpecial_11 = toFindSpecial; _i < toFindSpecial_11.length; _i++) {
            var temp = toFindSpecial_11[_i];
            GamePanel_ItemSp.getInstance().ItemWaggleMove(temp, pos);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BeDisoriganziedTime), 1, this.SpecialExplodeBlackWaggleBack.bind(this, toFindSpecial), this);
    };
    /*风车+风车*/
    TG_Game.prototype.SpecialExplodeSuperDoubleBird = function (aItem, bItem) {
        var createTotalFishNum = 3 * TG_Stage.FishNum;
        //主动移动鸟 生成飞鸟数量
        var aItemFishNum = 0;
        //被动移动鸟 生成飞鸟数量
        var bItemFishNum = 0;
        if (createTotalFishNum % 2 == 0) {
            //能够平分
            aItemFishNum = createTotalFishNum / 2;
            bItemFishNum = createTotalFishNum / 2;
        }
        else {
            aItemFishNum = (createTotalFishNum - 1) / 2 + 1;
            bItemFishNum = (createTotalFishNum - 1) / 2;
        }
        //将要生成的风车注入特效块数组
        for (var i = 0; i < bItemFishNum; i++) {
            this.asyncCreateEffectItemAndInsertList(aItem.SitePos, aItem.GetColorType(), true);
        }
        //将要生成的风车注入特效块数组
        for (var i = 0; i < aItemFishNum; i++) {
            this.asyncCreateEffectItemAndInsertList(bItem.SitePos, bItem.GetColorType(), true);
        }
        //引爆当前风车
        this.DoDetonate(aItem);
        this.DoDetonate(bItem);
        this.doDrop();
    };
    /*条形和条形*/
    TG_Game.prototype.SpecialExplodeSuperHV = function (pos, detonateColor, infect) {
        this.SpecialExplodeHorizonal(pos, detonateColor, infect);
        this.SpecialExplodeVertical(pos, detonateColor, infect);
    };
    /*炸弹+条形*/
    TG_Game.prototype.SpecialExplodeSuperGHV = function (pos, detonateColor, infect, goldItem) {
        if (goldItem === void 0) { goldItem = null; }
        var topPos = {
            "X": 0 + pos.X,
            "Y": -1 + pos.Y
        };
        var bellowPos = {
            "X": 0 + pos.X,
            "Y": 1 + pos.Y
        };
        var leftPos = {
            "X": -1 + pos.X,
            "Y": 0 + pos.Y
        };
        var rightPos = {
            "X": 1 + pos.X,
            "Y": 0 + pos.Y
        };
        //一次放大完毕
        var obj = { "type": 0, "pos": { "X": 0, "Y": 0 }, "topPos": { "X": 0, "Y": 0 }, "bellowPos": { "X": 0, "Y": 0 }, "leftPos": { "X": 0, "Y": 0 }, "rightPos": { "X": 0, "Y": 0 }, "goldItem": null, "detonateColor": detonateColor, "infect": infect };
        //生成放大的方块 横消
        obj.type = 0;
        obj.pos = pos;
        obj.topPos = topPos;
        obj.bellowPos = bellowPos;
        obj.leftPos = leftPos;
        obj.rightPos = rightPos;
        obj.goldItem = goldItem;
        this.SpecialExplodeSuperGHVScale(obj);
    };
    //炸弹和条形的放大效果
    TG_Game.prototype.SpecialExplodeSuperGHVScale = function (data) {
        if (data.type == 0) {
            //横消
            var layerid = 2010 + data.detonateColor;
            GamePanel_ItemSp.getInstance().createSuperGHV(layerid, data.pos.Y, data.pos.X, Msg.EffectType.ET_Hor, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime));
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime), 1, this.SpecialExplodeSuperGHVBack.bind(this, data), this);
        }
        else {
            var layerid = 2020 + data.detonateColor;
            GamePanel_ItemSp.getInstance().createSuperGHV(layerid, data.pos.Y, data.pos.X, Msg.EffectType.ET_Vel, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime));
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime), 1, this.SpecialExplodeSuperGHVBack.bind(this, data), this);
        }
    };
    //炸弹和条形的放大完毕
    TG_Game.prototype.SpecialExplodeSuperGHVBack = function (data) {
        if (data.type == 0) {
            //横消
            this.SpecialExplodeHorizonal(data.pos, data.detonateColor, data.infect);
            this.SpecialExplodeHorizonal(data.topPos, data.detonateColor, data.infect);
            this.SpecialExplodeHorizonal(data.bellowPos, data.detonateColor, data.infect);
            if (data.goldItem != null) {
                this.DoDetonate(data.goldItem, false);
            }
            data.type = 1;
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime), 1, this.SpecialExplodeSuperGHVScale.bind(this, data), this);
        }
        else {
            this.SpecialExplodeVertical(data.pos, data.detonateColor, data.infect);
            this.SpecialExplodeVertical(data.leftPos, data.detonateColor, data.infect);
            this.SpecialExplodeVertical(data.rightPos, data.detonateColor, data.infect);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVIntervalTime), 1, this.doDrop, this);
        }
    };
    TG_Game.prototype.SpecialExplodeSuperBHV = function (color, type, pos) {
        var tempList = [];
        var Items = TG_Game.Items;
        for (var _i = 0, Items_3 = Items; _i < Items_3.length; _i++) {
            var temp = Items_3[_i];
            if (temp.CheckMatchSpecial() && temp.GetColorType() == color && this.CheckIsBlackTarget(temp)) {
                tempList.push(temp);
            }
        }
        this.BlackHoles = [];
        this.BulletExplodeTime = 0;
        this.isBulletExplode = true;
        this.BulletExplodeIndex = -1;
        var obj = {
            "color": color,
            "type": type,
            "tempList": tempList,
            "pos": pos
        };
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BlockHoleExchangeEffectTime), 1, this.CreateSuperBlackHole.bind(this, obj), this);
    };
    /*创建黑射线*/
    TG_Game.prototype.CreateSuperBlackHole = function (data) {
        //创建黑射线
        GamePanel_ItemSp.getInstance().CreateSuperBlackHole(data.color, data.type, data.tempList, data.pos, -1, this.BlackHoles, function () {
            this.BulletMoveCallbackExplode();
        }.bind(this));
    };
    TG_Game.prototype.BulletMoveCallbackExplode = function () {
        if (this.BlackHoles[0].GetEffectType() != Msg.EffectType.ET_Bird) {
            this.BulletExplodeIndex += 1;
            if (this.BulletExplodeIndex < this.BlackHoles.length) {
                if (this.BlackHoles[this.BulletExplodeIndex] && !this.BlackHoles[this.BulletExplodeIndex].GetAlreadyExplode()) {
                    //之前没有被引爆
                    this.OnBulletExplode(this.BlackHoles[this.BulletExplodeIndex]);
                    App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, this.doDrop, this);
                }
                else {
                    this.BulletMoveCallbackExplode();
                }
            }
            else {
                this.isBulletExplode = false;
                this.doDrop();
            }
        }
        else {
            //鸟和黑洞 不需要逐步消除
            this.isBulletExplode = false;
            for (var _i = 0, _a = this.BlackHoles; _i < _a.length; _i++) {
                var temp = _a[_i];
                this.OnBulletExplode(temp);
            }
            this.doDrop();
        }
    };
    /*射线开始爆炸*/
    TG_Game.prototype.OnBulletExplode = function (bullet) {
        //哪个黑洞特效块炸
        var blackHole = bullet;
        //目标点
        var pos = blackHole.GetStartBlockHolePos();
        if (blackHole.GetEffectType() == Msg.EffectType.ET_Hor) {
            //横消
            this.SpecialExplodeHorizonal(pos, blackHole.GetColorType(), -1);
        }
        else if (blackHole.GetEffectType() == Msg.EffectType.ET_Vel) {
            //纵消
            this.SpecialExplodeVertical(pos, blackHole.GetColorType(), -1);
        }
        else if (blackHole.GetEffectType() == Msg.EffectType.ET_Gold) {
            //炸弹
            this.SpecialExplodeCross(pos, -1, true, false);
        }
        else if (blackHole.GetEffectType() == Msg.EffectType.ET_Bird) {
            //风车
            this.SpecialExplodeBird(blackHole);
        }
        if (blackHole.GetEffectType() != Msg.EffectType.ET_Gold) {
            this.RemoveBullet(blackHole.StartBlockHolePos);
        }
    };
    /*移除射线*/
    TG_Game.prototype.RemoveBullet = function (pos) {
        //移除
        GamePanel_ItemSp.getInstance().RemoveSuperBlackHole(pos, this.BlackHoles);
    };
    TG_Game.prototype.CheckIsBlackTarget = function (item, isNeedBlackTarget) {
        if (isNeedBlackTarget === void 0) { isNeedBlackTarget = true; }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        if (item.MarkedAlready) {
            return false;
        }
        if (item.getItemNone()) {
            return false;
        }
        if (isNeedBlackTarget && !item.IsBlackTarget) {
            return false;
        }
        if (isNeedBlackTarget) {
            var cloud = this.GetCloudItemByIndex(index);
            if (!cloud.getItemNone() && cloud.IsCloud()) {
                return false;
            }
        }
        return true;
    };
    /**
     *
     * 根据是否可感染查询出一个 随机的毒液
     *
     */
    TG_Game.prototype.geneOneTgItemVenom = function (isCanInfectBlock) {
        if (isCanInfectBlock === void 0) { isCanInfectBlock = true; }
        var canInfectVenomLst = [];
        var noCanInfectVenomLst = [];
        // 取出所有的块
        var items = TG_Game.Items;
        for (var i in items) {
            if (Number(i) < 0 || Number(i) > this.ColNum * this.RowNum - 1) {
                break;
            }
            var oneItem = items[i];
            if (oneItem.itemType == ItemType.TG_ITEM_TYPE_VENOM) {
                var topItemIndex = this.GetTopItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
                var letItemIndex = this.GetLeftItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
                var rightItemIndex = this.GetRightItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
                var bottomItemIndex = this.GetBottomItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
                var topItem = this.GetItemByIndex(topItemIndex);
                var letItem = this.GetItemByIndex(letItemIndex);
                var rightItem = this.GetItemByIndex(rightItemIndex);
                var bottomItem = this.GetItemByIndex(bottomItemIndex);
                if ((topItem && !topItem.getItemNone() && !topItem.IsItemNull() && topItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && topItem.canFallDown && !this.CheckHasHighItems(topItemIndex))
                    || (letItem && !letItem.getItemNone() && !letItem.IsItemNull() && letItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && letItem.canFallDown && !this.CheckHasHighItems(letItemIndex))
                    || (rightItem && !rightItem.getItemNone() && !rightItem.IsItemNull() && rightItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && rightItem.canFallDown && !this.CheckHasHighItems(rightItemIndex))
                    || (bottomItem && !bottomItem.getItemNone() && !bottomItem.IsItemNull() && bottomItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && bottomItem.canFallDown && !this.CheckHasHighItems(bottomItemIndex))) {
                    canInfectVenomLst.push(oneItem);
                }
                else {
                    noCanInfectVenomLst.push(oneItem);
                }
            }
        }
        if (canInfectVenomLst && canInfectVenomLst.length > 0 && isCanInfectBlock) {
            return canInfectVenomLst[Math.floor(Math.random() * canInfectVenomLst.length)];
        }
        if (noCanInfectVenomLst && noCanInfectVenomLst.length > 0 && !isCanInfectBlock) {
            return noCanInfectVenomLst[Math.floor(Math.random() * noCanInfectVenomLst.length)];
        }
        return null;
    };
    TG_Game.prototype.GetCanVenomInfect = function (venom) {
        var venomNeighborLst = [];
        if (venom) {
            var topItemIndex = this.GetTopItem(this.GetIndexByPos(venom.SitePos.Y, venom.SitePos.X));
            var leftItemIndex = this.GetLeftItem(this.GetIndexByPos(venom.SitePos.Y, venom.SitePos.X));
            var rightItemIndex = this.GetRightItem(this.GetIndexByPos(venom.SitePos.Y, venom.SitePos.X));
            var bottomItemIndex = this.GetBottomItem(this.GetIndexByPos(venom.SitePos.Y, venom.SitePos.X));
            var topItem = this.GetItemByIndex(topItemIndex);
            var leftItem = this.GetItemByIndex(leftItemIndex);
            var rightItem = this.GetItemByIndex(rightItemIndex);
            var bottomItem = this.GetItemByIndex(bottomItemIndex);
            if ((topItem && !topItem.getItemNone() && !topItem.IsItemNull() && topItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && topItem.canFallDown && !this.CheckHasHighItems(topItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(topItemIndex));
            }
            if ((leftItem && !leftItem.getItemNone() && !leftItem.IsItemNull() && leftItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && leftItem.canFallDown && !this.CheckHasHighItems(leftItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(leftItemIndex));
            }
            if ((rightItem && !rightItem.getItemNone() && !rightItem.IsItemNull() && rightItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && rightItem.canFallDown && !this.CheckHasHighItems(rightItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(rightItemIndex));
            }
            if ((bottomItem && !bottomItem.getItemNone() && !bottomItem.IsItemNull() && bottomItem.itemType != ItemType.TG_ITEM_TYPE_VENOM && bottomItem.canFallDown && !this.CheckHasHighItems(bottomItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(bottomItemIndex));
            }
            // 随机一个传染块的邻居
            Log.getInstance().trace(venomNeighborLst, 0);
            if (venomNeighborLst && venomNeighborLst.length > 0) {
                return venomNeighborLst[Math.floor(Math.random() * venomNeighborLst.length)];
            }
            return null;
        }
        return null;
    };
    /**
     * 每回合中变色块逻辑
     */
    TG_Game.prototype.changeColorBlock = function () {
        var changeColorBlock = false;
        // Log.getInstance().trace("==================变色块执行逻辑开始=====================",0);
        // 获取变色块列表
        var changeColorLst = this.GetChangeColorLst();
        // Log.getInstance().trace(changeColorLst, 0);
        // 将所有变色块改变颜色生成新的变色块
        var newChangeColorLst = this.GetNewChangeColorLst(changeColorLst);
        // Log.getInstance().trace("1234567890", 0);
        // Log.getInstance().trace(changeColorLst, 0);
        // Log.getInstance().trace(newChangeColorLst, 0);
        // 生成新的变色块
        var isSuccess = this.generateNewChangeColorLst(newChangeColorLst);
        // Log.getInstance().trace(isSuccess, 0);
        if (isSuccess) {
            changeColorBlock = true;
        }
        return changeColorBlock;
    };
    /**
     * 生成新的变色块
     * @param newChangeColorLst
     */
    TG_Game.prototype.generateNewChangeColorLst = function (newChangeColorLst) {
        Log.getInstance().trace(newChangeColorLst, 0);
        for (var i = 0; i < newChangeColorLst.length; i++) {
            var oneNewItem = newChangeColorLst[i];
            var item_x = oneNewItem.item_x;
            var item_y = oneNewItem.item_y;
            var item_color = oneNewItem.item_color;
            // 获取要变色的块的位置
            var oneItem = this.GetItemByIndex(this.GetIndexByPos(item_y, item_x));
            var layerid = 2600 + Number(item_color);
            oneItem.changeColor(layerid);
            // App.DisplayUtils.removeFromParent(oneItem);
            // oneItem.Release();
            // Log.getInstance().trace(oneItem, 0);
            // let layerid = 2600+Number(item_color);
            // GamePanel_ItemSp.getInstance().createItemEffect(layerid,oneItem.SitePos.Y,oneItem.SitePos.X,Msg.EffectType.ET_none);
        }
        return true;
    };
    /**
     * 游戏宝石层数据转成临时数据对象集合
     */
    TG_Game.prototype.gameItemDataToBlockData = function () {
        TG_Game.ItemsBlocksDataTemp = [];
        var items = TG_Game.Items;
        for (var itemIndex in items) {
            var oneItems = items[itemIndex];
            var rowNum = oneItems.SitePos.Y;
            var colNum = oneItems.SitePos.X;
            var blockId = oneItems.BlockId;
            var tempBlocks = new TG_Blocks();
            tempBlocks.setLayerId(blockId);
            tempBlocks.setLayer(2);
            tempBlocks.setRow(rowNum);
            tempBlocks.setCol(colNum);
            tempBlocks.setCellNum(Number(itemIndex));
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                tempBlocks.setIsRandom(1);
            }
            else {
                tempBlocks.setIsRandom(0);
            }
            TG_Game.ItemsBlocksDataTemp.push(tempBlocks);
        }
        return TG_Game.ItemsBlocksDataTemp;
    };
    /**
     *
     * 获取改变颜色后的变色块列表
     * @param changeColorLst
     * @constructor
     */
    TG_Game.prototype.GetNewChangeColorLst = function (changeColorLst) {
        // console.info(changeColorLst);
        var anotherChangeColorLst = [];
        for (var oneChangeColorIndex in changeColorLst) {
            var oneChangeColor = changeColorLst[oneChangeColorIndex];
            // let randomLst = TG_Stage.SetColorNumElement;
            var randomLst = [];
            for (var i = 0; i < TG_Stage.SetColorNumElement.length; i++) {
                randomLst.push(TG_Stage.SetColorNumElement[i]);
            }
            var blocksDataTemp = this.gameItemDataToBlockData();
            var item_y = oneChangeColor.item_y;
            var item_x = oneChangeColor.item_x;
            var blocksDataIndex = item_y * 9 + item_x;
            var blocksData = blocksDataTemp[blocksDataIndex];
            var anotherChangeColor = Number(this.geneRandomNum2(blocksDataTemp, blocksData, randomLst) % 10);
            // console.info(anotherChangeColor)
            // let anotherChangeColor = this.randomChangeColor(oneChangeColor,randomLst);
            var item_color = anotherChangeColor;
            var anotherChangeColorObj = {};
            anotherChangeColorObj["item_y"] = item_y;
            anotherChangeColorObj["item_x"] = item_x;
            anotherChangeColorObj["item_color"] = item_color;
            anotherChangeColorLst.push(anotherChangeColorObj);
        }
        // Log.getInstance().trace(anotherChangeColorLst, 0);
        return anotherChangeColorLst;
    };
    /**
     * 某个颜色块随机获取另一个随机颜色块
     * @param oneChangeColor
     * @param randomLst
     */
    TG_Game.prototype.randomChangeColor = function (oneChangeColor, randomLst) {
        if (randomLst === void 0) { randomLst = [1, 2, 3, 4, 5, 6]; }
        var setColorArr = [];
        for (var oneRandomIndex in randomLst) {
            setColorArr.push(randomLst[oneRandomIndex]);
        }
        // Log.getInstance().trace(setColorArr);
        var item_y = oneChangeColor.item_y;
        var item_x = oneChangeColor.item_x;
        var item_color = oneChangeColor.item_color;
        var oneItem = this.GetItemByIndex(this.GetIndexByPos(item_y, item_x));
        // 没有获取到颜色值
        var noHasGetColor = true;
        while (setColorArr.length > 0 && noHasGetColor) {
            var oneIndex = Math.floor(Math.random() * setColorArr.length);
            var random_item_color = setColorArr[oneIndex];
            if (random_item_color != item_color) {
                var tempList = [];
                /*检查横向*/
                this.getRowChainByColor(random_item_color, tempList, oneItem);
                if (tempList.length >= 3) {
                    setColorArr.splice(oneIndex, 1);
                    continue;
                }
                tempList = [];
                /*检查纵向*/
                this.getColChainByColor(random_item_color, tempList, oneItem);
                if (tempList.length >= 3) {
                    setColorArr.splice(oneIndex, 1);
                    continue;
                }
                //是否可以形成鸟
                if (this.CheckBirdByColor(random_item_color, oneItem)) {
                    setColorArr.splice(oneIndex, 1);
                    continue;
                }
                Log.getInstance().trace("==============", 0);
                Log.getInstance().trace(random_item_color, 0);
                Log.getInstance().trace(setColorArr, 0);
                noHasGetColor = false;
                return random_item_color;
            }
            else {
                setColorArr.splice(oneIndex, 1);
            }
        }
        return randomLst[Math.floor(Math.random() * randomLst.length)];
    };
    TG_Game.prototype.getRowChainByColor = function (item_color, outs, item) {
        if (item_color >= 1 || item_color <= 6) {
            outs.push(item_color);
            var siteCol = item.SitePos.X + 1;
            var siteRow = item.SitePos.Y;
            while (siteCol < this.ColNum) {
                var neighbor = this.GetItemByPos(siteRow, siteCol);
                if (neighbor == null) {
                    break;
                }
                if (neighbor.getItemNone()) {
                    break;
                }
                if (this.CheckAddMark(neighbor)) {
                    if (item_color == neighbor.GetColorType()) {
                        outs.push(item_color);
                        siteCol++;
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            siteCol = item.SitePos.X - 1;
            while (siteCol >= 0) {
                var neighbor = this.GetItemByPos(siteRow, siteCol);
                if (neighbor == null) {
                    break;
                }
                if (neighbor.getItemNone()) {
                    break;
                }
                if (this.CheckAddMark(neighbor)) {
                    if (item_color == neighbor.GetColorType()) {
                        outs.push(item_color);
                        siteCol--;
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
    };
    TG_Game.prototype.getColChainByColor = function (item_color, outs, item) {
        if (item_color >= 1 || item_color <= 6) {
            outs.push(item_color);
            var siteCol = item.SitePos.X;
            var siteRow = item.SitePos.Y + 1;
            while (siteRow < this.RowNum) {
                var neighbor = this.GetItemByPos(siteRow, siteCol);
                if (neighbor == null) {
                    break;
                }
                if (neighbor.getItemNone()) {
                    break;
                }
                if (this.CheckAddMark(neighbor)) {
                    if (item_color == neighbor.GetColorType()) {
                        outs.push(item_color);
                        siteRow++;
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            siteRow = item.SitePos.Y - 1;
            while (siteRow >= 0) {
                var neighbor = this.GetItemByPos(siteRow, siteCol);
                if (neighbor == null) {
                    break;
                }
                if (neighbor.getItemNone()) {
                    break;
                }
                if (this.CheckAddMark(neighbor)) {
                    if (item_color == neighbor.GetColorType()) {
                        outs.push(item_color);
                        siteRow--;
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
    };
    TG_Game.prototype.CheckBirdByColor = function (random_item_color, item) {
        if (!TG_Stage.CanCreateFish) {
            return false;
        }
        if (item) {
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            var leftIndex = this.GetLeftItem(index);
            var topIndex = this.GetTopItem(index);
            var topLeftIndex = this.GetTopLeftItem(index);
            if (leftIndex >= 0 && topIndex >= 0 && topLeftIndex >= 0) {
                var left = this.GetItemByIndex(leftIndex);
                var top_3 = this.GetItemByIndex(topIndex);
                var topLeft = this.GetItemByIndex(topLeftIndex);
                if (this.CheckAddMark(left) && this.CheckAddMark(top_3) && this.CheckAddMark(topLeft) &&
                    left.GetColorType() == random_item_color && top_3.GetColorType() == random_item_color && topLeft.GetColorType() == random_item_color) {
                    return true;
                }
            }
            var bottomIndex = this.GetBottomItem(index);
            var bottomLeftIndex = this.GetBottomLeftItem(index);
            if (leftIndex >= 0 && bottomIndex >= 0 && bottomLeftIndex >= 0) {
                var left = this.GetItemByIndex(leftIndex);
                var bottom = this.GetItemByIndex(bottomIndex);
                var bottomLeft = this.GetItemByIndex(bottomLeftIndex);
                if (this.CheckAddMark(left) && this.CheckAddMark(bottom) && this.CheckAddMark(bottomLeft) &&
                    left.GetColorType() == random_item_color && bottom.GetColorType() == random_item_color && bottomLeft.GetColorType() == random_item_color) {
                    return true;
                }
            }
            var rightIndex = this.GetRightItem(index);
            var topRightIndex = this.GetTopRightItem(index);
            if (rightIndex >= 0 && topIndex >= 0 && topRightIndex >= 0) {
                var right = this.GetItemByIndex(rightIndex);
                var top_4 = this.GetItemByIndex(topIndex);
                var topRight = this.GetItemByIndex(topRightIndex);
                if (this.CheckAddMark(right) && this.CheckAddMark(top_4) && this.CheckAddMark(topRight) &&
                    right.GetColorType() == random_item_color && top_4.GetColorType() == random_item_color && topRight.GetColorType() == random_item_color) {
                    return true;
                }
            }
            var bottomRightIndex = this.GetBottomRightItem(index);
            if (rightIndex >= 0 && bottomIndex >= 0 && bottomRightIndex >= 0) {
                var right = this.GetItemByIndex(rightIndex);
                var bottom = this.GetItemByIndex(bottomIndex);
                var bottomRight = this.GetItemByIndex(bottomRightIndex);
                if (this.CheckAddMark(right) && this.CheckAddMark(bottom) && this.CheckAddMark(bottomRight) &&
                    right.GetColorType() == random_item_color && bottom.GetColorType() == random_item_color && bottomRight.GetColorType() == random_item_color) {
                    return true;
                }
            }
            return false;
        }
        else {
            return false;
        }
    };
    /**
     *
     * 获取棋盘中所有的变色块
     * @constructor
     */
    TG_Game.prototype.GetChangeColorLst = function () {
        var items = TG_Game.Items;
        var changeColorLst = [];
        // let noChangeColorLst = [];
        for (var i in items) {
            var oneItem = items[i];
            if (oneItem.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR && oneItem.venonatId == 0 && !this.CheckHasHighItems(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X))) {
                var item_y = oneItem.SitePos.Y;
                var item_x = oneItem.SitePos.X;
                var item_color = oneItem.Color;
                var changeColorItem = {};
                changeColorItem["item_y"] = item_y;
                changeColorItem["item_x"] = item_x;
                changeColorItem["item_color"] = item_color;
                changeColorLst.push(changeColorItem);
            }
            // else {
            //     noChangeColorLst.push(oneItem);
            // }
        }
        return changeColorLst;
    };
    TG_Game.prototype.VenomInfect = function () {
        var VenomInfect = false;
        if (!this.venomExplode) {
            this.venomExplode = true;
            return VenomInfect;
        }
        this.venomExplode = true;
        // 毒液传染逻辑开始
        var venom = this.geneOneTgItemVenom(true);
        if (venom) {
            Log.getInstance().trace("==================毒液感染开始=====================", 0);
            // 获取可感染的旁边的块
            var venomNeighbor = this.GetCanVenomInfect(venom);
            if (venomNeighbor != null && venomNeighbor) {
                // venom 感染 venomNeighbor
                // venomNeighbor.DoExplode(true,true);
                this.DoDetonate(venomNeighbor, false, Msg.EffectType.ET_none, true);
                //本位置上生成新感染
                var layerid = 2141;
                GamePanel_ItemSp.getInstance().createItemEffect(layerid, venomNeighbor.SitePos.Y, venomNeighbor.SitePos.X, Msg.EffectType.ET_none);
            }
            VenomInfect = true;
        }
        else {
            Log.getInstance().trace("==================没有可以感染的毒液=====================", 0);
        }
        return VenomInfect;
    };
    //生成块: 检测爆炸快是否有传染块并获取需要传染的块
    TG_Game.prototype.GetLodingInfect = function (Round, DoBlock, Type) {
        var m_IsFect = false;
        var m_DoBlock = DoBlock;
        var m_Round = Round;
        var infectBlockId = 1003;
        var infetData = [];
        for (var _i = 0, m_DoBlock_1 = m_DoBlock; _i < m_DoBlock_1.length; _i++) {
            var item = m_DoBlock_1[_i];
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            if (TG_Game.Buttons[index].IsFect) {
                m_IsFect = true;
                break;
            }
        }
        if (!m_IsFect) {
            return;
        }
        if (!m_Round) {
            //我的回合
            infectBlockId = 1004;
            for (var _a = 0, m_DoBlock_2 = m_DoBlock; _a < m_DoBlock_2.length; _a++) {
                var temp = m_DoBlock_2[_a];
                //传染块
                var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                if (TG_Game.Buttons[index].BlockId == 1003) {
                    infectBlockId = 1003;
                    break;
                }
            }
        }
        else if (m_Round) {
            //对方回合
            infectBlockId = 1003;
            for (var _b = 0, m_DoBlock_3 = m_DoBlock; _b < m_DoBlock_3.length; _b++) {
                var temp = m_DoBlock_3[_b];
                //传染块
                var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                if (TG_Game.Buttons[index].BlockId == 1004) {
                    infectBlockId = 1004;
                    break;
                }
            }
        }
        switch (Type) {
            case 0://普通爆炸快,三连消，四连消
                //可以被传染
                for (var _c = 0, m_DoBlock_4 = m_DoBlock; _c < m_DoBlock_4.length; _c++) {
                    var temp = m_DoBlock_4[_c];
                    //特殊判断
                    var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                    if (!this.CheckInfectSpecialBlock(temp, index)) {
                        continue;
                    }
                    infetData = [temp, infectBlockId];
                    TG_Game.Infects.push(infetData);
                }
                break;
            case 1://生成:风车
                //可以被传染
                for (var _d = 0, m_DoBlock_5 = m_DoBlock; _d < m_DoBlock_5.length; _d++) {
                    var temp = m_DoBlock_5[_d];
                    if (!temp.GetExploding()) {
                        //特殊判断
                        var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                        if (!this.CheckInfectSpecialBlock(temp, index)) {
                            continue;
                        }
                        //传染块
                        infetData = [temp, infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
                break;
            case 2://生成:炸弹
                //可以被传染
                for (var _e = 0, m_DoBlock_6 = m_DoBlock; _e < m_DoBlock_6.length; _e++) {
                    var temp = m_DoBlock_6[_e];
                    if (!temp.GetExploding()) {
                        //特殊判断
                        var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                        if (!this.CheckInfectSpecialBlock(temp, index)) {
                            continue;
                        }
                        //传染块
                        infetData = [temp, infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
                break;
            case 3://生成:黑洞
                //可以被传染
                for (var _f = 0, m_DoBlock_7 = m_DoBlock; _f < m_DoBlock_7.length; _f++) {
                    var temp = m_DoBlock_7[_f];
                    if (!temp.GetExploding()) {
                        //特殊判断
                        var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                        if (!this.CheckInfectSpecialBlock(temp, index)) {
                            continue;
                        }
                        //传染块
                        infetData = [temp, infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
                break;
        }
        return m_IsFect;
    };
    //特效块块: 检测爆炸快是否有传染块并获取需要传染的块
    TG_Game.prototype.GetLodingInfectEffect = function (Round, DoBlock, Type, selfindex) {
        var m_IsFect = false;
        var m_DoBlock = [];
        var m_selfindex = selfindex;
        //默认为红色块
        var infectBlockId = 1003;
        var infetData = [];
        //是否是银币
        for (var _i = 0, DoBlock_1 = DoBlock; _i < DoBlock_1.length; _i++) {
            var item = DoBlock_1[_i];
            if (!item || item == null || item.getItemNone()) {
                continue;
            }
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            if (!item || item.IsItemNull() || item.getItemNone()) {
                // if(!item || item.IsItemNull()){
                var selfButton = this.GetButtonItemByIndex(index);
                if (selfButton.IsFect) {
                    m_DoBlock.push(item);
                }
                continue;
            }
            //特殊判断
            if (!this.CheckInfectSpecialBlock(item, index)) {
                continue;
            }
            m_DoBlock.push(item);
        }
        //风车，爆炸，魔法师单独判断
        if (Type != 5 && Type != 3 && Type != 2) {
            for (var _a = 0, m_DoBlock_8 = m_DoBlock; _a < m_DoBlock_8.length; _a++) {
                var item = m_DoBlock_8[_a];
                var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                if (TG_Game.Buttons[index].IsFect) {
                    m_IsFect = true;
                    break;
                }
            }
            if (!m_IsFect) {
                return false;
            }
        }
        //自己是传染块
        var selfButtonBlockId = 1004;
        if (m_selfindex < 0 || m_selfindex > this.ColNum * this.RowNum - 1) {
            return;
        }
        else {
            selfButtonBlockId = this.GetButtonBlockIdByIndex(m_selfindex);
        }
        if (selfButtonBlockId == 1003) {
            infectBlockId = 1003;
        }
        else if (selfButtonBlockId == 1004) {
            infectBlockId = 1004;
        }
        switch (Type) {
            case 0://特效块 横消
                //是否有传染块 特殊判断
                var selfSpecialBooleH = false; //当前块是否是传染块
                var selfButtonH = this.GetButtonItemByIndex(m_selfindex);
                if (selfButtonH.IsFect) {
                    selfSpecialBooleH = true;
                }
                //可以被传染
                if (selfSpecialBooleH) {
                    //自己是感染块
                    //左边
                    for (var i = selfButtonH.SitePos.X - 1; i >= 0; i--) {
                        if (i < 0) {
                            break;
                        }
                        var m_ButtonH = this.GetItemByPos(selfButtonH.SitePos.Y, i);
                        if (m_ButtonH.IsItemNust()) {
                            //银币拦截
                            break;
                        }
                        for (var _b = 0, m_DoBlock_9 = m_DoBlock; _b < m_DoBlock_9.length; _b++) {
                            var temp = m_DoBlock_9[_b];
                            if (temp.SitePos.X == m_ButtonH.SitePos.X) {
                                infetData = [temp, infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    //右边
                    for (var i = selfButtonH.SitePos.X + 1; i < this.RowNum; i++) {
                        if (i > this.RowNum) {
                            break;
                        }
                        var m_ButtonH = this.GetItemByPos(selfButtonH.SitePos.Y, i);
                        if (m_ButtonH.IsItemNust()) {
                            //银币拦截
                            break;
                        }
                        for (var _c = 0, m_DoBlock_10 = m_DoBlock; _c < m_DoBlock_10.length; _c++) {
                            var temp = m_DoBlock_10[_c];
                            if (temp.SitePos.X == m_ButtonH.SitePos.X) {
                                infetData = [temp, infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    // 结束
                    return true;
                }
                else {
                    //特殊快不是感染块
                    var selfSpecialBoxH = this.GetItemByIndex(m_selfindex);
                    if (selfSpecialBoxH.SitePos.X < 0 || selfSpecialBoxH.SitePos.X >= this.ColNum || selfSpecialBoxH.SitePos.Y >= this.RowNum || selfSpecialBoxH.SitePos.Y < 0) {
                        return false;
                    }
                    //左边的特殊块
                    for (var i = selfButtonH.SitePos.X - 1; i >= 0; i--) {
                        if (i < 0) {
                            break;
                        }
                        var InfectButtonIndex = this.GetIndexByPos(selfButtonH.SitePos.Y, i);
                        var InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        var selfButtonBlockIdH = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if (InfectButton.IsFect) {
                            if (selfButtonBlockIdH == -1) {
                                continue;
                            }
                            if (selfButtonBlockIdH == 1003) {
                                infectBlockId = 1003;
                            }
                            else {
                                infectBlockId = 1004;
                            }
                            for (var i_2 = InfectButton.SitePos.X - 1; i_2 < this.RowNum; i_2--) {
                                if (i_2 < 0) {
                                    break;
                                }
                                var m_ButtonH = this.GetItemByPos(InfectButton.SitePos.Y, i_2);
                                if (m_ButtonH.IsItemNust()) {
                                    //银币拦截
                                    break;
                                }
                                for (var _d = 0, m_DoBlock_11 = m_DoBlock; _d < m_DoBlock_11.length; _d++) {
                                    var temp = m_DoBlock_11[_d];
                                    if (temp.SitePos.X == m_ButtonH.SitePos.X) {
                                        infetData = [temp, infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //右边的特殊块
                    for (var i = selfButtonH.SitePos.X + 1; i < this.RowNum; i++) {
                        if (i > this.RowNum) {
                            break;
                        }
                        var InfectButtonIndex = this.GetIndexByPos(selfButtonH.SitePos.Y, i);
                        var InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        var selfButtonBlockIdV = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if (InfectButton.IsFect) {
                            if (selfButtonBlockIdV == -1) {
                                continue;
                            }
                            if (selfButtonBlockIdV == 1003) {
                                infectBlockId = 1003;
                            }
                            else {
                                infectBlockId = 1004;
                            }
                            for (var i_3 = InfectButton.SitePos.X + 1; i_3 < this.RowNum; i_3++) {
                                if (i_3 > this.RowNum) {
                                    break;
                                }
                                var m_ButtonH = this.GetItemByPos(InfectButton.SitePos.Y, i_3);
                                if (m_ButtonH.IsItemNust()) {
                                    //银币拦截
                                    break;
                                }
                                for (var _e = 0, m_DoBlock_12 = m_DoBlock; _e < m_DoBlock_12.length; _e++) {
                                    var temp = m_DoBlock_12[_e];
                                    if (temp.SitePos.X == m_ButtonH.SitePos.X) {
                                        infetData = [temp, infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            case 1://特效块 竖消
                //是否有传染块
                //特殊判断
                var selfSpecialBooleV = false; //当前块是否是传染块
                var selfButtonV = this.GetButtonItemByIndex(m_selfindex);
                if (selfButtonV.IsFect) {
                    selfSpecialBooleV = true;
                }
                //可以被传染
                if (selfSpecialBooleV) {
                    //自己是感染块
                    //上
                    for (var i = selfButtonV.SitePos.Y - 1; i >= 0; i--) {
                        if (i < 0) {
                            break;
                        }
                        var m_ButtonV = this.GetItemByPos(i, selfButtonV.SitePos.X);
                        if (m_ButtonV.IsItemNust()) {
                            //银币拦截
                            break;
                        }
                        for (var _f = 0, m_DoBlock_13 = m_DoBlock; _f < m_DoBlock_13.length; _f++) {
                            var temp = m_DoBlock_13[_f];
                            if (temp.SitePos.Y == m_ButtonV.SitePos.Y) {
                                infetData = [temp, infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    //下
                    for (var i = selfButtonV.SitePos.Y + 1; i < this.ColNum; i++) {
                        if (i < this.ColNum) {
                            break;
                        }
                        var m_ButtonV = this.GetItemByPos(i, selfButtonV.SitePos.X);
                        if (m_ButtonV.IsItemNust()) {
                            //银币拦截
                            break;
                        }
                        for (var _g = 0, m_DoBlock_14 = m_DoBlock; _g < m_DoBlock_14.length; _g++) {
                            var temp = m_DoBlock_14[_g];
                            if (temp.SitePos.Y == m_ButtonV.SitePos.Y) {
                                if (temp.IsItemNust()) {
                                    //银币拦截
                                    break;
                                }
                                infetData = [temp, infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    // 结束
                    return true;
                }
                else {
                    //特殊快不是感染块
                    var selfSpecialBoxV = this.GetItemByIndex(m_selfindex);
                    if (selfSpecialBoxV.SitePos.Y < 0 || selfSpecialBoxV.SitePos.Y >= this.ColNum || selfSpecialBoxV.SitePos.Y >= this.ColNum || selfSpecialBoxV.SitePos.Y < 0) {
                        return false;
                    }
                    //上边的特殊块
                    for (var i = selfButtonV.SitePos.Y - 1; i >= 0; i--) {
                        if (i < 0) {
                            break;
                        }
                        var InfectButtonIndex = this.GetIndexByPos(i, selfButtonV.SitePos.X);
                        var InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        var selfButtonBlockIdT = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if (InfectButton.IsFect) {
                            if (selfButtonBlockIdT == -1) {
                                continue;
                            }
                            if (selfButtonBlockIdT == 1003) {
                                infectBlockId = 1003;
                            }
                            else {
                                infectBlockId = 1004;
                            }
                            for (var i_4 = InfectButton.SitePos.Y - 1; i_4 >= 0; i_4--) {
                                if (i_4 < 0) {
                                    break;
                                }
                                var m_ButtonV = this.GetItemByPos(i_4, InfectButton.SitePos.X);
                                if (m_ButtonV.IsItemNust()) {
                                    //银币拦截
                                    break;
                                }
                                for (var _h = 0, m_DoBlock_15 = m_DoBlock; _h < m_DoBlock_15.length; _h++) {
                                    var temp = m_DoBlock_15[_h];
                                    if (temp.SitePos.Y == m_ButtonV.SitePos.Y) {
                                        infetData = [temp, infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //下边的特殊块
                    for (var i = selfButtonV.SitePos.Y + 1; i < this.ColNum; i++) {
                        if (i > this.ColNum) {
                            break;
                        }
                        var InfectButtonIndex = this.GetIndexByPos(i, selfButtonV.SitePos.X);
                        var InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        var selfButtonBlockIdB = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if (InfectButton.IsFect) {
                            if (selfButtonBlockIdB == -1) {
                                continue;
                            }
                            if (selfButtonBlockIdB == 1003) {
                                infectBlockId = 1003;
                            }
                            else {
                                infectBlockId = 1004;
                            }
                            for (var i_5 = InfectButton.SitePos.Y + 1; i_5 < this.ColNum; i_5++) {
                                if (i_5 < this.ColNum) {
                                    break;
                                }
                                var m_ButtonV = this.GetItemByPos(i_5, InfectButton.SitePos.X);
                                if (m_ButtonV.IsItemNust()) {
                                    //银币拦截
                                    break;
                                }
                                for (var _j = 0, m_DoBlock_16 = m_DoBlock; _j < m_DoBlock_16.length; _j++) {
                                    var temp = m_DoBlock_16[_j];
                                    if (temp.SitePos.Y == m_ButtonV.SitePos.Y) {
                                        infetData = [temp, infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            case 2://特效块:风车
                var StartPos = this.birds[0].GetStartPos();
                var StartIndex = this.GetIndexByPos(StartPos.Y, StartPos.X);
                var StartButton = TG_Game.Buttons[StartIndex];
                var StartButtonBlockId = this.GetButtonBlockIdByIndex(StartIndex);
                m_IsFect = StartButton.IsFect;
                if (StartButton.IsFect) {
                    if (StartButtonBlockId == -1) {
                        return;
                    }
                    if (StartButtonBlockId == 1003) {
                        infectBlockId = 1003;
                    }
                    else {
                        infectBlockId = 1004;
                    }
                    //可以被传染
                    for (var _k = 0, m_DoBlock_17 = m_DoBlock; _k < m_DoBlock_17.length; _k++) {
                        var temp = m_DoBlock_17[_k];
                        if (!temp.GetExploding()) {
                            //传染块
                            infetData = [temp, infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
            case 3://特效块:炸弹
                var selfButton = this.GetButtonItemByIndex(m_selfindex);
                if (selfButton.IsFect) {
                    m_IsFect = true;
                }
                if (m_IsFect) {
                    //可以被传染
                    for (var _l = 0, m_DoBlock_18 = m_DoBlock; _l < m_DoBlock_18.length; _l++) {
                        var temp = m_DoBlock_18[_l];
                        if (temp) {
                            infetData = [temp, infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
            case 4://特效:黑洞
                //可以被传染
                for (var _m = 0, m_DoBlock_19 = m_DoBlock; _m < m_DoBlock_19.length; _m++) {
                    var temp = m_DoBlock_19[_m];
                    if (!temp.GetExploding()) {
                        //传染块
                        infetData = [temp, infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
                break;
            case 5://特效:魔法石
                var Buttonx1MagicStone = this.GetButtonItemByIndex(m_selfindex);
                if (Buttonx1MagicStone.IsFect) {
                    m_IsFect = true;
                }
                if (m_IsFect) {
                    //可以被传染
                    for (var _o = 0, m_DoBlock_20 = m_DoBlock; _o < m_DoBlock_20.length; _o++) {
                        var temp = m_DoBlock_20[_o];
                        if (!temp.GetExploding()) {
                            //传染块
                            var index = this.GetIndexByPos(temp.SitePos.Y, temp.SitePos.X);
                            infetData = [temp, infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
        }
        return m_IsFect;
    };
    //判断当前爆炸的块，能否被传染
    //item 为当前爆炸块 IsEffect 生成块,特效块 Type 为当前爆炸类型
    TG_Game.prototype.CheckInfect = function (DoBlock, IsEffect, Type, selfindex) {
        //判断能否被传染
        var m_IsEffect = IsEffect;
        var m_DoBlock = DoBlock;
        var m_IsFect = false;
        var m_selfIndex = selfindex;
        TG_Game.Infects = [];
        //false 双人,单人
        var m_SingelModel = TG_Stage.SingelModel;
        //false 对方回合, true 我的回合
        var m_Round = false;
        if (!m_SingelModel) {
            if (this.m_Status == GameStatus.GS_ARound) {
                //我的回合
                m_Round = false;
            }
            if (this.m_Status == GameStatus.GS_BRound) {
                //对方回合
                m_Round = true;
            }
        }
        if (m_IsEffect) {
            //特效块
            m_IsFect = this.GetLodingInfectEffect(m_Round, m_DoBlock, Type, m_selfIndex);
        }
        else {
            //普通生成块
            m_IsFect = this.GetLodingInfect(m_Round, m_DoBlock, Type);
        }
        if (!m_IsFect) {
            return true;
        }
        for (var _i = 0, _a = TG_Game.Infects; _i < _a.length; _i++) {
            var fectitem = _a[_i];
            if (!fectitem) {
                return true;
            }
            this.SetInfect(fectitem[0], fectitem[1]);
        }
        TG_Game.Infects = [];
        return true;
    };
    /*特殊块先传染再做特殊处理*/
    TG_Game.prototype.SuperEffectInfect = function (index, SuperEffectArr, selfBlockId) {
        var superItemBlockId = 1004;
        switch (index) {
            case 0:
                //横横，横竖，
                //false 双人 true单人
                for (var _i = 0, SuperEffectArr_1 = SuperEffectArr; _i < SuperEffectArr_1.length; _i++) {
                    var superItem = SuperEffectArr_1[_i];
                    var Index = this.GetIndexByPos(superItem.SitePos.Y, superItem.SitePos.X);
                    var superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if (superButtonBlockId == 1003) {
                        superItemBlockId = 1003;
                        break;
                    }
                }
                for (var _a = 0, SuperEffectArr_2 = SuperEffectArr; _a < SuperEffectArr_2.length; _a++) {
                    var fectitem = SuperEffectArr_2[_a];
                    if (!fectitem) {
                        return true;
                    }
                    this.SetInfect(fectitem, superItemBlockId);
                }
                break;
            case 1:
                //横横，横竖，
                //false 双人 true单人
                for (var _b = 0, SuperEffectArr_3 = SuperEffectArr; _b < SuperEffectArr_3.length; _b++) {
                    var superItem = SuperEffectArr_3[_b];
                    var Index = this.GetIndexByPos(superItem.SitePos.Y, superItem.SitePos.X);
                    var superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if (superButtonBlockId == 1003) {
                        superItemBlockId = 1003;
                        break;
                    }
                }
                break;
            case 2:
                //黑洞
                for (var _c = 0, SuperEffectArr_4 = SuperEffectArr; _c < SuperEffectArr_4.length; _c++) {
                    var superItem = SuperEffectArr_4[_c];
                    var Index = this.GetIndexByPos(superItem.SitePos.Y, superItem.SitePos.X);
                    var superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if (superButtonBlockId == 1003) {
                        superItemBlockId = 1003;
                        break;
                    }
                }
                for (var _d = 0, SuperEffectArr_5 = SuperEffectArr; _d < SuperEffectArr_5.length; _d++) {
                    var fectitem = SuperEffectArr_5[_d];
                    if (!fectitem) {
                        return true;
                    }
                    this.SetInfect(fectitem, superItemBlockId);
                }
                break;
        }
    };
    /*根据index获取地块的blockid*/
    TG_Game.prototype.GetButtonBlockIdByIndex = function (index) {
        if (index == undefined) {
            return -1;
        }
        var ButtonItem = this.GetButtonItemByIndex(index);
        return ButtonItem.BlockId;
    };
    /* 传染块传染 */
    TG_Game.prototype.SetInfect = function (item, blockId) {
        if (!item || item == null) {
            return;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var ButtonItem = TG_Game.Buttons[index];
        if (ButtonItem.BlockId == blockId) {
            return;
        }
        //移除地块
        this.InfectMover(ButtonItem);
        //添加地板为传染块
        this.AddInfect(ButtonItem, blockId);
    };
    /* 添加传染块 */
    TG_Game.prototype.AddInfect = function (ButtonItem, blockId) {
        var Id = blockId;
        var col = ButtonItem.GetSitPos().X;
        var row = ButtonItem.GetSitPos().Y;
        var ButtonObj = GamePanel_ItemSp.getInstance().createNewInfect(Id, row, col);
        //胜利目标
        this.ItemFlyToGoal(ButtonObj);
    };
    /* 移除当前地板块 */
    TG_Game.prototype.InfectMover = function (ButtonItem) {
        if (ButtonItem == null)
            return;
        ButtonItem.setItemNone(true);
        ButtonItem.itemType = ItemType.TG_ITEM_TYPE_NONE;
        GamePanel_ItemSp.getInstance().clearButtons(ButtonItem);
    };
    /*传染块特殊块不传染*/
    TG_Game.prototype.CheckInfectSpecialBlock = function (item, index) {
        //冰层 砂层 不传染
        if (TG_Game.Ices[index].IsItemIce() || TG_Game.Ices[index].IsItemFlowice()) {
            return false;
        }
        //云层 不传染
        if (TG_Game.Clouds[index].IsCloud()) {
            return false;
        }
        //礼品盒 不传染
        if (item.IsItemGift()) {
            return false;
        }
        //毛球不传染
        if (item.IsVenonat()) {
            return false;
        }
        //铁丝网不传染
        if (TG_Game.Meshs[index].IsItemMesh()) {
            return false;
        }
        //黄色钻石块不传染
        if (item.IsItemGem()) {
            return false;
        }
        //皇冠不传染
        if (item.IsTypePea()) {
            return false;
        }
        //银币不传染
        if (item.IsItemNust()) {
            return false;
        }
        return true;
    };
    /*元素块爆炸*/
    TG_Game.prototype.DoExplode = function (item, createEffect, EffectType) {
        if (createEffect === void 0) { createEffect = false; }
        if (EffectType === void 0) { EffectType = Msg.EffectType.ET_none; }
        console.info("===============");
        console.info(item);
        console.info(EffectType);
        if (item == null)
            return;
        if (item.IsVenom()) {
            this.venomExplode = false;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var pos = item.SitePos;
        var blockId = item.BlockId;
        var isDetonate = item.isDetonate;
        var cloud = this.CheckCloudItem(item);
        if (this.CheckHasHighItems(index)) {
            //如果有高层块
            var highItem = this.GetHighItems(index);
            if (highItem != null) {
                if (!highItem.GetExploding()) {
                    highItem.DoExplode();
                }
                return;
            }
        }
        //消除方块
        if (item.GetEffectType() != Msg.EffectType.ET_none && cloud == null && !item.GetIsInfectVenom()) {
            //特效块
            if (item.GetEffectType() == Msg.EffectType.ET_Gold) {
                //炸弹
                Log.getInstance().trace("爆炸的特效块中有炸弹" + "引爆状态" + item.GetDetonate());
                if (!item.GetDetonate()) {
                    if (item.GetSecondBoomSuper()) {
                        //超级炸弹  双炸弹
                        this.SpecialExplodeCross(pos, -1, true, true);
                    }
                    else {
                        this.SpecialExplodeCross(pos, -1, true, false);
                    }
                }
            }
            else if (item.GetEffectType() == Msg.EffectType.ET_Vel) {
                //垂直炸一竖排
                this.SpecialExplodeVertical(pos, item.GetColorType(), -1);
            }
            else if (item.GetEffectType() == Msg.EffectType.ET_Hor) {
                //水平炸一排
                this.SpecialExplodeHorizonal(pos, item.GetColorType(), -1);
            }
            else if (item.GetEffectType() == Msg.EffectType.ET_Bird) {
                //风车
                this.SpecialExplodeBird(item);
            }
            else if (item.GetEffectType() == Msg.EffectType.ET_Black) {
                //黑洞
                this.DoDetonate(item);
            }
        }
        else {
            if (item.isIces || item.isFlowIces) {
                var index_1 = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                GamePanel_ItemSp.getInstance().clearRect(index_1, TG_Game.Ices);
            }
            else {
                this.DoDetonate(item);
            }
        }
        // 不是被引爆的块才可以引爆周围
        if (!isDetonate) {
            this.DoAroundDetonate(pos, blockId);
        }
    };
    /*2层块爆炸的时候，对周边块的影响*/
    TG_Game.prototype.DoAroundDetonate = function (pos, blockId) {
        var index = this.GetIndexByPos(pos.Y, pos.X);
        if (index < 0)
            return;
        var entry = TG_Entry.GetEntry(blockId);
        if (entry.detonateTop) {
            var topItemIndex = this.GetTopItem(index);
            if (topItemIndex != -1) {
                this.DoItemAroundDetonate(topItemIndex);
            }
        }
        if (entry.detonateButtom) {
            var bottomIndex = this.GetBottomItem(index);
            if (bottomIndex != -1) {
                this.DoItemAroundDetonate(bottomIndex);
            }
        }
        if (entry.detonateLeft) {
            var leftItemIndex = this.GetLeftItem(index);
            if (leftItemIndex != -1) {
                this.DoItemAroundDetonate(leftItemIndex);
            }
        }
        if (entry.detonateRight) {
            var rightItemIndex = this.GetRightItem(index);
            if (rightItemIndex != -1) {
                this.DoItemAroundDetonate(rightItemIndex);
            }
        }
    };
    TG_Game.prototype.DoItemAroundDetonate = function (index) {
        //获取二层元素
        var item = this.GetItemByIndex(index);
        //获取铁丝网元素
        var mesh = this.GetMeshItemByIndex(index);
        //获取云层元素
        var cloud = this.GetCloudItemByIndex(index);
        //云层块
        if (!cloud.getItemNone() && cloud.IsCloud() && cloud.IsCanAroundDetonate()) {
            cloud.DoDetonate(cloud);
        }
        else if (item.IsCanAroundDetonate() && !mesh.IsItemMesh()) {
            item.DoDetonate(item);
        }
    };
    /*铁丝网爆炸*/
    TG_Game.prototype.DoMeshExplode = function (item) {
        if (item == null)
            return;
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        item.setItemNone(true);
        item.itemType = ItemType.TG_ITEM_TYPE_NONE;
        GamePanel_ItemSp.getInstance().clearMesh(index);
    };
    /*云层块的爆炸*/
    TG_Game.prototype.DoCloudExplode = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        GamePanel_ItemSp.getInstance().clearRect(index, TG_Game.Clouds);
    };
    /*检测二层块是否可以爆炸*/
    TG_Game.prototype.DoCheck2FloorExplode = function (item) {
        if (this.CheckHasHighItems(item.Index)) {
            //如果有高层块
            var highItem = this.GetHighItems(item.Index);
            if (highItem != null) {
                if (!highItem.GetExploding()) {
                    highItem.DoExplode();
                }
            }
            return true;
        }
        return false;
    };
    /*魔法石的爆炸*/
    TG_Game.prototype.DoMagicStoneExplode = function (item) {
        if (item == null || item.getItemNone())
            return;
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var newMagicStone = GamePanel_ItemSp.getInstance().CreateItems(item.NextId, -1, item.SitePos.Y, item.SitePos.X, false, true);
        var temp = TG_Game.Items[index];
        App.DisplayUtils.removeFromParent(temp);
        TG_Object.Release(temp);
        TG_Game.Items[index] = newMagicStone;
    };
    TG_Game.prototype.SpecialExplodeTriangle = function (pos, orientation) {
        var index = this.GetIndexByPos(pos.Y, pos.X);
        var item = this.GetItemByIndex(index);
        var detonateColor = item.GetColorType();
        var tempList = [];
        switch (orientation) {
            case 1:
                //上
                tempList.push([0 + pos.X, -1 + pos.Y]);
                tempList.push([0 + pos.X, -2 + pos.Y]);
                tempList.push([-1 + pos.X, -1 + pos.Y]);
                tempList.push([1 + pos.X, -1 + pos.Y]);
                tempList.push([-2 + pos.X, 0 + pos.Y]);
                tempList.push([+2 + pos.X, 0 + pos.Y]);
                tempList.push([-1 + pos.X, 0 + pos.Y]);
                tempList.push([1 + pos.X, 0 + pos.Y]);
                break;
            case 2:
                //下
                tempList.push([0 + pos.X, 1 + pos.Y]);
                tempList.push([0 + pos.X, 2 + pos.Y]);
                tempList.push([-1 + pos.X, 1 + pos.Y]);
                tempList.push([1 + pos.X, 1 + pos.Y]);
                tempList.push([-2 + pos.X, 0 + pos.Y]);
                tempList.push([+2 + pos.X, 0 + pos.Y]);
                tempList.push([-1 + pos.X, 0 + pos.Y]);
                tempList.push([1 + pos.X, 0 + pos.Y]);
                break;
            case 3:
                //左
                tempList.push([-1 + pos.X, 0 + pos.Y]);
                tempList.push([-2 + pos.X, 0 + pos.Y]);
                tempList.push([-1 + pos.X, 1 + pos.Y]);
                tempList.push([-1 + pos.X, -1 + pos.Y]);
                tempList.push([0 + pos.X, -2 + pos.Y]);
                tempList.push([0 + pos.X, 2 + pos.Y]);
                tempList.push([0 + pos.X, -1 + pos.Y]);
                tempList.push([0 + pos.X, 1 + pos.Y]);
                break;
            case 4:
                //右
                tempList.push([1 + pos.X, 0 + pos.Y]);
                tempList.push([2 + pos.X, 0 + pos.Y]);
                tempList.push([1 + pos.X, 1 + pos.Y]);
                tempList.push([1 + pos.X, -1 + pos.Y]);
                tempList.push([0 + pos.X, -2 + pos.Y]);
                tempList.push([0 + pos.X, 2 + pos.Y]);
                tempList.push([0 + pos.X, -1 + pos.Y]);
                tempList.push([0 + pos.X, 1 + pos.Y]);
                break;
        }
        //传染
        var fectArr = [];
        for (var _i = 0, tempList_1 = tempList; _i < tempList_1.length; _i++) {
            var itemPos = tempList_1[_i];
            var itemX = itemPos[0];
            var itemY = itemPos[1];
            var item_1 = this.GetItemByPos(itemY, itemX);
            fectArr.push(item_1);
        }
        this.CheckInfect(fectArr, true, 5, index);
        for (var i = 0; i < tempList.length; i++) {
            var temp = tempList[i];
            this.doItemDetonate(temp, detonateColor);
        }
    };
    /*通过坐标点引爆*/
    TG_Game.prototype.doItemDetonate = function (pos, detonateColor, infect) {
        if (infect === void 0) { infect = -1; }
        var posX = pos[0];
        var posY = pos[1];
        var index1 = posY * this.ColNum + posX;
        if (this.CheckHasHighItems(index1)) {
            //如果有高层块
            var highItem = this.GetHighItems(index1);
            if (highItem != null) {
                if (!highItem.GetExploding()) {
                    highItem.DoExplode();
                }
                return;
            }
        }
        if (TG_Game.Items.length > 0 && posX >= 0 && posX < this.ColNum && posY >= 0 && posY < this.RowNum) {
            var index = posY * this.ColNum + posX;
            var item = this.GetItemByIndex(index);
            if (item.CheckMatchSpecial()) {
                item.SetDetonateColor(detonateColor);
                if (item.GetEffectType() == Msg.EffectType.ET_Vel) {
                    //垂直炸一竖排
                    item.MarkedAlready = true;
                    if (!item.GetAlreadyExplode()) {
                        //当前没有引爆
                        this.SpecialExplodeVertical(item.SitePos, item.GetColorType(), -1);
                        //如果是子弹形成的特效块,移除上层的特效块
                        if (item.GetIsBullet()) {
                            this.RemoveBullet(item.SitePos);
                        }
                    }
                    else {
                        this.DoDetonate(item, false);
                    }
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Hor) {
                    //水平炸一排
                    item.MarkedAlready = true;
                    if (!item.GetAlreadyExplode()) {
                        //当前没有引爆
                        this.SpecialExplodeHorizonal(item.SitePos, item.GetColorType(), -1);
                        //如果是子弹形成的特效块,移除上层的特效块
                        if (item.GetIsBullet()) {
                            this.RemoveBullet(item.SitePos);
                        }
                    }
                    else {
                        this.DoDetonate(item, false);
                    }
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Black) {
                    //黑洞
                    item.MarkedAlready = true;
                    if (!item.GetAlreadyExplode()) {
                        //当前没有引爆
                        this.SpecialExplodeBlack(item.SitePos, detonateColor);
                    }
                    else {
                        this.DoDetonate(item, false);
                    }
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Gold) {
                    //炸弹
                    item.MarkedAlready = true;
                    if (!item.GetDetonate() && !item.ET_SecondBoom) {
                        //不是二次爆炸
                        if (item.GetSecondBoomSuper()) {
                            //超级炸弹
                            this.SpecialExplodeCross(item.SitePos, -1, true, true);
                        }
                        else {
                            this.SpecialExplodeCross(item.SitePos, -1, true, false);
                        }
                    }
                    else {
                        this.DoDetonate(item, false);
                    }
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Bird) {
                    //风车
                    item.MarkedAlready = true;
                    this.SpecialExplodeBird(item);
                    //如果是子弹形成的特效块,移除上层的特效块
                    if (item.GetIsBullet()) {
                        this.RemoveBullet(item.SitePos);
                    }
                }
                else {
                    item.DoDetonate();
                }
            }
            else {
                if (item.GetEffectType() == Msg.EffectType.ET_Gold) {
                    //炸弹
                    // if(this.isBulletExplode){
                    //     //如果是子弹的爆炸
                    //     item.ET_SecondBoom=false;
                    //     this.DoDetonate(item,false);
                    // }else {
                    item.ET_SecondBoom = true;
                    // }
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Vel) {
                    //垂直炸一竖排
                    this.DoDetonate(item, false);
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Hor) {
                    //水平炸一横排
                    this.DoDetonate(item, false);
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Black) {
                    //黑洞
                    this.DoDetonate(item, false);
                }
                else if (item.GetEffectType() == Msg.EffectType.ET_Bird) {
                    //风车
                    this.DoDetonate(item, false);
                }
            }
        }
    };
    /*引爆*/
    TG_Game.prototype.DoDetonate = function (item, createEffect, EffectType, IsInfectVenom) {
        if (createEffect === void 0) { createEffect = false; }
        if (EffectType === void 0) { EffectType = Msg.EffectType.ET_none; }
        if (IsInfectVenom === void 0) { IsInfectVenom = false; }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (this.CheckHasHighItems(index)) {
            //如果有高层块
            var highItem = this.GetHighItems(index);
            if (highItem != null) {
                if (!highItem.GetExploding()) {
                    highItem.DoExplode();
                }
                return;
            }
        }
        item.SetDetonate(true);
        if (item == null || item.IsItemNone())
            return;
        //设置爆炸状态为true
        item.SetExploding(true);
        Log.getInstance().trace("元素块爆炸=====" + "[" + item.SitePos.X + "," + item.SitePos.Y + "]", 0);
        //游戏中，飞到消除目标位置的动画
        this.ItemFlyToGoal(item);
        console.info(IsInfectVenom);
        if (!IsInfectVenom) {
            //判断3层块的消失 冰层、流沙等
            var ices = this.CheckIcesItem(item);
            if (ices) {
                if (!ices.GetExploding()) {
                    ices.DoExplode();
                }
            }
        }
        //加分数
        this.AddScore(ScoreType.ST_Normal);
        //消除
        GamePanel_ItemSp.getInstance().clearRect(index, TG_Game.Items);
    };
    /*检测二次炸弹*/
    TG_Game.prototype.isCanSecondBooms = function () {
        var isCanSecondBooms = false;
        for (var i = 0; i < TG_Game.Items.length; i++) {
            var item = TG_Game.Items[i];
            if (item.IsItemSecondBoom()) {
                isCanSecondBooms = true;
            }
        }
        Log.getInstance().trace("检测是否可以二次爆炸。。。" + isCanSecondBooms);
        return isCanSecondBooms;
    };
    TG_Game.prototype.doCheckSecondBooms = function () {
        for (var i = 0; i < TG_Game.Items.length; i++) {
            var item = TG_Game.Items[i];
            if (item.IsItemSecondBoom()) {
                if (item.GetSecondBoomSuper()) {
                    //超级炸弹
                    this.SpecialExplodeCross(item.SitePos, -1, true, true);
                }
                else {
                    this.SpecialExplodeCross(item.SitePos, -1, true, false);
                    //如果是子弹形成的特效块,移除上层的特效块
                    if (item.GetIsBullet()) {
                        this.RemoveBullet(item.SitePos);
                    }
                }
                item.ET_SecondBoom = false;
            }
        }
    };
    /*获取特效方块的类型*/
    TG_Game.prototype.GetEffectValue = function (aItem, bItem) {
        var effectValue = aItem.GetEffectType() + bItem.GetEffectType();
        return effectValue;
    };
    TG_Game.prototype.GetTopItem = function (index) {
        if (index < 0 || index < this.ColNum) {
            return -1;
        }
        return index - this.ColNum;
    };
    TG_Game.prototype.GetBottomItem = function (index) {
        if (index < 0 || index >= (this.RowNum - 1) * this.ColNum) {
            return -1;
        }
        return index + this.RowNum;
    };
    TG_Game.prototype.GetTopLeftItem = function (index) {
        if (index < 0 || index < this.ColNum) {
            return -1;
        }
        if (index % this.ColNum == 0) {
            return -1;
        }
        return index - this.ColNum - 1;
    };
    TG_Game.prototype.GetBottomLeftItem = function (index) {
        if (index < 0 || index / this.ColNum == this.RowNum - 1) {
            return -1;
        }
        if (index % this.ColNum == 0) {
            return -1;
        }
        return index + this.ColNum - 1;
    };
    TG_Game.prototype.GetTopRightItem = function (index) {
        if (index < 0 || index < this.ColNum) {
            return -1;
        }
        if (index % this.ColNum == this.ColNum - 1) {
            return -1;
        }
        return index - this.ColNum + 1;
    };
    TG_Game.prototype.GetBottomRightItem = function (index) {
        if (index < 0 || index / this.ColNum == this.RowNum - 1) {
            return -1;
        }
        if (index % this.ColNum == this.ColNum - 1) {
            return -1;
        }
        return index + this.ColNum + 1;
    };
    TG_Game.prototype.GetLeftItem = function (index) {
        if (index < 0 || index % this.RowNum == 0) {
            return -1;
        }
        return index - 1;
    };
    TG_Game.prototype.GetRightItem = function (index) {
        if (index < 0 || index % this.RowNum == this.RowNum - 1) {
            return -1;
        }
        return index + 1;
    };
    /*游戏开始时的掉落*/
    TG_Game.prototype.doStartDrop = function () {
        TG_Game.IsBeginPanelStartDrop = true;
        this.doDrop("startDrop");
    };
    /*掉落*/
    TG_Game.prototype.doDrop = function (flag) {
        if (flag === void 0) { flag = ""; }
        Log.getInstance().trace("开始掉落");
        //无限掉落
        this.combo += 1;
        if (this.combo >= 99) {
            this.infiniteDrop = true;
            //判断游戏结束
            if (this.doCheckGameFinish()) {
                //游戏结束
                this.doFinishGame();
                return;
            }
        }
        // if (this.doCheckGameFinish()){
        //     return;
        // }
        // 异步创建本回合的特效块
        this.asyncCreateEffectItemAndInsert();
        //掉落过程
        this.doDropImpl();
    };
    TG_Game.prototype.doDropImpl = function () {
        //掉落逻辑
        this.doDropLogic();
        //掉落路径
        this.calDropPath();
        // 执行掉落表现
        this.doDropPerform();
    };
    /*掉落逻辑*/
    TG_Game.prototype.doDropLogic = function () {
        //垂直掉落
        this.doDropWhitVertical();
        var createList = [];
        // 出生点产生新块
        while (this.doCreateItemFromBirthPos(createList)) {
            this.doItemDrop(createList, false);
            createList = [];
        }
        // 侧滑掉落
        var res = this.doItemDrop(TG_Game.Items, true);
        if (res) {
            this.doDropLogic();
        }
    };
    /*侧滑掉落*/
    TG_Game.prototype.doItemDrop = function (drops, isSilde) {
        if (isSilde === void 0) { isSilde = true; }
        var res = false;
        for (var i = drops.length - 1; i >= 0; i--) {
            var item = drops[i];
            if (item.DropPaths.length <= 0)
                item.AddDropPath(item.SitePos);
            res = this.doItemDrop1(item, isSilde) || res;
        }
        return res;
    };
    TG_Game.prototype.doItemDrop1 = function (item, isSilde) {
        if (!item.CheckCellFallDown())
            return false;
        var res = false;
        var isDrop = true;
        while (isDrop) {
            isDrop = false;
            var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
            var target = this.findBottomWhitVerticalLogic(item);
            if (target != null) {
                isDrop = true;
                res = true;
                for (var i = item.SitePos.Y; i <= target.SitePos.Y; i++) {
                    var vec2 = { "X": item.SitePos.X, "Y": i };
                    item.AddDropPath(vec2);
                }
                var isAddDownGroups = true;
                for (var _i = 0, _a = this.downGroups; _i < _a.length; _i++) {
                    var ctarget = _a[_i];
                    var targetIndex_1 = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                    var ctargetIndex = this.GetIndexByPos(ctarget.SitePos.Y, ctarget.SitePos.X);
                    if (ctargetIndex == targetIndex_1) {
                        isAddDownGroups = false;
                        break;
                    }
                }
                if (isAddDownGroups) {
                    this.downGroups.push(item);
                }
                var targetIndex = this.GetIndexByPos(target.SitePos.Y, target.SitePos.X);
                this.SwapItem1(index, targetIndex);
            }
            var bottomLeftIndex = this.GetBottomLeftItem(index);
            if (!isDrop && bottomLeftIndex >= 0) {
                var bottomLeft = this.GetItemByIndex(bottomLeftIndex);
                if (bottomLeft && isSilde && !this.CheckExistBirthPos(bottomLeft) && this.CheckCanSildeLeft(item)) {
                    isDrop = true;
                    res = true;
                    item.AddDropPath(bottomLeft.GetSitPos());
                    var isAddDownGroups = true;
                    for (var _b = 0, _c = this.downGroups; _b < _c.length; _b++) {
                        var ctarget = _c[_b];
                        var targetIndex = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                        var ctargetIndex = this.GetIndexByPos(ctarget.SitePos.Y, ctarget.SitePos.X);
                        if (ctargetIndex == targetIndex) {
                            isAddDownGroups = false;
                            break;
                        }
                    }
                    if (isAddDownGroups) {
                        this.downGroups.push(item);
                    }
                    var lIndex = this.GetIndexByPos(bottomLeft.SitePos.Y, bottomLeft.SitePos.X);
                    this.SwapItem1(index, lIndex);
                }
            }
            var bottomRightIndex = this.GetBottomRightItem(index);
            if (!isDrop && bottomRightIndex >= 0) {
                var bottomRight = this.GetItemByIndex(bottomRightIndex);
                if (bottomRight && isSilde && !this.CheckExistBirthPos(bottomRight) && this.CheckCanSildeRight(item)) {
                    isDrop = true;
                    res = true;
                    item.AddDropPath(bottomRight.GetSitPos());
                    var isAddDownGroups = true;
                    for (var _d = 0, _e = this.downGroups; _d < _e.length; _d++) {
                        var ctarget = _e[_d];
                        var targetIndex = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                        var ctargetIndex = this.GetIndexByPos(ctarget.SitePos.Y, ctarget.SitePos.X);
                        if (ctargetIndex == targetIndex) {
                            isAddDownGroups = false;
                            break;
                        }
                    }
                    if (isAddDownGroups) {
                        this.downGroups.push(item);
                    }
                    var rIndex = this.GetIndexByPos(bottomRight.SitePos.Y, bottomRight.SitePos.X);
                    this.SwapItem1(index, rIndex);
                }
            }
        }
        return res;
    };
    TG_Game.prototype.findBottomWhitVerticalLogic = function (cur) {
        var index = this.GetIndexByPos(cur.SitePos.Y, cur.SitePos.X);
        var bottomIndex = this.GetBottomItem(index);
        if (bottomIndex < 0)
            return null;
        var target = this.GetItemByIndex(bottomIndex);
        if (!this.CheckCellThrough(target))
            return null;
        while (bottomIndex >= 0 && this.CheckCellThrough(target)) {
            bottomIndex = this.GetBottomItem(bottomIndex);
            if (bottomIndex >= 0) {
                target = this.GetItemByIndex(bottomIndex);
            }
        }
        while (this.GetIndexByPos(target.SitePos.Y, target.SitePos.X) > index && !this.CheckCanDropIn(target)) {
            var topIndex = this.GetTopItem(this.GetIndexByPos(target.SitePos.Y, target.SitePos.X));
            target = this.GetItemByIndex(topIndex);
        }
        if (this.CheckCanDropIn(target)) {
            return target;
        }
        return null;
    };
    TG_Game.prototype.CheckExistBirthPos = function (item) {
        if (!item.getItemNone()) {
            return false;
        }
        var topIndex = this.GetTopItem(this.GetIndexByPos(item.SitePos.Y, item.SitePos.X));
        while (topIndex >= 0) {
            var top_5 = this.GetItemByIndex(topIndex);
            if (top_5 && !top_5.CheckCellVerticalFallDown() && !this.CheckCellThrough(top_5)) {
                return false;
            }
            topIndex = this.GetTopItem(topIndex);
        }
        return true;
    };
    TG_Game.prototype.CheckCanSildeLeft = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var blIndex = this.GetBottomLeftItem(index);
        if (blIndex < 0 || blIndex > this.RowNum * this.ColNum - 1) {
            return false;
        }
        var blItem = this.GetItemByIndex(blIndex);
        if (blItem == null) {
            return false;
        }
        if (!blItem.getItemNone()) {
            return false;
        }
        var blButton = this.GetButtonItemByIndex(blIndex);
        if (blButton.IsItemNull() || blButton.IsItemCross()) {
            return false;
        }
        var railing = this.GetRailingItemByIndex(index);
        var lIndex = this.GetLeftItem(index);
        var lRailing = this.GetRailingItemByIndex(lIndex);
        var blRailing = this.GetRailingItemByIndex(blIndex);
        var bIndex = this.GetBottomItem(index);
        var bRailing = this.GetRailingItemByIndex(bIndex);
        //左下路径
        if (!railing.CheckStopMove(3) && !lRailing.CheckStopMove(4) &&
            !lRailing.CheckStopMove(2) && !blRailing.CheckStopMove(1)) {
            return true;
        }
        //下左路径
        if (!railing.CheckStopMove(2) && !bRailing.CheckStopMove(1) &&
            !bRailing.CheckStopMove(3) && !blRailing.CheckStopMove(4)) {
            return true;
        }
        return false;
    };
    TG_Game.prototype.CheckCanSildeRight = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var brIndex = this.GetBottomRightItem(index);
        if (brIndex < 0 || brIndex > this.RowNum * this.ColNum - 1) {
            return false;
        }
        var brItem = this.GetItemByIndex(brIndex);
        if (brItem == null) {
            return false;
        }
        if (!brItem.getItemNone()) {
            return false;
        }
        var brButton = this.GetButtonItemByIndex(brIndex);
        if (brButton.IsItemNull() || brButton.IsItemCross()) {
            return false;
        }
        var railing = this.GetRailingItemByIndex(index);
        var rIndex = this.GetRightItem(index);
        var rRailing = this.GetRailingItemByIndex(rIndex);
        var brRailing = this.GetRailingItemByIndex(brIndex);
        var bIndex = this.GetBottomItem(index);
        var bRailing = this.GetRailingItemByIndex(bIndex);
        //右下路径
        if (!railing.CheckStopMove(4) && !rRailing.CheckStopMove(3) &&
            !rRailing.CheckStopMove(2) && !brRailing.CheckStopMove(1)) {
            return true;
        }
        //下右路径
        if (!railing.CheckStopMove(2) && !bRailing.CheckStopMove(1) &&
            !bRailing.CheckStopMove(4) && !brRailing.CheckStopMove(3)) {
            return true;
        }
        return false;
    };
    TG_Game.prototype.doDropWhitVertical = function () {
        var res = false;
        for (var i = this.ColNum * this.RowNum - 1; i >= 0; i--) {
            var item = this.GetItemByIndex(i);
            if (this.CheckCanDropIn(item)) {
                var target = this.findDropWhitVerticalLogic(item);
                if (target == null)
                    continue;
                target.AddDropPath(item.GetSitPos());
                var isAddDownGroups = true;
                for (var _i = 0, _a = this.downGroups; _i < _a.length; _i++) {
                    var ctarget = _a[_i];
                    var targetIndex = this.GetIndexByPos(target.SitePos.Y, target.SitePos.X);
                    var ctargetIndex = this.GetIndexByPos(ctarget.SitePos.Y, ctarget.SitePos.X);
                    if (ctargetIndex == targetIndex) {
                        isAddDownGroups = false;
                        break;
                    }
                }
                if (isAddDownGroups) {
                    this.downGroups.push(target);
                }
                var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                this.SwapItem1(index, this.GetIndexByPos(target.SitePos.Y, target.SitePos.X));
                res = true;
            }
        }
        return res;
    };
    TG_Game.prototype.SwapItem1 = function (first, second, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        this.changeItemPosByIndex(first, second, itemArr);
        this.changeItemIndexByIndex(first, second, itemArr);
    };
    /*是否可以掉落*/
    TG_Game.prototype.CheckCanDropIn = function (item) {
        var isCanDropIn = true;
        if (!item.getItemNone()) {
            isCanDropIn = false;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            isCanDropIn = false;
        }
        var button = this.GetButtonItemByIndex(index);
        if (button.IsItemNull()) {
            isCanDropIn = false;
        }
        if (button.IsItemCross()) {
            var bottomIndex = this.GetBottomItem(index);
            if (bottomIndex > 0) {
                var buttom = this.GetItemByIndex(bottomIndex);
                isCanDropIn = this.CheckCanDropIn(buttom);
            }
            isCanDropIn = false;
        }
        var railing = this.GetRailingItemByIndex(index);
        if (railing.IsItemRailing()) {
            if (railing.CheckStopMove(1)) {
                isCanDropIn = false;
            }
        }
        var topIndex = this.GetTopItem(index);
        if (topIndex > 0) {
            railing = this.GetRailingItemByIndex(topIndex);
            if (railing.IsItemRailing()) {
                if (railing.CheckStopMove(2)) {
                    isCanDropIn = false;
                }
            }
        }
        return isCanDropIn;
    };
    /*是否可以垂直掉落*/
    TG_Game.prototype.CheckCellVerticalFallDown = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        if (item.getItemNone()) {
            return false;
        }
        var button = this.GetButtonItemByIndex(index);
        if (button.IsItemNull()) {
            return false;
        }
        var mesh = this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh()) {
            return false;
        }
        //自己的下
        var railing = this.GetRailingItemByIndex(index);
        if (railing.IsItemRailing()) {
            if (railing.CheckStopMove(2)) {
                return false;
            }
        }
        //下方块的上
        var bottomIndex = this.GetBottomItem(index);
        if (bottomIndex > 0) {
            railing = this.GetRailingItemByIndex(bottomIndex);
            if (railing.IsItemRailing()) {
                if (railing.CheckStopMove(1)) {
                    return false;
                }
            }
        }
        return true;
    };
    TG_Game.prototype.findDropWhitVerticalLogic = function (item) {
        var index = this.GetTopItem(this.GetIndexByPos(item.SitePos.Y, item.SitePos.X));
        if (index >= 0) {
            var top_6 = this.GetItemByIndex(index);
            if (top_6.CheckCellFallDown()) {
                top_6.AddDropPath(top_6.SitePos);
                if (!top_6.getItemNone()) {
                    return top_6;
                }
            }
            if (this.CheckCellThrough(top_6)) {
                var target = this.findDropWhitVerticalLogic(top_6);
                if (target != null) {
                    target.AddDropPath(top_6.SitePos);
                    return target;
                }
            }
        }
        return null;
    };
    TG_Game.prototype.CheckCellThrough = function (item) {
        if (!item.getItemNone()) {
            return false;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > (this.ColNum * this.RowNum - 1)) {
            return false;
        }
        var botton = this.GetButtonItemByIndex(index);
        if (!botton.CanFallThrough) {
            return false;
        }
        //自己的上
        var railing = this.GetRailingItemByIndex(index);
        if (railing.IsItemRailing()) {
            if (railing.CheckStopMove(1)) {
                return false;
            }
        }
        //上方块的下
        var topIndex = this.GetTopItem(index);
        if (topIndex > 0) {
            railing = this.GetRailingItemByIndex(topIndex);
            if (railing.IsItemRailing()) {
                if (railing.CheckStopMove(2)) {
                    return false;
                }
            }
        }
        return true;
    };
    TG_Game.prototype.CheckCellFallDown = function (item) {
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > 80) {
            return false;
        }
        if (item.getItemNone()) {
            return false;
        }
        var button = this.GetButtonItemByIndex(index);
        if (button.IsItemNull()) {
            return false;
        }
        var mesh = this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh() && !mesh.getItemNone()) {
            return false;
        }
        return true;
    };
    /*掉落路径计算*/
    TG_Game.prototype.calDropPath = function () {
        var temps = [];
        var complateCount = 0;
        while (true) {
            temps = [];
            for (var _i = 0, _a = this.downGroups; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.DropPaths.length > 0) {
                    var pos = item.DropPaths[0];
                    if (pos.delayTime != undefined)
                        pos = { "X": pos.X, "Y": pos.Y, "needDelayTime": pos.needDelayTime, "delayTime": pos.delayTime };
                    else {
                        pos = { "X": pos.X, "Y": pos.Y, "needDelayTime": false, "delayTime": 0 };
                    }
                    var curIndex = this.GetIndexByPos(pos.Y, pos.X);
                    if (temps.indexOf(curIndex) == -1) {
                        //不存在，注入数组
                        temps.push(curIndex);
                        item.AddActionPath(pos);
                        item.RemoveDropPath(pos);
                    }
                    else {
                        item.AddActionPathToo();
                        var cPos = item.ActionPaths[item.ActionPaths.length - 1];
                        temps.push(this.GetIndexByPos(cPos.Y, cPos.X));
                    }
                }
                if (item.DropPaths.length <= 0 && !item.IsCalDropPath) {
                    complateCount++;
                    item.IsCalDropPath = true;
                }
            }
            if (complateCount >= this.downGroups.length) {
                break;
            }
        }
        for (var _b = 0, _c = this.downGroups; _b < _c.length; _b++) {
            var item = _c[_b];
            item.IsCalDropPath = false;
            item.DropPaths = [];
            for (var _d = 0, _e = item.ActionPaths; _d < _e.length; _d++) {
                var pos = _e[_d];
                // item.DropPaths.push(pos);
                item.AddDropPath(pos, false);
            }
        }
    };
    // public  downGroupsLastPoint=null;//本次掉落最后一个点
    TG_Game.prototype.doDropPerform = function () {
        this.downRectTime = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        //计算新产生方块掉落的 delayTime needDelayTime
        var createList = [];
        for (var i = 0; i < this.createList.length; i++) {
            var temp = this.createList[i];
            var repeatCount = TG_ItemAnimator.getInstance().CalculateDropDelayNum(temp);
            try {
                if (repeatCount != 0) {
                    if (temp.DropPaths[repeatCount]["needDelayTime"] != undefined && temp.DropPaths[repeatCount]["needDelayTime"] == true) {
                        createList.push(temp);
                    }
                }
            }
            catch (e) {
                Log.getInstance().trace(e, 0);
            }
        }
        var dropPos = [];
        var dropPosYs = []; //掉落列的集合
        for (var i = 0; i < this.ColNum; i++) {
            var obj = { "col": -1, "delayBaseNum": -1 };
            obj.col = i;
            obj.delayBaseNum = 0;
            dropPos.push(obj);
        }
        for (var i = 0; i < this.downGroups.length; i++) {
            var obj = { "colNum": 0, "maxNum": 0 };
            obj.colNum = this.downGroups[i].SitePos.X;
            obj.maxNum = this.downGroups[i].DropPaths.length - 1;
            dropPosYs.push(obj);
        }
        for (var s in dropPosYs) {
            var posY = dropPosYs[s].colNum;
            for (var k in dropPos) {
                if (dropPos[k].col == posY) {
                    dropPos[k].delayBaseNum = dropPosYs[s].maxNum;
                }
            }
        }
        for (var k = createList.length - 1; k >= 0; k--) {
            var temp = createList[k];
            var repeatCount = TG_ItemAnimator.getInstance().CalculateDropDelayNum(temp);
            Log.getInstance().trace("============本回合新生成的块====================");
            Log.getInstance().trace("[" + temp.SitePos.X + "," + temp.SitePos.Y + "]");
            for (var k1 in dropPos) {
                if (dropPos[k1].col == temp.SitePos.X) {
                    var len = 0;
                    if (temp.DropPaths.length > 1) {
                        len = temp.DropPaths.length - 1;
                    }
                    else {
                        len = temp.DropPaths.length;
                    }
                    var time = TG_ItemAnimator.getInstance().CalculateDropTime(len) / (len) * .4;
                    var value = dropPos[k1].delayBaseNum;
                    if (repeatCount != 0) {
                        if (temp.DropPaths[repeatCount - 1].X != temp.DropPaths[repeatCount].X) {
                            temp.DropPaths[repeatCount]["delayTime"] = time * value;
                        }
                        else {
                            temp.DropPaths[repeatCount]["delayTime"] = 0;
                        }
                    }
                    else {
                        temp.DropPaths[repeatCount]["delayTime"] = 0;
                    }
                }
            }
        }
        //掉落
        // this.downGroupsLastPoint=null;
        if (this.downGroups.length > 0) {
            var arr = [];
            for (var _i = 0, _a = this.downGroups; _i < _a.length; _i++) {
                var temp = _a[_i];
                var time = TG_ItemAnimator.getInstance().CalculateTotalDropTime(temp) * temp.DropPaths.length;
                arr.push(time);
            }
            arr.sort(function (num1, num2) {
                return num1 - num2;
            });
            var delayTime = eval(arr[arr.length - 1] + 30);
            if (delayTime < TG_Game.MaxdropDelay) {
                delayTime = TG_Game.MaxdropDelay;
            }
            App.TimerManager.doTimer(delayTime, 1, this.onDropBack, this);
            //this.downGroupsLastPoint=this.downGroups[this.downGroups.length-1].SitePos;
        }
        else {
            this.onDropBack();
        }
        for (var i = 0; i < this.downGroups.length; i++) {
            var drop = this.downGroups[i];
            Log.getInstance().trace("========本回合掉落的方块=========");
            Log.getInstance().trace("[" + drop.SitePos.X + "," + drop.SitePos.Y + "]");
            // Log.getInstance().trace(drop.DropPaths,0)
            //掉落
            GamePanel_ItemSp.getInstance().ItemDropPlay(drop, drop.DropPaths);
        }
    };
    TG_Game.prototype.initBirthPos = function () {
        for (var col = 0; col < this.ColNum; col++) {
            this.birthPosYs.push(-1);
        }
        for (var col = 0; col < this.ColNum; col++) {
            for (var row = 0; row < this.RowNum; row++) {
                var index = row * this.RowNum + col;
                var item = this.GetItemByIndex(index);
                if (item != null && this.CheckIsBirthPos(index)) {
                    this.birthPosYs[col] = item.SitePos.Y;
                    break;
                }
            }
        }
    };
    TG_Game.prototype.CheckIsBirthPos = function (index) {
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        var button = this.GetButtonItemByIndex(index);
        if (button.IsItemNull()) {
            return false;
        }
        return true;
    };
    TG_Game.prototype.doCreateItemFromBirthPos = function (createList) {
        var res = false;
        for (var i = 0; i < this.RowNum; i++) {
            var birthPos = [i, this.birthPosYs[i]];
            var birthIndex = this.GetIndexByPos(birthPos[1], birthPos[0]);
            if (birthIndex < 0 || birthIndex > this.ColNum * this.RowNum - 1)
                continue;
            var birthItem = this.GetItemByIndex(birthIndex);
            if (this.CheckCanDropIn(birthItem)) {
                var item = this.createNormalItem(i, this.birthPosYs[i]);
                if (item == null)
                    continue;
                var pos = { "X": 0, "Y": 0, "needDelayTime": true, "delayTime": 0 };
                pos.X = item.GetSitPos().X;
                pos.Y = item.GetSitPos().Y;
                item.AddDropPath(pos);
                createList.push(item);
                var isAddDownGroups = true;
                for (var _i = 0, _a = this.downGroups; _i < _a.length; _i++) {
                    var ctarget = _a[_i];
                    var targetIndex = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
                    var ctargetIndex = this.GetIndexByPos(ctarget.SitePos.Y, ctarget.SitePos.X);
                    if (ctargetIndex == targetIndex) {
                        isAddDownGroups = false;
                        break;
                    }
                }
                if (isAddDownGroups) {
                    this.downGroups.push(item);
                }
                res = true;
            }
        }
        return res;
    };
    TG_Game.prototype.initDropCursor = function () {
        this.downGroups = [];
        for (var i = 0; i < this.ColNum; i++) {
            this.dropCursor.push(0);
        }
    };
    TG_Game.prototype.createNormalItem = function (colPos, rowPos) {
        var id = 0;
        var DropModels = [];
        if (this.rollLeaveDrops[colPos].length > 0) {
            // 滚动遗留掉落
            var idx = this.rollLeaveDrops[colPos].length - 1;
            id = this.rollLeaveDrops[colPos][idx];
            this.rollLeaveDrops[colPos].splice(idx, 1);
        }
        else {
            if (TG_Stage.DropModels.length <= 0) {
                //老数据
                var DropModel = 0;
                if (TG_Stage.DropModel == false) {
                    DropModel = 0;
                }
                else {
                    DropModel = 1;
                }
                for (var i = 0; i < 9; i++) {
                    DropModels.push(DropModel);
                }
            }
            else {
                //新数据
                DropModels = TG_Stage.DropModels;
            }
            //顺序掉落
            if (DropModels[colPos] == 1) {
                var cursor = this.dropCursor[colPos];
                id = TG_Stage.DropBlocks[colPos].DropIds[cursor];
                cursor = cursor + 1 >= TG_Stage.DropBlocks[colPos].DropIds.length ? 0 : cursor + 1;
                this.dropCursor[colPos] = cursor;
            }
            else {
                var len = TG_Stage.DropBlocks[colPos].DropIds.length;
                var random = Math.floor(Math.random() * len);
                id = TG_Stage.DropBlocks[colPos].DropIds[random];
            }
        }
        var newId = LoadNetworkImageUtils.getRandom_LayerId(id);
        var newItem = GamePanel_ItemSp.getInstance().createNewRect(newId, rowPos, colPos);
        newItem.setItemNone(false);
        var index = TG_Game.getInstance().GetIndexByPos(rowPos, colPos);
        TG_Game.Items[index] = newItem;
        this.createList.push(newItem);
        return newItem;
    };
    /*本次掉落表演的时间*/
    TG_Game.prototype.SetDropDelay = function (delay) {
        if (delay > TG_Game.MaxdropDelay) {
            TG_Game.MaxdropDelay = delay;
        }
    };
    /*掉落完毕*/
    TG_Game.prototype.onDropBack = function () {
        //客户端
        Log.getInstance().trace(" 本回合全部掉落完毕。。。。。");
        TG_Game.MaxdropDelay = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        this.createList = [];
        // this.downGroupsLastPoint=null;
        // 重置元素移动状态
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            // 重置元素移动状态
            temp.SetMoveItem(false);
            temp.SetMarkedHor(0);
            temp.SetMarkedVel(0);
            temp.MarkedForExplodingCallfunc = false;
            temp.MarkedAlready = false;
            temp.ActionPaths = [];
            temp.DropPaths = [];
            temp.SetDetonate(false);
            temp.SetExploding(false);
        }
        //爆炸状态
        this._explosiveType = 0;
        this._aExItem = null;
        this._bExItem = null;
        //掉落数组清空
        this.downGroups = [];
        if (this.birds.length > 0) {
            this.doCheckBirds();
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BirdFlyTime) + TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, function () {
                this.birdIndex = 0;
                this.birds = [];
                this.doDrop();
            }.bind(this), this);
            return;
        }
        //检测二次爆炸
        if (this.isCanSecondBooms()) {
            //可以二次爆炸
            this.doCheckSecondBooms();
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, this.doDrop, this);
        }
        else if (this.isBulletExplode) {
            //如果是黑洞与其他特效块交换 子弹特效
            this.BulletMoveCallbackExplode();
        }
        else {
            this.doCheckMoved();
        }
    };
    TG_Game.prototype.changeDoMove = function (isSetCanUse) {
        if (isSetCanUse === void 0) { isSetCanUse = true; }
        TG_Game.IsPlayerDoMove = isSetCanUse; //玩家手动操作
        TG_Game.IsPlayerDoMoveByEgg = isSetCanUse; //玩家手动操作可以触发鸡蛋块爆炸
        TG_Game.IsPlayerDoMoveForHasPea1 = isSetCanUse; //月饼坑
        TG_Game.IsPlayerDoMoveForHasPea2 = isSetCanUse; //月饼坑
        TG_Game.IsPlayerDoMoveForFlowIceLogic = isSetCanUse; //流沙
        TG_Game.IsPlayerDoMoveForVenomInfect = isSetCanUse; //小恶魔
        TG_Game.IsPlayerDoMoveForChangeColorBlock = isSetCanUse; //变色块
        TG_Game.IsPlayerDoMoveForHairBallMove = isSetCanUse; //毛球
        TG_Game.IsPlayerDoMoveForBelts = isSetCanUse; // 传送带逻辑
    };
    TG_Game.prototype.doCheckMoved = function () {
        //如果游戏开始的掉落
        if (TG_Game.IsBeginPanelStartDrop) {
            TG_Game.IsBeginPanelStartDrop = false;
            if (!TG_Stage.SingelModel) {
                //pk模式
                if (this.m_Status == GameStatus.GS_ARound) {
                    this.gamePop(PopupType.Pop_MyTurn, true);
                }
                else {
                    this.gamePop(PopupType.Pop_EnemyTurn, true);
                    App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
                }
                //启动单回合的20s倒计时
                App.MessageCenter.dispatch(Msg.Event.RoundTime);
            }
            else {
                //棋盘是否需要打乱
                var hasEx = this.doRandomExchangeAllItem();
                if (typeof (hasEx) == "boolean") {
                    //启动棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
                }
                Log.getInstance().trace("游戏开始的掉落___是否需要打乱棋盘______" + hasEx);
            }
            this.combo = 0;
            return;
        }
        if (this.doRemove()) {
            Log.getInstance().trace("可以消除...............................");
            if (this.m_FisrtMarkRemove) {
                this.m_FisrtMarkRemove = false;
                this.doCheckPlayerPkLink();
            }
            var delayTime = TG_Game.MaxdropDelay;
            if (this.doCheckMoveSetTimeOut) {
                clearTimeout(this.doCheckMoveSetTimeOut);
            }
            this.doCheckMoveSetTimeOut = setTimeout(function () {
                clearTimeout(this.doCheckMoveSetTimeOut);
                this.doDrop();
            }.bind(this), delayTime);
        }
        else {
            //异步块爆炸
            if (this.doAsyncExplode()) {
                this.SpecialExplodeTriangleDelay = 8 * TG_TimeDefine.MagicStoneDifferenceInterval + TG_TimeDefine.NormalBomoDelay;
                if (this.SpecialExplodeTriangleSetTimeOut) {
                    clearTimeout(this.SpecialExplodeTriangleSetTimeOut);
                }
                this.SpecialExplodeTriangleSetTimeOut = setTimeout(function () {
                    clearTimeout(this.SpecialExplodeTriangleSetTimeOut);
                    this.doDrop();
                }.bind(this), this.SpecialExplodeTriangleDelay);
                return;
            }
            if (TG_Game.IsPlayerDoMove) {
                if (TG_Game.IsPlayerDoMoveForHasPea1) {
                    TG_Game.IsPlayerDoMoveForHasPea1 = false;
                    // 月饼坑处理逻辑
                    var isHasPea = this.doWithPea();
                    if (isHasPea) {
                        App.TimerManager.doTimer(800, 1, this.doDrop, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForBelts) {
                    TG_Game.IsPlayerDoMoveForBelts = false;
                    var beltsMove = this.beltsMove();
                    if (beltsMove) {
                        App.TimerManager.doTimer(600, 1, this.doCheckMoved, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForHasPea2) {
                    TG_Game.IsPlayerDoMoveForHasPea2 = false; //月饼坑
                    // 月饼坑处理逻辑
                    var isHasPea = this.doWithPea();
                    if (isHasPea) {
                        App.TimerManager.doTimer(800, 1, this.doDrop, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForFlowIceLogic) {
                    TG_Game.IsPlayerDoMoveForFlowIceLogic = false;
                    var doFlowIceLogic = this.doFlowIceLogic(); //执行开始流沙
                    if (doFlowIceLogic > 0) {
                        App.TimerManager.doTimer(700, 1, this.doCheckMoved, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForVenomInfect) {
                    TG_Game.IsPlayerDoMoveForVenomInfect = false;
                    var VenomInfect = this.VenomInfect(); //执行恶魔传染逻辑
                    if (VenomInfect) {
                        App.TimerManager.doTimer(1000, 1, this.doCheckMoved, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForChangeColorBlock) {
                    TG_Game.IsPlayerDoMoveForChangeColorBlock = false;
                    var changeColorBlock = this.changeColorBlock(); //执行变色块逻辑
                    if (changeColorBlock) {
                        App.TimerManager.doTimer(200, 1, this.doCheckMoved, this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForHairBallMove) {
                    TG_Game.IsPlayerDoMoveForHairBallMove = false;
                    var hairBallMove = this.hairBallMove();
                    if (hairBallMove) {
                        App.TimerManager.doTimer(350, 1, this.updateHairBall, this);
                        return;
                    }
                }
                //重置魔法石的爆炸次数
                for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.IsItemMagicStone()) {
                        Log.getInstance().trace("=====================魔法石爆炸次数重置==============================");
                        Log.getInstance().trace(item.SitePos, 0);
                        item.ExplodeCount = 0;
                    }
                }
                TG_Game.IsPlayerDoMove = false; //是否玩家移动
                TG_Game.IsPlayerDoMoveForHasPea1 = false; //月饼坑
                TG_Game.IsPlayerDoMoveForHasPea2 = false; //月饼坑
                TG_Game.IsPlayerDoMoveForFlowIceLogic = false; //流沙
                TG_Game.IsPlayerDoMoveForVenomInfect = false; //小恶魔
                TG_Game.IsPlayerDoMoveForChangeColorBlock = false; //变色块
                TG_Game.IsPlayerDoMoveForHairBallMove = false; //毛球
                TG_Game.IsPlayerDoMoveForBelts = false; //传送带
            }
            Log.getInstance().trace("暂时没有可消除的方块,等待下次客户端操作...");
            // 检测棋盘滚动
            this.doCheckMove_FinishRound();
            this.refreshStage();
            // 执行黑色毛球爆破
            this.doblackHairBallEx();
        }
    };
    /**
     * 获取传送带移动列表
     *
     */
    TG_Game.prototype.getBeltsMoveLst = function () {
        // console.info("传送带移动...")
        var beltsLst = TG_Stage.Belts;
        // 定义入口数组用于标记是否使用过该数据
        var indexArr = [];
        for (var oneBeltsIndex in beltsLst) {
            // console.info("当前下标为:"+oneBeltsIndex);
            var oneBelts = beltsLst[oneBeltsIndex];
            var bodies = oneBelts["Bodies"];
            var enterId = oneBelts["EnterId"];
            var exitId = oneBelts["ExitId"];
            if (enterId == -1 && exitId == -1) {
                indexArr.push(oneBeltsIndex);
                var oneBodiesLst = [];
                oneBodiesLst.push(bodies);
                // for (let oneBodiesIndex in bodies) {
                //     let oneBodies = bodies[oneBodiesIndex];
                //     oneBodiesLst.push(oneBodies);
                // }
                TG_Game.BeltsIndexLst.push(oneBodiesLst);
                continue;
            }
            if (enterId != -1 && exitId != -1) {
                if (TsList.contains(indexArr, oneBeltsIndex)) {
                    continue;
                }
                if (!TsList.contains(indexArr, oneBeltsIndex)) {
                    if (enterId == exitId) {
                        indexArr.push(oneBeltsIndex);
                        var oneBodiesLst = [];
                        oneBodiesLst.push(bodies);
                        // for (let oneBodiesIndex in bodies) {
                        //     let oneBodies = bodies[oneBodiesIndex];
                        //     oneBodiesLst.push(oneBodies);
                        // }
                        TG_Game.BeltsIndexLst.push(oneBodiesLst);
                        continue;
                    }
                    if (enterId != exitId) {
                        indexArr.push(oneBeltsIndex);
                        var oneBodiesLst = [];
                        oneBodiesLst.push(bodies);
                        // for (let oneBodiesIndex in bodies) {
                        //     let oneBodies = bodies[oneBodiesIndex];
                        //     oneBodiesLst.push(oneBodies);
                        // }
                        oneBodiesLst = this.getOtherExitIdByEnterId(indexArr, enterId, exitId, beltsLst, oneBodiesLst);
                        TG_Game.BeltsIndexLst.push(oneBodiesLst);
                        continue;
                    }
                }
            }
        }
        return TG_Game.BeltsIndexLst;
    };
    /**
     * 传送带移动
     */
    TG_Game.prototype.beltsMove = function () {
        var beltsIndexLst = this.getBeltsMoveLst();
        // console.info(beltsIndexLst);
        for (var oneLstIndex in beltsIndexLst) {
            var oneLst = beltsIndexLst[oneLstIndex];
            // 是否形成环
            var isCircle = this.getIsCircle(oneLst);
            this.beltsMoveBlockAnimate(oneLst, isCircle);
        }
        return beltsIndexLst.length > 0;
    };
    /**
     * 是否能形成环形传送带
     */
    TG_Game.prototype.getIsCircle = function (oneLst) {
        if (oneLst.length == 1) {
            var firstIndex = oneLst[0][0];
            var lastIndex = oneLst[0][oneLst[0].length - 1];
            var belts = TG_Stage.Belts;
            for (var beltsIndex in belts) {
                var oneBelts = belts[beltsIndex];
                var bodies = oneBelts["Bodies"];
                var enterId = oneBelts["EnterId"];
                var exitId = oneBelts["ExitId"];
                var firstBodies = bodies[0];
                var lastBodies = bodies[bodies.length - 1];
                if (firstBodies == firstIndex && lastBodies == lastIndex) {
                    if (enterId == -1 && exitId == -1) {
                        return true;
                    }
                }
            }
            return false;
        }
        // if (oneLst.length > 1 || oneLst.length == 0) {
        //     return false;
        // }
        return false;
    };
    /**
     * 传送带上物体移动
     * @param oneLst
     */
    TG_Game.prototype.beltsMoveBlockAnimate = function (oneLst, isCircle) {
        // 传送带上移动地板层(第一层)
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Buttons, GamePanel_ItemSp.getInstance().ButtonsSp, 1);
        // 传送带上移动毛毛虫层（第二层）
        // 传送带上移动冰层数据（第三层）
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Ices, GamePanel_ItemSp.getInstance().IcesSp, 3);
        // 传送带上移动宝石层(包含毛球) （第四层)
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Items, GamePanel_ItemSp.getInstance().ItemsSp, 4);
        // 传送带上移动网格层 铁丝网 （第五层)
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Meshs, GamePanel_ItemSp.getInstance().MeshsSp, 5);
        //传送带上移动栏杆层数据 (第六层)
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Railings, GamePanel_ItemSp.getInstance().RailingsSp, 6);
        // 传送带上移动云层数据(第八层)
        this.beltsMoveBlockAnimateByGameItem(oneLst, isCircle, TG_Game.Clouds, GamePanel_ItemSp.getInstance().CloudsSp, 8);
        // 传送带上移动皇冠层(第九层)
        // this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.PeaLst,GamePanel_ItemSp.getInstance().PeaSp,9);
    };
    // public currVar ;
    /**
     * 各层块动画表现移动
     * @param oneLst
     * @param isCircle
     * @param item
     */
    TG_Game.prototype.beltsMoveBlockAnimateByGameItem = function (oneLst, isCircle, item, viewSp, layer) {
        // console.info("传送带移动方块函数执行");
        // console.info(oneLst);
        // console.info("移动四层块...");
        // let testData = [22, 23, 24, 33, 42, 51, 50, 49, 40, 31];
        if (isCircle) {
            var circleLst = oneLst[0];
            var tween = void 0;
            var _loop_1 = function (i) {
                var curr = oneLst[0][i];
                // this.currVar = curr;
                var currItem = item[curr];
                var currRow = Math.floor(curr / 9);
                var currCol = curr % 9;
                var currPos = currItem.getPosByRowCol(currRow, currCol);
                var next = i == oneLst[0].length - 1 ? oneLst[0][0] : oneLst[0][i + 1];
                var nextItem = item[next];
                var nextRow = Math.floor(next / 9);
                var nextCol = next % 9;
                var nextPos = nextItem.getPosByRowCol(nextRow, nextCol);
                tween = egret.Tween.get(currItem);
                // TG_Game.currentState = 2;
                tween.to({ x: nextPos.x, y: nextPos.y }, 300);
                tween.call(function (circleLst, i, length) {
                    egret.Tween.removeTweens(currItem);
                    if (i == 0) {
                        this.changeBlockByCircle(oneLst[0], item);
                    }
                }, this_1, [circleLst, i, circleLst.length]);
            };
            var this_1 = this;
            for (var i = 0; i < oneLst[0].length; i++) {
                _loop_1(i);
            }
        }
        else {
            for (var i = 0; i < oneLst.length; i++) {
                var _loop_2 = function (j) {
                    // 是每节传送带的第一个元素
                    var isBeltsFirst = false;
                    // 是每节传送带的最后一个元素
                    var isBeltsLast = false;
                    var curr = oneLst[i][j];
                    var currItem = item[curr];
                    var currRow = Math.floor(curr / 9);
                    var currCol = curr % 9;
                    var currPos = currItem.getPosByRowCol(currRow, currCol);
                    // 如果当前位置是第一个则需要创建遮罩
                    if (j == 0) {
                        // 是否是第一个元素
                        isBeltsFirst = true;
                    }
                    if (j == oneLst[i].length - 1) {
                        isBeltsLast = true;
                        currItem.createShape(viewSp, currPos.y, currPos.x);
                    }
                    var next = void 0;
                    if (i != oneLst.length - 1) {
                        if (j == oneLst[i].length - 1) {
                            next = oneLst[i + 1][0];
                        }
                        else {
                            next = oneLst[i][j + 1];
                        }
                    }
                    else {
                        if (j == oneLst[i].length - 1) {
                            next = oneLst[0][0];
                        }
                        else {
                            next = oneLst[i][j + 1];
                        }
                    }
                    var nextItem = item[next];
                    var nextRow = Math.floor(next / 9);
                    var nextCol = next % 9;
                    var nextPos = nextItem.getPosByRowCol(nextRow, nextCol);
                    var moveToPos = void 0;
                    // 每节传送带第一个能用到
                    var fromPos = void 0;
                    if (j == oneLst[i].length - 1) {
                        moveToPos = this_2.getMoveToPosByPreAndCurrPos(oneLst[i][j - 1], oneLst[i][j], item);
                    }
                    else {
                        moveToPos = nextPos;
                    }
                    // let fromRowCol;
                    // if (j == 0) {
                    //     fromPos = this.getMoveFromPosByCurrPosAndNextPos(oneLst[i][j],oneLst[i][j+1],item);
                    //     // console.info(fromPos)
                    // }
                    // else {
                    //     let pre = oneLst[i][j-1];
                    //     // let preItem:TG_Item = item[pre];
                    //     let preRow = Math.floor(pre/9);
                    //     let preCol = pre % 9;
                    //     let prePos = nextItem.getPosByRowCol(preRow,preCol);
                    //     // fromPos = prePos;
                    //     // console.info(fromPos);
                    // }
                    // if (j == 0) {
                    // let pre = i == 0 ? oneLst[oneLst.length - 1][oneLst[oneLst.length - 1].length -1]:oneLst[i-1][oneLst[i-1].length -1];
                    // let preItem:TG_Item = item[pre];
                    // console.info("=======================99999999999999==============================");
                    // console.info(TG_Game.Items);
                    // console.info(fromPos);
                    // let preObj = this.CreateBlocks(preItem.BlockId,preItem.venonatId,fromPos.row,fromPos.col,item,viewSp,layer);
                    // // preObj.createShape(viewSp,currPos.y,currPos.x);
                    // // console.info(TG_Game.Items);
                    // let firstTween = egret.Tween.get(preObj);
                    // firstTween.to({x:fromPos.x ,y: fromPos.y},0);
                    // firstTween.to({x:currPos.x ,y: currPos.y},300);
                    // firstTween.call( function(preObj) {
                    //     egret.Tween.removeTweens(preObj);
                    //     preObj.removeShape(viewSp);
                    //     App.DisplayUtils.removeFromParent(preObj);
                    // },this,[preObj]);
                    // }
                    var tween = egret.Tween.get(currItem);
                    tween.to({ x: moveToPos.x, y: moveToPos.y }, 300);
                    tween.call(function (oneLst, i, j) {
                        egret.Tween.removeTweens(currItem);
                        if (i == 0 && j == 0) {
                            this.changeBlockByLine(oneLst, item);
                        }
                        if (j == oneLst[i].length - 1) {
                            currItem.removeShape(viewSp);
                        }
                    }, this_2, [oneLst, i, j]);
                };
                var this_2 = this;
                for (var j = 0; j < oneLst[i].length; j++) {
                    _loop_2(j);
                }
            }
        }
    };
    /**
     *创建方块
     *
     * @constructor
     */
    TG_Game.prototype.CreateBlocks = function (layerId, venonatId, row, col, item, viewSp, layer) {
        var EffectType = TG_Blocks.GetEffectByLayerid(layerId);
        var obj;
        if (layer == 1) {
            obj = TG_CreateItem.CreateButton(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 3) {
            obj = TG_CreateItem.CreateIces(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 4) {
            obj = TG_CreateItem.CreateItems(layerId, venonatId, row, col, EffectType);
            viewSp.addChild(obj);
        }
        if (layer == 5) {
            obj = TG_CreateItem.CreateMeshs(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 6) {
            obj = TG_CreateItem.CreateRailings(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 8) {
            obj = TG_CreateItem.CreateClouds(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 9) {
            obj = TG_CreateItem.CreatePea(layerId, row, col);
            viewSp.addChild(obj);
        }
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var index = TG_Game.getInstance().GetIndexByPos(row, col);
        obj.setItemNone(false);
        item[index] = obj;
        TG_Game.getInstance().createList.push(obj);
        var pos = obj.getPosByRowCol(col, row);
        obj.x = pos.x;
        obj.y = pos.y;
        return obj;
    };
    TG_Game.prototype.changeBlockByLine = function (list, item) {
        var oneLst = [];
        for (var i = 0; i < list.length; i++) {
            var twoLst = [];
            for (var j = 0; j < list[i].length; j++) {
                twoLst.push(item[list[i][j]]);
            }
            oneLst.push(twoLst);
        }
        // console.info(oneLst);
        for (var i = 0; i < oneLst.length; i++) {
            var currLst = oneLst[i];
            var lastItem = currLst[currLst.length - 1];
            currLst.splice(currLst.length - 1, 1);
            var nextLst = i == list.length - 1 ? oneLst[0] : oneLst[i + 1];
            nextLst.unshift(lastItem);
            oneLst[i] = currLst;
            if (i == list.length - 1) {
                oneLst[0] = nextLst;
            }
            else {
                oneLst[i + 1] = nextLst;
            }
        }
        // console.info(oneLst);
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].length; j++) {
                var one = list[i][j];
                oneLst[i][j].SitePos.X = one % 9;
                oneLst[i][j].SitePos.Y = Math.floor(one / 9);
                var pos = oneLst[i][j].getPosByRowCol(oneLst[i][j].SitePos.Y, oneLst[i][j].SitePos.X);
                oneLst[i][j].x = pos.x;
                oneLst[i][j].y = pos.y;
                item[one] = oneLst[i][j];
                this.changItemTxt(item[one], item);
            }
        }
    };
    TG_Game.prototype.changeBlockByCircle = function (list, item) {
        var itemLst = [];
        for (var oneIndex in list) {
            var one = list[oneIndex];
            itemLst.push(item[one]);
        }
        var lastItem = itemLst[itemLst.length - 1];
        itemLst.splice(itemLst.length - 1, 1, itemLst);
        itemLst.unshift(lastItem);
        for (var oneIndex in list) {
            var one = list[oneIndex];
            itemLst[oneIndex].SitePos.X = one % 9;
            itemLst[oneIndex].SitePos.Y = Math.floor(one / 9);
            var pos = itemLst[oneIndex].getPosByRowCol(itemLst[oneIndex].SitePos.Y, itemLst[oneIndex].SitePos.X);
            itemLst[oneIndex].x = pos.x;
            itemLst[oneIndex].y = pos.y;
            item[one] = itemLst[oneIndex];
            this.changItemTxt(item[one], item);
        }
    };
    TG_Game.prototype.getMoveFromPosByCurrPosAndNextPos = function (currIndex, nextIndex, item) {
        var nextItem = item[nextIndex];
        var nextRow = Math.floor(nextIndex / 9);
        var nextCol = nextIndex % 9;
        var nextPos = nextItem.getPosByRowCol(nextRow, nextCol);
        var currItem = item[currIndex];
        var currRow = Math.floor(currIndex / 9);
        var currCol = currIndex % 9;
        var currPos = currItem.getPosByRowCol(currRow, currCol);
        var prePos = { x: 0, y: 0, row: 0, col: 0 };
        if (nextPos.x == currPos.x) {
            prePos.x = currPos.x;
            prePos.col = currCol;
            prePos.y = currPos.y + (currPos.y - nextPos.y);
            prePos.row = currRow + (currRow - nextRow);
        }
        if (nextPos.y == currPos.y) {
            prePos.y = currPos.y;
            prePos.row = currRow;
            prePos.x = currPos.x + (currPos.x - nextPos.x);
            prePos.col = currCol + currCol - nextCol;
        }
        return prePos;
    };
    TG_Game.prototype.getMoveToPosByPreAndCurrPos = function (preIndex, currIndex, item) {
        var preItem = item[preIndex];
        var preRow = Math.floor(preIndex / 9);
        var preCol = preIndex % 9;
        var prePos = preItem.getPosByRowCol(preRow, preCol);
        var currItem = item[currIndex];
        var currRow = Math.floor(currIndex / 9);
        var currCol = currIndex % 9;
        var currPos = currItem.getPosByRowCol(currRow, currCol);
        var nextPos = { x: 0, y: 0, row: 0, col: 0 };
        if (prePos.x == currPos.x) {
            nextPos.x = currPos.x;
            nextPos.col = currCol;
            nextPos.y = currPos.y + (currPos.y - prePos.y);
            nextPos.row = currRow + currRow - preRow;
        }
        if (prePos.y == currPos.y) {
            nextPos.y = currPos.y;
            nextPos.row = currRow;
            nextPos.x = currPos.x + (currPos.x - prePos.x);
            nextPos.col = currCol + currCol - preCol;
        }
        return nextPos;
    };
    /**
     * 通过这个获取传送带链中所有连接在一起的下标
     */
    TG_Game.prototype.getOtherExitIdByEnterId = function (indexArr, enterId, exitId, beltsLst, oneBodiesLst) {
        for (var oneBeltsIndex in beltsLst) {
            var oneNewBelts = beltsLst[oneBeltsIndex];
            var newBodies = oneNewBelts["Bodies"];
            var newEnterId = oneNewBelts["EnterId"];
            var newExitId = oneNewBelts["ExitId"];
            if (enterId != -1 && exitId != -1 && enterId == newExitId) {
                if (!TsList.contains(indexArr, oneBeltsIndex)) {
                    indexArr.push(oneBeltsIndex);
                    oneBodiesLst.push(newBodies);
                    // for (let oneBodiesIndex in newBodies) {
                    //     let oneNewBodies = newBodies[oneBodiesIndex];
                    //     oneBodiesLst.push(oneNewBodies);
                    // }
                    oneBodiesLst = this.getOtherExitIdByEnterId(indexArr, newEnterId, newExitId, beltsLst, oneBodiesLst);
                    continue;
                }
                else if (TsList.contains(indexArr, oneBeltsIndex)) {
                    break;
                    // return oneBodiesLst;
                }
            }
        }
        // 传送带逻辑错误,返回空数组。数据错误
        return oneBodiesLst;
    };
    /**
     * 处理月饼坑逻辑业务
     */
    TG_Game.prototype.doWithPea = function () {
        var peaLst = this.checkPea();
        // 移除皇冠
        for (var i = 0; i < peaLst.length; i++) {
            var onePea = peaLst[i];
            this.ItemFlyToGoal(onePea);
            this.AddScore(ScoreType.ST_ExplodePea);
            var index = this.GetIndexByPos(onePea.SitePos.Y, onePea.SitePos.X);
            GamePanel_ItemSp.getInstance().clearRect(index, TG_Game.Items);
        }
        // this.doDrop();
        return peaLst.length > 0;
    };
    /**
     * 检查月饼坑
     *
     */
    TG_Game.prototype.checkPea = function () {
        // 获取所有的可以被收集的月饼
        var peaLst = [];
        var items = TG_Game.Items;
        for (var i = 0; i < items.length; i++) {
            var oneItems = items[i];
            if (!oneItems.getItemNone() && oneItems.itemType == ItemType.TG_ITEM_TYPE_PEA && this.hasPeaButton(oneItems)) {
                peaLst.push(oneItems);
            }
        }
        return peaLst;
    };
    /**
     * 判断该块下得地板层是否有豌豆坑
     * @param oneItems
     */
    TG_Game.prototype.hasPeaButton = function (oneItems) {
        var sitPos = oneItems.GetSitPos();
        var itemIndex = this.GetIndexByPos(sitPos.Y, sitPos.X);
        var peaItem = this.GetPeaItemByIndex(itemIndex);
        if (peaItem.BlockId == 1006) {
            return true;
        }
        else {
            return false;
        }
    };
    /*异步块爆炸*/
    TG_Game.prototype.doAsyncExplode = function () {
        var asynsItems = [];
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            if (temp.IsAsyncExplode) {
                asynsItems.push(temp);
            }
        }
        if (asynsItems.length <= 0)
            return false;
        for (var _b = 0, asynsItems_1 = asynsItems; _b < asynsItems_1.length; _b++) {
            var item = asynsItems_1[_b];
            item.DoAsyncExplode();
        }
        return true;
    };
    /**
     * 执行黑色毛球爆破
     */
    TG_Game.prototype.doblackHairBallEx = function (arr) {
        if (arr === void 0) { arr = null; }
        //先执行黑色毛球爆破
        var hairBallLst;
        if (arr)
            hairBallLst = arr;
        else
            hairBallLst = this.calculationHairBallPos();
        for (var i = 0; i < hairBallLst.length; i++) {
            var hairBallPos = hairBallLst[i];
            var item = hairBallPos.item;
            if (item.venonatId == 7002 && item.GetDetonate2()) {
                item.DoExplodeHairBall();
            }
            item.SetDetonate2(false);
        }
    };
    TG_Game.prototype.hairBallMove = function () {
        var isCanHairBallMove = false;
        //先执行黑色毛球爆破
        this.hairBallLst = this.calculationHairBallPos();
        // console.info("=================执行毛球移动逻辑============================");
        if (this.hairBallLst.length > 0) {
            //有可移动的毛球
            TG_Game.currentHairState = 2;
            isCanHairBallMove = true;
        }
        for (var i = 0; i < this.hairBallLst.length; i++) {
            var hairBallPos = this.hairBallLst[i];
            var item = hairBallPos.item;
            var hair = hairBallPos.hairBall;
            if (item.venonatId == 7002 && item.GetDetonate2()) {
                continue;
            }
            try {
                App.DisplayUtils.removeFromParent(hair);
            }
            catch (e) {
                Log.getInstance().trace("error:" + e);
            }
            hair.x = item.x - hair.width / 2;
            hair.y = item.y - hair.height / 2;
            GamePanel_ItemSp.getInstance().AnimationLayer.addChild(hair);
            var pos = item.getPosByRowCol(hairBallPos.new_y, hairBallPos.new_x);
            var tween = egret.Tween.get(hair);
            tween.to({ x: pos.x - hair.width / 2, y: pos.y - hair.height / 2 }, 300);
            tween.call(function (hair1, item1, hairBallPos1) {
                egret.Tween.removeTweens(hair1);
                App.DisplayUtils.removeFromParent(hair1);
            }, this, [hair, item, hairBallPos]);
        }
        return isCanHairBallMove;
    };
    TG_Game.prototype.updateHairBall = function () {
        for (var i = 0; i < this.hairBallLst.length; i++) {
            var hairBallPos = this.hairBallLst[i];
            var item = hairBallPos.item;
            if (item.venonatId == 7002 && item.GetDetonate2()) {
                continue;
            }
            item.SetIsCanAroundDetonate(false);
            var toItem = TG_Game.Items[hairBallPos.new_y * TG_Game.getInstance().ColNum + hairBallPos.new_x];
            if (item.venonatId == 7001) {
                toItem.SetIsCanAroundDetonate(true);
            }
            var hair = hairBallPos.hairBall;
            hair.x = 0;
            hair.y = 0;
            var venonatId = item.venonatId;
            item.venonatId = 0; //取消毛球
            item.isMove = true;
            toItem.venonatId = venonatId;
            toItem.isMove = false;
            toItem.addHairBall(hair);
        }
        this.doblackHairBallEx(this.hairBallLst);
        TG_Game.currentHairState = 1;
        this.doCheckMoved();
    };
    /**
     * 计算毛球移动后位置坐标，并返回所有移动后的毛球位置坐标
     */
    TG_Game.prototype.calculationHairBallPos = function () {
        //棋盘中毛球列表
        var hairBallLst = [];
        // 取出所有的块
        var items = TG_Game.Items;
        var hairBallPos = null;
        for (var i in items) {
            var oneItem = items[i];
            // 判断是否有毛球
            if (oneItem.IsVenonat()) {
                hairBallPos = new HairBallPos();
                hairBallPos.old_y = oneItem.SitePos.Y;
                hairBallPos.old_x = oneItem.SitePos.X;
                // 判断毛球是否可以移动
                hairBallPos.new_y = oneItem.SitePos.Y;
                hairBallPos.new_x = oneItem.SitePos.X;
                hairBallPos.is_move = false;
                hairBallPos.is_update = false;
                hairBallPos.hairBall = oneItem.getHairBall();
                hairBallPos.item = oneItem;
                hairBallLst.push(hairBallPos);
            }
        }
        for (var oneHairBallIndex in hairBallLst) {
            var hairBallPos_1 = hairBallLst[oneHairBallIndex];
            var item = this.GetItemByIndex(this.GetIndexByPos(hairBallPos_1.old_y, hairBallPos_1.old_x));
            var num = this.canMoveVenonat(item, hairBallPos_1, hairBallLst);
            hairBallPos_1.is_update = true;
            if (num == 0) {
                //该毛球不能移动
                hairBallPos_1.is_move = false;
            }
            if (num == 1) {
                hairBallPos_1.new_y = hairBallPos_1.new_y - 1;
                hairBallPos_1.new_x = hairBallPos_1.new_x;
                hairBallPos_1.is_move = true;
            }
            if (num == 2) {
                hairBallPos_1.new_y = hairBallPos_1.new_y;
                hairBallPos_1.new_x = hairBallPos_1.new_x - 1;
                hairBallPos_1.is_move = true;
            }
            if (num == 3) {
                hairBallPos_1.new_y = hairBallPos_1.new_y;
                hairBallPos_1.new_x = hairBallPos_1.new_x + 1;
                hairBallPos_1.is_move = true;
            }
            if (num == 4) {
                hairBallPos_1.new_y = hairBallPos_1.new_y + 1;
                hairBallPos_1.new_x = hairBallPos_1.new_x;
                hairBallPos_1.is_move = true;
            }
        }
        return hairBallLst;
    };
    /**
     * 根据毛球位置计算新的毛球移动位置
     * @param Y
     * @param X
     */
    TG_Game.prototype.canMoveVenonat = function (oneItem, hairBallPos, hairBallLst) {
        // 获取毛球的上左右下的位置
        var topItemIndex = this.GetTopItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
        var letItemIndex = this.GetLeftItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
        var rightItemIndex = this.GetRightItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
        var bottomItemIndex = this.GetBottomItem(this.GetIndexByPos(oneItem.SitePos.Y, oneItem.SitePos.X));
        var topItem = this.GetItemByIndex(topItemIndex);
        var letItem = this.GetItemByIndex(letItemIndex);
        var rightItem = this.GetItemByIndex(rightItemIndex);
        var bottomItem = this.GetItemByIndex(bottomItemIndex);
        var moveItemArr = [1, 2, 3, 4];
        while (moveItemArr.length > 0) {
            var index = Math.floor(Math.random() * moveItemArr.length);
            var num = moveItemArr[index];
            if (num == 1) {
                if (this.moveToItem(topItem, topItemIndex, hairBallPos, hairBallLst)) {
                    return num;
                }
                else {
                    moveItemArr.splice(index, 1);
                    continue;
                }
            }
            if (num == 2) {
                if (this.moveToItem(letItem, letItemIndex, hairBallPos, hairBallLst)) {
                    return num;
                }
                else {
                    moveItemArr.splice(index, 1);
                    continue;
                }
            }
            if (num == 3) {
                if (this.moveToItem(rightItem, rightItemIndex, hairBallPos, hairBallLst)) {
                    return num;
                }
                else {
                    moveItemArr.splice(index, 1);
                    continue;
                }
            }
            if (num == 4) {
                if (this.moveToItem(bottomItem, bottomItemIndex, hairBallPos, hairBallLst)) {
                    return num;
                }
                else {
                    moveItemArr.splice(index, 1);
                    continue;
                }
            }
        }
        return 0;
    };
    TG_Game.prototype.moveToItem = function (oneItem, oneItemIndex, hairBallPos, hairBallLst) {
        if (oneItem && !oneItem.getItemNone() //
            && !oneItem.IsItemNull() //
            && (oneItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || oneItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT || oneItem.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) //
            && !this.CheckHasHighItemsNotHairBallItem(oneItemIndex) //
            && this.nohasVenonat(oneItem, hairBallPos, hairBallLst)) {
            return true;
        }
        else {
            return false;
        }
    };
    TG_Game.prototype.CheckHasHighItemsNotHairBallItem = function (index) {
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        //云层块
        var cloud = this.GetCloudItemByIndex(index);
        if (!cloud.getItemNone()) {
            return true;
        }
        //铁丝网块
        var mesh = this.GetMeshItemByIndex(index);
        if (!mesh.getItemNone()) {
            return true;
        }
        return false;
    };
    /**
     * 要移动到的坐标上如果没有毛球
     * @param oneItemIndex
     * @param hairBallPos
     * @param hairBallLst
     */
    TG_Game.prototype.nohasVenonat = function (oneItem, hairBallPos, hairBallLst) {
        // 该毛球的原始坐标位置 row col
        var old_y = hairBallPos.old_y;
        var old_x = hairBallPos.old_x;
        var oldIndex = this.GetIndexByPos(old_y, old_x);
        // 要移动到的坐标 oneItem
        var new_y = oneItem.SitePos.Y;
        var new_x = oneItem.SitePos.X;
        var newIndex = this.GetIndexByPos(new_y, new_x);
        if (oldIndex < 0 || oldIndex > this.RowNum * this.ColNum - 1) {
            return false;
        }
        if (newIndex < 0 || newIndex > this.RowNum * this.ColNum - 1) {
            return false;
        }
        if (oldIndex == newIndex) {
            return false;
        }
        for (var i in hairBallLst) {
            var oneHairBall = hairBallLst[i];
            if (oneHairBall.is_move) {
                if (new_y == oneHairBall.new_y && new_x == oneHairBall.new_x) {
                    return false;
                }
            }
            else {
                if (new_y == oneHairBall.old_y && new_x == oneHairBall.old_x) {
                    return false;
                }
            }
        }
        return true;
    };
    //临时刷新棋盘
    TG_Game.prototype.refreshStage = function () {
        var isNeedFresh = false; //默认不需要刷新
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            var posY = temp.getPosByRowCol(temp.SitePos.Y, temp.SitePos.X).y;
            var cY = temp.y;
            if (cY != posY) {
                //需要刷新
                isNeedFresh = true;
                break;
            }
        }
        if (isNeedFresh) {
            for (var _b = 0, _c = TG_Game.Items; _b < _c.length; _b++) {
                var temp = _c[_b];
                var pos = temp.getPosByRowCol(temp.SitePos.Y, temp.SitePos.X);
                temp.x = pos.x;
                temp.y = pos.y;
            }
        }
    };
    /*战斗中 检测滚动*/
    TG_Game.prototype.doCheckMove_FinishRound = function () {
        var hasRolling = this.doRollingLogic();
        if (hasRolling) {
            App.TimerManager.doTimer(this.rollingTime, 1, this.doDrop, this);
        }
        else {
            //回合完成
            this.DoFinishRound();
        }
    };
    //回合完成
    TG_Game.prototype.DoFinishRound = function () {
        // 重置掉落次数
        this.combo = 0;
        //判断游戏结束
        if (this.doCheckGameFinish()) {
            //游戏结束
            this.doFinishGame();
            return;
        }
        if (TG_Stage.SingelModel) {
            var hasEx = this.doRandomExchangeAllItem();
            if (typeof (hasEx) == "boolean") {
                //启动棋盘提示倒计时
                App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
            }
            this.m_Link = 0;
        }
        else {
            if (!this.isCombo) {
                //不是连击才切换回合
                this.doChangePlayer();
            }
            else {
                if (this.m_Status == GameStatus.GS_BRound) {
                    // Ai 可以继续行动
                    App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
                }
                else if (this.m_Status == GameStatus.GS_ARound) {
                    //我自己
                }
                //启动单回合的20s倒计时
                App.MessageCenter.dispatch(Msg.Event.RoundTime);
            }
            this.m_FirstLink = false;
            this.isCombo = false;
        }
    };
    /*是否有产生连击*/
    TG_Game.prototype.doCheckPlayerPkLink = function () {
        // 对战模式
        if (!TG_Stage.SingelModel) {
            // 是否连击
            if ((this.CheckPkLink())) {
                this.doPlayerCombo();
            }
        }
    };
    TG_Game.prototype.CheckPkLink = function () {
        if (!this.m_FirstLink) {
            return false;
        }
        if (TG_Stage.LinkNum <= -1) {
            return true;
        }
        return this.m_Link < TG_Stage.LinkNum;
    };
    TG_Game.prototype.doPlayerCombo = function () {
        this.m_Link++;
        this.isCombo = true;
        if (this.m_Status == GameStatus.GS_ARound) {
            this.gamePop(PopupType.Pop_MyAction);
        }
        else {
            this.gamePop(PopupType.Pop_EnemyAction);
        }
    };
    /*切换游戏回合*/
    TG_Game.prototype.doChangePlayer = function () {
        this.m_Link = 0;
        if (this.m_Status == GameStatus.GS_ARound) {
            this.m_Status = GameStatus.GS_BRound;
            if (this.BStepNum == 0) {
                this.m_Status = GameStatus.GS_ARound;
            }
            this.gamePop(PopupType.Pop_EnemyTurn, true);
            //启动Ai提示倒计时
            App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
        }
        else if (this.m_Status == GameStatus.GS_BRound) {
            this.m_Status = GameStatus.GS_ARound;
            if (this.AStepNum == 0) {
                this.m_Status == GameStatus.GS_BRound;
            }
            this.gamePop(PopupType.Pop_MyTurn, true);
        }
        Log.getInstance().trace("切换回合" + this.m_Status);
        //启动单回合的20s倒计时
        App.MessageCenter.dispatch(Msg.Event.RoundTime);
    };
    /*游戏中的浮框提示*/
    TG_Game.prototype.gamePop = function (type, bool) {
        if (bool === void 0) { bool = false; }
        App.TimerManager.remove(this.gamePop1, this);
        App.TimerManager.doTimer(200, 1, this.gamePop1, this, [type, bool]);
    };
    TG_Game.prototype.gamePop1 = function (type, bool) {
        if (this.doCheckGameFinish())
            return;
        Panel_PopupLayer.getInstance().myAlert(type, 2000);
        //派发切换小人的显示
        if (bool) {
            App.MessageCenter.dispatch(Msg.Event.ChaneRound, type);
        }
    };
    TG_Game.prototype.doRollingLogic = function () {
        this.rollingTime = 0;
        var singleRowRollTime = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay);
        //目标滚动
        if (this.doCheckRollTarget()) {
            this.rollingTime = singleRowRollTime * (this.realRollRow + 1);
            return true;
        }
        //自动滚动
        if (this.doCheckAutoRollTarget()) {
            this.rollingTime = singleRowRollTime * (this.realRollRow + 1);
            return true;
        }
        return false;
    };
    /*目标滚动*/
    TG_Game.prototype.doCheckRollTarget = function () {
        if (this.doCheckGameFinish())
            return false;
        var rollNum = 0;
        if (this.m_Status == GameStatus.GS_ARound) {
            // A的滚动目标
            var rollTargets = this.ARollTargets;
            var rollIndex = this.aRollIndex;
            var rollTarget = rollIndex >= rollTargets.length ? null : rollTargets[rollIndex];
            if (rollTarget != null && this.CheckFinish(rollTarget.Targets)) {
                this.aRollIndex = this.aRollIndex + 1;
                rollNum += rollTarget.RollNum;
            }
        }
        else if (this.m_Status == GameStatus.GS_BRound) {
            //B的滚动目标
            var rollTargets = this.BRollTargets;
            var rollIndex = this.bRollIndex;
            var rollTarget = rollIndex >= rollTargets.length ? null : rollTargets[rollIndex];
            if (rollTarget != null && this.CheckFinish(rollTarget.Targets)) {
                this.bRollIndex = this.bRollIndex + 1;
                rollNum += rollTarget.RollNum;
            }
        }
        if (rollNum > 0) {
            this.doRolling(rollNum);
            return true;
        }
        return false;
    };
    /*是否完成目标*/
    TG_Game.prototype.CheckFinish = function (targets) {
        var isFinish = false;
        for (var i in targets) {
            var temp = targets[i];
            var Num = temp.Num;
            var Cur = temp.Cur;
            // 无限模式
            if (Num < 0) {
                isFinish = false;
                break;
            }
            // 目标为0 扣除模式
            if (Num == 0) {
                if (Cur == 0) {
                    isFinish = true;
                }
                else {
                    isFinish = false;
                    break;
                }
            }
            // 正常模式
            if (Num > 0) {
                if (Cur >= Num) {
                    isFinish = true;
                }
                else {
                    isFinish = false;
                    break;
                }
            }
        }
        return isFinish;
    };
    /*自动滚动*/
    TG_Game.prototype.doCheckAutoRollTarget = function () {
        for (var i = 0; i < this.AutoRollTargets.length; i++) {
            var autoRollTarget = this.AutoRollTargets[i];
            var serchRow = autoRollTarget.SerchRow;
            if (serchRow > this.RowNum)
                return false;
            var res = true;
            for (var _i = 0, _a = autoRollTarget.Targets; _i < _a.length; _i++) {
                var target = _a[_i];
                for (var index = 0; index < serchRow * this.ColNum; index++) {
                    var button = TG_Game.Buttons[index];
                    if (button.BlockId == target.Target) {
                        res = false;
                        break;
                    }
                    var item = TG_Game.Items[index];
                    if (item.BlockId == target.Target) {
                        res = false;
                        break;
                    }
                    var mesh = TG_Game.Meshs[index];
                    if (mesh.BlockId == target.Target) {
                        res = false;
                        break;
                    }
                    var ice = TG_Game.Ices[index];
                    if (ice.BlockId == target.Target) {
                        res = false;
                        break;
                    }
                    var cloud = TG_Game.Clouds[index];
                    if (cloud.BlockId == target.Target) {
                        res = false;
                        break;
                    }
                }
                if (!res)
                    break;
            }
            if (res) {
                return this.doRolling(autoRollTarget.RollNum);
            }
        }
        return false;
    };
    TG_Game.prototype.doRolling = function (row) {
        Log.getInstance().trace("战斗中开始滚动:" + row + "行");
        //判断如果剩余行数不够滚动要求
        this.realRollRow = Math.min((TG_Stage.Blocks.length / this.ColNum) - this.curRollRow, row);
        this.realRollRow = Math.min(this.realRollRow, 9);
        if (this.realRollRow == 0) {
            return false;
        }
        this.cRollClearItems = [];
        //移除
        for (var i = 0; i < this.realRollRow * this.ColNum; i++) {
            var button = TG_Game.Buttons[0];
            TG_Game.Buttons.splice(0, 1);
            this.cRollClearItems.push(button);
            var item = TG_Game.Items[0];
            //添加滚动遗留掉落
            if (item != null && !item.getItemNone() && (item.IsNormal() || item.IsItemDisColor())) {
                this.rollLeaveDrops[item.SitePos.X].push(item.BlockId);
            }
            TG_Game.Items.splice(0, 1);
            this.cRollClearItems.push(item);
            var ice = TG_Game.Ices[0];
            TG_Game.Ices.splice(0, 1);
            this.cRollClearItems.push(ice);
            var mesh = TG_Game.Meshs[0];
            TG_Game.Meshs.splice(0, 1);
            this.cRollClearItems.push(mesh);
            var cloud = TG_Game.Clouds[0];
            TG_Game.Clouds.splice(0, 1);
            this.cRollClearItems.push(cloud);
            var railing = TG_Game.Railings[0];
            TG_Game.Railings.splice(0, 1);
            this.cRollClearItems.push(railing);
        }
        var singleRowRollTime = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay);
        App.TimerManager.doTimer(singleRowRollTime * this.realRollRow, 1, this.cRollClearItemsEvent, this);
        //创建
        for (var i = 0; i < this.realRollRow * this.ColNum; i++) {
            var index = i + this.curRollRow * this.ColNum;
            var block = TG_Stage.Blocks[index];
            var baseY = this.curRollRow - 9;
            var row_1 = 0, col = 0;
            row_1 = Math.floor(Number(index) / 9) - baseY;
            col = Number(index) % 9;
            var Id1 = block["Id1"];
            var Id2 = block["Id2"];
            var Id3 = block["Id3"];
            var Id4 = block["Id4"];
            var Id5 = block["Id5"];
            var Id6 = block["Id6"];
            var Id7 = block["Id7"];
            // 创建地板层(第一层)
            GamePanel_ItemSp.getInstance().CreateButton(Id1, row_1, col, index, true);
            // 创建毛毛虫层（第二层）
            //  GamePanel_ItemSp.getInstance().CreateCaterpillars(Id2,row,col,true);
            // 创建冰层数据（第三层）
            GamePanel_ItemSp.getInstance().CreateIces(Id3, row_1, col, true);
            // 创建宝石层(包含毛球) （第四层)
            GamePanel_ItemSp.getInstance().CreateItems(Id2, Id7, row_1, col, true);
            // 创建网格层 铁丝网 （第五层)
            GamePanel_ItemSp.getInstance().CreateMeshs(Id4, row_1, col, true);
            // 创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第六层)
            //  GamePanel_ItemSp.getInstance().CreateHairBall(Id2,Id7,row,col,true);
            // 创建栏杆层数据 (第六层)
            GamePanel_ItemSp.getInstance().CreateRailings(Id6, row_1, col, true);
            // 第七层 毛球层随方块一起创建
            //  GamePanel_ItemSp.getInstance().CreateHairBall(items,Id7,row,col,true);
            // 创建云层数据(第八层)
            GamePanel_ItemSp.getInstance().CreateClouds(Id5, row_1, col, true);
        }
        for (var j = 0; j < this.RowNum; j++) {
            //行
            for (var i = 0; i < this.ColNum; i++) {
                //列
                var index = this.GetIndexByPos(j, i);
                var button = TG_Game.Buttons[index];
                button.SetSitPos(i, j);
                var item = TG_Game.Items[index];
                item.SetSitPos(i, j);
                var ice = TG_Game.Ices[index];
                ice.SetSitPos(i, j);
                var mesh = TG_Game.Meshs[index];
                mesh.SetSitPos(i, j);
                var cloud = TG_Game.Clouds[index];
                cloud.SetSitPos(i, j);
                var railing = TG_Game.Railings[index];
                railing.SetSitPos(i, j);
            }
        }
        Log.getInstance().trace("棋盘真实滚动行数:___" + this.realRollRow);
        App.MessageCenter.dispatch(Msg.Event.BrowseRollUp, this.realRollRow);
        this.curRollRow = this.curRollRow + this.realRollRow;
        // 处置出生点坐标
        this.initBirthPos();
        return true;
    };
    /*移除本次滚动消失的元素块*/
    TG_Game.prototype.cRollClearItemsEvent = function () {
        for (var _i = 0, _a = this.cRollClearItems; _i < _a.length; _i++) {
            var temp = _a[_i];
            App.DisplayUtils.removeFromParent(temp);
            TG_Object.Release(temp);
        }
        this.cRollClearItems = [];
    };
    //判断游戏是否结束
    TG_Game.prototype.doCheckGameFinish = function () {
        if (this.DoCheckGameStatus() >= GameStatus.GS_AVictory) {
            TG_Game.SetGameState(false);
            return true;
        }
        else {
            TG_Game.SetGameState(true);
        }
        return false;
    };
    /*判断游戏状态*/
    TG_Game.prototype.DoCheckGameStatus = function () {
        if (this.m_Status == GameStatus.GS_AVictory || this.m_Status == GameStatus.GS_BVictory) {
            return this.m_Status;
        }
        //单人模式
        if (TG_Stage.SingelModel) {
            //任务目标
            if (this.CheckFinish(this.ATaskTargets)) {
                return GameStatus.GS_AVictory;
            }
            //失败条件1
            if (this.IsElementLimit1 && this.CheckFinish(this.ADefeatTaskTargets1)) {
                //单人收集模式永远获胜
                return this.RuleType == 0 ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
            }
            //失败条件2
            if (this.IsElementLimit2 && this.CheckFinish(this.ADefeatTaskTargets2)) {
                //单人收集模式永远获胜
                return this.RuleType == 0 ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
            }
            //条件限制 限制回合
            if (TG_Stage.IsConditionLimit && TG_Stage.IsStepLimit && this.AStepNum == 0 || this.cantRandomAllItem || this.infiniteDrop || this.advanceEnd) {
                //没有步数 无法打乱棋盘 无限掉落 收集模式无收集目标
                return this.RuleType == 0 ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
            }
            //条件限制 限制时间
            if (TG_Stage.IsConditionLimit && TG_Stage.IsTimeLimit && this.SurplusTime <= 0) {
                //收集模式
                if (TG_Stage.RuleType == 1) {
                    return GameStatus.GS_AVictory;
                }
                else {
                    if (this.CheckFinish(this.ATaskTargets)) {
                        return GameStatus.GS_AVictory;
                    }
                    else {
                        return GameStatus.GS_BVictory;
                    }
                }
            }
        }
        else {
            //A和B都完成 进行中
            if (this.CheckFinish(this.ATaskTargets) && this.CheckFinish(this.BTaskTargets)) {
                //得分高获胜
                if (TG_Stage.StageVictoryType == VictoryType.VT_ScoreOnTime) {
                    if (this.AScore == this.BScore) {
                        return this.isAFirst ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
                    }
                    return this.AScore > this.BScore ? GameStatus.GS_AVictory : GameStatus.GS_BVictory;
                }
                else {
                    //目标数量
                    var completeATarget = this.APlayerCompleteTaskNum();
                    var completeBTarget = this.BPlayerCompleteTaskNum();
                    if (completeATarget == completeBTarget) {
                        return this.isAFirst ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
                    }
                    return completeATarget > completeBTarget ? GameStatus.GS_AVictory : GameStatus.GS_BVictory;
                }
            }
            if (this.CheckFinish(this.ATaskTargets)) {
                return GameStatus.GS_AVictory;
            }
            if (this.CheckFinish(this.BTaskTargets)) {
                return GameStatus.GS_BVictory;
            }
            //失败条件1
            if (TG_Stage.IsElementLimit1) {
                if (this.CheckFinish(this.ADefeatTaskTargets1)) {
                    return GameStatus.GS_BVictory;
                }
                if (this.CheckFinish(this.BDefeatTaskTargets1)) {
                    return GameStatus.GS_AVictory;
                }
            }
            //失败条件2
            if (TG_Stage.IsElementLimit2) {
                if (this.CheckFinish(this.ADefeatTaskTargets2)) {
                    return GameStatus.GS_BVictory;
                }
                if (this.CheckFinish(this.BDefeatTaskTargets2)) {
                    return GameStatus.GS_AVictory;
                }
            }
            //条件限制 限制回合
            if ((TG_Stage.IsConditionLimit && TG_Stage.IsStepLimit && this.AStepNum == 0 && this.BStepNum == 0)
                || this.cantRandomAllItem || this.infiniteDrop || this.advanceEnd) {
                //得分高获胜
                if (TG_Stage.StageVictoryType == VictoryType.VT_ScoreOnTime) {
                    if (this.AScore == this.BScore) {
                        return this.isAFirst ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
                    }
                    return this.AScore > this.BScore ? GameStatus.GS_AVictory : GameStatus.GS_BVictory;
                }
                else {
                    var completeATarget = this.APlayerCompleteTaskNum();
                    var completeBTarget = this.BPlayerCompleteTaskNum();
                    if (completeATarget == completeBTarget) {
                        return this.isAFirst ? GameStatus.GS_BVictory : GameStatus.GS_AVictory;
                    }
                    return completeATarget > completeBTarget ? GameStatus.GS_AVictory : GameStatus.GS_BVictory;
                }
            }
        }
        //收集模式 没有收集目标了
        if (TG_Stage.RuleType == 1 && !this.CheckHasCollectTarget()) {
            this.advanceEnd = true;
            return this.DoCheckGameStatus();
        }
        return this.m_Status;
    };
    /*减少步数*/
    TG_Game.prototype.ReduceStep = function (num) {
        if (num === void 0) { num = 1; }
        if (this.m_Link > 0) {
            return;
        }
        if (!TG_Stage.IsTimeLimit) {
            var stepNum = 0;
            //A
            if (this.m_Status == GameStatus.GS_ARound) {
                if (TG_Stage.IsConditionLimit && TG_Stage.IsStepLimit && this.AStepNum > 0) {
                    this.AStepNum = Math.max(0, this.AStepNum - 1);
                    stepNum = this.AStepNum;
                }
                this.AUsedStepNum++;
            }
            //B
            if (this.m_Status == GameStatus.GS_BRound) {
                if (TG_Stage.IsConditionLimit && TG_Stage.IsStepLimit && this.BStepNum > 0) {
                    this.BStepNum = Math.max(0, this.BStepNum - 1);
                    stepNum = this.BStepNum;
                }
                this.BUsedStepNum++;
            }
            //页面刷新步数
            App.MessageCenter.dispatch(Msg.Event.refreshStepShow, this.m_Status, stepNum);
        }
        //使用道具次数
        this.usedToolTimes = 0;
        if (TG_Stage.SingelModel) {
            //能够交换，移除之前棋盘提示的倒计时
            App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
            TG_HintFunction.getInstance().removeItemMove();
        }
        if (!TG_Stage.SingelModel) {
            //停止切换回合倒计时
            App.MessageCenter.dispatch(Msg.Event.StopRoundTime);
        }
    };
    /*增加步数*/
    TG_Game.prototype.AddingStep = function (num) {
        var stepNum = 0;
        if (this.m_Status == GameStatus.GS_ARound) {
            this.AStepNum += num;
            stepNum = this.AStepNum;
        }
        if (this.m_Status == GameStatus.GS_BRound) {
            this.BStepNum += num;
            stepNum = this.BStepNum;
        }
        //刷新页面步数
        App.MessageCenter.dispatch(Msg.Event.refreshStepShow, this.m_Status, stepNum);
    };
    /*开始时间模式的时间倒计时*/
    TG_Game.prototype.doGameCutTime = function () {
        App.TimerManager.remove(this.ReduceTime, this);
        App.TimerManager.doTimer(1000, 0, this.ReduceTime, this);
    };
    /*增加时间*/
    TG_Game.prototype.AddingTime = function (num) {
        this.SurplusTime += num;
        //刷新时间显示
        App.MessageCenter.dispatch(Msg.Event.refreshTimeShow, this.SurplusTime);
    };
    /*减少时间*/
    TG_Game.prototype.ReduceTime = function (num) {
        if (num === void 0) { num = 1; }
        this.SurplusTime = Math.max(0, this.SurplusTime - 1);
        //刷新时间显示
        App.MessageCenter.dispatch(Msg.Event.refreshTimeShow, this.SurplusTime);
        if (this.SurplusTime <= 0) {
            App.TimerManager.remove(this.ReduceTime, this);
            //游戏结束
            this.doFinishGame();
        }
    };
    /*获取剩余游戏时间*/
    TG_Game.prototype.GetSurplusTime = function () {
        return this.SurplusTime;
    };
    /*获取游戏所用时间*/
    TG_Game.prototype.GetGameUsedTime = function () {
        return Math.max(this.TimeLimitLength - this.SurplusTime, 0);
    };
    /*获取A玩家完成的任务目标数量*/
    TG_Game.prototype.APlayerCompleteTaskNum = function () {
        var completeNum = 0;
        for (var _i = 0, _a = this.ATaskTargets; _i < _a.length; _i++) {
            var temp = _a[_i];
            completeNum += temp.Cur;
        }
        return completeNum;
    };
    /*获取B玩家完成的任务目标数量*/
    TG_Game.prototype.BPlayerCompleteTaskNum = function () {
        var completeNum = 0;
        for (var _i = 0, _a = this.BTaskTargets; _i < _a.length; _i++) {
            var temp = _a[_i];
            completeNum += temp.Cur;
        }
        return completeNum;
    };
    /*检测对局内是否还包含收集目标*/
    TG_Game.prototype.CheckHasCollectTarget = function () {
        if (TG_Stage.RuleType != 1) {
            return true;
        }
        if (this.CheckHasNotAdvanceEndBlock()) {
            return true;
        }
        for (var i = 0; i < this.ATaskTargets.length; i++) {
            var target = this.ATaskTargets[i];
            var targetId = target.Target;
            var fatherElements = TG_Entry.GetEntryFatherElements(targetId);
            for (var _i = 0, fatherElements_1 = fatherElements; _i < fatherElements_1.length; _i++) {
                var blockId = fatherElements_1[_i];
                var id = Number(blockId);
                if (this.CheckHasBlockIdInDrop(id)) {
                    return true;
                }
                if (this.CheckHasBlockIdInGame(id)) {
                    return true;
                }
                if (this.CheckHasBlockIdInRoll(id)) {
                    return true;
                }
            }
        }
        for (var i = 0; i < this.BTaskTargets.length; i++) {
            var target = this.BTaskTargets[i];
            var targetId = target.Target;
            var fatherElements = TG_Entry.GetEntryFatherElements(targetId);
            for (var _a = 0, fatherElements_2 = fatherElements; _a < fatherElements_2.length; _a++) {
                var blockId = fatherElements_2[_a];
                var id = Number(blockId);
                if (this.CheckHasBlockIdInDrop(id)) {
                    return true;
                }
                if (this.CheckHasBlockIdInGame(id)) {
                    return true;
                }
                if (this.CheckHasBlockIdInRoll(id)) {
                    return true;
                }
            }
        }
        return false;
    };
    /*检测掉落中是否存在*/
    TG_Game.prototype.CheckHasBlockIdInDrop = function (blockId) {
        for (var i = 0; i < this.ColNum; i++) {
            //滚动遗留中是否存在
            var rollLeaveDrops = this.rollLeaveDrops[i];
            for (var j = 0; j < rollLeaveDrops.length; j++) {
                if (rollLeaveDrops[j] == blockId) {
                    return true;
                }
            }
            //预设掉落中是否存在
            var DropBlocks = TG_Stage.DropBlocks[i];
            for (var k = 0; k < DropBlocks.DropIds.length; k++) {
                if (DropBlocks.DropIds[k] == blockId) {
                    return true;
                }
            }
        }
        return false;
    };
    /*检测棋盘中是否存在*/
    TG_Game.prototype.CheckHasBlockIdInGame = function (blockId) {
        for (var i = 0; i < TG_Game.Items.length; i++) {
            if (TG_Game.Items[i].GetBlockId() == blockId) {
                return true;
            }
        }
        for (var i = 0; i < TG_Game.Ices.length; i++) {
            if (TG_Game.Ices[i].GetBlockId() == blockId) {
                return true;
            }
        }
        for (var i = 0; i < TG_Game.Clouds.length; i++) {
            if (TG_Game.Clouds[i].GetBlockId() == blockId) {
                return true;
            }
        }
        for (var i = 0; i < TG_Game.Meshs.length; i++) {
            if (TG_Game.Meshs[i].GetBlockId() == blockId) {
                return true;
            }
        }
        for (var i = 0; i < TG_Game.Railings.length; i++) {
            if (TG_Game.Railings[i].GetBlockId() == blockId) {
                return true;
            }
        }
        return false;
    };
    /*检测滚动棋盘中是否存在*/
    TG_Game.prototype.CheckHasBlockIdInRoll = function (blockId) {
        for (var i = this.curRollRow * this.ColNum; i < TG_Stage.Blocks.length; i++) {
            var block = TG_Stage.Blocks[i];
            var Id1 = block["Id1"];
            var Id2 = block["Id2"];
            var Id3 = block["Id3"];
            var Id4 = block["Id4"];
            var Id5 = block["Id5"];
            var Id6 = block["Id6"];
            var Id7 = block["Id7"];
            if (Id1 == blockId) {
                return true;
            }
            if (Id2 == blockId) {
                return true;
            }
            if (Id3 == blockId) {
                return true;
            }
            if (Id4 == blockId) {
                return true;
            }
            if (Id5 == blockId) {
                return true;
            }
            if (Id6 == blockId) {
                return true;
            }
            if (Id7 == blockId) {
                return true;
            }
        }
        return false;
    };
    /*是否存在不提前结束的块*/
    TG_Game.prototype.CheckHasNotAdvanceEndBlock = function () {
        for (var i = 0; i < this.ATaskTargets.length; i++) {
            var target = this.ATaskTargets[i];
            var targetId = target.Target;
            var isAdvanceEnd = TG_Entry.GetEntryIsAdvanceEnd(targetId);
            if (isAdvanceEnd != null && isAdvanceEnd == 0) {
                return true;
            }
        }
        for (var i = 0; i < this.BTaskTargets.length; i++) {
            var target = this.BTaskTargets[i];
            var targetId = target.Target;
            var isAdvanceEnd = TG_Entry.GetEntryIsAdvanceEnd(targetId);
            if (isAdvanceEnd != null && isAdvanceEnd == 0) {
                return true;
            }
        }
        return false;
    };
    /*增加分数*/
    TG_Game.prototype.AddScore = function (score) {
        var radio = Math.min(10, this.m_Link);
        var value = score + (score / 10 * radio);
        var scoreNum = 0;
        if (this.m_Status == GameStatus.GS_ARound) {
            this.AScore += value;
            scoreNum = this.AScore;
        }
        if (this.m_Status == GameStatus.GS_BRound) {
            this.BScore += value;
            scoreNum = this.BScore;
        }
        //页面刷新分数
        App.MessageCenter.dispatch(Msg.Event.refreshScoreShow, this.m_Status, scoreNum);
    };
    TG_Game.prototype.doFinishGame = function () {
        this.m_Status = this.DoCheckGameStatus();
        this.doEndingTime();
        //如果是时间模式，计时器停表
        if (TG_Stage.IsTimeLimit) {
            App.TimerManager.remove(this.ReduceTime, this);
        }
        //如果棋盘正在滚动,停止滚动
        GamePanel.getInstance().removeRectSpRoll();
        App.TimerManager.remove(this.doDrop, this);
        //A胜利
        if (this.m_Status == GameStatus.GS_AVictory) {
            var isWeixinBrowser = App.DeviceUtils.IsWeixinBrowser;
            var env = ConfigConst.env;
            if ((isWeixinBrowser && (env == 'pro' || env == 'pre'))) {
                // 排行榜需要提交的数据
                var postData = this.getRankPostData();
                postData.type = 1;
                App.MessageCenter.addListener("init_postRankData", this.initPostRankDataBackHandler, this);
                App.Http.initServer(ConfigConst.initPostRankData, "1");
                var postDataStr = JSON.stringify(postData);
                App.Http.send("init_postRankData", new URLVariables("jsonData=" + postDataStr));
                return;
            }
            else {
                if (this.showGameOverTimeout) {
                    clearTimeout(this.showGameOverTimeout);
                }
                this.showGameOverTimeout = setTimeout(function () {
                    clearTimeout(this.showGameOverTimeout);
                    this.showGameOverView(true);
                }.bind(this), 1000);
                return;
            }
        }
        //B胜利
        if (this.m_Status == GameStatus.GS_BVictory) {
            if (this.showGameOverTimeout) {
                clearTimeout(this.showGameOverTimeout);
            }
            this.showGameOverTimeout = setTimeout(function () {
                clearTimeout(this.showGameOverTimeout);
                this.showGameOverView(false);
            }.bind(this), 1000);
            return;
        }
        Log.getInstance().trace("游戏结束: 结果异常");
    };
    TG_Game.prototype.initPostRankDataBackHandler = function (data) {
        if (data.succ) {
            if (data.isMsgType) {
                console.info("提交关卡信息成功！");
            }
        }
        if (!data.succ) {
            if (data.isMsgType) {
                console.info("提交关卡信息失败！");
            }
        }
        if (this.showGameOverTimeout) {
            clearTimeout(this.showGameOverTimeout);
        }
        this.showGameOverTimeout = setTimeout(function () {
            clearTimeout(this.showGameOverTimeout);
            this.showGameOverView(true);
        }.bind(this), 1000);
        return;
    };
    /*展示结束页面*/
    TG_Game.prototype.showGameOverView = function (isVictory) {
        if (isVictory === void 0) { isVictory = true; }
        if (isVictory) {
            Panel_PopupLayer.getInstance().myAlert("任务完成,游戏结束！", 1200);
            GamePanel.getInstance().showGameOver(1);
        }
        else {
            Panel_PopupLayer.getInstance().myAlert("任务失败,游戏结束！", 1200);
            GamePanel.getInstance().showGameOver(0);
        }
    };
    /*获取排行榜需要提交数据*/
    TG_Game.prototype.getRankPostData = function () {
        var rankData = new RankData();
        // 排行榜id
        rankData.stage_id = TG_Stage.StageId;
        rankData.stage_type = TG_Stage.RuleType; //排行榜关卡类型 0 消除 1收集
        rankData.condition_limit = 0; // -1 不限制 0 步数 1 时间
        if (TG_Stage.IsStepLimit) {
            rankData.condition_limit = 0;
        }
        if (TG_Stage.IsTimeLimit) {
            rankData.condition_limit = 1;
        }
        if (!TG_Stage.IsStepLimit && !TG_Stage.IsTimeLimit) {
            rankData.condition_limit = -1;
        }
        // 用户id
        rankData.player_id = WxUser.getInstance().wxUserId; //玩家id
        //使用步数
        rankData.used_step_num = this.AUsedStepNum;
        //使用时间
        rankData.used_time = this.GetGameUsedTime();
        //消除的方块
        rankData.remove_block_num = this.APlayerCompleteTaskNum();
        //分数
        rankData.score_num = this.AScore;
        return rankData;
    };
    /*游戏结算*/
    TG_Game.prototype.doEndingTime = function () {
        //故事模式 并且 条件限制
        if (TG_Stage.StoryType != 1 && TG_Stage.IsConditionLimit) {
            if (this.m_Status == GameStatus.GS_AVictory) {
                var surplusStep = TG_Stage.IsTimeLimit ? Math.ceil(this.SurplusTime / 5) : this.AStepNum;
                if (surplusStep > 0) {
                    this.AScore += surplusStep * ScoreType.ST_STEPSCORE;
                }
            }
            if (this.m_Status == GameStatus.GS_BVictory) {
                var surplusStep = TG_Stage.IsTimeLimit ? Math.ceil(this.SurplusTime / 5) : this.BStepNum;
                if (surplusStep > 0) {
                    this.BScore += surplusStep * ScoreType.ST_STEPSCORE;
                }
            }
        }
        //故事模式 并且 失败任务1 剩余转换为分数
        if (TG_Stage.StoryType != 1 && TG_Stage.IsElementLimit1) {
            if (this.m_Status == GameStatus.GS_AVictory) {
                for (var _i = 0, _a = this.ADefeatTaskTargets1; _i < _a.length; _i++) {
                    var target = _a[_i];
                    if (target.Cur > 0) {
                        this.AScore += this.getDeafaultTargetScore(target.Target) * target.Cur;
                    }
                }
            }
            if (this.m_Status == GameStatus.GS_BVictory) {
                for (var _b = 0, _c = this.BDefeatTaskTargets1; _b < _c.length; _b++) {
                    var target = _c[_b];
                    if (target.Cur > 0) {
                        this.BScore += this.getDeafaultTargetScore(target.Target) * target.Cur;
                    }
                }
            }
        }
        //故事模式 并且 失败任务2 剩余转换为分数
        if (TG_Stage.StoryType != 1 && TG_Stage.IsElementLimit2) {
            if (this.m_Status == GameStatus.GS_AVictory) {
                for (var _d = 0, _e = this.ADefeatTaskTargets2; _d < _e.length; _d++) {
                    var target = _e[_d];
                    if (target.Cur > 0) {
                        this.AScore += this.getDeafaultTargetScore(target.Target) * target.Cur;
                    }
                }
            }
            if (this.m_Status == GameStatus.GS_BVictory) {
                for (var _f = 0, _g = this.BDefeatTaskTargets2; _f < _g.length; _f++) {
                    var target = _g[_f];
                    if (target.Cur > 0) {
                        this.BScore += this.getDeafaultTargetScore(target.Target) * target.Cur;
                    }
                }
            }
        }
        //页面刷新分数
        var scoreNum = 0;
        if (this.m_Status == GameStatus.GS_AVictory) {
            scoreNum = this.AScore;
        }
        else if (this.m_Status == GameStatus.GS_BVictory) {
            scoreNum = this.BScore;
        }
        App.MessageCenter.dispatch(Msg.Event.refreshScoreShow, this.m_Status, scoreNum);
    };
    /*获取失败任务任务目标的得分*/
    TG_Game.prototype.getDeafaultTargetScore = function (blockId) {
        var entry = TG_Entry.GetEntryObj(blockId);
        switch (TG_Stage.SetColorNumElement.length) {
            case 6:
                return entry.isLimitRewardSix;
            case 5:
                return entry.isLimitRewardFive;
            case 4:
                return entry.isLimitRewardFour;
        }
        return 0;
    };
    /*检查元素是否可以打标签*/
    TG_Game.prototype.CheckAddMark = function (item) {
        if (item == null) {
            return false;
        }
        if (item.getItemNone()) {
            return false;
        }
        if (item.MarkedAlready) {
            return false;
        }
        // 有毛球 update by sbb
        if (item.venonatId != 0) {
            return false;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        if (index < 0 || index > this.ColNum * this.RowNum - 1) {
            return false;
        }
        var cloud = this.GetCloudItemByIndex(index);
        if (cloud.IsCloud() && !cloud.getItemNone()) {
            return false;
        }
        return true;
    };
    /*添加相邻关系---（打标签，每个方块相邻有相同方块个数）*/
    TG_Game.prototype.DoAddMark = function () {
        var mNumberMark = 2;
        var blnHasMark = false; //是否可以有消除
        var tempList = [];
        var color = 0;
        /*行 列*/
        for (var i = 0; i < this.RowNum; i++) {
            color = 0;
            if (tempList.length >= mNumberMark) {
                for (var _i = 0, tempList_2 = tempList; _i < tempList_2.length; _i++) {
                    var temp = tempList_2[_i];
                    if (!temp.getItemNone()) {
                        temp.SetMarkedHor(tempList.length);
                    }
                    else {
                        temp.SetMarkedHor(0);
                    }
                    blnHasMark = true;
                }
            }
            for (var j = 0; j < this.ColNum; j++) {
                var item = this.GetItemByPos(i, j);
                // console.info(i+":"+j);
                // console.info(item);
                // console.info(item.Color);
                if (color > 0 && color == item.Color && this.CheckAddMark(item)) {
                    if (!item.getItemNone()) {
                        tempList.push(item);
                    }
                }
                else {
                    color = this.CheckAddMark(item) ? item.Color : 0;
                    if (tempList.length >= mNumberMark) {
                        for (var _a = 0, tempList_3 = tempList; _a < tempList_3.length; _a++) {
                            var temp = tempList_3[_a];
                            if (!temp.getItemNone()) {
                                temp.SetMarkedHor(tempList.length);
                            }
                            else {
                                temp.SetMarkedHor(0);
                            }
                            blnHasMark = true;
                        }
                    }
                    tempList = [];
                    if (!item.getItemNone()) {
                        tempList.push(item);
                    }
                }
            }
        }
        if (tempList.length >= mNumberMark) {
            for (var _b = 0, tempList_4 = tempList; _b < tempList_4.length; _b++) {
                var temp = tempList_4[_b];
                if (!temp.getItemNone()) {
                    temp.SetMarkedHor(tempList.length);
                }
                else {
                    temp.SetMarkedHor(0);
                }
                blnHasMark = true;
            }
        }
        tempList = [];
        /*列 行*/
        for (var i = 0; i < this.ColNum; i++) {
            color = 0;
            if (tempList.length >= mNumberMark) {
                for (var _c = 0, tempList_5 = tempList; _c < tempList_5.length; _c++) {
                    var temp = tempList_5[_c];
                    if (!temp.getItemNone()) {
                        temp.SetMarkedVel(tempList.length);
                    }
                    else {
                        temp.SetMarkedVel(0);
                    }
                    blnHasMark = true;
                }
            }
            for (var j = 0; j < this.RowNum; j++) {
                var item = this.GetItemByPos(j, i);
                if (color > 0 && color == item.Color && this.CheckAddMark(item)) {
                    if (!item.getItemNone()) {
                        tempList.push(item);
                    }
                }
                else {
                    color = this.CheckAddMark(item) ? item.Color : 0;
                    if (tempList.length >= mNumberMark) {
                        for (var _d = 0, tempList_6 = tempList; _d < tempList_6.length; _d++) {
                            var temp = tempList_6[_d];
                            if (!temp.getItemNone()) {
                                temp.SetMarkedVel(tempList.length);
                            }
                            else {
                                temp.SetMarkedVel(0);
                            }
                            blnHasMark = true;
                        }
                    }
                    tempList = [];
                    if (!item.getItemNone()) {
                        tempList.push(item);
                    }
                }
            }
        }
        if (tempList.length >= mNumberMark) {
            for (var _e = 0, tempList_7 = tempList; _e < tempList_7.length; _e++) {
                var temp = tempList_7[_e];
                if (!temp.getItemNone()) {
                    temp.SetMarkedVel(tempList.length);
                }
                else {
                    temp.SetMarkedVel(0);
                }
                blnHasMark = true;
            }
        }
        if (blnHasMark) {
            this.changeAllText();
        }
        return blnHasMark;
    };
    /*根据 行Y 列X 获取方块*/
    TG_Game.prototype.GetItemByPos = function (Y, X) {
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            if (temp.SitePos.Y == Y && temp.SitePos.X == X) {
                return temp;
            }
        }
    };
    /*
     * 根据两索引，计算移动方向
     * <returns>1-2-3-4 ： 上-下-左-右</returns>
     * */
    TG_Game.prototype.getDirection = function (first, second) {
        if (first - second == 9) {
            return 1;
        }
        if (first - second == -9) {
            return 2;
        }
        if (first - second == 1) {
            return 3;
        }
        if (first - second == -1) {
            return 4;
        }
        return 0;
    };
    /*根据 行 列 获取index*/
    TG_Game.prototype.GetIndexByPos = function (Y, X) {
        return Y * this.ColNum + X;
    };
    /*根据 index 获取方块*/
    TG_Game.prototype.GetItemByIndex = function (index, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        if (index >= itemArr.length || index < 0)
            return null;
        return itemArr[index];
    };
    /*改变方块的index by Pos*/
    TG_Game.prototype.changeItemIndexByPos = function (row1, col1, row2, col2, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        var aIndex = this.GetIndexByPos(row1, col1);
        var bIndex = this.GetIndexByPos(row2, col2);
        var aItem = this.GetItemByIndex(aIndex, itemArr);
        var bItem = this.GetItemByIndex(bIndex, itemArr);
        var temp = aItem;
        itemArr[aIndex] = bItem;
        itemArr[bIndex] = temp;
    };
    /*改变方块的index by index*/
    TG_Game.prototype.changeItemIndexByIndex = function (aIndex, bIndex, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        var aItem = itemArr[aIndex];
        var bItem = itemArr[bIndex];
        var temp = aItem;
        itemArr[aIndex] = bItem;
        itemArr[bIndex] = temp;
    };
    /*改变方块的Pos*/
    TG_Game.prototype.changeItemPosByIndex = function (aIndex, bIndex, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        var aItem = itemArr[aIndex];
        var bItem = itemArr[bIndex];
        var temp = aItem.SitePos;
        aItem.SitePos = bItem.SitePos;
        bItem.SitePos = temp;
        this.changItemTxt(aItem, itemArr);
        this.changItemTxt(bItem, itemArr);
    };
    /*获取栏杆元素*/
    TG_Game.prototype.GetRailingItemByIndex = function (index) {
        var temp = TG_Game.Railings[index];
        return temp;
    };
    /* 获取豌豆坑元素 */
    TG_Game.prototype.GetPeaItemByIndex = function (index) {
        var temp = TG_Game.PeaLst[index];
        return temp;
    };
    /*获取底块元素*/
    TG_Game.prototype.GetButtonItemByIndex = function (index) {
        var temp = TG_Game.Buttons[index];
        return temp;
    };
    /*获取毛球所在元素块对象*/
    TG_Game.prototype.GetHairBallItemByIndex = function (index) {
        var temp = TG_Game.Items[index];
        return temp;
    };
    /*获取铁丝网元素*/
    TG_Game.prototype.GetMeshItemByIndex = function (index) {
        var temp = TG_Game.Meshs[index];
        return temp;
    };
    /*获取云层元素*/
    TG_Game.prototype.GetCloudItemByIndex = function (index) {
        var temp = TG_Game.Clouds[index];
        return temp;
    };
    /**
     * 检索3层item消失逻辑 如冰层、流沙等等
     * @param index
     * @returns {null}
     * @constructor
     */
    TG_Game.prototype.CheckIcesItem = function (item) {
        if (item.isIces && item.isFlowIces) {
            return null;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var temp = null;
        if (TG_Game.Ices[index].BlockId) {
            temp = TG_Game.Ices[index];
        }
        return temp;
    };
    /**
     *  判断云层块
     * @param item
     * @returns {null}
     * @constructor
     */
    TG_Game.prototype.CheckCloudItem = function (item) {
        if (item == null) {
            return;
        }
        if (item.getItemNone()) {
            return;
        }
        if (item.IsCloud()) {
            return null;
        }
        var index = this.GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var temp = null;
        if (!TG_Game.Clouds[index].getItemNone()) {
            temp = TG_Game.Clouds[index];
        }
        return temp;
    };
    /*检查横向的链接*/
    TG_Game.prototype.getRowChain = function (item, outs) {
        if (item == null) {
            return;
        }
        if (item.getItemNone()) {
            return;
        }
        if (item.GetColorType() < 0) {
            return;
        }
        outs.push(item);
        var siteCol = item.SitePos.X + 1;
        var siteRow = item.SitePos.Y;
        while (siteCol < this.ColNum) {
            var neighbor = this.GetItemByPos(siteRow, siteCol);
            if (neighbor == null) {
                break;
            }
            if (neighbor.getItemNone()) {
                break;
            }
            if (this.CheckAddMark(neighbor)) {
                if (item.GetColorType() == neighbor.GetColorType()) {
                    outs.push(neighbor);
                    siteCol++;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        siteCol = item.SitePos.X - 1;
        while (siteCol >= 0) {
            var neighbor = this.GetItemByPos(siteRow, siteCol);
            if (neighbor == null) {
                break;
            }
            if (neighbor.getItemNone()) {
                break;
            }
            if (this.CheckAddMark(neighbor)) {
                if (item.GetColorType() == neighbor.GetColorType()) {
                    outs.push(neighbor);
                    siteCol--;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
    };
    /*检查纵向的链接*/
    TG_Game.prototype.getColChain = function (item, outs) {
        if (item == null) {
            return;
        }
        if (item.getItemNone()) {
            return;
        }
        if (item.GetColorType() < 0) {
            return;
        }
        outs.push(item);
        var siteCol = item.SitePos.X;
        var siteRow = item.SitePos.Y + 1;
        while (siteRow < this.RowNum) {
            var neighbor = this.GetItemByPos(siteRow, siteCol);
            if (neighbor == null) {
                break;
            }
            if (neighbor.getItemNone()) {
                break;
            }
            if (this.CheckAddMark(neighbor)) {
                if (item.GetColorType() == neighbor.GetColorType()) {
                    outs.push(neighbor);
                    siteRow++;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        siteRow = item.SitePos.Y - 1;
        while (siteRow >= 0) {
            var neighbor = this.GetItemByPos(siteRow, siteCol);
            if (neighbor == null) {
                break;
            }
            if (neighbor.getItemNone()) {
                break;
            }
            if (this.CheckAddMark(neighbor)) {
                if (item.GetColorType() == neighbor.GetColorType()) {
                    outs.push(neighbor);
                    siteRow--;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
    };
    //Ai执行操作接口
    TG_Game.prototype.doAiExchange = function () {
        //判断游戏是否结束
        if (this.doCheckGameFinish()) {
            //监听停止棋盘提示
            App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
            App.MessageCenter.dispatch(Msg.Event.StopRoundTime);
            return;
        }
        var first = -1;
        var second = -1;
        var obj = TG_Ai.getInstance().GetAiMoveData();
        first = obj.first;
        second = obj.second;
        Log.getInstance().trace("交换位置 : " + first + "," + second);
        if (first == -1 || second == -1) {
            //无可提示的情况，打乱棋盘所有元素
            Log.getInstance().trace("无可提示的情况");
            var hasEx = this.doRandomExchangeAllItem();
            if (typeof (hasEx) == "boolean") {
                //启动棋盘提示倒计时
                App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
            }
        }
        else {
            if (TG_Stage.SingelModel) {
                //单人模式
                TG_HintFunction.getInstance().AIItemMove(first, second);
            }
            else {
                TG_HintFunction.getInstance().AIHandMove(first, second);
            }
        }
    };
    /*重新打乱所有元素块*/
    TG_Game.prototype.doRandomExchangeAllItem = function () {
        //若存在移动可消除
        if (this.isCanExchangeAll()) {
            return false;
        }
        var isCan = this.RandomAllItem();
        if (isCan == 1) {
            //无法打乱棋盘，需要启动棋盘提示
            return 1;
        }
        else {
            return true;
        }
    };
    /*是否存在移动可产生消除情况*/
    TG_Game.prototype.isCanExchangeAll = function () {
        for (var i = 0; i < this.ColNum * this.RowNum; i++) {
            var item = this.GetItemByIndex(i);
            if (item != null) {
                var index = item.Index;
                var row1 = 0, col1 = 0, row2 = 0, col2 = 0;
                //右边
                var rightIndex = this.GetRightItem(index);
                if (rightIndex >= 0) {
                    var right = this.GetItemByIndex(rightIndex);
                    row1 = item.SitePos.Y;
                    col1 = item.SitePos.X;
                    row2 = right.SitePos.Y;
                    col2 = right.SitePos.X;
                    if (TG_Ai.getInstance().IsCanExchange(row1, col1, row2, col2)) {
                        return true;
                    }
                }
                //下边
                var bottomIndex = this.GetBottomItem(index);
                if (bottomIndex >= 0) {
                    var bottom = this.GetItemByIndex(bottomIndex);
                    row1 = item.SitePos.Y;
                    col1 = item.SitePos.X;
                    row2 = bottom.SitePos.Y;
                    col2 = bottom.SitePos.X;
                    if (TG_Ai.getInstance().IsCanExchange(row1, col1, row2, col2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    TG_Game.prototype.RandomAllItem = function (isUsePorp) {
        if (isUsePorp === void 0) { isUsePorp = false; }
        //isUsePorp 是否是使用的道具 打乱棋盘
        var normalBlocks = this.GetNormalBlockIndex();
        var hasEnoughBlock = false; //是否存在长度大于3的颜色块
        for (var i in normalBlocks) {
            if (normalBlocks[i].length >= 3) {
                hasEnoughBlock = true;
                break;
            }
        }
        var needFill = null;
        if (hasEnoughBlock) {
            needFill = this.GetCanFillPos();
        }
        //当没有打乱可能时，进入结算
        if (!hasEnoughBlock || needFill == null) {
            // 当有可使用的有效道具时，提示玩家使用道具，而不结束比赛
            if (this.hasVaildProp()) {
                Panel_PopupLayer.getInstance().myAlert("无法打乱棋盘,您还有道具可用!", 1000);
                return 1;
            }
            this.cantRandomAllItem = true;
            this.DoFinishRound();
            return 1;
        }
        TG_Game.SetGameState(false);
        if (!isUsePorp) {
            Panel_PopupLayer.getInstance().myAlert("没有可移动的元素打乱棋盘", 1000);
        }
        //普通块交换
        for (var j in normalBlocks) {
            var fillCount = 0;
            var blocksPair = normalBlocks[j];
            for (var i = 0; i < blocksPair.length; i++) {
                //还没换过的原始单色点，保证fillCount为3
                if (TsList.contains(needFill, blocksPair[i])) {
                    fillCount++;
                }
            }
            if (blocksPair.length >= 3) {
                var fillBlockIndex = [];
                fillBlockIndex = [-1, -1, -1];
                for (var k = 0; k < blocksPair.length; k++) {
                    for (var l = 0; l < 3; l++) {
                        //检测一下颜色可以少换很多次,检测包含，保证一共换3次
                        if (!TsList.contains(needFill, blocksPair[k]) && TG_Game.Items[needFill[l]].GetColorType() != j
                            && fillBlockIndex[l] == -1) {
                            var row1 = 0, col1 = 0, row2 = 0, col2 = 0;
                            var item = this.GetItemByIndex(blocksPair[k]);
                            var item1 = this.GetItemByIndex(needFill[l]);
                            row1 = item.SitePos.Y;
                            col1 = item.SitePos.X;
                            row2 = item1.SitePos.Y;
                            col2 = item1.SitePos.X;
                            if (!TG_Ai.getInstance().IsCanExchange(row1, col1, row2, col2)) {
                                fillBlockIndex[l] = blocksPair[k];
                                this.SwapItem1(fillBlockIndex[l], needFill[l]);
                                //交换颜色队列中的值
                                var temp1 = this.GetItemByIndex(needFill[l]);
                                var temp2 = this.GetItemByIndex(fillBlockIndex[l]);
                                normalBlocks[temp1.GetColorType()].push(needFill[l]);
                                App.ArrayManager.removeItem(fillBlockIndex[l], normalBlocks[temp1.GetColorType()]);
                                normalBlocks[temp2.GetColorType()].push(fillBlockIndex[l]);
                                App.ArrayManager.removeItem(needFill[l], normalBlocks[temp1.GetColorType()]);
                                fillCount++;
                                k--;
                                break;
                            }
                        }
                    }
                }
                if (fillCount == 3) {
                    break;
                }
            }
        }
        //打乱
        this.RandomExchangeAllItem(needFill);
    };
    /*随机打乱逻辑*/
    TG_Game.prototype.RandomExchangeAllItem = function (needFill) {
        Log.getInstance().trace("开始打乱棋盘");
        for (var index = 0; index < this.ColNum * this.RowNum; index++) {
            var random = Math.floor(Math.random() * 81) + 1;
            var swapIndex = this.getNextNormalItem(index + random);
            if (TsList.contains(needFill, index))
                continue;
            if (TsList.contains(needFill, swapIndex))
                continue;
            if (!this.IsCanRandomExchange(index, swapIndex, false))
                continue;
            var row1 = 0, col1 = 0, row2 = 0, col2 = 0;
            var item = this.GetItemByIndex(index);
            var item1 = this.GetItemByIndex(swapIndex);
            row1 = item.SitePos.Y;
            col1 = item.SitePos.X;
            row2 = item1.SitePos.Y;
            col2 = item1.SitePos.X;
            if (!TG_Ai.getInstance().IsCanExchange(row1, col1, row2, col2, false)) {
                this.SwapItem1(swapIndex, index);
            }
        }
        //打乱棋盘表演
        GamePanel_ItemSp.getInstance().OnRefreshStage();
    };
    /*是否可以用于随机交换*/
    TG_Game.prototype.IsCanRandomExchange = function (first, second, needNeighbor) {
        if (needNeighbor === void 0) { needNeighbor = true; }
        var item = this.GetItemByIndex(first);
        var destItem = this.GetItemByIndex(second);
        if (item == null || item.getItemNone() || destItem == null || destItem.getItemNone())
            return false;
        if (needNeighbor && !this.checkIsNeighbor(item.SitePos.Y, item.SitePos.X, destItem.SitePos.Y, destItem.SitePos.X))
            return false;
        if (!item.CheckCellCouldMove() || !destItem.CheckCellCouldMove())
            return false;
        if (item.IsItemEffect() || destItem.IsItemEffect())
            return false;
        if (needNeighbor && !this.CheckRailingCouldMove(item, destItem))
            return false;
        if (!this.IsCanRandomExchange1(first) || !this.IsCanRandomExchange1(second))
            return false;
        return true;
    };
    /*是否参与随机打乱*/
    TG_Game.prototype.IsCanRandomExchange1 = function (index) {
        if (index < 0 || index > TG_Game.Items.length) {
            return false;
        }
        var item = this.GetItemByIndex(index);
        //如果有毛球
        if (item.GetVenonatId() > 0) {
            return false;
        }
        // 只有普通块参与打乱
        if (!item.IsNormal()) {
            return false;
        }
        return true;
    };
    TG_Game.prototype.getNextNormalItem = function (index) {
        var count = this.ColNum * this.RowNum;
        var newIndex = index;
        for (var i = 0; i < count; i++) {
            newIndex = (newIndex + 1) % count;
            if (this.CheckAddMark(TG_Game.Items[newIndex])) {
                return newIndex;
            }
        }
        return -1;
    };
    /*获取棋盘上6种普通块的index*/
    TG_Game.prototype.GetNormalBlockIndex = function () {
        var Blocks = new Object();
        for (var index = 0; index < TG_Game.Items.length; index++) {
            var item = this.GetItemByIndex(index);
            if (item != null) {
                //去掉不能爆炸和不能移动的元素块
                if (!this.CheckAddMark(item) || !item.CheckCellCouldMove(item)) {
                    continue;
                }
                //去掉特殊元素
                if (item.IsNormal()) {
                    var color = item.GetColorType();
                    if (!Blocks.hasOwnProperty(color)) {
                        Blocks[color] = [];
                    }
                    Blocks[color].push(index);
                }
            }
        }
        return Blocks;
    };
    /*获取填充的位置点组合*/
    TG_Game.prototype.GetCanFillPos = function () {
        var blocks = [];
        var posList = [];
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (this.CheckAddMark(item) && item.CheckCellCouldMove() && item.IsNormal()) {
                blocks.push(item.Index);
            }
        }
        var random = Math.floor(Math.random() * blocks.length);
        for (var i = 0; i < blocks.length; i++) {
            var index = blocks[(i + random) % blocks.length];
            posList = [];
            posList.push(index);
            //上
            var topIndex = this.GetTopItem(index);
            var topLeftIndex = this.GetTopLeftItem(index);
            var topRightIndex = this.GetTopRightItem(index);
            if (TsList.contains(blocks, topIndex) && TsList.contains(blocks, topLeftIndex) && TsList.contains(blocks, topRightIndex)) {
                var temp = this.GetItemByIndex(index);
                var topTemp = this.GetItemByIndex(topIndex);
                if (this.CheckRailingCouldMove(temp, topTemp)) {
                    posList.push(topLeftIndex);
                    posList.push(topRightIndex);
                    return posList;
                }
            }
            //左
            var leftIndex = this.GetLeftItem(index);
            var bottomLeftIndex = this.GetBottomLeftItem(index);
            if (TsList.contains(blocks, leftIndex) && TsList.contains(blocks, topLeftIndex) && TsList.contains(blocks, bottomLeftIndex)) {
                var temp = this.GetItemByIndex(index);
                var leftTemp = this.GetItemByIndex(leftIndex);
                if (this.CheckRailingCouldMove(temp, leftTemp)) {
                    posList.push(topLeftIndex);
                    posList.push(bottomLeftIndex);
                    return posList;
                }
            }
            //下
            var bottomIndex = this.GetBottomItem(index);
            var bottomRightIndex = this.GetBottomRightItem(index);
            if (TsList.contains(blocks, bottomIndex) && TsList.contains(blocks, bottomRightIndex) && TsList.contains(blocks, bottomLeftIndex)) {
                var temp = this.GetItemByIndex(index);
                var bottomTemp = this.GetItemByIndex(bottomIndex);
                if (this.CheckRailingCouldMove(temp, bottomTemp)) {
                    posList.push(bottomLeftIndex);
                    posList.push(bottomRightIndex);
                    return posList;
                }
            }
            //右
            var rightIndex = this.GetRightItem(index);
            if (TsList.contains(blocks, rightIndex) && TsList.contains(blocks, bottomRightIndex) && TsList.contains(blocks, topRightIndex)) {
                var temp = this.GetItemByIndex(index);
                var rightTemp = this.GetItemByIndex(rightIndex);
                if (this.CheckRailingCouldMove(temp, rightTemp)) {
                    posList.push(bottomRightIndex);
                    posList.push(topRightIndex);
                    return posList;
                }
            }
            //右右
            var rightIndex2 = this.GetRightItem(rightIndex);
            var rightIndex3 = this.GetRightItem(rightIndex2);
            if (TsList.contains(blocks, rightIndex) && TsList.contains(blocks, rightIndex2) && TsList.contains(blocks, rightIndex3)) {
                var temp = this.GetItemByIndex(index);
                var rightTemp = this.GetItemByIndex(rightIndex);
                if (this.CheckRailingCouldMove(temp, rightTemp)) {
                    posList.push(rightIndex2);
                    posList.push(rightIndex3);
                    return posList;
                }
            }
            //下下
            var bottomIndex2 = this.GetBottomItem(bottomIndex);
            var bottomIndex3 = this.GetBottomItem(bottomIndex2);
            if (TsList.contains(blocks, bottomIndex) && TsList.contains(blocks, bottomIndex2) && TsList.contains(blocks, bottomIndex3)) {
                var temp = this.GetItemByIndex(index);
                var leftTemp = this.GetItemByIndex(leftIndex);
                if (this.CheckRailingCouldMove(temp, leftTemp)) {
                    posList.push(bottomIndex2);
                    posList.push(bottomIndex3);
                    return posList;
                }
            }
        }
        return null;
    };
    TG_Game.prototype.hasVaildProp = function () {
        if (TG_Stage.IsLimitUsePropCount && this.usedToolTimes >= 1) {
            return false;
        }
        if (this.m_Status == GameStatus.GS_ARound) {
            if (this.GetACanUsePropCount(3) || this.GetACanUsePropCount(4) || this.GetACanUsePropCount(5) || this.GetACanUsePropCount(2)) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.m_Status == GameStatus.GS_BRound) {
            return false;
        }
    };
    /*获取A可以使用道具数量*/
    TG_Game.prototype.GetACanUsePropCount = function (toolType) {
        var arr = PropNewView.itemList;
        for (var i = 0; i < arr.length; i++) {
            if (toolType == arr[i]["type"]) {
                var num = arr[i]["num"];
                if (num > 0) {
                    return true;
                }
                return false;
            }
        }
    };
    /*
     * 消除逻辑接口
     * */
    //游戏中飞到消除目标位置
    TG_Game.prototype.ItemFlyToGoal = function (item) {
        if (item == null || item.IsItemNone())
            return;
        //不是被毒液感染爆炸
        if (!item.GetIsInfectVenom()) {
            this.seekitemFunction(item);
            //检查任务目标
            this.DoCheckTaskTarget(item);
        }
    };
    /*判断功能块 加属性*/
    TG_Game.prototype.seekitemFunction = function (items) {
        if (items.isFunction) {
            if (items.extendType == 1) {
                this.AddingStep(Number(items.extendParam));
            }
            else if (items.extendType == 2) {
                this.AddingTime(Number(items.extendParam));
            }
        }
        if (items.isPropBox) {
            //是道具宝箱
            var propId = items.propId; //宝箱id
            var propNum = items.propNum;
            //时间步数直接使用增加玩家时间或者步数
            if (propId == 7) {
                this.AddingStep(3);
            }
            else if (propId == 8) {
                this.AddingStep(5);
            }
            else if (propId == 9) {
                this.AddingTime(10);
            }
            else if (propId == 10) {
                this.AddingTime(20);
            }
            else {
                App.MessageCenter.dispatch(Msg.Event.UseProp, propId, 1, propNum, false); //派发更新道具数量事件
            }
        }
    };
    /*滚动目标是否全部完成*/
    TG_Game.prototype.doCheckRollTargetFinish = function () {
        var finishRollTarget = false;
        if (this.m_Status == GameStatus.GS_ARound) {
            finishRollTarget = this.aRollIndex >= this.ARollTargets.length;
        }
        else if (this.m_Status == GameStatus.GS_BRound) {
            finishRollTarget = this.bRollIndex >= this.BRollTargets.length;
        }
        return finishRollTarget;
    };
    /*检查任务目标*/
    TG_Game.prototype.DoCheckTaskTarget = function (item) {
        var externalId = item.BlockId;
        this.doCalRollTaskTarget(externalId);
        if (TG_Stage.IsSyncCollectTarget || this.doCheckRollTargetFinish()) {
            //消除元素块飞到胜利目标位置
            App.MessageCenter.dispatch(Msg.Event.itemFlyToVictoryTask, this.m_Status, item);
            if (Math.floor(externalId / 10) * 10 == 2600) {
                externalId = 2000 + externalId % 10;
            }
            this.doCalVictoryTaskTarget(externalId);
        }
        this.doCalDefeatTaskTarget(externalId);
    };
    /*胜利条件任务目标处理*/
    TG_Game.prototype.doCalVictoryTaskTarget = function (externalId) {
        //胜利目标
        if (this.m_Status == GameStatus.GS_ARound) {
            for (var _i = 0, _a = this.ATaskTargets; _i < _a.length; _i++) {
                var target = _a[_i];
                if (target.Target == externalId) {
                    target.DoIncreaseTarget();
                    //刷新胜利目标数量
                    App.MessageCenter.dispatch(Msg.Event.refreshVictoryTask, GameStatus.GS_ARound, target);
                }
            }
            if (TG_Stage.IsAddTarget) {
                for (var _b = 0, _c = this.BTaskTargets; _b < _c.length; _b++) {
                    var target = _c[_b];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                    }
                }
            }
        }
        else if (this.m_Status == GameStatus.GS_BRound) {
            for (var _d = 0, _e = this.BTaskTargets; _d < _e.length; _d++) {
                var target = _e[_d];
                if (target.Target == externalId) {
                    target.DoIncreaseTarget();
                }
            }
            if (TG_Stage.IsAddTarget) {
                for (var _f = 0, _g = this.ATaskTargets; _f < _g.length; _f++) {
                    var target = _g[_f];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                        //刷新胜利目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshVictoryTask, GameStatus.GS_ARound, target);
                    }
                }
            }
        }
    };
    /*失败条件任务目标处理*/
    TG_Game.prototype.doCalDefeatTaskTarget = function (externalId) {
        //失败任务目标处理
        if (this.m_Status == GameStatus.GS_ARound) {
            if (TG_Stage.IsElementLimit1) {
                for (var _i = 0, _a = this.ADefeatTaskTargets1; _i < _a.length; _i++) {
                    var target = _a[_i];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                        //刷新失败目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshDefeatTask, GameStatus.GS_ARound, target);
                    }
                }
            }
            if (TG_Stage.IsElementLimit2) {
                for (var _b = 0, _c = this.ADefeatTaskTargets2; _b < _c.length; _b++) {
                    var target = _c[_b];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                        //刷新失败目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshDefeatTask, GameStatus.GS_ARound, target);
                    }
                }
            }
        }
        else if (this.m_Status == GameStatus.GS_BRound) {
            if (TG_Stage.IsElementLimit1) {
                for (var _d = 0, _e = this.BDefeatTaskTargets1; _d < _e.length; _d++) {
                    var target = _e[_d];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                    }
                }
            }
            if (TG_Stage.IsElementLimit2) {
                for (var _f = 0, _g = this.BDefeatTaskTargets2; _f < _g.length; _f++) {
                    var target = _g[_f];
                    if (target.Target == externalId) {
                        target.DoReduceTarget();
                    }
                }
            }
        }
    };
    /*滚动任务目标*/
    TG_Game.prototype.doCalRollTaskTarget = function (externalId) {
        if (this.aRollIndex >= this.ARollTargets.length && this.bRollIndex >= this.BRollTargets.length) {
            return;
        }
        var aRollTarget = this.aRollIndex < this.ARollTargets.length ? this.ARollTargets[this.aRollIndex] : null;
        var bRollTarget = this.bRollIndex < this.ARollTargets.length ? this.BRollTargets[this.bRollIndex] : null;
        var selfRollTarget = this.m_Status == GameStatus.GS_ARound ? aRollTarget : bRollTarget;
        var otherRollTarget = this.m_Status == GameStatus.GS_ARound ? bRollTarget : aRollTarget;
        if (selfRollTarget != null) {
            for (var _i = 0, _a = selfRollTarget.Targets; _i < _a.length; _i++) {
                var target = _a[_i];
                if (target.Target == externalId) {
                    this.DoIncreaseTarget(target);
                }
            }
        }
        if (otherRollTarget != null) {
            if (TG_Stage.IsAddTarget) {
                for (var _b = 0, _c = otherRollTarget.Targets; _b < _c.length; _b++) {
                    var target = _c[_b];
                    if (target.Target == externalId) {
                        this.DoReduceTarget(target);
                    }
                }
            }
        }
    };
    TG_Game.prototype.DoIncreaseTarget = function (target) {
        var Num = target.Num;
        var Cur = target.Cur;
        if (Num < 0) {
            // 无限模式
            Cur += 1;
        }
        else {
            Cur = Math.min(Num, ++Cur);
        }
        target.Cur = Cur;
    };
    TG_Game.prototype.DoReduceTarget = function (target) {
        var Cur = target.Cur;
        Cur = Math.max(0, --Cur);
        target.Cur = Cur;
    };
    /**
     * beltsType 传送带类型 1 闭合形 2 非闭合形
     * preIndex 前一点的下标
     * currIndex 当前点的下标
     * nextIndex 下一点的下标
     * 返回值表示传送带的方向: 1 左右方向 2 右左方向 3 上下方向 4 下上方向 5 左上方向 6 上左方向 7 右上方向 8 上右方向 9 左下方向 10 下左方向 11 右下方向 12 下右方向
     *
     */
    TG_Game.prototype.getBeltsNumByBeltsType = function (beltsType, preBeltsIndex, currBeltsIndex, nextBeltsIndex, isFirst, isLast) {
        if (isFirst === void 0) { isFirst = false; }
        if (isLast === void 0) { isLast = false; }
        if (beltsType == 1) {
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == 1) {
                return 1;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == -1) {
                return 2;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == 9) {
                return 3;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == -9) {
                return 4;
            }
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == -9) {
                return 5;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == -1) {
                return 6;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == -9) {
                return 7;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == 1) {
                return 8;
            }
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == 9) {
                return 9;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == -1) {
                return 10;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == 9) {
                return 11;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == 1) {
                return 12;
            }
        }
        if (beltsType == 2) {
            // 是第一个元素
            if (isFirst) {
                if (nextBeltsIndex - currBeltsIndex == 1) {
                    return 1;
                }
                if (nextBeltsIndex - currBeltsIndex == -1) {
                    return 2;
                }
                if (nextBeltsIndex - currBeltsIndex == 9) {
                    return 3;
                }
                if (nextBeltsIndex - currBeltsIndex == -9) {
                    return 4;
                }
            }
            // 是最后一个元素
            if (isLast) {
                if (currBeltsIndex - preBeltsIndex == 1) {
                    return 1;
                }
                if (currBeltsIndex - preBeltsIndex == -1) {
                    return 2;
                }
                if (currBeltsIndex - preBeltsIndex == 9) {
                    return 3;
                }
                if (currBeltsIndex - preBeltsIndex == -9) {
                    return 4;
                }
            }
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == 1) {
                return 1;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == -1) {
                return 2;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == 9) {
                return 3;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == -9) {
                return 4;
            }
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == -9) {
                return 5;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == -1) {
                return 6;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == -9) {
                return 7;
            }
            if (currBeltsIndex - preBeltsIndex == 9 && nextBeltsIndex - currBeltsIndex == 1) {
                return 8;
            }
            if (currBeltsIndex - preBeltsIndex == 1 && nextBeltsIndex - currBeltsIndex == 9) {
                return 9;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == -1) {
                return 10;
            }
            if (currBeltsIndex - preBeltsIndex == -1 && nextBeltsIndex - currBeltsIndex == 9) {
                return 11;
            }
            if (currBeltsIndex - preBeltsIndex == -9 && nextBeltsIndex - currBeltsIndex == 1) {
                return 12;
            }
        }
        return 0;
    };
    /**
     * 获取传送带颜色值方向
     * preBeltsIndex 前一个传送带坐标
     * currBeltsIndex 当前传送带坐标
     * nextBeltsIndex 下一个传送带坐标
     * isFirst 是否是第一个
     * isLast 是否是 最后一个
     *
     * 返回值表示 1 上 2 下 3 左 4 右
     *
     */
    TG_Game.prototype.getBeltsColorDirect = function (preBeltsIndex, currBeltsIndex, nextBeltsIndex, isFirst, isLast) {
        if (isFirst === void 0) { isFirst = false; }
        if (isLast === void 0) { isLast = false; }
        // 是第一个元素
        if (isFirst) {
            if (nextBeltsIndex - currBeltsIndex == 1) {
                return 3;
            }
            if (nextBeltsIndex - currBeltsIndex == -1) {
                return 4;
            }
            if (nextBeltsIndex - currBeltsIndex == 9) {
                return 1;
            }
            if (nextBeltsIndex - currBeltsIndex == -9) {
                return 2;
            }
        }
        // 是最后一个元素
        if (isLast) {
            if (currBeltsIndex - preBeltsIndex == 1) {
                return 4;
            }
            if (currBeltsIndex - preBeltsIndex == -1) {
                return 3;
            }
            if (currBeltsIndex - preBeltsIndex == 9) {
                return 2;
            }
            if (currBeltsIndex - preBeltsIndex == -9) {
                return 1;
            }
        }
        return 0;
    };
    /*修改元素块上的文字mark*/
    TG_Game.prototype.changeAllText = function () {
        for (var j in TG_Game.Items) {
            this.changItemTxt(TG_Game.Items[j]);
        }
    };
    /*改变方块上的文字显示*/
    TG_Game.prototype.changItemTxt = function (obj, itemArr) {
        if (itemArr === void 0) { itemArr = TG_Game.Items; }
        if (itemArr != TG_Game.Items)
            return;
        for (var i in TG_Game.Items) {
            if (TG_Game.Items[i].SitePos.Y == obj.SitePos.Y && TG_Game.Items[i].SitePos.X == obj.SitePos.X) {
                var sineObj = TG_Game.Items[i];
                sineObj.changeText(sineObj.SitePos.Y, sineObj.SitePos.X, sineObj.MarkedHor, sineObj.MarkedVel);
            }
        }
    };
    // 宝石层数据临时块对象集合
    TG_Game.ItemsBlocksDataTemp = [];
    // 宝石数据
    TG_Game.Items = [];
    // 地块数据
    TG_Game.Buttons = [];
    //毛虫层
    TG_Game.Caterpillars = [];
    // 冰层数据
    TG_Game.Ices = [];
    // 网格数据
    TG_Game.Meshs = [];
    // 云层数据
    TG_Game.Clouds = [];
    // 栏杆数据
    TG_Game.Railings = [];
    // 毛球层
    TG_Game.HairBall = [];
    // 皇冠数据列表
    TG_Game.PeaLst = [];
    // 传送带上移动块下标
    TG_Game.BeltsIndexLst = [];
    // 传送带列表
    TG_Game.Belts = [];
    // 传送带列表出入口
    TG_Game.BeltsColor = [];
    // 传染块数据
    TG_Game.Infects = [];
    //当前游戏状态 0初始化 1游戏中 2动画中
    TG_Game.currentState = 0;
    //当前毛球的状态 1正常状态 2动画中 动画中是不能接受玩家操作的
    TG_Game.currentHairState = 1;
    // 掉落表演时间
    TG_Game.MaxdropDelay = 0;
    TG_Game.isNeedInitListenEvent = true;
    //棋盘掉落
    TG_Game.IsBeginPanelStartDrop = false; //是否是开始时的自动掉落
    TG_Game.IsPlayerHasTouched = false; //玩家是否有操作
    TG_Game.IsPlayerDoMoveForHasPea1 = false; //月饼坑
    TG_Game.IsPlayerDoMoveForHasPea2 = false; //月饼坑
    TG_Game.IsPlayerDoMoveForFlowIceLogic = false; //流沙
    TG_Game.IsPlayerDoMoveForVenomInfect = false; //小恶魔
    TG_Game.IsPlayerDoMoveForChangeColorBlock = false; //变色块
    TG_Game.IsPlayerDoMoveForHairBallMove = false; //毛球
    TG_Game.IsPlayerDoMoveForBelts = false;
    TG_Game.IsPlayerDoMove = false; //是否是玩家的操作行为 是否是玩家主动移动 玩家第一次开始移动
    TG_Game.IsPlayerDoMoveFinished = false; // 玩家操作后移动完成并且可以消除和掉落的操作 该变量作用在传送带操作完成前起作用
    TG_Game.IsPlayerDoMoveByEgg = false; // 是否是鸡蛋块的玩家操作行为
    /*交换完毕-----开始消除 重复调用这里*/
    TG_Game.IsCanGoonRemove = false;
    return TG_Game;
}(BaseClass));
__reflect(TG_Game.prototype, "TG_Game");
//# sourceMappingURL=TG_Game.js.map