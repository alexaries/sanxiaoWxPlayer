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
 * Created by HuDe Zheng on 2018/7/3.
 */
var GamePanel_BeforeStart2 = (function (_super) {
    __extends(GamePanel_BeforeStart2, _super);
    function GamePanel_BeforeStart2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //游戏规则 0:消除 1:收集
        _this.ruleType = 0;
        return _this;
    }
    GamePanel_BeforeStart2.prototype.init = function () {
        var _this = this;
        while (this.numChildren) {
            App.DisplayUtils.removeFromParent(this.getChildAt(0));
        }
        //获取消除模式
        this.ruleType = TG_MapData.getInstance().stageData.Stage.RuleType;
        //是否可以生成风车
        this.canCreateFish = TG_MapData.getInstance().stageData.Stage.CanCreateFish;
        this.fishNum = TG_MapData.getInstance().stageData.Stage.FishNum;
        Log.getInstance().trace("**************************************");
        Log.getInstance().trace(TG_MapData.getInstance().beginStageData, 0);
        //绘制背景
        var bg1 = this.getBitmap("FondBg(20-10-20)_png");
        bg1.scale9Grid = new egret.Rectangle(15, 15, 20, 20);
        bg1.width = Main.stageWidth - 200;
        bg1.height = Main.stageHeight - 200 - 123 + 20;
        bg1.y = 123 - 20;
        this.addChild(bg1);
        var bg2 = this.getBitmap("TipsBg1(60-10-60)_png");
        bg2.width = bg1.width - 20;
        bg2.scale9Grid = new egret.Rectangle(60, 50, 20, 20);
        bg2.height = bg1.height + 20;
        bg2.y = bg1.y - 30;
        bg2.x = bg1.width / 2 - bg2.width / 2;
        this.addChild(bg2);
        //绘制title
        var t1 = this.getBitmap("TipsTitleBg1(54-50-54)_png");
        var t2 = this.getBitmap("TipsTitleBg2(54-50-54)_png");
        var t3 = this.getBitmap("TipsTitleBg1(54-50-54)_png");
        t1.x = -8;
        this.addChild(t1);
        t2.x = t1.x + t1.width;
        t2.scale9Grid = new egret.Rectangle(25, 0, 10, 10);
        t2.width = bg1.width - t1.width * 2 + 16;
        this.addChild(t2);
        t3.scaleX = -1;
        t3.x = t2.x + t2.width + t3.width;
        this.addChild(t3);
        var rects = InitData.setData(TG_MapData.getInstance().beginStageData);
        rects.scaleX = 0.4545; //rects.width * 0.4545;
        rects.scaleY = 0.4545; //rects.height * 0.4545;
        rects.x = this.width / 2 - rects.width * 0.4545 / 2;
        rects.y = t1.y + t1.height + 20;
        this.addChild(rects);
        var tb1 = this.getTable("游戏规则", bg2.x + 10, 600);
        this.addChild(tb1);
        var gz1 = this.getText(40, "1.生成风车数量：", 0x2f569b, true, false);
        gz1.x = tb1.x + 20;
        gz1.y = tb1.y + tb1.height + 10;
        var gz1_1 = this.getText(40, this.fishNum + "", 0xffff00, true, false);
        gz1_1.x = gz1.x + gz1.width + 50;
        gz1_1.y = gz1.y;
        this.addChild(gz1);
        this.addChild(gz1_1);
        var gz2 = this.getText(40, "2.是否可以生成风车：", 0x2f569b, true, false);
        gz2.x = gz1.x;
        gz2.y = gz1.y + gz1.height + 10;
        var gz2_1 = this.getText(40, this.canCreateFish ? "是" : "否", 0xffff00, true, false);
        gz2_1.x = gz2.x + gz2.width + 50;
        gz2_1.y = gz2.y;
        this.addChild(gz2);
        this.addChild(gz2_1);
        var gz3 = this.getText(40, "3.道具是否收费：", 0x2f569b, true, false);
        gz3.x = gz1.x;
        gz3.y = gz2.y + gz2.height + 10;
        var gz3_1 = this.getText(40, "否", 0xffff00, true, false);
        gz3_1.x = gz3.x + gz3.width + 50;
        gz3_1.y = gz3.y;
        this.addChild(gz3);
        this.addChild(gz3_1);
        var tb2 = this.getTable(this.ruleType == 0 ? "消除目标" : "收集目标", bg2.x + 10, tb1.y + 300);
        this.addChild(tb2);
        var work = this.getAllWork();
        work.x = 50;
        work.y = tb2.y + tb2.height + 20;
        this.addChild(work);
        var tb3 = this.getTable("没有可用道具", tb2.x + 10, tb2.y + 400);
        this.addChild(tb3);
        var btn = this.getButton();
        btn.x = this.width / 2 - btn.width / 2;
        btn.y = bg2.y + bg2.height - btn.height - 20;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            Log.getInstance().trace("点击开始按钮", 0);
            _this.removeself();
            App.MessageCenter.dispatch(Msg.Event.BeginGame2);
        }, this);
        // let rect = this.initRect();
        // rect.x = this.width/2 - rect.width/2;
        // rect.y = t1.y + t1.height + 20;
        // this.addChild(rect);
        //居中对其
        this.x = Main.stageWidth / 2 - this.width / 2;
        this.y = Main.stageHeight / 2 - this.height / 2;
    };
    GamePanel_BeforeStart2.prototype.initRect = function () {
        var sp = new egret.Sprite();
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var bg = void 0;
                if ((i + j) % 2 == 0) {
                    bg = this.getBitmap("rect1_png");
                }
                else {
                    bg = this.getBitmap("rect2_png");
                }
                bg.width = 50;
                bg.height = 50;
                bg.x = j * bg.width;
                bg.y = i * bg.height;
                sp.addChild(bg);
            }
        }
        return sp;
    };
    GamePanel_BeforeStart2.prototype.getTable = function (n, _x, _y) {
        var sp = new egret.Sprite();
        var title = this.getText(40, n);
        title.x = 5;
        sp.addChild(title);
        for (var i = 0; i < 21; i++) {
            var b1 = this.getBitmap("hudiejie_xuxian_png");
            b1.x = (i * b1.width);
            b1.y = title.y + title.height + 10;
            sp.addChild(b1);
        }
        sp.x = _x;
        sp.y = _y;
        return sp;
    };
    GamePanel_BeforeStart2.prototype.getButton = function () {
        var sp = new egret.Sprite();
        var bg = this.getBitmap("CommonBtn_SmallGreen_png");
        bg.width = 200;
        bg.height = 100;
        sp.addChild(bg);
        var tex = this.getText(30, "开 始", 0x22a440, false);
        tex.x = bg.width / 2 - tex.width / 2;
        tex.y = bg.height / 2 - tex.height / 2 - 6;
        sp.addChild(tex);
        sp.touchEnabled = true;
        return sp;
    };
    GamePanel_BeforeStart2.prototype.getBitmap = function (texName) {
        var bit = new egret.Bitmap(RES.getRes(texName));
        return bit;
    };
    GamePanel_BeforeStart2.prototype.getText = function (size, text, color, bold, isgl) {
        if (color === void 0) { color = 0xffffff; }
        if (bold === void 0) { bold = true; }
        if (isgl === void 0) { isgl = true; }
        var num_tex = new egret.TextField();
        num_tex.textAlign = "center";
        num_tex.size = size;
        num_tex.bold = true;
        num_tex.textColor = color;
        // num_tex.width = 100;
        if (isgl) {
            num_tex.strokeColor = 0x000000;
            num_tex.stroke = 2;
        }
        num_tex.text = text;
        num_tex.height = num_tex.textHeight;
        num_tex.width = num_tex.textWidth;
        return num_tex;
    };
    //获取两边总任务
    GamePanel_BeforeStart2.prototype.getAllWork = function () {
        var sp = new egret.Sprite();
        var singelModel = TG_MapData.getInstance().stageData.Stage.SingelModel;
        // this.ruleType
        if (singelModel) {
            var targets1 = TG_MapData.getInstance().stageData.Stage.Targets1;
            var t1 = this.getListSp("玩家1", targets1);
            t1.y = 350 / 2 - t1.height / 2;
            sp.addChild(t1);
        }
        else {
            var targets1 = TG_MapData.getInstance().stageData.Stage.Targets1;
            var t1 = this.getListSp("玩家1", targets1);
            t1.y = 10;
            sp.addChild(t1);
            var targets2 = TG_MapData.getInstance().stageData.Stage.Targets2;
            var t2 = this.getListSp("玩家2", targets2);
            t2.y = t1.y + t1.height + 10;
            sp.addChild(t2);
        }
        return sp;
    };
    //获取一条任务目标
    GamePanel_BeforeStart2.prototype.getListSp = function (n, itemArr) {
        var sp = new egret.Sprite();
        var tex_name = this.getText(35, n);
        tex_name.x = 0;
        tex_name.y = 133 / 2 - tex_name.height / 2;
        sp.addChild(tex_name);
        for (var i = 0; i < itemArr.length; i++) {
            var item = this.getTagetIcon(itemArr[i]["Target"], itemArr[i]["Num"]);
            item.x = tex_name.width + i * item.width;
            item.y = 0;
            sp.addChild(item);
        }
        return sp;
    };
    //获取一个小格子玩意儿
    GamePanel_BeforeStart2.prototype.getTagetIcon = function (ids, num) {
        var sp = new egret.Sprite();
        var bg = this.getBitmap("ItemBg_Blue_png");
        sp.addChild(bg);
        var obj11 = TG_MapData.getInstance().mapConfigData[ids];
        var item = this.getBitmap(LoadNetworkImageUtils.getResNameByLayerId(obj11.layerid));
        item.width = 90; //item.width + 0.5;
        item.height = 90; //item.height + 0.5;
        item.x = sp.width / 2 - item.width / 2;
        item.y = sp.height / 2 - item.height / 2 - 5;
        sp.addChild(item);
        if (this.ruleType == 0) {
            var tex = this.getText(35, "x" + num);
            tex.x = item.x + item.width - tex.width;
            tex.y = item.y + item.height - tex.height;
            sp.addChild(tex);
        }
        return sp;
    };
    return GamePanel_BeforeStart2;
}(BaseClassSprite));
__reflect(GamePanel_BeforeStart2.prototype, "GamePanel_BeforeStart2");
var InitData = (function () {
    function InitData() {
    }
    InitData.setData = function (blocks) {
        var sp = new egret.Sprite();
        var sp1 = new egret.Sprite();
        var sp2 = new egret.Sprite();
        var sp3 = new egret.Sprite();
        var sp4 = new egret.Sprite();
        var sp5 = new egret.Sprite();
        var sp6 = new egret.Sprite();
        var sp7 = new egret.Sprite();
        var sp8 = new egret.Sprite();
        sp.addChild(sp1);
        sp.addChild(sp2);
        sp.addChild(sp3);
        sp.addChild(sp4);
        sp.addChild(sp5);
        sp.addChild(sp6);
        sp.addChild(sp7);
        sp.addChild(sp8);
        if (blocks) {
            for (var i in blocks) {
                var row = 0, col = 0, obj = null;
                row = Math.floor(Number(i) / 9);
                col = Number(i) % 9;
                // 超过第九行不绘制
                if (row >= 9) {
                    break;
                }
                var Id1 = blocks[i]["Id1"];
                var Id2 = blocks[i]["Id2"];
                var Id3 = blocks[i]["Id3"];
                var Id4 = blocks[i]["Id4"];
                var Id5 = blocks[i]["Id5"];
                var Id6 = blocks[i]["Id6"];
                var Id7 = blocks[i]["Id7"];
                // 创建地板层(第一层)
                InitData.CreateButton(Id1, row, col, i, sp1);
                // 创建毛毛虫层（第二层）
                // InitData.CreateCaterpillars(Id2,row,col,sp2);
                // 创建冰层数据（第三层）
                InitData.CreateIces(Id3, row, col, sp3);
                // 创建宝石层(包含毛球) （第四层)
                InitData.CreateItems(Id2, Id7, row, col, sp4);
                // 创建网格层 铁丝网 （第五层)
                InitData.CreateMeshs(Id4, row, col, sp5);
                // 创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第六层)
                InitData.CreateHairBall(Id2, Id7, row, col, sp6);
                // 创建栏杆层数据 (第七层)
                InitData.CreateRailings(Id6, row, col, sp7);
                // 创建云层数据(第八层)
                InitData.CreateClouds(Id5, row, col, sp8);
            }
        }
        return sp;
    };
    /*创建地板层 一层块*/
    InitData.CreateButton = function (id, row, col, i, sp) {
        if (id == -1)
            return;
        // 深浅交替背景初始化 所有1002的背景块初始化成10021 10022
        // if (id == 1002) {
        //     let oddOrEven = Number(i)%2+1;
        //     id = 1002*10+oddOrEven;
        // }
        if (id == 1001) {
            id = 1002;
        }
        var obj = TG_CreateItem.CreateButton(id, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建毛毛虫层 二层块*/
    InitData.CreateCaterpillars = function (id, row, col, sp) {
        if (id == -1)
            return;
        var obj = TG_CreateItem.CreateItems(id, -1, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建冰层数据 三层块*/
    InitData.CreateIces = function (id, row, col, sp) {
        if (id == -1)
            return;
        var obj = TG_CreateItem.CreateIces(id, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建宝石层(包含毛球) （第四层)*/
    InitData.CreateItems = function (Id2, Id7, row, col, sp) {
        if (Id2 == -1)
            return;
        var EffectType = Msg.EffectType.ET_none;
        EffectType = TG_Blocks.GetEffectByLayerid(Id2);
        var obj = TG_CreateItem.CreateItems(Id2, Id7, row, col, EffectType);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建网格层 铁丝网 （第五层)*/
    InitData.CreateMeshs = function (id, row, col, sp) {
        if (id == -1)
            return;
        var obj = TG_CreateItem.CreateMeshs(id, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第六层)*/
    InitData.CreateHairBall = function (Id2, Id7, row, col, sp) {
        if (Id2 == -1 || Id7 <= 0)
            return;
        var obj = TG_CreateItem.CreateHairBall(Id7, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建栏杆层数据 (第七层)*/
    InitData.CreateRailings = function (id, row, col, sp) {
        if (id == -1)
            return;
        var obj = TG_CreateItem.CreateRailings(id, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    /*创建云层数据(第八层)*/
    InitData.CreateClouds = function (id, row, col, sp) {
        if (id == -1)
            return;
        var obj = TG_CreateItem.CreateClouds(id, row, col);
        sp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
    };
    return InitData;
}());
__reflect(InitData.prototype, "InitData");
//# sourceMappingURL=GamePanel_BeforeStart2.js.map