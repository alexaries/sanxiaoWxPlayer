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
var numberToBlendMode = egret.sys.numberToBlendMode;
/**
 * Created by HuDe Zheng on 2018/7/24.
 */
//道具宝箱类
var TG_PropBox = (function (_super) {
    __extends(TG_PropBox, _super);
    function TG_PropBox() {
        var _this = _super.call(this) || this;
        //当前显示索引
        _this.playIndex = 0;
        _this.stop = false;
        _this.propObj = [];
        return _this;
    }
    TG_PropBox.prototype.Create = function (layerid, row, col) {
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        this.isMove = false;
        this.life = 1;
        this.itemType = obj.itemType;
        this.SetIsCanAroundDetonate(true);
        this.canFallDown = obj.canFallDown == "0" ? false : true;
        var imageName = obj.image;
        var color = obj.color;
        this.SetColorType(color);
        this.item = TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        var porpObj = TG_MapData.getInstance().stageData["Stage"].PropChests;
        this.setPropObj(porpObj);
        if (this.propObj.length <= 0)
            return null;
        this.prop_item = new egret.Bitmap();
        this.addChildAt(this.prop_item, 0);
        this.num_Tex = Tool.getInstance().getText(40, this.life.toString());
        this.num_Tex.x = this.width / 2 - this.num_Tex.width / 2;
        this.num_Tex.y = 5;
        this.addChild(this.num_Tex);
        this.plays(); //开始播放动画
        this.randomCreat(); //生成道具
        this.prop_item.width = this.itemWidth * 0.6;
        this.prop_item.height = this.itemWidth * 0.6;
        this.prop_item.x = this.width / 2 - this.prop_item.width / 2;
        this.prop_item.y = this.height / 2 - this.prop_item.height / 2;
        this.isPropBox = true; //是宝箱
    };
    TG_PropBox.prototype.randomCreat = function () {
        var n = Math.floor(Math.random() * this.propObj.length);
        var obj = this.propObj[n];
        this.propId = obj.type;
        this.propNum = obj.num;
    };
    TG_PropBox.prototype.plays = function () {
        if (this.stop)
            return;
        var img = ConfigGameData.getInstance().PropImage;
        if (this.playIndex >= this.propObj.length) {
            this.playIndex = 0;
        }
        var obj = this.propObj[this.playIndex];
        if (!obj)
            return;
        var tween = egret.Tween.get(this.prop_item);
        tween.to({ alpha: 0 }, 1000);
        //tween.wait(1000);
        tween.call(function () {
            egret.Tween.removeTweens(this.prop_item);
            var tween1 = egret.Tween.get(this.prop_item);
            tween1.to({ alpha: 1 }, 1000);
            var texture = img[obj.type];
            this.prop_item.texture = RES.getRes(texture);
            tween1.call(function () {
                egret.Tween.removeTweens(this.prop_item);
                this.plays();
            }, this);
        }, this);
        this.playIndex++;
    };
    TG_PropBox.prototype.setPropObj = function (prop) {
        var index = this.Index; //根据index获取道具宝箱
        for (var i = 0; i < prop.length; i++) {
            var obj = prop[i];
            if (obj.Idx == index) {
                this.life = obj.HitTimes;
                var temp1 = obj.PropIds;
                var temp2 = obj.PropNums; //貌似默认都是1，暂时没啥用
                for (var j = 0; j < temp1.length; j++) {
                    var obj_temp = { type: temp1[j], num: 1 };
                    this.propObj.push(obj_temp);
                }
            }
        }
    };
    /*普通爆炸*/
    TG_PropBox.prototype.DoExplode = function () {
        this.life -= 1;
        if (this.life <= 0) {
            this.stop = true;
            //设置爆炸状态为true
            this.SetExploding(true);
            this.isDetonate = true;
            TG_Game.getInstance().DoExplode(this);
        }
        else {
            // this.BlockId-=1;
            // let imageName=TG_MapData.getInstance().mapConfigData[this.BlockId].image;
            // this.item.texture=RES.getRes(imageName+"_png")
            this.num_Tex.text = this.life.toString();
        }
    };
    return TG_PropBox;
}(TG_Item));
__reflect(TG_PropBox.prototype, "TG_PropBox");
//# sourceMappingURL=TG_PropBox.js.map