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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var URLVariables = egret.URLVariables;
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        egret.ImageLoader.crossOrigin = "anonymous";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        // 配置信息初始化
        ConfigConst.init();
        /*获取url参数*/
        SystemConst.urlParameters = Tool.getInstance().getUrlParameters();
        SystemConst.urlLink = Tool.getInstance().getUrlLink();
        var urlParamArr = SystemConst.urlParameters;
        // let urlLink = SystemConst.urlLink;
        var stageId = urlParamArr["StageId"];
        if (!stageId) {
            alert("关卡id不能为空");
        }
        Main.stageId = stageId;
        var env = ConfigConst.env;
        var wxUserId = urlParamArr["wxUserId"];
        var sType = urlParamArr["sType"];
        var isWeixinBrowser = App.DeviceUtils.IsWeixinBrowser;
        if (isWeixinBrowser && (env == 'pro' || env == 'pre')) {
            // 链接中不包含wxUserId
            if (!wxUserId) {
                window.location.href = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?StageId=" + stageId + "&sType=2&urlLink=" + encodeURI(encodeURI(SystemConst.urlLink));
                return;
            }
            if (wxUserId) {
                WxUser.getInstance().wxUserId = wxUserId;
                App.MessageCenter.addListener("wx_login", this.wxloginBackHandler, this);
                App.Http.initServer(ConfigConst.wxUserInfoUrl, "1");
                App.Http.send("wx_login", new URLVariables("wxUserId=" + wxUserId));
            }
        }
        else {
            WxUser.getInstance().status = 0;
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
    };
    /**
     * 微信登录时调用该方法
     * @param data
     */
    Main.prototype.wxloginBackHandler = function (data) {
        App.MessageCenter.removeListener("wx_login", this.wxloginBackHandler, this);
        if (!data || data && data["status"] == 0) {
            window.location.href = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?StageId=" + Main.stageId + "&sType=2&urlLink=" + encodeURI(encodeURI(SystemConst.urlLink));
            return;
        }
        var status = data["status"];
        var msg = data["msg"];
        var wxLogin = data["wxLogin"];
        // alert(JSON.stringify(wxLogin));
        WxUser.getInstance().status = status;
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
    };
    Main.prototype.initGameData = function () {
        App.MessageCenter.addListener(Msg.Event.NetDataInitComplete, this.initGame, this); //数据初始化完成后进入游戏加载
        App.MessageCenter.addListener(Msg.Event.H5ServerDataInitComplete, this.h5ServerDataInitComplete, this);
        //启动控制器
        BaseController1.getInstance().startBaseController();
    };
    /**
     * 保证关卡数据查询获取后在进行后续逻辑
     * @param data
     */
    Main.prototype.h5ServerDataInitComplete = function () {
        App.MessageCenter.removeListener(Msg.Event.H5ServerDataInitComplete, this.h5ServerDataInitComplete, this);
        this.initGameBackHandler(null);
    };
    Main.prototype.initGameBackHandler = function (data) {
        //适配方式(全屏适配)
        App.StageScaleMode.startFullscreenAdaptation(1080, 1920, this.onResize);
        Main.CommonThis = this;
        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        App.Init();
        this.initLifecycle();
        this.initScene();
    };
    Main.prototype.initGame = function () {
        App.MessageCenter.removeListener(Msg.Event.NetDataInitComplete, this.initGame, this);
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.initLifecycle = function () {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
                //每帧都会执行
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RES.loadConfig("resource/default.res.json?v=" + ConfigConst.version, "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadResource_eui()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("xml")];
                    case 3:
                        _a.sent();
                        TG_MapData.getInstance().initMapConfigData();
                        this.dispatchEvent(new egret.Event("XmlLoadedEvent"));
                        //创建需要加载的网络图片分组
                        return [4 /*yield*/, LoadNetworkImageUtils.loadImg()];
                    case 4:
                        //创建需要加载的网络图片分组
                        _a.sent();
                        ////////////////////////////直接进入详情界面////////////////////////////////////////
                        App.SceneManager.runScene(SceneConsts.UI);
                        this.initModule();
                        App.ViewManager.open(ViewConst.Begin); //开启详情界面
                        ////////////////////////////////////////////////////////////////////////
                        window["removeLoading"]();
                        return [4 /*yield*/, this.loadResource()];
                    case 5:
                        _a.sent();
                        this.createGameScene();
                        // const result = await RES.getResAsync("description_json")
                        // this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 6:
                        // const result = await RES.getResAsync("description_json")
                        // this.startAnimation(result);
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 7:
                        userInfo = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource_eui = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadTheme()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
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
                        return [4 /*yield*/, RES.loadGroup("loading")];
                    case 1:
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
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, BeginController.getInstance().view)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    Main.prototype.createGameScene = function () {
        // /*初始化游戏页面层级*/
        // Panel.getInstance().MainThis=this;
        // Panel.getInstance().initLayerLev();
        //进入游戏
        // App.SceneManager.runScene(SceneConsts.Game);
    };
    Main.prototype.initScene = function () {
        App.SceneManager.register(SceneConsts.UI, new UiScene());
        App.SceneManager.register(SceneConsts.Game, new GameScene());
    };
    Main.prototype.initModule = function () {
        //初始化道具模块
        App.ControllerManager.register(ControllerConst.Begin, new BeginController());
        App.ControllerManager.register(ControllerConst.GameRankDetail, new RankDetailController());
    };
    Main.prototype.onResize = function () {
        App.MessageCenter.dispatch(Msg.Event.GameResize); //派发全局适配函数
    };
    //全局宽度
    Main.stageWidth = 1080;
    //全局高度
    Main.stageHeight = 1920;
    Main.stageId = "";
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map