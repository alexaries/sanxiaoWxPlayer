/**
 * Created by ZhangHui on 2018/5/31.
 */
class BaseController_Proxy extends BaseController1{
    /*单例*/
    private static baseController_Proxy:BaseController_Proxy;
    public static getInstance(){
        if(!this.baseController_Proxy){
            this.baseController_Proxy=new BaseController_Proxy();
        }
        return this.baseController_Proxy;
    }
    /*连接服务器*/
    public connectServer(){
        //定义与服务器的通信方式
        BaseProxy.getInstance().connectType=2;
        if(BaseProxy.getInstance().connectType==0){
            //json
            BaseProxy_Json.getInstance().address="ws://cartest.dapai1.com:";
            BaseProxy_Json.getInstance().port=8029;
            BaseProxy_Json.getInstance().connectServer();
        }else if(BaseProxy.getInstance().connectType==1){
            //protobuf
            BaseProxy_Proto.getInstance().address="echo.websocket.org";
            BaseProxy_Proto.getInstance().port=80;
            BaseProxy_Proto.getInstance().connectServer();
        }else if(BaseProxy.getInstance().connectType==2){
            BaseProxy_Http.getInstance().connectServer();
        }
        /*接受服务器主动推送消息*/
        this.initAutoBackFun();
    }
    /*接受服务器主动推送消息*/
    public initAutoBackFun(){
        if(BaseProxy.getInstance().connectType==0){
            //json
            BaseProxy_Json.getInstance().isOpenAutoBackFun=true;
            BaseProxy_Json.getInstance().autoBackFun=this.autoBackFun.bind(this);
        }else if(BaseProxy.getInstance().connectType==1){
            //protobuf
            BaseProxy_Proto.getInstance().isOpenAutoBackFun=true;
            BaseProxy_Proto.getInstance().autoBackFun=this.autoBackFun.bind(this);
        }else if(BaseProxy.getInstance().connectType==2){

        }
    }
    private autoBackFun(data){
        Log.getInstance().trace(data)
    }
}