/**
 * Created by HuDe Zheng on 2018/8/07.
 */
class GameTitleController extends BaseController{
    private titleView:GameTitleView;
    public constructor() {
        super();
        //初始化页面
        this.titleView = new GameTitleView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Title, this.titleView);
        //初始化事件监听
        this.InitEventListen();
        //初始化胜利目标位置
        this.initVictoryPos();
    }
    /*初始化事件监听*/
    public InitEventListen(){
        this.RemoveEventListen();
        //返回按钮
        this.titleView.backBtn.touchEnabled = true;
        this.titleView.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backBtnEvent,this);
        //监听切换回合事件
        App.MessageCenter.addListener(Msg.Event.ChaneRound,this.updateRole,this);
        //监听时间模式321倒计时
        App.MessageCenter.addListener(Msg.Event.StartTimeLimitCountdown,this.startCountdown,this);
        //监听刷新游戏时间显示
        App.MessageCenter.addListener(Msg.Event.refreshTimeShow,this.refreshTime,this);
        //监听刷新游戏步数显示
        App.MessageCenter.addListener(Msg.Event.refreshStepShow,this.refreshStep,this);
        //监听刷新游戏分数显示
        App.MessageCenter.addListener(Msg.Event.refreshScoreShow,this.refreshScore,this);
        //监听刷新胜利目标
        App.MessageCenter.addListener(Msg.Event.refreshVictoryTask,this.refreshVictoryTask,this);
        //监听刷新失败目标
        App.MessageCenter.addListener(Msg.Event.refreshDefeatTask,this.refreshDefeatTask,this);
        //监听消除元素块飞到胜利目标位置
        App.MessageCenter.addListener(Msg.Event.itemFlyToVictoryTask,this.itemFlyToVictoryTask,this);
    }
    /*移除事件监听*/
    public RemoveEventListen(){
        App.MessageCenter.removeListener(Msg.Event.ChaneRound,this.updateRole,this);
        App.MessageCenter.removeListener(Msg.Event.StartTimeLimitCountdown,this.startCountdown,this);
        App.MessageCenter.removeListener(Msg.Event.refreshTimeShow,this.refreshTime,this);
        App.MessageCenter.removeListener(Msg.Event.refreshStepShow,this.refreshStep,this);
        App.MessageCenter.removeListener(Msg.Event.refreshScoreShow,this.refreshScore,this);
        App.MessageCenter.removeListener(Msg.Event.refreshVictoryTask,this.refreshVictoryTask,this);
        App.MessageCenter.removeListener(Msg.Event.refreshDefeatTask,this.refreshDefeatTask,this);
        App.MessageCenter.removeListener(Msg.Event.itemFlyToVictoryTask,this.itemFlyToVictoryTask,this);
    }
    /*刷新胜利目标*/
    public refreshVictoryTask(type,target){
        this.titleView.refreshVictoryTask(type,target);
    }
    /*刷新失败目标*/
    public refreshDefeatTask(type,target){
        this.titleView.refreshDefeatTask(type,target);
    }
    /*消除元素块飞到胜利目标位置*/
    public itemFlyToVictoryTask(type,temp){
        if(type==GameStatus.GS_ARound){
            this.titleView.flyToA(temp);
        }else if(type==GameStatus.GS_BRound){
            this.titleView.flyToB(temp);
        }
    }
    /*返回按钮点击事件*/
    public backBtnEvent(e){
        App.ViewManager.open(ViewConst.GameExit);
    }
    /*时间模式下的321倒计时*/
    public startCountdown(){
        this.titleView.begin_times();
    }
    /*刷新游戏时间显示*/
    public refreshTime(timeNum){
        if(!TG_Stage.IsTimeLimit) return;
        this.titleView.updateTime(timeNum)
    }
    /*刷新游戏步数显示*/
    public refreshStep(type,stepNum){
        if(TG_Stage.IsTimeLimit) return;
        if(type==GameStatus.GS_ARound){
            //A
            this.titleView.updateStepNum(stepNum)
        }else {
            //B
        }
    }
    /*刷新游戏分数显示*/
    public refreshScore(type,score){
        this.titleView.updateScore(type,score);
    }

    /*胜利目标显示位置*/
    public initVictoryPos(){
        if(!TG_Stage.SingelModel){
            //pk模式
            this.titleView.winGroup.x=301;
            this.titleView.winGroup.y=290;
        }
    }
    /*切换小人的状态*/
    public updateRole(type){
        if(TG_Stage.SingelModel){
            return;
        }
        if(type=="我的回合"){
            //A回合
            this.titleView.roleBSp.stop();
            this.titleView.roleSp.play();
        }else {
            this.titleView.roleBSp.play();
            this.titleView.roleSp.stop();
        }
    }





}
