
/**
 * Created by ZhangHui on 2018/6/1.
 */
class GamePanel extends Panel_GameLayer{
    /*单例*/
    private static gamePanel:GamePanel;
    public static getInstance(){
        if(!this.gamePanel){
            this.gamePanel=new GamePanel();
        }
        return this.gamePanel;
    }
    public initModule():void
    {
        //初始化道具模块
        App.ControllerManager.register(ControllerConst.Prop,new PropController());
        App.ControllerManager.register(ControllerConst.Title,GameTitleController.getInstance());
        App.ControllerManager.register(ControllerConst.GameExit,new ExitController());
    }
    /*实例化视图*/
    public initGamePanel()
    {
        this.initModule();
        App.MessageCenter.addListener(Msg.Event.BeginGame, this.initRect,this);
        App.MessageCenter.addListener(Msg.Event.BeginGame2, this.beginTitle,this);
        //游戏背景层
        this.initBg();
        //方块
        this.initRect();
    }
    public GameOver(over)
    {
        if(over)
        {

        }
    }
    //游戏结束界面
    private gameOver:GameOver_View;
    public showGameOver(type:number){
        //移除小手
        this.removeHand();
        this.removeRoundTxt();
        this.gameOver = this.addChild(GameOver_View.getInstance()) as GameOver_View;
        this.gameOver.init(type);
    }
    //游戏内目标任务
    private gameTitle:GamePanel_Title;
    private initTitle()
    {
        this.gameTitle = this.addChild(GamePanel_Title.getInstance()) as GamePanel_Title;
        this.gameTitle.initView();
    }
    /*实例化背景层*/
    private gameBgSp;
    private initBg(){
        this.gameBgSp=this.addChild(GamePanel_BgSp.getInstance());
        //实例化背景
        this.gameBgSp.initView();
    }
    public clearPanel()
    {
        if(this.gameOver)
            this.gameOver.removeself();
        if(this.gameTitle)
            this.gameTitle.removeself();
        if(this.rectSp)
        {
            this.rectSp.clearAll();
            this.rectSp.removeself();
        }
        if(this.bg){
            this.removeChild(this.bg);
            this.bg=null;
        }
        if(this.shape){
            this.shape.graphics.clear();
            this.removeChild(this.shape);
            this.shape=null;
        }
        if(this.skipRollBtn){
            this.removeChild(this.skipRollBtn);
            this.skipRollBtn=null;
        }
        this.removeHand();
        this.removeRoundTxt();
    }
    /*实例化初始地图方块*/
    public rectSp:GamePanel_ItemSp;
    private shape:egret.Shape;
    private bg:egret.Bitmap;
    public initRect(){
        this.clearPanel();
        //棋盘背景
        this.bg = new egret.Bitmap(RES.getRes("game_bg3_png"));
        this.addChild(this.bg);
        //棋盘元素块
        this.rectSp = GamePanel_ItemSp.getInstance();
        this.addChild(this.rectSp);
        this.rectSp.initMapRect();
        if(!TG_Stage.SingelModel){
            this.initRoundTxt();
        }
        App.MessageCenter.addListener(Msg.Event.GameResize,this.resize,this);
        this.resize();
        //监听创建游戏中元素块
        App.MessageCenter.addListener(Msg.Event.CreateGameItem,this.initGameRect,this);
        //监听棋盘滚动事件
        App.MessageCenter.addListener(Msg.Event.BrowseGameBeginRoll,this.browseGameBeginRoll,this);
        //监听棋盘向上滚动
        App.MessageCenter.addListener(Msg.Event.BrowseRollUp,this.browseRollUp,this);

        // this.initTitle();
        App.MessageCenter.dispatch(Msg.Event.BeginGame2)//统一放这里调用开始
    }

    /*棋盘的显示遮罩*/
    private initRectSpShape(){
        if(this.shape)
        {
            return;
        }
        //遮罩
        this.shape=new egret.Shape();
        this.shape.graphics.beginFill(0xff0000);
        this.shape.graphics.drawRect(0,0,this.rectSp.width,this.rectSp.width+40);
        this.shape.graphics.endFill();
        this.addChild(this.shape);
        this.shape.x = this.bg.x+5;
        this.shape.y = this.bg.y+5;
        this.rectSp.mask= this.shape;
    }
    /*创建游戏中的元素块*/
    private initGameRect(){
        GamePanel_ItemSp.getInstance().initRect();
        this.resize();
        this.initRectSpShape();
        this.beginGame();
        App.MessageCenter.dispatch(Msg.Event.GameResize);
        App.MessageCenter.dispatch(Msg.Event.cleatDoStartDrop);
    }
    /*棋盘滚动*/
    private skipRollBtn:eui.Button;
    private curRollRow=0;//当前行
    private realRollRow=0;//滚动行数
    public browseGameBeginRoll(num){
        //browseLineNum 滚动行数
        Log.getInstance().trace("棋盘滚动的行数:___"+num);
        let height=TG_Item.getInstance().itemWidth+1.5;
        let rollRowTotal=9+num;
        this.realRollRow=0;
        this.curRollRow=rollRowTotal-12>=0?rollRowTotal-12:0;
        if (rollRowTotal<12){
            this.createBeginRollItem(rollRowTotal);
        } else {
            this.createBeginRollItem(12);
        }
        this.resize();
        this.initRectSpShape();
        //每行滚动的时间
        let singleRowRollTime= TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay);
        let vy=(rollRowTotal-4)*height+10;
        egret.Tween.get(this.rectSp).to({y:vy},singleRowRollTime*(num-1)).call(function () {
            egret.Tween.removeTweens(this.rectSp);
            this.removeSkipBtn();
        }.bind(this),this);
        if (num>3){
            App.TimerManager.doTimer(singleRowRollTime,num-3,this.createBeginRollItemTimer,this);
        }
        App.ViewManager.close(ViewConst.Prop,this.bg);
        //跳过滚动按钮
        this.skipRollBtn=new eui.Button();
        this.addChild(this.skipRollBtn);
        this.skipRollBtn.anchorOffsetX=this.skipRollBtn.width/2;
        this.skipRollBtn.anchorOffsetY=this.skipRollBtn.height/2;
        this.skipRollBtn.x=Main.stageWidth/2;
        this.skipRollBtn.y=this.bg.y+this.bg.height+40+this.skipRollBtn.height;
        this.skipRollBtn.label="跳过滚动";
        this.skipRollBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.skipRollBtnEvent,this);
    }
    private createBeginRollItemTimer(){
        this.createBeginRollItem(1);
    }
    //移除
    public ClearBeginRollItemRow(){
        for(let temp of this.cRollClearItems){
            if(temp!=undefined){
                App.DisplayUtils.removeFromParent(temp);
                TG_Object.Release(temp);
            }
        }
        this.cRollClearItems=[];
    }
    public cRollClearItems=[];
    /*开始滚动时的创建*/
    public createBeginRollItem(num){
        this.cRollClearItems=[];
        //移除
        for(let i =0;i<9;i++){
            let button=TG_Game.Buttons[0];
            TG_Game.Buttons.splice(0,1);
            this.cRollClearItems.push(button);

            let item=TG_Game.Items[0];
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
        this.ClearBeginRollItemRow();
        //创建
        for(let i=num*9-1;i>=0;i--){
            let index=i+this.curRollRow*9;
            let block=TG_Stage.Blocks[index];
            let row = 0, col = 0;
            row = Math.floor(Number(index) / 9)-this.curRollRow-3-this.realRollRow;
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
        this.curRollRow-=1;
        this.realRollRow+=1;
    }
    /*棋盘向上滚动*/
    public browseRollUp(browseLineNum){
        let height=TG_Item.getInstance().itemWidth+1.5;
        let vy=this.rectSp.y-height*browseLineNum;
        let time= TG_TimeDefine.GetTimeDelay(TG_TimeDefine.SingleRowRollDelay)*browseLineNum;
        TG_Game.SetGameState(false);
        egret.Tween.get(this.rectSp).to({y:vy},time).call(function () {
            egret.Tween.removeTweens(this.rectSp);
            TG_Game.SetGameState(true);
            Log.getInstance().trace("游戏中棋盘滚动完毕...");
            //刷新数字显示
            TG_Game.getInstance().changeAllText();
        }.bind(this),this);
    }
    /*移除棋盘的滚动*/
    public removeRectSpRoll(){
        if(this.rectSp){
            egret.Tween.removeTweens(this.rectSp);
        }
    }
    /*停止滚动按钮事件*/
    public skipRollBtnEvent(){
        App.TimerManager.remove(this.createBeginRollItemTimer,this);
        this.removeSkipBtn();
    }
    /*移除停止滚动按钮和打开道具*/
    private removeSkipBtn(){
        if(this.skipRollBtn){
            this.removeChild(this.skipRollBtn);
            this.skipRollBtn=null;
        }
        if(this.rectSp){
            egret.Tween.removeTweens(this.rectSp);
        }
        TG_Game.SetGameState(true);
        //派发移除滚动多余元素
        App.MessageCenter.dispatch(Msg.Event.ClearBeginRollItem);
    }

    //开始游戏事件
    public beginGame()
    {
         App.ViewManager.open(ViewConst.Prop,this.bg);
        this.resize();
    }

    //开启title
    private beginTitle(){
        App.ViewManager.open(ViewConst.Title);
        this.resize();
    }
    private resize()
    {
        if(this.rectSp)
        {

            this.rectSp.y = GameTitleController.getInstance().titleView.y +  GameTitleController.getInstance().titleView.thisheight*1.02;//this.gameBgSp.topBg.y + this.gameBgSp.topBg.height;
            this.rectSp.x = Main.stageWidth/2 - this.rectSp.width/2-7;

            this.bg.x=this.rectSp.x;
            this.bg.y=this.rectSp.y;
            this.bg.width=this.rectSp.width+14;
            this.bg.height=this.bg.width;

        }

    }
    /*PK模式 Ai小手移动动画*/
    private AiHand:egret.Bitmap;
    public AIHandMove(first,second){
        if(TG_Game.getInstance().m_Status!=GameStatus.GS_BRound) return;
        this.removeHand();
        let vx=0,vy=0,beginX=0,beginY=0,endX=0,endY=0;
        //获取ai小人的位置
        vx=this.getAiPos().x;
        vy=this.getAiPos().y;
        this.AiHand=TG_Object.Create("hand_png");
        this.addChild(this.AiHand);
        this.AiHand.x=vx;
        this.AiHand.y=vy;
        let firstItem=TG_Game.getInstance().GetItemByIndex(first);
        let secondItem=TG_Game.getInstance().GetItemByIndex(second);
        beginX=firstItem.x;
        beginY=firstItem.y+this.bg.y;
        endX=secondItem.x;
        endY=secondItem.y+this.bg.y;
        let tw=egret.Tween.get(this.AiHand);
        tw.to({x:beginX,y:beginY},700);
        tw.wait(50);
        tw.to({x:endX,y:endY},500);
        tw.call(function () {
            this.removeHand();
            GamePanel_ItemSp.getInstance().currentSetRect=firstItem;
            GamePanel_ItemSp.getInstance().nextSetRect=secondItem;
            GamePanel_ItemSp.getInstance().rectExchangePos();
        }.bind(this),this);
    }
    //移除小手
    private removeHand(){
        if(this.AiHand){
            egret.Tween.removeTweens(this.AiHand);
            App.DisplayUtils.removeFromParent(this.AiHand);
            TG_Object.Release(this.AiHand);
        }
    }
    /*获取Ai小人的位置*/
    public getAiPos(){
        let vx=0,vy=0;
        let pos={
            "x":vx,
            "y":vy
        };
        vx=this.bg.x+this.bg.width*.9;
        vy=this.bg.y-this.bg.height*.15;
        pos.x=vx;
        pos.y=vy;
        return pos;
    }
    /*切换回合的倒计时*/
    private roundTxt:egret.TextField;
    public initRoundTxt(){
        this.removeRoundTxt();
        this.roundTxt=new egret.TextField();
        this.addChild(this.roundTxt);
        this.roundTxt.textColor=0xff0000;
        this.roundTxt.size=80;
        this.roundTxt.textAlign="center";
        this.roundTxt.verticalAlign="middle";
        this.roundTxt.text=5+"";
        this.roundTxt.x=Main.stageWidth/2-this.roundTxt.width/2;
        this.roundTxt.y=GameTitleController.getInstance().titleView.y +  GameTitleController.getInstance().titleView.thisheight*.8;
        this.roundTxt.alpha=0;
    }
    /*刷新回合的倒计时*/
    public updateRoundTxt(num){
        if(this.roundTxt){
            let str="";
            if(num<=0){
                num=0;
            }
            str=num+"";
            this.roundTxt.alpha=1;
            this.roundTxt.text=str;
        }
    }
    /*倒计时不再显示*/
    public hideUpdateRoundTxt(){
        if(this.roundTxt){
            this.roundTxt.alpha=0;
        }
    }
    /*移除倒计时*/
    public removeRoundTxt(){
        if(this.roundTxt){
            this.removeChild(this.roundTxt);
            this.roundTxt=null;
        }
    }




}