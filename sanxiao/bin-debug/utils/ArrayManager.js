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
 * Created by ZhangHui on 2018/8/23.
 * Array 管理类
 */
var ArrayManager = (function (_super) {
    __extends(ArrayManager, _super);
    /**
     * 构造函数
     */
    function ArrayManager() {
        return _super.call(this) || this;
    }
    /*从小到大*/
    ArrayManager.prototype.ArrayUp = function (arr) {
        arr.sort(function (num1, num2) {
            return num1 - num2;
        });
        return arr;
    };
    /*从大到小*/
    ArrayManager.prototype.ArrayDown = function (arr) {
        arr.sort(function (num1, num2) {
            return num2 - num1;
        });
        return arr;
    };
    /*从小到大 按照对象中字段值*/
    ArrayManager.prototype.ArrayUpItem = function (arr, item) {
        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            };
        }
        arr.sort(compare(item));
        return arr;
    };
    /*从大到小 按照对象中字段值*/
    ArrayManager.prototype.ArrayDownItem = function (arr, item) {
        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            };
        }
        arr.sort(compare(item));
        return arr;
    };
    /*删除一个元素*/
    ArrayManager.prototype.removeItem = function (num, arr) {
        var index = this.getIndex(num, arr);
        if (index > -1) {
            //数组中存在要删除元素
            arr.splice(index, 1);
        }
        return arr;
    };
    /*查找元素的index*/
    ArrayManager.prototype.getIndex = function (num, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == num) {
                return i;
            }
        }
        return -1;
    };
    /*数组去重*/
    ArrayManager.prototype.distinct = function (arr) {
        var result = [];
        arr.forEach(function (v, i, arr) {
            var bool = arr.indexOf(v, i + 1);
            if (bool === -1) {
                result.push(v);
            }
        });
        return result;
    };
    /*
    * 深赋值拷贝数据
    * @param obj:当前数字、字符串、对象、数组 暂无问题
    * */
    ArrayManager.prototype.deepCopy = function (obj) {
        var newObj = obj.constructor === Array ? [] : {}; //判断深拷贝是对象还是数组
        for (var i in obj) {
            if (typeof obj[i] === 'object') {
                // 如果要拷贝的对象的属性依然是个复合类型，继续递归
                newObj[i] = this.deepCopy(obj[i]);
            }
            else {
                newObj[i] = obj[i];
            }
        }
        return newObj;
    };
    return ArrayManager;
}(BaseClass));
__reflect(ArrayManager.prototype, "ArrayManager");
//# sourceMappingURL=ArrayManager.js.map