import URLVariables = egret.URLVariables;

class Main extends egret.DisplayObjectContainer {
    /*舞台*/
    public MainStage;
    /*this*/
    public MainThis;
    public static CommonThis;
    //全局宽度
    public static  stageWidth = 1080;
    //全局高度
    public static stageHeight = 1920;
    /*url拼接的参数*/
    public static urlData;
    public static stageId = "";
    public constructor() {
        super();
        egret.ImageLoader.crossOrigin = "anonymous";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(e:egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        // 配置信息初始化
        ConfigConst.init();
        /*获取url参数*/
        SystemConst.urlParameters = Tool.getInstance().getUrlParameters();
        SystemConst.urlLink = Tool.getInstance().getUrlLink();
        let urlParamArr = SystemConst.urlParameters;
        // let urlLink = SystemConst.urlLink;

        let stageId = urlParamArr["StageId"];
        if (!stageId) {
            alert("关卡id不能为空");
        }
        Main.stageId = stageId;
        let env = ConfigConst.env;
        let wxUserId = urlParamArr["wxUserId"];
        let sType = urlParamArr["sType"];
        let isWeixinBrowser = App.DeviceUtils.IsWeixinBrowser;

        if (isWeixinBrowser && (env =='pro' || env == 'pre')) {
            // 链接中不包含wxUserId
            if (!wxUserId) {// 跳转微信服务器获取用户信息
                window.location.href="http://h5wxlogin.ugcapp.com/wxLogin/authorize?StageId="+stageId+"&sType=2&urlLink="+encodeURI(encodeURI(SystemConst.urlLink));
                return;
            }
            if (wxUserId) {
                WxUser.getInstance().wxUserId = wxUserId;
                App.MessageCenter.addListener("wx_login",this.wxloginBackHandler,this);
                App.Http.initServer(ConfigConst.wxUserInfoUrl,"1");
                App.Http.send("wx_login",new URLVariables("wxUserId="+wxUserId));
            }
        } else {// sType ==1 时 跳过微信登录
            WxUser.getInstance().status =0;
            WxUser.getInstance().msg = "非正式环境，不能获取微信信息";
            WxUser.getInstance().openid = "-1";
            WxUser.getInstance().wxUserId = "-1";
            WxUser.getInstance().nickname = "无名小卒";
            WxUser.getInstance().sex = 0;
            WxUser.getInstance().headimgurl = "head001_png";
            WxUser.getInstance().language = "zh-CN";
            WxUser.getInstance().country = "中国";
            WxUser.getInstance().province = "北京";
            WxUser.getInstance().city = "北京";
            // alert(JSON.stringify(WxUser.getInstance()));
            this.initGameData();
        }
    }

    /**
     * 微信登录时调用该方法
     * @param data
     */
    public wxloginBackHandler(data) {
        App.MessageCenter.removeListener("wx_login",this.wxloginBackHandler,this);
        if (!data || data && data["status"] == 0) {// 获取微信用户信息失败
            window.location.href="http://h5wxlogin.ugcapp.com/wxLogin/authorize?StageId="+Main.stageId+"&sType=2&urlLink="+encodeURI(encodeURI(SystemConst.urlLink));
            return;
        }
        let status = data["status"];
        let msg = data["msg"];
        let wxLogin = data["wxLogin"];
        // alert(JSON.stringify(wxLogin));
        WxUser.getInstance().status =status;
        WxUser.getInstance().msg = msg;
        WxUser.getInstance().openid = wxLogin.openid;
        WxUser.getInstance().wxUserId = wxLogin.id;
        WxUser.getInstance().nickname = wxLogin.nickname;
        WxUser.getInstance().sex = wxLogin.sex;
        WxUser.getInstance().headimgurl = wxLogin.headimgurl;
        WxUser.getInstance().language = wxLogin.language;
        WxUser.getInstance().country = wxLogin.country;
        WxUser.getInstance().province = wxLogin.province;
        WxUser.getInstance().city = wxLogin.city;
        // alert(JSON.stringify(WxUser.getInstance()));
        this.initGameData();
    }

    public initGameData() {
        App.MessageCenter.addListener(Msg.Event.NetDataInitComplete,this.initGame,this);//数据初始化完成后进入游戏加载
        App.MessageCenter.addListener(Msg.Event.H5ServerDataInitComplete,this.h5ServerDataInitComplete,this);
        //启动控制器
        BaseController1.getInstance().startBaseController();
    }

    /**
     * 保证关卡数据查询获取后在进行后续逻辑
     * @param data
     */
    public h5ServerDataInitComplete() {
        App.MessageCenter.removeListener(Msg.Event.H5ServerDataInitComplete,this.h5ServerDataInitComplete,this);
        this.initGameBackHandler(null);
    }


    public initGameBackHandler(data)
    {
        //适配方式(全屏适配)
        App.StageScaleMode.startFullscreenAdaptation(1080, 1920, this.onResize);
        Main.CommonThis=this;
        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        App.Init();
        this.initLifecycle();
        this.initScene();
    }
    public initGame()
    {
        App.MessageCenter.removeListener(Msg.Event.NetDataInitComplete,this.initGame,this);
        this.runGame().catch(e => {
            console.log(e);
        });
    }
    private initLifecycle(): void {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () =>{
                //每帧都会执行
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
    }
    private async runGame() {
        await RES.loadConfig("resource/default.res.json?v=" + ConfigConst.version, "resource/");
        await this.loadResource_eui();
        await RES.loadGroup("xml");

        TG_MapData.getInstance().initMapConfigData();
        this.dispatchEvent(new egret.Event("XmlLoadedEvent"));

       
        //创建需要加载的网络图片分组
        await LoadNetworkImageUtils.loadImg();

        ////////////////////////////直接进入详情界面////////////////////////////////////////
        App.SceneManager.runScene(SceneConsts.UI)
        this.initModule();
        App.ViewManager.open(ViewConst.Begin);//开启详情界面
        ////////////////////////////////////////////////////////////////////////
        window["removeLoading"]();
        await this.loadResource();
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        //console.log(userInfo);

    }
    private async loadResource_eui() {
        await this.loadTheme();
    }
    private async loadResource() {
        try {
            //预加载loading界面必要的资源
            // 先注释掉cdn加载图片 使用本地图片加载方式 （cdn图片加载慢问题解决后在启用cdn）
            // if (ConfigConst.env == 'pre') {
            //     await RES.loadConfig("resource/pre.res.json", "resource/");
            // } else if (ConfigConst.env == 'pro') {
            //     await RES.loadConfig("resource/pro.res.json", "resource/");
            // } else {
            //     await RES.loadConfig("resource/default.res.json", "resource/");
            // }
            // await RES.getResAsync("bg11_png");
            // // await RES.getResAsync("bg22_png")
            // await RES.getResAsync("bg33_png");
            // await RES.getResAsync("bg44_png");
            // await RES.getResAsync("bg55_png");

            //进入游戏加载界面
           // const loadingView = new LoadingUI1();
           // this.stage.addChild(loadingView);

           await RES.loadGroup("loading");
           await RES.loadGroup("preload", 0, BeginController.getInstance().view);
            // this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }
    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }
    private createGameScene() {
        // /*初始化游戏页面层级*/
        // Panel.getInstance().MainThis=this;
        // Panel.getInstance().initLayerLev();
        //进入游戏
        // App.SceneManager.runScene(SceneConsts.Game);
    }
    public initScene()
    {
        App.SceneManager.register(SceneConsts.UI, new UiScene());
        App.SceneManager.register(SceneConsts.Game, new GameScene());
    }
    public initModule():void
    {
        //初始化道具模块
        App.ControllerManager.register(ControllerConst.Begin,new BeginController());
        App.ControllerManager.register(ControllerConst.GameRankDetail,new RankDetailController());
    }
    public onResize():void
    {
        App.MessageCenter.dispatch(Msg.Event.GameResize);//派发全局适配函数
    }
}


