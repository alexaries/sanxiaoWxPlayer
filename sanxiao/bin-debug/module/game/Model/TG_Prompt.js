/**
 * 智能判断逻辑类 AI算法等核心类
 * Created by HuDe Zheng on 2018/7/13.
 */
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
var TG_Prompt = (function (_super) {
    __extends(TG_Prompt, _super);
    function TG_Prompt() {
        return _super.call(this) || this;
    }
    /**
     * 游戏每回合结束后需要判定结果
     * @constructor
     */
    TG_Prompt.prototype.DetermineCanMoved = function () {
        var change = this.GetCanMoveData();
        if (!change) {
            //没有可以移动的了，需要打乱棋盘
            this.doRandom();
        }
        else {
            //有可以移动的，不需要打乱棋盘
        }
    };
    /**
     * 获取是否能可以移动
     * @returns {boolean}
     * @constructor
     */
    TG_Prompt.prototype.IsCanMove = function () {
        var obj = this.GetCanMoveData();
        return obj.direction != -1;
    };
    /**
     *  获取是否有可以消除的块 可用于智能提示
     *  返回对象参数说明（一、direction：代表需要缓动的方向 1、2、3、4分别代表上、下、左、右。 二、list需要缓动提示的数组 【第一个元素按照direction参数方向缓动，其余的都是放大即可】）
     * @returns {boolean}
     * @constructor
     */
    TG_Prompt.prototype.GetCanMoveData = function () {
        var obj = this._GetCanMoveData(Math.floor(Math.random() * TG_Game.Items.length)); //先随机取出一个
        if (obj.direction == -1) {
            obj = this._GetCanMoveData(0); //如果没有，在从0开始取
        }
        return obj;
    };
    /***
     *  强制执行打乱棋盘操作
     */
    TG_Prompt.prototype.doRandom = function () {
        this.setGameState(true);
        this._doRandom();
    };
    /**
     *  播放智能提示
     */
    TG_Prompt.prototype.playTips = function () {
        var obj = TG_Prompt.getInstance().GetCanMoveData();
        if (obj.direction == -1) {
            Log.getInstance().trace("没有可以消除的了");
            return;
        }
        var list = obj.list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var tw = egret.Tween.get(item);
            tw.wait(5 * i);
            if (i == 0) {
                if (obj.direction == 1) {
                    tw.to({ y: item.y - 10 }, 300);
                    tw.to({ y: item.y - 5 }, 300);
                    tw.to({ y: item.y - 10 }, 150);
                    tw.to({ y: item.y }, 300);
                }
                else if (obj.direction == 2) {
                    tw.to({ y: item.y + 20 }, 300);
                    tw.to({ y: item.y - 5 }, 300);
                    tw.to({ y: item.y + 20 }, 150);
                    tw.to({ y: item.y }, 300);
                }
                else if (obj.direction == 3) {
                    tw.to({ x: item.x - 10 }, 300);
                    tw.to({ x: item.x - 5 }, 300);
                    tw.to({ x: item.x - 10 }, 150);
                    tw.to({ x: item.x }, 300);
                }
                else if (obj.direction == 4) {
                    tw.to({ x: item.x + 20 }, 300);
                    tw.to({ x: item.x - 5 }, 300);
                    tw.to({ x: item.x + 20 }, 150);
                    tw.to({ x: item.x }, 300);
                }
            }
            else {
            }
            tw.call(function (item) {
                egret.Tween.removeTweens(item);
            }, this, [item]);
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////       以上函数均为对外开放函数       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*--------------------------------------------------------------------------------------------------我是分界线-------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //////////////////////////////////////////////////////////////////////////////////////////   以下函数均为内部函数，不对外开放   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    TG_Prompt.prototype.setGameState = function (bool) {
        if (bool === void 0) { bool = false; }
        if (bool) {
            TG_Game.SetGameState(false);
        }
        else {
            TG_Game.SetGameState(true);
        }
    };
    /**
     * 返回可消除对象
     * 返回对象参数说明（一、direction：代表需要缓动的方向 1、2、3、4分别代表上、下、左、右。 二、list需要缓动提示的数组 【第一个元素按照direction参数方向缓动，其余的都是放大即可】）
     * @returns {any}
     * @private
     */
    TG_Prompt.prototype._GetCanMoveData = function (ran) {
        this.arr_items = TG_Game.Items;
        var return_arr = [];
        /************************************************ 取出可以操作的方块 *****************************************************/
        for (var i = ran; i < this.arr_items.length; i++) {
            var r = Math.floor(i / TG_MapData.getInstance().colNum); //行
            var c = Math.floor(i % TG_MapData.getInstance().colNum); //列 t
            var index = this.getIndex(r, c); //得到index值
            if (!this.isCanDraw(index))
                continue;
            var item = this.arr_items[index];
            if (!this.isTrueItem(item))
                return; //当前块是否是有效的块
            /****************************************************************************************************************************************************************************************************************************************/
            /****************************************************************************************** 出现两个相连的色块 **********************************************************************************************************************/
            /****************************************************************************************************************************************************************************************************************************************/
            if (this.getIndex(r, c + 1) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 1)]) && this.seekItemIsEq(item, this.arr_items[this.getIndex(r, c + 1)])) {
                /********* 左边 *********/
                if (c > 0 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c - 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 1, c - 1)], item) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    return { "direction": 2, "list": [this.arr_items[this.getIndex(r - 1, c - 1)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                if (c > 1 && this.isTrueItem(this.arr_items[this.getIndex(r, c - 2)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r, c - 2)], item) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    return { "direction": 4, "list": [this.arr_items[this.getIndex(r, c - 2)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                if (c > 0 && r < TG_MapData.getInstance().rowNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c - 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 1, c - 1)], item) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    return { "direction": 1, "list": [this.arr_items[this.getIndex(r + 1, c - 1)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                /********* 右边 *********/
                if (c < TG_MapData.getInstance().colNum - 2 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 2)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 1, c + 2)], item) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    return { "direction": 2, "list": [this.arr_items[this.getIndex(r - 1, c + 2)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                if (c < TG_MapData.getInstance().colNum - 3 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 3)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r, c + 3)], item) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    return { "direction": 3, "list": [this.arr_items[this.getIndex(r, c + 3)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                if (c < TG_MapData.getInstance().colNum - 2 && r < TG_MapData.getInstance().rowNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 2)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 1, c + 2)], item) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    return { "direction": 1, "list": [this.arr_items[this.getIndex(r + 1, c + 2)], item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
            }
            if (this.getIndex(r + 1, c) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c)]) && this.seekItemIsEq(item, this.arr_items[this.getIndex(r + 1, c)])) {
                /********* 上边 *********/
                if (c < TG_MapData.getInstance().colNum - 1 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 1, c + 1)], item) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    return { "direction": 3, "list": [this.arr_items[this.getIndex(r - 1, c + 1)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
                if (r > 1 && this.isTrueItem(this.arr_items[this.getIndex(r - 2, c)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 2, c)], item) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    return { "direction": 2, "list": [this.arr_items[this.getIndex(r - 2, c)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
                if (c > 0 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c - 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 1, c - 1)], item) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    return { "direction": 4, "list": [this.arr_items[this.getIndex(r - 1, c - 1)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
                /********* 下边 *********/
                if (c < TG_MapData.getInstance().colNum - 1 && r < TG_MapData.getInstance().rowNum - 2 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c + 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 2, c + 1)], item) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    return { "direction": 3, "list": [this.arr_items[this.getIndex(r + 2, c + 1)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
                if (r < TG_MapData.getInstance().rowNum - 3 && this.isTrueItem(this.arr_items[this.getIndex(r + 3, c)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 3, c)], item) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    return { "direction": 1, "list": [this.arr_items[this.getIndex(r + 3, c)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
                if (c > 0 && r < TG_MapData.getInstance().rowNum - 2 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c - 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 2, c - 1)], item) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    return { "direction": 4, "list": [this.arr_items[this.getIndex(r + 2, c - 1)], item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
            }
            /****************************************************************************************************************************************************************************************************************************************/
            /****************************************************************************************** 出现空一格 相连的色块 **********************************************************************************************************************/
            /****************************************************************************************************************************************************************************************************************************************/
            if (this.getIndex(r, c + 2) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 2)]) && this.seekItemIsEq(item, this.arr_items[this.getIndex(r, c + 2)])) {
                if (r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r - 1, c + 1)], item) && this.isCanDraw(this.getIndex(r, c + 1))) {
                    return { "direction": 2, "list": [this.arr_items[this.getIndex(r - 1, c + 1)], item, this.arr_items[this.getIndex(r, c + 2)]] }; //可以消除
                }
                if (r < TG_MapData.getInstance().rowNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 1, c + 1)], item) && this.isCanDraw(this.getIndex(r, c + 1))) {
                    return { "direction": 1, "list": [this.arr_items[this.getIndex(r + 1, c + 1)], item, this.arr_items[this.getIndex(r, c + 2)]] }; //可以消除
                }
            }
            if (this.getIndex(r + 2, c) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c)]) && this.seekItemIsEq(item, this.arr_items[this.getIndex(r + 2, c)])) {
                if (c > 0 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c - 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 1, c - 1)], item) && this.isCanDraw(this.getIndex(r + 1, c))) {
                    return { "direction": 4, "list": [this.arr_items[this.getIndex(r + 1, c - 1)], item, this.arr_items[this.getIndex(r + 2, c)]] }; //可以消除
                }
                if (c < TG_MapData.getInstance().colNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 1)]) && this.seekItemIsEq(this.arr_items[this.getIndex(r + 1, c + 1)], item) && this.isCanDraw(this.getIndex(r + 1, c))) {
                    return { "direction": 3, "list": [this.arr_items[this.getIndex(r + 1, c + 1)], item, this.arr_items[this.getIndex(r + 2, c)]] }; //可以消除
                }
            }
            //特效快判断
            if (item.IsEffect()) {
                if (c < TG_MapData.getInstance().colNum - 1 && this.getIndex(r, c + 1) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 1)]) && this.arr_items[this.getIndex(r, c + 1)].IsEffect()) {
                    return { "direction": 4, "list": [item, this.arr_items[this.getIndex(r, c + 1)]] }; //可以消除
                }
                if (r < TG_MapData.getInstance().rowNum - 1 && this.getIndex(r + 1, c) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c)]) && this.arr_items[this.getIndex(r + 1, c)].IsEffect()) {
                    return { "direction": 2, "list": [item, this.arr_items[this.getIndex(r + 1, c)]] }; //可以消除
                }
            }
        }
        return { "direction": -1, "list": [] };
    };
    TG_Prompt.prototype._doRandom = function () {
        var all_arr = this.getAllCanMoveItem2();
        var _loop_1 = function (j) {
            var item = all_arr[j];
            item.isBe_Placed = false;
            var tween = egret.Tween.get(item);
            var pos = item.getPosByRowCol(item.SitePos.Y, item.SitePos.X);
            var xx = GamePanel_ItemSp.getInstance().width / 2;
            var yy = GamePanel_ItemSp.getInstance().height / 2;
            tween.to({ x: xx, y: yy }, 500);
            tween.call(function () {
                egret.Tween.removeTweens(item);
            }.bind(this_1), this_1);
        };
        var this_1 = this;
        //交换完成
        for (var j = 0; j < all_arr.length; j++) {
            _loop_1(j);
        }
        App.TimerManager.doTimer(600, 1, this.doRandom2, this);
    };
    TG_Prompt.prototype.doRandom2 = function () {
        this.arr_items = TG_Game.Items;
        this.class_arr = this.classify(); //分类后的类型数组
        var arr = this.GetCanMoveData2(); //取到所有可以组成消除组合的组
        /***************************** 先填充一个可消除组合 *****************************************/
        //////////////////////////////////优先选出一个没有道具的可消除组合//////////////////////////////////////////////////////////////////////单元块1开始
        var arr_1 = [];
        for (var i = 0; i < arr.length; i++) {
            var index_1 = -1;
            var arr_temp1 = arr[i];
            var have_prop = false;
            for (var j = 0; j < arr_temp1.length; j++) {
                var item = arr_temp1[j];
                if (item.IsEffect()) {
                    have_prop = true;
                    break;
                }
            }
            if (!have_prop) {
                arr_1.push(i);
                break;
            }
        }
        //本单元块存在问题：1、没有判断有1个道具的组合 2、没有判断有2个道具的组合，这个问题必须得做，暂时先不做2018年8月2日17:18:20 hdz
        //////////////////////////////////优先选出一个没有道具的可消除组合//////////////////////////////////////////////////////////////////////单元块1结束
        if (arr_1.length > 0) {
            //随机取一个可消除组合
            this.beiyong_arr = [];
            var ran = Math.floor(Math.random() * arr_1.length);
            this.beiyong_arr = arr.splice(arr_1[ran], 1);
            this.beiyong_arr = this.beiyong_arr[0];
        }
        else {
            //死局，没有可以消除的组合块 进入结算界面
            this.setGameState(); //还原游戏状态
            return;
        }
        //判断个数
        var len_temp = 0;
        for (var i = 0; i < this.beiyong_arr.length; i++) {
            var item = this.beiyong_arr[i];
            if (!item.IsEffect()) {
                len_temp++;
            }
            else {
            }
        }
        Log.getInstance().trace("-----检测--->" + this.beiyong_arr + "--len-->" + len_temp);
        //取出填充备用组类型索引
        var tian_index = -1;
        for (var i = 0; i < this.class_arr.length; i++) {
            if (this.class_arr[i].length >= len_temp) {
                tian_index = i;
                break;
            }
        }
        if (tian_index < 0) {
            //游戏失败没有可以打乱的情况了
            Log.getInstance().trace("游戏失败没有可以打乱的情况了");
            this.setGameState(); //还原游戏状态
            return;
        }
        var cla_arr = this.class_arr[tian_index]; //取出一个分类，进行填充
        for (var i = 0; i < this.beiyong_arr.length; i++) {
            var item = this.beiyong_arr[i];
            var temp_pos = new Point();
            temp_pos.x = item.SitePos.X;
            temp_pos.y = item.SitePos.Y;
            if (!item.IsEffect()) {
                var item1 = cla_arr.splice(0, 1)[0];
                item1.isBe_Placed = true;
                //交换位置
                var temp_item = TG_Game.Items[item.Index];
                TG_Game.Items[item.Index] = TG_Game.Items[item1.Index];
                TG_Game.Items[item1.Index] = temp_item;
                item.SitePos.X = item1.SitePos.X;
                item.SitePos.Y = item1.SitePos.Y;
                item1.SitePos.X = temp_pos.x;
                item1.SitePos.Y = temp_pos.y;
                item.SetMarkedHor(0);
                item.SetMarkedVel(0);
                item1.SetMarkedHor(0);
                item1.SetMarkedVel(0);
            }
        }
        this.doRandomMash();
    };
    /**
     *  执行打乱棋盘
     */
    TG_Prompt.prototype.doRandomMash = function () {
        /****************************************** 开始填充其他块 ****************************************************/
        var all_items = this.getAllItem_No_Class([]);
        ///////////////////////////////////////打乱棋盘开始/////////////////////////////////////////////
        for (var i = 0; i < all_items.length; i++) {
            var first = i;
            var second = Math.floor(Math.random() * (all_items.length - i)) + i;
            this.IsCanExchange(first, second, all_items); //开始交换，如果不能交换，还会在交换回来
        }
        ///////////////////////////////////////打乱棋盘结束/////////////////////////////////////////////
        //交换完成
        var all_items1 = this.getAllCanMoveItem2();
        var _loop_2 = function (j) {
            var item = all_items1[j];
            if (item == -1)
                return "continue";
            var tween = egret.Tween.get(item);
            var pos = item.getPosByRowCol(item.SitePos.Y, item.SitePos.X);
            var xx = pos.x;
            var yy = pos.y;
            //tween.wait(10 * j)
            tween.to({ x: xx, y: yy }, 500);
            tween.call(function () {
                egret.Tween.removeTweens(item);
            }.bind(this_2), this_2);
        };
        var this_2 = this;
        for (var j = 0; j < all_items1.length; j++) {
            _loop_2(j);
        }
        TG_Game.getInstance().DoAddMark();
        this.setGameState(); //打乱完毕还原游戏状态
        Log.getInstance().trace("-------------打乱棋盘全部交换完毕了-------------");
    };
    TG_Prompt.prototype.classKeys = function (class_arr) {
        var class_key = []; //得到备选的keys
        for (var i = 0; i < class_arr.length; i++) {
            if (class_arr[i].length > 0)
                if (class_arr[i][0].itemType == 10) {
                    var types = class_arr[i][0].BlockId % 10;
                    class_key.push([i, 2000 + types]);
                }
                else if (class_arr[i][0].itemType == 11) {
                    var types = class_arr[i][0].BlockId % 10;
                    class_key.push([i, 2000 + types]);
                }
                else {
                    class_key.push([i, class_arr[i][0].BlockId]);
                }
        }
        return class_key;
    };
    TG_Prompt.prototype.getAllItem_No_Class = function (classArr) {
        var arr1 = TG_Game.Items;
        var arr2 = [];
        for (var i = 0; i < arr1.length; i++) {
            var bool = false;
            for (var j = 0; j < classArr.length; j++) {
                if (arr1[i].SitePos.X == classArr[j].SitePos.X && arr1[i].SitePos.Y == classArr[j].SitePos.Y) {
                    bool = true;
                }
            }
            if (!bool && this.isTrueItem2(arr1[i]) == true) {
                arr2.push(new Point(arr1[i].SitePos.X, arr1[i].SitePos.Y));
            }
            else {
                // arr2.push(-1);
            }
        }
        return arr2;
    };
    //判断这个块是否可以合成可消除组合
    TG_Prompt.prototype.IsCanExchange = function (first, second, posArr) {
        var bool = false;
        var pos1 = posArr[first];
        var pos2 = posArr[second];
        var index1 = this.getIndex(pos1.y, pos1.x);
        var index2 = this.getIndex(pos2.y, pos2.x);
        var item1 = TG_Game.Items[index1];
        if (item1.isBe_Placed)
            return true; //随机的固定块组合不能被打乱
        var item2 = TG_Game.Items[index2];
        if (!this.isTrueItem(item1) || !this.isTrueItem(item2))
            return true;
        this.IsChange(item1, item2);
        if (this.IsCanExchange21(item1) || this.IsCanExchange21(item2)) {
            this.IsChange(item1, item2);
            return true;
        }
        return bool;
    };
    TG_Prompt.prototype.IsChange = function (item1, item2) {
        var temp_x = item1.SitePos.X;
        var temp_y = item1.SitePos.Y;
        item1.SetSitPos(item2.SitePos.X, item2.SitePos.Y);
        item2.SetSitPos(temp_x, temp_y);
        var temp_item = TG_Game.Items[item1.Index];
        TG_Game.Items[item1.Index] = TG_Game.Items[item2.Index];
        TG_Game.Items[item2.Index] = temp_item;
    };
    TG_Prompt.prototype.IsCanExchange21 = function (item) {
        if (item.SitePos.X > 1) {
            var index1 = this.getIndex(item.SitePos.Y, item.SitePos.X - 2);
            var index2 = this.getIndex(item.SitePos.Y, item.SitePos.X - 1);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        if (item.SitePos.X < TG_Game.getInstance().ColNum - 2) {
            var index1 = this.getIndex(item.SitePos.Y, item.SitePos.X + 2);
            var index2 = this.getIndex(item.SitePos.Y, item.SitePos.X + 1);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        if (item.SitePos.Y > 1) {
            var index1 = this.getIndex(item.SitePos.Y - 2, item.SitePos.X);
            var index2 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        if (item.SitePos.Y < TG_Game.getInstance().RowNum - 2) {
            var index1 = this.getIndex(item.SitePos.Y + 2, item.SitePos.X);
            var index2 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        //空格
        if (item.SitePos.X > 0 && item.SitePos.X < TG_Game.getInstance().ColNum - 1) {
            var index1 = this.getIndex(item.SitePos.Y, item.SitePos.X - 1);
            var index2 = this.getIndex(item.SitePos.Y, item.SitePos.X + 1);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        if (item.SitePos.Y > 0 && item.SitePos.Y < TG_Game.getInstance().RowNum - 1) {
            var index1 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X);
            var index2 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3])) {
                return true;
            }
        }
        //田子
        if (item.SitePos.X > 0 && item.SitePos.Y > 0) {
            var index1 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X - 1);
            var index2 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X - 1);
            var index4 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3], TG_Game.Items[index4])) {
                return true;
            }
        }
        if (item.SitePos.X < TG_Game.getInstance().ColNum - 1 && item.SitePos.Y > 0) {
            var index1 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X + 1);
            var index2 = this.getIndex(item.SitePos.Y - 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X + 1);
            var index4 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3], TG_Game.Items[index4])) {
                return true;
            }
        }
        if (item.SitePos.X > 0 && item.SitePos.Y < TG_Game.getInstance().RowNum - 1) {
            var index1 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X - 1);
            var index2 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X - 1);
            var index4 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3], TG_Game.Items[index4])) {
                return true;
            }
        }
        if (item.SitePos.X < TG_Game.getInstance().ColNum - 1 && item.SitePos.Y < TG_Game.getInstance().RowNum - 1) {
            var index1 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X + 1);
            var index2 = this.getIndex(item.SitePos.Y + 1, item.SitePos.X);
            var index3 = this.getIndex(item.SitePos.Y, item.SitePos.X + 1);
            var index4 = this.getIndex(item.SitePos.Y, item.SitePos.X);
            if (this.seekItemIsEq3(TG_Game.Items[index1], TG_Game.Items[index2], TG_Game.Items[index3], TG_Game.Items[index4])) {
                return true;
            }
        }
        return false;
    };
    TG_Prompt.prototype.classify = function () {
        var re_arr = [];
        // let arr:Array<any> = this.GetCanMoveData2();
        var arr = this.getAllCanMoveItem();
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.IsEffect())
                continue; //先把特效块过滤掉
            if (obj[item.BlockId] == null) {
                obj[item.BlockId] = [];
            }
            obj[item.BlockId].push(item);
        }
        for (var key in obj) {
            re_arr.push(obj[key]);
        }
        return re_arr;
    };
    TG_Prompt.prototype.AddFilr = function () {
        var arr = this.GetCanMoveData2();
        Log.getInstance().trace("检测到可以消除的情况--->" + arr.length);
        for (var i = 0; i < arr.length; i++) {
            var color = Math.floor(Math.random() * 0xfffff0);
            var gl = new GlowFilter(color, 1, 25, 25, 5, 3, true);
            for (var j = 0; j < arr[i].length; j++) {
                var item = arr[i][j];
                if (item) {
                    if (!item.filters) {
                        var sp = new egret.Sprite();
                        sp.graphics.beginFill(color);
                        sp.graphics.drawRect(0, 0, item.width, item.height);
                        sp.graphics.endFill();
                        item.addChild(sp);
                        // item.filters = [gl];
                    }
                }
            }
        }
    };
    /********************************** 取出所有的可组成消除格子的情况 ********************************/
    /*************未实现功能，剔除有2个颜色以上的可消除组合 2018年7月30日09:58:06************************/
    TG_Prompt.prototype.GetCanMoveData2 = function () {
        var temp_arr = [];
        var temp_arr2 = [];
        this.arr_items = TG_Game.Items;
        /************************************************ 取出可以操作的方块 *****************************************************/
        for (var i = 0; i < this.arr_items.length; i++) {
            temp_arr2 = [];
            var r = Math.floor(i / TG_MapData.getInstance().colNum); //行
            var c = Math.floor(i % TG_MapData.getInstance().colNum); //列 t
            var index = this.getIndex(r, c); //得到index值
            if (!this.isCanDraw(index))
                continue;
            var item = this.arr_items[index];
            var item1 = void 0;
            var item2 = void 0;
            if (!this.isTrueItem(item))
                continue; //当前块是否是有效的块
            /****************************************************************************************************************************************************************************************************************************************/
            /****************************************************************************************** 出现两个相连的色块 **********************************************************************************************************************/
            /****************************************************************************************************************************************************************************************************************************************/
            if (this.getIndex(r, c + 1) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 1)])) {
                /********* 左边 *********/
                if (c > 0 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c - 1)]) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r - 1, c - 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c > 1 && this.isTrueItem(this.arr_items[this.getIndex(r, c - 2)]) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r, c - 2)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c > 0 && r < TG_MapData.getInstance().colNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c - 1)]) && this.isCanDraw(this.getIndex(r, c - 1))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r + 1, c - 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                /********* 右边 *********/
                if (c < TG_MapData.getInstance().colNum - 2 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 2)]) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r - 1, c + 2)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c < TG_MapData.getInstance().colNum - 3 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 3)]) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r, c + 3)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c < TG_MapData.getInstance().colNum - 2 && r < TG_MapData.getInstance().rowNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 2)]) && this.isCanDraw(this.getIndex(r, c + 2))) {
                    item1 = this.arr_items[this.getIndex(r, c + 1)];
                    item2 = this.arr_items[this.getIndex(r + 1, c + 2)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
            }
            if (this.getIndex(r + 1, c) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c)])) {
                /********* 上边 *********/
                if (c < TG_MapData.getInstance().colNum - 1 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 1)]) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r - 1, c + 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (r > 1 && this.isTrueItem(this.arr_items[this.getIndex(r - 2, c)]) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r - 2, c)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c > 0 && r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c - 1)]) && this.isCanDraw(this.getIndex(r - 1, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r - 1, c - 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                /********* 下边 *********/
                if (c < TG_MapData.getInstance().colNum - 1 && r < TG_MapData.getInstance().rowNum - 2 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c + 1)]) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r + 2, c + 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (r < TG_MapData.getInstance().rowNum - 3 && this.isTrueItem(this.arr_items[this.getIndex(r + 3, c)]) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r + 3, c)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c > 0 && r < TG_MapData.getInstance().rowNum - 2 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c - 1)]) && this.isCanDraw(this.getIndex(r + 2, c))) {
                    item1 = this.arr_items[this.getIndex(r + 1, c)];
                    item2 = this.arr_items[this.getIndex(r + 2, c - 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
            }
            /****************************************************************************************************************************************************************************************************************************************/
            /****************************************************************************************** 出现空一格 相连的色块 **********************************************************************************************************************/
            /****************************************************************************************************************************************************************************************************************************************/
            if (this.getIndex(r, c + 2) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r, c + 2)])) {
                if (r > 0 && this.isTrueItem(this.arr_items[this.getIndex(r - 1, c + 1)]) && this.isCanDraw(this.getIndex(r, c + 1))) {
                    item1 = this.arr_items[this.getIndex(r, c + 2)];
                    item2 = this.arr_items[this.getIndex(r - 1, c + 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (r < TG_MapData.getInstance().rowNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 1)]) && this.isCanDraw(this.getIndex(r, c + 1))) {
                    item1 = this.arr_items[this.getIndex(r, c + 2)];
                    item2 = this.arr_items[this.getIndex(r + 1, c + 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
            }
            if (this.getIndex(r + 2, c) != -1 && this.isTrueItem(this.arr_items[this.getIndex(r + 2, c)])) {
                if (c > 0 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c - 1)]) && this.isCanDraw(this.getIndex(r + 1, c))) {
                    item1 = this.arr_items[this.getIndex(r + 2, c)];
                    item2 = this.arr_items[this.getIndex(r + 1, c - 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
                if (c < TG_MapData.getInstance().colNum - 1 && this.isTrueItem(this.arr_items[this.getIndex(r + 1, c + 1)]) && this.isCanDraw(this.getIndex(r + 1, c))) {
                    item1 = this.arr_items[this.getIndex(r + 2, c)];
                    item2 = this.arr_items[this.getIndex(r + 1, c + 1)];
                    this.getItemPos(temp_arr, item, item1, item2);
                    // continue;
                }
            }
        }
        return temp_arr;
    };
    /**
     * 获取可以移动的格子
     * @returns {Array<any>}
     */
    TG_Prompt.prototype.getAllCanMoveItem = function () {
        var arr = [];
        this.arr_items = TG_Game.Items;
        for (var i = 0; i < this.arr_items.length; i++) {
            var item = this.arr_items[i];
            if (this.isTrueItem2(item)) {
                arr.push(item);
            }
        }
        return arr;
    };
    /**
     * 获取可以移动的所有格子 包括特效块
     * @returns {Array<any>}
     */
    TG_Prompt.prototype.getAllCanMoveItem2 = function () {
        var arr = [];
        this.arr_items = TG_Game.Items;
        for (var i = 0; i < this.arr_items.length; i++) {
            var item = this.arr_items[i];
            if (this.isTrueItem(item)) {
                arr.push(item);
            }
        }
        return arr;
    };
    /**
     * 判断两个快是否是特效块
     * @param item1
     * @param item2
     */
    TG_Prompt.prototype.seekitemIsEqEffect = function (item1, item2) {
        if (item1.IsEffect() && item2.IsEffect()) {
            return true;
        }
        return false;
    };
    /**
     * 判断两个id是否相同
     * @param id1
     * @param id2
     * @returns {boolean}
     */
    TG_Prompt.prototype.seekItemIsEq = function (item1, item2) {
        // try {
        var id1 = item1.BlockId;
        var id2 = item2.BlockId;
        if (id1 % 10 == id2 % 10) {
            return true;
        }
        // }catch(e)
        // {
        //     Log.getInstance().trace(e);
        // }
        return false;
    };
    /**
     * 判断两个块种类是否相同
     * @param id1
     * @param id2
     * @returns {boolean}
     */
    TG_Prompt.prototype.seekItemIsEq2 = function (item1, item2) {
        if (item1 == -1 || item2 == -1)
            return false;
        if (!this.isTrueItem(item1) && !this.isTrueItem(item2))
            return false;
        // try {
        if (item1.Color == item2.Color) {
            return true;
        }
        // }catch(e)
        // {
        //     Log.getInstance().trace(e);
        // }
        return false;
    };
    /**
     *  判断三个块是否相同可消除
     * @param item1
     * @param item2
     * @param item3
     * @returns {boolean}
     */
    TG_Prompt.prototype.seekItemIsEq3 = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[0];
            if (!this.isTrueItem(items[i])) {
                return false;
            }
            if (item.Color != items[i].Color) {
                return false;
            }
        }
        return true;
    };
    /**
     *  获取行列对应的索引
     * @param r 所在行
     * @param c 所在列
     * @returns {number} 在数组中的索引
     */
    TG_Prompt.prototype.getIndex = function (r, c) {
        if (r >= TG_MapData.getInstance().rowNum)
            return -1;
        if (c >= TG_MapData.getInstance().colNum)
            return -1;
        var index = r * TG_MapData.getInstance().colNum + c; //得到index值
        return index;
    };
    /**
     * 获取该块是否可以移动
     * @param t_item
     * @returns {boolean}
     */
    TG_Prompt.prototype.isCanDraw = function (index) {
        if (index == -1)
            return false;
        var item = this.arr_items[index];
        if (item.IsItemNull() || item.IsItemNone())
            return false; //排除空块和填充快
        if (!item.IsCanDrag)
            return false; //排除不能移动的块
        if (!item.IsNormal())
            return false; //排除非普通块
        return true;
    };
    //包含特效块
    TG_Prompt.prototype.isTrueItem = function (item) {
        try {
            if (item.IsItemNull() || item.IsItemNone())
                return false; //排除空块和填充快
            if (!item.IsCanDrag)
                return false; //排除不能移动的块
            if (!item.IsNormal())
                return false; //排除非普通块
        }
        catch (e) {
            Log.getInstance().trace("asdas");
        }
        return true;
    };
    //不包含特效块 获取是否可以移动到格子item
    TG_Prompt.prototype.isTrueItem2 = function (item) {
        var back = true;
        if (item.IsItemNull() || item.IsItemNone())
            back = false; //排除空块和填充快
        if (item.IsCanDrag == false)
            back = false; //排除不能移动的块
        if (item.IsNormal() == false)
            back = false; //排除非普通块
        if (item.IsEffect() == true)
            back = false; //特效块不能移动
        return back;
    };
    TG_Prompt.prototype.getItemPos = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var t_arr = param[0];
        var arr = [];
        for (var i = 1; i < param.length; i++) {
            var item = param[i];
            if (!this.seek(t_arr, item))
                return; //去除重复
            var p = new Point(item.SitePos.X, item.SitePos.Y);
            // arr.push(p);
            arr.push(item);
        }
        t_arr.push(arr);
        return arr;
    };
    TG_Prompt.prototype.seek = function (arr, item1) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                var item = arr[i][j];
                if (item == item1) {
                    return false;
                }
            }
        }
        return true;
    };
    return TG_Prompt;
}(BaseClass));
__reflect(TG_Prompt.prototype, "TG_Prompt");
//# sourceMappingURL=TG_Prompt.js.map