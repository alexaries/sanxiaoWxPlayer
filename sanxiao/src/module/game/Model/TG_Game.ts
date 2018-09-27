/**
 * Created by ZhangHui on 2018/6/5.
 */
import List = eui.List;
class TG_Game extends BaseClass{
    // 宝石层数据临时块对象集合
    public static ItemsBlocksDataTemp = [];
    // 宝石数据
    public static Items = [];
    // 地块数据
    public static Buttons = [];
    //毛虫层
    public static Caterpillars = [];
    // 冰层数据
    public static Ices = [];
    // 网格数据
    public static Meshs =[];
    // 云层数据
    public static Clouds = [];
    // 栏杆数据
    public static Railings =[];
    // 毛球层
    public static HairBall = [];
    // 皇冠数据列表
    public static  PeaLst = [];
    // 传送带上移动块下标
    public static BeltsIndexLst = [];
    // 传送带列表
    public static Belts = [];
    // 传送带列表出入口
    public static BeltsColor=[];
    // 传染块数据
    public static Infects = [];

    //当前游戏状态 0初始化 1游戏中 2动画中
    public static currentState = 0;
    //当前毛球的状态 1正常状态 2动画中 动画中是不能接受玩家操作的
    public static currentHairState = 1;

    // 掉落表演时间
    public static MaxdropDelay = 0;

    public RowNum=TG_MapData.getInstance().rowNum;//行数
    public ColNum=TG_MapData.getInstance().colNum;//列数
    public MaxIndex = this.RowNum*this.ColNum - 1;//格子数
    public static isNeedInitListenEvent=true;
    /*滚动目标*/
    public aRollIndex=0;
    public ARollTargets=[];
    public bRollIndex=0;
    public BRollTargets=[];
    public AutoRollTargets=[];
    /*胜利任务目标*/
    public ATaskTargets=[];
    public BTaskTargets=[];
    public IsElementLimit1;
    public IsElementLimit2;
    /*失败任务目标1*/
    public ADefeatTaskTargets1=[];
    public BDefeatTaskTargets1=[];
    /*失败任务目标2*/
    public ADefeatTaskTargets2=[];
    public BDefeatTaskTargets2=[];
    //当前积分
    public AScore;//A分数
    public BScore;//B分数
    //当前步数
    public AStepNum;
    public BStepNum;
    //使用步数
    public AUsedStepNum;
    public BUsedStepNum;
    //是否是时间模式
    public IsTimeLimit=false;
    public TimeLimitLength=0;
    // 剩余比赛tick
    private SurplusTime;
    //游戏规则 消除0 收集1
    public RuleType=0;
    //当前回合的掉落次数
    public combo=0;
    // 无限掉落
    private infiniteDrop = false;
    // 收集模式无收集目标
    private advanceEnd = false;


    /*初始化游戏数据*/
    public static InitGame(){
        //数组清空
        this.Items=[];
        this.Buttons=[];
        this.Ices=[];
        this.Meshs=[];
        this.Clouds=[];
        this.Railings=[];
        this.Caterpillars=[];
        this.Infects=[];
        //默认为用户未有操作
        TG_Game.IsPlayerHasTouched=false;
        //初始化游戏消除延迟时间
        TG_TimeDefine.InitTimeDefine();
        //初始化AI分数权值配置
        TG_AIConfigEntry.getInstance().InitAIConfigEntry();
        //初始
        TG_Game.getInstance().initTG_GameData();
        this.MaxdropDelay=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        if(this.isNeedInitListenEvent){
            this.isNeedInitListenEvent=false;
            TG_Game.getInstance().initListenEvent();
        }
        //初始化棋盘提示的倒计时功能
        TG_HintFunction.getInstance().initHintFunction();
    }
    public initTG_GameData(){
        //初始化掉落游标
        this.initDropCursor();
        //当前游戏状态
        this.m_Status=GameStatus.GS_ARound;
        //当前连击数
        this.m_Link=0;
        this.m_FirstLink = false;
        this.m_FisrtMarkRemove = false;
        this.isCombo=false;
        //道具使用次数
        this.usedToolTimes=0;
        //失败条件1
        this.IsElementLimit1=TG_Stage.IsElementLimit1;
        //失败条件2
        this.IsElementLimit2=TG_Stage.IsElementLimit2;
        //初始化任务目标
        this.initTaskTarget();

        this.aRollIndex=0;
        this.ARollTargets=TG_Stage.ARollTargets;
        this.bRollIndex=0;
        this.BRollTargets=TG_Stage.BRollTargets;
        this.AutoRollTargets=TG_Stage.AutoRollTargets;
        //当前得分
        this.AScore=0;
        this.BScore=0;
        //当前步数
        this.AStepNum=TG_Stage.Step;
        this.BStepNum=TG_Stage.Step;
        this.AUsedStepNum=0;
        this.BUsedStepNum=0;
        //是否是时间模式
        this.IsTimeLimit=TG_Stage.IsTimeLimit;
        this.TimeLimitLength=TG_Stage.TimeLimitLength;
        //游戏规则
        this.RuleType=TG_Stage.RuleType;
        //当前回合的掉落次数
        this.combo=0;
        //无限掉落
        this.infiniteDrop=false;
        //收集模式无收集目标
        this.advanceEnd=false;


        this.curRollRow=TG_Game.getInstance().RowNum;
        //无法打乱
        this.cantRandomAllItem=false;
        // 初始化滚动遗留掉落
        this.rollLeaveDrops=[];
        for (var i = 0; i < TG_Game.getInstance().ColNum; i++)
        {
            let drops = [];
           this.rollLeaveDrops.push(drops);
        }
    }
    /*设置游戏状态*/
    public static SetGameState(bool){
        if(bool){
            TG_Game.currentState=1;
        }else {
            //结束
            TG_Game.currentState=2;
        }
    }
    /*初始化任务目标*/
    public initTaskTarget(){
        //A
        this.ATaskTargets=[];
        for(let info of TG_Stage.Targets1){
            let target=new TG_TaskTarget();
            target.Target=info.Target;
            target.Num=info.Num;
            target.Cur=info.Cur;
            this.ATaskTargets.push(target);
        }
        if(this.IsElementLimit1){
            this.ADefeatTaskTargets1=[];
            for(let info of TG_Stage.ALimitTargets1){
                let target=new TG_TaskTarget();
                target.Target=info.Target;
                target.Num=info.Num;
                target.Cur=info.Cur;
                this.ADefeatTaskTargets1.push(target);
            }
        }
        if(this.IsElementLimit2){
            this.ADefeatTaskTargets2=[];
            for(let info of TG_Stage.ALimitTargets2){
                let target=new TG_TaskTarget();
                target.Target=info.Target;
                target.Num=info.Num;
                target.Cur=info.Cur;
                this.ADefeatTaskTargets2.push(target);
            }
        }
        //pk模式 B
        if(!TG_Stage.SingelModel){
            this.BTaskTargets=[];
            for(let info of TG_Stage.Targets2){
                let target=new TG_TaskTarget();
                target.Target=info.Target;
                target.Num=info.Num;
                target.Cur=info.Cur;
                this.BTaskTargets.push(target);
            }
            if(this.IsElementLimit1){
                this.BDefeatTaskTargets1=[];
                for(let info of TG_Stage.BLimitTargets1){
                    let target=new TG_TaskTarget();
                    target.Target=info.Target;
                    target.Num=info.Num;
                    target.Cur=info.Cur;
                    this.BDefeatTaskTargets1.push(target);
                }
            }
            if(this.IsElementLimit2){
                this.BDefeatTaskTargets2=[];
                for(let info of TG_Stage.BLimitTargets2){
                    let target=new TG_TaskTarget();
                    target.Target=info.Target;
                    target.Num=info.Num;
                    target.Cur=info.Cur;
                    this.BDefeatTaskTargets2.push(target);
                }
            }
        }
    }
    /*监听游戏事件*/
    public initListenEvent(){
        //监听开始页面的开始事件
        App.MessageCenter.addListener(Msg.Event.BeginGame2,this.beginPanelStartEvent,this);

        //监听开始页面的开始事件
        App.MessageCenter.addListener(Msg.Event.CreateHairBall,this.createHairBall,this);

    }
    /**
     * 黑色块消失后开始创建新的白色毛球
     * @param pos
     */
    public createHairBall(pos) {
        // let row = pos.Y;
        // let col = pos.X;
        // console.info(row+"====333==="+col);
        // 是否在生产一个白色方块
        let blockLst = this.canGeneOneBlockLst(pos);
        console.log(blockLst);
        if (blockLst.length > 0) {
            let oneBlock:TG_ItemEffect = blockLst[Math.floor(Math.random() * blockLst.length)] as TG_ItemEffect;
            let layerId = "7001"
            // GamePanel_ItemSp.getInstance().createItemEffect(layerId,oneBlock.SitePos.Y,oneBlock.SitePos.X,Msg.EffectType.ET_none);
            if(oneBlock)
                oneBlock.CreateHair();
        }
    }

    /**
     * 根据块位置查看当前块能否向周围生成其他块
     * @param pos
     */
    public canGeneOneBlockLst(pos) {
        let row = pos.Y;
        let col = pos.X;
        let topItemIndex=this.GetTopItem(this.GetIndexByPos(row,col));
        let letItemIndex=this.GetLeftItem(this.GetIndexByPos(row,col));
        let rightItemIndex=this.GetRightItem(this.GetIndexByPos(row,col));
        let bottomItemIndex=this.GetBottomItem(this.GetIndexByPos(row,col));
        let topItem = this.GetItemByIndex(topItemIndex);
        let letItem = this.GetItemByIndex(letItemIndex);
        let rightItem = this.GetItemByIndex(rightItemIndex);
        let bottomItem = this.GetItemByIndex(bottomItemIndex);
        let tgItemLst:Array<TG_Item> = [];
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
    }
    //棋盘掉落
    public static IsBeginPanelStartDrop=false;//是否是开始时的自动掉落
    public static IsPlayerHasTouched=false;//玩家是否有操作

    public static IsPlayerDoMoveForHasPea1 = false;//月饼坑
    public static IsPlayerDoMoveForHasPea2 = false;//月饼坑
    public static IsPlayerDoMoveForFlowIceLogic = false;//流沙
    public static IsPlayerDoMoveForVenomInfect = false;//小恶魔
    public static IsPlayerDoMoveForChangeColorBlock = false;//变色块
    public static IsPlayerDoMoveForHairBallMove = false;//毛球
    public static IsPlayerDoMoveForBelts = false;
    public static IsPlayerDoMove = false;//是否是玩家的操作行为 是否是玩家主动移动 玩家第一次开始移动
    public static IsPlayerDoMoveFinished = false;// 玩家操作后移动完成并且可以消除和掉落的操作 该变量作用在传送带操作完成前起作用
    public static IsPlayerDoMoveByEgg = false;// 是否是鸡蛋块的玩家操作行为

    public m_Status=0;//当前游戏状态
    public isAFirst=false;//A是否是先手
    private beginPanelStartEvent(){
        if(TG_Stage.SingelModel){
            //单人模式
            this.m_Status=GameStatus.GS_ARound;
        }else {
            this.m_Status = Math.floor(Math.random()*2) == 0 ? GameStatus.GS_ARound : GameStatus.GS_BRound;
        }
        this.isAFirst = this.m_Status == GameStatus.GS_ARound;
        Log.getInstance().trace("游戏开始 当前回合为"+this.m_Status);
        this.SurplusTime = TG_Stage.TimeLimitLength;
        let obj=this.doBeginGame_Roll();
        if(!TG_Stage.IsTimeLimit){
            if(obj.needBrowseChessboard){
                //需要棋盘滚动
                Log.getInstance().trace("开始游戏的棋盘滚动总时间:"+obj.browseLineTime);
                //监听移除开始游戏滚动多余元素
                App.MessageCenter.addListener(Msg.Event.cleatDoStartDrop,this.cleatDoStartDrop,this);
            }else {
                App.MessageCenter.dispatch(Msg.Event.CreateGameItem);
                App.TimerManager.doTimer(500,1,this.doStartDrop,this);
            }
        }else {
            //时间模式 不需要滚动
            if(!obj.needBrowseChessboard){
                App.MessageCenter.dispatch(Msg.Event.CreateGameItem);
                this.cleatDoStartDrop();
            }else {
                //监听移除开始游戏滚动多余元素
                App.MessageCenter.addListener(Msg.Event.cleatDoStartDrop,this.cleatDoStartDrop,this);
            }
        }
    }
    private cleatDoStartDrop(){
        if(TG_Stage.IsTimeLimit){
            //时间模式
            App.MessageCenter.dispatch(Msg.Event.StartTimeLimitCountdown);
            App.MessageCenter.addListener(Msg.Event.StopTimeLimitCountdown,this.timeLimitDoStartDrop,this);
        }else {
            App.TimerManager.remove(this.doStartDrop,this);
            this.doStartDrop();
        }
    }
    /*时间模式下开始执行掉落*/
    public timeLimitDoStartDrop(){
        TG_Game.SetGameState(true);
        this.doStartDrop();
        //开始时间模式的倒计时
        this.doGameCutTime();
    }
    /*检测棋盘是否需要滚动*/
    public doBeginGame_Roll(){
        let obj={
            "needBrowseChessboard":false,
            "browseLineTime":0
        };
        let stageData = TG_MapData.getInstance().stageData.Stage;
        //检测是否可以滚动
        let totalLine = stageData.Blocks.length / this.ColNum;
        let needBrowseChessboard = totalLine > this.RowNum;
        //滚动行数
        let browseLineNum = totalLine - this.RowNum;
        //滚动所需时间
        let browseLineTime = browseLineNum * TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay)+ 500;
        if(needBrowseChessboard){
            //棋盘开始滚动
            TG_Game.SetGameState(false);
            App.MessageCenter.dispatch(Msg.Event.BrowseGameBeginRoll,browseLineNum);
        }
        obj.needBrowseChessboard=needBrowseChessboard;
        obj.browseLineTime=browseLineTime;
        return obj;
    }
    /**
     *
     *为鸡蛋块爆炸生成新的普通元素块
     *
     */
    public createElementItemForEgg(layerid,origin,effectType=Msg.EffectType.ET_none) {
        let color = Number(layerid) % 10;
        let targetElementLst = this.getEggTargetElements(color);
        // Log.getInstance().trace(targetElementLst,0);
        for (let oneIndex in targetElementLst) {
            let oneItem = targetElementLst[oneIndex];
            GamePanel_ItemSp.getInstance().createElementItemForEgg(layerid,origin,oneItem.SitePos.Y,oneItem.SitePos.X,effectType);
        }
    }
    public getEggTargetElements(color:number):Array<TG_Item> {
        let items = TG_Game.Items;
        let targetElementLsts = [];
        let indexLsts = [];
        let number =0;
        while (targetElementLsts.length < 3 && number < 30) {
            number ++;
            let oneItemsIndex = Math.floor((Math.random() * items.length));
            let oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_NORMAL) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts,oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        let number2 = 0;
        while (targetElementLsts.length < 3 && number2 < 30) {
            number2 ++;
            let oneItemsIndex = Math.floor((Math.random() * items.length));
            let oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts,oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        let number3 = 0;
        while (targetElementLsts.length < 3 && number3 < 30) {
            number3 ++;
            let oneItemsIndex = Math.floor((Math.random() * items.length));
            let oneItems = TG_Game.Items[oneItemsIndex];
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                if (!this.CheckHasHighItems(oneItemsIndex) && oneItems.Color != color) {
                    if (!TsList.contains(indexLsts,oneItemsIndex)) {
                        indexLsts.push(oneItemsIndex);
                        targetElementLsts.push(oneItems);
                    }
                }
            }
        }
        return targetElementLsts;
    }

    private geneElementTemp(setColorNumElement,setColorNumElementTemp) {
        for (let i in setColorNumElement) {
            setColorNumElementTemp[i] = setColorNumElement[i];
        }
    }
    /* 随机块生成某个具体方块 */
    public geneSpecByRandom(setColorNumElement:Array<number>=[1,2,3,4,5,6]) {
        let setColorNumElementTemp = [];
        this.geneElementTemp(setColorNumElement,setColorNumElementTemp);
        // 统一生成随机方块
        let blocksDataTemp = TG_MapData.getInstance().blocksDataTemp;
        for (let oneBlocks in blocksDataTemp) {
            let blocksData = blocksDataTemp[oneBlocks];
            if (blocksData.isRandom == 1) {// 是随机数
                // 如果是随机数块则生成一个不可三连消除的随机数块 横联三个相同块 竖联三个相同块 田字块
                let oneRandomNum = this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElementTemp);
                blocksData.layerId = oneRandomNum;
            }
            this.geneElementTemp(setColorNumElement,setColorNumElementTemp);
        }
    }
    /**
     * 只有layerId 以2开头才有可能出现随机块
     * @param blocksDataTemp
     * @param blocksData
     * @returns {any}
     */
    private geneRandomNum(blocksDataTemp,blocksData:TG_Blocks,setColorNumElement:Array<number>=[1,2,3,4,5,6]) {
        let layerId = blocksData.getLayerId();
        // let endNum = Math.floor(layerId/10) * 10 + Math.round(Math.random()*(6-1) +1);
        if (!setColorNumElement || setColorNumElement.length==0) {
            return null;
        }
        let index = Math.floor(Math.random() * setColorNumElement.length);
        if (setColorNumElement.length == 1) {
            return Math.floor(layerId/10) * 10 + setColorNumElement[index];
        }
        let endNum = Math.floor(layerId/10) * 10 + setColorNumElement[index];
        setColorNumElement.splice(index,1);
        let row = blocksData.getRow();
        let col = blocksData.getCol();
        let cellNum = blocksData.getCellNum();
        // 棋盘行号
        let rowNum = TG_MapData.getInstance().rowNum;
        // 横向检查 三个块横排检查
        // 前两个块和其组合不能组成消除块
        if (col >=2 && col <= 8) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let left2BlocksData = blocksDataTemp[cellNum-2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和后面的两个固定块一起组成消除块
        if (col <= 6) {
            let right1BlocksData = blocksDataTemp[cellNum+1];
            let right2BlocksData = blocksDataTemp[cellNum+2];
            if (right1BlocksData.isRandom == 0 && right2BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和后面一个固定块 前面一个块 组成消除块
        if (col>=1 && col <=7) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let right1BlocksData = blocksDataTemp[cellNum+1];
            if (right1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }

        // 纵向检查 三个块竖排检查
        // 和上面两个块组成消除块
        if (row >=2 && row <= 8) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let top2BlocksData =  blocksDataTemp[cellNum-2*rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和上面一个块 下面一个固定块 组成消除块
        if (row >=1 && row <=7) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let bottom1BlocksData =  blocksDataTemp[cellNum+rowNum];
            if (bottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和下面两个固定块 组成消除块
        if (row >=0 && row <=6 ) {
            let bottom1BlocksData =  blocksDataTemp[cellNum+rowNum];
            let bottom2BlocksData =  blocksDataTemp[cellNum+2 * rowNum];
            if (bottom1BlocksData.isRandom == 0 && bottom2BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom2BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 纵向和横向 都考虑 四个方块组成田子块检查
        // 左上方
        if(row>=1 && col >=1 && row <=8 && col <= 8) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let lefttop1BlocksData = blocksDataTemp[cellNum-rowNum-1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(lefttop1BlocksData.layerId))  {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 右上方
        if (row>=1 && col >=0 && row <=8 && col <=7) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let rightTop1BlocksData = blocksDataTemp[cellNum-rowNum+1];
            let right1BlocksData = blocksDataTemp[cellNum+1];
            if (right1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightTop1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }

        // 右下方
        if (row>= 0 && col >=0 && row <=7 && col <=7) {
            let right1BlocksData = blocksDataTemp[cellNum + 1];
            let bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            let rightBottom1BlocksData = blocksDataTemp[cellNum + rowNum + 1];
            if (right1BlocksData.isRandom ==0 && bottom1BlocksData.isRandom == 0 && rightBottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightBottom1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 左下方
        if (row>= 0 && col >=1 && row <=7 && col <=8) {
            let left1BlocksData = blocksDataTemp[cellNum - 1];
            let bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            let leftBottom1BlocksData = blocksDataTemp[cellNum + rowNum - 1];
            if (leftBottom1BlocksData.isRandom == 0 && bottom1BlocksData.isRandom == 0 && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(leftBottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId)) {
                return this.geneRandomNum(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        return endNum;
    }
    /**
     * 只有layerId 以2开头才有可能出现随机块
     * @param blocksDataTemp
     * @param blocksData
     * @returns {any}
     */
    private geneRandomNum2(blocksDataTemp,blocksData:TG_Blocks,setColorNumElement:Array<number>=[1,2,3,4,5,6]) {
        let layerId = blocksData.getLayerId();
        // let endNum = Math.floor(layerId/10) * 10 + Math.round(Math.random()*(6-1) +1);
        if (!setColorNumElement || setColorNumElement.length==0) {
            return null;
        }
        let index = Math.floor(Math.random() * setColorNumElement.length);
        if (setColorNumElement.length == 1) {
            return Math.floor(layerId/10) * 10 + setColorNumElement[index];
        }
        let endNum = Math.floor(layerId/10) * 10 + setColorNumElement[index];
        setColorNumElement.splice(index,1);
        let row = blocksData.getRow();
        let col = blocksData.getCol();
        let cellNum = blocksData.getCellNum();
        // 棋盘行号
        let rowNum = TG_MapData.getInstance().rowNum;
        // 横向检查 三个块横排检查
        // 前两个块和其组合不能组成消除块
        if (col >=2 && col <= 8) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let left2BlocksData = blocksDataTemp[cellNum-2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和后面的两个固定块一起组成消除块
        if (col <= 6) {
            let right1BlocksData = blocksDataTemp[cellNum+1];
            let right2BlocksData = blocksDataTemp[cellNum+2];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和后面一个固定块 前面一个块 组成消除块
        if (col>=1 && col <=7) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let right1BlocksData = blocksDataTemp[cellNum+1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }

        // 纵向检查 三个块竖排检查
        // 和上面两个块组成消除块
        if (row >=2 && row <= 8) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let top2BlocksData =  blocksDataTemp[cellNum-2*rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和上面一个块 下面一个固定块 组成消除块
        if (row >=1 && row <=7) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let bottom1BlocksData =  blocksDataTemp[cellNum+rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 和下面两个固定块 组成消除块
        if (row >=0 && row <=6 ) {
            let bottom1BlocksData =  blocksDataTemp[cellNum+rowNum];
            let bottom2BlocksData =  blocksDataTemp[cellNum+2 * rowNum];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom2BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 纵向和横向 都考虑 四个方块组成田子块检查
        // 左上方
        if(row>=1 && col >=1 && row <=8 && col <= 8) {
            let left1BlocksData = blocksDataTemp[cellNum-1];
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let lefttop1BlocksData = blocksDataTemp[cellNum-rowNum-1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(lefttop1BlocksData.layerId))  {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 右上方
        if (row>=1 && col >=0 && row <=8 && col <=7) {
            let top1BlocksData = blocksDataTemp[cellNum-rowNum];
            let rightTop1BlocksData = blocksDataTemp[cellNum-rowNum+1];
            let right1BlocksData = blocksDataTemp[cellNum+1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(top1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightTop1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }

        // 右下方
        if (row>= 0 && col >=0 && row <=7 && col <=7) {
            let right1BlocksData = blocksDataTemp[cellNum + 1];
            let bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            let rightBottom1BlocksData = blocksDataTemp[cellNum + rowNum + 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(right1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(rightBottom1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        // 左下方
        if (row>= 0 && col >=1 && row <=7 && col <=8) {
            let left1BlocksData = blocksDataTemp[cellNum - 1];
            let bottom1BlocksData = blocksDataTemp[cellNum + rowNum];
            let leftBottom1BlocksData = blocksDataTemp[cellNum + rowNum - 1];
            if (this.getLayerEndNum(endNum) == this.getLayerEndNum(bottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(leftBottom1BlocksData.layerId) && this.getLayerEndNum(endNum) == this.getLayerEndNum(left1BlocksData.layerId)) {
                return this.geneRandomNum2(blocksDataTemp,blocksData,setColorNumElement);
            }
        }
        return endNum;
    }
    /**
     * 获取数字个位数字
     *
     * @param layerId
     * @returns {Number}
     */
    public getLayerEndNum(layerId) {
        let layerEndNum = Number(layerId % 10);
        return layerEndNum;
    }
    /*是否可以进行交换位置*/
    public IsCanExchange(row1,col1,row2,col2,needNeighbor=true){
        this.m_FisrtMarkRemove=true;
        this.m_FirstLink = false;
        let isCanExchange=false;
        let item = this.GetItemByPos(row1,col1);
        let destItem =  this.GetItemByPos(row2,col2);
        if (item == null||destItem == null||item==undefined||destItem==undefined){
            isCanExchange=false;
        }
        if (needNeighbor && !this.checkIsNeighbor(row1,col1,row2,col2)){
            isCanExchange=false;
        }
        let tempList=[];
        /*检查横向*/
        this.getRowChain(item, tempList);
        if (tempList.length >= 3){
            isCanExchange=true;
        }
        tempList=[];
        this.getRowChain(destItem, tempList);
        if (tempList.length >= 3){
            isCanExchange=true;
        }
        tempList=[];
        /*检查纵向*/
        this.getColChain(item, tempList);
        if (tempList.length>= 3){
            isCanExchange=true;
        }
        tempList=[];
        this.getColChain(destItem, tempList);
        if (tempList.length>= 3){
            isCanExchange=true;
        }
        //是否可以形成鸟
        if(this.CheckBird(item) || this.CheckBird(destItem)){
            isCanExchange=true;
        }
        //是否有栏杆
        let isRailing=false;
        if (needNeighbor && !this.CheckRailingCouldMove(item,destItem)){
            isCanExchange=false;
            isRailing=true;
        }
        //是否有铁丝网或者云层
        let idMeshOrCloud=false;
        if (!item.CheckCellCouldMove() || !destItem.CheckCellCouldMove()) {
            isCanExchange=false;
            idMeshOrCloud=true;
        }
        Log.getInstance().trace("是否可以交换位置======================================================"+isCanExchange);
        if(item.IsItemEffect()&&destItem.IsItemEffect()&&!isRailing&&!idMeshOrCloud){
            //两个都是特效块
            //减少步数
            this.ReduceStep();
            this.doSwapSpecialNeighbor(item, destItem);
        }else if ((item.IsEffectBlack() || destItem.IsEffectBlack())&&!isRailing&&!idMeshOrCloud){
            //如果有一块是黑洞
            //减少步数
            this.ReduceStep();
            this.doSwapBlackAndNormal(item, destItem);
        }else if(isCanExchange){
            //交换位置
            if(!this.DoExchange(row1,col1,row2,col2)){
                Log.getInstance().trace("DoExchange 不能交换,方块还原之前位置");
                GamePanel_ItemSp.getInstance().restorePositionMove();
            }else {
                Log.getInstance().trace("DoExchange 可以执行消除");
                //交换两个普通方块
                //减少步数
                this.ReduceStep();
                this.doSwapNeighbor(row1,col1,row2,col2);
            }
        }else{
            TG_Game.IsPlayerDoMove = false;//是否玩家移动
            TG_Game.IsPlayerDoMoveForHasPea1 = false;//月饼坑
            TG_Game.IsPlayerDoMoveForHasPea2 = false;//月饼坑
            TG_Game.IsPlayerDoMoveForFlowIceLogic = false;//流沙
            TG_Game.IsPlayerDoMoveForVenomInfect = false;//小恶魔
            TG_Game.IsPlayerDoMoveForChangeColorBlock = false;//变色块
            TG_Game.IsPlayerDoMoveForHairBallMove = false;//毛球
            TG_Game.IsPlayerDoMoveForBelts = false;//传送带
            //不可以进行交换位置（调用GamePanel_ItemSp的还原位置 restorePositionMove)
            GamePanel_ItemSp.getInstance().restorePositionMove();
        }
    }
    /*检测是否为相邻*/
    private checkIsNeighbor(row1,col1,row2,col2){
        let isNeighbor=false;
        if(row1==row2&&Math.abs(col1-col2)==1){
            isNeighbor=true;
        }
        if(col1==col2&&Math.abs(row1-row2)==1){
            isNeighbor=true;
        }
        return isNeighbor;
    }
    /*检测是否有栏杆*/
    private CheckRailingCouldMove(des,target) {
        if(des==null||des==undefined||target==null||target==undefined){
            return true;
        }
        let desIndex=this.GetIndexByPos(des.SitePos.Y,des.SitePos.X);
        let targetIndex=this.GetIndexByPos(target.SitePos.Y,target.SitePos.X);

        let railing =this.GetRailingItemByIndex(desIndex);
        let direction = this.getDirection(desIndex,targetIndex);
        if(railing){
            if(railing.CheckStopMove(direction))return false;
        }
        railing=this.GetRailingItemByIndex(targetIndex);
        direction = this.getDirection(targetIndex, desIndex);
        if(railing){
            if(railing.CheckStopMove(direction)) return false;
        }
        return true;
    }
    /*是否可以移动*/
    public CheckCellCouldMove(item){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if(index<0||index>this.ColNum*this.RowNum-1){
            return false;
        }
        let mesh=this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh()&&!mesh.getItemNone()) {
            return false;
        }
        let  cloud = this.GetCloudItemByIndex(index);
        if (cloud.IsCloud()&&!cloud.getItemNone()) {
            return false;
        }
        return true;
    }
    /*块交换 最外层接口*/
    private _aExItem;//玩家移动的Item
    private _bExItem;//玩家移动的Item
    public DoExchange(row1,col1,row2,col2){
        var isCanExchange=true;
        if(row1<0||col1<0||row2<0||col2<0){
            isCanExchange=false;
        }
        let aItem= this.GetItemByPos(row1,col1);
        let bItem= this.GetItemByPos(row2,col2);
        if(aItem==null||bItem==null){
            isCanExchange=false;
        }
        this._aExItem=aItem;
        this._bExItem=bItem;
        //检测是否相邻
        if(!this.checkIsNeighbor(row1,col1,row2,col2)){
            isCanExchange=false;
        }
        aItem.SetMoveItem(true);
        bItem.SetMoveItem(true);
        return isCanExchange;
    }
    /*交换两个普通方块*/
    private doSwapNeighbor(row1,col1,row2,col2){
        //改变两个方块的位置
        this._explosiveType = 0;
        this.SwapItem(row1,col1,row2,col2);
        this.OnExchangeFinish();
    }
    /// 当前爆炸类型,0是普通块 1 黑洞 2 两个特殊块,3 黑洞加条消
    private  _explosiveType = 0;
    /*黑洞和普通块交换的具体逻辑*/
    private doSwapBlackAndNormal(aItem,bItem){
        this._explosiveType = 1;
        this.SwapItem(aItem.SitePos.Y,aItem.SitePos.X,bItem.SitePos.Y,bItem.SitePos.X);
        this._aExItem=aItem;
        this._bExItem=bItem;
        this.OnExchangeFinish();
    }
    /*交换的两个块都是特效块*/
    private doSwapSpecialNeighbor(aItem,bItem){
        this._explosiveType=2;
        let effectValue=this.GetEffectValue(aItem,bItem);
        // 黑洞+横消 或 黑洞+竖消 或 黑洞+炸弹 或 黑洞+风车
        if(effectValue==11||effectValue==12||effectValue==15||effectValue==30){
            this._explosiveType=3;
        }
        this.SwapItem(aItem.SitePos.Y,aItem.SitePos.X,bItem.SitePos.Y,bItem.SitePos.X);
        this._aExItem=aItem;
        this._bExItem=bItem;
        this.OnExchangeFinish();
    }
    /*判断是否为两个黑洞特效的交换*/
    private IsBBEffectExchange(aItem,bItem){
        if(!aItem.IsItemEffect()||!bItem.IsItemEffect()){
            return false;
        }
        let effectValue=aItem.GetEffectType()+bItem.GetEffectType();
        if(effectValue==20){
            return true;
        }
        return false;
    }
    /*改变两个方块的位置*/
    private SwapItem(row1,col1,row2,col2){
        //移除当前选中状态的方块
        GamePanel_ItemSp.getInstance().removeCurrentSetRect();
    }
    /*检测是否有高层快*/
    public CheckHasHighItems(index){
        if(index<0||index>this.ColNum*this.RowNum-1){
            return false;
        }
        //云层块
        let cloud=this.GetCloudItemByIndex(index);
        if(!cloud.getItemNone()){
            return true;
        }
        //铁丝网块
        let mesh=this.GetMeshItemByIndex(index);
        if(!mesh.getItemNone()){
            return true;
        }

        let item = this.GetHairBallItemByIndex(index);
        if(item.venonatId > 0) {
            return true;
        }
        return false;
    }
    /*获取高层块*/
    public GetHighItems(index){
        let temp=null;
        if(index<0||index>this.ColNum*this.RowNum-1){
            temp=null;
            return temp;
        }
        //云层块
        let cloud=this.GetCloudItemByIndex(index);
        if(!cloud.getItemNone()){
            temp=cloud;
            return temp;
        }
        //铁丝网块
        let mesh=this.GetMeshItemByIndex(index);
        if(!mesh.getItemNone()){
            temp=mesh;
            return temp;
        }
        //毛球所在元素块对象
        let item=this.GetHairBallItemByIndex(index);
        if(!item.getItemNone()){
            temp=item;
            return temp;
        }
        return temp;
    }
    /*交换完毕-----开始消除 重复调用这里*/
    public static IsCanGoonRemove=false;
    private OnExchangeFinish(){
        if(this._explosiveType==1){
            // 黑洞与普通块
            this.m_FisrtMarkRemove = false;
            let color=-1;
            let pos;
            if(this._aExItem.IsEffectBlack()){
                color=this._bExItem.GetColorType();
                pos=this._aExItem.GetSitPos();
            }else {
                color=this._aExItem.GetColorType();
                pos=this._bExItem.GetSitPos();
            }
            this.AddScore(ScoreType.ST_Normal_Black);

            let aItemIndex = this.GetIndexByPos(this._aExItem.SitePos.Y,this._aExItem.SitePos.X);
            let bItemIndex = this.GetIndexByPos(this._bExItem.SitePos.Y,this._bExItem.SitePos.X);
            let aButton = this.GetButtonItemByIndex(aItemIndex);
            let bButton = this.GetButtonItemByIndex(bItemIndex);
            let infectArr = [];
            infectArr.push(this._aExItem);
            infectArr.push(this._bExItem);
            if(aButton.IsFect || bButton.IsFect){
                this.SuperEffectInfect(2,infectArr);
            }
            this.SpecialExplodeBlack(pos,color);
        }else if(this._explosiveType==2){
            // 除黑洞外的特效块
            this.m_FisrtMarkRemove = false;
            let isBB = this.IsBBEffectExchange(this._aExItem,this._bExItem);
            this.doSuperEffectExplode(this._aExItem, this._bExItem);
            let delayTime=TG_Game.MaxdropDelay;
        }else if(this._explosiveType==3){
            this.m_FisrtMarkRemove = false;
            //黑洞与条形  黑洞与小鸟 黑洞与炸弹  发射子弹逻辑
            this.doSuperEffectExplode(this._aExItem,this._bExItem);
        }else{
            this.doCheckMoved();
        }
    }
    /*消除逻辑*/
    public doRemove(){
        let isSineRect=this.DoAddMark();//
        Log.getInstance().trace("是否已经对方块打过标签======"+isSineRect);
        let blnHasEffect=false;//是否形成特效块
        let exsitExplode = false;//是否有爆炸消除
        let isPass3Hor = false;//是否是横向4连
        let isPass3Vel = false;//是否是纵向4连
        let isBlack = false;//是否是黑洞
        let isBird = false;//是否是鸟 fish ==田字形成
        if(isSineRect){
            //黑洞
            for(let row=this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    let item= this.GetItemByPos(row,col);
                    if(item.GetMarkedHor()>=5||item.GetMarkedVel()>=5&&item.CheckMatchSpecial()){
                        exsitExplode = this.FindBlack(item) || exsitExplode;
                        blnHasEffect = true;
                        isBlack = true;
                    }
                }
            }
            //炸弹
            for(let row=this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    let item= this.GetItemByPos(row,col);
                    if(item.GetMarkedHor()>=3&&item.GetMarkedVel()>=3&&item.CheckMatchSpecial()){
                        exsitExplode = this.FindGold(item) || exsitExplode;
                        blnHasEffect=true;
                    }
                }
            }
            //纵向4连
            for(let row =this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    let item= this.GetItemByPos(row,col);
                    if(item.GetMarkedVel()>3&&item.CheckMatchSpecial()){
                        exsitExplode = this.FindVelEffect(item) || exsitExplode;
                        blnHasEffect=true;
                        isPass3Vel=true;
                    }
                }
            }
            //横向4连
            for(let row =this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    let item= this.GetItemByPos(row,col);
                    if(item.GetMarkedHor()>3&&item.CheckMatchSpecial()){
                        exsitExplode = this.FindHorEffect(item) || exsitExplode;
                        blnHasEffect=true;
                        isPass3Hor=true;
                    }
                }
            }
            //风车
            for(let row=this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    let item= this.GetItemByPos(row,col);
                    if(item.CheckMatchSpecial()&&item.GetMarkedHor()>=2&&item.GetMarkedVel()>=2
                        &&this.CheckBird(item)){
                        exsitExplode = this.FindBirdEffect(item) || exsitExplode;
                        blnHasEffect=true;
                        isBird=true;
                    }
                }
            }
            // 纵向3连
            let edVer=[];
            for(let row =this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    edVer=[];
                    let item= this.GetItemByPos(row,col);
                    let color=item.GetColorType();
                    let index=this.GetIndexByPos(row,col);
                    edVer.push(item);
                    if(item.GetMarkedVel()>=3&&this.CheckAddMark(item)&&item.CheckMatchSpecial()){
                        let topIndex=this.GetTopItem(index);
                        let topTopIndex=this.GetTopItem(topIndex);
                        if(topIndex<0||topTopIndex<0) continue;
                        let topItem=this.GetItemByIndex(topIndex);
                        let topTopItem=this.GetItemByIndex(topTopIndex);
                        if(topItem.GetColorType()==color&&this.CheckAddMark(topItem)){
                            edVer.push(topItem);
                        }
                        if(topTopItem.GetColorType()==color&&this.CheckAddMark(topTopItem)){
                            edVer.push(topTopItem);
                        }
                        if (edVer.length < 3) continue;
                        if(!isPass3Hor&&!isPass3Vel&&!isBlack &&!isBird){

                        }
                        exsitExplode=true;
                        for(let temp of edVer){
                            temp.MarkedAlready=true;
                        }
                        //传染块逻辑
                        this.CheckInfect(edVer,false,0);
                        for(let temp of edVer){
                            if(!temp.GetExploding()){
                                temp.DoExplode();
                            }
                        }

                    }
                }
            }
            //横向3连
            let edHor=[];
            for(let row =this.ColNum-1;row>=0;row--){
                for(let col=0;col<this.RowNum;col++){
                    edHor=[];
                    let item= this.GetItemByPos(row,col);
                    let color=item.GetColorType();
                    let index=this.GetIndexByPos(row,col);
                    edHor.push(item);
                    if(item.GetMarkedHor()>=3&&this.CheckAddMark(item)&&item.CheckMatchSpecial()){
                        let rightIndex=this.GetRightItem(index);
                        let rightRightIndex=this.GetRightItem(rightIndex);
                        if(rightIndex<0||rightRightIndex<0) continue;
                        let rightItem=this.GetItemByIndex(rightIndex);
                        let rightRightItem=this.GetItemByIndex(rightRightIndex);
                        if(rightItem.GetColorType()==color&&this.CheckAddMark(rightItem)){
                            edHor.push(rightItem);
                        }
                        if(rightRightItem.GetColorType()==color&&this.CheckAddMark(rightRightItem)){
                            edHor.push(rightRightItem);
                        }
                        if (edHor.length < 3) continue;
                        if(!isPass3Hor&&!isPass3Vel&&!isBlack&&!isBird){

                        }
                        exsitExplode=true;
                        for(let temp of edHor){
                            temp.MarkedAlready=true;
                        }
                        //传染块逻辑 异步执行
                        this.CheckInfect(edHor,false,0);
                        for(let temp of edHor){
                            if(!temp.GetExploding()){
                                //执行爆炸
                                temp.DoExplode();
                            }
                        }
                    }
                }
            }
        }
        if (this.m_FisrtMarkRemove && blnHasEffect){
            this.m_FirstLink = true;
        }
        return exsitExplode;
    }

    /*黑洞*/
    private FindBlack(item){
        Log.getInstance().trace("+++++++++++FindBlack++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let color=item.GetColorType();
        let toFindSpecial=[item];
        //向上找
        let nIndex=index;
        for(let i=0;i<4;i++){
            nIndex=this.GetTopItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                toFindSpecial.push(temp);
            }else {
                break;
            }
        }
        if(toFindSpecial.length<4){
            toFindSpecial=[];
            toFindSpecial.push(item);
            nIndex=index;
            //向右找
            for(let i=0;i<4;i++){
                nIndex=this.GetRightItem(nIndex);
                if(nIndex==-1) break;
                let temp=this.GetItemByIndex(nIndex);
                if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                    toFindSpecial.push(temp);
                }else {
                    break;
                }
            }
        }
        if(toFindSpecial.length<5){
            toFindSpecial=[];
            Log.getInstance().trace("FindBlack toFindSpecial count error");
            return false;
        }
        for(let temp of toFindSpecial){
            temp.MarkedAlready=true;
        }
        //默认第二个
        let spIndex=2;
        for(let i=0;i<toFindSpecial.length;i++){
            let temp=toFindSpecial[i];
            if(temp.GetMoveItem()){
                spIndex=i;
                break;
            }
        }
        let fItem=toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc=true;
        //传染块逻辑

        this.CheckInfect(toFindSpecial,false,3);

        for(let temp of toFindSpecial){
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateBlack);
        //生成黑洞
        let layerid=2098;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid,fItem.SitePos.Y,fItem.SitePos.X,Msg.EffectType.ET_Black);

        toFindSpecial=[];
        return true;
    }

    /*风车*/
    private FindBirdEffect(item){
        Log.getInstance().trace("+++++++++++FindBirdEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let color=item.GetColorType();
        let toFindSpecial=[item];
        //右
        let nIndex=this.GetRightItem(index);
        if(nIndex!=-1){
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetMarkedHor()>=2&&temp.GetMarkedVel()>=2&&this.CheckAddMark(temp)&&temp.GetColorType()==color){
                toFindSpecial.push(temp);
            }
        }
        //上
        nIndex=this.GetTopItem(index);
        if(nIndex!=-1){
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetMarkedHor()>=2&&temp.GetMarkedVel()>=2&&this.CheckAddMark(temp)&&temp.GetColorType()==color){
                toFindSpecial.push(temp);
            }
        }
        nIndex=this.GetTopRightItem(index);
        if(nIndex!=-1){
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetMarkedHor()>=2&&temp.GetMarkedVel()>=2&&this.CheckAddMark(temp)&&temp.GetColorType()==color){
                toFindSpecial.push(temp);
            }
        }
        //上上
        nIndex=this.GetTopItem(this.GetTopItem(index));
        if(nIndex!=-1){
            let temp=this.GetItemByIndex(nIndex);
            if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                toFindSpecial.push(temp);
            }
        }
        //上上右
        if(toFindSpecial.length<5){
            nIndex=this.GetRightItem(nIndex);
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右
        if(toFindSpecial.length<5){
            nIndex=this.GetRightItem(this.GetRightItem(index));
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右上
        if(toFindSpecial.length<5){
            nIndex=this.GetTopItem(nIndex);
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //左
        if(toFindSpecial.length<5){
            nIndex=this.GetLeftItem(index);
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //左上
        if(toFindSpecial.length<5){
            nIndex=this.GetTopItem(this.GetLeftItem(index));
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //下
        if(toFindSpecial.length<5){
            nIndex=this.GetBottomItem(index);
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //下右
        if(toFindSpecial.length<5){
            nIndex=this.GetBottomRightItem(index);
            if(nIndex!=-1){
                let temp=this.GetItemByIndex(nIndex);
                if(this.CheckAddMark(temp)&&temp.GetColorType()==color){
                    toFindSpecial.push(temp);
                }
            }
        }
        //找到4个字方块，再判断周边有无相连
        if(toFindSpecial.length<4){
            Log.getInstance().trace("FindBirdEffect toFindSpecial count error");
            return false;
        }
        for(let temp of toFindSpecial){
            temp.MarkedAlready=true;
        }
        //默认在左下角生成鸟
        let spIndex=0;
        for(let i=0;i<toFindSpecial.length;i++){
            let temp=toFindSpecial[i];
            if(temp.GetMoveItem()){
                spIndex=i;
                break;
            }
        }
        let fItem=toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc=true;

        //传染块逻辑
        this.CheckInfect(toFindSpecial,false,1);

        for(let temp of toFindSpecial){
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateBird)
        //生成风车
        let layerid=2040+color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid,fItem.SitePos.Y,fItem.SitePos.X,Msg.EffectType.ET_Bird);

        toFindSpecial=[];
        return true;
    }
    /*炸弹*/
    private FindGold(item){
        Log.getInstance().trace("+++++++++++FindGold++++++++++++++++");
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let color=item.GetColorType();
        let bombItems=[item];
        //向左找
        let  nIndex=index;
        for(let i=0;i<2;i++){
            nIndex=this.GetLeftItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                bombItems.push(temp);
            }else {
                break;
            }
        }
        //向右找
        nIndex=index;
        for(let i=0;i<2;i++){
            nIndex=this.GetRightItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                bombItems.push(temp);
            }else {
                break;
            }
        }
        //向上找
        nIndex=index;
        for(let i=0;i<2;i++){
            nIndex=this.GetTopItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                bombItems.push(temp);
            }else {
                break;
            }
        }
        //向下找
        nIndex=index;
        for(let i=0;i<2;i++){
            nIndex=this.GetBottomItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                bombItems.push(temp);
            }else {
                break;
            }
        }
        if(bombItems.length<5){
            Log.getInstance().trace("FindGold toFindSpecial count error");
            bombItems=[];
            return false;
        }
        for(let temp of bombItems){
            temp.MarkedAlready=true;
        }

        let isSelfMove=false;
        let effectCreateIndex=0;
        if(this._aExItem != null &&this._bExItem!= null){
            for(let temp of bombItems){
                let itemIdx=this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                effectCreateIndex=itemIdx;
                let _aExItemIndex=this.GetIndexByPos(this._aExItem.SitePos.Y,this._aExItem.SitePos.X);
                let _bExItemIndex=this.GetIndexByPos(this._bExItem.SitePos.Y,this._bExItem.SitePos.X);
                if(effectCreateIndex==_aExItemIndex||effectCreateIndex==_bExItemIndex){
                    isSelfMove=true;
                    temp.MarkedForExplodingCallfunc=true;
                    break;
                }
            }
        }
        if(!isSelfMove){
            item.MarkedForExplodingCallfunc=true;
            let itemIdx=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            effectCreateIndex=itemIdx;
        }
        //传染块逻辑
        this.CheckInfect(bombItems,false,2);

        for(let temp of bombItems){
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateGold);
        //生成炸弹
        let layerid=2030+color;
        let fItem=this.GetItemByIndex(effectCreateIndex);
        GamePanel_ItemSp.getInstance().createItemEffect(layerid,fItem.SitePos.Y,fItem.SitePos.X,Msg.EffectType.ET_Gold);

        bombItems=[];
        return true;
    }
    /*寻找纵向*/
    private FindVelEffect(item){
        Log.getInstance().trace("+++++++++++FindVelEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let color=item.GetColorType();
        let toFindSpecial=[item];
        let nIndex=index;
        //向上找
        for(let i=0;i<3;i++){
            nIndex=this.GetTopItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                toFindSpecial.push(temp);
            }else {
                break;
            }
        }
        //向下找
        nIndex=index;
        for(let i=0;i<3;i++){
            nIndex=this.GetBottomItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                toFindSpecial.push(temp);
            }else {
                break;
            }
        }
        if(toFindSpecial.length<4){
            toFindSpecial=[];
            Log.getInstance().trace("FindVelEffect toFindSpecial count error");
            return false;
        }
        for(let temp of toFindSpecial){
            temp.MarkedAlready=true;
        }
        //默认在最上面生成特效块
        let spIndex=3;
        for(let i=0;i<toFindSpecial.length;i++){
            let temp=toFindSpecial[i];
            if(temp.GetMoveItem()){
                spIndex=i;
                break;
            }
        }
        let fItem=toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc=true;

        //传染块逻辑
        this.CheckInfect(toFindSpecial,false,0);

        for(let temp of toFindSpecial){
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateHor);
        //生成横消块
        let layerid=2010+color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid,fItem.SitePos.Y,fItem.SitePos.X,Msg.EffectType.ET_Hor);
        toFindSpecial=[];
        return true;
    }
    /*寻找横向*/
    private FindHorEffect(item){
        Log.getInstance().trace("+++++++++++FindHorEffect++++++++++++++++");
        Log.getInstance().trace(item.SitePos);
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let color=item.GetColorType();
        let toFindSpecial=[item];
        let nIndex=index;
        //向左找
        for(let i=0;i<3;i++){
            nIndex=this.GetLeftItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                toFindSpecial.push(temp);
            }else {
                break;
            }
        }
        //向右找
        nIndex=index;
        for(let i=0;i<3;i++){
            nIndex=this.GetRightItem(nIndex);
            if(nIndex==-1) break;
            let temp=this.GetItemByIndex(nIndex);
            if(temp.GetColorType()==color&&this.CheckAddMark(temp)){
                toFindSpecial.push(temp);
            }else {
                break;
            }
        }
        if(toFindSpecial.length<4){
            toFindSpecial=[];
            Log.getInstance().trace("FindHorEffect toFindSpecial count error");
            return false;
        }
        for(let temp of toFindSpecial){
            temp.MarkedAlready=true;
        }
        // 默认在最左面生成特效块
        let spIndex = 0;
        for (let i = 0; i < toFindSpecial.length; i++)
        {
            let temp=toFindSpecial[i];
            if(temp.GetMoveItem()){
                spIndex=i;
                break;
            }
        }
        let fItem=toFindSpecial[spIndex];
        fItem.MarkedForExplodingCallfunc=true;

        //传染块逻辑
        this.CheckInfect(toFindSpecial,false,0);

        for(let temp of toFindSpecial){
            //消除方块
            temp.DoExplode();
        }
        //加分数
        this.AddScore(ScoreType.ST_CreateVel);
        //生成纵消块
        let layerid=2020+color;
        GamePanel_ItemSp.getInstance().createItemEffect(layerid,fItem.SitePos.Y,fItem.SitePos.X,Msg.EffectType.ET_Vel);

        toFindSpecial=[];
        return true;
    }
    /*是否可以形成鸟/风车*/
    public CheckBird(item){
        if (!TG_Stage.CanCreateFish){
            return false;
        }
        if(item){
            let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            let color=item.GetColorType();
            if(color<0){
                return false;
            }
            let leftIndex=this.GetLeftItem(index);
            let topIndex=this.GetTopItem(index);
            let topLeftIndex=this.GetTopLeftItem(index);
            if(leftIndex>=0&&topIndex>=0&&topLeftIndex>=0){
                let left=this.GetItemByIndex(leftIndex);
                let top=this.GetItemByIndex(topIndex);
                let topLeft=this.GetItemByIndex(topLeftIndex);
                if(this.CheckAddMark(left)&&this.CheckAddMark(top)&&this.CheckAddMark(topLeft)&&
                    left.GetColorType()==color&&top.GetColorType()==color&&topLeft.GetColorType()==color){
                    return true;
                }
            }
            let bottomIndex=this.GetBottomItem(index);
            let bottomLeftIndex=this.GetBottomLeftItem(index);
            if(leftIndex>=0&&bottomIndex>=0&&bottomLeftIndex>=0){
                let left=this.GetItemByIndex(leftIndex);
                let bottom=this.GetItemByIndex(bottomIndex);
                let bottomLeft=this.GetItemByIndex(bottomLeftIndex);
                if(this.CheckAddMark(left)&&this.CheckAddMark(bottom)&&this.CheckAddMark(bottomLeft)&&
                    left.GetColorType()==color&&bottom.GetColorType()==color&&bottomLeft.GetColorType()==color){
                    return true;
                }
            }
            let rightIndex=this.GetRightItem(index);
            let topRightIndex=this.GetTopRightItem(index);
            if(rightIndex>=0&&topIndex>=0&&topRightIndex>=0){
                let right=this.GetItemByIndex(rightIndex);
                let top=this.GetItemByIndex(topIndex);
                let topRight=this.GetItemByIndex(topRightIndex);
                if(this.CheckAddMark(right)&&this.CheckAddMark(top)&&this.CheckAddMark(topRight)&&
                    right.GetColorType()==color&&top.GetColorType()==color&&topRight.GetColorType()==color){
                    return true;
                }
            }
            let bottomRightIndex=this.GetBottomRightItem(index);
            if(rightIndex>=0&&bottomIndex>=0&&bottomRightIndex>=0){
                let right=this.GetItemByIndex(rightIndex);
                let bottom=this.GetItemByIndex(bottomIndex);
                let bottomRight=this.GetItemByIndex(bottomRightIndex);
                if(this.CheckAddMark(right)&&this.CheckAddMark(bottom)&&this.CheckAddMark(bottomRight)&&
                    right.GetColorType()==color&&bottom.GetColorType()==color&&bottomRight.GetColorType()==color){
                    return true;
                }
            }
            return false;
        }else {
            return false;
        }
    }
    /*特效元素块的爆炸*/
    private doSuperEffectExplode(aItem,bItem){
        if(!aItem.IsItemEffect()||!bItem.IsItemEffect()) return;
        let effItem = aItem;
        let effDest = bItem;
        effItem.SetAlreadyExplode(true);
        effDest.SetAlreadyExplode(true);
        let SuperEffectArr = [];

        SuperEffectArr.push(effItem);
        SuperEffectArr.push(effDest);
        let effItemIndex = this.GetIndexByPos(effItem.SitePos.Y,effItem.SitePos.X);
        let effDestIndex = this.GetIndexByPos(effDest.SitePos.Y,effDest.SitePos.X);
        let effItemButtons = this.GetButtonItemByIndex(effItemIndex);
        let effDestButtons = this.GetButtonItemByIndex(effDestIndex);


        let effectValue=aItem.GetEffectType()+bItem.GetEffectType();
        if(effectValue<5){
            //横消和竖消
            if(effItemButtons.IsFect || effDestButtons.IsFect){
                this.SuperEffectInfect(0,SuperEffectArr);
            }
            this.AddScore(ScoreType.ST_ExplodeHV);
            this.SpecialExplodeSuperHV(effDest.GetSitPos(), effDest.GetColorType(), -1);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay),1,this.doDrop,this);
        }else if(effectValue<10){
            //横消或竖消  与 炸弹
            if(effItemButtons.IsFect || effDestButtons.IsFect){
                this.SuperEffectInfect(0,SuperEffectArr);
            }
            let goldItem=null;
            let detonateColor=0;
            if(effItem.IsEffectGold()){
                goldItem=effItem;
                detonateColor=effDest.GetColorType();
            }else {
                goldItem=effDest;
                detonateColor=effItem.GetColorType();
            }
            this.AddScore(ScoreType.ST_ExplodeGHV);
            this.SpecialExplodeSuperGHV(effDest.GetSitPos(),detonateColor,-1,goldItem)
        }else if(effectValue==10){
            //双炸弹 effDest代表此次移动的块
            if(effItemButtons.IsFect || effDestButtons.IsFect){
                this.SuperEffectInfect(0,SuperEffectArr);
            }
            effDest.SetAlreadyExplode(false);
            effDest.SetSecondBoomSuper(true);
            let color = effDest.GetColorType();
            let infect =-1;
            this.DoDetonate(effItem);
            let position=[effDest.SitePos.X,effDest.SitePos.Y];
            this.doItemDetonate(position,color, infect);
            this.AddScore(ScoreType.ST_ExplodeGG);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay)*2.5,1,this.doDrop,this);
        }else if(effectValue==11||effectValue==12||effectValue==15||effectValue==30){
            // 黑洞加 条消   15//黑洞加炸弹  30//黑洞加鸟
            let type;
            let color = -1;
            let blackItem;
            let blackItemPos={
                "x":0,
                "y":0
            };//形成黑洞的位置 实际坐标
            if (effItem.IsEffectVel() || effItem.IsEffectHor()||effItem.IsEffectGold()||effItem.IsEffectBird()){
                blackItem = effDest;
                type = effItem.GetEffectType();
                color = effItem.GetColorType();
                effItem.isEffectExchangeWithBlack = true;
            }else{
                blackItem = effItem;
                type = effDest.GetEffectType();
                color = effDest.GetColorType();
                effDest.isEffectExchangeWithBlack = true;
            }
            blackItem.isEffectExchangeWithBlack = true;
            //黑洞位置
            let blackVx;
            let blackVy;
            let maxNum;
            if(effDest.SitePos.X!=effItem.SitePos.X){
                //横向移动
                blackVy=effDest.getPosByRowCol(effDest.SitePos.Y,effDest.SitePos.X).y;
                maxNum=Math.max(effDest.SitePos.X,effItem.SitePos.X);
                blackVx=effDest.getPosByRowCol(effDest.SitePos.Y,maxNum).x-effDest.width/2;
            }else {
                //纵向移动
                blackVx=effDest.getPosByRowCol(effDest.SitePos.Y,effDest.SitePos.X).x;
                maxNum=Math.max(effDest.SitePos.Y,effItem.SitePos.Y);
                blackVy=effDest.getPosByRowCol(maxNum,effDest.SitePos.X).y-effDest.height/2;
            }
            blackItemPos.x=blackVx;
            blackItemPos.y=blackVy;
            if(effectValue==30){
                this.AddScore(ScoreType.ST_ExplodeBlackB);
            }else if(effectValue==11){
                this.AddScore(ScoreType.ST_ExplodeBlackHV);
            }else if(effectValue==12){
                this.AddScore(ScoreType.ST_ExplodeBlackG);
            }
            let itemIndex = this.GetIndexByPos(effItem.SitePos.Y,effItem.SitePos.X);
            let destIndex = this.GetIndexByPos(effDest.SitePos.Y,effDest.SitePos.X);
            let itemButton = this.GetButtonItemByIndex(itemIndex);
            let destButton = this.GetButtonItemByIndex(destIndex);
            let infectBlock = this.GetButtonBlockIdByIndex(itemIndex);
            if(itemButton.IsFect || destButton.IsFect){
                if(infectBlock == -1){
                    return;
                }
                let infectArr=  [];
                let infectItemArr = [];
                infectItemArr.push(effItem);
                infectItemArr.push(effDest);
                this.SuperEffectInfect(2,infectItemArr,infectBlock);
                for(let temp of TG_Game.Items){
                    if(temp.CheckMatchSpecial()&&temp.GetColorType()==color&&this.CheckIsBlackTarget(temp)){
                        infectArr.push(temp)
                    }
                }
                this.SuperEffectInfect(2,infectArr,infectBlock);
            }

            this.DoDetonate(effItem);
            this.DoDetonate(effDest);

            this.SpecialExplodeSuperBHV(color,type,blackItemPos);

        }else if(effectValue==20){
            //双黑洞
            this.AddScore(ScoreType.ST_ExplodeBlackBlack);

            //传染
            let itemIndexBB = this.GetIndexByPos(effItem.SitePos.Y,effItem.SitePos.X);
            let destIndexBB = this.GetIndexByPos(effDest.SitePos.Y,effItem.SitePos.X);
            let itemButtonBB = this.GetButtonItemByIndex(itemIndexBB);
            let infectBlock = this.GetButtonBlockIdByIndex(itemIndexBB);
            let ItemsBB=TG_Game.Items;
            if(itemButtonBB.IsFect || destIndexBB.IsFect){
                if(infectBlock == -1){
                    return;
                }
                let infectArrBB=[];
                for (let i = 0; i < this.ColNum * this.RowNum; i++){
                    let itemBB = ItemsBB[i];
                    itemBB.BlackHolePos = effDest.GetSitPos();
                    if (itemBB.CheckMatchSpecial()){
                        infectArrBB.push(itemBB)
                    }
                }
                this.SuperEffectInfect(2,infectArrBB,infectBlock);
            }
            this.SpecialExplodeSuperBB(effDest.GetSitPos());
        }else if(effectValue==40){
            //双鸟
            this.AddScore(ScoreType.ST_ExplodeBB);
            this.SpecialExplodeSuperDoubleBird(effItem,effDest);
        }else if(effectValue>20){
            //鸟加其他特效
            let otherType;
            let  color = -1;
            if(effItem.IsEffectBird()){
                color=effItem.GetColorType();
                otherType=effDest.GetEffectType();
            }else {
                color=effDest.GetColorType();
                otherType=effItem.GetEffectType();
            }
            this.AddScore(ScoreType.ST_ExplodeHor_Bird);
            //将要生成的风车注入特效块数组
            for (let i = 0; i < TG_Stage.FishNum; i++){
                this.asyncCreateEffectItemAndInsertList(effDest.SitePos,color,true,otherType);
            }
            this.DoDetonate(effItem);
            this.DoDetonate(effDest);
            this.doDrop();
        }
    }
    /*存储本回合爆炸的所有的鸟*/
    private birds=[];
    //鸟爆炸生成的飞鸟个数
    //创建的特效块
    public AsyncEffectParams = [];
    /*鸟 风车的爆炸*/
    private SpecialExplodeBird(item,et=Msg.EffectType.ET_Bird){
        //将要生成的风车注入特效块数组
        for (let i = 0; i < TG_Stage.FishNum; i++){
            this.asyncCreateEffectItemAndInsertList(item.SitePos,item.GetColorType(),true,et);
        }
        //引爆当前风车
        this.DoDetonate(item);
    }
    //特效块加入数组
    private asyncCreateEffectItemAndInsertList(pos,color,IsBird=false,et=Msg.EffectType.ET_Bird){
        let param={
            "SitePos":pos,
            "Color" :color,
            "IsBird":IsBird,
            "Et":et
        };
        this.AsyncEffectParams.push(param);
    }
    //创建本回合的特效块
    private asyncCreateEffectItemAndInsert(){
        for(let i=0;i<this.AsyncEffectParams.length;i++){
            let p=this.AsyncEffectParams[i];
            if(p.IsBird){
                //鸟
                this.createBirdItem(p.SitePos,p.Color,p.Et);
            }else {
                //其他特效块
            }
        }
        this.AsyncEffectParams=[];
    }
    // 鸟的序号
    private birdIndex=0;
    private createBirdItem(startPos,color,Et){
        let layerid=2040+color;
        let StartIndex=this.GetIndexByPos(startPos.Y,startPos.X);
        GamePanel_ItemSp.getInstance().OnBirdCreate(layerid,startPos,StartIndex,this.birds,Et);
        this.birdIndex++;
    }
    /*检测鸟逻辑*/
    private doCheckBirds(){
        for(let i=0;i<this.birds.length;i++){
            let bird=this.birds[i];
            if(bird==null)continue;
            if(bird.IsFlying)continue;
            let item=this.getBirdExplodeTarget(bird.GetStartIndex());
            if(item!=null){
                bird.SetTargetPos(item.SitePos);
                bird.SetTargetIndex(this.GetIndexByPos(item.SitePos.Y,item.SitePos.X));
                item.SetIsBirdTarget(true);
            }else {
                bird.SetTargetPos(bird.StartPos);
                bird.SetTargetIndex(this.GetIndexByPos(bird.StartPos.Y,bird.StartPos.X));
            }
        }
        /*--------------传染----------------*/
        let infectArr = [];

        let infectBool = false;

        for(let i=0;i<this.birds.length;i++){
            let bird=this.birds[i];
            let index = bird.GetTargetIndex(); //获取鸟飞向的目标index
            let item = this.GetItemByIndex(index);
            infectArr.push(item);
        }

        this.CheckInfect(infectArr,true,2);
        /*--------------------------------*/

        for(let i=0;i<this.birds.length;i++){
            let bird=this.birds[i];
            if(bird==null)continue;
            if(bird.IsFlying)continue;
            bird.StartFly();
            this.OnBirdFly(bird.GetTargetIndex(), i);
        }

    }
    /*播放鸟飞的效果*/
    private OnBirdFly(targetIndex, birdIndex){
        //哪个飞鸟飞行
        let bird=this.birds[birdIndex];
        //目标点
        let endItem=this.GetItemByIndex(targetIndex);
        let endPos=endItem.getPosByRowCol(endItem.SitePos.Y,endItem.SitePos.X);
        egret.Tween.get(bird).to({x:endPos.x,y:endPos.y,rotation:360},TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BirdFlyTime)).call(function () {
            egret.Tween.removeTweens(bird);
            this.BirdMoveOverCallback(bird)
        }.bind(this),this);
    }
    /*鸟的飞行结束*/
    private BirdMoveOverCallback(bird){
        let index=bird.GetTargetIndex();
        GamePanel_ItemSp.getInstance().OnBirdRemove(bird,this.birds);
        if(index<0) return;
        if (this.CheckHasHighItems(index)){
            //如果有高层块
            let highItem=this.GetHighItems(index);
            if(highItem!=null){
                if(!highItem.GetExploding()){
                    highItem.DoExplode();
                }
                return;
            }
        }


        if(bird.GetEffectType()==Msg.EffectType.ET_Bird){
            let temp=this.GetItemByIndex(index);
            if (temp != null) temp.SetIsBirdTarget(false);
            //普通鸟直接消除
            temp.DoExplode(true);
        }else if(bird.GetEffectType()==Msg.EffectType.ET_Hor){
            //是横消鸟
            this.SpecialExplodeHorizonal(bird.GetTargetPos(),bird.GetColorType(),-1);
        }else if(bird.GetEffectType()==Msg.EffectType.ET_Vel){
            //是纵消鸟
            this.SpecialExplodeVertical(bird.GetTargetPos(),bird.GetColorType(),-1);
        }else if(bird.GetEffectType()==Msg.EffectType.ET_Gold){
            //是炸弹鸟
            this.SpecialExplodeCross(bird.GetTargetPos(),-1,true,false);
        }
    }
    /*寻找飞鸟的目标点*/
    private getBirdExplodeTarget(startIndex,infect=-1){
        let tempList=[];
        let items=TG_Game.Items;
        // 没有被传染的  特殊块
        for (let item of items){
            let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            //铁丝网
            // let mesh=this.GetMeshItemByIndex(index);
            // if (mesh.IsItemMesh()&&!mesh.getItemNone()&&!mesh.GetIsBirdTarget()&&index!=startIndex&&this.CheckIsBlackTarget(mesh,false)) {
            //     tempList.push(mesh);
            // }
            if (!item.IsBirdPriorityTarget) continue;
            if (!item.getItemNone()&&item.CheckMatchSpecial() && !item.GetIsBirdTarget()&&index!=startIndex&&this.CheckIsBlackTarget(item,false)) {
                tempList.push(item);
            }
        }
        // 没有被传染的 普通块
        if (tempList.length <= 0){
            for(let item of items){
                let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                if(item.CheckMatchSpecial()&&!item.GetIsBirdTarget()&&index!=startIndex&&this.CheckIsBlackTarget(item,false)){
                    tempList.push(item)
                }
            }
        }
        if(tempList.length<0){
            return null;
        }
        let random=Math.floor(Math.random()*tempList.length);
        let targetItem=tempList[random];
        return targetItem;
    }
    /// <summary>
    /// 流冰逻辑
    /// </summary>
    private  doFlowIceLogic()
    {
        // 回合前的等待时间
        let waitTime:number = 0;

        // 流冰逻辑
        for (let i = 0; i < TG_Game.Ices.length; i++)
        {
            let temp:TG_ItemFlowIce = TG_Game.Ices[i];
            if(temp.getItemNone()) continue;
            if (temp.isFlowIces && !(temp.isFlow))
            {
                temp.DoFlow();
                waitTime = TG_TimeDefine.FlowIceMoveTime;
            }
        }
        for (var i = 0; i < TG_Game.Ices.length; i++)
        {
            let temp:TG_ItemFlowIce = TG_Game.Ices[i];
            if(temp.getItemNone()) continue;
            if (temp.isFlowIces && temp.isFlow)
            {
                temp.DoFlowEnd();
            }
        }
        return waitTime;
    }
    /** 流沙
     * */
    public DoIceFlow(item:TG_Item)
    {
        var index = item.GetItemIndex(this.ColNum);
        if (index < 0) return;
        var list:Array<TG_Item> = [];
        var leftItemIndex =  this.GetLeftItem(index);
        var rightItemIndex =  this.GetRightItem(index);
        var topItemIndex =  this.GetTopItem(index);
        var bottomIndex =  this.GetBottomItem(index);
        if (leftItemIndex != -1)
        {

            var left = TG_Game.Ices[leftItemIndex];
            if (this.CheckFlowIce(left))
            {
                list.push(left);
            }
        }
        if (rightItemIndex != -1)
        {
            var right = TG_Game.Ices[rightItemIndex];
            if (this.CheckFlowIce(right))
            {
                list.push(right);
            }
        }
        if (topItemIndex != -1)
        {
            var top = TG_Game.Ices[topItemIndex];
            if (this.CheckFlowIce(top))
            {
                list.push(top);
            }
        }
        if (bottomIndex != -1)
        {
            var bottom = TG_Game.Ices[bottomIndex];
            if (this.CheckFlowIce(bottom))
            {
                list.push(bottom);
            }
        }
        if (list.length > 0)
        {
            var random = Math.floor(Math.random()*list.length);
            var target = list[random];
            var targetIndex = target.GetItemIndex(this.ColNum);
            GamePanel_ItemSp.getInstance().systemExchange(index, targetIndex);
        }
    }
    //是否是流沙
    public CheckFlowIce(item:TG_Item)
    {
        var index = item.Index;
        if( index != undefined) {
            if (index < 0 || index > this.MaxIndex) {
                return false;
            }
        }
        let temp=this.GetItemByIndex(index);
        if(temp.getItemNone()){
            return false;
        }
        var ice = TG_Game.Ices[index];
        if(ice.isFlowIces || ice.isIces)
            return false;

        let button =this.GetButtonItemByIndex(index);
        if (!button.IsCanEnterButton())
        {
            return false;
        }
        return true;
    }
    /*垂直炸一竖排*/
    private SpecialExplodeVertical(pos,detonateColor,detonateInfect=-1){
        console.info("竖消开始...")
        if(pos.X<0||pos.X>=this.ColNum||pos.Y<0||pos.Y>=this.RowNum)return;
        let effectItems=[];
        let currentEffectItems=[];
        let index=this.GetIndexByPos(pos.Y,pos.X);
        let infect=detonateInfect;
        //原点
        let item=this.GetItemByIndex(index);
        if(item.IsItemEffect()){
            currentEffectItems.push(index,infect);
            effectItems.push(currentEffectItems);
        }else {
            let position=[pos.X,pos.Y];
            this.doItemDetonate(position,detonateColor,infect);
        }
        //上面
        let oriPoint=pos.Y-1;

        /*-----------传染-------------*/
        let InfectArr = [];
        //上面
        let oriPointUpper = pos.Y-1;
        let oriPointLower = pos.Y+1;
        for(let i=oriPointUpper;i>=0;i--){
            let tempIndex=i*this.ColNum+pos.X;
            let temp=this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        //下面
        for(let i=oriPointLower;i<this.RowNum;i++){
            let tempIndex=i*this.ColNum+pos.X;
            let temp=this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        InfectArr.push(item);
        //传染块逻辑
        let selfIndex = this.GetIndexByPos(pos.Y,pos.X);
        this.CheckInfect(InfectArr,true,1,selfIndex);
        /*------------------------*/

        for(let i=oriPoint;i>=0;i--){
            let tempIndex=i*this.ColNum+pos.X;
            let temp=this.GetItemByIndex(tempIndex);
            if(temp.IsItemEffect()){
                currentEffectItems=[];
                currentEffectItems.push(tempIndex,infect);
                effectItems.push(currentEffectItems);
            }  else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            } else {
                let position=[temp.SitePos.X,temp.SitePos.Y];
                this.doItemDetonate(position,detonateColor,infect);
            }
            if(!temp.canThrough)//是否能被穿过，榛子不能被特效穿过
                break;
        }
        //下面
        oriPoint=pos.Y+1;
        for(let i=oriPoint;i<this.RowNum;i++){
            let tempIndex=i*this.ColNum+pos.X;
            let temp=this.GetItemByIndex(tempIndex);
            if(temp.IsItemEffect()){
                currentEffectItems=[];
                currentEffectItems.push(tempIndex,infect);
                effectItems.push(currentEffectItems);
            } else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            } else {
                let position=[temp.SitePos.X,temp.SitePos.Y];
                this.doItemDetonate(position,detonateColor,infect);
            }
            if(!temp.canThrough)//是否能被穿过，榛子不能被特效穿过
                break;
        }
        this.SetDropDelay(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay));
        for(let effectPair of effectItems){
            let tempIndex=effectPair[0];
            let temp=this.GetItemByIndex(tempIndex);
            let position=[temp.SitePos.X,temp.SitePos.Y];
            this.doItemDetonate(position,detonateColor,infect);
        }
    }
    /*水平炸一排*/
    public SpecialExplodeHorizonal(pos,detonateColor,detonateInfect=-1){
        // console.info("横消开始...");
        if(pos.X<0||pos.X>=this.ColNum||pos.Y<0||pos.Y>=this.RowNum)return;
        let effectItems=[];
        let currentEffectItems=[];
        let index=this.GetIndexByPos(pos.Y,pos.X);
        let infect=detonateInfect;
        //原点
        let item=this.GetItemByIndex(index);
        if(item.IsItemEffect()){
            currentEffectItems.push(index,infect);
            effectItems.push(currentEffectItems);
        }else {
            let position=[pos.X,pos.Y];
            this.doItemDetonate(position,detonateColor,infect);
        }

        /*-----------传染-------------*/
        let InfectArr = [];
        //左边
        let oriPointUpper = pos.X-1;
        let oriPointLower = pos.X+1;
        for(let i=oriPointUpper;i>=0;i--){
            let tempIndex=pos.Y*this.ColNum+i;
            let temp=this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        //右边
        for(let i=oriPointLower;i<this.ColNum;i++){
            let tempIndex=pos.Y*this.ColNum+i;
            let temp:TG_Item=this.GetItemByIndex(tempIndex);
            InfectArr.push(temp);
        }
        InfectArr.push(item);
        //传染块逻辑
        let selfIndex = this.GetIndexByPos(pos.Y,pos.X);
        let selfButton = this.GetButtonItemByIndex(selfIndex);
        this.CheckInfect(InfectArr,true,0,selfIndex);
        /*------------------------*/

        //左侧
        let oriPoint=pos.X-1;
        for(let i=oriPoint;i>=0;i--){
            let tempIndex=pos.Y*this.ColNum+i;
            let temp=this.GetItemByIndex(tempIndex);
            if(temp.IsItemEffect()){
                currentEffectItems=[];
                currentEffectItems.push(tempIndex,infect);
                effectItems.push(currentEffectItems);
            } else if (temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                // console.info(123456)
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            } else {
                let position=[temp.SitePos.X,temp.SitePos.Y];
                this.doItemDetonate(position,detonateColor,infect);
            }
            if(!temp.canThrough)//是否能被穿过，榛子不能被特效穿过
                break;
        }
        //右侧
        oriPoint=pos.X+1;
        for(let i=oriPoint;i<this.ColNum;i++){
            let tempIndex=pos.Y*this.ColNum+i;
            let temp:TG_Item=this.GetItemByIndex(tempIndex);
            if(temp.IsItemEffect()){
                currentEffectItems=[];
                currentEffectItems.push(tempIndex,infect);
                effectItems.push(currentEffectItems);
            }else if(temp.itemType == ItemType.TG_ITEM_TYPE_EGG) {
                // console.info(789456);
                TG_Game.IsPlayerDoMoveByEgg = true;
                temp.DoExplode();
            } else {
                let position=[temp.SitePos.X,temp.SitePos.Y];
                this.doItemDetonate(position,detonateColor,infect);
            }
            if(!temp.canThrough)//是否能被穿过，榛子不能被特效穿过
                break;
        }
        this.SetDropDelay(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay));
        for(let effectPair of effectItems){
            let tempIndex=effectPair[0];
            let temp=this.GetItemByIndex(tempIndex);
            let position=[temp.SitePos.X,temp.SitePos.Y];
            this.doItemDetonate(position,detonateColor,infect);
        }
    }
    /*黑洞+普通的爆炸*/
    private SpecialExplodeBlackSetTime;
    private SpecialExplodeBlack(pos,detonateColor){
        //pos 黑洞块的位置 detonateColor 被黑洞吸掉的元素块颜色值
        let toFindSpecial = [];
        let Items=TG_Game.Items;
        for(let temp of Items){
            if(temp.CheckMatchSpecial()&&temp.GetColorType()==detonateColor&&this.CheckIsBlackTarget(temp)){
                toFindSpecial.push(temp);
            }
        }
        for(let temp of Items){
            if(temp.SitePos.X==pos.X&&temp.SitePos.Y==pos.Y){
                toFindSpecial.push(temp);
            }
        }
        //传染块
        let infectArr = [];
        for(let temp of toFindSpecial){
            infectArr.push(temp);
        }
        let itemIndex = this.GetIndexByPos(pos.Y,pos.X);
        this.CheckInfect(infectArr,true,4,itemIndex);
        for(let temp of toFindSpecial){
            GamePanel_ItemSp.getInstance().ItemWaggleMove(temp,pos);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BeDisoriganziedTime),1,this.SpecialExplodeBlackWaggleBack.bind(this,toFindSpecial),this);
    }
    /*黑洞效果下的晃动完毕*/
    public SpecialExplodeBlackWaggleBack(list){
        for(let temp of list){
            temp.DoExplode(true);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay),1,this.doDrop,this);
    }
    /*炸弹爆炸*/
    private SpecialExplodeCross(pos,infect,createSecond,isSuper=false){
        //infect 是否感染
        let index=this.GetIndexByPos(pos.Y,pos.X);
        let item=this.GetItemByIndex(index);
        let detonateColor=item.GetColorType();
        //传染
        let infectArr = [];
        if(isSuper){
            let PosA = [-2,-1,0,1,2];
            let PosB = [-2,-1,0,1,2];
            for(let i=0;i<PosA.length;i++){
                for(let k=0;k<PosB.length;k++){
                    let m_PosX = (PosA[i] + pos.X);
                    let m_PosY = (PosB[k] + pos.Y);
                    let m_Pos = [m_PosX,m_PosY];
                    // console.log("pos==============>"+pos);
                    //传染
                    if(m_PosX<0||m_PosX >= this.ColNum || m_PosY<0 || m_PosY>=this.RowNum){
                        continue;
                    }
                    let infectIndex = this.GetIndexByPos(m_PosY,m_PosX);
                    let infectItem = this.GetItemByIndex(infectIndex);
                    infectArr.push(infectItem);
                }
            }
        }else {
            //普通 炸弹爆炸
            let PosA = [-1,0,1];
            let PosB = [-1,0,1];
            for(let i=0;i<PosA.length;i++){
                for(let k=0;k<PosB.length;k++){
                    let m_PosX = (PosA[i] + pos.X);
                    let m_PosY = (PosB[k] + pos.Y);
                    let m_Pos = [m_PosX,m_PosY];
                    // console.log("pos==============>"+pos);
                    //传染
                    let infectIndex = this.GetIndexByPos(m_PosY,m_PosX);
                    let infectItem = this.GetItemByIndex(infectIndex);
                    infectArr.push(infectItem);
                }
            }
        }
        let selfIndex = this.GetIndexByPos(pos.Y,pos.X);
        this.CheckInfect(infectArr,true,3,selfIndex);
            //普通爆炸
            let self=[pos.X,pos.Y];
            let top = [0 + pos.X, -1 + pos.Y];
            let bottom = [0 + pos.X, 1 + pos.Y];
            let left = [-1 + pos.X, 0 + pos.Y];
            let right = [1 + pos.X, 0 + pos.Y];
            let leftTop = [-1 + pos.X, -1 + pos.Y];
            let rightTop = [1 + pos.X, -1 + pos.Y];
            let leftBottom = [-1 + pos.X, 1 + pos.Y];
            let rightBottom = [1 + pos.X, 1 + pos.Y];
            this.doItemDetonate(self, detonateColor, infect);
            this.doItemDetonate(top, detonateColor, infect);
            this.doItemDetonate(bottom, detonateColor, infect);
            this.doItemDetonate(left, detonateColor, infect);
            this.doItemDetonate(right, detonateColor, infect);
            this.doItemDetonate(leftTop, detonateColor, infect);
            this.doItemDetonate(rightTop, detonateColor, infect);
            this.doItemDetonate(leftBottom, detonateColor, infect);
            this.doItemDetonate(rightBottom, detonateColor, infect);
            if(isSuper){
                let line1A = [-2 + pos.X, -2 + pos.Y];
                let line1B = [-1 + pos.X, -2 + pos.Y];
                let line1C = [0 + pos.X, -2 + pos.Y];
                let line1D = [1 + pos.X, -2 + pos.Y];
                let line1E = [2 + pos.X, -2 + pos.Y];
                let line2A = [-2 + pos.X, -1 + pos.Y];
                let line2E = [2 + pos.X, -1 + pos.Y];
                let line3A = [-2 + pos.X, 0 + pos.Y];
                let line3E = [2 + pos.X, 0 + pos.Y];
                let line4A = [-2 + pos.X, 1 + pos.Y];
                let line4E = [2 + pos.X, 1 + pos.Y];
                let line5A = [-2 + pos.X, 2 + pos.Y];
                let line5B = [-1 + pos.X, 2 + pos.Y];
                let line5C = [0 + pos.X, 2 + pos.Y];
                let line5D = [1 + pos.X, 2 + pos.Y];
                let line5E = [2 + pos.X, 2 + pos.Y];
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
    }
    /*黑洞+黑洞*/
    private SpecialExplodeSuperBB(pos){
        let infect =-1;
        let Items=TG_Game.Items;
        let toFindSpecial=[];
        for (let i = 0; i < this.ColNum * this.RowNum; i++){
            let item = Items[i];
            item.BlackHolePos = pos;
            if (item.CheckMatchSpecial()){
                toFindSpecial.push(item)
            }
        }
        for(let temp of toFindSpecial){
            GamePanel_ItemSp.getInstance().ItemWaggleMove(temp,pos);
        }
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BeDisoriganziedTime),1,this.SpecialExplodeBlackWaggleBack.bind(this,toFindSpecial),this);
    }
    /*风车+风车*/
    private SpecialExplodeSuperDoubleBird(aItem,bItem){
        let createTotalFishNum=3*TG_Stage.FishNum;
        //主动移动鸟 生成飞鸟数量
        let aItemFishNum=0;
        //被动移动鸟 生成飞鸟数量
        let bItemFishNum=0;
        if(createTotalFishNum%2==0){
            //能够平分
            aItemFishNum=createTotalFishNum/2;
            bItemFishNum=createTotalFishNum/2;
        }else {
            aItemFishNum=(createTotalFishNum-1)/2+1;
            bItemFishNum=(createTotalFishNum-1)/2;
        }
        //将要生成的风车注入特效块数组
        for(let i=0;i<bItemFishNum;i++){
            this.asyncCreateEffectItemAndInsertList(aItem.SitePos,aItem.GetColorType(),true);
        }
        //将要生成的风车注入特效块数组
        for(let i=0;i<aItemFishNum;i++){
            this.asyncCreateEffectItemAndInsertList(bItem.SitePos,bItem.GetColorType(),true);
        }
        //引爆当前风车
        this.DoDetonate(aItem);
        this.DoDetonate(bItem);
        this.doDrop();
    }
    /*条形和条形*/
    private SpecialExplodeSuperHV(pos,detonateColor,infect){
        this.SpecialExplodeHorizonal(pos, detonateColor, infect);
        this.SpecialExplodeVertical(pos,detonateColor, infect);
    }
    /*炸弹+条形*/
    private SpecialExplodeSuperGHV(pos,detonateColor,infect,goldItem=null){
        let topPos={
            "X":0 + pos.X,
            "Y": -1 + pos.Y
        };
        let bellowPos={
            "X":0 + pos.X,
            "Y":1 + pos.Y
        };
        let leftPos={
            "X":-1 + pos.X,
            "Y":0 + pos.Y
        };
        let rightPos={
            "X":1 + pos.X,
            "Y":0 + pos.Y
        };
        //一次放大完毕
        let obj={"type":0, "pos":{"X":0, "Y":0}, "topPos":{"X":0, "Y":0}, "bellowPos":{"X":0, "Y":0}, "leftPos":{"X":0, "Y":0}, "rightPos":{"X":0, "Y":0}, "goldItem":null,"detonateColor":detonateColor,"infect":infect};
        //生成放大的方块 横消
        obj.type=0;
        obj.pos=pos;
        obj.topPos=topPos;
        obj.bellowPos=bellowPos;
        obj.leftPos=leftPos;
        obj.rightPos=rightPos;
        obj.goldItem=goldItem;
        this.SpecialExplodeSuperGHVScale(obj);
    }
    //炸弹和条形的放大效果
    public SpecialExplodeSuperGHVScale(data){
        if(data.type==0){
            //横消
            let layerid=2010+data.detonateColor;
            GamePanel_ItemSp.getInstance().createSuperGHV(layerid,data.pos.Y,data.pos.X,Msg.EffectType.ET_Hor,TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime));
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime),1,this.SpecialExplodeSuperGHVBack.bind(this,data),this);
        }else {
            let layerid=2020+data.detonateColor;
            GamePanel_ItemSp.getInstance().createSuperGHV(layerid,data.pos.Y,data.pos.X,Msg.EffectType.ET_Vel,TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime));
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime),1,this.SpecialExplodeSuperGHVBack.bind(this,data),this);
        }
    }
    //炸弹和条形的放大完毕
    public SpecialExplodeSuperGHVBack(data){
        if(data.type==0){
            //横消
            this.SpecialExplodeHorizonal(data.pos,data.detonateColor, data.infect);
            this.SpecialExplodeHorizonal(data.topPos,data.detonateColor, data.infect);
            this.SpecialExplodeHorizonal(data.bellowPos,data.detonateColor, data.infect);
            if(data.goldItem!=null){
                this.DoDetonate(data.goldItem,false);
            }
            data.type=1;
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVScaleTime),1,this.SpecialExplodeSuperGHVScale.bind(this,data),this);
        }else {
            this.SpecialExplodeVertical(data.pos, data.detonateColor,data.infect);
            this.SpecialExplodeVertical(data.leftPos, data.detonateColor,data.infect);
            this.SpecialExplodeVertical(data.rightPos, data.detonateColor,data.infect);
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BoomAndHVIntervalTime),1,this.doDrop,this);
        }
    }
    /*黑洞+条形*/
    public BlackHoles=[];
    private SpecialExplodeSuperBHV(color,type,pos){
        let tempList=[];
        let Items=TG_Game.Items;
        for(let temp of Items){
            if(temp.CheckMatchSpecial()&&temp.GetColorType()==color&&this.CheckIsBlackTarget(temp)){
                tempList.push(temp)
            }
        }

        this.BlackHoles=[];
        this.BulletExplodeTime=0;
        this.isBulletExplode=true;
        this.BulletExplodeIndex=-1;
        let obj={
            "color":color,
            "type":type,
            "tempList":tempList,
            "pos":pos
        };
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BlockHoleExchangeEffectTime),1,this.CreateSuperBlackHole.bind(this,obj),this);
    }
    /*创建黑射线*/
    public CreateSuperBlackHole(data){
        //创建黑射线
        GamePanel_ItemSp.getInstance().CreateSuperBlackHole(data.color, data.type, data.tempList, data.pos, -1,this.BlackHoles,function () {
            this.BulletMoveCallbackExplode();
        }.bind(this));
    }
    /*射线形成特效块完毕 开始特效消除*/
    private BulletExplodeTime=0;
    private isBulletExplode=false;//是否是子弹的爆炸
    private BulletExplodeIndex=-1;
    private BulletMoveCallbackExplode(){
        if(this.BlackHoles[0].GetEffectType()!=Msg.EffectType.ET_Bird){
            this.BulletExplodeIndex+=1;
            if(this.BulletExplodeIndex<this.BlackHoles.length){
                if(this.BlackHoles[this.BulletExplodeIndex]&&!this.BlackHoles[this.BulletExplodeIndex].GetAlreadyExplode()){
                    //之前没有被引爆
                    this.OnBulletExplode(this.BlackHoles[this.BulletExplodeIndex]);
                    App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay),1,this.doDrop,this);
                }else {
                    this.BulletMoveCallbackExplode();
                }
            }else {
                this.isBulletExplode=false;
                this.doDrop();
            }
        }else {
            //鸟和黑洞 不需要逐步消除
            this.isBulletExplode=false;
            for(let temp of this.BlackHoles){
                this.OnBulletExplode(temp);
            }
            this.doDrop();
        }
    }
    /*射线开始爆炸*/
    private OnBulletExplode(bullet){
        //哪个黑洞特效块炸
        let blackHole=bullet;
        //目标点
        let pos=blackHole.GetStartBlockHolePos();
        if(blackHole.GetEffectType()==Msg.EffectType.ET_Hor){
            //横消
            this.SpecialExplodeHorizonal(pos,blackHole.GetColorType(),-1);
        }else if(blackHole.GetEffectType()==Msg.EffectType.ET_Vel){
            //纵消
            this.SpecialExplodeVertical(pos,blackHole.GetColorType(),-1);
        }else if(blackHole.GetEffectType()==Msg.EffectType.ET_Gold){
            //炸弹
            this.SpecialExplodeCross(pos,-1,true,false);
        }else if(blackHole.GetEffectType()==Msg.EffectType.ET_Bird){
            //风车
            this.SpecialExplodeBird(blackHole);
        }
        if(blackHole.GetEffectType()!=Msg.EffectType.ET_Gold){
            this.RemoveBullet(blackHole.StartBlockHolePos);
        }
    }
    /*移除射线*/
    private RemoveBullet(pos){
        //移除
        GamePanel_ItemSp.getInstance().RemoveSuperBlackHole(pos,this.BlackHoles);
    }
    public CheckIsBlackTarget(item,isNeedBlackTarget=true){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if(index<0||index>this.ColNum*this.RowNum-1){
            return false;
        }
        if(item.MarkedAlready){
            return false;
        }
        if(item.getItemNone()){
            return false;
        }
        if (isNeedBlackTarget&&!item.IsBlackTarget)
        {
            return false;
        }
        if(isNeedBlackTarget){
            let cloud = this.GetCloudItemByIndex(index);
            if (!cloud.getItemNone()&&cloud.IsCloud())
            {
                return false;
            }
        }
        return true
    }
    /**
     *
     * 根据是否可感染查询出一个 随机的毒液
     *
     */
    public geneOneTgItemVenom(isCanInfectBlock:boolean = true):TG_Item {
        let canInfectVenomLst:Array<TG_Item> = [];
        let noCanInfectVenomLst:Array<TG_Item> = [];
        // 取出所有的块
        let items = TG_Game.Items;
        for (let i in items) {
            if (Number(i)<0||Number(i)>this.ColNum*this.RowNum-1) {
                break;
            }
            let oneItem = items[i];
            if (oneItem.itemType == ItemType.TG_ITEM_TYPE_VENOM) {
                let topItemIndex=this.GetTopItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
                let letItemIndex=this.GetLeftItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
                let rightItemIndex=this.GetRightItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
                let bottomItemIndex=this.GetBottomItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
                let topItem = this.GetItemByIndex(topItemIndex);
                let letItem = this.GetItemByIndex(letItemIndex);
                let rightItem = this.GetItemByIndex(rightItemIndex);
                let bottomItem = this.GetItemByIndex(bottomItemIndex);
                if ((topItem && !topItem.getItemNone() && !topItem.IsItemNull() && topItem.itemType != ItemType.TG_ITEM_TYPE_VENOM &&topItem.canFallDown&& !this.CheckHasHighItems(topItemIndex))
                    || (letItem && !letItem.getItemNone() && !letItem.IsItemNull() && letItem.itemType != ItemType.TG_ITEM_TYPE_VENOM &&letItem.canFallDown&& !this.CheckHasHighItems(letItemIndex))
                    || (rightItem && !rightItem.getItemNone() && !rightItem.IsItemNull() && rightItem.itemType != ItemType.TG_ITEM_TYPE_VENOM&&rightItem.canFallDown && !this.CheckHasHighItems(rightItemIndex))
                    || (bottomItem && !bottomItem.getItemNone() && !bottomItem.IsItemNull() && bottomItem.itemType != ItemType.TG_ITEM_TYPE_VENOM&&bottomItem.canFallDown && !this.CheckHasHighItems(bottomItemIndex))) {
                    canInfectVenomLst.push(oneItem);
                } else {
                    noCanInfectVenomLst.push(oneItem);
                }
            }
        }
        if (canInfectVenomLst && canInfectVenomLst.length >0 && isCanInfectBlock) {// 能感染
            return canInfectVenomLst[Math.floor(Math.random() * canInfectVenomLst.length)];
        }
        if(noCanInfectVenomLst && noCanInfectVenomLst.length >0 && !isCanInfectBlock){// 不能感染
            return noCanInfectVenomLst[Math.floor(Math.random() * noCanInfectVenomLst.length)];
        }
        return null;
    }
    public GetCanVenomInfect(venom:TG_Item):TG_Item{
        let venomNeighborLst = [];
        if (venom) {
            let topItemIndex=this.GetTopItem(this.GetIndexByPos(venom.SitePos.Y,venom.SitePos.X));
            let leftItemIndex=this.GetLeftItem(this.GetIndexByPos(venom.SitePos.Y,venom.SitePos.X));
            let rightItemIndex=this.GetRightItem(this.GetIndexByPos(venom.SitePos.Y,venom.SitePos.X));
            let bottomItemIndex=this.GetBottomItem(this.GetIndexByPos(venom.SitePos.Y,venom.SitePos.X));
            let topItem = this.GetItemByIndex(topItemIndex);
            let leftItem = this.GetItemByIndex(leftItemIndex);
            let rightItem = this.GetItemByIndex(rightItemIndex);
            let bottomItem = this.GetItemByIndex(bottomItemIndex);
            if ((topItem && !topItem.getItemNone() && !topItem.IsItemNull() && topItem.itemType != ItemType.TG_ITEM_TYPE_VENOM&&topItem.canFallDown && !this.CheckHasHighItems(topItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(topItemIndex));
            }
            if ((leftItem && !leftItem.getItemNone() && !leftItem.IsItemNull() && leftItem.itemType != ItemType.TG_ITEM_TYPE_VENOM &&leftItem.canFallDown&& !this.CheckHasHighItems(leftItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(leftItemIndex));
            }
            if ((rightItem && !rightItem.getItemNone() && !rightItem.IsItemNull() && rightItem.itemType != ItemType.TG_ITEM_TYPE_VENOM &&rightItem.canFallDown&& !this.CheckHasHighItems(rightItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(rightItemIndex));
            }
            if ((bottomItem && !bottomItem.getItemNone() && !bottomItem.IsItemNull() && bottomItem.itemType != ItemType.TG_ITEM_TYPE_VENOM&&bottomItem.canFallDown && !this.CheckHasHighItems(bottomItemIndex))) {
                venomNeighborLst.push(this.GetItemByIndex(bottomItemIndex));
            }
            // 随机一个传染块的邻居
            Log.getInstance().trace(venomNeighborLst,0)
            if (venomNeighborLst && venomNeighborLst.length >0) {
                return venomNeighborLst[Math.floor(Math.random() * venomNeighborLst.length)];
            }
            return null;
        }
        return null;
    }
    /**
     * 每回合中变色块逻辑
     */
    public changeColorBlock() {
        let changeColorBlock=false;
        // Log.getInstance().trace("==================变色块执行逻辑开始=====================",0);
        // 获取变色块列表
        let changeColorLst = this.GetChangeColorLst();
        // Log.getInstance().trace(changeColorLst, 0);
        // 将所有变色块改变颜色生成新的变色块
        let newChangeColorLst = this.GetNewChangeColorLst(changeColorLst);
        // Log.getInstance().trace("1234567890", 0);
        // Log.getInstance().trace(changeColorLst, 0);
        // Log.getInstance().trace(newChangeColorLst, 0);
        // 生成新的变色块
        let isSuccess = this.generateNewChangeColorLst(newChangeColorLst);
        // Log.getInstance().trace(isSuccess, 0);
        if(isSuccess){
            changeColorBlock=true;
        }
        return changeColorBlock;
    }
    /**
     * 生成新的变色块
     * @param newChangeColorLst
     */
    public generateNewChangeColorLst(newChangeColorLst:Array<any>) :boolean
    {
        Log.getInstance().trace(newChangeColorLst, 0);
        for (let i = 0;i<newChangeColorLst.length;i++) {
            let oneNewItem = newChangeColorLst[i];
            let item_x = oneNewItem.item_x;
            let item_y = oneNewItem.item_y;
            let item_color = oneNewItem.item_color;
            // 获取要变色的块的位置
            let oneItem = this.GetItemByIndex(this.GetIndexByPos(item_y,item_x));
            let layerid = 2600+Number(item_color);
            oneItem.changeColor(layerid);
            // App.DisplayUtils.removeFromParent(oneItem);
            // oneItem.Release();
            // Log.getInstance().trace(oneItem, 0);
            // let layerid = 2600+Number(item_color);
            // GamePanel_ItemSp.getInstance().createItemEffect(layerid,oneItem.SitePos.Y,oneItem.SitePos.X,Msg.EffectType.ET_none);
        }
        return true;
    }
    /**
     * 游戏宝石层数据转成临时数据对象集合
     */
    public gameItemDataToBlockData() {
        TG_Game.ItemsBlocksDataTemp = [];
        let items = TG_Game.Items;
        for (let itemIndex in items) {
            let oneItems:TG_Item = items[itemIndex];
            let rowNum = oneItems.SitePos.Y;
            let colNum = oneItems.SitePos.X;
            let blockId = oneItems.BlockId;
            let tempBlocks =  new TG_Blocks();
            tempBlocks.setLayerId(blockId);
            tempBlocks.setLayer(2);
            tempBlocks.setRow(rowNum);
            tempBlocks.setCol(colNum);
            tempBlocks.setCellNum(Number(itemIndex));
            if (oneItems.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
                tempBlocks.setIsRandom(1);
            } else {
                tempBlocks.setIsRandom(0);
            }
            TG_Game.ItemsBlocksDataTemp.push(tempBlocks);
        }
        return TG_Game.ItemsBlocksDataTemp;
    }
    /**
     *
     * 获取改变颜色后的变色块列表
     * @param changeColorLst
     * @constructor
     */
    public GetNewChangeColorLst(changeColorLst) {
        // console.info(changeColorLst);
        let anotherChangeColorLst = [];
        for (let oneChangeColorIndex in changeColorLst) {
            let oneChangeColor = changeColorLst[oneChangeColorIndex];
            // let randomLst = TG_Stage.SetColorNumElement;
            let randomLst=[];
            for(let i=0;i<TG_Stage.SetColorNumElement.length;i++){
                randomLst.push(TG_Stage.SetColorNumElement[i]);
            }
            let blocksDataTemp = this.gameItemDataToBlockData();
            let item_y =oneChangeColor.item_y;
            let item_x =oneChangeColor.item_x;
            let blocksDataIndex = item_y * 9 + item_x;
            let blocksData = blocksDataTemp[blocksDataIndex];
            let anotherChangeColor = Number(this.geneRandomNum2(blocksDataTemp,blocksData,randomLst)%10);
            // console.info(anotherChangeColor)
            // let anotherChangeColor = this.randomChangeColor(oneChangeColor,randomLst);
            let item_color =anotherChangeColor;
            let anotherChangeColorObj = {};
            anotherChangeColorObj["item_y"] = item_y;
            anotherChangeColorObj["item_x"] = item_x;
            anotherChangeColorObj["item_color"] = item_color;
            anotherChangeColorLst.push(anotherChangeColorObj);
        }
        // Log.getInstance().trace(anotherChangeColorLst, 0);
        return anotherChangeColorLst;
    }
    /**
     * 某个颜色块随机获取另一个随机颜色块
     * @param oneChangeColor
     * @param randomLst
     */
    public randomChangeColor(oneChangeColor,randomLst:Array<Number> = [1,2,3,4,5,6]) {
        let setColorArr = [];
        for (let oneRandomIndex in randomLst) {
            setColorArr.push(randomLst[oneRandomIndex]);
        }
        // Log.getInstance().trace(setColorArr);
        let item_y =oneChangeColor.item_y;
        let item_x =oneChangeColor.item_x;
        let item_color =oneChangeColor.item_color;
        let oneItem = this.GetItemByIndex(this.GetIndexByPos(item_y,item_x));
        // 没有获取到颜色值
        let noHasGetColor = true;
        while (setColorArr.length > 0 && noHasGetColor) {
            let oneIndex = Math.floor(Math.random() * setColorArr.length);
            let random_item_color = setColorArr[oneIndex];
            if (random_item_color != item_color) {// 变色块变色和上一次的颜色块不一致
                let tempList=[];
                /*检查横向*/
                this.getRowChainByColor(random_item_color, tempList, oneItem);
                if (tempList.length >= 3){
                    setColorArr.splice(oneIndex,1);
                    continue;
                }
                tempList=[];
                /*检查纵向*/
                this.getColChainByColor(random_item_color, tempList, oneItem);
                if (tempList.length>= 3){
                    setColorArr.splice(oneIndex,1);
                    continue;
                }
                //是否可以形成鸟
                if(this.CheckBirdByColor(random_item_color, oneItem)){
                    setColorArr.splice(oneIndex,1);
                    continue;
                }
                Log.getInstance().trace("==============", 0);
                Log.getInstance().trace(random_item_color, 0);
                Log.getInstance().trace(setColorArr, 0);
                noHasGetColor = false;
                return random_item_color;
            } else {
                setColorArr.splice(oneIndex,1);
            }
        }
        return randomLst[Math.floor(Math.random() * randomLst.length)];
    }
    public getRowChainByColor(item_color, outs,item) {
        if (item_color >= 1 || item_color <= 6) {
            outs.push(item_color);
            let siteCol = item.SitePos.X+1;
            let siteRow = item.SitePos.Y;
            while(siteCol<this.ColNum){
                let neighbor= this.GetItemByPos(siteRow,siteCol);
                if(neighbor==null){
                    break;
                }
                if(neighbor.getItemNone()){
                    break;
                }
                if(this.CheckAddMark(neighbor)){
                    if(item_color==neighbor.GetColorType()){
                        outs.push(item_color);
                        siteCol++
                    }else {
                        break;
                    }
                }else {
                    break;
                }
            }
            siteCol=item.SitePos.X-1;
            while(siteCol>=0){
                let neighbor= this.GetItemByPos(siteRow,siteCol);
                if(neighbor==null){
                    break;
                }
                if(neighbor.getItemNone()){
                    break;
                }
                if(this.CheckAddMark(neighbor)){
                    if(item_color == neighbor.GetColorType()){
                        outs.push(item_color);
                        siteCol--;
                    }else {
                        break;
                    }
                }else {
                    break;
                }
            }
        }
    }
    public getColChainByColor(item_color, outs,item) {
        if (item_color >= 1 || item_color <= 6) {
            outs.push(item_color);
            let siteCol = item.SitePos.X;
            let siteRow = item.SitePos.Y+1;
            while(siteRow<this.RowNum){
                let neighbor= this.GetItemByPos(siteRow,siteCol);
                if(neighbor==null){
                    break;
                }
                if(neighbor.getItemNone()){
                    break;
                }
                if(this.CheckAddMark(neighbor)){
                    if(item_color==neighbor.GetColorType()){
                        outs.push(item_color);
                        siteRow++
                    }else {
                        break;
                    }
                }else {
                    break;
                }
            }
            siteRow=item.SitePos.Y-1;
            while(siteRow>=0){
                let neighbor= this.GetItemByPos(siteRow,siteCol);
                if(neighbor==null){
                    break;
                }
                if(neighbor.getItemNone()){
                    break;
                }
                if(this.CheckAddMark(neighbor)){
                    if(item_color==neighbor.GetColorType()){
                        outs.push(item_color);
                        siteRow--;
                    }else {
                        break;
                    }
                }else {
                    break;
                }
            }
        }
    }
    public CheckBirdByColor(random_item_color, item) {
        if (!TG_Stage.CanCreateFish){
            return false;
        }
        if(item){
            let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            let leftIndex=this.GetLeftItem(index);
            let topIndex=this.GetTopItem(index);
            let topLeftIndex=this.GetTopLeftItem(index);
            if(leftIndex>=0&&topIndex>=0&&topLeftIndex>=0){
                let left=this.GetItemByIndex(leftIndex);
                let top=this.GetItemByIndex(topIndex);
                let topLeft=this.GetItemByIndex(topLeftIndex);
                if(this.CheckAddMark(left)&&this.CheckAddMark(top)&&this.CheckAddMark(topLeft)&&
                    left.GetColorType()==random_item_color&&top.GetColorType()==random_item_color&&topLeft.GetColorType()==random_item_color){
                    return true;
                }
            }
            let bottomIndex=this.GetBottomItem(index);
            let bottomLeftIndex=this.GetBottomLeftItem(index);
            if(leftIndex>=0&&bottomIndex>=0&&bottomLeftIndex>=0){
                let left=this.GetItemByIndex(leftIndex);
                let bottom=this.GetItemByIndex(bottomIndex);
                let bottomLeft=this.GetItemByIndex(bottomLeftIndex);
                if(this.CheckAddMark(left)&&this.CheckAddMark(bottom)&&this.CheckAddMark(bottomLeft)&&
                    left.GetColorType()==random_item_color&&bottom.GetColorType()==random_item_color&&bottomLeft.GetColorType()==random_item_color){
                    return true;
                }
            }
            let rightIndex=this.GetRightItem(index);
            let topRightIndex=this.GetTopRightItem(index);
            if(rightIndex>=0&&topIndex>=0&&topRightIndex>=0){
                let right=this.GetItemByIndex(rightIndex);
                let top=this.GetItemByIndex(topIndex);
                let topRight=this.GetItemByIndex(topRightIndex);
                if(this.CheckAddMark(right)&&this.CheckAddMark(top)&&this.CheckAddMark(topRight)&&
                    right.GetColorType()==random_item_color&&top.GetColorType()==random_item_color&&topRight.GetColorType()==random_item_color){
                    return true;
                }
            }
            let bottomRightIndex=this.GetBottomRightItem(index);
            if(rightIndex>=0&&bottomIndex>=0&&bottomRightIndex>=0){
                let right=this.GetItemByIndex(rightIndex);
                let bottom=this.GetItemByIndex(bottomIndex);
                let bottomRight=this.GetItemByIndex(bottomRightIndex);
                if(this.CheckAddMark(right)&&this.CheckAddMark(bottom)&&this.CheckAddMark(bottomRight)&&
                    right.GetColorType()==random_item_color&&bottom.GetColorType()==random_item_color&&bottomRight.GetColorType()==random_item_color){
                    return true;
                }
            }
            return false;
        }else {
            return false;
        }
    }
    /**
     *
     * 获取棋盘中所有的变色块
     * @constructor
     */
    public GetChangeColorLst() {
        let items = TG_Game.Items;
        let changeColorLst = [];
        // let noChangeColorLst = [];
        for (let i in items) {
            let oneItem = items[i];
            if (oneItem.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR && oneItem.venonatId == 0 && !this.CheckHasHighItems(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X))) {// 判断是变色块 并且没有毛球和高层块
                let item_y = oneItem.SitePos.Y;
                let item_x = oneItem.SitePos.X;
                let item_color = oneItem.Color;
                let changeColorItem = {};
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
    }
    /**
     * 是否可以传染毒液
     */
    private venomExplode:boolean = true;
    public VenomInfect()
    {
        let VenomInfect=false;
        if(!this.venomExplode) {
            this.venomExplode = true;
            return VenomInfect;
        }
        this.venomExplode = true;
        // 毒液传染逻辑开始
        let venom = this.geneOneTgItemVenom(true);
        if (venom) {
            Log.getInstance().trace("==================毒液感染开始=====================",0);
            // 获取可感染的旁边的块
            let venomNeighbor = this.GetCanVenomInfect(venom);
            if (venomNeighbor!=null&&venomNeighbor) {
                // venom 感染 venomNeighbor
                // venomNeighbor.DoExplode(true,true);
                this.DoDetonate(venomNeighbor,false, Msg.EffectType.ET_none ,true);
                //本位置上生成新感染
                let layerid=2141;
                GamePanel_ItemSp.getInstance().createItemEffect(layerid,venomNeighbor.SitePos.Y,venomNeighbor.SitePos.X,Msg.EffectType.ET_none);
            }
            VenomInfect=true;
        } else {
            Log.getInstance().trace("==================没有可以感染的毒液=====================",0);
        }
        return VenomInfect;
    }
    //生成块: 检测爆炸快是否有传染块并获取需要传染的块
    public GetLodingInfect(Round,DoBlock,Type){
        let m_IsFect = false;
        let m_DoBlock = DoBlock;
        let m_Round = Round;
        let infectBlockId = 1003;
        let infetData = [];
        for(let item of m_DoBlock){
            let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            if(TG_Game.Buttons[index].IsFect){
                m_IsFect = true;
                break;
            }
        }
        if(!m_IsFect){
            return;
        }
        if(!m_Round){
            //我的回合
            infectBlockId=1004;
            for(let temp of m_DoBlock){
                //传染块
                let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                if(TG_Game.Buttons[index].BlockId == 1003){
                    infectBlockId=1003;
                    break;
                }
            }
        }else if(m_Round){
            //对方回合
            infectBlockId=1003;
            for(let temp of m_DoBlock){
                //传染块
                let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                if(TG_Game.Buttons[index].BlockId == 1004){
                    infectBlockId=1004;
                    break;
                }
            }
        }
        switch (Type){
            case 0: //普通爆炸快,三连消，四连消
                //可以被传染
                for(let temp of m_DoBlock){
                    //特殊判断
                    let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                    if(!this.CheckInfectSpecialBlock(temp,index)){
                        continue;
                    }
                    infetData = [temp,infectBlockId];
                    TG_Game.Infects.push(infetData);
                }
            break;
            case 1: //生成:风车
                //可以被传染
                for(let temp of m_DoBlock){
                    if(!temp.GetExploding()){
                        //特殊判断
                        let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                        if(!this.CheckInfectSpecialBlock(temp,index)){
                            continue;
                        }
                        //传染块
                        infetData = [temp,infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
            break;
            case 2: //生成:炸弹
                //可以被传染
                for(let temp of m_DoBlock){
                    if(!temp.GetExploding()){
                        //特殊判断
                        let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                        if(!this.CheckInfectSpecialBlock(temp,index)){
                            continue;
                        }
                        //传染块
                        infetData = [temp,infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
            break;
            case 3: //生成:黑洞
                //可以被传染
                for(let temp of m_DoBlock){
                    if(!temp.GetExploding()){
                        //特殊判断
                        let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                        if(!this.CheckInfectSpecialBlock(temp,index)){
                            continue;
                        }
                        //传染块
                        infetData = [temp,infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
            break;
        }
        return m_IsFect;
    }
    //特效块块: 检测爆炸快是否有传染块并获取需要传染的块
    public  GetLodingInfectEffect(Round,DoBlock,Type,selfindex?:number){
        let m_IsFect = false;
        let m_DoBlock = [];
        let m_selfindex = selfindex;
        //默认为红色块
        let infectBlockId=1003;
        let infetData = [];
        //是否是银币
        for(let item of DoBlock){
            if(!item || item == null || item.getItemNone()){
                continue;
            }
            let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            if(!item || item.IsItemNull() || item.getItemNone()){
            // if(!item || item.IsItemNull()){
                let selfButton = this.GetButtonItemByIndex(index);
                if(selfButton.IsFect){
                    m_DoBlock.push(item);
                }
                continue;
            }
            //特殊判断
           if(!this.CheckInfectSpecialBlock(item,index)){
               continue;
           }
            m_DoBlock.push(item);
        }
        //风车，爆炸，魔法师单独判断
        if(Type != 5 && Type != 3 && Type != 2){
            for(let item of m_DoBlock){
                let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                if(TG_Game.Buttons[index].IsFect){
                    m_IsFect = true;
                    break;
                }
            }
            if(!m_IsFect){
                return false;
            }
        }
        //自己是传染块
        let selfButtonBlockId = 1004;
        if(m_selfindex<0||m_selfindex>this.ColNum*this.RowNum-1){
            return;
        }else{
            selfButtonBlockId = this.GetButtonBlockIdByIndex(m_selfindex);
        }
        if(selfButtonBlockId == 1003){
            infectBlockId = 1003;
        }else if(selfButtonBlockId == 1004){
            infectBlockId = 1004;
        }

        switch (Type){
            case 0: //特效块 横消
                //是否有传染块 特殊判断
                let selfSpecialBooleH = false; //当前块是否是传染块
                let selfButtonH = this.GetButtonItemByIndex(m_selfindex);
                if(selfButtonH.IsFect){
                    selfSpecialBooleH = true;
                }
                    //可以被传染
                if(selfSpecialBooleH){
                    //自己是感染块
                    //左边
                    for(let i = selfButtonH.SitePos.X-1;i>=0;i--){
                        if(i<0){
                            break;
                        }
                        let m_ButtonH = this.GetItemByPos(selfButtonH.SitePos.Y,i);
                        if(m_ButtonH.IsItemNust()){
                            //银币拦截
                            break;
                        }
                        for(let temp of m_DoBlock){
                            if(temp.SitePos.X == m_ButtonH.SitePos.X){
                                infetData = [temp,infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    //右边
                    for(let i = selfButtonH.SitePos.X+1;i<this.RowNum;i++){
                        if(i>this.RowNum){
                            break;
                        }
                        let m_ButtonH = this.GetItemByPos(selfButtonH.SitePos.Y,i);
                        if(m_ButtonH.IsItemNust()){
                            //银币拦截
                            break;
                        }
                        for(let temp of m_DoBlock){
                            if(temp.SitePos.X == m_ButtonH.SitePos.X){
                                infetData = [temp,infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }

                    }
                    // 结束
                    return true;
                }else{
                    //特殊快不是感染块
                    let selfSpecialBoxH =  this.GetItemByIndex(m_selfindex);
                    if(selfSpecialBoxH.SitePos.X<0 || selfSpecialBoxH.SitePos.X >= this.ColNum || selfSpecialBoxH.SitePos.Y >= this.RowNum || selfSpecialBoxH.SitePos.Y<0){
                        return false;
                    }
                    //左边的特殊块
                    for(let i = selfButtonH.SitePos.X-1;i>=0;i--){
                        if(i<0){
                            break;
                        }
                        let InfectButtonIndex = this.GetIndexByPos(selfButtonH.SitePos.Y,i);
                        let InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        let selfButtonBlockIdH = this.GetButtonBlockIdByIndex(InfectButtonIndex);

                        if(InfectButton.IsFect){
                            if(selfButtonBlockIdH == -1){
                                continue;
                            }
                            if(selfButtonBlockIdH == 1003){
                                infectBlockId = 1003;
                            }else{
                                infectBlockId = 1004;
                            }
                            for(let i=InfectButton.SitePos.X-1;i<this.RowNum;i--){
                                if(i<0){
                                    break;
                                }
                                let m_ButtonH  = this.GetItemByPos(InfectButton.SitePos.Y,i);
                                if(m_ButtonH.IsItemNust()){
                                    //银币拦截
                                    break;
                                }
                                for(let temp of m_DoBlock){
                                    if(temp.SitePos.X == m_ButtonH.SitePos.X){
                                        infetData = [temp,infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //右边的特殊块
                    for(let i = selfButtonH.SitePos.X+1;i<this.RowNum;i++){
                        if(i>this.RowNum){
                            break;
                        }
                        let InfectButtonIndex = this.GetIndexByPos(selfButtonH.SitePos.Y,i);
                        let InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        let selfButtonBlockIdV = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if(InfectButton.IsFect){
                            if(selfButtonBlockIdV == -1){
                                continue;
                            }
                            if(selfButtonBlockIdV == 1003){
                                infectBlockId = 1003;
                            }else{
                                infectBlockId = 1004;
                            }
                            for(let i=InfectButton.SitePos.X+1;i<this.RowNum;i++){
                                if(i>this.RowNum){
                                    break;
                                }
                                let m_ButtonH  = this.GetItemByPos(InfectButton.SitePos.Y,i);
                                if(m_ButtonH.IsItemNust()){
                                    //银币拦截
                                    break;
                                }
                                for(let temp of m_DoBlock){
                                    if(temp.SitePos.X == m_ButtonH.SitePos.X){
                                        infetData = [temp,infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            break;
            case 1: //特效块 竖消
                //是否有传染块
                //特殊判断
                let selfSpecialBooleV = false; //当前块是否是传染块
                let selfButtonV = this.GetButtonItemByIndex(m_selfindex);
                if(selfButtonV.IsFect){
                    selfSpecialBooleV = true;
                }
                //可以被传染
                if(selfSpecialBooleV){
                    //自己是感染块
                    //上
                    for(let i = selfButtonV.SitePos.Y-1;i>=0;i--){
                        if(i<0){
                            break;
                        }
                        let m_ButtonV = this.GetItemByPos(i,selfButtonV.SitePos.X);
                        if(m_ButtonV.IsItemNust()){
                            //银币拦截
                            break;
                        }
                        for(let temp of m_DoBlock){
                            if(temp.SitePos.Y == m_ButtonV.SitePos.Y){
                                infetData = [temp,infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    //下
                    for(let i = selfButtonV.SitePos.Y+1;i<this.ColNum;i++){
                        if(i<this.ColNum){
                            break;
                        }
                        let m_ButtonV = this.GetItemByPos(i,selfButtonV.SitePos.X);
                        if(m_ButtonV.IsItemNust()){
                            //银币拦截
                            break;
                        }
                        for(let temp of m_DoBlock){
                            if(temp.SitePos.Y == m_ButtonV.SitePos.Y){
                                if(temp.IsItemNust()){
                                    //银币拦截
                                    break;
                                }
                                infetData = [temp,infectBlockId];
                                TG_Game.Infects.push(infetData);
                            }
                        }
                    }
                    // 结束
                    return true;
                }else{
                    //特殊快不是感染块
                    let selfSpecialBoxV =  this.GetItemByIndex(m_selfindex);
                    if(selfSpecialBoxV.SitePos.Y<0 || selfSpecialBoxV.SitePos.Y >= this.ColNum || selfSpecialBoxV.SitePos.Y >= this.ColNum || selfSpecialBoxV.SitePos.Y<0){
                        return false;
                    }
                    //上边的特殊块
                    for(let i = selfButtonV.SitePos.Y-1;i>=0;i--){
                        if(i<0){
                            break;
                        }
                        let InfectButtonIndex = this.GetIndexByPos(i,selfButtonV.SitePos.X);
                        let InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        let selfButtonBlockIdT = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if(InfectButton.IsFect){
                            if(selfButtonBlockIdT == -1){
                                continue;
                            }
                            if(selfButtonBlockIdT == 1003){
                                infectBlockId = 1003;
                            }else{
                                infectBlockId = 1004;
                            }
                            for(let i = InfectButton.SitePos.Y-1;i>=0;i--){
                                if(i<0){
                                    break;
                                }
                                let m_ButtonV = this.GetItemByPos(i,InfectButton.SitePos.X);
                                if(m_ButtonV.IsItemNust()){
                                    //银币拦截
                                    break;
                                }
                                for(let temp of m_DoBlock){
                                    if(temp.SitePos.Y == m_ButtonV.SitePos.Y){
                                        infetData = [temp,infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //下边的特殊块
                    for(let i = selfButtonV.SitePos.Y+1;i<this.ColNum;i++){
                        if(i>this.ColNum){
                            break;
                        }
                        let InfectButtonIndex = this.GetIndexByPos(i,selfButtonV.SitePos.X);
                        let InfectButton = TG_Game.Buttons[InfectButtonIndex];
                        let selfButtonBlockIdB = this.GetButtonBlockIdByIndex(InfectButtonIndex);
                        if(InfectButton.IsFect){
                            if(selfButtonBlockIdB == -1){
                                continue;
                            }
                            if(selfButtonBlockIdB == 1003){
                                infectBlockId = 1003;
                            }else{
                                infectBlockId = 1004;
                            }
                            for(let i = InfectButton.SitePos.Y+1;i<this.ColNum;i++){
                                if(i<this.ColNum){
                                    break;
                                }
                                let m_ButtonV = this.GetItemByPos(i,InfectButton.SitePos.X);
                                if(m_ButtonV.IsItemNust()){
                                    //银币拦截
                                    break;
                                }
                                for(let temp of m_DoBlock){
                                    if(temp.SitePos.Y == m_ButtonV.SitePos.Y){
                                        infetData = [temp,infectBlockId];
                                        TG_Game.Infects.push(infetData);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            case 2: //特效块:风车
                let StartPos = this.birds[0].GetStartPos();
                let StartIndex = this.GetIndexByPos(StartPos.Y,StartPos.X);
                let StartButton = TG_Game.Buttons[StartIndex];
                let StartButtonBlockId = this.GetButtonBlockIdByIndex(StartIndex);
                m_IsFect = StartButton.IsFect;
                if(StartButton.IsFect){
                    if(StartButtonBlockId == -1){
                        return;
                    }
                    if(StartButtonBlockId == 1003){
                        infectBlockId = 1003;
                    }else{
                        infectBlockId = 1004;
                    }
                    //可以被传染
                    for(let temp of m_DoBlock){
                        if(!temp.GetExploding()){
                            //传染块
                            infetData = [temp,infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
            case 3: //特效块:炸弹
                let selfButton = this.GetButtonItemByIndex(m_selfindex);
                if(selfButton.IsFect){
                    m_IsFect = true;
                }
                if(m_IsFect){
                    //可以被传染
                    for(let temp of m_DoBlock){
                        if(temp){
                            infetData = [temp,infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
            case 4: //特效:黑洞
                //可以被传染
                for(let temp of m_DoBlock){
                    if(!temp.GetExploding()){
                        //传染块
                        infetData = [temp,infectBlockId];
                        TG_Game.Infects.push(infetData);
                    }
                }
                break;
            case 5: //特效:魔法石
                let Buttonx1MagicStone = this.GetButtonItemByIndex(m_selfindex);
                if(Buttonx1MagicStone.IsFect){
                    m_IsFect = true;
                }
                if(m_IsFect){
                    //可以被传染
                    for(let temp of m_DoBlock){
                        if(!temp.GetExploding()){
                            //传染块
                            let index = this.GetIndexByPos(temp.SitePos.Y,temp.SitePos.X);
                            infetData = [temp,infectBlockId];
                            TG_Game.Infects.push(infetData);
                        }
                    }
                }
                break;
        }
        return m_IsFect;
    }
    //判断当前爆炸的块，能否被传染
    //item 为当前爆炸块 IsEffect 生成块,特效块 Type 为当前爆炸类型
    public  CheckInfect(DoBlock,IsEffect,Type,selfindex?:number){
        //判断能否被传染
        let m_IsEffect = IsEffect;
        let m_DoBlock = DoBlock;
        let m_IsFect = false;
        let m_selfIndex = selfindex;
        TG_Game.Infects =[];

        //false 双人,单人
        let m_SingelModel = TG_Stage.SingelModel;
        //false 对方回合, true 我的回合
        let m_Round = false;

        if(!m_SingelModel){
            if(this.m_Status == GameStatus.GS_ARound){
                //我的回合
                m_Round = false;
            }
            if(this.m_Status == GameStatus.GS_BRound){
                //对方回合
                m_Round = true;
            }
        }
        if(m_IsEffect){
            //特效块
            m_IsFect = this.GetLodingInfectEffect(m_Round,m_DoBlock,Type,m_selfIndex);
        }else{
            //普通生成块
            m_IsFect = this.GetLodingInfect(m_Round,m_DoBlock,Type);
        }
        if(!m_IsFect){
            return true;
        }
        for(let fectitem of TG_Game.Infects){
            if(!fectitem){
                return true;
            }
            this.SetInfect(fectitem[0],fectitem[1]);
        }
        TG_Game.Infects = [];
        return true;
    }
    /*特殊块先传染再做特殊处理*/
    public SuperEffectInfect(index,SuperEffectArr,selfBlockId?:number){
        let superItemBlockId = 1004;
        switch (index){
            case 0:
                //横横，横竖，
                //false 双人 true单人
                for(let superItem of SuperEffectArr){
                    let Index = this.GetIndexByPos(superItem.SitePos.Y,superItem.SitePos.X);
                    let superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if( superButtonBlockId == 1003){
                        superItemBlockId = 1003;
                        break;
                    }
                }

                for(let fectitem of SuperEffectArr){
                    if(!fectitem){
                        return true;
                    }
                    this.SetInfect(fectitem,superItemBlockId);
                }
            break;
            case 1:
                //横横，横竖，
                //false 双人 true单人

                for(let superItem of SuperEffectArr){
                    let Index = this.GetIndexByPos(superItem.SitePos.Y,superItem.SitePos.X);
                    let superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if( superButtonBlockId == 1003){
                        superItemBlockId = 1003;
                        break;
                    }
                }

            break;
            case 2:
                //黑洞
                for(let superItem of SuperEffectArr){
                    let Index = this.GetIndexByPos(superItem.SitePos.Y,superItem.SitePos.X);
                    let superButtonBlockId = this.GetButtonBlockIdByIndex(Index);
                    if( superButtonBlockId == 1003){
                        superItemBlockId = 1003;
                        break;
                    }
                }
                for(let fectitem of SuperEffectArr){
                    if(!fectitem){
                        return true;
                    }
                    this.SetInfect(fectitem,superItemBlockId);
                }
            break;
        }
    }
    /*根据index获取地块的blockid*/
    public GetButtonBlockIdByIndex(index){
        if(index == undefined){
            return -1;
        }
        let ButtonItem = this.GetButtonItemByIndex(index);
        return ButtonItem.BlockId;
    }
    /* 传染块传染 */
    public SetInfect(item,blockId){
        if(!item||item==null) {
            return;
        }
        let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let ButtonItem = TG_Game.Buttons[index];
        if(ButtonItem.BlockId == blockId){
            return;
        }
        //移除地块
        this.InfectMover(ButtonItem);
        //添加地板为传染块
        this.AddInfect(ButtonItem,blockId);
    }
    /* 添加传染块 */
    public AddInfect(ButtonItem,blockId){
        let Id = blockId;
        let col = ButtonItem.GetSitPos().X;
        let row = ButtonItem.GetSitPos().Y;
        let ButtonObj = GamePanel_ItemSp.getInstance().createNewInfect(Id,row,col);
        //胜利目标
        this.ItemFlyToGoal(ButtonObj);
    }
    /* 移除当前地板块 */
    public InfectMover(ButtonItem){
        if (ButtonItem == null) return;
        ButtonItem.setItemNone(true);
        ButtonItem.itemType=ItemType.TG_ITEM_TYPE_NONE;
        GamePanel_ItemSp.getInstance().clearButtons(ButtonItem);
    }
    /*传染块特殊块不传染*/
    public CheckInfectSpecialBlock(item,index){
        //冰层 砂层 不传染
        if(TG_Game.Ices[index].IsItemIce() || TG_Game.Ices[index].IsItemFlowice()){
            return false;
        }
        //云层 不传染
        if(TG_Game.Clouds[index].IsCloud()){
            return false;
        }
        //礼品盒 不传染
        if(item.IsItemGift()){
            return false;
        }
        //毛球不传染
        if(item.IsVenonat()){
            return false;
        }
        //铁丝网不传染
        if(TG_Game.Meshs[index].IsItemMesh()){
            return false;
        }
        //黄色钻石块不传染
        if(item.IsItemGem()){
            return false;
        }
        //皇冠不传染
        if(item.IsTypePea()){
            return false;
        }
        //银币不传染
        if(item.IsItemNust()){
            return false;
        }
        return true;
    }
    /*元素块爆炸*/
    public DoExplode(item:any,createEffect = false, EffectType=Msg.EffectType.ET_none){
        console.info("===============");
        console.info(item);
        console.info(EffectType);
        if(item==null) return;

        if(item.IsVenom())//是毒液
        {
            this.venomExplode = false;
        }
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let pos = item.SitePos;
        let blockId = item.BlockId;
        let isDetonate = item.isDetonate;
        let cloud = this.CheckCloudItem(item);
        if (this.CheckHasHighItems(index)){
            //如果有高层块
            let highItem=this.GetHighItems(index);
            if(highItem!=null){
                if(!highItem.GetExploding()){
                    highItem.DoExplode();
                }
                return;
            }
        }
        //消除方块
        if(item.GetEffectType()!=Msg.EffectType.ET_none && cloud == null&&!item.GetIsInfectVenom()){
            //特效块
            if(item.GetEffectType()==Msg.EffectType.ET_Gold){
                //炸弹
                Log.getInstance().trace("爆炸的特效块中有炸弹"+"引爆状态"+item.GetDetonate());
                if(!item.GetDetonate()){
                    if(item.GetSecondBoomSuper()){
                        //超级炸弹  双炸弹
                        this.SpecialExplodeCross(pos,-1,true,true)
                    }else {
                        this.SpecialExplodeCross(pos,-1,true,false)
                    }
                }
            }else if(item.GetEffectType()==Msg.EffectType.ET_Vel){
                //垂直炸一竖排
                this.SpecialExplodeVertical(pos,item.GetColorType(),-1);
            }else if(item.GetEffectType()==Msg.EffectType.ET_Hor){
                //水平炸一排
                this.SpecialExplodeHorizonal(pos,item.GetColorType(),-1);
            }else if(item.GetEffectType()==Msg.EffectType.ET_Bird){
                //风车
                this.SpecialExplodeBird(item);
            }else if(item.GetEffectType()==Msg.EffectType.ET_Black){
                //黑洞
                this.DoDetonate(item)
            }
        }
        else {
            if(item.isIces || item.isFlowIces)//冰层直接消失因为不会影响其他块
            {
                let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                GamePanel_ItemSp.getInstance().clearRect(index,TG_Game.Ices);
            } else {
                this.DoDetonate(item);


            }
        }
        // 不是被引爆的块才可以引爆周围
        if (!isDetonate)
        {
            this.DoAroundDetonate(pos, blockId);
        }
    }
    /*2层块爆炸的时候，对周边块的影响*/
    private DoAroundDetonate(pos, blockId){
        let index=this.GetIndexByPos(pos.Y,pos.X);
        if (index < 0) return;
        let entry = TG_Entry.GetEntry(blockId);
        if(entry.detonateTop){
            let topItemIndex=this.GetTopItem(index);
            if(topItemIndex!=-1){
                this.DoItemAroundDetonate(topItemIndex);
            }
        }
        if(entry.detonateButtom){
            let bottomIndex=this.GetBottomItem(index);
            if(bottomIndex!=-1){
                this.DoItemAroundDetonate(bottomIndex);
            }
        }
        if(entry.detonateLeft){
            let leftItemIndex=this.GetLeftItem(index);
            if(leftItemIndex!=-1){
                this.DoItemAroundDetonate(leftItemIndex);
            }
        }
        if(entry.detonateRight){
            let rightItemIndex =this.GetRightItem(index);
            if (rightItemIndex != -1){
                this.DoItemAroundDetonate(rightItemIndex);
            }
        }
    }
    public DoItemAroundDetonate(index){
        //获取二层元素
        let item = this.GetItemByIndex(index);
        //获取铁丝网元素
        let mesh=this.GetMeshItemByIndex(index);
        //获取云层元素
        let cloud=this.GetCloudItemByIndex(index);
        //云层块
        if(!cloud.getItemNone()&&cloud.IsCloud()&&cloud.IsCanAroundDetonate()){
            cloud.DoDetonate(cloud);
        }
        //如果二层块的上层没有铁丝网，才被引爆
        else if (item.IsCanAroundDetonate()&&!mesh.IsItemMesh()){
            item.DoDetonate(item);
        }
    }
    /*铁丝网爆炸*/
    public DoMeshExplode(item){
        if (item == null) return;
        let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        item.setItemNone(true);
        item.itemType=ItemType.TG_ITEM_TYPE_NONE;
        GamePanel_ItemSp.getInstance().clearMesh(index);
    }
    /*云层块的爆炸*/
    public DoCloudExplode(item){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        GamePanel_ItemSp.getInstance().clearRect(index,TG_Game.Clouds);
    }
    /*检测二层块是否可以爆炸*/
    public DoCheck2FloorExplode(item){
        if (this.CheckHasHighItems(item.Index)){
            //如果有高层块
            let highItem=this.GetHighItems(item.Index);
            if(highItem!=null){
                if(!highItem.GetExploding()){
                    highItem.DoExplode();
                }
            }
            return true;
        }
        return false;
    }
    /*魔法石的爆炸*/
    public DoMagicStoneExplode(item){
        if (item == null || item.getItemNone()) return;
        let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let newMagicStone = GamePanel_ItemSp.getInstance().CreateItems(item.NextId,-1,item.SitePos.Y,item.SitePos.X,false,true);
        let temp = TG_Game.Items[index];
        App.DisplayUtils.removeFromParent(temp);
        TG_Object.Release(temp);
        TG_Game.Items[index] = newMagicStone;
    }
    /*触发魔法石特效*/
    private SpecialExplodeTriangleSetTimeOut;
    private SpecialExplodeTriangleDelay=0;
    public   SpecialExplodeTriangle(pos,orientation){
        let index=this.GetIndexByPos(pos.Y,pos.X);
        let item=this.GetItemByIndex(index);
        let detonateColor=item.GetColorType();
        let tempList = [];
        switch (orientation){
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
        let fectArr = [];
        for(let itemPos of tempList){
            let itemX = itemPos[0];
            let itemY = itemPos[1];
            let item = this.GetItemByPos(itemY,itemX);
            fectArr.push(item);
        }

        this.CheckInfect(fectArr,true,5,index);

        for(let i=0;i<tempList.length;i++){
            let temp=tempList[i];
            this.doItemDetonate(temp,detonateColor);
        }
    }
    /*通过坐标点引爆*/
    private doItemDetonate(pos,detonateColor,infect = -1){
        let posX=pos[0];
        let posY=pos[1];

        let index1=posY*this.ColNum+posX;
        if (this.CheckHasHighItems(index1)){
            //如果有高层块
            let highItem=this.GetHighItems(index1);
            if(highItem!=null){
                if(!highItem.GetExploding()){
                    highItem.DoExplode();
                }
                return;
            }
        }
        if(TG_Game.Items.length>0&&posX>=0&&posX<this.ColNum&&posY>=0&&posY<this.RowNum){
            let index=posY*this.ColNum+posX;
            let item=this.GetItemByIndex(index);
            if(item.CheckMatchSpecial()){
                item.SetDetonateColor(detonateColor);
                if(item.GetEffectType()==Msg.EffectType.ET_Vel){
                    //垂直炸一竖排
                    item.MarkedAlready=true;
                    if(!item.GetAlreadyExplode()){
                        //当前没有引爆
                        this.SpecialExplodeVertical(item.SitePos,item.GetColorType(),-1);
                        //如果是子弹形成的特效块,移除上层的特效块
                        if(item.GetIsBullet()){
                            this.RemoveBullet(item.SitePos);
                        }
                    }else {
                        this.DoDetonate(item,false);
                    }
                }
                else if(item.GetEffectType()==Msg.EffectType.ET_Hor){
                    //水平炸一排
                    item.MarkedAlready=true;
                    if(!item.GetAlreadyExplode()){
                        //当前没有引爆
                        this.SpecialExplodeHorizonal(item.SitePos,item.GetColorType(),-1);
                        //如果是子弹形成的特效块,移除上层的特效块
                        if(item.GetIsBullet()){
                            this.RemoveBullet(item.SitePos);
                        }
                    }else {
                        this.DoDetonate(item,false);
                    }
                }
                else if(item.GetEffectType()==Msg.EffectType.ET_Black){
                    //黑洞
                    item.MarkedAlready=true;
                    if(!item.GetAlreadyExplode()){
                        //当前没有引爆
                        this.SpecialExplodeBlack(item.SitePos,detonateColor);
                    }else {
                        this.DoDetonate(item,false);
                    }
                }
                else if(item.GetEffectType()==Msg.EffectType.ET_Gold){
                    //炸弹
                    item.MarkedAlready=true;
                    if(!item.GetDetonate()&&!item.ET_SecondBoom){
                        //不是二次爆炸
                        if(item.GetSecondBoomSuper()){
                            //超级炸弹
                            this.SpecialExplodeCross(item.SitePos,-1,true,true)
                        }else {
                            this.SpecialExplodeCross(item.SitePos,-1,true,false);
                        }
                    }else {
                        this.DoDetonate(item,false);
                    }
                }
                else if(item.GetEffectType()==Msg.EffectType.ET_Bird){
                    //风车
                    item.MarkedAlready=true;
                    this.SpecialExplodeBird(item);
                    //如果是子弹形成的特效块,移除上层的特效块
                    if(item.GetIsBullet()){
                        this.RemoveBullet(item.SitePos);
                    }
                }
                else {
                    item.DoDetonate();
                }
            }else {
                if(item.GetEffectType()==Msg.EffectType.ET_Gold){
                    //炸弹
                    // if(this.isBulletExplode){
                    //     //如果是子弹的爆炸
                    //     item.ET_SecondBoom=false;
                    //     this.DoDetonate(item,false);
                    // }else {
                        item.ET_SecondBoom=true;
                    // }
                }else if(item.GetEffectType()==Msg.EffectType.ET_Vel){
                    //垂直炸一竖排
                    this.DoDetonate(item,false);
                }else if(item.GetEffectType()==Msg.EffectType.ET_Hor){
                    //水平炸一横排
                    this.DoDetonate(item,false);
                }else if(item.GetEffectType()==Msg.EffectType.ET_Black){
                    //黑洞
                    this.DoDetonate(item,false);
                }else if(item.GetEffectType()==Msg.EffectType.ET_Bird){
                    //风车
                    this.DoDetonate(item,false);
                }
            }
        }
    }
    /*引爆*/
    public DoDetonate(item,createEffect = false, EffectType=Msg.EffectType.ET_none,IsInfectVenom=false){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if (this.CheckHasHighItems(index)){
            //如果有高层块
            let highItem=this.GetHighItems(index);
            if(highItem!=null){
                if(!highItem.GetExploding()){
                    highItem.DoExplode();
                }
                return;
            }
        }
        
        
        item.SetDetonate(true);
        if(item==null||item.IsItemNone()) return;
        //设置爆炸状态为true
        item.SetExploding(true);
        Log.getInstance().trace("元素块爆炸====="+"["+item.SitePos.X+","+item.SitePos.Y+"]",0);

        //游戏中，飞到消除目标位置的动画
        this.ItemFlyToGoal(item);
        console.info(IsInfectVenom);
        if (!IsInfectVenom) {
            //判断3层块的消失 冰层、流沙等
            let ices = this.CheckIcesItem(item);
            if(ices)
            {
                if(!ices.GetExploding()){
                    ices.DoExplode();
                }
            }
        }

        //加分数
        this.AddScore(ScoreType.ST_Normal);
        //消除
        GamePanel_ItemSp.getInstance().clearRect(index,TG_Game.Items);

    }
    /*检测二次炸弹*/
    private isCanSecondBooms(){
        let isCanSecondBooms=false;
        for (let i = 0; i < TG_Game.Items.length; i++)
        {
            let item = TG_Game.Items[i];
            if (item.IsItemSecondBoom()) {
                isCanSecondBooms=true;
            }
        }
        Log.getInstance().trace("检测是否可以二次爆炸。。。"+isCanSecondBooms);
        return isCanSecondBooms;
    }
    private doCheckSecondBooms() {
        for (let i = 0; i < TG_Game.Items.length; i++)
        {
            let item = TG_Game.Items[i];
            if (item.IsItemSecondBoom()) {
                if(item.GetSecondBoomSuper()){
                    //超级炸弹
                    this.SpecialExplodeCross(item.SitePos,-1,true,true)
                }else {
                    this.SpecialExplodeCross(item.SitePos,-1,true,false);
                    //如果是子弹形成的特效块,移除上层的特效块
                    if(item.GetIsBullet()){
                        this.RemoveBullet(item.SitePos);
                    }
                }
                item.ET_SecondBoom=false;
            }
        }
    }
    /*获取特效方块的类型*/
    public GetEffectValue(aItem,bItem){
        let effectValue = aItem.GetEffectType() + bItem.GetEffectType();
        return effectValue;
    }
    public GetTopItem(index){
        if(index<0||index<this.ColNum){
            return -1;
        }
        return index-this.ColNum;
    }
    public GetBottomItem(index){
        if(index<0||index>=(this.RowNum-1)*this.ColNum){
            return-1;
        }
        return index+this.RowNum;
    }
    public GetTopLeftItem(index){
        if (index < 0 || index < this.ColNum){
            return -1;
        }
        if (index%this.ColNum== 0) {
            return -1;
        }
        return index - this.ColNum - 1;
    }
    public GetBottomLeftItem(index){
        if (index < 0 || index / this.ColNum == this.RowNum - 1)
        {
            return -1;
        }
        if (index % this.ColNum == 0)
        {
            return -1;
        }
        return index + this.ColNum - 1;
    }
    public GetTopRightItem(index){
        if (index < 0 || index < this.ColNum)
        {
            return -1;
        }
        if (index % this.ColNum == this.ColNum - 1)
        {
            return -1;
        }
        return index - this.ColNum + 1;
    }
    public GetBottomRightItem(index){
        if (index < 0 || index /this.ColNum == this.RowNum - 1)
        {
            return -1;
        }
        if (index % this.ColNum == this.ColNum - 1)
        {
            return -1;
        }
        return index + this.ColNum + 1;
    }
    public GetLeftItem(index){

        if (index < 0 || index % this.RowNum == 0)
        {
            return -1;
        }
        return index - 1;
    }
    public GetRightItem(index){
        if (index < 0 || index % this.RowNum == this.RowNum - 1)
        {
            return -1;
        }
        return index + 1;
    }
    /*游戏开始时的掉落*/
    public doStartDrop(){
        TG_Game.IsBeginPanelStartDrop=true;
        this.doDrop("startDrop");
    }
    /*掉落*/
    public doDrop(flag=""){
        Log.getInstance().trace("开始掉落");
        //无限掉落
        this.combo += 1;
        if (this.combo >= 99){
            this.infiniteDrop = true;
            //判断游戏结束
            if (this.doCheckGameFinish()){
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
    }
    private doDropImpl(){
        //掉落逻辑
        this.doDropLogic();
        //掉落路径
        this.calDropPath();
        // 执行掉落表现
        this.doDropPerform();
    }
    /*掉落逻辑*/
    private doDropLogic(){
        //垂直掉落
        this.doDropWhitVertical();
        let createList = [];
        // 出生点产生新块
        while (this.doCreateItemFromBirthPos(createList))
        {
            this.doItemDrop(createList,false);
            createList=[];
        }
        // 侧滑掉落
        let res = this.doItemDrop(TG_Game.Items,true);
        if (res){
            this.doDropLogic();
        }
    }
    /*侧滑掉落*/
    private doItemDrop(drops,isSilde=true){
        let res=false;
        for(let i=drops.length-1;i>=0;i--){
            let item = drops[i];
            if (item.DropPaths.length <= 0) item.AddDropPath(item.SitePos);
            res = this.doItemDrop1(item, isSilde) || res;
        }
        return res;
    }
    private doItemDrop1(item,isSilde){
        if(!item.CheckCellFallDown()) return false;
        let res=false;
        let isDrop=true;
        while (isDrop){
            isDrop=false;
            let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
            let target=this.findBottomWhitVerticalLogic(item);
            if(target!=null){
                isDrop=true;
                res=true;
                for(let i=item.SitePos.Y;i<=target.SitePos.Y;i++){
                    let vec2={"X":item.SitePos.X,"Y":i};
                    item.AddDropPath(vec2);
                }
                let isAddDownGroups=true;
                for(let ctarget of this.downGroups){
                    let targetIndex=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                    let ctargetIndex=this.GetIndexByPos(ctarget.SitePos.Y,ctarget.SitePos.X);
                    if(ctargetIndex==targetIndex){
                        isAddDownGroups=false;
                        break;
                    }
                }
                if(isAddDownGroups){
                    this.downGroups.push(item);
                }
                let targetIndex=this.GetIndexByPos(target.SitePos.Y,target.SitePos.X);
                this.SwapItem1(index,targetIndex);
            }
            let bottomLeftIndex=this.GetBottomLeftItem(index);
            if(!isDrop&&bottomLeftIndex>=0){
                let bottomLeft=this.GetItemByIndex(bottomLeftIndex);
                if(bottomLeft&&isSilde&&!this.CheckExistBirthPos(bottomLeft)&&this.CheckCanSildeLeft(item)){
                    isDrop=true;
                    res=true;
                    item.AddDropPath(bottomLeft.GetSitPos());
                    let isAddDownGroups=true;
                    for(let ctarget of this.downGroups){
                        let targetIndex=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                        let ctargetIndex=this.GetIndexByPos(ctarget.SitePos.Y,ctarget.SitePos.X);
                        if(ctargetIndex==targetIndex){
                            isAddDownGroups=false;
                            break;
                        }
                    }
                    if(isAddDownGroups){
                        this.downGroups.push(item);
                    }
                    let lIndex=this.GetIndexByPos(bottomLeft.SitePos.Y,bottomLeft.SitePos.X);
                    this.SwapItem1(index,lIndex);
                }
            }
            let bottomRightIndex=this.GetBottomRightItem(index);
            if(!isDrop&&bottomRightIndex>=0){
                let bottomRight=this.GetItemByIndex(bottomRightIndex);
                if(bottomRight&&isSilde&&!this.CheckExistBirthPos(bottomRight)&&this.CheckCanSildeRight(item)){
                    isDrop=true;
                    res=true;
                    item.AddDropPath(bottomRight.GetSitPos());
                    let isAddDownGroups=true;
                    for(let ctarget of this.downGroups){
                        let targetIndex=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                        let ctargetIndex=this.GetIndexByPos(ctarget.SitePos.Y,ctarget.SitePos.X);
                        if(ctargetIndex==targetIndex){
                            isAddDownGroups=false;
                            break;
                        }
                    }
                    if(isAddDownGroups){
                        this.downGroups.push(item);
                    }
                    let rIndex=this.GetIndexByPos(bottomRight.SitePos.Y,bottomRight.SitePos.X);
                    this.SwapItem1(index,rIndex);
                }
            }
        }
        return res;
    }
    private findBottomWhitVerticalLogic(cur){
        let index=this.GetIndexByPos(cur.SitePos.Y,cur.SitePos.X);
        let bottomIndex=this.GetBottomItem(index);
        if (bottomIndex < 0) return null;
        let target = this.GetItemByIndex(bottomIndex);
        if (!this.CheckCellThrough(target)) return null;
        while (bottomIndex >= 0 && this.CheckCellThrough(target))
        {
            bottomIndex = this.GetBottomItem(bottomIndex);
            if (bottomIndex >= 0){
                target = this.GetItemByIndex(bottomIndex);
            }
        }
        while (this.GetIndexByPos(target.SitePos.Y,target.SitePos.X) > index &&!this.CheckCanDropIn(target))
        {
            let topIndex = this.GetTopItem(this.GetIndexByPos(target.SitePos.Y,target.SitePos.X));
            target = this.GetItemByIndex(topIndex);
        }
        if (this.CheckCanDropIn(target))
        {
            return target;
        }
        return null;
    }
    private CheckExistBirthPos(item){
        if(!item.getItemNone()){
            return false;
        }
        let topIndex=this.GetTopItem(this.GetIndexByPos(item.SitePos.Y,item.SitePos.X));
        while (topIndex>=0){
            let top=this.GetItemByIndex(topIndex);
            if (top&&!top.CheckCellVerticalFallDown() && !this.CheckCellThrough(top))
            {
                return false;
            }
            topIndex = this.GetTopItem(topIndex);
        }
        return true;
    }
    private CheckCanSildeLeft(item){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let blIndex = this.GetBottomLeftItem(index);
        if (blIndex < 0 || blIndex > this.RowNum*this.ColNum-1){
            return false;
        }
        let blItem = this.GetItemByIndex(blIndex);
        if (blItem == null){
            return false;
        }
        if (!blItem.getItemNone()){
            return false;
        }
        let blButton =this.GetButtonItemByIndex(blIndex);

        if (blButton.IsItemNull() || blButton.IsItemCross())
        {
            return false;
        }

        let railing =this.GetRailingItemByIndex(index);

        let lIndex = this.GetLeftItem(index);
        let lRailing = this.GetRailingItemByIndex(lIndex);

        let blRailing = this.GetRailingItemByIndex(blIndex);
        let bIndex = this.GetBottomItem(index);
        let bRailing = this.GetRailingItemByIndex(bIndex);
        //左下路径
        if(!railing.CheckStopMove(3) && !lRailing.CheckStopMove(4) &&
            !lRailing.CheckStopMove(2) && !blRailing.CheckStopMove(1))
        {
            return true;
        }
        //下左路径
        if(!railing.CheckStopMove(2) && !bRailing.CheckStopMove(1) &&
            !bRailing.CheckStopMove(3) && !blRailing.CheckStopMove(4))
        {
            return true;
        }
        return false;
    }
    private CheckCanSildeRight(item){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let brIndex = this.GetBottomRightItem(index);
        if (brIndex < 0 || brIndex > this.RowNum*this.ColNum-1) {
            return false;
        }
        let brItem =this.GetItemByIndex(brIndex);
        if (brItem == null){
            return false;
        }
        if (!brItem.getItemNone()){
            return false;
        }
        let brButton = this.GetButtonItemByIndex(brIndex);
        if (brButton.IsItemNull() || brButton.IsItemCross())
        {
            return false;
        }
        let railing =this.GetRailingItemByIndex(index);

        let rIndex = this.GetRightItem(index);
        let rRailing = this.GetRailingItemByIndex(rIndex);

        let brRailing =this.GetRailingItemByIndex(brIndex);
        let bIndex = this.GetBottomItem(index);
        let bRailing =this.GetRailingItemByIndex(bIndex);
        //右下路径
        if (!railing.CheckStopMove(4) && !rRailing.CheckStopMove(3) &&
            !rRailing.CheckStopMove(2) && !brRailing.CheckStopMove(1))
        {
            return true;
        }
        //下右路径
        if (!railing.CheckStopMove(2) && !bRailing.CheckStopMove(1) &&
            !bRailing.CheckStopMove(4) && !brRailing.CheckStopMove(3))
        {
            return true;
        }
        return false;
    }

    /*垂直掉落*/
    private downGroups=[];//本回合掉落的块
    private doDropWhitVertical(){
        let res=false;
        for(let i=this.ColNum*this.RowNum-1;i>=0;i--){
            let item=this.GetItemByIndex(i);
            if(this.CheckCanDropIn(item)){
                let target=this.findDropWhitVerticalLogic(item);
                if(target==null) continue;
                target.AddDropPath(item.GetSitPos());
                let isAddDownGroups=true;
                for(let ctarget of this.downGroups){
                    let targetIndex=this.GetIndexByPos(target.SitePos.Y,target.SitePos.X);
                    let ctargetIndex=this.GetIndexByPos(ctarget.SitePos.Y,ctarget.SitePos.X);
                    if(ctargetIndex==targetIndex){
                        isAddDownGroups=false;
                        break;
                    }
                }
                if(isAddDownGroups){
                    this.downGroups.push(target);
                }
                let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                this.SwapItem1(index,this.GetIndexByPos(target.SitePos.Y,target.SitePos.X));
                res=true;
            }
        }
        return res;
    }
    public SwapItem1(first,second,itemArr:Array<any> =  TG_Game.Items) {
        this.changeItemPosByIndex(first,second,itemArr);
        this.changeItemIndexByIndex(first,second,itemArr);
    }
    /*是否可以掉落*/
    private CheckCanDropIn(item){
        let isCanDropIn=true;
        if (!item.getItemNone()){
            isCanDropIn=false;
        }
        let  index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if (index < 0 || index > this.ColNum*this.RowNum-1) {
            isCanDropIn=false;
        }
        let button = this.GetButtonItemByIndex(index);

        if (button.IsItemNull()) {
            isCanDropIn=false;
        }
        if (button.IsItemCross())
        {
            let bottomIndex = this.GetBottomItem(index);
            if (bottomIndex > 0)
            {
                let buttom = this.GetItemByIndex(bottomIndex);
                isCanDropIn=this.CheckCanDropIn(buttom);
            }
            isCanDropIn=false;
        }
        let railing=this.GetRailingItemByIndex(index);
        if(railing.IsItemRailing()){
            if (railing.CheckStopMove(1))
            {
                isCanDropIn=false;
            }
        }
        let topIndex=this.GetTopItem(index);
        if(topIndex>0) {
            railing = this.GetRailingItemByIndex(topIndex);
            if (railing.IsItemRailing()) {
                if (railing.CheckStopMove(2)) {
                    isCanDropIn=false;
                }
            }
        }
        return isCanDropIn;
    }
    /*是否可以垂直掉落*/
    private CheckCellVerticalFallDown(item){
        let index = this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if (index < 0 || index > this.ColNum*this.RowNum-1) {
            return false;
        }
        if (item.getItemNone()){
            return false;
        }
        let button = this.GetButtonItemByIndex(index);

        if (button.IsItemNull()) {
            return false;
        }
        let mesh = this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh()) {
            return false;
        }
        //自己的下
        let railing=this.GetRailingItemByIndex(index);
        if(railing.IsItemRailing()){
            if (railing.CheckStopMove(2)){
                return false;
            }
        }
        //下方块的上
        let bottomIndex=this.GetBottomItem(index);
        if(bottomIndex>0){
            railing=this.GetRailingItemByIndex(bottomIndex);
            if(railing.IsItemRailing()){
                if (railing.CheckStopMove(1))
                {
                    return false;
                }
            }
        }
        return true;
    }
    private findDropWhitVerticalLogic(item){
        let index=this.GetTopItem(this.GetIndexByPos(item.SitePos.Y,item.SitePos.X));
        if(index>=0){
            let top=this.GetItemByIndex(index);
            if(top.CheckCellFallDown()){
                top.AddDropPath(top.SitePos);
                if(!top.getItemNone()) {
                    return top;
                }
            }
            if (this.CheckCellThrough(top)) {
                let target = this.findDropWhitVerticalLogic(top);
                if (target!= null) {
                    target.AddDropPath(top.SitePos);
                    return target;
                }
            }
        }
        return null;
    }
    public CheckCellThrough(item){
        if (!item.getItemNone()){
            return false;
        }
        let index= this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if(index<0||index>(this.ColNum*this.RowNum-1)) {
            return false;
        }
        var botton =this.GetButtonItemByIndex(index);
        if (!botton.CanFallThrough)
        {
            return false;
        }
        //自己的上
        let railing=this.GetRailingItemByIndex(index);
        if(railing.IsItemRailing()){
            if (railing.CheckStopMove(1))
            {
                return false;
            }
        }
        //上方块的下
        let topIndex=this.GetTopItem(index);
        if(topIndex>0){
            railing=this.GetRailingItemByIndex(topIndex);
            if(railing.IsItemRailing()){
                if (railing.CheckStopMove(2))
                {
                    return false;
                }
            }
        }
        return true;
    }
    private CheckCellFallDown(item){
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if(index<0||index>80){
            return false;
        }
        if(item.getItemNone()){
            return false;
        }
        let button = this.GetButtonItemByIndex(index);

        if (button.IsItemNull()) {
            return false;
        }
        let mesh = this.GetMeshItemByIndex(index);
        if (mesh.IsItemMesh()&&!mesh.getItemNone()) {
            return false;
        }
        return true;
    }
    /*掉落路径计算*/
    private calDropPath(){
        let temps=[];
        let complateCount=0;
        while(true){
            temps=[];
            for(let item of this.downGroups){
                if(item.DropPaths.length>0){
                    let pos=item.DropPaths[0];

                    if(pos.delayTime != undefined)
                        pos = {"X":pos.X,"Y":pos.Y,"needDelayTime":pos.needDelayTime,"delayTime":pos.delayTime};
                    else
                    {
                        pos = {"X":pos.X,"Y":pos.Y,"needDelayTime":false,"delayTime":0};
                    }

                    let curIndex=this.GetIndexByPos(pos.Y,pos.X);
                    if(temps.indexOf(curIndex)==-1){
                        //不存在，注入数组
                        temps.push(curIndex);
                        item.AddActionPath(pos);
                        item.RemoveDropPath(pos);
                    }else {
                        item.AddActionPathToo();
                        let cPos=item.ActionPaths[item.ActionPaths.length-1];
                        temps.push(this.GetIndexByPos(cPos.Y,cPos.X));
                    }
                }
                if(item.DropPaths.length<=0&&!item.IsCalDropPath){
                    complateCount++;
                    item.IsCalDropPath=true;
                }
            }
            if(complateCount>=this.downGroups.length){
                break;
            }
        }
        for(let item of this.downGroups){
            item.IsCalDropPath=false;
            item.DropPaths=[];
            for(let pos of item.ActionPaths){
                // item.DropPaths.push(pos);
                item.AddDropPath(pos,false);
            }
        }
    }
    /*执行掉落表演*/
    private downRectTime=150;
    // public  downGroupsLastPoint=null;//本次掉落最后一个点
    private doDropPerform(){
        this.downRectTime=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        //计算新产生方块掉落的 delayTime needDelayTime
        let createList=[];
        for(let i=0;i<this.createList.length;i++){
            let temp=this.createList[i];
            let repeatCount=TG_ItemAnimator.getInstance().CalculateDropDelayNum(temp);
            try {
                if(repeatCount!=0){
                    if(temp.DropPaths[repeatCount]["needDelayTime"]!=undefined&&temp.DropPaths[repeatCount]["needDelayTime"]==true){
                        createList.push(temp);
                    }
                }
            }catch (e){
                Log.getInstance().trace(e,0)
            }
        }
        let dropPos=[];
        let dropPosYs=[];//掉落列的集合
        for(let i=0;i<this.ColNum;i++){
            let obj={"col":-1,"delayBaseNum":-1};
            obj.col=i;
            obj.delayBaseNum=0;
            dropPos.push(obj)
        }
        for(let i=0;i<this.downGroups.length;i++){
            let obj={"colNum":0,"maxNum":0};
            obj.colNum=this.downGroups[i].SitePos.X;
            obj.maxNum=this.downGroups[i].DropPaths.length-1;
            dropPosYs.push(obj);
        }
        for(let s in  dropPosYs){
            let posY=dropPosYs[s].colNum;
            for(let k in dropPos){
                if(dropPos[k].col==posY){
                    dropPos[k].delayBaseNum=dropPosYs[s].maxNum;
                }
            }
        }
        for(let k =createList.length-1;k>=0;k--){
            let temp=createList[k];
            let repeatCount=TG_ItemAnimator.getInstance().CalculateDropDelayNum(temp);
            Log.getInstance().trace("============本回合新生成的块====================");
            Log.getInstance().trace("["+temp.SitePos.X+","+temp.SitePos.Y+"]");
            for(let k1 in dropPos){
                if(dropPos[k1].col==temp.SitePos.X){
                    let len=0;
                    if(temp.DropPaths.length>1){
                        len=temp.DropPaths.length-1;
                    }else {
                        len=temp.DropPaths.length;
                    }
                    let time=TG_ItemAnimator.getInstance().CalculateDropTime(len)/(len)*.4;
                    let value=dropPos[k1].delayBaseNum;
                    if(repeatCount != 0)
                    {
                        if(temp.DropPaths[repeatCount-1].X !=temp.DropPaths[repeatCount].X )
                        {
                            temp.DropPaths[repeatCount]["delayTime"] = time*value;
                        }
                        else
                        {
                            temp.DropPaths[repeatCount]["delayTime"] = 0;
                        }
                    }
                    else
                    {
                        temp.DropPaths[repeatCount]["delayTime"] = 0;
                    }
                }
            }
        }
        //掉落
        // this.downGroupsLastPoint=null;
        if(this.downGroups.length>0){
            let arr=[];
            for(let temp of this.downGroups){
                let time=TG_ItemAnimator.getInstance().CalculateTotalDropTime(temp)*temp.DropPaths.length;
                arr.push(time);
            }
            arr.sort(function (num1,num2) {
                return num1-num2;
            });
            let delayTime=eval(arr[arr.length-1]+30);
            if(delayTime<TG_Game.MaxdropDelay){
                delayTime=TG_Game.MaxdropDelay;
            }
            App.TimerManager.doTimer(delayTime,1,this.onDropBack,this)
            //this.downGroupsLastPoint=this.downGroups[this.downGroups.length-1].SitePos;
        }else {
            this.onDropBack();
        }
        for(let i=0;i<this.downGroups.length;i++){
            let drop=this.downGroups[i];
            Log.getInstance().trace("========本回合掉落的方块=========");
            Log.getInstance().trace("["+drop.SitePos.X+","+drop.SitePos.Y+"]");
            // Log.getInstance().trace(drop.DropPaths,0)
            //掉落
            GamePanel_ItemSp.getInstance().ItemDropPlay(drop,drop.DropPaths);
        }
    }
    /*初始化出生点*/
    private birthPosYs = [];//宝石出生点Y坐标
    public initBirthPos(){
        for(let col=0;col<this.ColNum;col++){
            this.birthPosYs.push(-1);
        }
        for(let col=0;col<this.ColNum;col++){
            for(let row=0;row<this.RowNum;row++){
                let index=row*this.RowNum+col;
                let item=this.GetItemByIndex(index);
                if(item!=null&&this.CheckIsBirthPos(index)){
                    this.birthPosYs[col] = item.SitePos.Y;
                    break;
                }
            }
        }
    }
    public CheckIsBirthPos(index){
        if(index<0||index>this.ColNum*this.RowNum-1){
            return false;
        }
        let button = this.GetButtonItemByIndex(index);

        if (button.IsItemNull()) {
            return false;
        }
        return true;
    }
    /*出生点产生新块*/
    public createList = [];
    private doCreateItemFromBirthPos(createList){
        let res = false;
        for(let i=0;i<this.RowNum;i++){
            let birthPos=[i,this.birthPosYs[i]];
            let birthIndex=this.GetIndexByPos(birthPos[1],birthPos[0]);
            if(birthIndex<0||birthIndex>this.ColNum*this.RowNum-1) continue;
            let birthItem=this.GetItemByIndex(birthIndex);
            if(this.CheckCanDropIn(birthItem)){
                let item=this.createNormalItem(i,this.birthPosYs[i]);
                if(item==null) continue;
                let pos={"X":0,"Y":0,"needDelayTime":true,"delayTime":0};
                pos.X=item.GetSitPos().X;
                pos.Y=item.GetSitPos().Y;
                item.AddDropPath(pos);
                createList.push(item);
                let isAddDownGroups=true;
                for(let ctarget of this.downGroups){
                    let targetIndex=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
                    let ctargetIndex=this.GetIndexByPos(ctarget.SitePos.Y,ctarget.SitePos.X);
                    if(ctargetIndex==targetIndex){
                        isAddDownGroups=false;
                        break;
                    }
                }
                if(isAddDownGroups){
                    this.downGroups.push(item);
                }
                res=true;
            }
        }
        return res;
    }
    //初始化掉落游标
    private dropCursor=[]; //掉落游标
    public initDropCursor(){
        this.downGroups=[];
        for (let i = 0; i < this.ColNum; i++)
        {
            this.dropCursor.push(0);
        }
    }
    public createNormalItem(colPos,rowPos){
        let id=0;
        let DropModels=[];
        if (this.rollLeaveDrops[colPos].length > 0) {
            // 滚动遗留掉落
            let idx =this.rollLeaveDrops[colPos].length - 1;
            id = this.rollLeaveDrops[colPos][idx];
            this.rollLeaveDrops[colPos].splice(idx,1);
        }else {
            if(TG_Stage.DropModels.length<=0){
                //老数据
                let DropModel=0;
                if(TG_Stage.DropModel==false){
                    DropModel=0;
                }else {
                    DropModel=1;
                }
                for(let i=0;i<9;i++){
                    DropModels.push(DropModel);
                }
            }else {
                //新数据
                DropModels=TG_Stage.DropModels;
            }
            //顺序掉落
            if(DropModels[colPos]==1){
                let cursor = this.dropCursor[colPos];
                id = TG_Stage.DropBlocks[colPos].DropIds[cursor];
                cursor = cursor + 1 >= TG_Stage.DropBlocks[colPos].DropIds.length ? 0 : cursor + 1;
                this.dropCursor[colPos] = cursor;
            }
            //随机掉落
            else {
                let len=TG_Stage.DropBlocks[colPos].DropIds.length;
                let random = Math.floor(Math.random()*len);
                id = TG_Stage.DropBlocks[colPos].DropIds[random];
            }
        }
        let newId=LoadNetworkImageUtils.getRandom_LayerId(id);
        let newItem=GamePanel_ItemSp.getInstance().createNewRect(newId,rowPos,colPos);
        newItem.setItemNone(false);
        let index = TG_Game.getInstance().GetIndexByPos(rowPos, colPos);
        TG_Game.Items[index] = newItem;
        this.createList.push(newItem);
        return newItem;
    }
    /*本次掉落表演的时间*/
    public SetDropDelay(delay){
        if (delay > TG_Game.MaxdropDelay)
        {
            TG_Game.MaxdropDelay = delay;
        }
    }
    /*掉落完毕*/
    public onDropBack(){
        //客户端
        Log.getInstance().trace(" 本回合全部掉落完毕。。。。。");
        TG_Game.MaxdropDelay=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay);
        this.createList=[];
        // this.downGroupsLastPoint=null;
        // 重置元素移动状态
        for (let temp of TG_Game.Items) {
            // 重置元素移动状态
            temp.SetMoveItem(false);
            temp.SetMarkedHor(0);
            temp.SetMarkedVel(0);
            temp.MarkedForExplodingCallfunc=false;
            temp.MarkedAlready=false;
            temp.ActionPaths=[];
            temp.DropPaths=[];
            temp.SetDetonate(false);
            temp.SetExploding(false);
        }
        //爆炸状态
        this._explosiveType = 0;
        this._aExItem=null;
        this._bExItem=null;
        //掉落数组清空
        this.downGroups=[];
        if(this.birds.length>0){
            this.doCheckBirds();
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.BirdFlyTime)+TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay),1,function () {
                this.birdIndex=0;
                this.birds=[];
                this.doDrop();
            }.bind(this),this);
            return;
        }
        //检测二次爆炸
        if(this.isCanSecondBooms()){
            //可以二次爆炸
            this.doCheckSecondBooms();
            App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay),1,this.doDrop,this);
        }else if(this.isBulletExplode){
            //如果是黑洞与其他特效块交换 子弹特效
            this.BulletMoveCallbackExplode();
        }
        else {
            this.doCheckMoved();

        }
    }

    public changeDoMove(isSetCanUse:boolean=true) {
        TG_Game.IsPlayerDoMove = isSetCanUse;//玩家手动操作
        TG_Game.IsPlayerDoMoveByEgg = isSetCanUse;//玩家手动操作可以触发鸡蛋块爆炸
        TG_Game.IsPlayerDoMoveForHasPea1 = isSetCanUse;//月饼坑
        TG_Game.IsPlayerDoMoveForHasPea2 = isSetCanUse;//月饼坑
        TG_Game.IsPlayerDoMoveForFlowIceLogic = isSetCanUse;//流沙
        TG_Game.IsPlayerDoMoveForVenomInfect = isSetCanUse;//小恶魔
        TG_Game.IsPlayerDoMoveForChangeColorBlock = isSetCanUse;//变色块
        TG_Game.IsPlayerDoMoveForHairBallMove = isSetCanUse;//毛球
        TG_Game.IsPlayerDoMoveForBelts = isSetCanUse;// 传送带逻辑
    }

    private doCheckMoveSetTimeOut;
    public doCheckMoved(){
        //如果游戏开始的掉落
        if(TG_Game.IsBeginPanelStartDrop){
            TG_Game.IsBeginPanelStartDrop=false;
            if(!TG_Stage.SingelModel){
                //pk模式
                if(this.m_Status==GameStatus.GS_ARound){
                    this.gamePop(PopupType.Pop_MyTurn,true)
                }else {
                    this.gamePop(PopupType.Pop_EnemyTurn,true);
                    App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
                }
                //启动单回合的20s倒计时
                App.MessageCenter.dispatch(Msg.Event.RoundTime);
            }else {
                //棋盘是否需要打乱
                let hasEx=this.doRandomExchangeAllItem();
                if(typeof (hasEx)=="boolean"){
                    //启动棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
                }
                Log.getInstance().trace("游戏开始的掉落___是否需要打乱棋盘______"+hasEx);
            }
            this.combo=0;
            return;
        }
        if (this.doRemove()){
            Log.getInstance().trace("可以消除...............................");

            if (this.m_FisrtMarkRemove){
                this.m_FisrtMarkRemove = false;
                this.doCheckPlayerPkLink();
            }
            let delayTime=TG_Game.MaxdropDelay;
            if(this.doCheckMoveSetTimeOut){
                clearTimeout(this.doCheckMoveSetTimeOut);
            }
            this.doCheckMoveSetTimeOut=setTimeout(function () {
                clearTimeout(this.doCheckMoveSetTimeOut);
                this.doDrop();
            }.bind(this),delayTime);
        } else {
            //异步块爆炸
            if(this.doAsyncExplode()){
                this.SpecialExplodeTriangleDelay=8*TG_TimeDefine.MagicStoneDifferenceInterval+TG_TimeDefine.NormalBomoDelay;
                if(this.SpecialExplodeTriangleSetTimeOut){
                    clearTimeout(this.SpecialExplodeTriangleSetTimeOut);
                }
                this.SpecialExplodeTriangleSetTimeOut=setTimeout(function () {
                    clearTimeout(this.SpecialExplodeTriangleSetTimeOut);
                    this.doDrop();
                }.bind(this),this.SpecialExplodeTriangleDelay);
                return;
            }
            if(TG_Game.IsPlayerDoMove){
                if (TG_Game.IsPlayerDoMoveForHasPea1) {
                    TG_Game.IsPlayerDoMoveForHasPea1 = false;
                    // 月饼坑处理逻辑
                    let isHasPea = this.doWithPea();
                    if (isHasPea) {
                        App.TimerManager.doTimer(800,1,this.doDrop,this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForBelts) {
                    TG_Game.IsPlayerDoMoveForBelts = false;
                    let beltsMove=this.beltsMove();
                    if(beltsMove){
                        App.TimerManager.doTimer(600,1,this.doCheckMoved,this);
                        return;
                    }
                }
                if (TG_Game.IsPlayerDoMoveForHasPea2) {
                    TG_Game.IsPlayerDoMoveForHasPea2 = false;//月饼坑
                    // 月饼坑处理逻辑
                    let isHasPea = this.doWithPea();
                    if (isHasPea) {
                        App.TimerManager.doTimer(800,1,this.doDrop,this);
                        return;
                    }
                }

                if (TG_Game.IsPlayerDoMoveForFlowIceLogic) {
                    TG_Game.IsPlayerDoMoveForFlowIceLogic = false;
                    let doFlowIceLogic=this.doFlowIceLogic();//执行开始流沙
                    if(doFlowIceLogic>0){
                        App.TimerManager.doTimer(700,1,this.doCheckMoved,this);
                        return;
                    }
                }

                if (TG_Game.IsPlayerDoMoveForVenomInfect) {
                    TG_Game.IsPlayerDoMoveForVenomInfect = false;
                    let VenomInfect=this.VenomInfect();//执行恶魔传染逻辑
                    if(VenomInfect){
                        App.TimerManager.doTimer(1000,1,this.doCheckMoved,this);
                        return;
                    }
                }

                if (TG_Game.IsPlayerDoMoveForChangeColorBlock) {
                    TG_Game.IsPlayerDoMoveForChangeColorBlock = false;
                    let changeColorBlock=this.changeColorBlock();//执行变色块逻辑
                    if(changeColorBlock){
                        App.TimerManager.doTimer(200,1,this.doCheckMoved,this);
                        return;
                    }
                }

                if (TG_Game.IsPlayerDoMoveForHairBallMove) {
                    TG_Game.IsPlayerDoMoveForHairBallMove = false;
                    let hairBallMove=this.hairBallMove();
                    if(hairBallMove){
                        App.TimerManager.doTimer(350,1,this.updateHairBall,this);
                        return;
                    }
                }
                //重置魔法石的爆炸次数
                for(let item of TG_Game.Items){
                    if(item.IsItemMagicStone()){
                        Log.getInstance().trace("=====================魔法石爆炸次数重置==============================");
                        Log.getInstance().trace(item.SitePos,0);
                        item.ExplodeCount=0;
                    }
                }
                TG_Game.IsPlayerDoMove = false;//是否玩家移动
                TG_Game.IsPlayerDoMoveForHasPea1 = false;//月饼坑
                TG_Game.IsPlayerDoMoveForHasPea2 = false;//月饼坑
                TG_Game.IsPlayerDoMoveForFlowIceLogic = false;//流沙
                TG_Game.IsPlayerDoMoveForVenomInfect = false;//小恶魔
                TG_Game.IsPlayerDoMoveForChangeColorBlock = false;//变色块
                TG_Game.IsPlayerDoMoveForHairBallMove = false;//毛球
                TG_Game.IsPlayerDoMoveForBelts = false;//传送带
            }
            Log.getInstance().trace("暂时没有可消除的方块,等待下次客户端操作...");
            // 检测棋盘滚动
            this.doCheckMove_FinishRound();
            this.refreshStage();
            // 执行黑色毛球爆破
            this.doblackHairBallEx();
        }
    }

    /**
     * 获取传送带移动列表
     *
     */
    public getBeltsMoveLst():Array<any> {
        // console.info("传送带移动...")
        let beltsLst = TG_Stage.Belts;
        // 定义入口数组用于标记是否使用过该数据
        let indexArr = [];
        for (let oneBeltsIndex in beltsLst) {
            // console.info("当前下标为:"+oneBeltsIndex);
            let oneBelts = beltsLst[oneBeltsIndex];
            let bodies = oneBelts["Bodies"];
            let enterId = oneBelts["EnterId"];
            let exitId = oneBelts["ExitId"];
            if (enterId == -1 && exitId == -1) {
                indexArr.push(oneBeltsIndex);
                let oneBodiesLst = [];
                oneBodiesLst.push(bodies);
                // for (let oneBodiesIndex in bodies) {
                //     let oneBodies = bodies[oneBodiesIndex];
                //     oneBodiesLst.push(oneBodies);
                // }
                TG_Game.BeltsIndexLst.push(oneBodiesLst);
                continue;
            }
            if (enterId != -1 && exitId != -1) {// 非闭合形传送带
                if(TsList.contains(indexArr, oneBeltsIndex)) {
                    continue;
                }
                if (!TsList.contains(indexArr,oneBeltsIndex)) {
                    if (enterId == exitId) {
                        indexArr.push(oneBeltsIndex);
                        let oneBodiesLst = [];
                        oneBodiesLst.push(bodies);
                        // for (let oneBodiesIndex in bodies) {
                        //     let oneBodies = bodies[oneBodiesIndex];
                        //     oneBodiesLst.push(oneBodies);
                        // }
                        TG_Game.BeltsIndexLst.push(oneBodiesLst);
                        continue;
                    }
                    if (enterId != exitId) {// 入口id 和 出口id
                        indexArr.push(oneBeltsIndex);
                        let oneBodiesLst = [];
                        oneBodiesLst.push(bodies);
                        // for (let oneBodiesIndex in bodies) {
                        //     let oneBodies = bodies[oneBodiesIndex];
                        //     oneBodiesLst.push(oneBodies);
                        // }
                        oneBodiesLst = this.getOtherExitIdByEnterId(indexArr,enterId,exitId,beltsLst,oneBodiesLst);
                        TG_Game.BeltsIndexLst.push(oneBodiesLst);
                        continue;
                    }
                }
            }
        }
        return TG_Game.BeltsIndexLst;
    }

    /**
     * 传送带移动
     */
    public beltsMove():boolean {
        let beltsIndexLst:Array<any> = this.getBeltsMoveLst();
        // console.info(beltsIndexLst);
        for (let oneLstIndex in beltsIndexLst) {
            let oneLst = beltsIndexLst[oneLstIndex];
            // 是否形成环
            let isCircle = this.getIsCircle(oneLst);
            this.beltsMoveBlockAnimate(oneLst,isCircle);
        }
        return beltsIndexLst.length>0;
    }

    /**
     * 是否能形成环形传送带
     */
    public getIsCircle(oneLst:Array<any>):boolean {
        if (oneLst.length == 1 ) {
            let firstIndex = oneLst[0][0];
            let lastIndex = oneLst[0][oneLst[0].length - 1];
            let belts = TG_Stage.Belts;
            for (let beltsIndex in belts) {
                let oneBelts = belts[beltsIndex];
                let bodies = oneBelts["Bodies"];
                let enterId = oneBelts["EnterId"];
                let exitId = oneBelts["ExitId"];
                let firstBodies = bodies[0];
                let lastBodies = bodies[bodies.length - 1];
                if (firstBodies == firstIndex && lastBodies == lastIndex) {
                    if(enterId == -1 && exitId == -1) {
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
    }
    /**
     * 传送带上物体移动
     * @param oneLst
     */
    public beltsMoveBlockAnimate(oneLst:Array<any>,isCircle:boolean){
        // 传送带上移动地板层(第一层)
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Buttons,GamePanel_ItemSp.getInstance().ButtonsSp,1);
        // 传送带上移动毛毛虫层（第二层）
        // 传送带上移动冰层数据（第三层）
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Ices,GamePanel_ItemSp.getInstance().IcesSp,3);
        // 传送带上移动宝石层(包含毛球) （第四层)
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Items,GamePanel_ItemSp.getInstance().ItemsSp,4);
        // 传送带上移动网格层 铁丝网 （第五层)
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Meshs,GamePanel_ItemSp.getInstance().MeshsSp,5);
        //传送带上移动栏杆层数据 (第六层)
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Railings,GamePanel_ItemSp.getInstance().RailingsSp,6);
        // 传送带上移动云层数据(第八层)
        this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.Clouds,GamePanel_ItemSp.getInstance().CloudsSp,8);
        // 传送带上移动皇冠层(第九层)
        // this.beltsMoveBlockAnimateByGameItem(oneLst,isCircle,TG_Game.PeaLst,GamePanel_ItemSp.getInstance().PeaSp,9);

    }

    // public currVar ;
    /**
     * 各层块动画表现移动
     * @param oneLst
     * @param isCircle
     * @param item
     */
    public beltsMoveBlockAnimateByGameItem(oneLst:Array<any>,isCircle:boolean,item:Array<any>,viewSp:egret.Sprite,layer:number) {
        // console.info("传送带移动方块函数执行");
        // console.info(oneLst);
        // console.info("移动四层块...");
        // let testData = [22, 23, 24, 33, 42, 51, 50, 49, 40, 31];
        if (isCircle) {// 能形成环形
            let circleLst = oneLst[0];
            let tween;
            for (let i =0;i<oneLst[0].length;i++) {
                let curr = oneLst[0][i];
                // this.currVar = curr;
                let currItem:TG_Item = item[curr];
                let currRow = Math.floor(curr/9);
                let currCol = curr % 9;
                let currPos = currItem.getPosByRowCol(currRow,currCol);

                let next = i==oneLst[0].length-1?oneLst[0][0]:oneLst[0][i+1];
                let nextItem:TG_Item = item[next];
                let nextRow = Math.floor(next/9);
                let nextCol = next % 9;
                let nextPos = nextItem.getPosByRowCol(nextRow,nextCol);
                tween = egret.Tween.get(currItem);
                // TG_Game.currentState = 2;
                tween.to({x:nextPos.x ,y: nextPos.y},300)
                tween.call( function(circleLst,i,length) {
                    egret.Tween.removeTweens(currItem);
                    if (i == 0) {
                        this.changeBlockByCircle(oneLst[0],item);
                    }
                },this,[circleLst,i,circleLst.length]);
            }
        } else {// 不能形成环形
            for (let i =0;i<oneLst.length;i++) {
                for (let j =0;j<oneLst[i].length;j++) {
                    // 是每节传送带的第一个元素
                    let isBeltsFirst = false;
                    // 是每节传送带的最后一个元素
                    let isBeltsLast = false;
                    let curr = oneLst[i][j];
                    let currItem:TG_Item = item[curr];
                    let currRow = Math.floor(curr/9);
                    let currCol = curr % 9;
                    let currPos = currItem.getPosByRowCol(currRow,currCol);
                    // 如果当前位置是第一个则需要创建遮罩
                    if (j == 0) {
                        // 是否是第一个元素
                        isBeltsFirst = true;
                    }
                    if (j == oneLst[i].length - 1) {
                        isBeltsLast = true;
                        currItem.createShape(viewSp,currPos.y,currPos.x);
                    }

                    let next;
                    if (i != oneLst.length - 1) {
                        if (j == oneLst[i].length-1) {
                            next = oneLst[i+1][0];
                        } else {
                            next = oneLst[i][j+1];
                        }
                    } else {
                        if (j == oneLst[i].length-1) {
                            next = oneLst[0][0];
                        } else {
                            next = oneLst[i][j+1];
                        }
                    }

                    let nextItem:TG_Item = item[next];
                    let nextRow = Math.floor(next/9);
                    let nextCol = next % 9;
                    let nextPos = nextItem.getPosByRowCol(nextRow,nextCol);

                    let moveToPos;
                    // 每节传送带第一个能用到
                    let fromPos;
                    if (j == oneLst[i].length-1) {
                        moveToPos = this.getMoveToPosByPreAndCurrPos(oneLst[i][j-1],oneLst[i][j],item);
                    } else {
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

                    let tween = egret.Tween.get(currItem);
                    tween.to({x:moveToPos.x ,y: moveToPos.y},300);
                    tween.call( function(oneLst,i,j) {
                        egret.Tween.removeTweens(currItem);
                        if (i == 0 && j == 0) {
                            this.changeBlockByLine(oneLst,item);
                        }
                        if (j == oneLst[i].length - 1) {
                            currItem.removeShape(viewSp);
                        }
                    },this,[oneLst,i,j]);


                }
            }
        }
    }

    /**
     *创建方块
     *
     * @constructor
     */
    public CreateBlocks(layerId:number,venonatId:number,row:number,col:number,item:Array<any>,viewSp:egret.Sprite,layer:number) {
        let EffectType=TG_Blocks.GetEffectByLayerid(layerId);
        let obj;
        if (layer == 1) {
            obj = TG_CreateItem.CreateButton(layerId,row, col);
            viewSp.addChild(obj);
        }
        if (layer == 3) {
            obj = TG_CreateItem.CreateIces(layerId, row, col);
            viewSp.addChild(obj);
        }
        if (layer == 4) {
            obj = TG_CreateItem.CreateItems(layerId, venonatId,row, col, EffectType);
            viewSp.addChild(obj);
        }
        if (layer == 5) {
            obj = TG_CreateItem.CreateMeshs(layerId,row,col);
            viewSp.addChild(obj);
        }
        if (layer == 6) {
            obj = TG_CreateItem.CreateRailings(layerId,row,col);
            viewSp.addChild(obj);
        }
        if (layer == 8) {
            obj = TG_CreateItem.CreateClouds(layerId,row,col);
            viewSp.addChild(obj);
        }
        if (layer == 9) {
            obj = TG_CreateItem.CreatePea(layerId,row,col);
            viewSp.addChild(obj);
        }
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        let index = TG_Game.getInstance().GetIndexByPos( row, col);
        obj.setItemNone(false);
        item[index] = obj;
        TG_Game.getInstance().createList.push(obj);
        let pos = obj.getPosByRowCol(col,  row);
        obj.x = pos.x;
        obj.y = pos.y;
        return obj;
    }

    public changeBlockByLine(list:Array<Array<number>>,item:Array<TG_Item>) {

        let oneLst = [];
        for (let i =0;i<list.length;i++) {
            let twoLst = [];
            for (let j = 0;j<list[i].length;j++) {
                twoLst.push(item[list[i][j]]);
            }
            oneLst.push(twoLst);
        }
        // console.info(oneLst);

        for (let i =0;i<oneLst.length;i++) {
            let currLst = oneLst[i];
            let lastItem = currLst[currLst.length - 1];
            currLst.splice(currLst.length-1,1);
            let nextLst = i == list.length - 1?oneLst[0]:oneLst[i+1];
            nextLst.unshift(lastItem);
            oneLst[i] = currLst;
            if (i == list.length -1) {
                oneLst[0] = nextLst;
            } else {
                oneLst[i+1] = nextLst;
            }
        }

        // console.info(oneLst);
        for (let i =0;i<list.length;i++) {
            for (let j =0;j<list[i].length;j++) {
                let one = list[i][j];
                oneLst[i][j].SitePos.X = one%9;
                oneLst[i][j].SitePos.Y = Math.floor(one/9);
                let pos = oneLst[i][j].getPosByRowCol(oneLst[i][j].SitePos.Y,oneLst[i][j].SitePos.X);
                oneLst[i][j].x = pos.x;
                oneLst[i][j].y = pos.y;
                item[one] = oneLst[i][j];
                this.changItemTxt(item[one],item);
            }
        }
    }
    public changeBlockByCircle(list:Array<number>,item:Array<TG_Item>) {
        let itemLst = [];
        for (let oneIndex in list) {
            let one = list[oneIndex];
            itemLst.push(item[one]);
        }
        let lastItem = itemLst[itemLst.length-1];
        itemLst.splice(itemLst.length-1,1,itemLst);
        itemLst.unshift(lastItem);
        for (let oneIndex in list) {
            let one = list[oneIndex];
            itemLst[oneIndex].SitePos.X = one%9;
            itemLst[oneIndex].SitePos.Y = Math.floor(one/9);
            let pos = itemLst[oneIndex].getPosByRowCol(itemLst[oneIndex].SitePos.Y,itemLst[oneIndex].SitePos.X);
            itemLst[oneIndex].x = pos.x;
            itemLst[oneIndex].y = pos.y;
            item[one] = itemLst[oneIndex];
            this.changItemTxt(item[one],item);
        }
    }

    public getMoveFromPosByCurrPosAndNextPos(currIndex,nextIndex,item:Array<any>):any {
        let nextItem:TG_Item = item[nextIndex];
        let nextRow = Math.floor(nextIndex/9);
        let nextCol = nextIndex % 9;
        let nextPos = nextItem.getPosByRowCol(nextRow,nextCol);

        let currItem:TG_Item = item[currIndex];
        let currRow = Math.floor(currIndex/9);
        let currCol = currIndex % 9;
        let currPos = currItem.getPosByRowCol(currRow,currCol);

        let prePos ={x:0,y:0,row:0,col:0};
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
    }
    public getMoveToPosByPreAndCurrPos(preIndex,currIndex,item:Array<any>):any {
        let preItem:TG_Item = item[preIndex];
        let preRow = Math.floor(preIndex/9);
        let preCol = preIndex % 9;
        let prePos = preItem.getPosByRowCol(preRow,preCol);

        let currItem:TG_Item = item[currIndex];
        let currRow = Math.floor(currIndex/9);
        let currCol = currIndex % 9;
        let currPos = currItem.getPosByRowCol(currRow,currCol);

        let nextPos ={x:0,y:0,row:0,col:0};
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
    }
    /**
     * 通过这个获取传送带链中所有连接在一起的下标
     */
    public getOtherExitIdByEnterId(indexArr,enterId,exitId,beltsLst,oneBodiesLst) {
        for (let oneBeltsIndex in beltsLst) {
            let oneNewBelts = beltsLst[oneBeltsIndex];
            let newBodies = oneNewBelts["Bodies"];
            let newEnterId = oneNewBelts["EnterId"];
            let newExitId = oneNewBelts["ExitId"];
            if (enterId!=-1 && exitId != -1 && enterId == newExitId) {
                if (!TsList.contains(indexArr,oneBeltsIndex)) {// 未找完
                    indexArr.push(oneBeltsIndex);
                    oneBodiesLst.push(newBodies);
                    // for (let oneBodiesIndex in newBodies) {
                    //     let oneNewBodies = newBodies[oneBodiesIndex];
                    //     oneBodiesLst.push(oneNewBodies);
                    // }
                    oneBodiesLst = this.getOtherExitIdByEnterId(indexArr,newEnterId,newExitId,beltsLst,oneBodiesLst);
                    continue;
                } else if (TsList.contains(indexArr,oneBeltsIndex)) {// 找完了
                    break;
                    // return oneBodiesLst;
                }
            }
        }
        // 传送带逻辑错误,返回空数组。数据错误
        return oneBodiesLst;
    }
    /**
     * 处理月饼坑逻辑业务
     */
    private doWithPea() {
        let peaLst = this.checkPea();
        // 移除皇冠
        for (let i=0; i<peaLst.length; i++) {
            let onePea = peaLst[i];
            this.ItemFlyToGoal(onePea);
            this.AddScore(ScoreType.ST_ExplodePea);
            let index=this.GetIndexByPos(onePea.SitePos.Y,onePea.SitePos.X);
            GamePanel_ItemSp.getInstance().clearRect(index,TG_Game.Items);
        }
        // this.doDrop();
        return peaLst.length >0;
    }

    /**
     * 检查月饼坑
     *
     */
    private checkPea() {
        // 获取所有的可以被收集的月饼
        let peaLst = [];
        let items = TG_Game.Items;
        for (let i =0;i < items.length;i++) {
            let oneItems = items[i];
            if (!oneItems.getItemNone() && oneItems.itemType == ItemType.TG_ITEM_TYPE_PEA && this.hasPeaButton(oneItems)) {// 判断是月饼坑 并且可以被收集
                peaLst.push(oneItems);
            }
        }
        return peaLst;
    }

    /**
     * 判断该块下得地板层是否有豌豆坑
     * @param oneItems
     */
    public hasPeaButton(oneItems:TG_Item):boolean {
        let sitPos = oneItems.GetSitPos();
        let itemIndex = this.GetIndexByPos(sitPos.Y,sitPos.X);
        let peaItem = this.GetPeaItemByIndex(itemIndex) as TG_Item;
        if (peaItem.BlockId == 1006) {
            return true;
        } else {
            return false;
        }
    }
    /*异步块爆炸*/
    private doAsyncExplode(){
        let asynsItems=[];
        for(let temp of TG_Game.Items){
            if(temp.IsAsyncExplode){
                asynsItems.push(temp)
            }
        }
        if (asynsItems.length <= 0) return false;
        for(let item of asynsItems){
            item.DoAsyncExplode();
        }
        return true;
    }
    /**
     * 执行黑色毛球爆破
     */
    public doblackHairBallEx(arr:any = null)
    {
        //先执行黑色毛球爆破
        let hairBallLst ;
        if(arr)
            hairBallLst = arr;
        else
            hairBallLst = this.calculationHairBallPos();

        for(let i = 0;i < hairBallLst.length;i++)
        {
            let hairBallPos = hairBallLst[i];
            let item = hairBallPos.item as TG_ItemEffect;
            if(item.venonatId == 7002 && item.GetDetonate2())
            {
                item.DoExplodeHairBall();
            }
            item.SetDetonate2(false);
        }
    }
    public hairBallMove() {
        let isCanHairBallMove=false;
        //先执行黑色毛球爆破
        this.hairBallLst = this.calculationHairBallPos();
        // console.info("=================执行毛球移动逻辑============================");
        if(this.hairBallLst.length >0)
        {
            //有可移动的毛球
            TG_Game.currentHairState = 2;
            isCanHairBallMove=true;
        }
        for(let i = 0;i < this.hairBallLst.length;i++)
        {
            let hairBallPos = this.hairBallLst[i];
            let item = hairBallPos.item;
            let hair = hairBallPos.hairBall;
            if(item.venonatId == 7002 && item.GetDetonate2())
            {
                continue;
            }
            try {
                App.DisplayUtils.removeFromParent(hair);
            }catch(e)
            {
                Log.getInstance().trace("error:"+e);
            }
            hair.x = item.x - hair.width/2 ;
            hair.y = item.y - hair.height/2;
            GamePanel_ItemSp.getInstance().AnimationLayer.addChild(hair);
            let pos = item.getPosByRowCol(hairBallPos.new_y,hairBallPos.new_x);
            let tween = egret.Tween.get(hair);
            tween.to({x:pos.x - hair.width/2,y:pos.y - hair.height/2},300);
            tween.call( function(hair1,item1,hairBallPos1)
            {
                egret.Tween.removeTweens(hair1);
                App.DisplayUtils.removeFromParent(hair1);
            },this,[hair,item,hairBallPos])
        }
        return isCanHairBallMove;
    }
    private hairBallLst;
    public updateHairBall()
    {

        for(let i = 0;i < this.hairBallLst.length;i++) {
            let hairBallPos = this.hairBallLst[i];
            let item = hairBallPos.item;
            if(item.venonatId == 7002 && item.GetDetonate2())
            {
                continue;
            }
            item.SetIsCanAroundDetonate(false);
            let toItem = TG_Game.Items[ hairBallPos.new_y*TG_Game.getInstance().ColNum + hairBallPos.new_x];
            if(item.venonatId == 7001)//白色特殊能被引爆
            {
                toItem.SetIsCanAroundDetonate(true);
            }

            let hair = hairBallPos.hairBall;
            hair.x = 0;
            hair.y = 0;
            let venonatId = item.venonatId
            item.venonatId = 0;//取消毛球
            item.isMove = true;
            toItem.venonatId = venonatId;
            toItem.isMove = false;
            toItem.addHairBall(hair)
        }
        this.doblackHairBallEx(this.hairBallLst);
        TG_Game.currentHairState = 1;
        this.doCheckMoved();
    }

    /**
     * 计算毛球移动后位置坐标，并返回所有移动后的毛球位置坐标
     */
    public calculationHairBallPos() {
        //棋盘中毛球列表
        let hairBallLst:Array<HairBallPos> = [];
        // 取出所有的块
        let items = TG_Game.Items;
        let hairBallPos =null;
        for (let i in items) {
            let oneItem = items[i];
            // 判断是否有毛球
            if (oneItem.IsVenonat()) {// 判断是否是毛球，如果是毛球保存起来备用
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
        for (let oneHairBallIndex in hairBallLst) {
            let  hairBallPos= hairBallLst[oneHairBallIndex];
            let item = this.GetItemByIndex(this.GetIndexByPos(hairBallPos.old_y,hairBallPos.old_x));
            let num = this.canMoveVenonat(item,hairBallPos,hairBallLst);
            hairBallPos.is_update = true;
            if (num == 0) {
                //该毛球不能移动
                hairBallPos.is_move = false;
            }
            if (num == 1) {// 向上移动
                hairBallPos.new_y = hairBallPos.new_y -1;
                hairBallPos.new_x = hairBallPos.new_x;
                hairBallPos.is_move = true;
            }
            if (num == 2) {// 向左移动
                hairBallPos.new_y = hairBallPos.new_y;
                hairBallPos.new_x = hairBallPos.new_x -1;
                hairBallPos.is_move = true;
            }
            if (num == 3) {// 向右移动
                hairBallPos.new_y = hairBallPos.new_y;
                hairBallPos.new_x = hairBallPos.new_x + 1;
                hairBallPos.is_move = true;
            }
            if (num == 4) {// 向下移动
                hairBallPos.new_y = hairBallPos.new_y + 1;
                hairBallPos.new_x = hairBallPos.new_x;
                hairBallPos.is_move = true;
            }
        }
        return hairBallLst;
    }

    /**
     * 根据毛球位置计算新的毛球移动位置
     * @param Y
     * @param X
     */
    public canMoveVenonat(oneItem,hairBallPos,hairBallLst) {
        // 获取毛球的上左右下的位置
        let topItemIndex=this.GetTopItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
        let letItemIndex=this.GetLeftItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
        let rightItemIndex=this.GetRightItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
        let bottomItemIndex=this.GetBottomItem(this.GetIndexByPos(oneItem.SitePos.Y,oneItem.SitePos.X));
        let topItem = this.GetItemByIndex(topItemIndex);
        let letItem = this.GetItemByIndex(letItemIndex);
        let rightItem = this.GetItemByIndex(rightItemIndex);
        let bottomItem = this.GetItemByIndex(bottomItemIndex);
        let moveItemArr = [1,2,3,4];
        while (moveItemArr.length > 0) {
            let index = Math.floor(Math.random() * moveItemArr.length);
            let num = moveItemArr[index];
            if (num == 1) {
                if (this.moveToItem(topItem,topItemIndex,hairBallPos,hairBallLst)) {
                    return num;
                } else {
                    moveItemArr.splice(index,1);
                    continue;
                }
            }
            if (num == 2) {
                if (this.moveToItem(letItem,letItemIndex,hairBallPos,hairBallLst)) {
                    return num;
                } else {
                    moveItemArr.splice(index,1);
                    continue;
                }
            }
            if (num == 3) {
                if (this.moveToItem(rightItem,rightItemIndex,hairBallPos,hairBallLst)) {
                    return num;
                } else {
                    moveItemArr.splice(index,1);
                    continue;
                }
            }
            if (num == 4) {
                if (this.moveToItem(bottomItem,bottomItemIndex,hairBallPos,hairBallLst)) {
                    return num;
                } else {
                    moveItemArr.splice(index,1);
                    continue;
                }
            }
        }
        return 0;
    }

    public moveToItem(oneItem,oneItemIndex,hairBallPos,hairBallLst) {
        if (oneItem && !oneItem.getItemNone() //
            && !oneItem.IsItemNull() //
            && (oneItem.itemType == ItemType.TG_ITEM_TYPE_NORMAL || oneItem.itemType == ItemType.TG_ITEM_TYPE_EFFECT|| oneItem.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) //
            && !this.CheckHasHighItemsNotHairBallItem(oneItemIndex)//
            && this.nohasVenonat(oneItem,hairBallPos,hairBallLst)
        ){
            return true;
        } else {
            return false;
        }
    }

    public CheckHasHighItemsNotHairBallItem(index){
        if(index<0||index>this.ColNum*this.RowNum-1){
            return false;
        }
        //云层块
        let cloud=this.GetCloudItemByIndex(index);
        if(!cloud.getItemNone()){
            return true;
        }
        //铁丝网块
        let mesh=this.GetMeshItemByIndex(index);
        if(!mesh.getItemNone()){
            return true;
        }
        return false;
    }

    /**
     * 要移动到的坐标上如果没有毛球
     * @param oneItemIndex
     * @param hairBallPos
     * @param hairBallLst
     */
    public nohasVenonat(oneItem,hairBallPos,hairBallLst) {
        // 该毛球的原始坐标位置 row col
        let old_y = hairBallPos.old_y;
        let old_x = hairBallPos.old_x;
        let oldIndex = this.GetIndexByPos(old_y,old_x);
        // 要移动到的坐标 oneItem
        let new_y = oneItem.SitePos.Y;
        let new_x = oneItem.SitePos.X;
        let newIndex = this.GetIndexByPos(new_y,new_x);
        if (oldIndex<0 || oldIndex >this.RowNum * this.ColNum -1) {
            return false;
        }
        if (newIndex<0 || newIndex >this.RowNum * this.ColNum -1) {
            return false;
        }
        if (oldIndex == newIndex) {
            return false;
        }
        for (let i in hairBallLst) {
            let oneHairBall = hairBallLst[i];
            if (oneHairBall.is_move) {// 与新对象比较
                if (new_y == oneHairBall.new_y && new_x == oneHairBall.new_x) {
                    return false;
                }
            } else {// 与原对象比较
                if (new_y == oneHairBall.old_y && new_x == oneHairBall.old_x) {
                    return false;
                }
            }
        }
        return true;
    }

    //临时刷新棋盘
    public refreshStage(){
        let isNeedFresh=false;//默认不需要刷新
        for(let temp of TG_Game.Items){
            let posY=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X).y;
            let cY=temp.y;
            if(cY!=posY){
                //需要刷新
                isNeedFresh=true;
                break;
            }
        }
        if(isNeedFresh){
            for(let temp of TG_Game.Items){
                let pos=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X);
                temp.x=pos.x;
                temp.y=pos.y;
            }
        }
    }
    /*战斗中 检测滚动*/
    private doCheckMove_FinishRound(){
        let hasRolling = this.doRollingLogic();
        if (hasRolling){
            App.TimerManager.doTimer(this.rollingTime,1,this.doDrop,this);
        }else {
            //回合完成
            this.DoFinishRound();
        }
    }
    //回合完成
    public DoFinishRound(){
        // 重置掉落次数
        this.combo=0;
        //判断游戏结束
        if (this.doCheckGameFinish()){
            //游戏结束
            this.doFinishGame();
            return;
        }
        if(TG_Stage.SingelModel){//单人模式
            let hasEx=this.doRandomExchangeAllItem();
            if(typeof (hasEx)=="boolean"){
                //启动棋盘提示倒计时
                App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
            }
            this.m_Link=0;
        }else {//Pk模式
            if(!this.isCombo){
                //不是连击才切换回合
                this.doChangePlayer();
            }else {
                if(this.m_Status==GameStatus.GS_BRound){
                    // Ai 可以继续行动
                    App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
                }else if(this.m_Status==GameStatus.GS_ARound){
                   //我自己
                }
                //启动单回合的20s倒计时
                App.MessageCenter.dispatch(Msg.Event.RoundTime);
            }
            this.m_FirstLink=false;
            this.isCombo = false;
        }
    }
    /*是否有产生连击*/
    public doCheckPlayerPkLink(){
        // 对战模式
        if (!TG_Stage.SingelModel){
            // 是否连击
            if ((this.CheckPkLink()))
            {
                this.doPlayerCombo();
            }
        }
    }
    public CheckPkLink(){
        if (!this.m_FirstLink)
        {
            return false;
        }
        if (TG_Stage.LinkNum <= -1)
        {
            return true;
        }
        return this.m_Link < TG_Stage.LinkNum;
    }
    public doPlayerCombo(){
        this.m_Link++;
        this.isCombo = true;
        if(this.m_Status==GameStatus.GS_ARound){
            this.gamePop(PopupType.Pop_MyAction);
        }else {
            this.gamePop(PopupType.Pop_EnemyAction);
        }
    }
    public m_Link=0;//当前连击数 回合结束后重置
    private  m_FirstLink=false;
    private m_FisrtMarkRemove=false;
    public isCombo=false;
    /*切换游戏回合*/
    public doChangePlayer(){
        this.m_Link=0;
        if (this.m_Status == GameStatus.GS_ARound){
            this.m_Status = GameStatus.GS_BRound;
            if(this.BStepNum==0){
                this.m_Status=GameStatus.GS_ARound;
            }
            this.gamePop(PopupType.Pop_EnemyTurn,true);
            //启动Ai提示倒计时
            App.MessageCenter.dispatch(Msg.Event.AIMoveFunction);
        }else if (this.m_Status == GameStatus.GS_BRound) {
            this.m_Status = GameStatus.GS_ARound;
            if(this.AStepNum==0){
                this.m_Status==GameStatus.GS_BRound;
            }
            this.gamePop(PopupType.Pop_MyTurn,true);
        }
        Log.getInstance().trace("切换回合"+this.m_Status);
        //启动单回合的20s倒计时
        App.MessageCenter.dispatch(Msg.Event.RoundTime);
    }
    /*游戏中的浮框提示*/
    public gamePop(type,bool=false){//bool 是否切换回合
        App.TimerManager.remove(this.gamePop1,this);
        App.TimerManager.doTimer(200,1,this.gamePop1,this,[type,bool]);
    }
    private gamePop1(type,bool){
        if(this.doCheckGameFinish()) return;
        Panel_PopupLayer.getInstance().myAlert(type,2000);
        //派发切换小人的显示
        if(bool){
            App.MessageCenter.dispatch(Msg.Event.ChaneRound,type);
        }
    }
    /*滚动逻辑*/
    private rollingTime=0;
    private doRollingLogic(){
        this.rollingTime = 0;
        let singleRowRollTime= TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay);
        //目标滚动
        if (this.doCheckRollTarget()){
            this.rollingTime = singleRowRollTime * (this.realRollRow + 1);
            return true;
        }
        //自动滚动
        if (this.doCheckAutoRollTarget()){
            this.rollingTime = singleRowRollTime * (this.realRollRow + 1);
            return true;
        }
        return false;
    }
    /*目标滚动*/
    private doCheckRollTarget(){
        if (this.doCheckGameFinish()) return false;
        let rollNum = 0;
        if(this.m_Status==GameStatus.GS_ARound){
            // A的滚动目标
            let rollTargets = this.ARollTargets;
            let rollIndex = this.aRollIndex;
            let rollTarget = rollIndex >= rollTargets.length ? null : rollTargets[rollIndex];
            if (rollTarget != null &&this.CheckFinish(rollTarget.Targets))
            {
                this.aRollIndex = this.aRollIndex + 1;
                rollNum += rollTarget.RollNum;
            }
        }else if(this.m_Status==GameStatus.GS_BRound){
            //B的滚动目标
            let  rollTargets = this.BRollTargets;
            let rollIndex = this.bRollIndex;
            let rollTarget = rollIndex >= rollTargets.length ? null : rollTargets[rollIndex];
            if (rollTarget != null && this.CheckFinish(rollTarget.Targets))
            {
                this.bRollIndex =this. bRollIndex + 1;
                rollNum += rollTarget.RollNum;
            }
        }
        if(rollNum > 0){
            this.doRolling(rollNum);
            return true;
        }
        return false;
    }
    /*是否完成目标*/
    public CheckFinish(targets){
        let isFinish=false;
        for(let i in targets){
            let temp=targets[i];
            let Num=temp.Num;
            let Cur=temp.Cur;
            // 无限模式
            if (Num < 0){
                isFinish=false;
                break;
            }
            // 目标为0 扣除模式
            if (Num == 0){
                if(Cur==0){
                    isFinish=true;
                }else {
                    isFinish=false;
                    break;
                }
            }
            // 正常模式
            if(Num>0){
                if(Cur>=Num){
                    isFinish=true;
                }else {
                    isFinish=false;
                    break;
                }
            }
        }
        return isFinish;
    }
    /*自动滚动*/
    private doCheckAutoRollTarget(){
        for(let i=0;i<this.AutoRollTargets.length;i++){
            let autoRollTarget=this.AutoRollTargets[i];
            let serchRow=autoRollTarget.SerchRow;
            if(serchRow>this.RowNum) return false;
            let res=true;
            for(let target of autoRollTarget.Targets){
                for(let index=0;index<serchRow*this.ColNum;index++){
                    let button=TG_Game.Buttons[index];
                    if(button.BlockId==target.Target){
                        res=false;
                        break;
                    }

                    let item=TG_Game.Items[index];
                    if(item.BlockId==target.Target){
                        res=false;
                        break;
                    }

                    let mesh=TG_Game.Meshs[index];
                    if(mesh.BlockId==target.Target){
                        res=false;
                        break;
                    }

                    let ice=TG_Game.Ices[index];
                    if(ice.BlockId==target.Target){
                        res=false;
                        break;
                    }

                    let cloud=TG_Game.Clouds[index];
                    if(cloud.BlockId==target.Target){
                        res=false;
                        break;
                    }
                }
                if(!res) break;
            }
            if(res){
                return this.doRolling(autoRollTarget.RollNum);
            }
        }
        return false;
    }
    /*滚动*/
    private realRollRow=0;
    public curRollRow=0;
    public rollLeaveDrops=[];//滚动遗留掉落
    public cRollClearItems=[];
    public doRolling(row){
        Log.getInstance().trace("战斗中开始滚动:"+row+"行");
        //判断如果剩余行数不够滚动要求
        this.realRollRow=Math.min((TG_Stage.Blocks.length/this.ColNum)-this.curRollRow,row);
        this.realRollRow=Math.min(this.realRollRow,9);
        if(this.realRollRow==0){
            return false;
        }
        this.cRollClearItems=[];
        //移除
        for(let i =0;i<this.realRollRow*this.ColNum;i++){
            let button=TG_Game.Buttons[0];
            TG_Game.Buttons.splice(0,1);
            this.cRollClearItems.push(button);

            let item=TG_Game.Items[0];
            //添加滚动遗留掉落
            if(item!=null&&!item.getItemNone()&&(item.IsNormal()|| item.IsItemDisColor())){
                this.rollLeaveDrops[item.SitePos.X].push(item.BlockId);
            }
            TG_Game.Items.splice(0,1);
            this.cRollClearItems.push(item);


            let ice=TG_Game.Ices[0];
            TG_Game.Ices.splice(0,1);
            this.cRollClearItems.push(ice);


            let mesh=TG_Game.Meshs[0];
            TG_Game.Meshs.splice(0,1);
            this.cRollClearItems.push(mesh);


            let cloud=TG_Game.Clouds[0];
            TG_Game.Clouds.splice(0,1);
            this.cRollClearItems.push(cloud);

            let railing=TG_Game.Railings[0];
            TG_Game.Railings.splice(0,1);
            this.cRollClearItems.push(railing);
        }
        let singleRowRollTime= TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay);
        App.TimerManager.doTimer(singleRowRollTime*this.realRollRow,1,this.cRollClearItemsEvent,this);
        //创建
        for(let i=0;i<this.realRollRow*this.ColNum;i++){
            let index=i+this.curRollRow*this.ColNum;
            let block=TG_Stage.Blocks[index];
            let baseY=this.curRollRow-9;
            let row = 0, col = 0;
            row = Math.floor(Number(index) / 9)-baseY;
            col = Number(index) % 9;
            let Id1 = block["Id1"];
            let Id2 = block["Id2"];
            let Id3 = block["Id3"];
            let Id4 = block["Id4"];
            let Id5 = block["Id5"];
            let Id6 = block["Id6"];
            let Id7 = block["Id7"];
            // 创建地板层(第一层)
            GamePanel_ItemSp.getInstance().CreateButton(Id1,row,col,index,true);
            // 创建毛毛虫层（第二层）
            //  GamePanel_ItemSp.getInstance().CreateCaterpillars(Id2,row,col,true);
            // 创建冰层数据（第三层）
            GamePanel_ItemSp.getInstance().CreateIces(Id3,row,col,true);
            // 创建宝石层(包含毛球) （第四层)
            GamePanel_ItemSp.getInstance().CreateItems(Id2,Id7,row,col,true);
            // 创建网格层 铁丝网 （第五层)
            GamePanel_ItemSp.getInstance().CreateMeshs(Id4,row,col,true);
            // 创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第六层)
            //  GamePanel_ItemSp.getInstance().CreateHairBall(Id2,Id7,row,col,true);
            // 创建栏杆层数据 (第六层)
            GamePanel_ItemSp.getInstance().CreateRailings(Id6,row,col,true);
            // 第七层 毛球层随方块一起创建
            //  GamePanel_ItemSp.getInstance().CreateHairBall(items,Id7,row,col,true);
            // 创建云层数据(第八层)
            GamePanel_ItemSp.getInstance().CreateClouds(Id5,row,col,true);
        }
        for(let j=0;j<this.RowNum;j++){
            //行
            for(let i=0;i<this.ColNum;i++){
                //列
                let index=this.GetIndexByPos(j,i);
                let button=TG_Game.Buttons[index];
                button.SetSitPos(i,j);

                let item=TG_Game.Items[index];
                item.SetSitPos(i,j);

                let ice = TG_Game.Ices[index];
                ice.SetSitPos(i ,j);
                let mesh = TG_Game.Meshs[index];
                mesh.SetSitPos(i,j);
                let cloud = TG_Game.Clouds[index];
                cloud.SetSitPos(i,j);
                let railing = TG_Game.Railings[index];
                railing.SetSitPos(i, j);
            }
        }
        Log.getInstance().trace("棋盘真实滚动行数:___"+this.realRollRow);
        App.MessageCenter.dispatch(Msg.Event.BrowseRollUp,this.realRollRow);
        this.curRollRow = this.curRollRow + this.realRollRow;
        // 处置出生点坐标
        this.initBirthPos();
        return true;
    }
    /*移除本次滚动消失的元素块*/
    public cRollClearItemsEvent(){
        for(let temp of this.cRollClearItems){
            App.DisplayUtils.removeFromParent(temp);
            TG_Object.Release(temp);
        }
        this.cRollClearItems=[];
    }
    //判断游戏是否结束
    private doCheckGameFinish(){
        if(this.DoCheckGameStatus() >= GameStatus.GS_AVictory){
            TG_Game.SetGameState(false);
            return true;
        }else {
            TG_Game.SetGameState(true);
        }
        return false;
    }
    /*判断游戏状态*/
    public DoCheckGameStatus(){
        if (this.m_Status == GameStatus.GS_AVictory || this.m_Status == GameStatus.GS_BVictory){
            return this.m_Status;
        }
        //单人模式
        if(TG_Stage.SingelModel){
            //任务目标
            if(this.CheckFinish(this.ATaskTargets)){
                return GameStatus.GS_AVictory;
            }
            //失败条件1
            if(this.IsElementLimit1&&this.CheckFinish(this.ADefeatTaskTargets1)){
                //单人收集模式永远获胜
                return this.RuleType==0?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
            }
            //失败条件2
            if(this.IsElementLimit2&&this.CheckFinish(this.ADefeatTaskTargets2)){
                //单人收集模式永远获胜
                return this.RuleType==0?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
            }
            //条件限制 限制回合
            if(TG_Stage.IsConditionLimit&&TG_Stage.IsStepLimit&&this.AStepNum==0||this.cantRandomAllItem||this.infiniteDrop||this.advanceEnd){
                //没有步数 无法打乱棋盘 无限掉落 收集模式无收集目标
                return this.RuleType==0?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
            }
            //条件限制 限制时间
            if(TG_Stage.IsConditionLimit&&TG_Stage.IsTimeLimit&&this.SurplusTime<=0){
                //收集模式
                if(TG_Stage.RuleType==1){
                    return GameStatus.GS_AVictory;
                }
                //消除模式
                else {
                    if(this.CheckFinish(this.ATaskTargets)){
                        return GameStatus.GS_AVictory;
                    }else{
                        return GameStatus.GS_BVictory;
                    }
                }
            }
        }
        //双人pk模式
        else {
            //A和B都完成 进行中
            if(this.CheckFinish(this.ATaskTargets)&&this.CheckFinish(this.BTaskTargets)){
                //得分高获胜
                if(TG_Stage.StageVictoryType==VictoryType.VT_ScoreOnTime){
                    if(this.AScore==this.BScore){
                        return this.isAFirst?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
                    }
                    return this.AScore>this.BScore?GameStatus.GS_AVictory:GameStatus.GS_BVictory;
                }
                //完成目标多获胜
                else {
                    //目标数量
                    let completeATarget=this.APlayerCompleteTaskNum();
                    let completeBTarget=this.BPlayerCompleteTaskNum();
                    if(completeATarget==completeBTarget){
                        return this.isAFirst?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
                    }
                    return completeATarget>completeBTarget?GameStatus.GS_AVictory:GameStatus.GS_BVictory;
                }
            }
            if(this.CheckFinish(this.ATaskTargets)){
                return GameStatus.GS_AVictory;
            }
            if(this.CheckFinish(this.BTaskTargets)){
                return GameStatus.GS_BVictory;
            }
            //失败条件1
            if(TG_Stage.IsElementLimit1){
                if(this.CheckFinish(this.ADefeatTaskTargets1)){
                    return GameStatus.GS_BVictory;
                }
                if(this.CheckFinish(this.BDefeatTaskTargets1)){
                    return GameStatus.GS_AVictory;
                }
            }
            //失败条件2
            if(TG_Stage.IsElementLimit2){
                if(this.CheckFinish(this.ADefeatTaskTargets2)){
                    return GameStatus.GS_BVictory;
                }
                if(this.CheckFinish(this.BDefeatTaskTargets2)){
                    return GameStatus.GS_AVictory;
                }
            }
            //条件限制 限制回合
            if((TG_Stage.IsConditionLimit&&TG_Stage.IsStepLimit&&this.AStepNum==0&&this.BStepNum==0)
            ||this.cantRandomAllItem||this.infiniteDrop||this.advanceEnd){
                //得分高获胜
                if(TG_Stage.StageVictoryType==VictoryType.VT_ScoreOnTime){
                    if(this.AScore==this.BScore){
                        return this.isAFirst?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
                    }
                    return this.AScore>this.BScore?GameStatus.GS_AVictory:GameStatus.GS_BVictory;
                }
                //完成目标多获胜
                else {
                    let completeATarget=this.APlayerCompleteTaskNum();
                    let completeBTarget=this.BPlayerCompleteTaskNum();
                    if(completeATarget==completeBTarget){
                        return this.isAFirst?GameStatus.GS_BVictory:GameStatus.GS_AVictory;
                    }
                    return completeATarget>completeBTarget?GameStatus.GS_AVictory:GameStatus.GS_BVictory;
                }
            }
        }
        //收集模式 没有收集目标了
        if(TG_Stage.RuleType==1&&!this.CheckHasCollectTarget()){
            this.advanceEnd=true;
            return this.DoCheckGameStatus();
        }
        return this.m_Status;
    }
    /*减少步数*/
    public ReduceStep(num=1){
        if(this.m_Link>0){
            return;
        }
        if(!TG_Stage.IsTimeLimit){
            let stepNum=0;
            //A
            if(this.m_Status==GameStatus.GS_ARound){
                if(TG_Stage.IsConditionLimit&&TG_Stage.IsStepLimit&&this.AStepNum>0){
                    this.AStepNum=Math.max(0,this.AStepNum-1);
                    stepNum=this.AStepNum;
                }
                this.AUsedStepNum++;
            }
            //B
            if(this.m_Status==GameStatus.GS_BRound){
                if(TG_Stage.IsConditionLimit&&TG_Stage.IsStepLimit&&this.BStepNum>0){
                    this.BStepNum=Math.max(0,this.BStepNum-1);
                    stepNum=this.BStepNum;
                }
                this.BUsedStepNum++;
            }
            //页面刷新步数
            App.MessageCenter.dispatch(Msg.Event.refreshStepShow,this.m_Status,stepNum);
        }
        //使用道具次数
        this.usedToolTimes=0;
        if(TG_Stage.SingelModel){//单人模式
            //能够交换，移除之前棋盘提示的倒计时
            App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
            TG_HintFunction.getInstance().removeItemMove();
        }
        if(!TG_Stage.SingelModel){//pk模式
            //停止切换回合倒计时
            App.MessageCenter.dispatch(Msg.Event.StopRoundTime);
        }
    }
    /*增加步数*/
    public AddingStep(num){
        let stepNum=0;
        if(this.m_Status==GameStatus.GS_ARound){
            this.AStepNum+=num;
            stepNum=this.AStepNum;
        }
        if(this.m_Status==GameStatus.GS_BRound){
            this.BStepNum+=num;
            stepNum=this.BStepNum;
        }
        //刷新页面步数
        App.MessageCenter.dispatch(Msg.Event.refreshStepShow,this.m_Status,stepNum);
    }
    /*开始时间模式的时间倒计时*/
    public doGameCutTime(){
        App.TimerManager.remove(this.ReduceTime, this);
        App.TimerManager.doTimer(1000, 0, this.ReduceTime, this);
    }
    /*增加时间*/
    public AddingTime(num){
        this.SurplusTime+=num;
        //刷新时间显示
        App.MessageCenter.dispatch(Msg.Event.refreshTimeShow,this.SurplusTime);
    }
    /*减少时间*/
    public ReduceTime(num=1){
        this.SurplusTime=Math.max(0,this.SurplusTime-1);
        //刷新时间显示
        App.MessageCenter.dispatch(Msg.Event.refreshTimeShow,this.SurplusTime);
        if(this.SurplusTime<=0){
            App.TimerManager.remove(this.ReduceTime, this);
            //游戏结束
            this.doFinishGame();
        }
    }
    /*获取剩余游戏时间*/
    public GetSurplusTime(){
        return this.SurplusTime;
    }
    /*获取游戏所用时间*/
    public GetGameUsedTime(){
        return Math.max(this.TimeLimitLength -this.SurplusTime, 0);
    }
    /*获取A玩家完成的任务目标数量*/
    public APlayerCompleteTaskNum(){
        let completeNum=0;
        for(let temp of this.ATaskTargets){
            completeNum+=temp.Cur;
        }
        return completeNum;
    }
    /*获取B玩家完成的任务目标数量*/
    public BPlayerCompleteTaskNum(){
        let completeNum=0;
        for(let temp of this.BTaskTargets){
            completeNum+=temp.Cur;
        }
        return completeNum;
    }
    /*检测对局内是否还包含收集目标*/
    public CheckHasCollectTarget(){
        if(TG_Stage.RuleType!=1){
            return true;
        }
        if(this.CheckHasNotAdvanceEndBlock()){
            return true;
        }
        for(let i=0;i<this.ATaskTargets.length;i++){
            let target =this.ATaskTargets[i];
            let targetId=target.Target;
            let fatherElements=TG_Entry.GetEntryFatherElements(targetId);
            for(let blockId of fatherElements){
                let id=Number(blockId);
                if(this.CheckHasBlockIdInDrop(id)){
                    return true;
                }
                if(this.CheckHasBlockIdInGame(id)){
                    return true;
                }
                if(this.CheckHasBlockIdInRoll(id)){
                    return true;
                }
            }
        }
        for(let i=0;i<this.BTaskTargets.length;i++){
            let target=this.BTaskTargets[i];
            let targetId=target.Target;
            let fatherElements=TG_Entry.GetEntryFatherElements(targetId);
            for(let blockId of fatherElements){
                let id=Number(blockId);
                if(this.CheckHasBlockIdInDrop(id)){
                    return true;
                }
                if(this.CheckHasBlockIdInGame(id)){
                    return true;
                }
                if(this.CheckHasBlockIdInRoll(id)){
                    return true;
                }
            }
        }
        return false;
    }
    /*检测掉落中是否存在*/
    public CheckHasBlockIdInDrop(blockId){
        for(let i=0;i<this.ColNum;i++){
            //滚动遗留中是否存在
            let rollLeaveDrops=this.rollLeaveDrops[i];
            for(let j=0;j<rollLeaveDrops.length;j++){
                if(rollLeaveDrops[j]==blockId){
                    return true;
                }
            }
            //预设掉落中是否存在
            let DropBlocks=TG_Stage.DropBlocks[i];
            for(let k=0;k<DropBlocks.DropIds.length;k++){
                if(DropBlocks.DropIds[k]==blockId){
                    return true;
                }
            }
        }
        return false;
    }
    /*检测棋盘中是否存在*/
    public CheckHasBlockIdInGame(blockId){
        for(let i=0;i<TG_Game.Items.length;i++){
            if(TG_Game.Items[i].GetBlockId()==blockId){
                return true;
            }
        }
        for(let i=0;i<TG_Game.Ices.length;i++){
            if(TG_Game.Ices[i].GetBlockId()==blockId){
                return true;
            }
        }
        for(let i=0;i<TG_Game.Clouds.length;i++){
            if(TG_Game.Clouds[i].GetBlockId()==blockId){
                return true;
            }
        }
        for(let i=0;i<TG_Game.Meshs.length;i++){
            if(TG_Game.Meshs[i].GetBlockId()==blockId){
                return true;
            }
        }
        for(let i=0;i<TG_Game.Railings.length;i++){
            if(TG_Game.Railings[i].GetBlockId()==blockId){
                return true;
            }
        }
        return false;
    }
    /*检测滚动棋盘中是否存在*/
    public CheckHasBlockIdInRoll(blockId){
        for(let i=this.curRollRow*this.ColNum;i<TG_Stage.Blocks.length;i++){
            let block=TG_Stage.Blocks[i];
            let Id1 = block["Id1"];
            let Id2 = block["Id2"];
            let Id3 = block["Id3"];
            let Id4 = block["Id4"];
            let Id5 = block["Id5"];
            let Id6 = block["Id6"];
            let Id7 = block["Id7"];
            if(Id1==blockId){
                return true;
            }
            if(Id2==blockId){
                return true;
            }
            if(Id3==blockId){
                return true;
            }
            if(Id4==blockId){
                return true;
            }
            if(Id5==blockId){
                return true;
            }
            if(Id6==blockId){
                return true;
            }
            if(Id7==blockId){
                return true;
            }
        }
        return false;
    }
    /*是否存在不提前结束的块*/
    public CheckHasNotAdvanceEndBlock(){
        for(let i=0;i<this.ATaskTargets.length;i++){
            let target=this.ATaskTargets[i];
            let targetId=target.Target;
            let isAdvanceEnd=TG_Entry.GetEntryIsAdvanceEnd(targetId);
            if(isAdvanceEnd!=null&&isAdvanceEnd==0){
                return true;
            }
        }
        for(let i=0;i<this.BTaskTargets.length;i++){
            let target=this.BTaskTargets[i];
            let targetId=target.Target;
            let isAdvanceEnd=TG_Entry.GetEntryIsAdvanceEnd(targetId);
            if(isAdvanceEnd!=null&&isAdvanceEnd==0){
                return true;
            }
        }
        return false;
    }

    /*增加分数*/
    public AddScore(score){
        let radio=Math.min(10,this.m_Link);
        let value=score+(score/10*radio);
        let scoreNum=0;
        if (this.m_Status == GameStatus.GS_ARound){
            this.AScore += value;
            scoreNum=this.AScore;
        }
        if (this.m_Status == GameStatus.GS_BRound){
            this.BScore += value;
            scoreNum=this.BScore;
        }
        //页面刷新分数
        App.MessageCenter.dispatch(Msg.Event.refreshScoreShow,this.m_Status,scoreNum)
    }
    /*游戏结束*/
    public showGameOverTimeout;
    public doFinishGame(){
        this.m_Status = this.DoCheckGameStatus();
        this.doEndingTime();
        //如果是时间模式，计时器停表
        if(TG_Stage.IsTimeLimit){
            App.TimerManager.remove(this.ReduceTime, this);
        }
        //如果棋盘正在滚动,停止滚动
        GamePanel.getInstance().removeRectSpRoll();
        App.TimerManager.remove(this.doDrop,this);
        //A胜利
        if(this.m_Status==GameStatus.GS_AVictory){
            let isWeixinBrowser = App.DeviceUtils.IsWeixinBrowser;
            let env = ConfigConst.env;
            if ((isWeixinBrowser && (env =='pro' || env == 'pre'))) {
                // 排行榜需要提交的数据
                let postData=this.getRankPostData();
                postData.type = 1;
                App.MessageCenter.addListener("init_postRankData",this.initPostRankDataBackHandler,this);
                App.Http.initServer(ConfigConst.initPostRankData,"1");
                let postDataStr:string = JSON.stringify(postData);
                App.Http.send("init_postRankData",new URLVariables("jsonData="+postDataStr));
                return;
            } else {
                if(this.showGameOverTimeout){
                    clearTimeout(this.showGameOverTimeout);
                }
                this.showGameOverTimeout=setTimeout(function () {
                    clearTimeout(this.showGameOverTimeout);
                    this.showGameOverView(true);
                }.bind(this),1000);
                return;
            }
        }
        //B胜利
        if(this.m_Status==GameStatus.GS_BVictory){
            if(this.showGameOverTimeout){
                clearTimeout(this.showGameOverTimeout);
            }
            this.showGameOverTimeout=setTimeout(function () {
                clearTimeout(this.showGameOverTimeout);
                this.showGameOverView(false)
            }.bind(this),1000);
            return;
        }
        Log.getInstance().trace("游戏结束: 结果异常");
    }

    public initPostRankDataBackHandler(data) {
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
        if(this.showGameOverTimeout){
            clearTimeout(this.showGameOverTimeout);
        }
        this.showGameOverTimeout=setTimeout(function () {
            clearTimeout(this.showGameOverTimeout);
            this.showGameOverView(true);
        }.bind(this),1000);
        return;
    }

    /*展示结束页面*/
    public showGameOverView(isVictory=true){
        if(isVictory){
            Panel_PopupLayer.getInstance().myAlert("任务完成,游戏结束！", 1200);
            GamePanel.getInstance().showGameOver(1);

        }else {
            Panel_PopupLayer.getInstance().myAlert("任务失败,游戏结束！", 1200);
            GamePanel.getInstance().showGameOver(0);
        }
    }
    /*获取排行榜需要提交数据*/
    public getRankPostData(){
        let rankData=new RankData();
        // 排行榜id
        rankData.stage_id = TG_Stage.StageId;
        rankData.stage_type = TG_Stage.RuleType;//排行榜关卡类型 0 消除 1收集
        rankData.condition_limit = 0;// -1 不限制 0 步数 1 时间
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
        rankData.player_id = WxUser.getInstance().wxUserId;//玩家id
        //使用步数
        rankData.used_step_num=this.AUsedStepNum;
       //使用时间
        rankData.used_time=this.GetGameUsedTime();
        //消除的方块
        rankData.remove_block_num=this.APlayerCompleteTaskNum();
        //分数
        rankData.score_num=this.AScore;
        return rankData;
    }
    /*游戏结算*/
    public doEndingTime(){
        //故事模式 并且 条件限制
        if(TG_Stage.StoryType!=1&&TG_Stage.IsConditionLimit){
            if(this.m_Status==GameStatus.GS_AVictory) {
                let surplusStep=TG_Stage.IsTimeLimit?Math.ceil(this.SurplusTime/5):this.AStepNum;
                if(surplusStep>0){
                    this.AScore+=surplusStep*ScoreType.ST_STEPSCORE;
                }
            }
            if(this.m_Status==GameStatus.GS_BVictory){
                let surplusStep=TG_Stage.IsTimeLimit?Math.ceil(this.SurplusTime/5):this.BStepNum;
                if(surplusStep>0){
                    this.BScore+=surplusStep*ScoreType.ST_STEPSCORE;
                }
            }
        }
        //故事模式 并且 失败任务1 剩余转换为分数
        if(TG_Stage.StoryType!=1&&TG_Stage.IsElementLimit1){
            if(this.m_Status==GameStatus.GS_AVictory){
                for(let target of this.ADefeatTaskTargets1){
                    if(target.Cur>0){
                        this.AScore+=this.getDeafaultTargetScore(target.Target)*target.Cur;
                    }
                }
            }
            if(this.m_Status==GameStatus.GS_BVictory){
                for(let target of this.BDefeatTaskTargets1){
                    if(target.Cur>0){
                        this.BScore+=this.getDeafaultTargetScore(target.Target)*target.Cur;
                    }
                }
            }
        }
        //故事模式 并且 失败任务2 剩余转换为分数
        if(TG_Stage.StoryType!=1&&TG_Stage.IsElementLimit2){
            if(this.m_Status==GameStatus.GS_AVictory){
                for(let target of this.ADefeatTaskTargets2){
                    if(target.Cur>0){
                        this.AScore+=this.getDeafaultTargetScore(target.Target)*target.Cur;
                    }
                }
            }
            if(this.m_Status==GameStatus.GS_BVictory){
                for(let target of this.BDefeatTaskTargets2){
                    if(target.Cur>0){
                        this.BScore+=this.getDeafaultTargetScore(target.Target)*target.Cur;
                    }
                }
            }
        }
        //页面刷新分数
        let scoreNum=0;
        if(this.m_Status==GameStatus.GS_AVictory){
            scoreNum=this.AScore;
        }else if(this.m_Status==GameStatus.GS_BVictory){
            scoreNum=this.BScore;
        }
        App.MessageCenter.dispatch(Msg.Event.refreshScoreShow,this.m_Status,scoreNum);
    }
    /*获取失败任务任务目标的得分*/
    public getDeafaultTargetScore(blockId){
        let entry=TG_Entry.GetEntryObj(blockId);
        switch (TG_Stage.SetColorNumElement.length){
            case 6:
                return entry.isLimitRewardSix;
            case 5:
                return entry.isLimitRewardFive;
            case 4:
                return entry.isLimitRewardFour;
        }
        return 0;
    }

    /*检查元素是否可以打标签*/
    public CheckAddMark(item){
        if(item==null){
            return false;
        }
        if(item.getItemNone()){
            return false;
        }
        if (item.MarkedAlready)
        {
            return false;
        }
        // 有毛球 update by sbb
        if (item.venonatId != 0) {
            return false;
        }
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        if (index < 0 || index > this.ColNum*this.RowNum-1)
        {
            return false;
        }
        let cloud = this.GetCloudItemByIndex(index);
        if (cloud.IsCloud()&&!cloud.getItemNone())
        {
            return false;
        }
        return true;
    }
    /*添加相邻关系---（打标签，每个方块相邻有相同方块个数）*/
    public DoAddMark(){
        let mNumberMark = 2;
        let blnHasMark = false;//是否可以有消除
        let tempList = [];
        let color=0;
        /*行 列*/
        for(let i=0;i<this.RowNum;i++){
            color=0;
            if(tempList.length>=mNumberMark){
                for(let temp of tempList){
                    if(!temp.getItemNone()){
                        temp.SetMarkedHor(tempList.length);
                    }else {
                        temp.SetMarkedHor(0);
                    }
                    blnHasMark = true;
                }
            }
            for(let j=0;j<this.ColNum;j++){
                let item =this.GetItemByPos(i,j);
                // console.info(i+":"+j);
                // console.info(item);
                // console.info(item.Color);
                if(color>0 && color==item.Color&&this.CheckAddMark(item)){
                    if(!item.getItemNone()){
                        tempList.push(item);
                    }
                }else {
                    color =this.CheckAddMark(item) ? item.Color : 0;
                    if(tempList.length>=mNumberMark){
                        for(let temp of tempList){
                            if(!temp.getItemNone()){
                                temp.SetMarkedHor(tempList.length);
                            }else {
                                temp.SetMarkedHor(0);
                            }
                            blnHasMark = true;
                        }
                    }
                    tempList=[];
                    if(!item.getItemNone()){
                        tempList.push(item);
                    }
                }
            }
        }
        if(tempList.length>=mNumberMark){
            for(let temp of tempList){
                if(!temp.getItemNone()){
                    temp.SetMarkedHor(tempList.length);
                }else {
                    temp.SetMarkedHor(0);
                }
                blnHasMark = true;
            }
        }
        tempList=[];
        /*列 行*/
        for(let i=0;i<this.ColNum;i++){
            color=0;
            if(tempList.length>=mNumberMark){
                for(let temp of tempList){
                    if(!temp.getItemNone()){
                        temp.SetMarkedVel(tempList.length);
                    }else {
                        temp.SetMarkedVel(0);
                    }
                    blnHasMark = true;
                }
            }
            for(let j=0;j<this.RowNum;j++){
                let item =  this.GetItemByPos(j,i);
                if(color>0&&color==item.Color&&this.CheckAddMark(item)){
                    if(!item.getItemNone()){
                        tempList.push(item);
                    }
                }else {
                    color =this.CheckAddMark(item) ? item.Color : 0;
                    if(tempList.length>=mNumberMark){
                        for(let temp of tempList){
                            if(!temp.getItemNone()){
                                temp.SetMarkedVel(tempList.length);
                            }else {
                                temp.SetMarkedVel(0);
                            }
                            blnHasMark = true;
                        }
                    }
                    tempList=[];
                    if(!item.getItemNone()){
                        tempList.push(item);
                    }
                }
            }
        }
        if(tempList.length>=mNumberMark){
            for(let temp of tempList){
                if(!temp.getItemNone()){
                    temp.SetMarkedVel(tempList.length);
                }else {
                    temp.SetMarkedVel(0);
                }
                blnHasMark = true;
            }
        }
        if(blnHasMark){
            this.changeAllText();
        }
        return blnHasMark;
    }
    /*根据 行Y 列X 获取方块*/
    public GetItemByPos(Y, X){
        for (let temp of TG_Game.Items) {
            if (temp.SitePos.Y == Y && temp.SitePos.X == X) {
                return temp;
            }
        }
    }
    /*
     * 根据两索引，计算移动方向
     * <returns>1-2-3-4 ： 上-下-左-右</returns>
     * */
    public getDirection(first,second){
        if (first - second  == 9){
            return 1;
        }
        if (first - second == -9){
            return 2;
        }
        if (first - second == 1){
            return 3;
        }
        if (first - second == -1){
            return 4;
        }
        return 0;
    }
    /*根据 行 列 获取index*/
    public GetIndexByPos(Y, X) {
        return Y * this.ColNum + X;
    }
    /*根据 index 获取方块*/
    public GetItemByIndex(index,itemArr:Array<any> =  TG_Game.Items) {
        if(index >= itemArr.length || index < 0)
            return null;

        return itemArr[index];
    }
    /*改变方块的index by Pos*/
    public changeItemIndexByPos(row1, col1, row2, col2,itemArr:Array<any> =  TG_Game.Items) {
        let aIndex = this.GetIndexByPos(row1, col1);
        let bIndex = this.GetIndexByPos(row2, col2);
        let aItem = this.GetItemByIndex(aIndex,itemArr);
        let bItem = this.GetItemByIndex(bIndex,itemArr);
        let temp = aItem;
        itemArr[aIndex] = bItem;
        itemArr[bIndex] = temp;
    }
    /*改变方块的index by index*/
    public changeItemIndexByIndex(aIndex, bIndex,itemArr:Array<any> =  TG_Game.Items) {
        let aItem = itemArr[aIndex];
        let bItem = itemArr[bIndex];
        let temp = aItem;
        itemArr[aIndex] = bItem;
        itemArr[bIndex] = temp;
    }
    /*改变方块的Pos*/
    public changeItemPosByIndex(aIndex, bIndex,itemArr:Array<any> =  TG_Game.Items) {
        let aItem = itemArr[aIndex];
        let bItem = itemArr[bIndex];
        let temp = aItem.SitePos;
        aItem.SitePos = bItem.SitePos;
        bItem.SitePos = temp;
        this.changItemTxt(aItem,itemArr);
        this.changItemTxt(bItem,itemArr);
    }
    /*获取栏杆元素*/
    public GetRailingItemByIndex(index){
        let temp=TG_Game.Railings[index];
        return temp;
    }
    /* 获取豌豆坑元素 */
    public GetPeaItemByIndex(index) {
        let temp = TG_Game.PeaLst[index];
        return temp;
    }
    /*获取底块元素*/
    public GetButtonItemByIndex(index){
        let temp=TG_Game.Buttons[index];
        return temp;
    }
    /*获取毛球所在元素块对象*/
    public GetHairBallItemByIndex(index){
        let temp=TG_Game.Items[index];
        return temp;
    }
    /*获取铁丝网元素*/
    public GetMeshItemByIndex(index){
        let temp=TG_Game.Meshs[index];
        return temp;
    }
    /*获取云层元素*/
    public GetCloudItemByIndex(index){
        let temp=TG_Game.Clouds[index];
        return temp;
    }
    /**
     * 检索3层item消失逻辑 如冰层、流沙等等
     * @param index
     * @returns {null}
     * @constructor
     */
    public CheckIcesItem(item:TG_Item){
        if(item.isIces && item.isFlowIces)//冰块
        {
            return null;
        }
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let temp=null;
        if(TG_Game.Ices[index].BlockId){
            temp=TG_Game.Ices[index];
        }

        return temp;

    }
    /**
     *  判断云层块
     * @param item
     * @returns {null}
     * @constructor
     */
    public CheckCloudItem(item:TG_Item){
        if(item==null){
            return;
        }
        if(item.getItemNone()){
            return;
        }
        if(item.IsCloud() )//云层 8层
        {
            return null;
        }
        let index=this.GetIndexByPos(item.SitePos.Y,item.SitePos.X);
        let temp=null;
        if(!TG_Game.Clouds[index].getItemNone()){
            temp=TG_Game.Clouds[index];
        }

        return temp;

    }

    /*检查横向的链接*/
    private getRowChain(item,outs){
        if(item==null){
            return;
        }
        if(item.getItemNone()){
            return;
        }
        if(item.GetColorType()<0){
            return;
        }
        outs.push(item);
        let siteCol = item.SitePos.X+1;
        let siteRow = item.SitePos.Y;
        while(siteCol<this.ColNum){
            let neighbor= this.GetItemByPos(siteRow,siteCol);
            if(neighbor==null){
                break;
            }
            if(neighbor.getItemNone()){
                break;
            }
            if(this.CheckAddMark(neighbor)){
                if(item.GetColorType()==neighbor.GetColorType()){
                    outs.push(neighbor);
                    siteCol++
                }else {
                    break;
                }
            }else {
                break;
            }
        }
        siteCol=item.SitePos.X-1;
        while(siteCol>=0){
            let neighbor= this.GetItemByPos(siteRow,siteCol);
            if(neighbor==null){
                break;
            }
            if(neighbor.getItemNone()){
                break;
            }
            if(this.CheckAddMark(neighbor)){
                if(item.GetColorType()==neighbor.GetColorType()){
                    outs.push(neighbor);
                    siteCol--;
                }else {
                    break;
                }
            }else {
                break;
            }
        }
    }
    /*检查纵向的链接*/
    private getColChain(item,outs){
        if(item==null){
            return;
        }
        if(item.getItemNone()){
            return;
        }
        if(item.GetColorType()<0){
            return;
        }
        outs.push(item);
        let siteCol = item.SitePos.X;
        let siteRow = item.SitePos.Y+1;
        while(siteRow<this.RowNum){
            let neighbor= this.GetItemByPos(siteRow,siteCol);
            if(neighbor==null){
                break;
            }
            if(neighbor.getItemNone()){
                break;
            }
            if(this.CheckAddMark(neighbor)){
                if(item.GetColorType()==neighbor.GetColorType()){
                    outs.push(neighbor);
                    siteRow++
                }else {
                    break;
                }
            }else {
                break;
            }
        }
        siteRow=item.SitePos.Y-1;
        while(siteRow>=0){
            let neighbor= this.GetItemByPos(siteRow,siteCol);
            if(neighbor==null){
                break;
            }
            if(neighbor.getItemNone()){
                break;
            }
            if(this.CheckAddMark(neighbor)){
                if(item.GetColorType()==neighbor.GetColorType()){
                    outs.push(neighbor);
                    siteRow--;
                }else {
                    break;
                }
            }else {
                break;
            }
        }
    }
    //Ai执行操作接口
    public doAiExchange() {
        //判断游戏是否结束
        if(this.doCheckGameFinish()){
            //监听停止棋盘提示
            App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
            App.MessageCenter.dispatch(Msg.Event.StopRoundTime);
            return ;
        }
        let first = -1;
        let second = -1;
        let obj=TG_Ai.getInstance().GetAiMoveData();
        first=obj.first;
        second=obj.second;
        Log.getInstance().trace("交换位置 : " + first + "," + second);
        if (first == -1 || second == -1){
            //无可提示的情况，打乱棋盘所有元素
            Log.getInstance().trace("无可提示的情况");
            let hasEx=this.doRandomExchangeAllItem();
            if(typeof (hasEx)=="boolean"){
                //启动棋盘提示倒计时
                App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
            }
        }else {
            if(TG_Stage.SingelModel){
                //单人模式
                TG_HintFunction.getInstance().AIItemMove(first,second);
            }else {
                TG_HintFunction.getInstance().AIHandMove(first,second);
            }
        }
    }
    /*重新打乱所有元素块*/
    public doRandomExchangeAllItem(){
        //若存在移动可消除
        if (this.isCanExchangeAll()){
            return false;
        }
        let isCan=this.RandomAllItem();
        if(isCan==1){
            //无法打乱棋盘，需要启动棋盘提示
            return 1;
        }else {
            return true;
        }
    }
    /*是否存在移动可产生消除情况*/
    private isCanExchangeAll(){
        for(let i=0;i<this.ColNum*this.RowNum;i++){
            let item=this.GetItemByIndex(i);
            if(item!=null){
                let index=item.Index;
                let row1=0,col1=0,row2=0,col2=0;
                //右边
                let rightIndex=this.GetRightItem(index);
                if(rightIndex>=0){
                    let right=this.GetItemByIndex(rightIndex);
                    row1=item.SitePos.Y;
                    col1=item.SitePos.X;
                    row2=right.SitePos.Y;
                    col2=right.SitePos.X;
                    if(TG_Ai.getInstance().IsCanExchange(row1,col1,row2,col2)){
                        return true;
                    }
                }
                //下边
                let bottomIndex=this.GetBottomItem(index);
                if(bottomIndex>=0){
                    let bottom=this.GetItemByIndex(bottomIndex);
                    row1=item.SitePos.Y;
                    col1=item.SitePos.X;
                    row2=bottom.SitePos.Y;
                    col2=bottom.SitePos.X;
                    if(TG_Ai.getInstance().IsCanExchange(row1,col1,row2,col2)){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /*打乱所有元素块*/
    private cantRandomAllItem=false;//无法打乱棋盘
    private RandomAllItem(isUsePorp=false){
        //isUsePorp 是否是使用的道具 打乱棋盘
        let  normalBlocks = this.GetNormalBlockIndex();
        let  hasEnoughBlock =false;//是否存在长度大于3的颜色块
        for(let i in normalBlocks){
           if(normalBlocks[i].length>=3){
               hasEnoughBlock=true;
               break;
           }
        }
        let needFill = null;
        if (hasEnoughBlock) {
            needFill = this.GetCanFillPos();
        }
        //当没有打乱可能时，进入结算
        if (!hasEnoughBlock || needFill == null){
            // 当有可使用的有效道具时，提示玩家使用道具，而不结束比赛
            if (this.hasVaildProp()){
                Panel_PopupLayer.getInstance().myAlert("无法打乱棋盘,您还有道具可用!",1000);
                return 1;
            }
            this.cantRandomAllItem=true;
            this.DoFinishRound();
            return 1;
        }
        TG_Game.SetGameState(false);
        if(!isUsePorp){
            Panel_PopupLayer.getInstance().myAlert("没有可移动的元素打乱棋盘",1000);
        }
        //普通块交换
        for(let j in normalBlocks){
            let fillCount=0;
            let blocksPair=normalBlocks[j];
            for(let i=0;i<blocksPair.length;i++){
                //还没换过的原始单色点，保证fillCount为3
                if(TsList.contains(needFill,blocksPair[i])){
                    fillCount++;
                }
            }
            if(blocksPair.length>=3){
                let fillBlockIndex=[];
                fillBlockIndex=[-1,-1,-1];
                for(let k=0;k<blocksPair.length;k++){
                    for(let l=0;l<3;l++){
                        //检测一下颜色可以少换很多次,检测包含，保证一共换3次
                        if(!TsList.contains(needFill,blocksPair[k])&&TG_Game.Items[needFill[l]].GetColorType()!=j
                        &&fillBlockIndex[l]==-1){
                            let row1=0,col1=0,row2=0,col2=0;
                            let item=this.GetItemByIndex(blocksPair[k]);
                            let item1=this.GetItemByIndex(needFill[l]);
                            row1=item.SitePos.Y;
                            col1=item.SitePos.X;
                            row2=item1.SitePos.Y;
                            col2=item1.SitePos.X;
                            if(!TG_Ai.getInstance().IsCanExchange(row1,col1,row2,col2)){
                                fillBlockIndex[l]=blocksPair[k];
                                this.SwapItem1(fillBlockIndex[l],needFill[l]);
                                //交换颜色队列中的值
                                let temp1=this.GetItemByIndex(needFill[l]);
                                let temp2=this.GetItemByIndex(fillBlockIndex[l]);
                                normalBlocks[temp1.GetColorType()].push(needFill[l]);
                                App.ArrayManager.removeItem(fillBlockIndex[l],normalBlocks[temp1.GetColorType()]);
                                normalBlocks[temp2.GetColorType()].push(fillBlockIndex[l]);
                                App.ArrayManager.removeItem(needFill[l],normalBlocks[temp1.GetColorType()]);
                                fillCount++;
                                k--;
                                break;
                            }
                        }
                    }
                }
                if(fillCount==3){
                    break;
                }
            }
        }
        //打乱
        this.RandomExchangeAllItem(needFill);
    }
    /*随机打乱逻辑*/
    public RandomExchangeAllItem(needFill){
        Log.getInstance().trace("开始打乱棋盘");
        for(let index=0;index<this.ColNum*this.RowNum;index++){
            let random=Math.floor(Math.random()*81)+1;
            let swapIndex=this.getNextNormalItem(index+random);
            if(TsList.contains(needFill,index))continue;
            if(TsList.contains(needFill,swapIndex))continue;
            if(!this.IsCanRandomExchange(index, swapIndex, false))continue;
            let row1=0,col1=0,row2=0,col2=0;
            let item=this.GetItemByIndex(index);
            let item1=this.GetItemByIndex(swapIndex);
            row1=item.SitePos.Y;
            col1=item.SitePos.X;
            row2=item1.SitePos.Y;
            col2=item1.SitePos.X;
            if(!TG_Ai.getInstance().IsCanExchange(row1,col1,row2,col2,false)){
                this.SwapItem1(swapIndex,index);
            }
        }
        //打乱棋盘表演
        GamePanel_ItemSp.getInstance().OnRefreshStage();
    }
    /*是否可以用于随机交换*/
    private IsCanRandomExchange(first,second,needNeighbor = true){
        let item=this.GetItemByIndex(first);
        let destItem=this.GetItemByIndex(second);
        if(item==null||item.getItemNone()||destItem==null||destItem.getItemNone()) return false;
        if(needNeighbor&&!this.checkIsNeighbor(item.SitePos.Y,item.SitePos.X,destItem.SitePos.Y,destItem.SitePos.X))return false;
        if(!item.CheckCellCouldMove()||!destItem.CheckCellCouldMove())return false;
        if (item.IsItemEffect() || destItem.IsItemEffect()) return false;
        if (needNeighbor && !this.CheckRailingCouldMove(item, destItem)) return false;
        if (!this.IsCanRandomExchange1(first) || !this.IsCanRandomExchange1(second)) return false;
        return true;
    }
    /*是否参与随机打乱*/
    private IsCanRandomExchange1(index){
        if (index < 0 || index > TG_Game.Items.length) {
            return false;
        }
        let item = this.GetItemByIndex(index);
        //如果有毛球
        if(item.GetVenonatId()>0){
            return false;
        }
        // 只有普通块参与打乱
        if (!item.IsNormal()){
            return false;
        }
        return true;
    }
    private getNextNormalItem(index){
        let  count = this.ColNum * this.RowNum;
        let  newIndex = index;
        for (let i = 0; i < count; i++) {
            newIndex = (newIndex + 1) % count;
            if (this.CheckAddMark(TG_Game.Items[newIndex])){
                return newIndex;
            }
        }
        return -1;
    }
    /*获取棋盘上6种普通块的index*/
    private GetNormalBlockIndex(){
        let Blocks=new Object();
        for(let index=0;index<TG_Game.Items.length;index++){
            let item=this.GetItemByIndex(index);
            if(item!=null){
                //去掉不能爆炸和不能移动的元素块
                if(!this.CheckAddMark(item)||!item.CheckCellCouldMove(item)){
                    continue;
                }
                //去掉特殊元素
                if(item.IsNormal()){
                    let color=item.GetColorType();
                    if(!Blocks.hasOwnProperty(color)){
                        Blocks[color]=[];
                    }
                    Blocks[color].push(index);
                }
            }
        }
        return Blocks;
    }
    /*获取填充的位置点组合*/
    private GetCanFillPos(){
        let blocks=[];
        let posList=[];
        for(let item of TG_Game.Items){
            if(this.CheckAddMark(item)&&item.CheckCellCouldMove()&&item.IsNormal()){
                blocks.push(item.Index);
            }
        }
        let random=Math.floor(Math.random()*blocks.length);
        for(let i=0;i<blocks.length;i++){
            let index=blocks[(i+random)%blocks.length];
            posList=[];
            posList.push(index);
            //上
            let topIndex=this.GetTopItem(index);
            let topLeftIndex=this.GetTopLeftItem(index);
            let topRightIndex=this.GetTopRightItem(index);
            if(TsList.contains(blocks,topIndex)&&TsList.contains(blocks,topLeftIndex)&&TsList.contains(blocks,topRightIndex)){
                let temp=this.GetItemByIndex(index);
                let topTemp=this.GetItemByIndex(topIndex);
                if (this.CheckRailingCouldMove(temp,topTemp)){
                    posList.push(topLeftIndex);
                    posList.push(topRightIndex);
                    return posList;
                }
            }
            //左
            let leftIndex=this.GetLeftItem(index);
            let bottomLeftIndex=this.GetBottomLeftItem(index);
            if(TsList.contains(blocks,leftIndex)&&TsList.contains(blocks,topLeftIndex)&&TsList.contains(blocks,bottomLeftIndex)) {
                let temp=this.GetItemByIndex(index);
                let leftTemp=this.GetItemByIndex(leftIndex);
                if (this.CheckRailingCouldMove(temp,leftTemp)){
                    posList.push(topLeftIndex);
                    posList.push(bottomLeftIndex);
                    return posList;
                }
            }
            //下
            let bottomIndex=this.GetBottomItem(index);
            let bottomRightIndex=this.GetBottomRightItem(index);
            if(TsList.contains(blocks,bottomIndex)&&TsList.contains(blocks,bottomRightIndex)&&TsList.contains(blocks,bottomLeftIndex)){
                let temp=this.GetItemByIndex(index);
                let bottomTemp=this.GetItemByIndex(bottomIndex);
                if(this.CheckRailingCouldMove(temp,bottomTemp)){
                    posList.push(bottomLeftIndex);
                    posList.push(bottomRightIndex);
                    return posList;
                }
            }
            //右
            let rightIndex=this.GetRightItem(index);
            if (TsList.contains(blocks,rightIndex)&&TsList.contains(blocks,bottomRightIndex)&&TsList.contains(blocks,topRightIndex)){
                let temp=this.GetItemByIndex(index);
                let rightTemp=this.GetItemByIndex(rightIndex);
                if(this.CheckRailingCouldMove(temp,rightTemp)){
                    posList.push(bottomRightIndex);
                    posList.push(topRightIndex);
                    return posList;
                }
            }
            //右右
            let rightIndex2=this.GetRightItem(rightIndex);
            let rightIndex3=this.GetRightItem(rightIndex2);
            if(TsList.contains(blocks,rightIndex)&&TsList.contains(blocks,rightIndex2)&&TsList.contains(blocks,rightIndex3)){
                let temp=this.GetItemByIndex(index);
                let rightTemp=this.GetItemByIndex(rightIndex);
                if(this.CheckRailingCouldMove(temp,rightTemp)){
                    posList.push(rightIndex2);
                    posList.push(rightIndex3);
                    return posList;
                }
            }
            //下下
            let bottomIndex2=this.GetBottomItem(bottomIndex);
            let bottomIndex3=this.GetBottomItem(bottomIndex2);
            if(TsList.contains(blocks,bottomIndex)&&TsList.contains(blocks,bottomIndex2)&&TsList.contains(blocks,bottomIndex3)){
                let temp=this.GetItemByIndex(index);
                let leftTemp=this.GetItemByIndex(leftIndex);
                if (this.CheckRailingCouldMove(temp,leftTemp)){
                    posList.push(bottomIndex2);
                    posList.push(bottomIndex3);
                    return posList;
                }
            }
        }
        return null;
    }
    /*判断是否有有效的道具  包括：横消、竖消、炸弹、金锤*/
    public usedToolTimes=0;//回合内使用道具的次数
    private hasVaildProp(){
        if(TG_Stage.IsLimitUsePropCount&&this.usedToolTimes>=1){
            return false;
        }
        if(this.m_Status==GameStatus.GS_ARound){
            if(this.GetACanUsePropCount(3)||this.GetACanUsePropCount(4)||this.GetACanUsePropCount(5)||this.GetACanUsePropCount(2)){
                return true;
            }else {
                return false;
            }
        }
        if(this.m_Status==GameStatus.GS_BRound){
            return false;
        }
    }
    /*获取A可以使用道具数量*/
    private GetACanUsePropCount(toolType){
        let arr=PropNewView.itemList;
        for(let i = 0;i < arr.length;i ++)
        {
            if(toolType == arr[i]["type"])
            {
                let num=arr[i]["num"];
                if(num>0){
                    return true;
                }
                return false;
            }
        }
    }

    /*
     * 消除逻辑接口
     * */
    //游戏中飞到消除目标位置
    public ItemFlyToGoal(item){
        if(item==null||item.IsItemNone()) return;
        //不是被毒液感染爆炸
        if(!item.GetIsInfectVenom()){
            this.seekitemFunction(item);
            //检查任务目标
            this.DoCheckTaskTarget(item);
        }
    }
    /*判断功能块 加属性*/
    public seekitemFunction(items:TG_Item){
        if(items.isFunction)
        {
            if(items.extendType == 1)//加步数
            {
                this.AddingStep(Number(items.extendParam));
            }
            else if(items.extendType == 2)//加时间
            {
                this.AddingTime(Number(items.extendParam))
            }
        }
        if(items.isPropBox){
            //是道具宝箱
            let propId:number= items.propId;//宝箱id
            let propNum:number = items.propNum;
            //时间步数直接使用增加玩家时间或者步数
            if(propId==7){//步数
                this.AddingStep(3);
            }else if(propId==8){
                this.AddingStep(5);
            }else if(propId==9){//时间
                this.AddingTime(10);
            }else if(propId==10){
                this.AddingTime(20);
            }else {
                App.MessageCenter.dispatch(Msg.Event.UseProp,propId,1,propNum,false);//派发更新道具数量事件
            }
        }
    }

    /*滚动目标是否全部完成*/
    private doCheckRollTargetFinish(){
        let finishRollTarget=false;
        if(this.m_Status==GameStatus.GS_ARound){
            finishRollTarget = this.aRollIndex >= this.ARollTargets.length;
        }else if(this.m_Status==GameStatus.GS_BRound){
            finishRollTarget = this.bRollIndex >= this.BRollTargets.length;
        }
        return finishRollTarget;
    }

    /*检查任务目标*/
    public DoCheckTaskTarget(item){
        let externalId=item.BlockId;
            this.doCalRollTaskTarget(externalId);
        if (TG_Stage.IsSyncCollectTarget || this.doCheckRollTargetFinish()){
            //消除元素块飞到胜利目标位置
            App.MessageCenter.dispatch(Msg.Event.itemFlyToVictoryTask,this.m_Status,item);
            if (Math.floor(externalId/10) * 10 == 2600 ) {
                externalId = 2000 + externalId%10;
            }
            this.doCalVictoryTaskTarget(externalId);
        }
        this.doCalDefeatTaskTarget(externalId);
    }
    /*胜利条件任务目标处理*/
    public doCalVictoryTaskTarget(externalId){
        //胜利目标
        if(this.m_Status==GameStatus.GS_ARound){
            for(let target of this.ATaskTargets){
                if(target.Target==externalId){
                    target.DoIncreaseTarget();
                    //刷新胜利目标数量
                    App.MessageCenter.dispatch(Msg.Event.refreshVictoryTask,GameStatus.GS_ARound,target);
                }
            }
            if(TG_Stage.IsAddTarget){
                for(let target of this.BTaskTargets){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                    }
                }
            }
        }else if(this.m_Status==GameStatus.GS_BRound){
            for(let target of this.BTaskTargets){
                if(target.Target==externalId){
                    target.DoIncreaseTarget();
                }
            }
            if(TG_Stage.IsAddTarget){
                for(let target of this.ATaskTargets){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                        //刷新胜利目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshVictoryTask,GameStatus.GS_ARound,target);
                    }
                }
            }
        }
    }
    /*失败条件任务目标处理*/
    public doCalDefeatTaskTarget(externalId){
        //失败任务目标处理
        if(this.m_Status==GameStatus.GS_ARound){
            if(TG_Stage.IsElementLimit1){
                for(let target of this.ADefeatTaskTargets1){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                        //刷新失败目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshDefeatTask,GameStatus.GS_ARound,target);
                    }
                }
            }
            if(TG_Stage.IsElementLimit2){
                for(let target of this.ADefeatTaskTargets2){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                        //刷新失败目标数量
                        App.MessageCenter.dispatch(Msg.Event.refreshDefeatTask,GameStatus.GS_ARound,target);
                    }
                }
            }
        }else if(this.m_Status==GameStatus.GS_BRound){
            if(TG_Stage.IsElementLimit1){
                for(let target of this.BDefeatTaskTargets1){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                    }
                }
            }
            if(TG_Stage.IsElementLimit2){
                for(let target of this.BDefeatTaskTargets2){
                    if(target.Target==externalId){
                        target.DoReduceTarget();
                    }
                }
            }
        }
    }

    /*滚动任务目标*/
    public doCalRollTaskTarget(externalId){
        if(this.aRollIndex>=this.ARollTargets.length&&this.bRollIndex>=this.BRollTargets.length){
            return;
        }
        let aRollTarget=this.aRollIndex<this.ARollTargets.length?this.ARollTargets[this.aRollIndex]:null;
        let bRollTarget=this.bRollIndex<this.ARollTargets.length?this.BRollTargets[this.bRollIndex]:null;

        let selfRollTarget = this.m_Status == GameStatus.GS_ARound ? aRollTarget : bRollTarget;
        let otherRollTarget = this.m_Status == GameStatus.GS_ARound ? bRollTarget : aRollTarget;

        if(selfRollTarget!=null){
            for(let target of selfRollTarget.Targets){
                if(target.Target==externalId){
                    this.DoIncreaseTarget(target);
                }
            }
        }
        if(otherRollTarget!=null){
            if(TG_Stage.IsAddTarget){
                for(let target of otherRollTarget.Targets){
                    if(target.Target==externalId){
                        this.DoReduceTarget(target);
                    }
                }
            }
        }
    }
    public DoIncreaseTarget(target){
        let Num=target.Num;
        let Cur=target.Cur;
        if (Num < 0)  {
            // 无限模式
            Cur += 1;
        }else {
            Cur=Math.min(Num,++Cur);
        }
        target.Cur=Cur;
    }
    public DoReduceTarget(target) {
        let Cur=target.Cur;
        Cur=Math.max(0,--Cur);
        target.Cur =Cur;
    }


    /**
     * beltsType 传送带类型 1 闭合形 2 非闭合形
     * preIndex 前一点的下标
     * currIndex 当前点的下标
     * nextIndex 下一点的下标
     * 返回值表示传送带的方向: 1 左右方向 2 右左方向 3 上下方向 4 下上方向 5 左上方向 6 上左方向 7 右上方向 8 上右方向 9 左下方向 10 下左方向 11 右下方向 12 下右方向
     *
     */
    public getBeltsNumByBeltsType(beltsType,preBeltsIndex,currBeltsIndex,nextBeltsIndex,isFirst:boolean=false,isLast:boolean=false){
        if (beltsType == 1) {// 环形 闭合
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
        if (beltsType == 2) {// 非环形 非闭合
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
    }

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
    public getBeltsColorDirect(preBeltsIndex,currBeltsIndex,nextBeltsIndex,isFirst:boolean=false,isLast:boolean=false) {
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
    }

    /*修改元素块上的文字mark*/
    public changeAllText() {
        for (let j in  TG_Game.Items) {
            this.changItemTxt(TG_Game.Items[j]);
        }
    }
    /*改变方块上的文字显示*/
    public changItemTxt(obj,itemArr:Array<any> =  TG_Game.Items) {
        if(itemArr !=  TG_Game.Items) return;
        for (let i in TG_Game.Items) {
            if (TG_Game.Items[i].SitePos.Y == obj.SitePos.Y && TG_Game.Items[i].SitePos.X == obj.SitePos.X) {
                let sineObj = TG_Game.Items[i];
                sineObj.changeText(sineObj.SitePos.Y, sineObj.SitePos.X, sineObj.MarkedHor, sineObj.MarkedVel);
            }
        }
    }
}