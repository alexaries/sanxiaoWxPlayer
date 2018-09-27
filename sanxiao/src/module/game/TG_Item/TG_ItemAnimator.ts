/**
 * Created by ZhangHui on 2018/7/11.
 * 掉落Tween动画
 */
class TG_ItemAnimator extends BaseClass{
    /*播放元素块的掉落*/
    public PlayDrop(obj,dropPaths,repeatCount:number){
        let tween=egret.Tween.get(obj);
        //掉落蹲的位移
        let DropDiffValue=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.DropDiffValue)/1000-4;
        //掉落蹲的位移时间
        let DropDiffDownTime=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.DropDiffDownTime);
        //掉落弹的位移时间
        let DropDiffUpTime=TG_TimeDefine.GetTimeDelay(TG_TimeDefine.DropDiffUpTime);
        let dropTime=50;
        // dropTime=this.CalculateTotalDropTime(dropPaths)/dropPaths.length*.6;
        dropTime=this.CalculateDropTime(dropPaths.length)/dropPaths.length*.4;
        //第一个点位是否需要延迟时间执行
        for(let i=0;i<dropPaths.length;i++){
            let vx=dropPaths[i].x,vy=dropPaths[i].y;
            let delayTime=0;
            if(dropPaths[repeatCount]["needDelayTime"]!=undefined&&dropPaths[repeatCount]["needDelayTime"]==true){
                delayTime=dropPaths[repeatCount]["delayTime"];
            }
            if(i==repeatCount){
                tween.wait(delayTime).to({x:vx,y:vy},dropTime);
            }else {
                if(Number(i)==dropPaths.length-1){
                    tween.to({x:vx,y:vy-DropDiffValue},dropTime,egret.Ease.quadIn)
                        .to({y:vy},DropDiffUpTime,egret.Ease.quadOut)
                }else {
                    tween.to({x:vx,y:vy},dropTime);
                }
            }
        }
        tween.call(this.PlayDropOver.bind(this,tween));
    }
    /*掉落结束*/
    private PlayDropOver(tween){
        egret.Tween.removeTweens(tween);
        // let pos=tween._target.SitePos;
        // let obj=TG_Game.getInstance().downGroupsLastPoint;
        // if(obj!=null){
        //     if(pos.X==obj.X&&pos.Y==obj.Y){
        //         console.log(obj)
        //         //掉落完毕
        //         TG_Game.getInstance().onDropBack();
        //     }
        // }else {
        //     console.log("============================1");
        //     console.log(pos);
        //     console.log(obj)
        //     //掉落完毕
        //     TG_Game.getInstance().onDropBack();
        // }
    }
    //计算掉落时间
    public CalculateDropTime(dropCount){
        let dropTime = Math.sqrt(2 * dropCount * 110 /(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.FreeFallAcceleration)/1000));
        return dropTime*1000;
    }
    //计算每个方块中有多少个与第一个点相同重复点(用来计算等待时间)
    public CalculateDropDelayNum(item){
        let dropCount = item.DropPaths.length;
        let oriPos =  item.DropPaths[0];
        let repeatCount = 0;
        if(dropCount>1){
            for(let i=1;i<dropCount;i++){
                if(item.DropPaths[i].X==oriPos.X && item.DropPaths[i].Y==oriPos.Y){
                    repeatCount+=1;
                }
            }
        }
        return repeatCount;
    }

    //计算整体掉落时长
    public CalculateTotalDropTime(item){
        let dropCount = item.DropPaths.length;
        let oriPos =  item.DropPaths[0];
        let repeatCount = 0;
        if(dropCount>1){
            for(let i=1;i<dropCount;i++){
                if(item.DropPaths[i]==oriPos){
                    repeatCount+=1;
                }
            }
        }
        let waitTime =0;
        if(repeatCount>0){
             waitTime =this.CalculateDropTime(repeatCount)/repeatCount*.4;
        }
        let dropTime =this. CalculateDropTime(dropCount - repeatCount)/(dropCount - repeatCount)*.4;
        return waitTime+dropTime;
    }
}