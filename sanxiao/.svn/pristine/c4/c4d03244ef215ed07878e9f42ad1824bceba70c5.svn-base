/**
 * Created by ZhangHui on 2018/5/31.
 */
class BaseProxy1 {
    /*单例*/
    private static baseProxy:BaseProxy1;
    public static getInstance(){
        if(!this.baseProxy){
            this.baseProxy= new BaseProxy1();
        }
        return this.baseProxy;
    }
    /*服务器的地址*/
    public address="";
    /*服务器的端口号*/
    public port:number=0;
    /*服务器的通信方式*/
    public connectType=0;//0 json 1 protobuf 2http请求
    /*网络套接字对象*/
    public webSocket:egret.WebSocket;
    /*是否已连接服务器*/
    public isConnected: boolean = false;
    /*回调方法池--请求服务器*/
    public backFunList={};
    /*主动回调--服务器推送*/
    public autoBackFun:Function;
    public isOpenAutoBackFun=false;

}