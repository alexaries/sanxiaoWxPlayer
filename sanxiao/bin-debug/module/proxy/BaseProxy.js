var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/5/31.
 */
var BaseProxy1 = (function () {
    function BaseProxy1() {
        /*服务器的地址*/
        this.address = "";
        /*服务器的端口号*/
        this.port = 0;
        /*服务器的通信方式*/
        this.connectType = 0; //0 json 1 protobuf 2http请求
        /*是否已连接服务器*/
        this.isConnected = false;
        /*回调方法池--请求服务器*/
        this.backFunList = {};
        this.isOpenAutoBackFun = false;
    }
    BaseProxy1.getInstance = function () {
        if (!this.baseProxy) {
            this.baseProxy = new BaseProxy1();
        }
        return this.baseProxy;
    };
    return BaseProxy1;
}());
__reflect(BaseProxy1.prototype, "BaseProxy1");
//# sourceMappingURL=BaseProxy.js.map