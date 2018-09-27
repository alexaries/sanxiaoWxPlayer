var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/6/20.
 */
var ImageTextShow = (function () {
    function ImageTextShow() {
    }
    ImageTextShow.prototype.drawText = function (width, height) {
        var env = ConfigConst.env;
        if (env == "pre" || env == "pro") {
            return null;
        }
        this.text = new egret.TextField();
        this.text.textColor = 0x000000;
        this.text.size = 25;
        this.text.multiline = true;
        this.text.width = width;
        this.text.verticalAlign = "middle";
        this.text.textAlign = "center";
        this.text.text = "[" + 0 + "," + 0 + "]" + "\n" + "【" + 0 + "," + 0 + "】";
        this.text.y = height / 2 - this.text.height / 2;
        return this.text;
    };
    return ImageTextShow;
}());
__reflect(ImageTextShow.prototype, "ImageTextShow");
//# sourceMappingURL=ImageTextShow.js.map