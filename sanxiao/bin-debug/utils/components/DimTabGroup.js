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
var game;
(function (game) {
    /**
     *
     * 标签页组
     * @author iceman
     *
     */
    var DimTabGroup = (function (_super) {
        __extends(DimTabGroup, _super);
        //private theLockIndex:number=-1;//锁定某个选项
        function DimTabGroup() {
            var _this = _super.call(this) || this;
            _this.selectIndex = 0; //选中序列
            _this.bCreateChildren = false; //是否加载完毕
            _this.containerList = new Array();
            return _this;
        }
        DimTabGroup.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.init();
        };
        DimTabGroup.prototype.init = function () {
            var num = this.numChildren;
            var bt;
            for (var i = 0; i < num; i++) {
                bt = this.getChildAt(i);
                bt.name = bt.x + '_' + bt.y;
                if (i == this.selectIndex) {
                    this.selectItem = bt;
                    bt.enabled = false;
                }
                bt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectBtHandler, this);
            }
            this.selecting(this.selectIndex);
            this.bCreateChildren = true;
        };
        DimTabGroup.prototype.selectBtHandler = function (e) {
            if (this.selectItem) {
                this.selectItem.enabled = true;
            }
            this.selectItem = e.currentTarget;
            this.selectItem.enabled = false;
            var index = this.getChildIndex(this.selectItem);
            this.selecting(index);
            if (this.selectCallFun) {
                //选中回调
                this.selectCallFun.call(this.selectCallFunObj);
            }
        };
        DimTabGroup.prototype.setSetletctByIndex = function (index) {
            var num = this.numChildren;
            for (var i = 0; i < num; i++) {
                var button = this.getChildAt(i);
                if (i == index) {
                    if (this.selectItem) {
                        this.selectItem.enabled = true;
                    }
                    this.selectIndex = index;
                    this.selectItem = button;
                    this.selectItem.enabled = false;
                }
            }
            this.selecting(this.selectIndex);
        };
        DimTabGroup.prototype.selecting = function (_index) {
            if (this.containerList[this.selectIndex]) {
                this.containerList[this.selectIndex].visible = false;
            }
            this.selectIndex = _index;
            if (this.containerList[this.selectIndex]) {
                this.containerList[this.selectIndex].visible = true;
            }
        };
        /**
         *  选中回调
         * @param fun
         */
        DimTabGroup.prototype.setSelectCallFun = function (fun, thisObj) {
            this.selectCallFun = fun;
            this.selectCallFunObj = thisObj;
        };
        // //获得选中的对象
        // public lockIndex(_lockindex:number):void{
        //     this.theLockIndex=_lockindex;
        // }
        /**
         * 代码设置选中
         * @param _index
         */
        DimTabGroup.prototype.setSelect = function (_index) {
            if (this.bCreateChildren) {
                if (this.selectItem) {
                    this.selectItem.enabled = true;
                }
                this.selectItem = this.getChildAt(_index);
                this.selectItem.enabled = false;
                this.selecting(_index);
            }
            else {
                this.selectIndex = _index;
            }
        };
        /**
         * 设置选中后 显示的容器
         * @param args
         */
        DimTabGroup.prototype.setContainer = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                if (this.selectIndex != i) {
                    args[i].visible = false;
                }
                else {
                    args[i].visible = true;
                }
                this.containerList.push(args[i]);
            }
        };
        /**
         * 设置开启条件,未开启的标签xy设置为0，0。为了组件可以自适应大小
         * @param layout 布局方式
         * @param args
         */
        DimTabGroup.prototype.setOpenLv = function (layout) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var count = 0;
            for (var i = 0; i < args.length; i++) {
                var flag = true; //game.OpenFunctionManager.getInstance().getOpenFunFlag(args[i]);
                this.getChildAt(i).visible = flag;
                if (flag) {
                    if (i == count) {
                        var xy = this.getChildAt(i).name.split('_');
                        this.getChildAt(i).x = Number(xy[0]);
                        this.getChildAt(i).y = Number(xy[1]);
                    }
                    else {
                        if (layout == game.DimTabGroup.LAYOUT_HORIZONTAL) {
                            this.getChildAt(i).x = count * this.getChildAt(i).width * this.getChildAt(i).scaleX;
                        }
                        else if (layout == game.DimTabGroup.LAYOUT_VERTICAL) {
                            this.getChildAt(i).y = count * this.getChildAt(i).height * this.getChildAt(i).scaleY;
                        }
                    }
                    count++;
                }
                else {
                    this.getChildAt(i).x = 0;
                    this.getChildAt(i).y = 0;
                }
            }
        };
        DimTabGroup.prototype.getCurrentPageIndex = function () {
            return this.selectIndex;
        };
        DimTabGroup.LAYOUT_HORIZONTAL = 'horizontal';
        DimTabGroup.LAYOUT_VERTICAL = 'vertical';
        return DimTabGroup;
    }(eui.Group));
    game.DimTabGroup = DimTabGroup;
    __reflect(DimTabGroup.prototype, "game.DimTabGroup");
    // if (GameConfig.isMiniGame) {
    // 	window['game']['DimTabGroup'] = game.DimTabGroup;
    // }
})(game || (game = {}));
//# sourceMappingURL=DimTabGroup.js.map