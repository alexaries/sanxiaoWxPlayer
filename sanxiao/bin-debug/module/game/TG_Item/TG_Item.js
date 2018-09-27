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
 * Created by ZhangHui on 2018/6/4.
 */
var TG_Item = (function (_super) {
    __extends(TG_Item, _super);
    function TG_Item() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isDL = false;
        _this.isDetonate2 = false; //黑色毛球是否被引爆
        _this.itemWidth = ItemSize.size;
        /*（X,Y)=>>(列，行)*/
        /*位置*/
        _this.SitePos = { "X": -1, "Y": -1 };
        /*是否在爆炸*/
        _this.Exploding = false;
        /*掉落路径*/
        _this.DropPaths = [];
        _this.IsCalDropPath = false;
        /*是否是空块*/
        _this.isNoneItem = false;
        /*移动路径  会有重复点*/
        _this.ActionPaths = [];
        /*在本回合主动移动*/
        _this.MoveItem = false;
        /*标记这块移动完毕后去调用合成特殊块的逻辑*/
        _this.MarkedForExplodingCallfunc = false;
        /*特效块的类型*/
        _this.EffectType = Msg.EffectType.ET_none;
        /*是否被引爆*/
        _this.isDetonate = false;
        /*是否是鸟的飞行的目标快*/
        _this.IsBirdTarget = false;
        /* 是否和黑洞交换 并且 自己是非黑洞的特效块*/
        _this.isEffectExchangeWithBlack = false;
        /* 毛球块的Id*/
        _this.venonatId = 0;
        //爆炸延迟时间
        _this.DelayExplode = 0;
        //掉落延迟时间
        _this.DelayDrop = 0;
        /*是否是子弹形成的特效块*/
        _this.IsBullet = false;
        /*是否可以被周围的块爆炸而引爆*/
        _this.CanAroundDetonate = false;
        //消除块的类型 详情见xml里的配置
        _this._itemType = -1;
        //本身是否能被移动
        _this._isMove = true;
        //是否是功能块
        _this._isFunction = false;
        //功能块类型 暂定 1 加步数 2加时间
        _this._extendType = 0;
        //功能属性 加多少
        _this._extendParam = 0;
        // 消除快的生命值
        _this._life = 1;
        // 是否可以掉掉落
        _this._canFallDown = true;
        // 是否可以被特效穿过、击穿 如榛子
        _this._canThrough = true;
        //是否是冰块
        _this._isIces = false;
        //是否是流沙
        _this._isFlowIces = false;
        //是否在流动中（流沙）
        _this._IsFlow = false;
        //是否可以穿过底块
        _this._CanFallThrough = false;
        //是否是被毒液感染
        _this.IsInfectVenom = false;
        //是否是道具宝箱
        _this._isPropBox = false;
        //随机生成的道具id
        _this._propId = 0;
        //道具数量
        _this._propNum = 1;
        //下一个id
        _this._NextId = 0;
        /*RGB颜色值*/
        _this.portalColor = [];
        /* 传送带出入口方向 0 不显示无方向 1 方格上方显示方向向下  2 方格下方显示方向向上 3 方格左边显示方向向右 4 方格右边显示方向向左 */
        _this.direction = 0;
        // 是否创建过遮罩
        _this.isShape = false;
        /// 异步爆炸标识
        _this.IsAsyncExplode = false;
        //是否是被摆放的，随机打乱会用到这个参数，勿删 hdz
        _this.isBe_Placed = false;
        _this.MarkedCache = [];
        _this._AiMoveDiction = -1;
        _this._IsBirdPriorityTarget = true; //是否是风车的优先目标
        _this.ET_SecondBoom = false;
        //是否是黑洞的目标
        _this._IsBlackTarget = false;
        return _this;
    }
    TG_Item.prototype.selected = function (bool) {
        if (bool) {
            //
            if (this.select_btm == null)
                this.select_btm = TG_Object.Create("item_select_png");
            this.addChild(this.select_btm);
        }
        else {
            if (this.select_btm) {
                App.DisplayUtils.removeFromParent(this.select_btm);
            }
        }
    };
    /**
     * 创建遮罩层
     */
    TG_Item.prototype.createShape = function (viewSp, Y, X) {
        if (viewSp === void 0) { viewSp = GamePanel_ItemSp.getInstance().ItemsSp; }
        if (Y === void 0) { Y = this.SitePos.Y; }
        if (X === void 0) { X = this.SitePos.X; }
        if (!this.isShape) {
            this.shape = new egret.Shape();
            this.shape.graphics.beginFill(0xff0000);
            this.shape.graphics.drawRect(X, Y, this.width, this.height);
            this.shape.graphics.endFill();
            viewSp.addChild(this.shape);
            this.shape.x = this.x;
            this.shape.y = this.y;
            this.mask = this.shape;
            this.isShape = true;
            Tool.getInstance().setAnchorPoint(this.shape);
        }
    };
    TG_Item.prototype.removeShape = function (viewSp) {
        if (viewSp === void 0) { viewSp = GamePanel_ItemSp.getInstance().ItemsSp; }
        if (this.isShape) {
            if (this.mask) {
                this.mask = null;
            }
            if (this.shape) {
                this.shape.graphics.clear();
                TG_Object.Release(this.shape);
                viewSp.removeChild(this.shape);
                this.shape = null;
            }
            this.isShape = false;
        }
    };
    TG_Item.prototype.SetDirection = function (direction) {
        this.direction = direction;
    };
    TG_Item.prototype.GetDirection = function () {
        return this.direction;
    };
    Object.defineProperty(TG_Item.prototype, "NextId", {
        get: function () {
            return this._NextId;
        },
        set: function (num) {
            this._NextId = num;
        },
        enumerable: true,
        configurable: true
    });
    TG_Item.prototype.SetAsyncExplode = function (flag) {
        this.IsAsyncExplode = flag;
    };
    Object.defineProperty(TG_Item.prototype, "isPropBox", {
        get: function () {
            return this._isPropBox;
        },
        set: function (val) {
            this._isPropBox = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "propId", {
        get: function () {
            return this._propId;
        },
        set: function (val) {
            this._propId = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "propNum", {
        get: function () {
            return this._propNum;
        },
        set: function (val) {
            this._propNum = val;
        },
        enumerable: true,
        configurable: true
    });
    TG_Item.prototype.Create = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    Object.defineProperty(TG_Item.prototype, "AiMoveDiction", {
        get: function () {
            return this._AiMoveDiction;
        },
        set: function (num) {
            this._AiMoveDiction = num;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  初始化图片宽高
     * @param img
     */
    TG_Item.prototype.initItemW_H = function () {
        this.itemWidth = ItemSize.size;
        this.item.width = this.itemWidth;
        this.item.height = this.itemWidth;
    };
    TG_Item.prototype.changeText = function () {
        var age = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            age[_i] = arguments[_i];
        }
    };
    TG_Item.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    Object.defineProperty(TG_Item.prototype, "IsBirdPriorityTarget", {
        get: function () {
            return this._IsBirdPriorityTarget;
        },
        /*==========成员函数=============*/
        /*是否是风车的优先目标*/
        set: function (flag) {
            this._IsBirdPriorityTarget = flag;
        },
        enumerable: true,
        configurable: true
    });
    /*获取是否被毒液感染*/
    TG_Item.prototype.GetIsInfectVenom = function () {
        return this.IsInfectVenom;
    };
    /*设置是否是被毒液感染*/
    TG_Item.prototype.SetIsInfectVenom = function (flag) {
        this.IsInfectVenom = flag;
    };
    Object.defineProperty(TG_Item.prototype, "IsFect", {
        /*是否是传染块*/
        get: function () {
            return this.itemType == ItemType.TG_ITEM_TYPE_INFECT;
        },
        enumerable: true,
        configurable: true
    });
    /*是否可以移动*/
    TG_Item.prototype.CheckCellCouldMove = function () {
        return this.isMove && TG_Game.getInstance().CheckCellCouldMove(this);
    };
    /*是否是X的空块*/
    TG_Item.prototype.IsItemNull = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_NULL;
    };
    /*是否是穿透块*/
    TG_Item.prototype.IsItemCross = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_CROSS;
    };
    /*是否是铁丝网*/
    TG_Item.prototype.IsItemMesh = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_MESH;
    };
    /*是否是冰层*/
    TG_Item.prototype.IsItemIce = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_ICE;
    };
    /*是否是银币*/
    TG_Item.prototype.IsItemNust = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_NUST;
    };
    /*是否是砂层*/
    TG_Item.prototype.IsItemFlowice = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_FLOWICE;
    };
    /*是否是礼品盒*/
    TG_Item.prototype.IsItemGift = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_GIFT;
    };
    /*是否是云层块*/
    TG_Item.prototype.IsCloud = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_CLOUD;
    };
    /*是否是填充块
     */
    TG_Item.prototype.IsItemNone = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_NONE;
    };
    /**
     * 是否是毛球
     * @constructor
     */
    TG_Item.prototype.IsHairBall = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_VENONAT;
    };
    /**
     *  是否是月饼
     *  @constructor
     */
    TG_Item.prototype.IsTypePea = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_PEA;
    };
    /**
     * 是否是毒液
     * @returns {ItemType}
     * @constructor
     */
    TG_Item.prototype.IsVenom = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_VENOM;
    };
    /*是否是变色块*/
    TG_Item.prototype.IsItemDisColor = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR;
    };
    /*是否是魔法石*/
    TG_Item.prototype.IsItemMagicStone = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_MAGICSTONE;
    };
    /**
     * 是否是毛球
     * @returns {ItemType}
     * @constructor
     */
    TG_Item.prototype.IsVenonat = function () {
        return this.venonatId != 0;
    };
    /**
     * 是否是钻石块
     * @returns {ItemType}
     * @constructor
     */
    TG_Item.prototype.IsItemGem = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_GEM;
    };
    /**
     * 是否是普通块
     * @returns {boolean}
     * @constructor
     */
    TG_Item.prototype.IsNormal = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_NORMAL || this.itemType == ItemType.TG_ITEM_TYPE_EFFECT;
    };
    /**
     * 是否是特效块
     */
    TG_Item.prototype.IsEffect = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_EFFECT;
    };
    Object.defineProperty(TG_Item.prototype, "IsCanDrag", {
        /**
         *  是否可以被拖动 是否有高层快固定
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return !TG_Game.getInstance().CheckHasHighItems(this.Index) && this.isMove;
        },
        enumerable: true,
        configurable: true
    });
    /*检测阻碍某个方向是否的移动
     * <param name="direction"> 1-2-3-4 : 上-下-左-右</param>
     * */
    TG_Item.prototype.CheckStopMove = function (direction) {
        return false;
    };
    //是否可以被周围的块爆炸引爆
    TG_Item.prototype.IsCanAroundDetonate = function (flag) {
        return this.CanAroundDetonate;
    };
    TG_Item.prototype.SetIsCanAroundDetonate = function (flag) {
        this.CanAroundDetonate = flag;
    };
    //是否可以垂直掉落
    TG_Item.prototype.CheckCellVerticalFallDown = function () {
        return this.canFallDown && TG_Game.getInstance().CheckCellVerticalFallDown(this);
    };
    //自己可以下落
    TG_Item.prototype.CheckCellFallDown = function () {
        return this.canFallDown && TG_Game.getInstance().CheckCellFallDown(this);
    };
    //普通爆炸
    TG_Item.prototype.DoExplode = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    //异步爆炸
    TG_Item.prototype.DoAsyncExplode = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    //引爆
    TG_Item.prototype.DoDetonate = function () {
        this.SetDetonate(true);
        this.DoExplode();
    };
    TG_Item.prototype.SetIsBullet = function (flag) {
        this.IsBullet = flag;
    };
    TG_Item.prototype.GetIsBullet = function () {
        return this.IsBullet;
    };
    TG_Item.prototype.GetVenonatId = function () {
        return this.venonatId;
    };
    TG_Item.prototype.SetVenonatId = function (venonatId) {
        this.venonatId = venonatId;
    };
    TG_Item.prototype.GetIsBirdTarget = function () {
        return this.IsBirdTarget;
    };
    TG_Item.prototype.SetIsBirdTarget = function (flag) {
        this.IsBirdTarget = flag;
    };
    TG_Item.prototype.SetEffectType = function (type) {
        this.EffectType = type;
    };
    TG_Item.prototype.GetEffectType = function () {
        return this.EffectType;
    };
    TG_Item.prototype.IsItemEffect = function () {
        if (this.EffectType != Msg.EffectType.ET_none) {
            return true;
        }
        return false;
    };
    //0 ET_Hor    1 ET_Vel  2黑洞 3炸弹  4风车
    TG_Item.prototype.IsEffectBlack = function () {
        if (this.EffectType == Msg.EffectType.ET_Black) {
            return true;
        }
        return false;
    };
    TG_Item.prototype.IsItemNormal = function () {
        if (this.itemType == ItemType.TG_ITEM_TYPE_NORMAL) {
            return true;
        }
        return false;
    };
    TG_Item.prototype.IsEffectVel = function () {
        if (this.EffectType == Msg.EffectType.ET_Vel) {
            return true;
        }
        return false;
    };
    TG_Item.prototype.IsEffectHor = function () {
        if (this.EffectType == Msg.EffectType.ET_Hor) {
            return true;
        }
        return false;
    };
    TG_Item.prototype.IsEffectGold = function () {
        if (this.EffectType == Msg.EffectType.ET_Gold) {
            return true;
        }
        return false;
    };
    TG_Item.prototype.IsEffectBird = function () {
        if (this.EffectType == Msg.EffectType.ET_Bird) {
            return true;
        }
        return false;
    };
    //是否是栏杆
    TG_Item.prototype.IsItemRailing = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_RAILING;
    };
    TG_Item.prototype.SetItemWidth = function (wid) {
        wid = ItemSize.size;
        this.itemWidth = wid;
    };
    TG_Item.prototype.GetItemWidth = function () {
        return this.itemWidth;
    };
    TG_Item.prototype.SetSitPos = function (col, row) {
        this.SitePos.X = col;
        this.SitePos.Y = row;
    };
    TG_Item.prototype.GetSitPos = function () {
        return this.SitePos;
    };
    TG_Item.prototype.SetColorType = function (color) {
        this.Color = Number(color);
    };
    TG_Item.prototype.GetColorType = function () {
        return this.Color;
    };
    TG_Item.prototype.GetColorTypeByBlockId = function () {
        return this.Color;
    };
    TG_Item.prototype.SetBlockId = function (id) {
        this.BlockId = Number(id);
    };
    TG_Item.prototype.GetBlockId = function () {
        return this.BlockId;
    };
    //横向相同元素数量赋值
    TG_Item.prototype.SetMarkedHor = function (num) {
        this.MarkedHor = num;
    };
    //获取横向相同元素的数量
    TG_Item.prototype.GetMarkedHor = function () {
        return this.MarkedHor;
    };
    //纵向相同元素数量赋值
    TG_Item.prototype.SetMarkedVel = function (num) {
        this.MarkedVel = num;
    };
    //获取纵向相同元素的数量
    TG_Item.prototype.GetMarkedVel = function () {
        return this.MarkedVel;
    };
    //设置是否爆炸
    TG_Item.prototype.SetExploding = function (flag) {
        this.Exploding = flag;
    };
    //获取是否在爆炸
    TG_Item.prototype.GetExploding = function () {
        return this.Exploding;
    };
    TG_Item.prototype.GetItemIndex = function (colNum) {
        return this.SitePos.Y * colNum + this.SitePos.X;
    };
    /*添加掉落路径*/
    TG_Item.prototype.AddDropPath = function (vec2, bool) {
        if (bool === void 0) { bool = true; }
        if (bool) {
            if (JSON.stringify(this.DropPaths).indexOf(JSON.stringify(vec2)) == -1) {
                //-1 代表数组中没有当前的这个对象
                var pos = void 0;
                if (vec2.delayTime != undefined)
                    pos = { "X": vec2.X, "Y": vec2.Y, "needDelayTime": vec2.needDelayTime, "delayTime": vec2.delayTime };
                else {
                    pos = { "X": vec2.X, "Y": vec2.Y, "needDelayTime": false, "delayTime": 0 };
                }
                this.DropPaths.push(pos);
            }
        }
        else {
            var pos = void 0;
            if (vec2.delayTime != undefined)
                pos = { "X": vec2.X, "Y": vec2.Y, "needDelayTime": vec2.needDelayTime, "delayTime": vec2.delayTime };
            else {
                pos = { "X": vec2.X, "Y": vec2.Y, "needDelayTime": false, "delayTime": 0 };
            }
            this.DropPaths.push(pos);
        }
    };
    /*移除掉落路径*/
    TG_Item.prototype.RemoveDropPath = function (vec2) {
        for (var i = this.DropPaths.length - 1; i >= 0; i--) {
            if (this.DropPaths[i].X == vec2.X && this.DropPaths[i].Y == vec2.Y) {
                this.DropPaths.splice(i, 1);
            }
        }
    };
    /*设置方块是否空块*/
    TG_Item.prototype.setItemNone = function (flag) {
        this.isNoneItem = flag;
    };
    /*获取方块是否是空块*/
    TG_Item.prototype.getItemNone = function () {
        return this.isNoneItem;
    };
    /*添加移动路径*/
    TG_Item.prototype.AddActionPath = function (vec2) {
        this.ActionPaths.push(vec2);
    };
    TG_Item.prototype.AddActionPathToo = function () {
        if (this.ActionPaths.length <= 0) {
            var pos = this.DropPaths[0];
            pos = { X: pos.X, Y: pos.Y };
            this.ActionPaths.push(pos);
        }
        else {
            var pos = this.ActionPaths[this.ActionPaths.length - 1];
            pos = { X: pos.X, Y: pos.Y };
            this.ActionPaths.push(pos);
        }
    };
    TG_Item.prototype.getPosByRowCol = function (Y, X) {
        var x, y, pos = { x: 0, y: 0 };
        var baseY = TG_Game.getInstance().curRollRow - 9;
        x = X * (this.itemWidth + 1.5) + this.itemWidth / 2;
        y = (Y + baseY) * (this.itemWidth + 1.5) + this.itemWidth / 2;
        pos.x = x;
        pos.y = y;
        return pos;
    };
    /**
     * 根据Index获取Pos
     */
    TG_Item.prototype.GetPosByIndex = function (index) {
        var x, y, pos = { x: 0, y: 0 };
        x = Number(index) % 9;
        y = Math.floor(Number(index) / 9);
        pos.x = x;
        pos.y = y;
        return pos;
    };
    Object.defineProperty(TG_Item.prototype, "Index", {
        get: function () {
            return this.SitePos.Y * TG_Game.getInstance().ColNum + this.SitePos.X;
        },
        enumerable: true,
        configurable: true
    });
    TG_Item.prototype.CheckMatchSpecial = function () {
        if (this.MarkedAlready) {
            return false;
        }
        return true;
    };
    TG_Item.prototype.SetMoveItem = function (flag) {
        this.MoveItem = flag;
    };
    TG_Item.prototype.GetMoveItem = function () {
        return this.MoveItem;
    };
    TG_Item.prototype.SetDetonateColor = function (color) {
        this.DetonateColor = color;
    };
    TG_Item.prototype.GetDetonateColor = function () {
        return this.DetonateColor;
    };
    TG_Item.prototype.SetDetonate = function (flag) {
        this.isDetonate = flag;
    };
    TG_Item.prototype.GetDetonate = function () {
        return this.isDetonate;
    };
    TG_Item.prototype.SetDetonate2 = function (flag) {
        this.isDetonate2 = flag;
    };
    TG_Item.prototype.GetDetonate2 = function () {
        return this.isDetonate2;
    };
    Object.defineProperty(TG_Item.prototype, "isFunction", {
        get: function () {
            return this._isFunction;
        },
        set: function (bool) {
            this._isFunction = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "extendType", {
        get: function () {
            return this._extendType;
        },
        set: function (_type) {
            this._extendType = _type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "extendParam", {
        get: function () {
            return this._extendParam;
        },
        set: function (_num) {
            this._extendParam = _num;
        },
        enumerable: true,
        configurable: true
    });
    TG_Item.prototype.IsItemSecondBoom = function () {
        if (this.IsItemEffect()) {
            return this.ET_SecondBoom;
        }
        return false;
    };
    Object.defineProperty(TG_Item.prototype, "itemType", {
        get: function () {
            return this._itemType;
        },
        set: function (_type) {
            this._itemType = _type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "isMove", {
        get: function () {
            return this._isMove;
        },
        set: function (bool) {
            this._isMove = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "life", {
        get: function () {
            return this._life;
        },
        set: function (_num) {
            this._life = _num;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "canFallDown", {
        get: function () {
            return this._canFallDown;
        },
        set: function (bool) {
            this._canFallDown = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "canThrough", {
        get: function () {
            return this._canThrough;
        },
        set: function (bool) {
            this._canThrough = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "isIces", {
        get: function () {
            return this._isIces;
        },
        set: function (bool) {
            this._isIces = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "isFlow", {
        get: function () {
            return this._IsFlow;
        },
        set: function (bool) {
            this._IsFlow = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "isFlowIces", {
        get: function () {
            return this._isFlowIces;
        },
        set: function (bool) {
            this._isFlowIces = bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Item.prototype, "CanFallThrough", {
        get: function () {
            return this._CanFallThrough;
        },
        set: function (bool) {
            this._CanFallThrough = bool;
        },
        enumerable: true,
        configurable: true
    });
    /*允许掉落进去的一层标识*/
    TG_Item.prototype.IsCanEnterButton = function () {
        return this.itemType == ItemType.TG_ITEM_TYPE_BLANK || this.itemType == ItemType.TG_ITEM_TYPE_PEAPIT || this.itemType == ItemType.TG_ITEM_TYPE_INFECT;
    };
    Object.defineProperty(TG_Item.prototype, "IsBlackTarget", {
        get: function () {
            return this._IsBlackTarget;
        },
        set: function (flag) {
            this._IsBlackTarget = flag;
        },
        enumerable: true,
        configurable: true
    });
    return TG_Item;
}(BaseClassSprite));
__reflect(TG_Item.prototype, "TG_Item");
//# sourceMappingURL=TG_Item.js.map