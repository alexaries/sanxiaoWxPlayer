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
 * Created by HuDe Zheng on 2018/7/30.
 */
var DetailView = (function (_super) {
    __extends(DetailView, _super);
    function DetailView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        //游戏规则 0:消除 1:收集
        _this.ruleType = 0;
        _this.m_SingelModel = false;
        _this.skinName = "begin_detailUi";
        _this.taskList1.itemRenderer = DetailItem_itemView;
        _this.taskList2.itemRenderer = DetailItem_itemView;
        _this.propList.itemRenderer = DetailItem_itemView;
        _this.failList1.itemRenderer = DetailItem_itemView;
        _this.failList2.itemRenderer = DetailItem_itemView;
        return _this;
    }
    DetailView.prototype.init = function () {
        //获取消除模式
        this.ruleType = TG_Stage.RuleType;
        var model = this.ruleType == 0 ? "消除目标" : "收集目标"; //游戏模式
        //设置关卡介绍
        this.SetIntroduce();
        //单人模式
        if (!TG_Stage.SingelModel) {
            //双人
            this.m_SingelModel = true;
        }
        this.SetRuleTaskFailure(this.m_SingelModel);
        //设置规则
        this.SetRule();
        //初始化可用道具开始
        this.SetPropLimit();
    };
    //关卡介绍
    DetailView.prototype.SetIntroduce = function () {
        this.decTex.text = TG_Stage.Dec;
        if (this.decTex.text.length == 0) {
            this.decTex.text = "作者很懒，什么都没有留下！";
        }
    };
    //游戏规则
    DetailView.prototype.SetRule = function () {
        //生成风车数量
        this.fishNum = TG_Stage.FishNum;
        this.ruleTex1.text = this.fishNum.toString();
        //是否可以生成风车
        this.canCreateFish = TG_Stage.CanCreateFish;
        this.ruleTex2.text = this.canCreateFish ? "是" : "否";
        //道具是否收费
        this.ruleTex3.text = "否";
        //是否有失败限制
        this.ruleTex4.text = TG_Stage.IsConditionLimit ? "是" : "否";
    };
    //判断单人还是双人
    DetailView.prototype.SetRuleTaskFailure = function (index) {
        //单人
        //初始化消除目标&收集目标
        this.SetUserATask();
        //设置失败条件
        this.SetUserALimit();
        if (index) {
            //双人
            //初始化消除目标
            this.SetUserBTask();
            //设置失败条件
            this.SetUserBLimit();
        }
        else {
            //设置Group位置
            this.SetLimitGroupXY();
        }
    };
    DetailView.prototype.SetLimitGroupXY = function () {
        this.failureLimit.y -= this.limitUser2.y / 2;
        this.propPaihang.y -= this.limitUser2.y / 2;
    };
    //设置玩家1任务
    DetailView.prototype.SetUserATask = function () {
        this.userTarget1.visible = true;
        this.userTarget2.visible = false;
        if (TG_Stage.RuleType == 0) {
            this.taskText.text = "消除目标";
        }
        else if (TG_Stage.RuleType == 1) {
            this.taskText.text = "收集目标";
        }
        var arr = [];
        var listData3 = new eui.ArrayCollection();
        var task = this.GetUserAAllWork();
        arr = task;
        this.taskList1.dataProvider = listData3;
        listData3.source = arr;
        listData3.refresh();
    };
    //玩家2的失败条件
    DetailView.prototype.SetUserBTask = function () {
        this.userTarget2.visible = true;
        var arr = [];
        var listData4 = new eui.ArrayCollection();
        var task = this.GetUserBAllWork();
        arr = task;
        this.taskList2.dataProvider = listData4;
        listData4.source = arr;
        listData4.refresh();
    };
    //获取玩家1消除目标
    DetailView.prototype.GetUserAAllWork = function () {
        var targets1 = TG_Stage.Targets1;
        var listData1 = this.GetListSp(targets1, 0);
        return listData1;
    };
    //获取玩家2消除目标
    DetailView.prototype.GetUserBAllWork = function () {
        var targets2 = TG_Stage.Targets2;
        var listData2 = this.GetListSp(targets2, 0);
        return listData2;
    };
    //获取可用道具
    DetailView.prototype.SetPropLimit = function () {
        var prop = TG_Stage.Items;
        var img = ConfigGameData.getInstance().PropImage;
        var prop_data = [];
        for (var i = 0; i < prop.length; i++) {
            var obj = prop[i];
            var url = img[obj.id.toString()];
            var num = parseInt(obj.num);
            prop_data.push({ "url": url, "num": num });
        }
        var listData_prop = new eui.ArrayCollection();
        this.propList.dataProvider = listData_prop;
        listData_prop.source = prop_data;
        listData_prop.refresh();
    };
    //获取玩家1的限制条件
    DetailView.prototype.SetUserALimit = function () {
        this.failTex1.text = "";
        this.limitUser1.visible = true;
        this.limitUser2.visible = false;
        var arr = [];
        var listData1 = new eui.ArrayCollection();
        this.failList1.dataProvider = listData1;
        listData1.source = [];
        listData1.refresh();
        //是否有条件限制
        if (!TG_Stage.IsConditionLimit) {
            return;
        }
        if (TG_Stage.IsTimeLimit) {
            var time = Tool.getInstance().getTimeForTime(TG_Stage.TimeLimitLength);
            //限时
            this.failTex1.text = "时间:" + time;
        }
        else if (TG_Stage.IsStepLimit) {
            //步数
            this.failTex1.text = "步数:" + TG_Stage.Step;
        }
        var fail = this.GetUserAAllFail(); //获取失败条件
        //刷新失败条件列表
        arr = fail;
        listData1.source = arr;
        listData1.refresh();
    };
    //获取玩家2的限制条件
    DetailView.prototype.SetUserBLimit = function () {
        this.failTex2.text = "";
        this.limitUser2.visible = true;
        var arr = [];
        var listData2 = new eui.ArrayCollection();
        this.failList2.dataProvider = listData2;
        listData2.source = [];
        listData2.refresh();
        //是否有条件限制
        if (!TG_Stage.IsConditionLimit) {
            return;
        }
        if (TG_Stage.IsTimeLimit) {
            var time = Tool.getInstance().getTimeForTime(TG_Stage.TimeLimitLength);
            //限时
            this.failTex2.text = "时间:" + time;
        }
        else if (TG_Stage.IsStepLimit) {
            //步数
            this.failTex2.text = "步数:" + TG_Stage.Step;
        }
        var fail = this.GetUserBAllFail();
        arr = fail;
        listData2.source = arr;
        listData2.refresh();
    };
    //获取玩家1失败条件
    DetailView.prototype.GetUserAAllFail = function () {
        var arr1 = [];
        if (TG_Stage.IsElementLimit1) {
            var targets1 = TG_Stage.ALimitTargets1;
            var listData1 = this.GetListSp(targets1);
            if (listData1.length > 0) {
                for (var i = 0; i < listData1.length; i++) {
                    arr1.push(listData1[i]);
                }
            }
        }
        if (TG_Stage.IsElementLimit2) {
            var targets1 = TG_Stage.ALimitTargets2;
            var listData1 = this.GetListSp(targets1);
            if (listData1.length > 0) {
                for (var i = 0; i < listData1.length; i++) {
                    arr1.push(listData1[i]);
                }
            }
        }
        return arr1;
    };
    //获取玩家2失败条件
    DetailView.prototype.GetUserBAllFail = function () {
        var arr2 = [];
        if (TG_Stage.IsElementLimit1) {
            var targets2 = TG_Stage.BLimitTargets1;
            var listData2 = this.GetListSp(targets2);
            if (listData2.length > 0) {
                for (var i = 0; i < listData2.length; i++) {
                    arr2.push(listData2[i]);
                }
            }
        }
        if (TG_Stage.IsElementLimit2) {
            var targets2 = TG_Stage.ALimitTargets2;
            var listData2 = this.GetListSp(targets2);
            if (listData2.length > 0) {
                for (var i = 0; i < listData2.length; i++) {
                    arr2.push(listData2[i]);
                }
            }
        }
        return arr2;
    };
    //获取一条任务目标
    DetailView.prototype.GetListSp = function (itemArr, type) {
        if (type === void 0) { type = 1; }
        var arr = [];
        for (var i = 0; i < itemArr.length; i++) {
            var obj11 = TG_MapData.getInstance().mapConfigData[itemArr[i]["Target"]];
            var url = LoadNetworkImageUtils.getResNameByLayerId(obj11.layerid);
            var num = 0;
            if (type == 1) {
                num = itemArr[i]["Cur"];
            }
            else {
                num = itemArr[i]["Num"];
            }
            arr.push({ "url": url, "num": num });
        }
        return arr;
    };
    return DetailView;
}(BaseEuiView));
__reflect(DetailView.prototype, "DetailView");
//# sourceMappingURL=DetailView.js.map