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
var BaseController_Proxy = (function (_super) {
    __extends(BaseController_Proxy, _super);
    function BaseController_Proxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseController_Proxy.getInstance = function () {
        if (!this.baseController_Proxy) {
            this.baseController_Proxy = new BaseController_Proxy();
        }
        return this.baseController_Proxy;
    };
    /*连接服务器*/
    BaseController_Proxy.prototype.connectServer = function () {
        //定义与服务器的通信方式
        BaseProxy.getInstance().connectType = 2;
        if (BaseProxy.getInstance().connectType == 0) {
            //json
            BaseProxy_Json.getInstance().address = "ws://cartest.dapai1.com:";
            BaseProxy_Json.getInstance().port = 8029;
            BaseProxy_Json.getInstance().connectServer();
        }
        else if (BaseProxy.getInstance().connectType == 1) {
            //protobuf
            BaseProxy_Proto.getInstance().address = "echo.websocket.org";
            BaseProxy_Proto.getInstance().port = 80;
            BaseProxy_Proto.getInstance().connectServer();
        }
        else if (BaseProxy.getInstance().connectType == 2) {
            BaseProxy_Http.getInstance().connectServer();
        }
        /*接受服务器主动推送消息*/
        this.initAutoBackFun();
    };
    /*接受服务器主动推送消息*/
    BaseController_Proxy.prototype.initAutoBackFun = function () {
        if (BaseProxy.getInstance().connectType == 0) {
            //json
            BaseProxy_Json.getInstance().isOpenAutoBackFun = true;
            BaseProxy_Json.getInstance().autoBackFun = this.autoBackFun.bind(this);
        }
        else if (BaseProxy.getInstance().connectType == 1) {
            //protobuf
            BaseProxy_Proto.getInstance().isOpenAutoBackFun = true;
            BaseProxy_Proto.getInstance().autoBackFun = this.autoBackFun.bind(this);
        }
        else if (BaseProxy.getInstance().connectType == 2) {
        }
    };
    BaseController_Proxy.prototype.autoBackFun = function (data) {
        Log.getInstance().trace(data);
    };
    return BaseController_Proxy;
}(BaseController1));
__reflect(BaseController_Proxy.prototype, "BaseController_Proxy");
//# sourceMappingURL=BaseController_Proxy.js.map