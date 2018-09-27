class LoadingUIback1 extends BaseClassSprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        // this.createView();
        this.createPic();
        this.createMove();
    }

    private textField: egret.TextField;

    private createView(): void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    }

    public onProgress(current: number, total: number): void {
        // this.textField.text = `Loading...${current}/${total}`;
        let wid1 = current/total;

        this.loadingBar.width=(this.loadingBarBg.width)*wid1;
        this.numField.text = Math.floor(wid1*100)+"%";
        if(Math.floor(wid1) * 100 >= 100)
        {
            // this.initStartBtn();
            if(ConfigConst.open_wxLogin)
                this.init_userInfo();
            else
                this.initStartBtn();
        }
    }
    private loadingBg:egret.Bitmap;
    private loadingLogo:egret.Bitmap;
    private createPic():void{
        //背景
        this.loadingBg=new egret.Bitmap(RES.getRes("bg11_png"));

        this.addChild(this.loadingBg);
        this.loadingBg.width=Main.stageWidth;
        this.loadingBg.height=Main.stageHeight;
        //logo
        // this.loadingLogo=new egret.Bitmap(RES.getRes("bg22_png"));
        // this.addChild(this.loadingLogo);
        // Tool.getInstance().setAnchorPoint(this.loadingLogo);
        // this.loadingLogo.x=Main.stageWidth/2;
        // this.loadingLogo.y=Main.stageHeight*.21;
    }
    private loadingBar:egret.Bitmap;
    private loadingBarBg:egret.Bitmap;
    private mywidth=0;
    private numField:egret.TextField;
    private createMove(){
        this.loadingBarBg=new egret.Bitmap(RES.getRes("bg33_png"));
        this.addChild(this.loadingBarBg);
        this.loadingBarBg.scale9Grid=new egret.Rectangle(24,17,5,5);
        this.loadingBarBg.width=Main.stageWidth*.6;
        Tool.getInstance().setAnchorPoint(this.loadingBarBg);
        this.loadingBarBg.x=Main.stageWidth/2;
        this.loadingBarBg.y=Main.stageHeight*.9;
        this.mywidth=this.loadingBarBg.width;

        this.loadingBar=new egret.Bitmap(RES.getRes("bg44_png"));
        this.addChild(this.loadingBar);
        this.loadingBar.scale9Grid=new egret.Rectangle(24,17,5,5);
        this.loadingBar.height=20;
        this.loadingBar.anchorOffsetY=this.loadingBar.height/2;
        this.loadingBar.x=this.loadingBarBg.x-this.loadingBarBg.width/2;
        this.loadingBar.y=this.loadingBarBg.y;

        this.numField = new egret.TextField();
        this.addChild(this.numField);
        this.numField.textColor=0x7446A9;
        this.numField.width = Main.stageWidth*.1;
        this.numField.height = 100;
        this.numField.textAlign = "center";
        this.numField.x =this.loadingBarBg.x+this.loadingBarBg.width*.53;
        this.numField.y=this.loadingBarBg.y-this.loadingBarBg.height/2;
    }

    //微信登录
    public init_userInfo()
    {
        let code:string = SystemConst.urlParameters["code"];
        if(code == null && ConfigConst.open_wxLogin)
        {
            //没有code，调用授权页面
            let appid:string = "wx6ed869909f329685";
            let game_url:string = location.href;

            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + game_url + "&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
            return;
        }
        App.EasyLoading.showLoading();

        let hash:egret.URLVariables = new egret.URLVariables("code="+code);
        App.MessageCenter.addListener(Msg.NetEvent.Get_UserInfo,this.get_userInfo,this);
        App.Http.send(Msg.NetEvent.Get_UserInfo,hash)
    }
    //得到用户信息
    public get_userInfo(data)
    {
        App.EasyLoading.hideLoading();
        //初始化用户信息
        PbPlayer.getInstance().Init_Wx_UserInfo = data;
        this.initStartBtn();
    }

    // /*显示开始按钮*/
    private startBtn:Button;
    private initStartBtn(){
        this.startBtn=new Button("bg55_png");
        this.addChild(this.startBtn);
        this.startBtn.x=Main.stageWidth/2;
        this.startBtn.y=Main.stageHeight*.7;
        this.startBtn.alpha=0;

        egret.Tween.get(this.startBtn).to({alpha:1},500).call(function () {
            egret.Tween.removeTweens(this.startBtn);
        }.bind(this));
        this.startBtn.addTouchEvent();
        this.startBtn.addEventListener("click",this.startBtnEvent,this);
    }
    private startBtnEvent(){
        let stageData = TG_MapData.getInstance().stageData;
        Log.getInstance().trace(stageData, 0);
        if (!stageData) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!",2000);
            return;
        }
        let stage = stageData.Stage;
        Log.getInstance().trace(stage, 0);
        if (!stage) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!",2000);
            return;
        }
        let blocks = stage.Blocks;
        Log.getInstance().trace(blocks,0);
        if (!blocks) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!",2000);
            return;
        }
        if (stageData && stage && blocks) {
            this.removeself();
            BaseController1.getInstance().gameStartEvent();
        }
    }







}
