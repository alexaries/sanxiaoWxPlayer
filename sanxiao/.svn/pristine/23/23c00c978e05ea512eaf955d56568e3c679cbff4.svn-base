/**
 * Created by ZhangHui on 2018/8/22.
 * 棋盘提示的倒计时
 */
class  TG_HintFunction extends BaseClassSprite{
    public initHintFunction(){
        //监听启动棋盘提示
        App.MessageCenter.addListener(Msg.Event.StartHintFunction,this.StartHintFunction,this);
        //监听停止棋盘提示
        App.MessageCenter.addListener(Msg.Event.StopHintFunction,this.stop,this);
        //监听AI棋盘移动
        App.MessageCenter.addListener(Msg.Event.AIMoveFunction,this.AIMoveFunction,this);
        //监听单回合切换20s倒计时
        App.MessageCenter.addListener(Msg.Event.RoundTime,this.changeRound,this);
        //监听停止单回合切换倒计时
        App.MessageCenter.addListener(Msg.Event.StopRoundTime,this.stopRoundTime,this);
    }
    private StartHintFunction(){
        this.stop();
        // Log.getInstance().trace("===================启动棋盘提示倒计时=====================");
        this.timeNum=5;
        App.TimerManager.doTimer(1000,5,this.updateTime,this);
    }
    private AIMoveFunction(){
        this.stop();
        // Log.getInstance().trace("===================启动AI行动提示倒计时=====================");
        let random=Math.floor(Math.random()*5+2);
        this.timeNum=random;
        App.TimerManager.doTimer(1000,random,this.updateTime,this);
    }
    private timeNum=5;
    private updateTime(){
        this.timeNum-=1;
        if(this.timeNum<=0){
            this.stop();
            //调用棋盘提示Ai执行操作接口
            TG_Game.getInstance().doAiExchange();
        }
    }
    //停止
    public stop(){
        // Log.getInstance().trace("===================停止棋盘提示倒计时=====================");
        App.TimerManager.remove(this.updateTime,this);
    }
    //切换回合
    private roundTimeNum=20;
    public changeRound(){
        this.stopRoundTime();
        // Log.getInstance().trace("===================启动切换回合倒计时=====================");
        this.roundTimeNum=20;
        App.TimerManager.doTimer(1000,this.roundTimeNum,this.updateTime1,this)
    }
    public updateTime1(){
        this.roundTimeNum-=1;
        if(this.roundTimeNum<=5){
            GamePanel.getInstance().updateRoundTxt(this.roundTimeNum);
        }
        if(this.roundTimeNum<=0){
            this.stopRoundTime();
            //减少步数
            TG_Game.getInstance().ReduceStep();
            //切换回合
            TG_Game.getInstance().doChangePlayer();
        }
    }
    public stopRoundTime(){
        // Log.getInstance().trace("===================停止切换回合倒计时=====================");
        App.TimerManager.remove(this.updateTime1,this);
        GamePanel.getInstance().hideUpdateRoundTxt();
    }
    /*PK模式 Ai小手移动动画*/
    public AIHandMove(first,second){
        GamePanel.getInstance().AIHandMove(first,second);
    }

    /*停止动画表现*/
    public removeItemMove(){
        for(let temp of this.ABlist){
            egret.Tween.removeTweens(temp);
            temp.x=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X).x;
            temp.y=temp.getPosByRowCol(temp.SitePos.Y,temp.SitePos.X).y;
        }
        for(let temp of this.AiMoveList){
            let item=TG_Game.getInstance().GetItemByIndex(temp);
            egret.Tween.removeTweens(item);
            item.x=item.getPosByRowCol(item.SitePos.Y,item.SitePos.X).x;
            item.y=item.getPosByRowCol(item.SitePos.Y,item.SitePos.X).y;
            item.scaleX=item.scaleY=1;
            item.rotation=0;
        }
    }
    /*棋盘提示的晃动动画*/
    public AiMoveList=[];//原位置晃动的元素集合
    public ABlist=[];
    public AIItemMove(first,second){
        this.removeItemMove();
        this.AiMoveList=[];
        this.ABlist=[];
        let firstItem=TG_Game.getInstance().GetItemByIndex(first);
        let secondItem=TG_Game.getInstance().GetItemByIndex(second);
        let firstItemMarkedCache=firstItem.MarkedCache;
        let secondItemMarkedCache=secondItem.MarkedCache;
        this.ABlist.push(firstItem);
        this.ABlist.push(secondItem);
        Log.getInstance().trace("======================AI提示firstItem================================");
        Log.getInstance().trace(firstItem.SitePos,0);
        Log.getInstance().trace(firstItemMarkedCache,0);
        Log.getInstance().trace("======================AI提示secondItem================================");
        Log.getInstance().trace(secondItem.SitePos,0);
        Log.getInstance().trace(secondItemMarkedCache,0);
        //firstItem
        let diction=this.getDiction(first,second);
        if(diction!=-1){
            firstItem.AiMoveDiction=diction;
        }
        if(firstItemMarkedCache.length>0){//能够移动
            //chche中删除secondItem index
            App.ArrayManager.removeItem(second,firstItemMarkedCache);
            for(let i=0;i<firstItemMarkedCache.length;i++){
                this.AiMoveList.push(firstItemMarkedCache[i]);
            }
        }
        //secondItem
         diction=this.getDiction(second,first);
        if(diction!=-1){
            secondItem.AiMoveDiction=diction;
        }
        if(secondItemMarkedCache.length>0){//能够移动
            //chche中删除fitstItem index
            App.ArrayManager.removeItem(first,secondItemMarkedCache);
            for(let i=0;i<secondItemMarkedCache.length;i++){
                this.AiMoveList.push(secondItemMarkedCache[i]);
            }
        }
        //先排序后去重
        App.ArrayManager.ArrayUp(this.AiMoveList);
        this.AiMoveList=App.ArrayManager.distinct(this.AiMoveList);
        //firstItem 和 secondItem 动画
        this.playTips(firstItem);
        this.playTips(secondItem);
        //其他 动画
        this.playTips1();
    }
    /*firstItem 和 secondItem 动画*/
    public playTips(item){
        let diction=item.AiMoveDiction;
        let tw = egret.Tween.get(item,{loop:true});
        let vx=item.x;
        let vy=item.y;
        if(diction==0){
            //上
            tw.to({y: vy - 10}, 300);
            tw.to({y: vy-5}, 300);
            tw.to({y: vy - 10}, 150);
            tw.to({y: vy}, 300);
        }else if (diction==1){
            tw.to({y: vy + 10}, 300);
            tw.to({y: vy-5}, 300);
            tw.to({y: vy + 10}, 150);
            tw.to({y: vy}, 300);
        }
        else if (diction==2){
            tw.to({x: vx - 10}, 300);
            tw.to({x: vx-5}, 300);
            tw.to({x: vx - 10}, 150);
            tw.to({x:vx}, 300);
        }
        else if (diction==3){
            tw.to({x: vx + 10}, 300);
            tw.to({x: vx-5}, 300);
            tw.to({x: vx + 10}, 150);
            tw.to({x:vx}, 300);
        }
        tw.wait(100);
    }
    /*原位置晃动的元素 动画*/
    public playTips1(){
        for(let temp of this.AiMoveList){
            let item=TG_Game.getInstance().GetItemByIndex(temp);
            let tw = egret.Tween.get(item,{loop:true});
            tw.to({scaleX:1.05,scaleY:1.05,rotation:-5 }, 300);
            tw.to({scaleX:1,scaleY:1 ,rotation:0}, 150);
            tw.to({scaleX:1.05,scaleY:1.05 ,rotation:5}, 300);
            tw.to({scaleX:1,scaleY:1 ,rotation:0}, 150);
            tw.wait(100);
        }
    }
    /*获取晃动方向*/
    public getDiction(first,second){
        let diction=-1;//0上 1下 2左 3右
        let num=first-second;
        if (num==9){
            diction=0;
        }else if(num==-9){
            diction=1;
        }else if(num==1){
            diction=2;
        }else if (num==-1){
            diction=3;
        }
        return diction;
    }




}
