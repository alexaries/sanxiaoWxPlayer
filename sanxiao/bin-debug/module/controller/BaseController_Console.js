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
 * Created by ZhangHui on 2018/5/31.
 */
var Log = (function (_super) {
    __extends(Log, _super);
    function Log() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colorArr = ["#ff0000", "#000", "#00ff00", "#00ffff", "#ccc", "#00cccc", "#cccc00", "#ffff00", "#00aaaa"];
        /*日志输出*/
        //是否已经启动外部日志
        _this.isOpenTrace = false;
        // 是否线上版本
        _this.isOnLine = false;
        _this.env = "dev";
        return _this;
    }
    Log.getInstance = function () {
        if (!this.baseController_Console) {
            this.baseController_Console = new Log;
        }
        return this.baseController_Console;
    };
    Log.prototype.trace = function (obj, type) {
        if (type === void 0) { type = 1; }
        this.env = ConfigConst.env;
        if (this.env == "pro" || this.env == "pre") {
            this.isOnLine = true;
            // this.isOnLine=false;
        }
        else {
            this.isOnLine = false;
        }
        if (type == 0) {
            if (this.isOnLine) {
                return;
            }
            console.log(obj);
        }
        else {
            if (window["ah_tester"]) {
                /**
                 * 启动测试器
                 * proId 项目id  X1 C1 D1
                 * cVersion 当前版本号码 0.0      1.0         2.0         3.0
                 * point 号码显示位置[1-4]左上 左下 右上 右下
                 * direction  1竖屏 2横屏左边 3横屏右边
                 * _isAddContent 是否显示调试控制台 【日志输出，版本信息】
                 * versionType 版本类型【demo（日志不会上传） alpha release】
                 * serverInfo 服务器信息
                 * */
                //false 时为正式版本，不可点击查看日志 true为仿真版本，可以点击查看日志
                // let version=0;// 0 测试版本  1正式版本
                // if(ConfigConst.env==""){
                //     version=0;
                // }
                if (!this.isOpenTrace) {
                    if (!this.isOnLine) {
                        window["ah_tester"].start("方块创造", ConfigConst.version, 1, 1, true, "demo");
                        this.trace1(obj);
                    }
                    else {
                        window["ah_tester"].start("方块创造", ConfigConst.version, 3, 1, false, "release");
                    }
                    this.isOpenTrace = true;
                }
                else {
                    if (!this.isOnLine) {
                        this.trace1(obj);
                    }
                }
            }
        }
    };
    /**
     * 输出日志
     * obj 内容 字符串 和 object都行
     * type number[0-9]特殊分类类型 0表示报错类型 未来在 宙斯盾使用时候用
     * name obj=object时标记名字（就是为了好区分）
     **/
    Log.prototype.trace1 = function (obj, type, name) {
        if (type === void 0) { type = 1; }
        if (name === void 0) { name = "对象"; }
        var self = this, num = 0;
        if (typeof obj == "string")
            log(obj);
        else if (typeof obj == "object") {
            myWhile(obj, name);
        }
        else if (typeof obj == "number") {
            log(obj.toString());
        }
        self = null;
        function log(str) {
            console.log("%c" + str, "color:" + self.colorArr[Number(type)]);
            /**测试器
             * 填充日志内容
             * str 内容 必须是字符串
             * type 类型（0表示错误类型 分类用到了）
             * userId  用户标识id (总控制台查询用到)
             * */
            str = str.replace(' ', '&nbsp');
            if (this.ah_tester)
                this.ah_tester.addLog(str, type, self.colorArr[Number(type)]);
        }
        function myWhile(obj, name, str, _isArr) {
            if (name === void 0) { name = ""; }
            if (str === void 0) { str = ""; }
            if (_isArr === void 0) { _isArr = false; }
            log(str + (_isArr ? ("[") : (name + ":{")));
            for (var i in obj) {
                if (num > 400) {
                    if (type != -1)
                        log("...输出超限了 ");
                    type = -1;
                    return;
                }
                if (typeof obj[i] == "object") {
                    myWhile(obj[i], i + "", str + "    ", obj[i] instanceof Array);
                }
                else {
                    num += Number((obj[i]).toString().length);
                    log(str + "    " + (!_isArr ? (i + ":" + obj[i]) : (obj[i])));
                }
            }
            log(str + (_isArr ? "]" : "}"));
        }
    };
    return Log;
}(BaseController1));
__reflect(Log.prototype, "Log");
//# sourceMappingURL=BaseController_Console.js.map