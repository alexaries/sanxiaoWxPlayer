/**
 * Created by ZhangHui on 2018/5/31.
 */
class BaseProxy_Json extends BaseProxy1{
    private static baseProxy_Json:BaseProxy_Json;
    public static getInstance(){
        if(!this.baseProxy_Json){
            this.baseProxy_Json=new BaseProxy_Json();
        }
        return this.baseProxy_Json;
    }
    public connectServer(): void {
        if(this.isConnected){
            Log.getInstance().trace("已有连接，勿重复");
            return;
        }
        //new一个套接字（唯一的连接标识）
        this.webSocket = new egret.WebSocket();
        //2
        //侦听 套接字 跟 服务器 的 连接事件（如果检测到 连接至服务器成功了，就 转向 成功后要执行的子程序 onSocketOpen）
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //3
        //侦听 套接字 的 收到数据事件（如果检测到 服务器返回了数据，就 转向 收到数据后要执行的子程序 onReceiveMessage）
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        //4添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //5添加异常侦听，出现异常会调用此方法
        this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //6用 套接字 去尝试连接至 服务器
        this.webSocket.connectByUrl(this.address+this.port+"/ws/");
    }
    /*登录大厅*/
    public commonLogin(backFun){
        //登录
        var data={
            "uuId":1+"",
            "token":"test",
            "channel":100+"",
            "platForm":"ios"
        };
        this.sendData({
            msgId:1,
            msgBody:JSON.stringify(data)
        },backFun);
    }
    /**向 服务器 发送数据*/
    private sendData(data,backFun,_isLoading=false):void{
        if(!this.isConnected){Log.getInstance().trace("尚未建立连接");return;}
        Log.getInstance().trace("------------------发送的数据------------------------------");
        Log.getInstance().trace(data);
        /*加入回调方法池*/
        this.backFunList[data.msgId]=backFun;
        /*开始发送请求*/
        this.webSocket.writeUTF(JSON.stringify(data));
        this.webSocket.flush();
    }
    /**收到 服务器发来数据 后 执行的子程序*/
    private onReceiveMessage(e:egret.Event):void {
        var msg = this.webSocket.readUTF();
        var msg1=JSON.parse(msg);
        Log.getInstance().trace("---------收到服务器数据-----------");
        Log.getInstance().trace(msg1);
        if(this.backFunList[msg1.msgId]){
            this.backFunList[msg1.msgId](msg1);
        }else {
            if(this.isOpenAutoBackFun){
                this.autoBackFun(msg1);
            }
        }
    }
    /**与服务器连接成功后 执行的子程序*/
    private onSocketOpen():void {
        this.isConnected = true;
        Log.getInstance().trace("与服务器成功连接");
        //登陆
        this.commonLogin(function () {
            Log.getInstance().trace("登陆大厅成功")
        });
    }
    private onSocketClose():void {
        this.isConnected=false;
        Log.getInstance().trace("与服务器断开连接");
    }
    private onSocketError():void {
        this.isConnected=false;
        Log.getInstance().trace("连接服务器出错");
    }
    /*主动关闭与服务器的链接*/
    public autoCloseLink():void{
        this.isConnected = false;
        this.webSocket.close();
    }

}