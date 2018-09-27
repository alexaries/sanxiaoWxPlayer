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
/**
 * Created by HuDe Zheng on 2018/7/2.
 */
var GamePanel_BeforeStart = (function (_super) {
    __extends(GamePanel_BeforeStart, _super);
    function GamePanel_BeforeStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePanel_BeforeStart.prototype.init = function () {
        //绘制背景
        var bg1 = this.getBitmap("FondBg(20-10-20)_png");
        bg1.scale9Grid = new egret.Rectangle(15, 15, 20, 20);
        bg1.width = Main.stageWidth - 200;
        bg1.height = Main.stageHeight - 200 - 123 + 20;
        bg1.y = 123 - 20;
        this.addChild(bg1);
        var bg2 = this.getBitmap("tanchudiban_png");
        bg2.width = bg1.width - 40;
        bg2.scale9Grid = new egret.Rectangle(50, 50, 30, 30);
        bg2.height = 350;
        bg2.y = bg1.y - 30;
        bg2.x = bg1.width / 2 - bg2.width / 2;
        this.addChild(bg2);
        //绘制title
        var t1 = this.getBitmap("TipsTitleBg1(54-50-54)_png");
        var t2 = this.getBitmap("TipsTitleBg2(54-50-54)_png");
        var t3 = this.getBitmap("TipsTitleBg1(54-50-54)_png");
        t1.x = -8;
        this.addChild(t1);
        t2.x = t1.x + t1.width;
        t2.scale9Grid = new egret.Rectangle(25, 0, 10, 10);
        t2.width = bg1.width - t1.width * 2 + 16;
        this.addChild(t2);
        t3.scaleX = -1;
        t3.x = t2.x + t2.width + t3.width;
        this.addChild(t3);
        var headRect = this.getBitmap("headbg_png");
        headRect.x = bg2.x + 40;
        headRect.y = t3.y + t3.height + 40;
        this.addChild(headRect);
        var titleTex = this.getText(50, "我是测试标题");
        titleTex.x = this.width / 2 - titleTex.width / 2;
        titleTex.y = t2.y + t2.height / 2 - titleTex.height / 2;
        this.addChild(titleTex);
        var nameTex = this.getText(35, "我是作者");
        nameTex.x = headRect.x + headRect.width + 50;
        nameTex.y = headRect.y + 10;
        this.addChild(nameTex);
        var tgl = this.getText(25, "通关率：0%", 0x4178bb);
        tgl.x = bg2.x + bg2.width - tgl.width - 20;
        tgl.y = nameTex.y;
        for (var i = 0; i < 16; i++) {
            var b1 = this.getBitmap("hudiejie_xuxian_png");
            b1.x = headRect.x + headRect.width + (i * b1.width);
            b1.y = headRect.y + headRect.height;
            this.addChild(b1);
        }
        var plays = this.getBitmap("Challenge_IconPlayNum_png");
        plays.x = bg2.x + bg2.width - plays.width * 2.5;
        plays.y = headRect.y + headRect.height - plays.height - 2;
        this.addChild(plays);
        var playNumTex = this.getText(30, "x 25", 0x4178bb);
        playNumTex.x = plays.x + plays.width + 2;
        playNumTex.y = plays.y + plays.height / 2 - playNumTex.height / 2;
        this.addChild(playNumTex);
        var likes = this.getBitmap("Challenge_IconLikeN_png");
        likes.x = headRect.x + 10;
        likes.y = headRect.y + headRect.height + 40;
        this.addChild(likes);
        var likesNumTex = this.getText(30, "x 0", 0x4178bb);
        likesNumTex.x = likes.x + likes.width + 2;
        likesNumTex.y = likes.y + likes.height / 2 - likesNumTex.height / 2;
        this.addChild(likesNumTex);
        var tab1 = this.getText(50, "简介");
        tab1.y = bg2.y + bg2.height + 30;
        tab1.x = bg2.x + tab1.width / 2;
        this.addChild(tab1);
        var bg3 = this.getBitmap("TipsBg1(60-10-60)_png");
        bg3.width = bg2.width;
        bg3.scale9Grid = new egret.Rectangle(50, 50, 30, 30);
        bg3.height = bg1.height - bg2.height - 80;
        bg3.y = bg1.y + bg1.height - bg3.height - 20;
        bg3.x = bg2.x;
        this.addChild(bg3);
        var bg3_t1 = this.getBitmap("Popup_TitleBg_png");
        bg3_t1.scale9Grid = new egret.Rectangle(15, 40, 15, 10);
        bg3_t1.width = bg3.width - 20;
        bg3_t1.height = 80;
        bg3_t1.y = bg3.y + 10;
        bg3_t1.x = bg3.x + 10;
        this.addChild(bg3_t1);
        var bg3_t1_tex = this.getText(30, "关卡简介");
        bg3_t1_tex.x = bg3_t1.x + 30;
        bg3_t1_tex.y = bg3_t1.y + bg3_t1.height / 2 - bg3_t1_tex.height / 2;
        this.addChild(bg3_t1_tex);
        var bg3_t2 = this.getBitmap("Popup_TitleBg_png");
        bg3_t2.scale9Grid = new egret.Rectangle(15, 40, 15, 10);
        bg3_t2.width = bg3.width - 20;
        bg3_t2.height = 80;
        bg3_t2.y = bg3.y + 10 + 300;
        bg3_t2.x = bg3.x + 10;
        this.addChild(bg3_t2);
        var bg3_t2_tex = this.getText(30, "游戏规则");
        bg3_t2_tex.x = bg3_t2.x + 30;
        bg3_t2_tex.y = bg3_t2.y + bg3_t2.height / 2 - bg3_t2_tex.height / 2;
        this.addChild(bg3_t2_tex);
        var bg3_t3 = this.getBitmap("Popup_TitleBg_png");
        bg3_t3.scale9Grid = new egret.Rectangle(15, 40, 15, 10);
        bg3_t3.width = bg3.width - 20;
        bg3_t3.height = 80;
        bg3_t3.y = bg3_t2.y + 300;
        bg3_t3.x = bg3.x + 10;
        this.addChild(bg3_t3);
        var bg3_t3_tex = this.getText(30, "消除目标");
        bg3_t3_tex.x = bg3_t3.x + 30;
        bg3_t3_tex.y = bg3_t3.y + bg3_t3.height / 2 - bg3_t3_tex.height / 2;
        this.addChild(bg3_t3_tex);
        var bg3_t4 = this.getBitmap("Popup_TitleBg_png");
        bg3_t4.scale9Grid = new egret.Rectangle(15, 40, 15, 10);
        bg3_t4.width = bg3.width - 20;
        bg3_t4.height = 80;
        bg3_t4.y = bg3_t3.y + 300;
        bg3_t4.x = bg3.x + 10;
        this.addChild(bg3_t4);
        var bg3_t4_tex = this.getText(30, "可用道具");
        bg3_t4_tex.x = bg3_t4.x + 30;
        bg3_t4_tex.y = bg3_t4.y + bg3_t4.height / 2 - bg3_t4_tex.height / 2;
        this.addChild(bg3_t4_tex);
        var beginBtn = this.getButton();
        beginBtn.x = bg2.x + bg2.width - beginBtn.width - 10;
        beginBtn.y = bg2.y + bg2.height - beginBtn.height - 10;
        this.addChild(beginBtn);
        //居中对其
        this.x = Main.stageWidth / 2 - this.width;
        this.y = Main.stageHeight / 2 - this.height / 2;
    };
    GamePanel_BeforeStart.prototype.getButton = function () {
        var sp = new egret.Sprite();
        var bg = this.getBitmap("CommonBtn_SmallGreen_png");
        bg.width = 160;
        bg.height = 80;
        sp.addChild(bg);
        var tex = this.getText(30, "开始", 0x22a440, false);
        tex.x = bg.width / 2 - tex.width / 2;
        tex.y = bg.height / 2 - tex.height / 2 - 6;
        sp.addChild(tex);
        return sp;
    };
    GamePanel_BeforeStart.prototype.getBitmap = function (texName) {
        var bit = new egret.Bitmap(RES.getRes(texName));
        return bit;
    };
    GamePanel_BeforeStart.prototype.getText = function (size, text, color, bold) {
        if (color === void 0) { color = 0xffffff; }
        if (bold === void 0) { bold = true; }
        var num_tex = new egret.TextField();
        num_tex.textAlign = "center";
        num_tex.size = size;
        num_tex.bold = true;
        num_tex.textColor = color;
        // num_tex.width = 100;
        num_tex.strokeColor = 0x000000;
        num_tex.stroke = 2;
        num_tex.text = text;
        num_tex.height = num_tex.textHeight;
        num_tex.width = num_tex.textWidth;
        return num_tex;
    };
    return GamePanel_BeforeStart;
}(BaseClassSprite));
__reflect(GamePanel_BeforeStart.prototype, "GamePanel_BeforeStart");
//# sourceMappingURL=GamePanel_BeforeStart.js.map