import tr = egret.sys.tr;
/**游戏Title显示类
 * Created by HuDe Zheng on 2018/8/07.
 */
class GameTitleView extends BaseEuiView {
    public backBtn:eui.Image;//返回按钮
    public roleGroup: Group;
    public maskGroup: Group;
    public shenglimubiao: Group;
    public winGroup: Group;
    public scoreBgBtn: eui.Image;
    public roleSp: TG_Role_Model;
    public roleBSp:TG_Role_Model;
    //人物模型信息
    public roleArr: Array<any>;
    //人物性别 1女 2男
    public avatar: number;
    public avatarB:number;
    //游戏规则 0:消除 1:收集
    public ruleType: number;
    //收集部分容器
    private gatherSp: egret.Sprite;
    public taskAItemArr: Array<GatherItem1> = [];//A任务目标容器
    public taskBItemArr: Array<GatherItem1> = [];//B任务目标容器
    public defeatAItemArr=[];//A失败任务目标
    public defeatBItemArr=[];//B失败任务目标
    public ruleImg: eui.Image;//模式显示图片
    public thisheight: number = 0;
    public constructor(controller: BaseController, parent: eui.Group) {
        super(controller, parent);
        this.skinName = "game_titleUI";
        //初始化游戏形象
        this.initRoles();
        if (this.thisheight == 0)
            this.thisheight = this.height;
    }
    //开启面板 刷新数据
    public open(...param: any[]): void {
        super.open(param);
        this.initTitleData();
        this.addEvent();
        if (this.thisheight == 0)
            this.thisheight = this.height;
    }
    //关闭面板
    public close(...param: any[]) {
        super.close(param);
        this.removeEvent();
        this.removeTask();
    }
    /*添加事件监听*/
    public addEvent() {
        App.MessageCenter.addListener(Msg.Event.GameResize, this.resize, this);
    }
    /*移除事件监听*/
    public removeEvent() {
        App.MessageCenter.removeListener(Msg.Event.GameResize, this.resize, this);
    }
    /*初始化游戏形象*/
    public initRoles() {
        this.avatar = 1;//初始化人物性别
        this.roleArr = [10101, 10102, 0, 0, 10201, 0, 10202, 0, 0, 0];//初始化任务模型信息
        this.roleSp = TG_Role_Model.createModel(this.avatar, this.roleArr, 0.42);
        this.addChild(this.roleSp);
        this.roleSp.play();
        this.roleSp.y = 80;
        if(!TG_Stage.SingelModel){
            //Pk模式
            this.avatarB=2;
            this.roleArr = [20101, 20102, 0, 0, 20201, 0, 20202, 0, 0, 0];//初始化任务模型信息
            this.roleBSp = TG_Role_Model.createModel(this.avatarB, this.roleArr, 0.42);
            this.addChild(this.roleBSp);
            this.roleBSp.play();
            this.roleBSp.x=Main.stageWidth-360;
            this.roleBSp.y = 80;
        }
    }
    //第二次打开面板的时候需要初始化面板数据
    public initTitleData() {
        //0:消除 1:收集
        this.ruleType = TG_Stage.RuleType;
        if(this.gatherSp&&this.shenglimubiao){
            this.gatherSp.removeChildren();
            this.shenglimubiao.removeChild(this.gatherSp);
            this.gatherSp=null;
        }
        this.gatherSp = new egret.Sprite();
        this.gatherSp.x = 10;
        this.gatherSp.y = 40;
        this.shenglimubiao.addChild(this.gatherSp);
        this.taskAItemArr = [];
        this.taskBItemArr = [];
        //添加A任务目标
        this.addATaskTarget();
        //添加A失败目标
        this.addADefeatTask();
        //添加B任务目标
        this.addBTaskTarget();
        //添加B失败目标
        this.addBDefeatTask();

        this.begin_num = 3;//倒计时时长

        //初始化星星积分数据
        this.initStarData();
        //初始化A得分
        this.initAScore();
        //初始化B得分
        this.initBScore();
        //初始化时间或者步数显示
        if(TG_Stage.IsConditionLimit){
            if(TG_Game.getInstance().IsTimeLimit){
                let timeNum=TG_Stage.TimeLimitLength;
                this.updateTime(timeNum);
            }else {
                let stepNum=TG_Game.getInstance().AStepNum;
                this.updateStepNum(stepNum);
            }
        }else {
            this.step_text.visible=false;
        }
        //显示步数还是时间
        if(TG_Stage.IsConditionLimit){
            if (TG_Game.getInstance().IsTimeLimit) {
                this.ruleImg.source = "ui_battle_word_shijian_png";
            }else {
                this.ruleImg.source = "ui_battle_word_bushu_png";
            }
        }else {
            this.ruleImg.source="bg22_png";
            this.ruleImg.anchorOffsetX=this.ruleImg.width/2;
            this.ruleImg.scaleX=this.ruleImg.scaleY=.25;
            this.ruleImg.x=Main.stageWidth/2;
            this.ruleImg.y=0;
        }
        //环形进度条
        this.angle =180;
       //进度条遮罩
        this.progressSp = new egret.Shape();
        this.updateArc();
        this.maskGroup.addChild(this.progressSp);
        this.progressSp.y = -this.progressSp.height;
        this.progressSp.x = -this.progressSp.width / 2;
        this.progressSp.alpha = 0.8;
        this.scoreBgBtn.mask = this.progressSp;
        this.updateArc();
    }
    /*添加A任务目标*/
    public addATaskTarget(){
        for(let target of TG_Game.getInstance().ATaskTargets){
            let obj=TG_MapData.getInstance().mapConfigData[target.Target];
            let str=LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
            let item:GatherItem1=new GatherItem1(str,target.Num,this.ruleType,target.Target);
            let child_num=this.gatherSp.numChildren;
            //行
            let row:number=Math.floor(child_num / 2);
            //列
            let col:number=child_num % 2;
            item.x = (row) * (item.width + 15);
            item.y = (col) * (item.height + 10);
            this.gatherSp.addChild(item);
            this.taskAItemArr.push(item);
        }
    }
    /*添加A失败目标*/
    public addADefeatTask(){
        //默认不可见
        this["fail_complete_img1"].visible = false;
        this["fail_complete_img2"].visible = false;
        this["fail_group1"].visible = false;
        this["fail_group2"].visible = false;
        //获取失败条件
        this.defeatAItemArr=[];
        if(TG_Game.getInstance().ADefeatTaskTargets1.length>0){
            this.defeatAItemArr.push(TG_Game.getInstance().ADefeatTaskTargets1);
        }
        if(TG_Game.getInstance().ADefeatTaskTargets2.length>0){
            this.defeatAItemArr.push(TG_Game.getInstance().ADefeatTaskTargets2);
        }
        if( this.defeatAItemArr.length>0){
            for(let i =0;i< this.defeatAItemArr.length;i++){
                let temp= this.defeatAItemArr[i][0];
                let obj=TG_MapData.getInstance().mapConfigData[temp.Target];
                let url= LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                this["fail_group" + (i + 1)].visible = true;
                this["fail_img" + (i + 1)].source = url;
                this["fail_tex" + (i + 1)].text = temp.Cur;
                this["fail_complete_img" + (i + 1)].visible = false;//隐藏对勾
                this["fail_tex" + (i + 1)].visible = true;//显示数量
            }
        }
    }
    /*初始化A得分*/
    public AScoreTxt: eui.Label;//显示当前得分的label
    public initAScore(){
        let num=TG_Game.getInstance().AScore;
        this.AScoreTxt.text = num.toString();
    }
    /*添加B任务目标*/
    public addBTaskTarget(){
        if(!TG_Stage.SingelModel){

        }
    }
    /*添加B失败目标*/
    public addBDefeatTask(){

    }
    /*初始化B得分*/
    public initBScore(){

    }
    /*初始化星星分数数据*/
    public StarMaxScore: number;//全满多少分
    public StarScoreList: Array<number>; //三个星星分别需要的得分
    public StarStateList: Array<boolean>;//记录哪个星星已经亮了 默认都是false
    public initStarData(){
        let baseNum: number = 1500;//计算积分基数
        let scaleArr = [0.2, 0.4, 0.7];
        let step: number = 0;
        if (TG_Stage.IsTimeLimit) {//时间模式
            step = Math.ceil(TG_Stage.TimeLimitLength/ 5);
        }else{
            step = TG_Stage.Step;
        }
        this.StarMaxScore = step * (1500 * 0.7);
        this.StarScoreList = [baseNum * scaleArr[0] * step, baseNum * scaleArr[1] * step, baseNum * scaleArr[2] * step];
        this.StarStateList = [false, false, false];
        for (let i = 0; i < 3; i++) {
            let star = this["star" + i];
            if (star) {
                star.texture = RES.getRes("scoreStar1_png");
            }
        }
    }
    /*飞到A胜利目标位置*/
    public flyToA(temp){
        try{
            if(temp){
                let startX=0,startY=0,endX=0,endY=0;
                let pos=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X);
                startX=pos.x;
                startY=pos.y;
                let aItem:GatherItem1=null;
                for(let i=0;i<this.taskAItemArr.length;i++){
                    let target=this.taskAItemArr[i];
                    if(target.id==temp.BlockId){
                        aItem=target;
                        break;
                    }
                }
                if(aItem!=null){
                    let obj=TG_MapData.getInstance().mapConfigData[temp.BlockId];
                    let str=LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                    let item:egret.Bitmap=ObjectPool.pop("egret.Bitmap");
                    item.texture = RES.getRes(str);
                    item.width = TG_Item.getInstance().itemWidth;
                    item.height = item.width;
                    item.x = startX + GamePanel.getInstance().rectSp.x - item.width / 2;
                    item.y = startY + GamePanel.getInstance().rectSp.y - item.height / 2;
                    GamePanel.getInstance().addChild(item);
                    endX=this.gatherSp.x + aItem.x + aItem.btm.x + this.winGroup.x;
                    endY=this.gatherSp.y + aItem.y + aItem.btm.y + this.winGroup.y;
                    egret.Tween.get(item).to({x:endX,y:endY},500,egret.Ease.sineInOut).call(function () {
                        egret.Tween.removeTweens(item);
                        App.DisplayUtils.removeFromParent(item);
                        item.texture = null;
                        ObjectPool.push(item);
                    }.bind(this),this)
                }
            }
        }catch (e){
            Log.getInstance().trace("消除元素飞到胜利目标报错temps--->" + temp + " -->" + temp["BlockId"]);
        }
    }
    /*飞到B胜利目标位置*/
    public flyToB(temp){
        try{
            if(temp){
                let startX=0,startY=0,endX=0,endY=0;
                let pos=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X);
                startX=pos.x;
                startY=pos.y;
                let aItem:GatherItem1=null;
                for(let i=0;i<this.taskAItemArr.length;i++){
                    let target=this.taskAItemArr[i];
                    if(target.id==temp.BlockId){
                        aItem=target;
                        break;
                    }
                }
                if(aItem!=null){
                    let obj=TG_MapData.getInstance().mapConfigData[temp.BlockId];
                    let str=LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                    let item:egret.Bitmap=ObjectPool.pop("egret.Bitmap");
                    item.texture = RES.getRes(str);
                    item.width = TG_Item.getInstance().itemWidth;
                    item.height = item.width;
                    item.x = startX + GamePanel.getInstance().rectSp.x - item.width / 2;
                    item.y = startY + GamePanel.getInstance().rectSp.y - item.height / 2;
                    GamePanel.getInstance().addChild(item);
                    endX=this.roleBSp.x;
                    endY =this.roleBSp.y+200;
                    egret.Tween.get(item).to({x:endX,y:endY},500,egret.Ease.sineInOut).call(function () {
                        egret.Tween.removeTweens(item);
                        App.DisplayUtils.removeFromParent(item);
                        item.texture = null;
                        ObjectPool.push(item);
                    }.bind(this),this)
                }
            }
        }catch (e){
            Log.getInstance().trace("消除元素飞到胜利目标报错temps--->" + temp + " -->" + temp["BlockId"]);
        }
    }
    /*刷新胜利目标视图*/
    public refreshVictoryTask(type:number=1,item){
        if(type==GameStatus.GS_ARound){
            for(let i=0;i<this.taskAItemArr.length;i++){
                let target=this.taskAItemArr[i];
                if(target.id==item.Target){
                    target.updateRectNum(item.Cur);
                    break;
                }
            }
        }else if(type==GameStatus.GS_BRound){

        }
    }
    /*刷新失败目标视图*/
    public refreshDefeatTask(type:number=1,item){
        if(type==GameStatus.GS_ARound){
            if(this.defeatAItemArr.length>0){
                for(let i =0;i<this.defeatAItemArr.length;i++){
                    let target=this.defeatAItemArr[i][0];
                    if(target.Target==item.Target){
                        if(item.Cur<=0){
                            this["fail_complete_img" + (i + 1)].visible = true;//显示对勾
                            this["fail_tex" + (i + 1)].visible = false;//隐藏数量
                        }else {
                            this["fail_tex" + (i + 1)].text = item.Cur+"";
                        }
                    }
                }
            }
        }else if(type==GameStatus.GS_BRound){

        }
    }
    /*时间模式下321倒计时*/
    public tex_1: egret.Bitmap;
    public begin_num: number = 3;
    //开始倒计时
    public begin_times() {
        TG_Game.SetGameState(false);
        if (TG_Game.getInstance().IsTimeLimit) {
            if (this.begin_num <= 0) {
                App.DisplayUtils.removeFromParent(this.tex_1);
                App.MessageCenter.dispatch(Msg.Event.StopTimeLimitCountdown);//执行掉落
                return;
            }
            if (!this.tex_1) {
                this.tex_1 = new egret.Bitmap();
            }
            this.tex_1.texture = RES.getRes("tex_" + this.begin_num + "_png");
            this.tex_1.y = Main.stageHeight / 2;
            this.tex_1.x = Main.stageWidth / 2;
            this.tex_1.scaleY = 3;
            this.tex_1.scaleX = 3;
            Tool.getInstance().setAnchorPoint(this.tex_1);
            LayerManager.UI_Message.addChild(this.tex_1);
            let tween = egret.Tween.get(this.tex_1);
            tween.to({"scaleY": 1, "scaleX": 1}, 500);
            tween.call(function () {
                    egret.Tween.removeTweens(this.tex_1);
                    App.TimerManager.doTimer(500, 1, this.begin_times, this);
                }, this
            );
            this.begin_num--;
        }
    }
    public progressSp: egret.Shape;
    public angle: number = 180;
    /*刷新环形分数条*/
    public updateArc() {
        if (this.angle <= 0) {
            this.angle = 0.001;
        }
        let radius = 380 / 2;
        this.progressSp.graphics.clear();
        this.progressSp.graphics.beginFill(0xff0000);
        this.progressSp.graphics.moveTo(radius, radius);
        this.progressSp.graphics.lineTo(radius * 2, radius);
        this.progressSp.graphics.drawArc(radius, radius, radius, 0, this.angle * Math.PI / 180, true);
        this.progressSp.graphics.lineTo(radius, radius);
        this.progressSp.graphics.endFill();
    }
    /*刷新步数显示
    * stepNum ：数量
    * */
    private step_text: eui.BitmapLabel;//显示步数的文本框
    public updateStepNum(stepNum=0){
        let stepTxtStr=stepNum.toString();
        //A的文本
        this.step_text.text = stepTxtStr;
    }
    /*刷新时间显示
     * Pk模式无时间模式，只有单人存在时间概念
     * timeNum：时间
     * */
    public updateTime(timeNum=0){
        //PK模式无时间概念
        let stepTxtStr=Tool.getInstance().getTimeForTime(timeNum);
        this.step_text.text = stepTxtStr;
    }
    /*刷新分数显示
    * type 0:A回合 1：B回合
    * scoreNum:分数
    * */
    public updateScore(type:number=1,scoreNum=1){
        if(type==GameStatus.GS_ARound||type==GameStatus.GS_AVictory){
            //A
            this.AScoreTxt.text = scoreNum.toString();
            this.updateStarStatus(0,scoreNum);
            let tmp = scoreNum / this.StarMaxScore * 180;
            if (tmp > 180)
                tmp = 180;
            //更新进度条
            this.angle = 180 - tmp;
            this.updateArc();
        }else if(type==GameStatus.GS_BRound||type==GameStatus.GS_BVictory){
            //B

        }
    }
    /*刷新星星状态*/
    private updateStarStatus(type,num){
        if(type==0){
            //A
            for (let i = 0; i < 3; i++) {
                if (num >= this.StarScoreList[i] && this.StarStateList[i] == false) {
                    let star = this["star" + i];
                    if (star) {
                        star.texture = RES.getRes("scoreStar0_png");
                    }
                }
            }
        }else {
            //B

        }
    }
    /*删除任务*/
    public removeTask() {
        for (let i = 0; i < this.taskAItemArr.length; i++) {
            let item: GatherItem1 = this.taskAItemArr[i];
            App.DisplayUtils.removeFromParent(item);
        }
        this.taskAItemArr = [];
        for (let i = 0; i < this.taskBItemArr.length; i++) {
            let item: GatherItem1 = this.taskBItemArr[i];
            App.DisplayUtils.removeFromParent(item);
        }
        this.taskBItemArr = [];
    }

    //适配
    private resize() {

    }
}




/**
 *  收集items
 */
class GatherItem1 extends egret.Sprite {
    public num_tex: egret.TextField;
    public ruleType: number;
    public num: number;
    public id: number;
    public btm: egret.Bitmap;
    /**
     *
     * @param textureName 图片文理
     * @param num 收集个数
     * @param ruleType 游戏规则 0:消除 1:收集
     */
    public constructor(textureName: string, _num: number, _ruleType: number, _id) {
        super();
        this.ruleType = _ruleType;
        if (this.ruleType == 1)
            this.num = 0;
        else
            this.num = _num;

        this.id = _id;

        this.btm = TG_Object.Create(textureName);
        this.btm.width = 70;
        this.btm.height = 70;
        this.addChild(this.btm);
        this.num_tex = new egret.TextField();
        this.num_tex.textAlign = "center";
        this.num_tex.size = 33;
        this.num_tex.textColor = 0xffffff;
        this.num_tex.width = 70;
        this.num_tex.strokeColor = 0x000000;
        this.num_tex.stroke = 2;
        this.num_tex.text = "" + this.num;
        this.num_tex.height = this.num_tex.textHeight;
        this.num_tex.x = this.btm.x + this.btm.width / 2 - this.num_tex.width / 2;
        this.num_tex.y = this.btm.y + this.btm.height - this.num_tex.height;
        this.addChild(this.num_tex);
    }
    private completeSign:egret.Bitmap;
    public updateRectNum(num: number) {
        if(this.ruleType==0){ //消除模式
            let textNum=this.num-num;
            if(textNum<=0){
                //完成
                if(!this.completeSign||this.completeSign==null){
                    this.completeSign= TG_Object.Create("duihao_png");
                    this.completeSign.x = this.btm.x + this.btm.width - this.completeSign.width / 2 - 10;
                    this.completeSign.y = this.btm.y + this.btm.height - this.completeSign.height / 2 - 10;
                    this.addChild( this.completeSign);
                    this.num_tex.text="";
                }
            }
            else {
                if(this.completeSign){
                    this.removeChild(this.completeSign);
                    this.completeSign=null;
                }
                this.num_tex.text = textNum.toString();
            }
        }
        //收集模式
        else {
            this.num_tex.text = num.toString();
        }
    }

}



