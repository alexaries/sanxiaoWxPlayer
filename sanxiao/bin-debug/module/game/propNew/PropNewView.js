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
/** 道具显示类 新
 *
 * Created by HuDe Zheng on 2018/8/10.
 */
var PropNewView = (function (_super) {
    __extends(PropNewView, _super);
    function PropNewView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.itemWidth = 0;
        _this.mouseBeginX = 0;
        _this.move = false;
        _this.thisHeight = 0;
        _this.listData_src = [];
        _this.item_num = 0;
        _this.kong = 50;
        _this.cellHeight = 176;
        _this.center = 0;
        _this.conX = 0;
        _this.conY = 500;
        /*根据道具数量排序*/
        _this.baseXList = [];
        _this.skinName = "propNewUI";
        _this.cacheAsBitmap = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.mouseBegin, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.mouseEnd, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.mouseMove, _this);
        return _this;
    }
    PropNewView.prototype.mouseBegin = function (e) {
        this.mouseBeginX = e.stageX;
        this.move = true;
    };
    PropNewView.prototype.mouseMove = function (e) {
        if (!this.move)
            return;
        var temp = this.mouseBeginX - e.stageX;
        var moveWidth = 20;
        if (Math.abs(temp) > 80) {
            moveWidth = 20;
        }
        else {
            moveWidth = temp;
        }
        for (var i = 0; i < PropNewView.itemList.length; i++) {
            var item = PropNewView.itemList[i];
            if (temp > 0) {
                if (i == 0) {
                    if (item.x - moveWidth < -560) {
                        this.move = false;
                        return;
                    }
                    else {
                        //向左
                        item.x -= Math.abs(moveWidth);
                    }
                }
                else {
                    //向左
                    item.x -= Math.abs(moveWidth);
                }
            }
            else {
                if (i == 0) {
                    if (item.x + Math.abs(moveWidth) > this.kong) {
                        this.move = false;
                        return;
                    }
                    else {
                        //向右
                        item.x += Math.abs(moveWidth);
                    }
                }
                else {
                    //向右
                    item.x += Math.abs(moveWidth);
                }
            }
        }
        this.OnDragRound();
        this.mouseBeginX = e.stageX;
    };
    PropNewView.prototype.mouseEnd = function (e) {
        this.move = false;
    };
    /**
     *  道具数量变化
     * @param propId 道具id
     * @param type 0减 1加
     * @param num 变化数量
     */
    PropNewView.prototype.useProp = function (propId, type, num) {
        if (type === void 0) { type = 0; }
        if (num === void 0) { num = 1; }
        for (var i = 0; i < PropNewView.itemList.length; i++) {
            var item = PropNewView.itemList[i];
            if (item.type == propId) {
                item.refreshData(num, type);
                //先排序
                this.handleProps();
                this.OnDragRound();
                return;
            }
        }
    };
    PropNewView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        if (param.length > 0) {
            this.fitPanel = param[0];
        }
        this.initData1();
        if (this.thisHeight == 0) {
            this.thisHeight = this.height;
        }
        this.y = Main.stageHeight - this.thisHeight + 80;
        this.bgImg.y = this.thisHeight - 200;
        var px = (Main.stageWidth - 1080) / 2;
        this.bgImg.x = -px;
        this.bgImg.width = Main.stageWidth;
    };
    PropNewView.prototype.initData1 = function () {
        this.item_num = 0;
        PropNewView.itemList = [];
        if (PropNewView.itemList.length == 0) {
            for (var i = 0; i < 10; i++) {
                this["item" + (i + 1)].visible = false;
            }
        }
        this.listData_src = [];
        this.baseXList = [];
        var items = TG_Stage.Items;
        var img = ConfigGameData.getInstance().PropImage;
        //当前是什么模式
        var mode_type = 0;
        var ti_arr = [];
        for (var types in img) {
            if (TG_Stage.IsTimeLimit) {
                if (parseInt(types) == 7 || parseInt(types) == 8)
                    continue;
            }
            else if (TG_Stage.IsStepLimit) {
                if (parseInt(types) == 9 || parseInt(types) == 10)
                    continue;
            }
            PropNewView.itemList.push(this["item" + (parseInt(types))]);
            var obj1 = img[types];
            var num = this.getItems(items, parseInt(types));
            var item = PropNewView.itemList[PropNewView.itemList.length - 1];
            item.type = parseInt(types);
            item.num = num;
            item.refreshData2(); //刷新状态
            item.visible = true;
            item.numTex.text = "免费" + num.toString();
            item.propImg.source = obj1;
            if (num <= 0) {
                item.title.visible = false;
                item.hs();
            }
            this.listData_src.push({ "rect": "", "img": obj1, "num": num, "type": types });
            item.index = this.item_num;
            // item.currentIndex=this.item_num;
            item.x = this.item_num * (this.cellHeight + 27) + this.kong;
            // console.log(types+"++++"+item.x)
            this.baseXList.push(item.x);
            item.y = 0;
            this.itemWidth += item.width;
            this.item_num++;
        }
        //中心点坐标
        this.center = (1080 - this.kong * 2) / 2;
        //先排序
        this.handleProps();
        this.OnDragRound();
    };
    PropNewView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.close.call(this, param);
    };
    PropNewView.prototype.handleProps = function () {
        var baseArr = [0, 1, 2, 3, 4, 5, 6, 7];
        //首先按照正常的道具顺序排序
        var itemList = [];
        for (var i = 0; i < baseArr.length; i++) {
            for (var j = 0; j < PropNewView.itemList.length; j++) {
                if (PropNewView.itemList[j].index == baseArr[i]) {
                    PropNewView.itemList[j].currentIndex = PropNewView.itemList[j].index;
                    PropNewView.itemList[j].x = this.baseXList[i];
                    itemList.push(PropNewView.itemList[j]);
                }
            }
        }
        //数量不为0的道具，找到之前第一个数量为0的道具 交换currentIndex
        for (var i = 0; i < itemList.length; i++) {
            if (itemList[i].num > 0) {
                for (var j = 0; j < i + 1; j++) {
                    if (itemList[j].num == 0) {
                        var temp1 = itemList[i];
                        var temp2 = itemList[j];
                        var index1 = temp1.index;
                        var index2 = temp2.index;
                        var x1 = temp1.x;
                        var x2 = temp2.x;
                        itemList[i] = temp2;
                        itemList[j] = temp1;
                        itemList[i].x = x1;
                        itemList[j].x = x2;
                        itemList[i].currentIndex = index1;
                        itemList[j].currentIndex = index2;
                    }
                }
            }
        }
        //根据currentIndex进行排序
        PropNewView.itemList = App.ArrayManager.ArrayUpItem(itemList, "currentIndex");
    };
    PropNewView.prototype.OnDragRound = function () {
        var ballRadius = this.cellHeight / 2;
        this.baseXList = [];
        for (var i = 0; i < PropNewView.itemList.length; i++) {
            var item = PropNewView.itemList[i];
            var index = item.index;
            if (item.x <= this.center) {
                var yy = ((this.center - item.x) / this.center);
                yy = yy * 60;
                item.y = yy;
            }
            else {
                var yy = Math.abs((this.center - item.x) / this.center) + 0.1;
                yy = yy * 60;
                item.y = yy;
            }
            this.baseXList.push(item.x);
            // console.log("&&&&&");
            // console.log(item.index+"++++"+item.x)
        }
    };
    PropNewView.prototype.getItems = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (id == arr[i]["id"]) {
                return arr[i]["num"];
            }
        }
        return 0;
    };
    PropNewView.itemList = [];
    return PropNewView;
}(BaseEuiView));
__reflect(PropNewView.prototype, "PropNewView");
//# sourceMappingURL=PropNewView.js.map