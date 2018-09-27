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
var tr = egret.sys.tr;
/**游戏Title显示类
 * Created by HuDe Zheng on 2018/8/07.
 */
var GameTitleView = (function (_super) {
    __extends(GameTitleView, _super);
    function GameTitleView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.taskAItemArr = []; //A任务目标容器
        _this.taskBItemArr = []; //B任务目标容器
        _this.defeatAItemArr = []; //A失败任务目标
        _this.defeatBItemArr = []; //B失败任务目标
        _this.thisheight = 0;
        _this.begin_num = 3;
        _this.angle = 180;
        _this.skinName = "game_titleUI";
        //初始化游戏形象
        _this.initRoles();
        if (_this.thisheight == 0)
            _this.thisheight = _this.height;
        return _this;
    }
    //开启面板 刷新数据
    GameTitleView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this.initTitleData();
        this.addEvent();
        if (this.thisheight == 0)
            this.thisheight = this.height;
    };
    //关闭面板
    GameTitleView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.close.call(this, param);
        this.removeEvent();
        this.removeTask();
    };
    /*添加事件监听*/
    GameTitleView.prototype.addEvent = function () {
        App.MessageCenter.addListener(Msg.Event.GameResize, this.resize, this);
    };
    /*移除事件监听*/
    GameTitleView.prototype.removeEvent = function () {
        App.MessageCenter.removeListener(Msg.Event.GameResize, this.resize, this);
    };
    /*初始化游戏形象*/
    GameTitleView.prototype.initRoles = function () {
        this.avatar = 1; //初始化人物性别
        this.roleArr = [10101, 10102, 0, 0, 10201, 0, 10202, 0, 0, 0]; //初始化任务模型信息
        this.roleSp = TG_Role_Model.createModel(this.avatar, this.roleArr, 0.42);
        this.addChild(this.roleSp);
        this.roleSp.play();
        this.roleSp.y = 80;
        if (!TG_Stage.SingelModel) {
            //Pk模式
            this.avatarB = 2;
            this.roleArr = [20101, 20102, 0, 0, 20201, 0, 20202, 0, 0, 0]; //初始化任务模型信息
            this.roleBSp = TG_Role_Model.createModel(this.avatarB, this.roleArr, 0.42);
            this.addChild(this.roleBSp);
            this.roleBSp.play();
            this.roleBSp.x = Main.stageWidth - 360;
            this.roleBSp.y = 80;
        }
    };
    //第二次打开面板的时候需要初始化面板数据
    GameTitleView.prototype.initTitleData = function () {
        //0:消除 1:收集
        this.ruleType = TG_Stage.RuleType;
        if (this.gatherSp && this.shenglimubiao) {
            this.gatherSp.removeChildren();
            this.shenglimubiao.removeChild(this.gatherSp);
            this.gatherSp = null;
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
        this.begin_num = 3; //倒计时时长
        //初始化星星积分数据
        this.initStarData();
        //初始化A得分
        this.initAScore();
        //初始化B得分
        this.initBScore();
        //初始化时间或者步数显示
        if (TG_Stage.IsConditionLimit) {
            if (TG_Game.getInstance().IsTimeLimit) {
                var timeNum = TG_Stage.TimeLimitLength;
                this.updateTime(timeNum);
            }
            else {
                var stepNum = TG_Game.getInstance().AStepNum;
                this.updateStepNum(stepNum);
            }
        }
        else {
            this.step_text.visible = false;
        }
        //显示步数还是时间
        if (TG_Stage.IsConditionLimit) {
            if (TG_Game.getInstance().IsTimeLimit) {
                this.ruleImg.source = "ui_battle_word_shijian_png";
            }
            else {
                this.ruleImg.source = "ui_battle_word_bushu_png";
            }
        }
        else {
            this.ruleImg.source = "bg22_png";
            this.ruleImg.anchorOffsetX = this.ruleImg.width / 2;
            this.ruleImg.scaleX = this.ruleImg.scaleY = .25;
            this.ruleImg.x = Main.stageWidth / 2;
            this.ruleImg.y = 0;
        }
        //环形进度条
        this.angle = 180;
        //进度条遮罩
        this.progressSp = new egret.Shape();
        this.updateArc();
        this.maskGroup.addChild(this.progressSp);
        this.progressSp.y = -this.progressSp.height;
        this.progressSp.x = -this.progressSp.width / 2;
        this.progressSp.alpha = 0.8;
        this.scoreBgBtn.mask = this.progressSp;
        this.updateArc();
    };
    /*添加A任务目标*/
    GameTitleView.prototype.addATaskTarget = function () {
        for (var _i = 0, _a = TG_Game.getInstance().ATaskTargets; _i < _a.length; _i++) {
            var target = _a[_i];
            var obj = TG_MapData.getInstance().mapConfigData[target.Target];
            var str = LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
            var item = new GatherItem1(str, target.Num, this.ruleType, target.Target);
            var child_num = this.gatherSp.numChildren;
            //行
            var row = Math.floor(child_num / 2);
            //列
            var col = child_num % 2;
            item.x = (row) * (item.width + 15);
            item.y = (col) * (item.height + 10);
            this.gatherSp.addChild(item);
            this.taskAItemArr.push(item);
        }
    };
    /*添加A失败目标*/
    GameTitleView.prototype.addADefeatTask = function () {
        //默认不可见
        this["fail_complete_img1"].visible = false;
        this["fail_complete_img2"].visible = false;
        this["fail_group1"].visible = false;
        this["fail_group2"].visible = false;
        //获取失败条件
        this.defeatAItemArr = [];
        if (TG_Game.getInstance().ADefeatTaskTargets1.length > 0) {
            this.defeatAItemArr.push(TG_Game.getInstance().ADefeatTaskTargets1);
        }
        if (TG_Game.getInstance().ADefeatTaskTargets2.length > 0) {
            this.defeatAItemArr.push(TG_Game.getInstance().ADefeatTaskTargets2);
        }
        if (this.defeatAItemArr.length > 0) {
            for (var i = 0; i < this.defeatAItemArr.length; i++) {
                var temp = this.defeatAItemArr[i][0];
                var obj = TG_MapData.getInstance().mapConfigData[temp.Target];
                var url = LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                this["fail_group" + (i + 1)].visible = true;
                this["fail_img" + (i + 1)].source = url;
                this["fail_tex" + (i + 1)].text = temp.Cur;
                this["fail_complete_img" + (i + 1)].visible = false; //隐藏对勾
                this["fail_tex" + (i + 1)].visible = true; //显示数量
            }
        }
    };
    GameTitleView.prototype.initAScore = function () {
        var num = TG_Game.getInstance().AScore;
        this.AScoreTxt.text = num.toString();
    };
    /*添加B任务目标*/
    GameTitleView.prototype.addBTaskTarget = function () {
        if (!TG_Stage.SingelModel) {
        }
    };
    /*添加B失败目标*/
    GameTitleView.prototype.addBDefeatTask = function () {
    };
    /*初始化B得分*/
    GameTitleView.prototype.initBScore = function () {
    };
    GameTitleView.prototype.initStarData = function () {
        var baseNum = 1500; //计算积分基数
        var scaleArr = [0.2, 0.4, 0.7];
        var step = 0;
        if (TG_Stage.IsTimeLimit) {
            step = Math.ceil(TG_Stage.TimeLimitLength / 5);
        }
        else {
            step = TG_Stage.Step;
        }
        this.StarMaxScore = step * (1500 * 0.7);
        this.StarScoreList = [baseNum * scaleArr[0] * step, baseNum * scaleArr[1] * step, baseNum * scaleArr[2] * step];
        this.StarStateList = [false, false, false];
        for (var i = 0; i < 3; i++) {
            var star = this["star" + i];
            if (star) {
                star.texture = RES.getRes("scoreStar1_png");
            }
        }
    };
    /*飞到A胜利目标位置*/
    GameTitleView.prototype.flyToA = function (temp) {
        try {
            if (temp) {
                var startX = 0, startY = 0, endX = 0, endY = 0;
                var pos = temp.getPosByRowCol(temp.SitePos.Y, temp.SitePos.X);
                startX = pos.x;
                startY = pos.y;
                var aItem = null;
                for (var i = 0; i < this.taskAItemArr.length; i++) {
                    var target = this.taskAItemArr[i];
                    if (target.id == temp.BlockId) {
                        aItem = target;
                        break;
                    }
                }
                if (aItem != null) {
                    var obj = TG_MapData.getInstance().mapConfigData[temp.BlockId];
                    var str = LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                    var item_1 = ObjectPool.pop("egret.Bitmap");
                    item_1.texture = RES.getRes(str);
                    item_1.width = TG_Item.getInstance().itemWidth;
                    item_1.height = item_1.width;
                    item_1.x = startX + GamePanel.getInstance().rectSp.x - item_1.width / 2;
                    item_1.y = startY + GamePanel.getInstance().rectSp.y - item_1.height / 2;
                    GamePanel.getInstance().addChild(item_1);
                    endX = this.gatherSp.x + aItem.x + aItem.btm.x + this.winGroup.x;
                    endY = this.gatherSp.y + aItem.y + aItem.btm.y + this.winGroup.y;
                    egret.Tween.get(item_1).to({ x: endX, y: endY }, 500, egret.Ease.sineInOut).call(function () {
                        egret.Tween.removeTweens(item_1);
                        App.DisplayUtils.removeFromParent(item_1);
                        item_1.texture = null;
                        ObjectPool.push(item_1);
                    }.bind(this), this);
                }
            }
        }
        catch (e) {
            Log.getInstance().trace("消除元素飞到胜利目标报错temps--->" + temp + " -->" + temp["BlockId"]);
        }
    };
    /*飞到B胜利目标位置*/
    GameTitleView.prototype.flyToB = function (temp) {
        try {
            if (temp) {
                var startX = 0, startY = 0, endX = 0, endY = 0;
                var pos = temp.getPosByRowCol(temp.SitePos.Y, temp.SitePos.X);
                startX = pos.x;
                startY = pos.y;
                var aItem = null;
                for (var i = 0; i < this.taskAItemArr.length; i++) {
                    var target = this.taskAItemArr[i];
                    if (target.id == temp.BlockId) {
                        aItem = target;
                        break;
                    }
                }
                if (aItem != null) {
                    var obj = TG_MapData.getInstance().mapConfigData[temp.BlockId];
                    var str = LoadNetworkImageUtils.getResNameByLayerId(obj.layerid);
                    var item_2 = ObjectPool.pop("egret.Bitmap");
                    item_2.texture = RES.getRes(str);
                    item_2.width = TG_Item.getInstance().itemWidth;
                    item_2.height = item_2.width;
                    item_2.x = startX + GamePanel.getInstance().rectSp.x - item_2.width / 2;
                    item_2.y = startY + GamePanel.getInstance().rectSp.y - item_2.height / 2;
                    GamePanel.getInstance().addChild(item_2);
                    endX = this.roleBSp.x;
                    endY = this.roleBSp.y + 200;
                    egret.Tween.get(item_2).to({ x: endX, y: endY }, 500, egret.Ease.sineInOut).call(function () {
                        egret.Tween.removeTweens(item_2);
                        App.DisplayUtils.removeFromParent(item_2);
                        item_2.texture = null;
                        ObjectPool.push(item_2);
                    }.bind(this), this);
                }
            }
        }
        catch (e) {
            Log.getInstance().trace("消除元素飞到胜利目标报错temps--->" + temp + " -->" + temp["BlockId"]);
        }
    };
    /*刷新胜利目标视图*/
    GameTitleView.prototype.refreshVictoryTask = function (type, item) {
        if (type === void 0) { type = 1; }
        if (type == GameStatus.GS_ARound) {
            for (var i = 0; i < this.taskAItemArr.length; i++) {
                var target = this.taskAItemArr[i];
                if (target.id == item.Target) {
                    target.updateRectNum(item.Cur);
                    break;
                }
            }
        }
        else if (type == GameStatus.GS_BRound) {
        }
    };
    /*刷新失败目标视图*/
    GameTitleView.prototype.refreshDefeatTask = function (type, item) {
        if (type === void 0) { type = 1; }
        if (type == GameStatus.GS_ARound) {
            if (this.defeatAItemArr.length > 0) {
                for (var i = 0; i < this.defeatAItemArr.length; i++) {
                    var target = this.defeatAItemArr[i][0];
                    if (target.Target == item.Target) {
                        if (item.Cur <= 0) {
                            this["fail_complete_img" + (i + 1)].visible = true; //显示对勾
                            this["fail_tex" + (i + 1)].visible = false; //隐藏数量
                        }
                        else {
                            this["fail_tex" + (i + 1)].text = item.Cur + "";
                        }
                    }
                }
            }
        }
        else if (type == GameStatus.GS_BRound) {
        }
    };
    //开始倒计时
    GameTitleView.prototype.begin_times = function () {
        TG_Game.SetGameState(false);
        if (TG_Game.getInstance().IsTimeLimit) {
            if (this.begin_num <= 0) {
                App.DisplayUtils.removeFromParent(this.tex_1);
                App.MessageCenter.dispatch(Msg.Event.StopTimeLimitCountdown); //执行掉落
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
            var tween = egret.Tween.get(this.tex_1);
            tween.to({ "scaleY": 1, "scaleX": 1 }, 500);
            tween.call(function () {
                egret.Tween.removeTweens(this.tex_1);
                App.TimerManager.doTimer(500, 1, this.begin_times, this);
            }, this);
            this.begin_num--;
        }
    };
    /*刷新环形分数条*/
    GameTitleView.prototype.updateArc = function () {
        if (this.angle <= 0) {
            this.angle = 0.001;
        }
        var radius = 380 / 2;
        this.progressSp.graphics.clear();
        this.progressSp.graphics.beginFill(0xff0000);
        this.progressSp.graphics.moveTo(radius, radius);
        this.progressSp.graphics.lineTo(radius * 2, radius);
        this.progressSp.graphics.drawArc(radius, radius, radius, 0, this.angle * Math.PI / 180, true);
        this.progressSp.graphics.lineTo(radius, radius);
        this.progressSp.graphics.endFill();
    };
    GameTitleView.prototype.updateStepNum = function (stepNum) {
        if (stepNum === void 0) { stepNum = 0; }
        var stepTxtStr = stepNum.toString();
        //A的文本
        this.step_text.text = stepTxtStr;
    };
    /*刷新时间显示
     * Pk模式无时间模式，只有单人存在时间概念
     * timeNum：时间
     * */
    GameTitleView.prototype.updateTime = function (timeNum) {
        if (timeNum === void 0) { timeNum = 0; }
        //PK模式无时间概念
        var stepTxtStr = Tool.getInstance().getTimeForTime(timeNum);
        this.step_text.text = stepTxtStr;
    };
    /*刷新分数显示
    * type 0:A回合 1：B回合
    * scoreNum:分数
    * */
    GameTitleView.prototype.updateScore = function (type, scoreNum) {
        if (type === void 0) { type = 1; }
        if (scoreNum === void 0) { scoreNum = 1; }
        if (type == GameStatus.GS_ARound || type == GameStatus.GS_AVictory) {
            //A
            this.AScoreTxt.text = scoreNum.toString();
            this.updateStarStatus(0, scoreNum);
            var tmp = scoreNum / this.StarMaxScore * 180;
            if (tmp > 180)
                tmp = 180;
            //更新进度条
            this.angle = 180 - tmp;
            this.updateArc();
        }
        else if (type == GameStatus.GS_BRound || type == GameStatus.GS_BVictory) {
            //B
        }
    };
    /*刷新星星状态*/
    GameTitleView.prototype.updateStarStatus = function (type, num) {
        if (type == 0) {
            //A
            for (var i = 0; i < 3; i++) {
                if (num >= this.StarScoreList[i] && this.StarStateList[i] == false) {
                    var star = this["star" + i];
                    if (star) {
                        star.texture = RES.getRes("scoreStar0_png");
                    }
                }
            }
        }
        else {
            //B
        }
    };
    /*删除任务*/
    GameTitleView.prototype.removeTask = function () {
        for (var i = 0; i < this.taskAItemArr.length; i++) {
            var item = this.taskAItemArr[i];
            App.DisplayUtils.removeFromParent(item);
        }
        this.taskAItemArr = [];
        for (var i = 0; i < this.taskBItemArr.length; i++) {
            var item = this.taskBItemArr[i];
            App.DisplayUtils.removeFromParent(item);
        }
        this.taskBItemArr = [];
    };
    //适配
    GameTitleView.prototype.resize = function () {
    };
    return GameTitleView;
}(BaseEuiView));
__reflect(GameTitleView.prototype, "GameTitleView");
/**
 *  收集items
 */
var GatherItem1 = (function (_super) {
    __extends(GatherItem1, _super);
    /**
     *
     * @param textureName 图片文理
     * @param num 收集个数
     * @param ruleType 游戏规则 0:消除 1:收集
     */
    function GatherItem1(textureName, _num, _ruleType, _id) {
        var _this = _super.call(this) || this;
        _this.ruleType = _ruleType;
        if (_this.ruleType == 1)
            _this.num = 0;
        else
            _this.num = _num;
        _this.id = _id;
        _this.btm = TG_Object.Create(textureName);
        _this.btm.width = 70;
        _this.btm.height = 70;
        _this.addChild(_this.btm);
        _this.num_tex = new egret.TextField();
        _this.num_tex.textAlign = "center";
        _this.num_tex.size = 33;
        _this.num_tex.textColor = 0xffffff;
        _this.num_tex.width = 70;
        _this.num_tex.strokeColor = 0x000000;
        _this.num_tex.stroke = 2;
        _this.num_tex.text = "" + _this.num;
        _this.num_tex.height = _this.num_tex.textHeight;
        _this.num_tex.x = _this.btm.x + _this.btm.width / 2 - _this.num_tex.width / 2;
        _this.num_tex.y = _this.btm.y + _this.btm.height - _this.num_tex.height;
        _this.addChild(_this.num_tex);
        return _this;
    }
    GatherItem1.prototype.updateRectNum = function (num) {
        if (this.ruleType == 0) {
            var textNum = this.num - num;
            if (textNum <= 0) {
                //完成
                if (!this.completeSign || this.completeSign == null) {
                    this.completeSign = TG_Object.Create("duihao_png");
                    this.completeSign.x = this.btm.x + this.btm.width - this.completeSign.width / 2 - 10;
                    this.completeSign.y = this.btm.y + this.btm.height - this.completeSign.height / 2 - 10;
                    this.addChild(this.completeSign);
                    this.num_tex.text = "";
                }
            }
            else {
                if (this.completeSign) {
                    this.removeChild(this.completeSign);
                    this.completeSign = null;
                }
                this.num_tex.text = textNum.toString();
            }
        }
        else {
            this.num_tex.text = num.toString();
        }
    };
    return GatherItem1;
}(egret.Sprite));
__reflect(GatherItem1.prototype, "GatherItem1");
//# sourceMappingURL=GameTitleView.js.map