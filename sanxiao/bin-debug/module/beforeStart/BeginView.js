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
var Group = eui.Group;
/**
 * Created by HuDe Zheng on 2018/7/30.
 */
var BeginView = (function (_super) {
    __extends(BeginView, _super);
    function BeginView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.skinName = "beginUI";
        _this.init();
        return _this;
    }
    BeginView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        Log.getInstance().trace("开启开始界面窗口");
        this.x = 0;
        this.y = 0;
        //播放背景音乐
        App.SoundManager.playBg("bgSound");
    };
    BeginView.prototype.callback = function () {
    };
    // 设置当前页面信息
    BeginView.prototype.init = function () {
        this.LodingBack.visible = true;
        if (TG_Stage.TextureUrl.length > 0) {
            this.textureImg.source = "networkImage_" + TG_Stage.TextureUrl + "_png";
        }
        if (TG_Stage.Author["Avatar"].length > 0) {
            try {
                if (Number(TG_Stage.Author["Avatar"]) <= 13) {
                    // RES.getResAsync("userDefault_" + TG_Stage.Author["Avatar"]+ "_png");
                    this.headImg.source = "userDefault_" + TG_Stage.Author["Avatar"] + "_png";
                    // console.info(this.headImg.source);
                }
                else {
                    this.headImg.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
                }
            }
            catch (e) {
                this.headImg.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
            }
        }
        // console.info(this.headImg.source);
        this.headImg.mask = this.head_mask;
        if (TG_Stage.Name && TG_Stage.Name.length > 0) {
            this.nameTex.text = TG_Stage.Name;
        }
        else {
            this.nameTex.text = "神秘关卡";
        }
        if (TG_Stage.Author["Name"] && TG_Stage.Author["Name"].length > 0) {
            this.authorTex.text = TG_Stage.Author["Name"];
        }
        else {
            this.authorTex.text = "无名小卒";
        }
        //设置玩家录音
        if (TG_Stage.VoiceTime) {
            this.UserVoice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.UserVoiceOpen, this);
            if (TG_Stage.VoiceTime) {
                this.UserVoiceText.text = TG_Stage.VoiceTime + "''";
            }
            else {
                this.UserVoiceText.text = "0" + "''";
            }
        }
        //设置玩家游戏次数
        if (TG_Stage) {
            this.UserGmaeLabel.text = "00";
        }
        //设置玩家喜欢次数(点击心的次数)
        if (TG_Stage) {
            this.UserLikeLabel.text = "00";
        }
        //设置通过率
        if (TG_Stage) {
            this.CheckpoinAdoptRateText.text = "通过率" + "00";
        }
        //设置通过图片
        if (TG_Stage) {
            this.IsWin.source = "";
        }
    };
    BeginView.prototype.UserVoiceOpen = function () {
        App.SoundManager.playBg(TG_Stage.VoiceUrl + "");
    };
    /** 进度信息 */
    BeginView.prototype.onProgress = function (current, total) {
        App.MessageCenter.dispatch("jiazaijindu", current, total);
    };
    return BeginView;
}(BaseEuiView));
__reflect(BeginView.prototype, "BeginView", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=BeginView.js.map