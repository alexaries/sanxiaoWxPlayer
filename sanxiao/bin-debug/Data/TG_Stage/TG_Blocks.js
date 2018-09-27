var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/6/28.
 *
 * 记录相同的方块重复出现次数实体，便于方块去重复
 */
var TG_Blocks = (function () {
    function TG_Blocks() {
        // layerId 所属于的层 默认是2层块
        this.layer = 2;
        // 方块的序号
        this.cellNum = 0;
        // 方块行相同数
        this.rowSameNum = 0;
        // 方块列相同数
        this.colSameNum = 0;
        // 是否是随机 (0 不是随机块 1 是随机块)
        this.isRandom = 0;
    }
    // 函数体
    TG_Blocks.prototype.setLayerId = function (layerId) {
        this.layerId = layerId;
    };
    TG_Blocks.prototype.getLayerId = function () {
        return this.layerId;
    };
    TG_Blocks.prototype.setLayer = function (layer) {
        this.layer = layer;
    };
    TG_Blocks.prototype.getLayer = function () {
        return this.layer;
    };
    TG_Blocks.prototype.setRow = function (row) {
        this.row = row;
    };
    TG_Blocks.prototype.getRow = function () {
        return this.row;
    };
    TG_Blocks.prototype.setCol = function (col) {
        this.col = col;
    };
    TG_Blocks.prototype.getCol = function () {
        return this.col;
    };
    TG_Blocks.prototype.setCellNum = function (cellNum) {
        this.cellNum = cellNum;
    };
    TG_Blocks.prototype.getCellNum = function () {
        return this.cellNum;
    };
    TG_Blocks.prototype.setRowSameNum = function (rowSameNum) {
        this.rowSameNum = rowSameNum;
    };
    TG_Blocks.prototype.getRowSameNum = function () {
        return this.rowSameNum;
    };
    TG_Blocks.prototype.setColSameNum = function (colSameNum) {
        this.colSameNum = colSameNum;
    };
    TG_Blocks.prototype.getColSameNum = function () {
        return this.colSameNum;
    };
    TG_Blocks.prototype.setIsRandom = function (isRandom) {
        this.isRandom = isRandom;
    };
    TG_Blocks.prototype.getIsRandom = function () {
        return this.isRandom;
    };
    // 2001-2006 普通块 2011-2016 横消  2021-2026 竖消 2098 黑洞块 2031-2036 炸弹块 2041-2046 风车快/鸟/fish
    TG_Blocks.GetBlockIdByEffectTypeAndColor = function (EffectType, color) {
        var layerid = -1;
        if (EffectType == Msg.EffectType.ET_Hor) {
            layerid = 2010 + color;
        }
        else if (EffectType == Msg.EffectType.ET_Vel) {
            layerid = 2020 + color;
        }
        else if (EffectType == Msg.EffectType.ET_Gold) {
            layerid = 2030 + color;
        }
        else if (EffectType == Msg.EffectType.ET_Bird) {
            layerid = 2040 + color;
        }
        return layerid;
    };
    TG_Blocks.GetEffectByLayerid = function (layerid) {
        var EffectType = Msg.EffectType.ET_none;
        if (layerid >= 2011 && layerid <= 2016) {
            //横消块 2011-2016
            EffectType = Msg.EffectType.ET_Hor;
        }
        else if (layerid == 2098) {
            //黑洞块   2098
            EffectType = Msg.EffectType.ET_Black;
        }
        else if (layerid >= 2031 && layerid <= 2036) {
            //炸弹块 2031-2036
            EffectType = Msg.EffectType.ET_Gold;
        }
        else if (layerid >= 2041 && layerid <= 2046) {
            //风车 2041-2046
            EffectType = Msg.EffectType.ET_Bird;
        }
        else if (layerid >= 2021 && layerid <= 2026) {
            //纵消块 2021-2026
            EffectType = Msg.EffectType.ET_Vel;
        }
        // else if (layerid>=2600 && layerid <= 2606) {
        //     // 变色块 2600 - 2606
        //     EffectType=Msg.EffectType.ET_ChangeColor;
        // }
        return EffectType;
    };
    return TG_Blocks;
}());
__reflect(TG_Blocks.prototype, "TG_Blocks");
/*元素块的类型*/
var ItemType;
(function (ItemType) {
    ItemType[ItemType["TG_ITEM_TYPE_NONE"] = 0] = "TG_ITEM_TYPE_NONE";
    ItemType[ItemType["TG_ITEM_TYPE_NULL"] = 1] = "TG_ITEM_TYPE_NULL";
    ItemType[ItemType["TG_ITEM_TYPE_BLANK"] = 2] = "TG_ITEM_TYPE_BLANK";
    ItemType[ItemType["TG_ITEM_TYPE_CROSS"] = 3] = "TG_ITEM_TYPE_CROSS";
    ItemType[ItemType["TG_ITEM_TYPE_INFECT"] = 4] = "TG_ITEM_TYPE_INFECT";
    ItemType[ItemType["TG_ITEM_TYPE_PEAPIT"] = 5] = "TG_ITEM_TYPE_PEAPIT";
    ItemType[ItemType["TG_ITEM_TYPE_NORMAL"] = 10] = "TG_ITEM_TYPE_NORMAL";
    ItemType[ItemType["TG_ITEM_TYPE_EFFECT"] = 11] = "TG_ITEM_TYPE_EFFECT";
    ItemType[ItemType["TG_ITEM_TYPE_GIFT"] = 12] = "TG_ITEM_TYPE_GIFT";
    ItemType[ItemType["TG_ITEM_TYPE_TOOLBOX"] = 13] = "TG_ITEM_TYPE_TOOLBOX";
    ItemType[ItemType["TG_ITEM_TYPE_NUST"] = 14] = "TG_ITEM_TYPE_NUST";
    ItemType[ItemType["TG_ITEM_TYPE_MAGICSTONE"] = 15] = "TG_ITEM_TYPE_MAGICSTONE";
    ItemType[ItemType["TG_ITEM_TYPE_EGG"] = 16] = "TG_ITEM_TYPE_EGG";
    ItemType[ItemType["TG_ITEM_TYPE_PEA"] = 17] = "TG_ITEM_TYPE_PEA";
    ItemType[ItemType["TG_ITEM_TYPE_GEM"] = 18] = "TG_ITEM_TYPE_GEM";
    ItemType[ItemType["TG_ITEM_TYPE_VENOM"] = 19] = "TG_ITEM_TYPE_VENOM";
    ItemType[ItemType["TG_ITEM_TYPE_CHANGECOLOUR"] = 20] = "TG_ITEM_TYPE_CHANGECOLOUR";
    ItemType[ItemType["TG_ITEM_TYPE_ICE"] = 30] = "TG_ITEM_TYPE_ICE";
    ItemType[ItemType["TG_ITEM_TYPE_FLOWICE"] = 31] = "TG_ITEM_TYPE_FLOWICE";
    ItemType[ItemType["TG_ITEM_TYPE_MESH"] = 41] = "TG_ITEM_TYPE_MESH";
    ItemType[ItemType["TG_ITEM_TYPE_CLOUD"] = 51] = "TG_ITEM_TYPE_CLOUD";
    ItemType[ItemType["TG_ITEM_TYPE_RAILING"] = 61] = "TG_ITEM_TYPE_RAILING";
    ItemType[ItemType["TG_ITEM_TYPE_VENONAT"] = 71] = "TG_ITEM_TYPE_VENONAT";
    ItemType[ItemType["TG_ITEM_TYPE_CATERPILLAR"] = 81] = "TG_ITEM_TYPE_CATERPILLAR";
    ItemType[ItemType["TG_ITEM_TYPE_PORTAL"] = 82] = "TG_ITEM_TYPE_PORTAL";
    ItemType[ItemType["TG_ITEM_TYPE_PORTAL_COLOR"] = 83] = "TG_ITEM_TYPE_PORTAL_COLOR"; //传送带颜色
})(ItemType || (ItemType = {}));
/*元素块的尺寸*/
var ItemSize;
(function (ItemSize) {
    ItemSize[ItemSize["size"] = 110] = "size";
})(ItemSize || (ItemSize = {}));
//# sourceMappingURL=TG_Blocks.js.map