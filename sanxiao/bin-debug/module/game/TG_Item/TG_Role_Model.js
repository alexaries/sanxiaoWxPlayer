/**
 * Created by HuDe Zheng on 2018/7/5.
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
var TG_Role_Model = (function (_super) {
    __extends(TG_Role_Model, _super);
    function TG_Role_Model(_sex, roleArr, _pxy) {
        var _this = _super.call(this) || this;
        //缩放比
        _this.pxy = 1;
        //第一层 面妆 和 鞋子
        _this.layer1 = new egret.Sprite();
        //第2层 套装 和 发型
        _this.layer2 = new egret.Sprite();
        //第3层 头饰 和 套装
        _this.layer3 = new egret.Sprite();
        //第4层 丝袜  和 发型
        _this.layer4 = new egret.Sprite();
        //第五层 裤子
        _this.layer5 = new egret.Sprite();
        //第六层 上衣
        _this.layer6 = new egret.Sprite();
        //第七层 外套
        _this.layer7 = new egret.Sprite();
        //第八层 鞋子
        _this.layer8 = new egret.Sprite();
        _this.avaterObj_xy = {
            1: {
                1: [140, 155],
                2: [270, 290],
                3: [140, 0],
                4: [160, 597],
                5: [160, 597],
                6: [160, 597],
                7: [160, 800],
                8: [160, 800],
                9: [285, 1015],
                10: [0, 0]
            },
            2: {
                1: [140, 155],
                2: [268, 220],
                3: [140, 0],
                4: [160, 470],
                5: [160, 800],
                6: [265, 1015],
                7: [0, 0]
            }
        };
        //0下降 2上升
        _this.frameType = 1;
        _this.temp = 60;
        _this.pxy = _pxy;
        _this.allSp = new egret.Sprite();
        _this.addChild(_this.allSp);
        if (_sex == 1) {
            _this.bg = ObjectPool.pop("egret.Bitmap");
            _this.bg.texture = RES.getRes("nv_suti_png");
        }
        else {
            _this.bg = ObjectPool.pop("egret.Bitmap");
            _this.bg.texture = RES.getRes("nan_suti_png");
        }
        _this.bg.x = 0;
        _this.bg.y = 0;
        _this.roleSp1 = new egret.Sprite();
        _this.allSp.addChild(_this.roleSp1);
        _this.roleSp1.addChild(_this.bg);
        for (var i = 0; i < 8; i++) {
            _this.roleSp1.addChild(_this["layer" + (i + 1)]);
        }
        _this.bodyArr = [];
        _this.init(roleArr);
        _this.scaleX = _this.pxy;
        _this.scaleY = _this.pxy;
        return _this;
        // this.roleShadow = new egret.Sprite();
        // // this.roleShadow.visible = false;
        // this.roleShadow.graphics.beginFill(0,1);
        // this.roleShadow.graphics.drawEllipse(0,0,this.width1,this.width1/4);
        // this.roleShadow.graphics.endFill();
        //
        // Tool.getInstance().setAnchorPoint(this.roleShadow);
        // this.roleShadow.x = (this.width )/2 ;
        // this.roleShadow.y = (this.height ) + this.roleShadow.height/2 + 60;
        // // var gl = new GlowFilter(0,0.8,30,30);
        // // this.roleShadow.filters = [gl,gl];
        // this.allSp.addChild( this.roleShadow);
        // this.cacheAsBitmap = true;
        // this.roleShadow.alpha = 0.4;
        // this.roleShadow.scaleX = 0.4;
        // this.roleShadow.scaleY = 0.4;
        // this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    Object.defineProperty(TG_Role_Model.prototype, "height1", {
        get: function () {
            return this.height * this.pxy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TG_Role_Model.prototype, "width1", {
        get: function () {
            return this.width * this.pxy;
        },
        enumerable: true,
        configurable: true
    });
    TG_Role_Model.prototype.init = function (roleArr) {
        for (var i = 0; i < roleArr.length; i++) {
            var av_id = roleArr[i];
            if (av_id <= 0)
                continue;
            var obj = TG_MapData.getInstance().userAvaterConfigXml[av_id];
            var avaterType = obj.AvaterType; //装备类型
            var iconName = obj.IconName; //图标纹理名称
            var avaterSex = obj.AvaterSex; //性别 1女孩 2男孩
            var avaterDepth = obj.AvaterDepth; //装备层
            var iconStr = iconName + "_png";
            var bit = ObjectPool.pop("egret.Bitmap");
            bit.texture = RES.getRes(iconStr);
            this.bodyArr.push(bit);
            this["layer" + avaterDepth].addChild(bit);
            bit.x = this.avaterObj_xy[avaterSex][avaterType][0];
            bit.y = this.avaterObj_xy[avaterSex][avaterType][1];
        }
    };
    TG_Role_Model.prototype.clear = function () {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
        this.bg.texture = null;
        App.DisplayUtils.removeFromParent(this.bg);
        ObjectPool.push(this.bg);
        for (var i = 0; i < this.bodyArr.length; i++) {
            var bit = this.bodyArr[i];
            App.DisplayUtils.removeFromParent(bit);
            bit.texture = null;
            ObjectPool.push(bit);
        }
    };
    /**
     * 播放上下浮动动画
     */
    TG_Role_Model.prototype.play = function () {
        this.stop();
        App.TimerManager.doFrame(2, 0, this.runRoleFrame, this);
    };
    /**
     * 停止播放动画
     */
    TG_Role_Model.prototype.stop = function () {
        App.TimerManager.remove(this.runRoleFrame, this);
    };
    TG_Role_Model.prototype.runRoleFrame = function () {
        if (this.frameType) {
            this.temp--;
            if (this.temp <= 0)
                this.frameType = 0;
            this.roleSp1.y += 1;
            // this.roleShadow.scaleX += 0.005;
            // this.roleShadow.scaleY += 0.005;
        }
        else {
            this.temp++;
            if (this.temp >= 60)
                this.frameType = 1;
            this.roleSp1.y -= 1;
            // this.roleShadow.scaleX -= 0.005;
            // this.roleShadow.scaleY += 0.005;
        }
        // this.roleShadow.scaleY =  this.roleShadow.scaleX;
    };
    TG_Role_Model.createModel = function (avatar, roleArr, pxy) {
        if (pxy === void 0) { pxy = 0.3; }
        var role = new TG_Role_Model(avatar, roleArr, pxy);
        // let roleSp:egret.Sprite = new egret.Sprite();
        //
        //
        // roleSp.addChild(role);
        return role;
        // this.role.width = 880 * 0.2;
        // this.role.height = 1186 * 0.2;
        // this.roleSp.graphics.beginFill(0,0.6);
        // this.roleSp.graphics.drawRect(0,0,this.roleSp.width,this.roleSp.height);
        // this.roleSp.graphics.endFill();
        // this.roleSp.x = bm1_1.x + bm1_1.height;
        // this.roleSp.y = 50;
        // this.gatherSp.x = this.roleSp.x + this.roleSp.width;
    };
    return TG_Role_Model;
}(BaseClassSprite));
__reflect(TG_Role_Model.prototype, "TG_Role_Model");
//# sourceMappingURL=TG_Role_Model.js.map