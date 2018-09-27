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
var Point = egret.Point;
/**
 * Created by ZhangHui on 2018/6/4.
 */
var GamePanel_ItemSp = (function (_super) {
    __extends(GamePanel_ItemSp, _super);
    // /*单例*/
    // private static gamePanel_ItemSp: GamePanel_ItemSp;
    // public static getInstance() {
    //     if (!this.gamePanel_ItemSp) {
    //         this.gamePanel_ItemSp = new GamePanel_ItemSp();
    //     }
    //     return this.gamePanel_ItemSp;
    // }
    function GamePanel_ItemSp() {
        var _this = _super.call(this) || this;
        _this.setTimeOut_doDrop = -1; //延时句柄
        //当前选择的技能类型
        _this.PropType = 0;
        /**
         *  游戏当前状态
         * @type {number} 0正常模式  1道具模式
         */
        _this.Game_State = 0;
        /***
         * 需要交换的两个item索引
         * */
        _this.changeIndex1 = -1;
        _this.changeIndex2 = -1;
        _this.addEvent();
        return _this;
    }
    /*初始化地图方块*/
    GamePanel_ItemSp.prototype.initMapRect = function () {
        //监听移除开始游戏滚动多余元素
        App.MessageCenter.addListener(Msg.Event.ClearBeginRollItem, this.ClearBeginRollItem, this);
        //方块的大背景
        // this.initBg();
        //初始化方块层级
        this.initRectSpLv();
        //初始化层数组数据
        TG_Game.InitGame();
        /*方块*/
        // this.initRect();
    };
    GamePanel_ItemSp.prototype.initBg = function () {
        //棋盘大背景
        this.bg = new egret.Bitmap(RES.getRes("game_bg3_png"));
        this.addChild(this.bg);
        // this.bg.width = Main.stageWidth * .9;//.947;
        // this.bg.height = this.bg.width;
        // this.bg.x = Main.stageWidth / 2 - this.bg.width / 2;
        // this.bg.y = Main.stageHeight * .58 - this.bg.height / 2;
    };
    /*初始化方块层级*/
    GamePanel_ItemSp.prototype.initRectSpLv = function () {
        //地块
        this.ButtonsSp = new egret.Sprite();
        this.addChild(this.ButtonsSp);
        // 传送带
        this.BeltsSp = new egret.Sprite();
        this.addChild(this.BeltsSp);
        //毛虫层
        this.CaterpillarsSp = new egret.Sprite();
        this.addChild(this.CaterpillarsSp);
        //冰块层
        this.IcesSp = new egret.Sprite();
        this.addChild(this.IcesSp);
        //宝石块层
        this.ItemsSp = new egret.Sprite();
        this.addChild(this.ItemsSp);
        //网格层
        this.MeshsSp = new egret.Sprite();
        this.addChild(this.MeshsSp);
        //栏杆层
        this.RailingsSp = new egret.Sprite();
        this.addChild(this.RailingsSp);
        // 毛球层 HairBall
        this.HairBallSp = new egret.Sprite();
        this.addChild(this.HairBallSp);
        //云层
        this.CloudsSp = new egret.Sprite();
        this.addChild(this.CloudsSp);
        // 传送带出入口层
        this.BeltsColorSp = new egret.Sprite();
        this.addChild(this.BeltsColorSp);
        //最高层
        this.MaxLayerSp = new egret.Sprite();
        this.addChild(this.MaxLayerSp);
        // 月饼坑层
        this.PeaSp = new egret.Sprite();
        this.addChild(this.PeaSp);
        this.AnimationLayer = new egret.Sprite();
        this.addChild(this.AnimationLayer);
        var vx = 10; //this.bg.x  + this.bg.width * .01;
        var vy = 10; //this.bg.y  + this.bg.height * .01;
        this.ItemsSp.x = this.CaterpillarsSp.x = this.BeltsSp.x = this.BeltsColorSp.x = this.ButtonsSp.x = this.IcesSp.x = this.MeshsSp.x = this.CloudsSp.x = this.RailingsSp.x = this.MaxLayerSp.x = this.HairBallSp.x = this.PeaSp.x = this.AnimationLayer.x = vx;
        this.ItemsSp.y = this.CaterpillarsSp.y = this.BeltsSp.y = this.BeltsColorSp.y = this.ButtonsSp.y = this.IcesSp.y = this.MeshsSp.y = this.CloudsSp.y = this.RailingsSp.y = this.MaxLayerSp.y = this.HairBallSp.y = this.PeaSp.y = this.AnimationLayer.y = vy;
    };
    /*实例化方块*/
    GamePanel_ItemSp.prototype.initRect = function () {
        var stageData = TG_MapData.getInstance().stageData;
        if (stageData) {
            var stage = stageData.Stage;
            if (stage) {
                var blocks = stage.Blocks;
                if (blocks) {
                    // for (let i in blocks) {
                    //     let row = 0, col = 0, obj = null;
                    //     row = Math.floor(Number(i) / 9);
                    //     col = Number(i) % 9;
                    //     // 超过第九行不绘制
                    //     if (row >= 9) {
                    //         break;
                    //     }
                    //     // 传送带数据
                    //     let Id0 = blocks[i]["Id0"];
                    //     let Id1 = blocks[i]["Id1"];
                    //     let Id2 = blocks[i]["Id2"];
                    //     let Id3 = blocks[i]["Id3"];
                    //     let Id4 = blocks[i]["Id4"];
                    //     let Id5 = blocks[i]["Id5"];
                    //     let Id6 = blocks[i]["Id6"];
                    //     let Id7=  blocks[i]["Id7"];
                    //     // 创建传送带层
                    //     // this.CreateTransporter(Id1,row,col,i);
                    //     // 创建地板层(第一层)
                    //     this.CreateButton(Id1,row,col,i);
                    //      第2层 毛毛虫层
                    //      this.CreateItemSp(blocks,2);
                    //     // 创建冰层数据（第三层）
                    //     this.CreateIces(Id3,row,col);
                    //     // 创建宝石层(包含毛球) （第四层)
                    //     this.CreateItems(Id2,Id7,row,col);
                    //     // 创建网格层 铁丝网 （第五层)
                    //     this.CreateMeshs(Id4,row,col);
                    //     // 创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第六层)
                    //     // this.CreateHairBall(Id2,Id7,row,col);
                    //     // 创建栏杆层数据 (第六层)
                    //     this.CreateRailings(Id6,row,col);
                    //     // 第七层 毛球层随方块一起创建
                    //     // this.CreateHairBall(items,Id7,row,col);
                    //     // 创建云层数据(第八层)
                    //     this.CreateClouds(Id5,row,col);
                    //     // 创建皇冠层(第九层)
                    //     this.CreatePea(Id0,row,col);
                    // }
                    // this.CreateBelts();
                    // this.CreateBeltsColor();
                    // this.CreateCaterpillars();
                    //第0层 传送带层
                    this.CreateItemSp(blocks, 0);
                    //第1层 创建地板层
                    this.CreateItemSp(blocks, 1);
                    //第2层 毛毛虫层
                    this.CreateItemSp(blocks, 2);
                    //第3层 冰层
                    this.CreateItemSp(blocks, 3);
                    //第4层 宝石层
                    this.CreateItemSp(blocks, 4);
                    //第5层 网格层 铁丝网
                    this.CreateItemSp(blocks, 5);
                    //第6层 栏杆层
                    this.CreateItemSp(blocks, 6);
                    //第7层没有
                    // this.CreateItem(blocks,7);
                    //第8层 云层
                    this.CreateItemSp(blocks, 8);
                    //第9层 皇冠层
                    this.CreateItemSp(blocks, 9);
                }
            }
        }
        /*打标签 调用TG_Game DoAddMark*/
        TG_Game.getInstance().DoAddMark();
        //初始化出生点
        TG_Game.getInstance().initBirthPos();
        this.addTouchEvent();
        /*正式开始*/
        TG_Game.currentState = 1;
    };
    GamePanel_ItemSp.prototype.CreateItemSp = function (blocks, layer) {
        switch (layer) {
            case 0:
                //传送带
                this.CreateBelts();
                this.CreateBeltsColor();
                break;
            case 1:
                //地板层
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id1 = blocks[i]["Id1"];
                    // 创建地板层(第一层)
                    this.CreateButton(Id1, row, col, i);
                }
                break;
            case 2:
                //毛虫层
                this.CreateCaterpillars();
                break;
            case 3:
                //冰层
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id3 = blocks[i]["Id3"];
                    this.CreateIces(Id3, row, col);
                }
                break;
            case 4:
                //宝石层(包含毛球)
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id2 = blocks[i]["Id2"];
                    var Id7 = blocks[i]["Id7"];
                    this.CreateItems(Id2, Id7, row, col);
                }
                break;
            case 5:
                //网格层 铁丝网
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id4 = blocks[i]["Id4"];
                    this.CreateMeshs(Id4, row, col);
                }
                break;
            case 6:
                //栏杆层
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id6 = blocks[i]["Id6"];
                    this.CreateRailings(Id6, row, col);
                }
                break;
            case 7:
                break;
            case 8:
                //云层
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id5 = blocks[i]["Id5"];
                    this.CreateClouds(Id5, row, col);
                }
                break;
            case 9:
                //皇冠层
                for (var i in blocks) {
                    var row = Math.floor(Number(i) / 9);
                    var col = Number(i) % 9;
                    // 超过第九行不绘制
                    if (row >= 9) {
                        break;
                    }
                    // 传送带数据
                    var Id0 = blocks[i]["Id0"];
                    this.CreatePea(Id0, row, col);
                }
                break;
        }
    };
    /**
     * 创建传送带出入口 test
     * @constructor
     */
    GamePanel_ItemSp.prototype.CreateBeltsColor = function () {
        var belts = TG_Stage.Belts;
        for (var i = 0; i < belts.length; i++) {
            var oneBelts = belts[i];
            var bodies = oneBelts["Bodies"];
            var enterId = oneBelts["EnterId"];
            var exitId = oneBelts["ExitId"];
            var beltsType = 0;
            if (enterId == -1 && exitId == -1) {
                beltsType = 1;
            }
            if (enterId != -1 && exitId != -1) {
                beltsType = 2;
            }
            if (Number(beltsType) == 2) {
                var enterBodies = bodies[bodies.length - 1];
                var enterPreBodies = bodies[bodies.length - 2];
                var enterNextBodies = bodies[0];
                var exitBodies = bodies[0];
                var exitPreBodies = bodies[bodies.length - 1];
                var exitNextBodies = bodies[1];
                var enterRow = Math.floor(enterBodies / 9);
                var enterCol = enterBodies % 9;
                var exitRow = Math.floor(exitBodies / 9);
                var exitCol = exitBodies % 9;
                var enterDirection = TG_Game.getInstance().getBeltsColorDirect(enterPreBodies, enterBodies, enterNextBodies, false, true);
                var exitDirection = TG_Game.getInstance().getBeltsColorDirect(exitPreBodies, exitBodies, exitNextBodies, true, false);
                this.CreateOneCellBeltsColor(exitId, exitDirection, exitRow, exitCol);
                this.CreateOneCellBeltsColor(enterId, enterDirection, enterRow, enterCol);
            }
        }
    };
    /**
     * 创建传送带颜色图标
     */
    GamePanel_ItemSp.prototype.CreateOneCellBeltsColor = function (id, direction, row, col) {
        var obj = TG_CreateItem.CreateOneCellBeltsColor(id, direction, row, col);
        if (obj.itemType == ItemType.TG_ITEM_TYPE_PORTAL_COLOR) {
            this.BeltsColorSp.addChild(obj);
        }
        obj.touchEnabled = false;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        App.FiltersManager.Setfilters(obj, obj.portalColor);
        // 超过第九行不加入数组
        if (row < 9) {
            TG_Game.BeltsColor.push(obj);
        }
    };
    /**
     * 创建一个传送带
     * @constructor
     */
    GamePanel_ItemSp.prototype.CreateBelts = function () {
        var belts = TG_Stage.Belts;
        for (var i = 0; i < belts.length; i++) {
            var oneBelts = belts[i];
            var bodies = oneBelts["Bodies"];
            var enterId = oneBelts["EnterId"];
            var exitId = oneBelts["ExitId"];
            var beltsType = 0;
            if (enterId == -1 && exitId == -1) {
                // 传送带为环形
                beltsType = 1;
            }
            if (enterId != -1 && exitId != -1) {
                // 传送带为非闭合的条形
                beltsType = 2;
            }
            if (Number(beltsType) == 2 || Number(beltsType) == 1) {
                for (var currIndex in bodies) {
                    var oneCellBodiesIndex = Number(currIndex);
                    this.createOneCellBodies(beltsType, oneCellBodiesIndex, bodies);
                }
            }
        }
    };
    /**
     * 传送带链中一个传送带创建
     * @param oneCellBodiesIndex
     * @param bodies
     */
    GamePanel_ItemSp.prototype.createOneCellBodies = function (beltsType, oneCellBodiesIndex, bodies) {
        // 当前传送带下标
        var currIndex = oneCellBodiesIndex;
        // 前一个传送带下标 当前传送带是第一个传送带需要特殊处理
        var preIndex = oneCellBodiesIndex == 0 ? bodies.length - 1 : oneCellBodiesIndex - 1;
        // 下一个传送带下标 当前传送带是最后一个需要特殊处理
        var nextIndex = oneCellBodiesIndex == bodies.length - 1 ? 0 : oneCellBodiesIndex + 1;
        var currBeltsIndex = bodies[currIndex];
        var preBeltsIndex = bodies[preIndex];
        var nextBeltsIndex = bodies[nextIndex];
        var isFirst = currIndex == 0;
        var isLast = currIndex == bodies.length - 1;
        var row = Math.floor(currBeltsIndex / 9);
        var col = currBeltsIndex % 9;
        if (beltsType == 1 || beltsType == 2) {
            // 计算当前传送带绘制第几个传送带
            var num = TG_Game.getInstance().getBeltsNumByBeltsType(beltsType, preBeltsIndex, currBeltsIndex, nextBeltsIndex, isFirst, isLast);
            // console.info(num);
            var obj = TG_CreateItem.CreateOneCellBelts(num, row, col);
            if (obj.itemType == ItemType.TG_ITEM_TYPE_PORTAL) {
                this.BeltsSp.addChild(obj);
            }
            obj.touchEnabled = true;
            Tool.getInstance().setAnchorPoint(obj);
            var pos = obj.getPosByRowCol(row, col);
            obj.x = pos.x;
            obj.y = pos.y;
            // 超过第九行不加入数组
            if (row < 9) {
                TG_Game.Belts.push(obj);
            }
        }
    };
    /*移除开始游戏滚动的多余元素*/
    GamePanel_ItemSp.prototype.ClearBeginRollItem = function () {
        for (var i = this.numChildren - 1; i >= 0; i--) {
            var list = this.getChildAt(i).$children;
            for (var j = list.length - 1; j >= 0; j--) {
                var temp = list[j];
                if (temp != undefined) {
                    App.DisplayUtils.removeFromParent(temp);
                    TG_Object.Release(temp);
                    temp = null;
                }
            }
        }
        //初始化层数组数据
        TG_Game.InitGame();
        App.MessageCenter.dispatch(Msg.Event.CreateGameItem);
    };
    /*创建地板层 一层块*/
    GamePanel_ItemSp.prototype.CreateButton = function (id, row, col, i, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        if (id == -1)
            return;
        // 深浅交替背景初始化 所有1002的背景块初始化成10021 10022
        // if (id == 1002) {
        //     let oddOrEven = Number(i)%2+1;
        //     id = 1002*10+oddOrEven;
        // }
        // console.log(id);
        var obj = TG_CreateItem.CreateButton(id, row, col);
        if (obj.IsItemNull()) {
            //空块
            this.MaxLayerSp.addChild(obj);
        }
        else {
            this.ButtonsSp.addChild(obj);
        }
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var rowNum = row;
        var colNum = col;
        if (obj.itemType == ItemType.TG_ITEM_TYPE_PEAPIT) {
            rowNum = row + 1;
        }
        var pos = obj.getPosByRowCol(rowNum, colNum);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.Buttons.push(obj);
        }
    };
    /*创建毛毛虫层 二层块*/
    GamePanel_ItemSp.prototype.CreateCaterpillars = function () {
        var stageData = TG_MapData.getInstance().stageData;
        if (stageData) {
            var stage = stageData.Stage;
            var caterpillar = TG_Stage.Caterpillars;
            var blocks = stage.Blocks;
            var id = -1;
            var row = -1;
            var col = -1;
            if (blocks) {
                for (var i in blocks) {
                    //添加一遍正常格
                    id = -1;
                    row = Math.floor(Number(i) / 9);
                    col = Number(i) % 9;
                    if (row >= 9) {
                        break;
                    }
                    var obj = TG_CreateItem.CreateCaterpillars(id, row, col);
                    Tool.getInstance().setAnchorPoint(obj);
                    var rowNum = row;
                    var colNum = col;
                    var pos = obj.getPosByRowCol(rowNum, colNum);
                    obj.x = pos.x;
                    obj.y = pos.y;
                    // 超过第九行不加入数组
                    if (row < 9) {
                        TG_Game.Caterpillars.push(obj);
                    }
                }
                for (var k = 0; k < caterpillar.length; k++) {
                    var strip = caterpillar[k].Body;
                    if (strip.length == 0) {
                        continue;
                    }
                    for (var i = 0; i < strip.length; i++) {
                        var preIndex = strip[i - 1];
                        var curIndex = strip[i];
                        var behindIndex = strip[i + 1];
                        if (!preIndex) {
                            preIndex = curIndex;
                        }
                        else if (!behindIndex) {
                            behindIndex = curIndex;
                        }
                        id = 8001;
                        row = Math.floor(Number(curIndex) / 9);
                        col = Number(curIndex) % 9;
                        //头部
                        var obj = TG_CreateItem.CreateCaterpillars(id, row, col, preIndex, curIndex, behindIndex);
                        this.CaterpillarsSp.addChild(obj);
                        Tool.getInstance().setAnchorPoint(obj);
                        var rowNum = row;
                        var colNum = col;
                        var pos = obj.getPosByRowCol(rowNum, colNum);
                        obj.x = pos.x;
                        obj.y = pos.y;
                        // 超过第九行不加入数组
                        if (row < 9) {
                            TG_Game.Caterpillars[curIndex] = obj;
                        }
                    }
                }
            }
        }
    };
    /*创建冰层数据 三层块*/
    GamePanel_ItemSp.prototype.CreateIces = function (id, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        // if (id != -1) {
        var obj = TG_CreateItem.CreateIces(id, row, col);
        this.IcesSp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.Ices.push(obj);
        }
    };
    /*创建宝石层(包含毛球) （第四层)*/
    GamePanel_ItemSp.prototype.CreateItems = function (Id2, Id7, row, col, isNeedAddList, MagicStoneExplode) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        if (MagicStoneExplode === void 0) { MagicStoneExplode = false; }
        var EffectType = Msg.EffectType.ET_none;
        EffectType = TG_Blocks.GetEffectByLayerid(Id2);
        var obj = TG_CreateItem.CreateItems(Id2, Id7, row, col, EffectType);
        this.ItemsSp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if ((row < 9 || isNeedAddList) && !MagicStoneExplode) {
            TG_Game.Items.push(obj);
        }
        return obj;
    };
    /*创建网格层 铁丝网 （第五层)*/
    GamePanel_ItemSp.prototype.CreateMeshs = function (id, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        var obj = TG_CreateItem.CreateMeshs(id, row, col);
        this.MeshsSp.addChild(obj);
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.Meshs.push(obj);
        }
    };
    /*创建栏杆层数据 (第六层)*/
    GamePanel_ItemSp.prototype.CreateRailings = function (id, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        var obj = TG_CreateItem.CreateRailings(id, row, col);
        this.RailingsSp.addChild(obj);
        obj.touchEnabled = false;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.Railings.push(obj);
        }
    };
    /*创建毛球层 毛球与铁丝网互斥 毛球附着在消除块上(第七层)*/
    GamePanel_ItemSp.prototype.CreateHairBall = function (item, Id7, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        var obj = TG_CreateItem.CreateHairBall(Id7, row, col);
        this.HairBallSp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.HairBall.push(obj);
        }
    };
    /*创建云层数据(第八层)*/
    GamePanel_ItemSp.prototype.CreateClouds = function (id, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        var obj = TG_CreateItem.CreateClouds(id, row, col);
        this.CloudsSp.addChild(obj);
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9 || isNeedAddList) {
            TG_Game.Clouds.push(obj);
        }
    };
    /**
     * 创建第九层
     */
    GamePanel_ItemSp.prototype.CreatePea = function (id, row, col) {
        var obj = TG_CreateItem.CreatePea(id, row, col);
        if (obj.itemType == ItemType.TG_ITEM_TYPE_PEAPIT) {
            this.PeaSp.addChild(obj);
        }
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var rowNum = row;
        var colNum = col;
        if (obj.itemType == ItemType.TG_ITEM_TYPE_PEAPIT) {
            rowNum = row + 1;
        }
        var pos = obj.getPosByRowCol(rowNum, colNum);
        obj.x = pos.x;
        obj.y = pos.y;
        // 超过第九行不加入数组
        if (row < 9) {
            TG_Game.PeaLst.push(obj);
        }
    };
    /*炸弹和条形 普通块的放大效果*/
    GamePanel_ItemSp.prototype.createSuperGHV = function (layerid, row, col, EffectType, time) {
        var obj = TG_CreateItem.CreateItems(layerid, -1, row, col, EffectType);
        this.ItemsSp.addChild(obj);
        Tool.getInstance().setAnchorPoint(obj);
        obj.setItemNone(false);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        egret.Tween.get(obj).to({ scaleX: 1.5, scaleY: 1.5 }, time).call(function () {
            egret.Tween.removeTweens(obj);
            App.DisplayUtils.removeFromParent(obj);
            obj.Release();
        }.bind(this), this);
    };
    /*创建新的普通方块*/
    GamePanel_ItemSp.prototype.createNewRect = function (layerid, row, col) {
        var obj = TG_CreateItem.CreateItems(layerid, -1, row, col);
        try {
            this.ItemsSp.addChild(obj);
        }
        catch (e) {
            Log.getInstance().trace(e);
        }
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var pos = obj.getPosByRowCol(row - 1, col);
        obj.x = pos.x;
        obj.y = pos.y - 5;
        return obj;
    };
    /* 创建新的传染块 */
    GamePanel_ItemSp.prototype.createNewInfect = function (id, row, col, isNeedAddList) {
        if (isNeedAddList === void 0) { isNeedAddList = false; }
        var obj = TG_CreateItem.CreateButton(id, row, col);
        if (obj.IsItemNull()) {
            //空块
            this.MaxLayerSp.addChild(obj);
        }
        else {
            this.ButtonsSp.addChild(obj);
        }
        obj.touchEnabled = true;
        obj.setItemNone(false);
        Tool.getInstance().setAnchorPoint(obj);
        var rowNum = row;
        var colNum = col;
        var pos = obj.getPosByRowCol(rowNum, colNum);
        obj.x = pos.x;
        obj.y = pos.y;
        var index = TG_Game.getInstance().GetIndexByPos(rowNum, colNum);
        TG_Game.Buttons[index] = obj;
        return obj;
    };
    /*创建特效块*/
    GamePanel_ItemSp.prototype.createItemEffect = function (layerid, row, col, EffectType) {
        var obj = TG_CreateItem.CreateItems(layerid, -1, row, col, EffectType);
        this.ItemsSp.addChild(obj);
        obj.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(obj);
        var index = TG_Game.getInstance().GetIndexByPos(row, col);
        obj.setItemNone(false);
        TG_Game.Items[index] = obj;
        TG_Game.getInstance().createList.push(obj);
        var pos = obj.getPosByRowCol(row, col);
        obj.x = pos.x;
        obj.y = pos.y;
        //如果是新创建的恶魔
        var itemType = TG_MapData.getInstance().mapConfigData[layerid].itemType;
        if (itemType == ItemType.TG_ITEM_TYPE_VENOM || itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
            obj.scaleX = obj.scaleY = .1;
            egret.Tween.get(obj).to({ scaleX: 1.2, scaleY: 1.2 }, 500).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
                if (obj) {
                    egret.Tween.removeTweens(obj);
                }
            }.bind(this), this);
        }
    };
    GamePanel_ItemSp.prototype.createElementItemForEgg = function (layerid, origin, to_row, to_col, EffectType) {
        var row = origin.SitePos.Y;
        var col = origin.SitePos.X;
        var oneNormalBlock = TG_CreateItem.CreateItems(layerid, 0, row, col, EffectType = Msg.EffectType.ET_none);
        this.ItemsSp.addChild(oneNormalBlock);
        oneNormalBlock.touchEnabled = true;
        Tool.getInstance().setAnchorPoint(oneNormalBlock);
        var pos = oneNormalBlock.getPosByRowCol(row, col);
        var beginX = 0, beginY = 0, middleX = 0, middleY = 0, endX = 0, endY = 0;
        oneNormalBlock.x = pos.x;
        oneNormalBlock.y = pos.y;
        beginX = pos.x;
        beginY = pos.y;
        var pos1 = oneNormalBlock.getPosByRowCol(to_row, to_col);
        endX = pos1.x;
        endY = pos1.y;
        middleX = beginX + (endX - beginX) * .4;
        middleY = Math.min(beginY, endY) - 100;
        this.bzierMove(oneNormalBlock, beginX, beginY, middleX, middleY, endX, endY, to_row, to_col, .7);
    };
    //二次贝塞尔曲线
    GamePanel_ItemSp.prototype.bzierMove = function (obj, x1, y1, x2, y2, x3, y3, to_row, to_col, time) {
        if (time === void 0) { time = 1; }
        var finalObj = {
            "obj": obj,
            "col": to_col,
            "row": to_row
        };
        window["TweenMax"].to(obj, time, { bezier: [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], orientToBezier: false, onComplete: this.bzierMoveOver.bind(this, finalObj) });
    };
    //二次贝塞尔曲线完成
    GamePanel_ItemSp.prototype.bzierMoveOver = function (finalObj) {
        var obj = finalObj.obj;
        var to_col = finalObj.col;
        var to_row = finalObj.row;
        window["TweenMax"].killTweensOf(obj);
        //改变坐标
        obj.SetSitPos(to_col, to_row);
        //移除目标点原元素块
        var index = TG_Game.getInstance().GetIndexByPos(to_row, to_col);
        var temp = TG_Game.getInstance().GetItemByIndex(index);
        App.DisplayUtils.removeFromParent(temp);
        temp.Release();
        TG_Game.Items[index] = obj;
        TG_Game.getInstance().doCheckMoved();
    };
    /*创建飞鸟*/
    GamePanel_ItemSp.prototype.OnBirdCreate = function (layerid, startPos, birdIndex, birds, Et) {
        var bird = new TG_ItemBird();
        bird.Create(layerid);
        this.MaxLayerSp.addChild(bird);
        Tool.getInstance().setAnchorPoint(bird);
        bird.SetStartIndex(birdIndex);
        bird.SetStartPos(startPos);
        bird.SetEffectType(Et);
        birds.push(bird);
        var pos = bird.getPosByRowCol(startPos.Y, startPos.X);
        bird.x = pos.x;
        bird.y = pos.y;
    };
    /*移除飞鸟*/
    GamePanel_ItemSp.prototype.OnBirdRemove = function (bird, birds) {
        for (var i in birds) {
            if (bird.GetTargetIndex() == birds[i].GetTargetIndex()) {
                egret.Tween.get(bird).to({ scaleX: 0, scaleY: 0, alpha: 0 }, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay)).call(function () {
                    egret.Tween.removeTweens(bird);
                    App.DisplayUtils.removeFromParent(bird);
                    bird.Release();
                }.bind(this), this);
            }
        }
    };
    GamePanel_ItemSp.prototype.CreateSuperBlackHole = function (color, type, tempList, sitePos, infect, BlackHoles, backFun) {
        this.BlackHole = new TG_ItemBlackRay();
        this.BlackHole.Create();
        this.ItemsSp.addChild(this.BlackHole);
        Tool.getInstance().setAnchorPoint(this.BlackHole);
        this.BlackHole.x = sitePos.x;
        this.BlackHole.y = sitePos.y;
        egret.Tween.get(this.BlackHole, { loop: true }).to({ rotation: 360 }, 800);
        //射线
        this.BlackHoleLine = new TG_ItemBlackRay();
        this.BlackHoleLine.CreateLine();
        this.ItemsSp.addChild(this.BlackHoleLine);
        this.BlackHoleLine.anchorOffsetY = this.BlackHoleLine.height / 2;
        this.BlackHoleLine.x = sitePos.x;
        this.BlackHoleLine.y = sitePos.y;
        var CreateCount = tempList.length - 1;
        var currentCount = -1;
        var time = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ReyAlteDelay);
        this.BlackHoleSetInterval = setInterval(function () {
            if (currentCount < CreateCount) {
                time = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ReyAlteDelay) + TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ReyFlyDelay);
                currentCount++;
                var stopPos_1 = { X: 0, Y: 0 };
                stopPos_1.X = tempList[currentCount].x;
                stopPos_1.Y = tempList[currentCount].y;
                //射线
                this.BlackHoleLine.x = sitePos.x;
                this.BlackHoleLine.y = sitePos.y;
                var rotation = Math.atan2(sitePos.y - stopPos_1.Y, sitePos.x - stopPos_1.X) * 180 / Math.PI;
                this.BlackHoleLine.rotation = rotation;
                egret.Tween.get(this.BlackHoleLine).to({ x: stopPos_1.X, y: stopPos_1.Y }, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ReyFlyDelay)).call(function () {
                    egret.Tween.removeTweens(this.BlackHoleLine);
                    this.BlackHoleCreateItem = new TG_ItemBlackRay();
                    this.BlackHoleCreateItem.CreateBlackHole(color, type, currentCount, tempList[currentCount]);
                    this.ItemsSp.addChild(this.BlackHoleCreateItem);
                    this.BlackHoleCreateItem.SetStartBlockHolePos(tempList[currentCount].SitePos);
                    Tool.getInstance().setAnchorPoint(this.BlackHoleCreateItem);
                    this.BlackHoleCreateItem.x = stopPos_1.X;
                    this.BlackHoleCreateItem.y = stopPos_1.Y;
                    BlackHoles.push(this.BlackHoleCreateItem);
                }.bind(this));
            }
            else {
                clearInterval(this.BlackHoleSetInterval);
                App.DisplayUtils.removeFromParent(this.BlackHoleLine);
                this.BlackHoleLine.Release();
                App.DisplayUtils.removeFromParent(this.BlackHole);
                this.BlackHole.Release();
                backFun();
            }
        }.bind(this), time * 3);
    };
    /*移除黑射线*/
    GamePanel_ItemSp.prototype.RemoveSuperBlackHole = function (pos, blackHols) {
        var _loop_1 = function (temp) {
            if (temp) {
                if (temp.StartBlockHolePos.X == pos.X && temp.StartBlockHolePos.Y == pos.Y) {
                    temp.SetAlreadyExplode(true);
                    egret.Tween.get(temp).to({ scaleX: 0, scaleY: 0, alpha: 0 }, TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay)).call(function () {
                        egret.Tween.removeTweens(temp);
                        temp.Release();
                    }.bind(this_1), this_1);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, blackHols_1 = blackHols; _i < blackHols_1.length; _i++) {
            var temp = blackHols_1[_i];
            _loop_1(temp);
        }
    };
    /*注册点击事件*/
    GamePanel_ItemSp.prototype.addTouchEvent = function () {
        /*点击消除*/
        this.ItemsSp.touchEnabled = true;
        this.ItemsSp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.ItemsSp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.ItemsSp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchClickHandler, this);
    };
    GamePanel_ItemSp.prototype.addEvent = function () {
        App.MessageCenter.addListener(Msg.Event.SelectProp, this.selectProp, this); //选择道具 参数prop的Item
    };
    GamePanel_ItemSp.prototype.selectProp = function (item) {
        if (item === void 0) { item = null; }
        if (this.previousItem == item) {
            this.previousItem = null;
            this.PropType = 0;
            this.Game_State = 0;
            return;
        }
        this.previousItem = item;
        this.PropType = item.type;
        this.Game_State = 1;
        this.seekProp();
    };
    //去掉选择道具
    GamePanel_ItemSp.prototype.cancelSelectProp = function () {
        App.MessageCenter.dispatch(Msg.Event.CancelSelectProp, this.previousItem); //派发取消道具
        this.PropType = 0;
        this.Game_State = 0;
        this.previousItem = null;
        this.changeIndex1 = -1;
        this.changeIndex2 = -1;
    };
    GamePanel_ItemSp.prototype.seekProp = function (item) {
        if (item === void 0) { item = null; }
        if (TG_Game.getInstance().m_Status != GameStatus.GS_ARound) {
            this.cancelSelectProp();
            Panel_PopupLayer.getInstance().myAlert(PopupType.Pop_NotYourTurn, 1200);
            return;
        }
        if (TG_Stage.IsLimitUsePropCount && TG_Game.getInstance().usedToolTimes >= 1) {
            this.cancelSelectProp();
            Panel_PopupLayer.getInstance().myAlert("本回合道具使用次数已用完", 1200);
            return;
        }
        if (TG_Game.currentState != 1) {
            this.cancelSelectProp();
            Panel_PopupLayer.getInstance().myAlert("游戏中无法使用道具", 1200);
            return;
        }
        switch (this.PropType) {
            case 1:
                //停止棋盘提示倒计时
                App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
                //停止晃动动画
                TG_HintFunction.getInstance().removeItemMove();
                TG_Game.getInstance().RandomAllItem(true); //调用打乱棋盘操作
                this.cancelSelectProp();
                App.MessageCenter.dispatch(Msg.Event.UseProp, 1); //派发使用道具事件
                break;
            case 2://消除一个元素
                if (item) {
                    //如果是皇冠，提示无法使用道具
                    if (item.IsTypePea()) {
                        this.cancelSelectProp();
                        Panel_PopupLayer.getInstance().myAlert("无法使用道具", 1200);
                        return;
                    }
                    this.usedPropsChangeStatus();
                    //停止棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
                    //停止晃动动画
                    TG_HintFunction.getInstance().removeItemMove();
                    var position = [item.SitePos.X, item.SitePos.Y];
                    // TG_Game.getInstance().DoDetonate(item, false);
                    var color = item.Color;
                    if (item.GetEffectType() == Msg.EffectType.ET_Black) {
                        //如果是黑洞
                        var colorArr = [];
                        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
                            var temp = _a[_i];
                            if (colorArr.indexOf(temp.Color) == -1 && temp.Color != -1) {
                                colorArr.push(temp.Color);
                            }
                        }
                        if (colorArr.length > 0) {
                            var random = Math.floor(Math.random() * colorArr.length);
                            color = colorArr[random];
                            if (item.IsCanDrag) {
                                TG_Game.getInstance().SpecialExplodeBlack(item.SitePos, color);
                            }
                            else {
                                //上方有高层块
                                TG_Game.getInstance().doItemDetonate(position, color);
                            }
                        }
                        else {
                            Log.getInstance().trace("使用道具消除黑洞，未匹配到颜色值元素块。");
                        }
                    }
                    else {
                        TG_Game.getInstance().doItemDetonate(position, color);
                        this.doDrop();
                    }
                    this.cancelSelectProp();
                    App.MessageCenter.dispatch(Msg.Event.UseProp, 2); //派发使用道具事件
                }
                break;
            case 3://横消
                if (item) {
                    this.usedPropsChangeStatus();
                    //停止棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
                    //停止晃动动画
                    TG_HintFunction.getInstance().removeItemMove();
                    TG_Game.getInstance().SpecialExplodeHorizonal(item.SitePos, item.GetColorType(), -1);
                    this.doDrop();
                    this.cancelSelectProp();
                    App.MessageCenter.dispatch(Msg.Event.UseProp, 3); //派发使用道具事件
                }
                break;
            case 4://竖消
                if (item) {
                    this.usedPropsChangeStatus();
                    //停止棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
                    //停止晃动动画
                    TG_HintFunction.getInstance().removeItemMove();
                    TG_Game.getInstance().SpecialExplodeVertical(item.SitePos, item.GetColorType(), -1);
                    this.doDrop();
                    this.cancelSelectProp();
                    App.MessageCenter.dispatch(Msg.Event.UseProp, 4); //派发使用道具事件
                }
                break;
            case 5://炸弹
                if (item) {
                    this.usedPropsChangeStatus();
                    //停止棋盘提示倒计时
                    App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
                    //停止晃动动画
                    TG_HintFunction.getInstance().removeItemMove();
                    TG_Game.getInstance().SpecialExplodeCross(item.SitePos, -1, true, false);
                    this.doDrop();
                    this.cancelSelectProp();
                    App.MessageCenter.dispatch(Msg.Event.UseProp, 5); //派发使用道具事件
                }
                break;
            case 6://交换位置
                break;
            case 7://加步数3
                this.cancelSelectProp();
                App.MessageCenter.dispatch(Msg.Event.UseProp, 7); //派发使用道具事件
                TG_Game.getInstance().AddingStep(3);
                Panel_PopupLayer.getInstance().myAlert("增加步数 +3", 1200);
                break;
            case 8://加步数5
                this.cancelSelectProp();
                App.MessageCenter.dispatch(Msg.Event.UseProp, 8); //派发使用道具事件
                TG_Game.getInstance().AddingStep(5);
                Panel_PopupLayer.getInstance().myAlert("增加步数 +5", 1200);
                break;
            case 9://加时间10
                this.cancelSelectProp();
                App.MessageCenter.dispatch(Msg.Event.UseProp, 9); //派发使用道具事件
                TG_Game.getInstance().AddingTime(10);
                Panel_PopupLayer.getInstance().myAlert("时间增加 +10", 1200);
                break;
            case 10://加时间20
                this.cancelSelectProp();
                App.MessageCenter.dispatch(Msg.Event.UseProp, 10); //派发使用道具事件
                TG_Game.getInstance().AddingTime(20);
                Panel_PopupLayer.getInstance().myAlert("时间增加 +20", 1200);
                break;
            default:
                break;
        }
    };
    /*使用道具需要状态变为true*/
    GamePanel_ItemSp.prototype.usedPropsChangeStatus = function () {
        TG_Game.getInstance().changeDoMove();
    };
    //执行掉落
    GamePanel_ItemSp.prototype.doDrop = function () {
        App.TimerManager.doTimer(TG_TimeDefine.GetTimeDelay(TG_TimeDefine.NormalBomoDelay), 1, TG_Game.getInstance().doDrop, TG_Game.getInstance());
    };
    /**
     *  item被点击
     */
    GamePanel_ItemSp.prototype.touchClickHandler = function (e) {
        if (this.PropType <= 0)
            return;
        var item = e.target;
        if (this.PropType != 6) {
            this.seekProp(item);
        }
        else {
            if (this.changeIndex1 == -1) {
                this.changeIndex1 = item.Index;
                var item1 = TG_Game.Items[this.changeIndex1];
                item1.selected(true);
            }
            else {
                this.changeIndex2 = item.Index;
                //执行交换
                var item1 = TG_Game.Items[this.changeIndex1];
                var item2 = TG_Game.Items[this.changeIndex2];
                item2.selected(false);
                item1.selected(false);
                if ((item1.SitePos.X == item2.SitePos.X && (Math.abs(item1.SitePos.Y - item2.SitePos.Y) == 1)) || (item1.SitePos.Y == item2.SitePos.Y && (Math.abs(item1.SitePos.X - item2.SitePos.X) == 1))) {
                    // 交换
                    this.systemExchange(this.changeIndex1, this.changeIndex2, TG_Game.Items);
                    this.usedPropsChangeStatus();
                    App.TimerManager.doTimer(500, 1, TG_Game.getInstance().onDropBack, TG_Game.getInstance());
                    App.MessageCenter.dispatch(Msg.Event.UseProp, 6); //派发使用道具事件
                }
                else {
                    //无法使用道具
                    Panel_PopupLayer.getInstance().myAlert("无法使用此道具", 2000);
                }
                this.cancelSelectProp();
            }
        }
    };
    /*点击按下*/
    GamePanel_ItemSp.prototype.touchBegin = function (e) {
        if (this.Game_State == 1)
            return;
        if (TG_Game.getInstance().m_Status != GameStatus.GS_ARound)
            return;
        if (TG_Game.currentState != 1)
            return;
        if (TG_Game.currentHairState != 1)
            return;
        //用户已有点击事件
        if (!TG_Game.IsPlayerHasTouched) {
            TG_Game.IsPlayerHasTouched = true;
        }
        this.currentSetRect = e.target;
        if (this.currentSetRect) {
            var col = this.currentSetRect.SitePos.X;
            var row = this.currentSetRect.SitePos.Y;
            Log.getInstance().trace("=================分割线====================");
            Log.getInstance().trace("选中的方块坐标 列=" + col + ",行=" + row);
        }
    };
    /*移除当前选中的方块属性*/
    GamePanel_ItemSp.prototype.removeCurrentSetRect = function () {
        if (this.currentSetRect) {
            egret.Tween.removeTweens(this.currentSetRect);
            this.currentSetRect = null;
        }
    };
    /*拖动*/
    GamePanel_ItemSp.prototype.touchMove = function (e) {
        if (this.Game_State == 1)
            return;
        if (TG_Game.getInstance().m_Status != GameStatus.GS_ARound)
            return;
        if (TG_Game.currentState != 1 || !this.currentSetRect)
            return;
        // let x = e.stageX - this.ItemsSp.x, y = e.stageY - this.ItemsSp.y, dis, rotate; //胡德政修改 2018年7月13日16:41:19
        var x = e.stageX - this.x, y = e.stageY - this.y, dis, rotate;
        dis = egret.Point.distance(new egret.Point(x, y), new egret.Point(this.currentSetRect.x, this.currentSetRect.y));
        if (dis >= this.currentSetRect.GetItemWidth() / 2) {
            rotate = Math.atan2(y - this.currentSetRect.y, x - this.currentSetRect.x) * 180 / Math.PI;
            var col = this.currentSetRect.SitePos.X;
            var row = this.currentSetRect.SitePos.Y;
            if (rotate > 45 && rotate < 135) {
                /*下滑动*/
                row++;
                Log.getInstance().trace("向下滑动");
            }
            else if (rotate >= 135 || rotate < -135) {
                /*左滑*/
                col--;
                Log.getInstance().trace("向左滑动");
            }
            else if (rotate < -45 && rotate >= -135) {
                /*上滑动*/
                row--;
                Log.getInstance().trace("向上滑动");
            }
            else if (rotate <= 45 || rotate > -45) {
                /*右边滑*/
                col++;
                Log.getInstance().trace("向右滑动");
            }
            Log.getInstance().trace("要变换位置的方块坐标 row=" + row + ",col=" + col);
            if (row >= 0 && col >= 0) {
                this.nextSetRect = TG_Game.getInstance().GetItemByPos(row, col);
                if (this.nextSetRect && this.nextSetRect != null && !this.nextSetRect.getItemNone() && this.nextSetRect != this.currentSetRect) {
                    if (this.currentSetRect.isMove && this.nextSetRect.isMove) {
                        this.rectExchangePos();
                    }
                }
            }
        }
    };
    /**
     * 系统调用方块交换动画 如 冰块
     * @param index
     * @param targetIndex
     */
    GamePanel_ItemSp.prototype.systemExchange = function (index, targetIndex, arr) {
        if (arr === void 0) { arr = TG_Game.Ices; }
        var item1 = arr[index];
        var item2 = arr[targetIndex];
        var col1 = item1.SitePos.X, row1 = item1.SitePos.Y, col2 = item2.SitePos.X, row2 = item2.SitePos.Y;
        var time = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ItemExchangeAnimTime);
        var p1 = item1.getPosByRowCol(item1.SitePos.Y, item1.SitePos.X);
        var p2 = item2.getPosByRowCol(item2.SitePos.Y, item2.SitePos.X);
        TG_Game.getInstance().changeItemIndexByPos(row1, col1, row2, col2, arr);
        /*交换位置*/
        item1.SitePos.X = col2;
        item1.SitePos.Y = row2;
        item2.SitePos.X = col1;
        item2.SitePos.Y = row1;
        // //先改变pos
        // this.changeItemPosByIndex(index, targetIndex,TG_Game.Ices)
        // //再交换
        // this.changeItemIndexByIndex(index, targetIndex,TG_Game.Ices);
        try {
            egret.Tween.get(item1).to(p2, time).wait(50).call(function () {
                egret.Tween.removeTweens(item1);
            }.bind(this), this);
        }
        catch (e) { }
        try {
            egret.Tween.get(item2).to(p1, time).wait(50).call(function () {
                egret.Tween.removeTweens(item2);
            }.bind(this), this);
        }
        catch (e) { }
    };
    /*方块交换位置*/
    GamePanel_ItemSp.prototype.rectExchangePos = function () {
        if (TG_Game.currentState != 1 && !this.currentSetRect)
            return;
        //停止棋盘提示倒计时
        App.MessageCenter.dispatch(Msg.Event.StopHintFunction);
        //停止晃动动画
        TG_HintFunction.getInstance().removeItemMove();
        if (TG_Stage.SingelModel) {
            //启动棋盘提示倒计时
            App.MessageCenter.dispatch(Msg.Event.StartHintFunction);
        }
        var col1 = this.currentSetRect.SitePos.X, row1 = this.currentSetRect.SitePos.Y, col2 = this.nextSetRect.SitePos.X, row2 = this.nextSetRect.SitePos.Y;
        /*交换坐标*/
        var p1 = this.currentSetRect.getPosByRowCol(this.currentSetRect.SitePos.Y, this.currentSetRect.SitePos.X);
        var p2 = this.nextSetRect.getPosByRowCol(this.nextSetRect.SitePos.Y, this.nextSetRect.SitePos.X);
        //游戏状态为动画中
        TG_Game.currentState = 2;
        TG_Game.getInstance().changeItemIndexByPos(row1, col1, row2, col2);
        /*交换位置*/
        this.currentSetRect.SitePos.X = col2;
        this.currentSetRect.SitePos.Y = row2;
        this.nextSetRect.SitePos.X = col1;
        this.nextSetRect.SitePos.Y = row1;
        // 重置棋牌移动检查条件
        TG_Game.getInstance().changeDoMove();
        /*交换动画*/
        var time = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ItemExchangeAnimTime);
        egret.Tween.get(this.currentSetRect).to(p2, time);
        egret.Tween.get(this.nextSetRect).to(p1, time).wait(50).call(function () {
            if (this.currentSetRect) {
                egret.Tween.removeTweens(this.currentSetRect);
            }
            if (this.nextSetRect) {
                egret.Tween.removeTweens(this.nextSetRect);
            }
            /*调用是否可以进行交换位置 TG_Game IsCanExchange*/
            TG_Game.getInstance().IsCanExchange(row1, col1, row2, col2);
        }.bind(this), this);
    };
    /*不可以交换 还原位置的动画*/
    GamePanel_ItemSp.prototype.restorePositionMove = function () {
        /*还原位置*/
        var col1 = this.nextSetRect.SitePos.X, row1 = this.nextSetRect.SitePos.Y, col2 = this.currentSetRect.SitePos.X, row2 = this.currentSetRect.SitePos.Y;
        TG_Game.getInstance().changeItemIndexByPos(row1, col1, row2, col2);
        this.currentSetRect.SitePos.Y = row1;
        this.currentSetRect.SitePos.X = col1;
        this.nextSetRect.SitePos.Y = row2;
        this.nextSetRect.SitePos.X = col2;
        /*还原坐标*/
        var p1 = this.currentSetRect.getPosByRowCol(this.currentSetRect.SitePos.Y, this.currentSetRect.SitePos.X);
        var p2 = this.nextSetRect.getPosByRowCol(this.nextSetRect.SitePos.Y, this.nextSetRect.SitePos.X);
        var time = TG_TimeDefine.GetTimeDelay(TG_TimeDefine.ItemExchangeAnimTime) / 2;
        egret.Tween.get(this.currentSetRect).to(p1, time);
        egret.Tween.get(this.nextSetRect).to(p2, time).wait(50).call(function () {
            TG_Game.currentState = 1;
            if (this.currentSetRect) {
                egret.Tween.removeTweens(this.currentSetRect);
                this.currentSetRect = null;
            }
            if (this.nextSerRect) {
                egret.Tween.removeTweens(this.nextSerRect);
            }
        }.bind(this), this);
    };
    /*方块元素的晃动动画*/
    GamePanel_ItemSp.prototype.ItemWaggleMove = function (item, pos) {
        if (item.IsCanDrag) {
            var endPos = item.getPosByRowCol(pos.Y, pos.X);
            egret.Tween.get(item).to({ scaleY: .9, scaleX: 1.05 }, 300).to({ scaleY: .9 }, 100)
                .to({ scaleY: 1.1, scaleX: .95 }, 100).to({ scaleY: 1, scaleX: 1 }, 100)
                .to({ scaleY: .9 }, 100).to({ scaleY: 1.08, scaleX: .97 }, 100)
                .to({ scaleY: 1, scaleX: 1 }, 100).to({ x: endPos.x, y: endPos.y, alpha: 0 }, 600);
        }
        else {
            egret.Tween.get(item).to({ scaleY: .9, scaleX: 1.05 }, 300).to({ scaleY: .9 }, 100)
                .to({ scaleY: 1.1, scaleX: .95 }, 100).to({ scaleY: 1, scaleX: 1 }, 100)
                .to({ scaleY: .9 }, 100).to({ scaleY: 1.08, scaleX: .97 }, 100);
        }
    };
    /*移除本次消除的方块*/
    GamePanel_ItemSp.prototype.clearRect = function (index, arr) {
        /*动画状态*/
        // TG_Game.currentState = 2;
        for (var i in arr) {
            if (Number(i) == index) {
                var obj = arr[i];
                this.clearRectStartAni(obj.x + this.ItemsSp.x, obj.y + this.ItemsSp.y);
                obj.setItemNone(true);
                // obj.itemType = ItemType.TG_ITEM_TYPE_NONE;
                egret.Tween.removeTweens(obj);
                App.DisplayUtils.removeFromParent(obj);
                obj.Release();
            }
        }
    };
    /*移除铁丝网*/
    GamePanel_ItemSp.prototype.clearMesh = function (index) {
        /*动画状态*/
        // TG_Game.currentState = 2;
        var arr = TG_Game.Meshs;
        var _loop_2 = function (i) {
            if (Number(i) == index) {
                var obj_1 = arr[i];
                egret.Tween.get(obj_1).to({ scaleX: 1.2, scaleY: 1.2 }, 400).call(function () {
                    egret.Tween.removeTweens(obj_1);
                    App.DisplayUtils.removeFromParent(obj_1);
                    obj_1.Release();
                }.bind(this_2), this_2);
            }
        };
        var this_2 = this;
        for (var i in arr) {
            _loop_2(i);
        }
    };
    /* 移除当前地板块 */
    GamePanel_ItemSp.prototype.clearButtons = function (ButtonItem) {
        App.DisplayUtils.removeFromParent(ButtonItem);
        ButtonItem.Release();
        // let arr=TG_Game.Buttons;
        // for (let i in arr) {
        //     if (Number(i) == index) {
        //         let obj = arr[i];
        //         App.DisplayUtils.removeFromParent(ButtonItem.obj);
        //         obj.Release();
        //         return;
        //     }
        // }
    };
    GamePanel_ItemSp.prototype.clearAll = function () {
        this.removeSp_in(this.ItemsSp);
        this.removeSp_in(this.CaterpillarsSp);
        this.removeSp_in(this.BeltsSp);
        this.removeSp_in(this.BeltsColorSp);
        this.removeSp_in(this.ButtonsSp);
        this.removeSp_in(this.IcesSp);
        this.removeSp_in(this.MeshsSp);
        this.removeSp_in(this.CloudsSp);
        this.removeSp_in(this.RailingsSp);
        this.removeSp_in(this.HairBallSp);
        this.removeSp_in(this.MaxLayerSp);
        this.removeSp_in(this.PeaSp);
        this.removeSp_in(this.AnimationLayer);
        while (this.numChildren) {
            App.DisplayUtils.removeFromParent(this.getChildAt(0));
        }
    };
    GamePanel_ItemSp.prototype.removeSp_in = function (sp) {
        while (sp.numChildren) {
            var _sp = sp.getChildAt(0);
            egret.Tween.removeTweens(_sp);
            App.DisplayUtils.removeFromParent(_sp);
            _sp.Release();
        }
    };
    /*消除方块的爆炸动画*/
    GamePanel_ItemSp.prototype.clearRectStartAni = function (x, y) {
        var num = Math.floor(Math.random() * 3) + 4;
        var item = TG_ItemStar.getInstance();
        var _loop_3 = function (i) {
            var view = item.Create("bg4_png");
            this_3.addChild(view);
            Tool.getInstance().setAnchorPoint(view);
            view.alpha = 0;
            var r = Math.random() * 360;
            var dis = Math.random() * 40 + 10;
            var x1 = Math.cos(r * Math.PI / 180) * dis + x;
            var y1 = Math.sin(r * Math.PI / 180) * dis + y;
            var x2 = Math.cos(r * Math.PI / 180) * dis * 2 + x;
            var y2 = Math.sin(r * Math.PI / 180) * dis * 2 + y;
            view.scaleX = view.scaleY = .1;
            view.x = x;
            view.y = y;
            egret.Tween.get(view).to({ x: x1, y: y1, alpha: 1, scaleX: 1, scaleY: 1 }, 80).to({
                x: x2,
                y: y2,
                scaleX: .3,
                scaleY: .3,
                alpha: 0
            }, 200).call(function () {
                egret.Tween.removeTweens(view);
                App.DisplayUtils.removeFromParent(view);
                item.Release();
            }.bind(this_3), this_3);
        };
        var this_3 = this;
        for (var i = 0; i < num; i++) {
            _loop_3(i);
        }
    };
    /*元素块的掉落动画*/
    GamePanel_ItemSp.prototype.ItemDropPlay = function (item, dropPaths) {
        if (dropPaths === void 0) { dropPaths = null; }
        var dropPath = [];
        var isAddDelayTime = false;
        var repeatCount = TG_ItemAnimator.getInstance().CalculateDropDelayNum(item);
        for (var i = 0; i < dropPaths.length; i++) {
            var path = dropPaths[i];
            var obj = { "x": -100, "y": -100, "needDelayTime": false, "delayTime": 0 };
            // if(path["needDelayTime"]!=undefined&&path["needDelayTime"]==true&&!isAddDelayTime&&i==repeatCount){
            //      obj.needDelayTime=true;
            //      obj.delayTime=path["delayTime"];
            //      isAddDelayTime=true;
            //  }else if(i<repeatCount){
            //     if(path["needDelayTime"]!=undefined&&path["needDelayTime"]==true){
            //         path.Y=path.Y-1;
            //     }
            //     obj.needDelayTime=false;
            //     obj.delayTime=0;
            // }
            // else if(i>repeatCount){
            //     obj.needDelayTime=false;
            //     obj.delayTime=0;
            // }else {
            //      obj.needDelayTime=false;
            //      obj.delayTime=0;
            //  }
            if (dropPaths[repeatCount]["needDelayTime"] != undefined && dropPaths[repeatCount]["needDelayTime"] == true) {
                if (i == repeatCount) {
                    obj.needDelayTime = true;
                    obj.delayTime = path["delayTime"];
                    isAddDelayTime = true;
                }
                else if (i < repeatCount) {
                    path.Y = path.Y - 1;
                    obj.needDelayTime = false;
                    obj.delayTime = 0;
                }
                else if (i > repeatCount) {
                    obj.needDelayTime = false;
                    obj.delayTime = 0;
                }
                else {
                    obj.needDelayTime = false;
                    obj.delayTime = 0;
                }
            }
            else {
                obj.needDelayTime = false;
                obj.delayTime = 0;
            }
            var vx = item.getPosByRowCol(path.Y, path.X).x;
            var vy = item.getPosByRowCol(path.Y, path.X).y;
            obj.x = vx;
            obj.y = vy;
            dropPath.push(obj);
        }
        TG_ItemAnimator.getInstance().PlayDrop(item, dropPath, repeatCount);
        if (item.GetIsBullet()) {
            //如果是射线元素块
            var itemPos = item.GetBulletPos();
            var BlackHoles = TG_Game.getInstance().BlackHoles;
            for (var _i = 0, BlackHoles_1 = BlackHoles; _i < BlackHoles_1.length; _i++) {
                var temp = BlackHoles_1[_i];
                if (temp.StartBlockHolePos.X == itemPos.X && temp.StartBlockHolePos.Y == itemPos.Y) {
                    temp.SetStartBlockHolePos(item.SitePos);
                    TG_ItemAnimator.getInstance().PlayDrop(temp, dropPath, repeatCount);
                }
            }
        }
    };
    /*打乱棋盘的表演*/
    GamePanel_ItemSp.prototype.OnRefreshStage = function () {
        var items = TG_Game.Items;
        var _loop_4 = function (j) {
            var item = items[j];
            if (item == null || item.getItemNone())
                return "continue";
            if (!item.CheckCellCouldMove())
                return "continue";
            if (item.GetVenonatId() > 0)
                return "continue";
            if (!item.IsNormal())
                return "continue";
            var tween = egret.Tween.get(item);
            var xx = this_4.width / 2;
            var yy = this_4.height / 2;
            tween.to({ x: xx, y: yy }, 400);
            tween.wait(500);
            var pos = item.getPosByRowCol(item.SitePos.Y, item.SitePos.X);
            xx = pos.x;
            yy = pos.y;
            tween.to({ x: xx, y: yy }, 300);
            tween.call(function () {
                egret.Tween.removeTweens(item);
                TG_Game.SetGameState(true);
            }.bind(this_4), this_4);
        };
        var this_4 = this;
        for (var j = 0; j < items.length; j++) {
            _loop_4(j);
        }
    };
    return GamePanel_ItemSp;
}(BaseClassSprite));
__reflect(GamePanel_ItemSp.prototype, "GamePanel_ItemSp");
//# sourceMappingURL=GamePanel_ItemSp.js.map