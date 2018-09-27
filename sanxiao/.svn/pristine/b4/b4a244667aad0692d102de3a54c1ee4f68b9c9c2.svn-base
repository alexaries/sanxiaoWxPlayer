/**
 * Created by ZhangHui on 2018/5/31.
 */
class BaseProxy_Proto extends BaseProxy1{
    private static baseProxy_Proto:BaseProxy_Proto;
    public static getInstance(){
        if(!this.baseProxy_Proto){
            this.baseProxy_Proto=new BaseProxy_Proto();
        }
        return this.baseProxy_Proto;
    }
    private Proto: any;
    public connectServer(): void {
        this.load("./resource/test.proto", (err: any, root: any) => {
            // console.log(root);
            this.Proto = root.Test;
            this.startConnect();
        });
    }
    /**
     * 使用框架内部加载外部proto文件
     * @param  {any} url proto文件路径 也可以是路径数组（可包含多条路径）
     * @param  {any} options (err: any, root: any) => {}加载完成后回调
     * @param  {any} callback=null
     * @returns void
     */
    private load(url: any, options, callback = null): void {
        let self: any = new protobuf.Root();
        let queued: number = 0;
        let path: string;
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        let finish = (err, root) => {
            if (!callback || queued) return;
            callback(err, root);
        }
        let process = (filename, source) => {
            self.files.push(filename);
            let parsed = protobuf.parse(source, self, options), resolved;
            if (parsed.imports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.imports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.imports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT)
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            }
            if (parsed.weakImports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.weakImports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.weakImports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT);
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            };
            finish(null, self);
        }
        if (typeof url === "string") {
            path = url.slice(0, url.lastIndexOf("/") + 1);
            RES.getResByUrl(url, function (source_: any) {
                process(url, source_);
            }, this, RES.ResourceItem.TYPE_TEXT);
        } else {
            for (let i = 0; i < url.length; i++) {
                RES.getResByUrl(url[i], function (source_: any) {
                    let tempurl: string = url[i];
                    path = tempurl.slice(0, tempurl.lastIndexOf("/") + 1);
                    process(tempurl, source_);
                }, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
    }
    /*开始连接服务器*/
    private startConnect(){
        if(this.isConnected){
            Log.getInstance().trace("已有连接，勿重复");
            return;
        }
        //1
        // new一个套接字（唯一的连接标识）
        this.webSocket = new egret.WebSocket();
        //2
        // 设置数据格式为二进制，默认为字符串
        this.webSocket.type = egret.WebSocket.TYPE_BINARY;
        //3
        //侦听 套接字 跟 服务器 的 连接事件（如果检测到 连接至服务器成功了，就 转向 成功后要执行的子程序 onSocketOpen）
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //4
        //侦听 套接字 的 收到数据事件（如果检测到 服务器返回了数据，就 转向 收到数据后要执行的子程序 onReceiveMessage）
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        //5
        // 添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //6
        // 添加异常侦听，出现异常会调用此方法
        this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //7
        // 用 套接字 去尝试连接至 服务器
        this.webSocket.connect(this.address,this.port);
    }
    private messageTest(backFun){
        var obj: Object = {
            SID: "123456",
            RID: 0,
            GPS_LNG: 0,
            GPS_LAT: 0,
            openid: "000",
            token: undefined
        }
        /**
         * 获取buff
         */
        var buff: Uint8Array = this.getProto(100, obj);
        // console.log("==============发送的二进制数据======================");
        // console.log(buff)
        /**把buff写入ByteArray */
        var byte: egret.ByteArray = new egret.ByteArray();
        byte._writeUint8Array(buff);
        this.sendData(byte);
    }
    /**
     * ID:
     * body:要传输的数据
     * 返回buff
     */
    private getProto(ID: number, body: Object): any {
        var ProMessage: any = this.Proto.Message;
        var BodyClass: any;
        // console.log(this.Proto.Login, this.Proto[100], this.Proto['Login'])
        switch (ID) {
            case 100:
                BodyClass = this.Proto.Login;
                break;
        }

        //----------------
        var message: any = {
            "ID": ID,
            "MSG": BodyClass.encode(BodyClass.create(body)).finish()
        }
        var messageBuffer: any = ProMessage.encode(ProMessage.create(message)).finish();
        // console.log("[发-" + ID + "]", body);
        return messageBuffer;
    }
    /**向 服务器 发送数据*/
    private sendData(data,backFun=null,_isLoading=false):void{
        if(!this.isConnected){Log.getInstance().trace("尚未建立连接");return;}
        /*开始发送请求*/
        this.webSocket.writeBytes(data);
        this.webSocket.flush();
    }
    private onReceiveMessage(e: egret.Event): void {
        //创建 ByteArray 对象
        var byte: egret.ByteArray = new egret.ByteArray();
        //读取数据
        this.webSocket.readBytes(byte);
        //从二进制中读取出uint8Arry
        var uint8: Uint8Array = new Uint8Array(this.getUint8Array(byte));
        // console.log("==============收到的二进制数据=====================");
        // console.log(uint8)
        var Message: any = this.Proto.Message;
        var data: any = Message.decode(uint8);
        this.onGotLoginMessage(data);
    }
    /**
     * 返回一个uintArray数据
     */
    private getUint8Array(byte: egret.ByteArray): Array<number> {
        let data: Array<number> = [];
        for (let i: number = 0; i < byte.dataView.byteLength; i++) {
            data.push(byte.dataView.getUint8(i));
        }
        return data;
    }
    protected onGotLoginMessage(msg: any): void {
        var obj: any;
        switch (msg.ID) {
            case 100://登陆成功
                obj = this.Proto.Login.decode(msg.MSG);
                break;
            default:
                break;
        }
        // console.log("[收-" + msg.ID + "]", obj);
    }
    /**与服务器连接成功后 执行的子程序*/
    private onSocketOpen(): void {
        this.isConnected = true;
        Log.getInstance().trace("与服务器成功连接");
        //登陆
        this.messageTest(function () {
            Log.getInstance().trace("pro消息发送接收成功")
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