/**
 * Created by ZhangHui on 2018/9/7.
 * 任务目标
 */
class TG_TaskTarget{
    public Num=0;
    public Target=0;
    public Cur=0;
    /*增加*/
    public DoIncreaseTarget(){
        let Num=this.Num;
        let Cur=this.Cur;
        if (Num < 0)  {
            // 无限模式
            Cur += 1;
        }else {
            Cur=Math.min(Num,++Cur);
        }
        this.Cur=Cur;
    }
    /*减少*/
    public DoReduceTarget(){
        let Cur=this.Cur;
        Cur=Math.max(0,--Cur);
        this.Cur =Cur;
    }
}