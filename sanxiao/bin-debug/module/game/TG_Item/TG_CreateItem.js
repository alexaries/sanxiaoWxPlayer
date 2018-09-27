var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/6/11.
 */
var TG_CreateItem = (function () {
    function TG_CreateItem() {
    }
    /**
     * 创建底板层 第一层
     */
    TG_CreateItem.CreateButton = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_NULL) {
            //空块
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        else {
            item = new TG_ItemBgButton();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
    * 创建毛虫层 第二层
    *
    */
    TG_CreateItem.CreateCaterpillars = function (id, row, col, preIndex, curIndex, behindIndex) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        if (preIndex === void 0) { preIndex = -1; }
        if (curIndex === void 0) { curIndex = -1; }
        if (behindIndex === void 0) { behindIndex = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = parseInt(obj.itemType);
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_NONE) {
            //空块
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        else {
            item = new TG_ItemCaterpillars();
            item.Create(id, row, col, preIndex, curIndex, behindIndex);
        }
        return item;
    };
    /**
     * 创建冰层 第三层
     */
    TG_CreateItem.CreateIces = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_ICE) {
            item = new TG_ItemIces();
            item.Create(id, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_FLOWICE) {
            item = new TG_ItemFlowIce();
            item.Create(id, row, col);
        }
        else if (itemType == 0) {
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
     * 创建消除块层 第四层
     * @constructor
     * Id2 消除块
     * Id7 毛球块
     */
    TG_CreateItem.CreateItems = function (Id2, Id7, row, col, EffectType) {
        if (Id7 === void 0) { Id7 = -1; }
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        if (EffectType === void 0) { EffectType = Msg.EffectType.ET_none; }
        var obj = TG_MapData.getInstance().mapConfigData[Id2];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_NORMAL || itemType == ItemType.TG_ITEM_TYPE_EFFECT || itemType == ItemType.TG_ITEM_TYPE_CHANGECOLOUR) {
            //普通快(包含变色块) 特效块
            var EffectType_1 = Msg.EffectType.ET_none;
            EffectType_1 = TG_Blocks.GetEffectByLayerid(Id2);
            item = new TG_ItemEffect();
            item.Create(Id2, Id7, row, col, EffectType_1);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_GEM) {
            //宝石
            item = new TG_ItemGem();
            item.Create(Id2, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_PEA) {
            //皇冠 月饼
            item = new TG_ItemPea();
            item.Create(Id2, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_GIFT) {
            //礼品盒
            item = new TG_ItemGift();
            item.Create(Id2, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_NUST) {
            //榛子
            item = new TG_ItemHazel();
            item.Create(Id2, row, col);
        }
        else if (itemType == 13) {
            //道具宝箱
            item = new TG_PropBox();
            item.Create(Id2, row, col);
        }
        else if (itemType == 19) {
            // 小恶魔
            item = new TG_ItemVenom();
            item.Create(Id2, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_MAGICSTONE) {
            //魔法石
            item = new TG_ItemMagicStone();
            item.Create(Id2, row, col);
        }
        else if (itemType == ItemType.TG_ITEM_TYPE_EGG) {
            //鸡蛋块
            item = new TG_ItemEgg();
            item.Create(Id2, row, col);
        }
        if (Id2 == -1) {
            item = new TG_ItemNull();
            item.Create(Id2, row, col);
        }
        return item;
    };
    /**
     * 铁丝网层 第五层
     *
     */
    TG_CreateItem.CreateMeshs = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_MESH) {
            item = new TG_ItemMeshs();
            item.Create(id, row, col);
        }
        else {
            //填充物
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
     * 创建毛球 第7层
     */
    TG_CreateItem.CreateHairBall = function (id7, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var hairBallItem = new TG_ItemHairBall();
        hairBallItem.Create(id7, row, col);
        return hairBallItem;
    };
    /**
     * 创建栏杆层 第6层
     *
     */
    TG_CreateItem.CreateRailings = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var item;
        if (id == -1) {
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        else {
            item = new TG_ItemRailings();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
     * 创建云层 第八层
     */
    TG_CreateItem.CreateClouds = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_CLOUD) {
            item = new TG_ItemClouds();
            item.Create(id, row, col);
        }
        else {
            //填充物
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
     * 创建皇冠层 第九层
     */
    TG_CreateItem.CreatePea = function (id, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_PEAPIT) {
            item = new TG_ItemPeaPii();
            item.Create(id, row, col);
        }
        else {
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    TG_CreateItem.CreateOneCellBelts = function (num, row, col) {
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        // 2346 2347
        // num = 12;
        var id = 0;
        if (num >= 1 && num <= 4) {
            id = 2346;
        }
        else if (num >= 5 && num <= 12) {
            id = 2347;
        }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_PORTAL) {
            item = new TG_ItemBelts();
            item.Create(id, row, col);
            // 1 左右方向 2 右左方向 3 上下方向 4 下上方向 5 左上方向 6 上左方向 7 右上方向 8 上右方向 9 左下方向 10 下左方向 11 右下方向 12 下右方向
            if (num == 1) {
                item.rotation = -90;
            }
            else if (num == 2) {
                item.rotation = 90;
            }
            else if (num == 3) {
                item.rotation = 0;
            }
            else if (num == 4) {
                item.rotation = 180;
            }
            else if (num == 5) {
                item.rotation = 90;
            }
            else if (num == 6) {
                item.scaleY = -1;
            }
            else if (num == 7) {
                item.scaleY = -1;
                item.rotation = 90;
            }
            else if (num == 8) {
                item.rotation = -180;
            }
            else if (num == 9) {
                item.scaleY = -1;
                item.rotation = -90;
            }
            else if (num == 10) {
                item.rotation = 0;
            }
            else if (num == 11) {
                item.rotation = -90;
            }
            else if (num == 12) {
                item.scaleX = -1;
            }
        }
        else {
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    /**
     * 传送带入口和出口创建
     * type 0 - 5 红 蓝 紫 绿 黄 橙
     * direction 方向 1 上 2 下 3 左 4 右
     */
    TG_CreateItem.CreateOneCellBeltsColor = function (id, direction, row, col) {
        if (direction === void 0) { direction = 1; }
        if (row === void 0) { row = -1; }
        if (col === void 0) { col = -1; }
        //2340-2345
        if (id < 2340 && id > 2345) {
            return;
        }
        var obj = TG_MapData.getInstance().mapConfigData[id];
        var itemType = obj.itemType;
        var item;
        if (itemType == ItemType.TG_ITEM_TYPE_PORTAL_COLOR) {
            item = new TG_ItemBeltsColor();
            item.Create(id, direction, row, col);
            if (direction == 1) {
                item.rotation = 180;
            }
            else if (direction == 2) {
                item.rotation = 0;
            }
            else if (direction == 3) {
                item.rotation = 90;
            }
            else if (direction == 4) {
                item.rotation = -90;
            }
        }
        else {
            item = new TG_ItemNull();
            item.Create(id, row, col);
        }
        return item;
    };
    return TG_CreateItem;
}());
__reflect(TG_CreateItem.prototype, "TG_CreateItem");
//# sourceMappingURL=TG_CreateItem.js.map