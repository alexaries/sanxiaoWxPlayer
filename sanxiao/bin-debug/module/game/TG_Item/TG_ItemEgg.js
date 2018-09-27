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
 * 鸡蛋块
 */
var TG_ItemEgg = (function (_super) {
    __extends(TG_ItemEgg, _super);
    /*普通元素块*/
    function TG_ItemEgg() {
        return _super.call(this) || this;
    }
    /**
     * 获取鸡蛋块下标
     * @param layeridNumber
     */
    TG_ItemEgg.getEggIndex = function (layeridNumber) {
        for (var eggIndex in this.TG_EGG_Lst) {
            if (this.TG_EGG_Lst[eggIndex] == layeridNumber) {
                return Number(eggIndex);
            }
        }
        return null;
    };
    /**
     * 根据layerid获取是否生成普通块
     */
    TG_ItemEgg.isCreateEleByLayerId = function (layeridNumber) {
        var layeridIndex = this.getEggIndex(layeridNumber);
        if (Number(layeridIndex) >= 0) {
            if (layeridIndex % 3 == 0) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };
    /**
     * 获取下一个鸡蛋块layerid
     * @param layeridNumber
     */
    TG_ItemEgg.getNextEggLayerIdByEggLayerId = function (layeridNumber) {
        var layeridIndex = this.getEggIndex(layeridNumber);
        if (Number(layeridIndex) >= 0) {
            if (layeridIndex % 3 == 0) {
                layeridIndex += 2;
            }
            else {
                layeridIndex--;
            }
            return this.TG_EGG_Lst[layeridIndex];
        }
        return null;
    };
    /**
     * 获取鸡蛋块的生命值
     * @param layeridNumber
     */
    TG_ItemEgg.getEggLifeByEggLayerId = function (layeridNumber) {
        var layeridIndex = this.getEggIndex(layeridNumber);
        if (Number(layeridIndex) >= 0) {
            var life = layeridIndex % 3;
            return life + 1;
        }
        return 0;
    };
    TG_ItemEgg.prototype.Create = function (layerid, row, col) {
        //layerid
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = false;
        this.life = TG_ItemEgg.getEggLifeByEggLayerId(Number(layeridStr));
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(true);
        this.canFallDown = obj.canFallDown == "0" ? false : true;
        var color = obj.color;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.text = new ImageTextShow().drawText(this.item.width, this.item.height);
        if (this.text) {
            this.addChild(this.text);
        }
        this.initItemW_H(); //初始化宽高
        return this.item;
    };
    /*普通爆炸*/
    TG_ItemEgg.prototype.DoExplode = function () {
        // this.life -= 1;
        // 游戏中，飞到消除目标位置的动画
        // TG_Game.getInstance().ItemFlyToGoal(this);
        //加分数
        // TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeCloud);
        // console.info("================12334567==================");
        // console.info(this.life);
        // console.info(123456);
        // console.info(TG_Game.IsPlayerDoMoveByEgg);
        if (TG_Game.IsPlayerDoMoveByEgg) {
            TG_Game.IsPlayerDoMoveByEgg = false;
            var color = this.Color;
            this.life -= 1;
            if (this.life == 0) {
                this.life = 3;
            }
            if (this.life > 0) {
                var isCreateEle = TG_ItemEgg.isCreateEleByLayerId(this.BlockId);
                var nextEggLayerId = TG_ItemEgg.getNextEggLayerIdByEggLayerId(this.BlockId);
                this.BlockId = nextEggLayerId;
                if (nextEggLayerId) {
                    TG_Game.currentState = 2;
                    if (isCreateEle) {
                        var geneLayerid = 2000 + Number(color);
                        TG_Game.getInstance().createElementItemForEgg(geneLayerid, this, Msg.EffectType.ET_none);
                    }
                    // 生成另一个块
                    this.item.texture = RES.getRes(LoadNetworkImageUtils.getResNameByLayerId(nextEggLayerId));
                    TG_Game.currentState = 1;
                }
            }
        }
    };
    /*移除对象*/
    TG_ItemEgg.prototype.Release = function () {
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
    };
    /*改变文字*/
    TG_ItemEgg.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    TG_ItemEgg.TG_EGG_Lst = [2326, 2325, 2311, 2328, 2327, 2312, 2330, 2329, 2313, 2332, 2331, 2314, 2334, 2333, 2315, 2336, 2335, 2316];
    return TG_ItemEgg;
}(TG_Item));
__reflect(TG_ItemEgg.prototype, "TG_ItemEgg");
//# sourceMappingURL=TG_ItemEgg.js.map