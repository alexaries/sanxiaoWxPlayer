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
var ExitView = (function (_super) {
    __extends(ExitView, _super);
    function ExitView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.skinName = "exitUI";
        return _this;
    }
    /**
     * 开启界面
     */
    ExitView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this.refreshIconState();
    };
    ExitView.prototype.refreshIconState = function () {
        var bgOn = App.SoundManager.getBgOn();
        var effectOn = App.SoundManager.getEffectOn();
        if (bgOn) {
            this.musicIcon1.source = "ui_battle_pause_button_music_png";
        }
        else {
            this.musicIcon1.source = "ui_battle_pause_button_music_off_png";
        }
        if (effectOn) {
            this.musicIcon2.source = "ui_battle_pause_button_volume_png";
        }
        else {
            this.musicIcon2.source = "ui_battle_pause_button_volume_off_png";
        }
    };
    return ExitView;
}(BaseEuiView));
__reflect(ExitView.prototype, "ExitView");
//# sourceMappingURL=ExitView.js.map