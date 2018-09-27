/**
 * Created by HuDe Zheng on 2018/7/31.
 */
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
var DetailItem_itemView = (function (_super) {
    __extends(DetailItem_itemView, _super);
    function DetailItem_itemView() {
        var _this = _super.call(this) || this;
        _this.url = "";
        _this.num = 0;
        _this.skinName = "detailItem_item";
        return _this;
    }
    DetailItem_itemView.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.itemData = this.data;
        if (this.itemData) {
            this.num = parseInt(this.itemData.num);
            this.url = this.itemData.url;
            this.img_rect1.source = this.url;
            if (this.num > 0) {
                this.des_txt1.text = "x" + this.num;
            }
            else {
                this.des_txt1.text = "";
            }
        }
    };
    return DetailItem_itemView;
}(eui.ItemRenderer));
__reflect(DetailItem_itemView.prototype, "DetailItem_itemView");
//# sourceMappingURL=DetailItem_itemView.js.map