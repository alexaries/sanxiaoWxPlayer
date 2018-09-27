/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class DetailView extends BaseEuiView
{
    //游戏规则 0:消除 1:收集
    public ruleType:number = 0;
    //是否生成风车
    public canCreateFish:boolean;
    //风车的数量
    public fishNum:number;
    //消除目标&收集目标
    public taskText:eui.Label;

    public userTarget1:eui.Group;
    public userTarget2:eui.Group;
    public taskList1:eui.List;//玩家1消除目标list
    public taskList2:eui.List;//玩家2消除目标list

    public prop:eui.Group;
    public propList:eui.List;//可用道具list

    public limitUser1:eui.Group;
    public failList1:eui.List;//玩家1失败条件list
    public limitUser2:eui.Group;
    public failList2:eui.List;//玩家2失败条件list

    // public ruleTex:eui.Label;//显示消除模式的标签

    public ruleTex1:eui.Label;//生成风车数量
    public ruleTex2:eui.Label;//是否可以生成风车
    public ruleTex3:eui.Label;//道具是否收费
    public ruleTex4:eui.Label;//是否有失败限制

    public failTex1:eui.Label;//玩家1失败限制文本显示框
    public failTex2:eui.Label;//玩家2失败限制文本显示框

    public decTex:eui.Label;//关卡介绍
    public rankViewId:RankView;// 排行榜

    public m_SingelModel:boolean = false;

    //单人模式统一移动的group
    public failureLimit:eui.Group;
    public propPaihang:eui.Group;

    public constructor(controller: BaseController, parent: eui.Group)
    {
        super(controller, parent);
        this.skinName = "begin_detailUi";
        this.taskList1.itemRenderer = DetailItem_itemView;
        this.taskList2.itemRenderer = DetailItem_itemView;
        this.propList.itemRenderer = DetailItem_itemView;
        this.failList1.itemRenderer = DetailItem_itemView;
        this.failList2.itemRenderer = DetailItem_itemView;
    }
    public init()
    {
        //获取消除模式
        this.ruleType = TG_Stage.RuleType;
        let model:string = this.ruleType==0?"消除目标":"收集目标" //游戏模式
        //设置关卡介绍
        this.SetIntroduce();
        //单人模式
        if(!TG_Stage.SingelModel){
            //双人
           this.m_SingelModel = true;
        }
        this.SetRuleTaskFailure(this.m_SingelModel);
        //设置规则
        this.SetRule();
        //初始化可用道具开始
        this.SetPropLimit();
    }
    //关卡介绍
    public SetIntroduce(){
        this.decTex.text = TG_Stage.Dec;
        if(this.decTex.text.length == 0)
        {
            this.decTex.text = "作者很懒，什么都没有留下！";
        }
    }
    //游戏规则
    public SetRule(){
        //生成风车数量
        this.fishNum = TG_Stage.FishNum;
        this.ruleTex1.text = this.fishNum.toString();
         //是否可以生成风车
        this.canCreateFish = TG_Stage.CanCreateFish;
        this.ruleTex2.text = this.canCreateFish?"是":"否";
        //道具是否收费
        this.ruleTex3.text = "否";
        //是否有失败限制
        this.ruleTex4.text = TG_Stage.IsConditionLimit?"是":"否";
    }
    //判断单人还是双人
    public SetRuleTaskFailure(index){
        //单人
        //初始化消除目标&收集目标
        this.SetUserATask();
        //设置失败条件
        this.SetUserALimit();
        if(index){
            //双人
            //初始化消除目标
            this.SetUserBTask();
            //设置失败条件
            this.SetUserBLimit();

        }else{
            //设置Group位置
            this.SetLimitGroupXY();
        }
    }
    public SetLimitGroupXY(){
        this.failureLimit.y -= this.limitUser2.y/2;
        this.propPaihang.y -= this.limitUser2.y/2;
    }

    //设置玩家1任务
    public SetUserATask(){
        this.userTarget1.visible = true;
        this.userTarget2.visible = false;

        if(TG_Stage.RuleType == 0){
            this.taskText.text = "消除目标";
        }else if(TG_Stage.RuleType == 1){
            this.taskText.text = "收集目标";
        }
        let arr = [];
        let listData3:eui.ArrayCollection = new eui.ArrayCollection();
        let task  = this.GetUserAAllWork();
        arr = task;
        this.taskList1.dataProvider = listData3;
        listData3.source = arr;
        listData3.refresh();
    }
    //玩家2的失败条件
    public SetUserBTask(){
        this.userTarget2.visible = true;
        let arr = [];
        let listData4:eui.ArrayCollection = new eui.ArrayCollection();
        let task  = this.GetUserBAllWork();
        arr = task;
        this.taskList2.dataProvider = listData4;
        listData4.source = arr;
        listData4.refresh();
    }
    //获取玩家1消除目标
     public GetUserAAllWork(){
        let targets1 = TG_Stage.Targets1;
        let listData1 = this.GetListSp(targets1,0);
        return listData1;
    }
    //获取玩家2消除目标
    public GetUserBAllWork(){
        let targets2 = TG_Stage.Targets2;
        let listData2 = this.GetListSp(targets2,0);
        return listData2;
    }
    //获取可用道具
    public SetPropLimit(){
        let prop = TG_Stage.Items;
        let img:object  = ConfigGameData.getInstance().PropImage;
        let prop_data = [];

        for (let i =0;i < prop.length;i++)
        {
            let obj:any = prop[i];
            let url:any = img[obj.id.toString()];
            let num = parseInt(obj.num);
            prop_data.push({"url":url,"num":num});
        }
        let listData_prop:eui.ArrayCollection = new eui.ArrayCollection();
        this.propList.dataProvider = listData_prop;
        listData_prop.source = prop_data;
        listData_prop.refresh();
    }
    //获取玩家1的限制条件
    public SetUserALimit(){
        this.failTex1.text = "";
        this.limitUser1.visible = true;
        this.limitUser2.visible = false;
        let arr = [];
        let listData1:eui.ArrayCollection = new eui.ArrayCollection();
        this.failList1.dataProvider = listData1;
        listData1.source = [];
        listData1.refresh();
        //是否有条件限制
        if(!TG_Stage.IsConditionLimit)
        {
            return;
        }
        if(TG_Stage.IsTimeLimit)//是否有时间限制
        {
            let time:string = Tool.getInstance().getTimeForTime(TG_Stage.TimeLimitLength);
            //限时
            this.failTex1.text = "时间:" + time;
        }
        else if(TG_Stage.IsStepLimit)//是否有回合限制
        {
            //步数
            this.failTex1.text = "步数:" + TG_Stage.Step
        }
        let fail = this.GetUserAAllFail();//获取失败条件
        //刷新失败条件列表
        arr = fail;
        listData1.source = arr;
        listData1.refresh();

    }
    //获取玩家2的限制条件
    public SetUserBLimit(){
        this.failTex2.text = "";
        this.limitUser2.visible = true;
        let arr = [];
        let listData2:eui.ArrayCollection = new eui.ArrayCollection();
        this.failList2.dataProvider = listData2;
        listData2.source = [];
        listData2.refresh();
         //是否有条件限制
        if(!TG_Stage.IsConditionLimit)
        {
            return;
        }
        if(TG_Stage.IsTimeLimit)//是否有时间限制
        {
            let time:string = Tool.getInstance().getTimeForTime(TG_Stage.TimeLimitLength);
            //限时
            this.failTex2.text = "时间:" + time;
        }
        else if(TG_Stage.IsStepLimit)//是否有回合限制
        {
            //步数
            this.failTex2.text = "步数:" + TG_Stage.Step
        }
        let fail = this.GetUserBAllFail();
        arr = fail;
        listData2.source = arr;
        listData2.refresh();
    }
    //获取玩家1失败条件
    public GetUserAAllFail(){
        let arr1 = [];
        if(TG_Stage.IsElementLimit1)//是否限制1
        {
            let targets1 = TG_Stage.ALimitTargets1;
            let listData1 = this.GetListSp(targets1);
            if(listData1.length > 0)
            {
                for(let i = 0;i < listData1.length;i++)
                {
                    arr1.push(listData1[i]);
                }
            }
        }
        if(TG_Stage.IsElementLimit2)//是否限制2
        {
            let targets1 = TG_Stage.ALimitTargets2;
            let listData1 = this.GetListSp(targets1);
            if(listData1.length > 0)
            {
                for(let i = 0;i < listData1.length;i++)
                {
                    arr1.push(listData1[i]);
                }
            }
        }
        return arr1;
    }
    //获取玩家2失败条件
    public GetUserBAllFail(){
        let arr2 = [];
        if(TG_Stage.IsElementLimit1)//是否限制1
        {
            let targets2 = TG_Stage.BLimitTargets1;
            let listData2 = this.GetListSp(targets2);
            if(listData2.length > 0)
            {
                for(let i = 0;i < listData2.length;i++)
                {
                    arr2.push(listData2[i]);
                }
            }
        }
        if(TG_Stage.IsElementLimit2)//是否限制2
        {
            let targets2 = TG_Stage.ALimitTargets2;
            let listData2 = this.GetListSp(targets2);
            if(listData2.length > 0)
            {
                for(let i = 0;i < listData2.length;i++)
                {
                    arr2.push(listData2[i]);
                }
            }
        }
        return arr2;
    }
    //获取一条任务目标
    public GetListSp(itemArr:Array<any>,type = 1):any
    {
        let arr = [];
        for(let i = 0;i < itemArr.length;i++)
        {
            let obj11=TG_MapData.getInstance().mapConfigData[itemArr[i]["Target"]];
            let url = LoadNetworkImageUtils.getResNameByLayerId(obj11.layerid);

            let num = 0;
            if(type == 1)
            {
                num = itemArr[i]["Cur"];
            }
            else{
                num = itemArr[i]["Num"];
            }
            arr.push({"url":url,"num":num});
        }
        return arr;
    }

}
