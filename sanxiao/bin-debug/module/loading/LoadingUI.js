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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.mywidth = 0;
        // this.createView();
        _this.createPic();
        _this.createMove();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        // this.textField.text = `Loading...${current}/${total}`;
        var wid1 = current / total;
        this.loadingBar.width = (this.loadingBarBg.width) * wid1;
        this.numField.text = Math.floor(wid1 * 100) + "%";
        if (Math.floor(wid1) * 100 >= 100) {
            // this.initStartBtn();
            if (ConfigConst.open_wxLogin)
                this.init_userInfo();
            else
                this.initStartBtn();
        }
    };
    LoadingUI.prototype.createPic = function () {
        //背景
        this.loadingBg = new egret.Bitmap(RES.getRes("bg11_png"));
        this.addChild(this.loadingBg);
        this.loadingBg.width = Main.stageWidth;
        this.loadingBg.height = Main.stageHeight;
        //logo
        // this.loadingLogo=new egret.Bitmap(RES.getRes("bg22_png"));
        // this.addChild(this.loadingLogo);
        // Tool.getInstance().setAnchorPoint(this.loadingLogo);
        // this.loadingLogo.x=Main.stageWidth/2;
        // this.loadingLogo.y=Main.stageHeight*.21;
    };
    LoadingUI.prototype.createMove = function () {
        this.loadingBarBg = new egret.Bitmap(RES.getRes("bg33_png"));
        this.addChild(this.loadingBarBg);
        this.loadingBarBg.scale9Grid = new egret.Rectangle(24, 17, 5, 5);
        this.loadingBarBg.width = Main.stageWidth * .6;
        Tool.getInstance().setAnchorPoint(this.loadingBarBg);
        this.loadingBarBg.x = Main.stageWidth / 2;
        this.loadingBarBg.y = Main.stageHeight * .9;
        this.mywidth = this.loadingBarBg.width;
        this.loadingBar = new egret.Bitmap(RES.getRes("bg44_png"));
        this.addChild(this.loadingBar);
        this.loadingBar.scale9Grid = new egret.Rectangle(24, 17, 5, 5);
        this.loadingBar.height = 20;
        this.loadingBar.anchorOffsetY = this.loadingBar.height / 2;
        this.loadingBar.x = this.loadingBarBg.x - this.loadingBarBg.width / 2;
        this.loadingBar.y = this.loadingBarBg.y;
        this.numField = new egret.TextField();
        this.addChild(this.numField);
        this.numField.textColor = 0x7446A9;
        this.numField.width = Main.stageWidth * .1;
        this.numField.height = 100;
        this.numField.textAlign = "center";
        this.numField.x = this.loadingBarBg.x + this.loadingBarBg.width * .53;
        this.numField.y = this.loadingBarBg.y - this.loadingBarBg.height / 2;
    };
    //微信登录
    LoadingUI.prototype.init_userInfo = function () {
        var code = SystemConst.urlParameters["code"];
        if (code == null && ConfigConst.open_wxLogin) {
            //没有code，调用授权页面
            var appid = "wx6ed869909f329685";
            var game_url = location.href;
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + game_url + "&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
            return;
        }
        App.EasyLoading.showLoading();
        var hash = new egret.URLVariables("code=" + code);
        App.MessageCenter.addListener(Msg.NetEvent.Get_UserInfo, this.get_userInfo, this);
        App.Http.send(Msg.NetEvent.Get_UserInfo, hash);
    };
    //得到用户信息
    LoadingUI.prototype.get_userInfo = function (data) {
        App.EasyLoading.hideLoading();
        //初始化用户信息
        PbPlayer.getInstance().Init_Wx_UserInfo = data;
        this.initStartBtn();
    };
    LoadingUI.prototype.initStartBtn = function () {
        this.startBtn = new Button("bg55_png");
        this.addChild(this.startBtn);
        this.startBtn.x = Main.stageWidth / 2;
        this.startBtn.y = Main.stageHeight * .7;
        this.startBtn.alpha = 0;
        egret.Tween.get(this.startBtn).to({ alpha: 1 }, 500).call(function () {
            egret.Tween.removeTweens(this.startBtn);
        }.bind(this));
        this.startBtn.addTouchEvent();
        this.startBtn.addEventListener("click", this.startBtnEvent, this);
    };
    LoadingUI.prototype.startBtnEvent = function () {
        var stageData = TG_MapData.getInstance().stageData;
        Log.getInstance().trace(stageData, 0);
        if (!stageData) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        var stage = stageData.Stage;
        Log.getInstance().trace(stage, 0);
        if (!stage) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        var blocks = stage.Blocks;
        Log.getInstance().trace(blocks, 0);
        if (!blocks) {
            this.addChild(Panel_PopupLayer.getInstance());
            Panel_PopupLayer.getInstance().myAlert("地图数据有误,分享参数不正确!", 2000);
            return;
        }
        if (stageData && stage && blocks) {
            this.removeself();
            BaseController1.getInstance().gameStartEvent();
        }
    };
    return LoadingUI;
}(BaseClassSprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingUI.js.map