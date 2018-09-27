var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/6/1.
 */
var Tool = (function () {
    function Tool() {
    }
    Tool.getInstance = function () {
        if (!this.tool) {
            this.tool = new Tool();
        }
        return this.tool;
    };
    /*获取url拼接参数*/
    Tool.prototype.getUrlParameters = function () {
        var aQuery = window.location.href.split("?"); //取得Get参数
        var aGET = new Array();
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("=");
                aGET[aTmp[0]] = aTmp[1];
            }
        }
        return aGET;
    };
    /**
     * 获取urlLink地址
     */
    Tool.prototype.getUrlLink = function () {
        var aQuery = window.location.href.split("?"); //取得Get参数
        var urlLink = aQuery[0];
        return urlLink;
    };
    /*设置锚点*/
    Tool.prototype.setAnchorPoint = function (sp, pointX, pointY) {
        if (pointX === void 0) { pointX = .5; }
        if (pointY === void 0) { pointY = .5; }
        sp.anchorOffsetX = sp.width * pointX;
        sp.anchorOffsetY = sp.height * pointY;
    };
    /**
     *  获取一个TextField
     * @param size 字体大小
     * @param text 文本
     * @param color 文本颜色
     * @param bold 是否加粗
     * @param isgl 是否描边
     * @param strokeColor 描边颜色
     * @returns {egret.TextField}
     */
    Tool.prototype.getText = function (size, text, color, bold, isgl, strokeColor) {
        if (color === void 0) { color = 0xffffff; }
        if (bold === void 0) { bold = true; }
        if (isgl === void 0) { isgl = true; }
        if (strokeColor === void 0) { strokeColor = 0x000000; }
        var num_tex = new egret.TextField();
        num_tex.textAlign = "center";
        num_tex.size = size;
        num_tex.bold = true;
        num_tex.textColor = color;
        // num_tex.width = 100;
        if (isgl) {
            num_tex.strokeColor = strokeColor;
            num_tex.stroke = 2;
        }
        num_tex.text = text;
        num_tex.height = num_tex.textHeight;
        num_tex.width = num_tex.textWidth;
        return num_tex;
    };
    //获取时分 格式化
    Tool.prototype.getTimeForTime = function (time) {
        var text_str = "";
        var s = time % 60;
        var m = Math.floor(time / 60);
        if (m < 10)
            text_str += "0" + m;
        else
            text_str += m;
        text_str += ":";
        if (s < 10)
            text_str += "0" + s;
        else
            text_str += s;
        return text_str;
    };
    /**
     * 是否是json类型字符串
     * @param str
     */
    Tool.prototype.isJSON = function (str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.log('error：' + str + '!!!' + e);
                return false;
            }
        }
        console.log('It is not a string!');
        return false;
    };
    Tool.showMaxScreen = function (useDragTip) {
        var _this = this;
        if (useDragTip === void 0) { useDragTip = true; }
        if (!document || !egret.Capabilities.isMobile) {
            return;
        }
        if (this.div) {
            this.div.style.display = "block";
            document.body.scrollTop = 0;
            return;
        }
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.style.height = this.divHeight + "px";
        div.style.width = '100%';
        div.style.backgroundColor = '#000000';
        div.style.zIndex = useDragTip ? "99" : "-1";
        div.style.position = "absolute";
        div.style.opacity = '0.8';
        div.style.color = '#999999';
        div.style.fontSize = '50px';
        div.style.textAlign = "center";
        div.innerText = "请滑动到底部";
        div.style.lineHeight = document.body.clientHeight + "px";
        this.div = div;
        setInterval(function () {
            if (document.body.scrollTop >= _this.divHeight / 2 - 50 && div.style.display != "none") {
                _this.div.style.display = "none";
                setTimeout(function () {
                    window.dispatchEvent(new Event("resize"));
                }, 500);
            }
        }, 100);
    };
    Object.defineProperty(Tool, "divHeight", {
        get: function () {
            return document.body.clientHeight * window.devicePixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    return Tool;
}());
__reflect(Tool.prototype, "Tool");
//# sourceMappingURL=Tool.js.map