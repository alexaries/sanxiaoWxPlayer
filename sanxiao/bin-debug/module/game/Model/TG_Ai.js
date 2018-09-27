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
 * Created by ZhangHui on 2018/8/22.
 * 棋盘提示 AI玩法
 */
var sAiData = (function () {
    function sAiData() {
    }
    return sAiData;
}());
__reflect(sAiData.prototype, "sAiData");
var TG_Ai = (function (_super) {
    __extends(TG_Ai, _super);
    function TG_Ai() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.finalDatas = [];
        _this.ColNum = TG_Game.getInstance().ColNum;
        _this.RowNum = TG_Game.getInstance().RowNum;
        return _this;
    }
    TG_Ai.prototype.GetAiMoveData = function () {
        var nFirstIndex = -1;
        var nSecondIndex = -1;
        var obj = { "first": nFirstIndex, "second": nSecondIndex };
        this.ClearMark();
        this.GetAllExchangeData();
        Log.getInstance().trace("=====================AI棋盘提示查出数据================================");
        Log.getInstance().trace(this.finalDatas, 0);
        if (this.finalDatas.length == 0) {
            return obj;
        }
        else {
            //目前都为简单
            var index = Math.floor(Math.random() * (this.finalDatas.length / 2));
            nFirstIndex = this.finalDatas[index].first;
            nSecondIndex = this.finalDatas[index].second;
            obj.first = nFirstIndex;
            obj.second = nSecondIndex;
        }
        this.DoMarkCache(nFirstIndex, nSecondIndex);
        return obj;
    };
    TG_Ai.prototype.ClearMark = function () {
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.SetMarkedHor(1);
            temp.SetMarkedVel(1);
            temp.MarkedCache = [];
        }
    };
    /*获取所有可消除的点并排序*/
    TG_Ai.prototype.GetAllExchangeData = function () {
        this.finalDatas = [];
        for (var index = 0; index < TG_Game.Items.length; index++) {
            var item = TG_Game.getInstance().GetItemByIndex(index);
            var topIndex = TG_Game.getInstance().GetTopItem(index);
            var rightIndex = TG_Game.getInstance().GetRightItem(index);
            var row1 = 0, col1 = 0, row2 = 0, col2 = 0;
            if (topIndex >= 0) {
                var top_1 = TG_Game.getInstance().GetItemByIndex(topIndex);
                row1 = item.SitePos.Y;
                col1 = item.SitePos.X;
                row2 = top_1.SitePos.Y;
                col2 = top_1.SitePos.X;
                if (this.IsCanExchange(row1, col1, row2, col2)) {
                    var temp = this.GetExchangeLevel(index, topIndex);
                    this.finalDatas.push(temp);
                }
            }
            if (rightIndex >= 0) {
                var right = TG_Game.getInstance().GetItemByIndex(rightIndex);
                row1 = item.SitePos.Y;
                col1 = item.SitePos.X;
                row2 = right.SitePos.Y;
                col2 = right.SitePos.X;
                if (this.IsCanExchange(row1, col1, row2, col2)) {
                    var temp = this.GetExchangeLevel(index, rightIndex);
                    this.finalDatas.push(temp);
                }
            }
        }
        App.ArrayManager.ArrayDownItem(this.finalDatas, "score");
    };
    /*是否可以进行交换位置*/
    TG_Ai.prototype.IsCanExchange = function (row1, col1, row2, col2, needNeighbor) {
        if (needNeighbor === void 0) { needNeighbor = true; }
        var item = TG_Game.getInstance().GetItemByPos(row1, col1);
        var destItem = TG_Game.getInstance().GetItemByPos(row2, col2);
        if (item == null || destItem == null || item == undefined || destItem == undefined) {
            return false;
        }
        if (needNeighbor && !TG_Game.getInstance().checkIsNeighbor(row1, col1, row2, col2)) {
            return false;
        }
        if (needNeighbor && !TG_Game.getInstance().CheckRailingCouldMove(item, destItem)) {
            return false;
        }
        if (!item.CheckCellCouldMove() || !destItem.CheckCellCouldMove()) {
            return false;
        }
        if (item.IsItemEffect() && destItem.IsItemEffect())
            return true;
        if (item.IsEffectBlack() || destItem.IsEffectBlack())
            return true;
        this.swapItem(item.Index, destItem.Index);
        var tempList = [];
        /*检查横向*/
        TG_Game.getInstance().getRowChain(item, tempList);
        if (tempList.length >= 3) {
            this.swapItem(item.Index, destItem.Index);
            return true;
        }
        tempList = [];
        TG_Game.getInstance().getRowChain(destItem, tempList);
        if (tempList.length >= 3) {
            this.swapItem(item.Index, destItem.Index);
            ;
            return true;
        }
        tempList = [];
        /*检查纵向*/
        TG_Game.getInstance().getColChain(item, tempList);
        if (tempList.length >= 3) {
            this.swapItem(item.Index, destItem.Index);
            return true;
        }
        tempList = [];
        TG_Game.getInstance().getColChain(destItem, tempList);
        if (tempList.length >= 3) {
            this.swapItem(item.Index, destItem.Index);
            return true;
        }
        //是否可以形成鸟
        if (this.checkBird(item) || this.checkBird(destItem)) {
            this.swapItem(item.Index, destItem.Index);
            return true;
        }
        this.swapItem(item.Index, destItem.Index);
        return false;
    };
    /*交换方块的位置*/
    TG_Ai.prototype.swapItem = function (first, second) {
        TG_Game.getInstance().SwapItem1(first, second);
    };
    /*获取此次交换的级别*/
    TG_Ai.prototype.GetExchangeLevel = function (first, second) {
        this.DoMarkCache(first, second);
        var data = new sAiData();
        data.first = first;
        data.second = second;
        data.level = -1;
        data.myTarget = false;
        data.otherTarget = false;
        data.IsInfectMode = false;
        data.IsLinkEnd = false;
        data.score = 0;
        this.swapItem(first, second);
        if (TG_Game.getInstance().DoAddMark()) {
            var item1 = TG_Game.getInstance().GetItemByIndex(first);
            var item1MarkedHor = item1.GetMarkedHor();
            var item1MarkedVel = item1.GetMarkedVel();
            var item2 = TG_Game.getInstance().GetItemByIndex(second);
            var item2MarkedHor = item2.GetMarkedHor();
            var item2MarkedVel = item2.GetMarkedVel();
            //单三
            if ((item1MarkedHor == 3 && item1MarkedVel < 3) || (item1MarkedVel == 3 && item1MarkedHor < 3) ||
                (item2MarkedHor == 3 && item2MarkedVel < 3) || (item2MarkedVel == 3 && item2MarkedHor < 3)) {
                data.level = 1;
            }
            //双三
            if (((item1MarkedHor == 3 && item1MarkedVel < 3) || (item1MarkedVel == 3 && item1MarkedHor < 3)) &&
                ((item2MarkedHor == 3 && item2MarkedVel < 3) || (item2MarkedVel == 3 && item2MarkedHor < 3))) {
                data.level = 2;
            }
            //四连
            if ((item1MarkedHor == 4 && item1MarkedVel < 3) || (item1MarkedVel == 4 && item1MarkedHor < 3) ||
                (item2MarkedHor == 4 && item2MarkedVel < 3) || (item2MarkedVel == 4 && item2MarkedHor < 3)) {
                data.level = 3;
            }
            //鸟
            if (this.checkBird(item1) || this.checkBird(item2)) {
                data.level = 4;
            }
            //炸弹
            if ((item1.MarkedHor >= 3 && item1.MarkedVel >= 3) || (item2.MarkedHor >= 3 && item2.MarkedVel >= 3)) {
                data.level = 5;
            }
            //五连
            if (item1MarkedVel >= 5 || item1MarkedHor >= 5 || item2MarkedHor >= 5 || item2MarkedVel >= 5) {
                data.level = 6;
            }
            //三带鸟 四带三 炸弹带三
            if (data.level == 1 || data.level == 2) {
                for (var _i = 0, _a = item1.MarkedCache; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var temp = TG_Game.getInstance().GetItemByIndex(item);
                    if (temp.IsEffectBird()) {
                        data.level = 7;
                    }
                    if (temp.IsEffectHor() || temp.IsEffectVel()) {
                        data.level = 8;
                    }
                    if (temp.IsEffectGold()) {
                        data.level = 9;
                    }
                }
                if (data.level == 2) {
                    for (var _b = 0, _c = item2.MarkedCache; _b < _c.length; _b++) {
                        var item = _c[_b];
                        var temp = TG_Game.getInstance().GetItemByIndex(item);
                        if (temp.IsEffectBird()) {
                            if (data.level < 7) {
                                data.level = 7;
                            }
                        }
                        if (temp.IsEffectHor() || temp.IsEffectVel()) {
                            if (data.level < 8) {
                                data.level = 8;
                            }
                        }
                        if (temp.IsEffectGold()) {
                            if (data.level < 9) {
                                data.level = 9;
                            }
                        }
                    }
                }
            }
            //双鸟
            if (item1.IsEffectBird() && item2.IsEffectBird()) {
                data.level = 10;
            }
            //鸟和四连
            if (item2.IsEffectBird() && (item1.IsEffectVel() || item1.IsEffectHor()) ||
                item1.IsEffectBird() && (item2.IsEffectHor() || item2.IsEffectVel())) {
                data.level = 11;
            }
            //鸟和炸弹
            if (item1.IsEffectBird() && item2.IsEffectGold() || item2.IsEffectBird() && item1.IsEffectGold()) {
                data.level = 12;
            }
            //双四连
            if ((item1.IsEffectVel() || item1.IsEffectHor()) && (item2.IsEffectVel() || item2.IsEffectHor())) {
                data.level = 13;
            }
            //黑洞和普通块
            if (item1.IsEffectBlack() && item2.IsItemNormal() || item1.IsItemNormal() && item2.IsEffectBlack()) {
                data.level = 14;
            }
            //双炸弹
            if (item1.IsEffectGold() && item2.IsEffectGold()) {
                data.level = 15;
            }
            //炸弹和条消
            if ((item1.IsEffectGold() && (item2.IsEffectHor() || item2.IsEffectVel())) ||
                (item2.IsEffectGold() && (item1.IsEffectHor() || item1.IsEffectVel()))) {
                data.level = 15;
            }
            //黑洞和鸟
            if (item1.IsEffectBlack() && item2.IsEffectBird() || item1.IsEffectBird() && item2.IsEffectBlack()) {
                data.level = 16;
            }
            //黑洞和四连或黑洞和炸弹
            if (item1.IsEffectBlack() && item2.IsEffectGold() || item1.IsEffectGold() && item2.IsEffectBlack() ||
                item1.IsEffectBlack() && (item2.IsEffectHor() || item2.IsEffectVel()) ||
                (item1.IsEffectHor() || item1.IsEffectVel()) && item2.IsEffectBlack()) {
                data.level = 17;
            }
            //双黑洞
            if (item1.IsEffectBlack() && item2.IsEffectBlack()) {
                data.level = 18;
            }
            //计算任务目标
            this.JudgeTarget(item1, item2, data);
            //计算传染
            this.JudgeInfect(item1, item2, data);
        }
        this.swapItem(first, second);
        //计算权值
        this.CalculateWeight(data);
        this.ClearMark();
        return data;
    };
    /*寻找消除缓存*/
    TG_Ai.prototype.DoMarkCache = function (id1, id2) {
        var exsitExplode = false;
        //判断双特效
        if (TG_Game.Items[id1].IsItemEffect() && TG_Game.Items[id2].IsItemEffect()) {
            return;
        }
        this.swapItem(id1, id2);
        for (var _i = 0, _a = TG_Game.Items; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.MarkedCache = [];
        }
        if (TG_Game.getInstance().DoAddMark()) {
            //黑洞
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    if (item.GetMarkedHor() >= 5 || item.GetMarkedVel() >= 5 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindBlack(item) || exsitExplode;
                    }
                }
            }
            //炸弹
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    if (item.GetMarkedHor() >= 3 && item.GetMarkedVel() >= 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindGold(item) || exsitExplode;
                    }
                }
            }
            //纵向四连
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    if (item.GetMarkedVel() > 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindVelEffect(item) || exsitExplode;
                    }
                }
            }
            //横向四连
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    if (item.GetMarkedHor() > 3 && item.CheckMatchSpecial()) {
                        exsitExplode = this.FindHorEffect(item) || exsitExplode;
                    }
                }
            }
            //风车 鸟
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    if (item.CheckMatchSpecial() && item.GetMarkedHor() >= 2 && item.GetMarkedVel() >= 2
                        && this.checkBird(item)) {
                        exsitExplode = this.FindBirdEffect(item) || exsitExplode;
                    }
                }
            }
            // 纵向3连
            var edVer = [];
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    edVer = [];
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    var color = item.GetColorType();
                    var index = TG_Game.getInstance().GetIndexByPos(row, col);
                    edVer.push(item);
                    if (item.GetMarkedVel() >= 3 && TG_Game.getInstance().CheckAddMark(item) && item.CheckMatchSpecial()) {
                        var topIndex = TG_Game.getInstance().GetTopItem(index);
                        var topTopIndex = TG_Game.getInstance().GetTopItem(topIndex);
                        if (topIndex < 0 || topTopIndex < 0)
                            continue;
                        var topItem = TG_Game.getInstance().GetItemByIndex(topIndex);
                        var topTopItem = TG_Game.getInstance().GetItemByIndex(topTopIndex);
                        if (topItem.GetColorType() == color && TG_Game.getInstance().CheckAddMark(topItem)) {
                            edVer.push(topItem);
                        }
                        if (topTopItem.GetColorType() == color && TG_Game.getInstance().CheckAddMark(topTopItem)) {
                            edVer.push(topTopItem);
                        }
                        if (edVer.length < 3)
                            continue;
                        exsitExplode = true;
                        for (var _b = 0, edVer_1 = edVer; _b < edVer_1.length; _b++) {
                            var temp = edVer_1[_b];
                            temp.MarkedAlready = true;
                        }
                        for (var _c = 0, edVer_2 = edVer; _c < edVer_2.length; _c++) {
                            var temp = edVer_2[_c];
                            for (var _d = 0, edVer_3 = edVer; _d < edVer_3.length; _d++) {
                                var self_1 = edVer_3[_d];
                                self_1.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
                            }
                        }
                    }
                }
            }
            //横向3连
            var edHor = [];
            for (var row = this.ColNum - 1; row >= 0; row--) {
                for (var col = 0; col < this.RowNum; col++) {
                    edHor = [];
                    var item = TG_Game.getInstance().GetItemByPos(row, col);
                    var color = item.GetColorType();
                    var index = TG_Game.getInstance().GetIndexByPos(row, col);
                    edHor.push(item);
                    if (item.GetMarkedHor() >= 3 && TG_Game.getInstance().CheckAddMark(item) && item.CheckMatchSpecial()) {
                        var rightIndex = TG_Game.getInstance().GetRightItem(index);
                        var rightRightIndex = TG_Game.getInstance().GetRightItem(rightIndex);
                        if (rightIndex < 0 || rightRightIndex < 0)
                            continue;
                        var rightItem = TG_Game.getInstance().GetItemByIndex(rightIndex);
                        var rightRightItem = TG_Game.getInstance().GetItemByIndex(rightRightIndex);
                        if (rightItem.GetColorType() == color && TG_Game.getInstance().CheckAddMark(rightItem)) {
                            edHor.push(rightItem);
                        }
                        if (rightRightItem.GetColorType() == color && TG_Game.getInstance().CheckAddMark(rightRightItem)) {
                            edHor.push(rightRightItem);
                        }
                        if (edHor.length < 3)
                            continue;
                        exsitExplode = true;
                        for (var _e = 0, edHor_1 = edHor; _e < edHor_1.length; _e++) {
                            var temp = edHor_1[_e];
                            temp.MarkedAlready = true;
                        }
                        for (var _f = 0, edVer_4 = edVer; _f < edVer_4.length; _f++) {
                            var temp = edVer_4[_f];
                            for (var _g = 0, edVer_5 = edVer; _g < edVer_5.length; _g++) {
                                var self_2 = edVer_5[_g];
                                self_2.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
                            }
                        }
                    }
                }
            }
        }
        this.swapItem(id1, id2);
        for (var _h = 0, _j = TG_Game.Items; _h < _j.length; _h++) {
            var temp = _j[_h];
            temp.SetMoveItem(false);
            temp.SetMarkedHor(1);
            temp.SetMarkedVel(1);
            temp.MarkedAlready = false;
            temp.MarkedForExplodingCallfunc = false;
            temp.SetExploding(false);
        }
    };
    /*合成黑洞*/
    TG_Ai.prototype.FindBlack = function (item) {
        var index = TG_Game.getInstance().GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        //向上找
        var nIndex = index;
        for (var i = 0; i < 4; i++) {
            nIndex = TG_Game.getInstance().GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            toFindSpecial.push(item);
            nIndex = index;
            //向右找
            for (var i = 0; i < 4; i++) {
                nIndex = TG_Game.getInstance().GetRightItem(nIndex);
                if (nIndex == -1)
                    break;
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                    toFindSpecial.push(temp);
                }
                else {
                    break;
                }
            }
        }
        if (toFindSpecial.length < 5) {
            toFindSpecial = [];
            return false;
        }
        for (var _i = 0, toFindSpecial_1 = toFindSpecial; _i < toFindSpecial_1.length; _i++) {
            var temp = toFindSpecial_1[_i];
            temp.MarkedAlready = true;
        }
        for (var _a = 0, toFindSpecial_2 = toFindSpecial; _a < toFindSpecial_2.length; _a++) {
            var temp = toFindSpecial_2[_a];
            for (var _b = 0, toFindSpecial_3 = toFindSpecial; _b < toFindSpecial_3.length; _b++) {
                var self_3 = toFindSpecial_3[_b];
                self_3.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
            }
        }
        toFindSpecial = [];
        return true;
    };
    /*炸弹*/
    TG_Ai.prototype.FindGold = function (item) {
        var index = TG_Game.getInstance().GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var bombItems = [item];
        //向左找
        var nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = TG_Game.getInstance().GetLeftItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        //向右找
        if (bombItems.length < 3) {
            nIndex = index;
            while (bombItems.length < 3) {
                nIndex = TG_Game.getInstance().GetRightItem(nIndex);
                if (nIndex == -1)
                    break;
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                    bombItems.push(temp);
                }
                else {
                    break;
                }
            }
        }
        //向上找
        nIndex = index;
        for (var i = 0; i < 2; i++) {
            nIndex = TG_Game.getInstance().GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                bombItems.push(temp);
            }
            else {
                break;
            }
        }
        //向下找
        if (bombItems.length < 5) {
            nIndex = index;
            while (bombItems.length < 5) {
                nIndex = TG_Game.getInstance().GetBottomItem(nIndex);
                if (nIndex == -1)
                    break;
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                    bombItems.push(temp);
                }
                else {
                    break;
                }
            }
        }
        if (bombItems.length < 5) {
            bombItems = [];
            return false;
        }
        for (var _i = 0, bombItems_1 = bombItems; _i < bombItems_1.length; _i++) {
            var temp = bombItems_1[_i];
            temp.MarkedAlready = true;
        }
        for (var _a = 0, bombItems_2 = bombItems; _a < bombItems_2.length; _a++) {
            var temp = bombItems_2[_a];
            for (var _b = 0, bombItems_3 = bombItems; _b < bombItems_3.length; _b++) {
                var self_4 = bombItems_3[_b];
                self_4.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
            }
        }
        bombItems = [];
        return true;
    };
    /*寻找纵向*/
    TG_Ai.prototype.FindVelEffect = function (item) {
        var index = TG_Game.getInstance().GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        var nIndex = index;
        //向上找
        for (var i = 0; i < 3; i++) {
            nIndex = TG_Game.getInstance().GetTopItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        //向下找
        nIndex = index;
        for (var i = 0; i < 3; i++) {
            nIndex = TG_Game.getInstance().GetBottomItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            return false;
        }
        for (var _i = 0, toFindSpecial_4 = toFindSpecial; _i < toFindSpecial_4.length; _i++) {
            var temp = toFindSpecial_4[_i];
            temp.MarkedAlready = true;
        }
        for (var _a = 0, toFindSpecial_5 = toFindSpecial; _a < toFindSpecial_5.length; _a++) {
            var temp = toFindSpecial_5[_a];
            for (var _b = 0, toFindSpecial_6 = toFindSpecial; _b < toFindSpecial_6.length; _b++) {
                var self_5 = toFindSpecial_6[_b];
                self_5.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
            }
        }
        toFindSpecial = [];
        return true;
    };
    /*寻找横向*/
    TG_Ai.prototype.FindHorEffect = function (item) {
        var index = TG_Game.getInstance().GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        var nIndex = index;
        //向左找
        for (var i = 0; i < 3; i++) {
            nIndex = TG_Game.getInstance().GetLeftItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        //向右找
        nIndex = index;
        for (var i = 0; i < 3; i++) {
            nIndex = TG_Game.getInstance().GetRightItem(nIndex);
            if (nIndex == -1)
                break;
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetColorType() == color && TG_Game.getInstance().CheckAddMark(temp)) {
                toFindSpecial.push(temp);
            }
            else {
                break;
            }
        }
        if (toFindSpecial.length < 4) {
            toFindSpecial = [];
            return false;
        }
        for (var _i = 0, toFindSpecial_7 = toFindSpecial; _i < toFindSpecial_7.length; _i++) {
            var temp = toFindSpecial_7[_i];
            temp.MarkedAlready = true;
        }
        for (var _a = 0, toFindSpecial_8 = toFindSpecial; _a < toFindSpecial_8.length; _a++) {
            var temp = toFindSpecial_8[_a];
            for (var _b = 0, toFindSpecial_9 = toFindSpecial; _b < toFindSpecial_9.length; _b++) {
                var self_6 = toFindSpecial_9[_b];
                self_6.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
            }
        }
        toFindSpecial = [];
        return true;
    };
    /*风车*/
    TG_Ai.prototype.FindBirdEffect = function (item) {
        var index = TG_Game.getInstance().GetIndexByPos(item.SitePos.Y, item.SitePos.X);
        var color = item.GetColorType();
        var toFindSpecial = [item];
        //右
        var nIndex = TG_Game.getInstance().GetRightItem(index);
        if (nIndex != -1) {
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上
        nIndex = TG_Game.getInstance().GetTopItem(index);
        if (nIndex != -1) {
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        nIndex = TG_Game.getInstance().GetTopRightItem(index);
        if (nIndex != -1) {
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (temp.GetMarkedHor() >= 2 && temp.GetMarkedVel() >= 2 && TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上上
        nIndex = TG_Game.getInstance().GetTopItem(TG_Game.getInstance().GetTopItem(index));
        if (nIndex != -1) {
            var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
            if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                toFindSpecial.push(temp);
            }
        }
        //上上右
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetRightItem(nIndex);
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetRightItem(TG_Game.getInstance().GetRightItem(index));
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //右右上
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetTopItem(nIndex);
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //左
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetLeftItem(index);
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //左上
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetTopItem(TG_Game.getInstance().GetLeftItem(index));
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //下
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetBottomItem(index);
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //下右
        if (toFindSpecial.length < 5) {
            nIndex = TG_Game.getInstance().GetBottomRightItem(index);
            if (nIndex != -1) {
                var temp = TG_Game.getInstance().GetItemByIndex(nIndex);
                if (TG_Game.getInstance().CheckAddMark(temp) && temp.GetColorType() == color) {
                    toFindSpecial.push(temp);
                }
            }
        }
        //找到4个字方块，再判断周边有无相连
        if (toFindSpecial.length < 4) {
            return false;
        }
        for (var _i = 0, toFindSpecial_10 = toFindSpecial; _i < toFindSpecial_10.length; _i++) {
            var temp = toFindSpecial_10[_i];
            temp.MarkedAlready = true;
        }
        for (var _a = 0, toFindSpecial_11 = toFindSpecial; _a < toFindSpecial_11.length; _a++) {
            var temp = toFindSpecial_11[_a];
            for (var _b = 0, toFindSpecial_12 = toFindSpecial; _b < toFindSpecial_12.length; _b++) {
                var self_7 = toFindSpecial_12[_b];
                self_7.MarkedCache.push(TG_Game.getInstance().GetIndexByPos(temp.SitePos.Y, temp.SitePos.X));
            }
        }
        toFindSpecial = [];
        return true;
    };
    /*是否可以形成鸟/风车*/
    TG_Ai.prototype.checkBird = function (item) {
        return TG_Game.getInstance().CheckBird(item);
    };
    /*判断target*/
    TG_Ai.prototype.JudgeTarget = function (item1, item2, data) {
        data.myTarget = false;
        data.otherTarget = false;
        //双特效或黑洞和普通块
        if (item1.IsItemEffect() && item2.IsItemEffect() || item1.IsEffectBlack() || item2.IsEffectBlack()) {
            for (var _i = 0, _a = TG_Stage.Targets1; _i < _a.length; _i++) {
                var target = _a[_i];
                if (target.Target == item1.BlockId || target.Target == item2.BlockId && target.Num > 0) {
                    data.myTarget = true;
                    break;
                }
            }
            return;
        }
        //其他
        for (var _b = 0, _c = TG_Stage.Targets1; _b < _c.length; _b++) {
            var target = _c[_b];
            for (var _d = 0, _e = item1.MarkedCache; _d < _e.length; _d++) {
                var item = _e[_d];
                if (target.Target == TG_Game.getInstance().GetItemByIndex(item).BlockId && target.Num > 0) {
                    data.myTarget = true;
                    break;
                }
            }
            for (var _f = 0, _g = item2.MarkedCache; _f < _g.length; _f++) {
                var item = _g[_f];
                if (target.Target == TG_Game.getInstance().GetItemByIndex(item).BlockId && target.Num > 0) {
                    data.myTarget = true;
                    break;
                }
            }
        }
    };
    /*判断target*/
    TG_Ai.prototype.JudgeInfect = function (item1, item2, data) {
    };
    /*计算权值*/
    TG_Ai.prototype.CalculateWeight = function (data) {
        var entry = TG_AIConfigEntry.getInstance().GetAiConfigEntry(data.level);
        if (entry != null) {
            if (data.IsInfectMode) {
                //传染模式
                var hasInfectScore = data.IsLinkEnd ? entry.hasInfectEnd : entry.hasInfect;
                var noInfectScore = data.IsLinkEnd ? entry.noInfectEnd : entry.noInfect;
                data.score = data.hasMyInfect ? hasInfectScore : noInfectScore;
                if (!data.hasMyInfect && data.hasEnemyInfect) {
                    data.score = 0 - data.score;
                }
            }
            else {
                data.score = entry.level;
            }
            if (data.myTarget) {
                data.score += entry.mygoal;
            }
            if (data.otherTarget) {
                data.score += entry.enemygoal;
            }
        }
    };
    return TG_Ai;
}(BaseClass));
__reflect(TG_Ai.prototype, "TG_Ai");
//# sourceMappingURL=TG_Ai.js.map