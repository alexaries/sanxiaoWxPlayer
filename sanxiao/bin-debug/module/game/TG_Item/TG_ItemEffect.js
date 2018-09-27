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
 * Created by ZhangHui on 2018/6/12.
 * 普通块&&特效块 ---wg 2018-09-03
 */
var TG_ItemEffect = (function (_super) {
    __extends(TG_ItemEffect, _super);
    /*普通元素块*/
    function TG_ItemEffect() {
        var _this = _super.call(this) || this;
        _this.IsEffectAlreadyExplode = false;
        _this.SecondBoomSuper = false;
        _this.sp1 = new egret.Sprite();
        _this.sp2 = new egret.Sprite();
        _this.addChild(_this.sp1);
        _this.addChild(_this.sp2);
        return _this;
    }
    TG_ItemEffect.prototype.Create = function (id2, id7, row, col, EffectType) {
        if (EffectType === void 0) { EffectType = Msg.EffectType.ET_none; }
        //寻找随机快处理
        // id2 = LoadNetworkImageUtils.getRandom_LayerId(id2);
        id2 = LoadNetworkImageUtils.getRandom_LayerId(id2);
        this.SetEffectType(EffectType);
        var layeridStr = id2.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var color = obj.color;
        this.SetColorType(color);
        this.itemType = obj.itemType;
        this.IsBirdPriorityTarget = false;
        this.IsBlackTarget = true;
        // 设置毛球附着物
        if (id7 > 0) {
            this.isMove = false;
            this.SetVenonatId(id7);
            var obj_1 = TG_CreateItem.CreateHairBall(id7, row, col);
            this.sp2.addChild(obj_1);
            var num = Number(id7 % 10);
            if (num == 0) {
                this.CanAroundDetonate = false;
            }
            if (num == 1) {
                this.CanAroundDetonate = true;
            }
            if (num == 2) {
                this.CanAroundDetonate = false;
            }
        }
        else {
            // 没有毛球
            this.SetVenonatId(0);
        }
        switch (EffectType) {
            case Msg.EffectType.ET_none:
                this.CreateItem(id2, row, col);
                break;
            case Msg.EffectType.ET_Hor:
                //纵向四连形成的横消块
                this.createItemET_Hor(id2, row, col);
                break;
            case Msg.EffectType.ET_Vel:
                //横向四连形成的纵消块
                this.createItemET_Ver(id2, row, col);
                break;
            // case Msg.EffectType.ET_ChangeColor:
            //     //变色块
            //     this.createItemET_ChangeColor(id2,row,col);
            //     break;
            case Msg.EffectType.ET_Black:
                //黑洞
                this.CreateET_Black(id2, row, col);
                break;
            case Msg.EffectType.ET_Gold:
                //炸弹
                this.CreateET_Gold(id2, row, col);
                break;
            case Msg.EffectType.ET_Bird:
                //风车
                this.CreateET_Bird(id2, row, col);
                break;
            default:
                break;
        }
        this.text = new ImageTextShow().drawText(this.item.width, this.item.height);
        if (this.text) {
            this.sp1.addChild(this.text);
        }
        return this.item;
    };
    //创建普通的元素块
    TG_ItemEffect.prototype.createItem = function (str, layerid, row, col) {
        this.item = TG_Object.Create(str);
        this.sp1.addChild(this.item);
        this.SetSitPos(col, row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.createText();
        this.initItemW_H(); //初始化宽高
    };
    TG_ItemEffect.prototype.createText = function () {
        if (this.isFunction) {
            this.text1 = new egret.TextField();
            this.text1.textAlign = "center";
            this.text1.size = 45;
            var colorNum = this.extendType == 1 ? 0xffb24a : 0x46A3FF;
            this.text1.textColor = colorNum;
            this.text1.bold = true;
            this.text1.strokeColor = 0x000000;
            this.text1.stroke = 2;
            this.text1.text = "+" + this.extendParam;
            this.text1.height = this.text1.textHeight;
            this.text1.width = this.text1.textWidth;
            this.text1.x = this.item.x + this.item.width - this.text1.width - 5;
            this.text1.y = this.item.y + this.item.height - this.text1.height - 5;
            this.sp1.addChild(this.text1);
        }
    };
    TG_ItemEffect.prototype.createArrows = function (type) {
        var str = "";
        if (type == 0) {
            //横向的箭头
            str = "item_h_tip_png";
        }
        else {
            //纵向的箭头
            str = "item_v_tip_png";
        }
        this.arrows = TG_Object.Create(str);
        this.sp1.addChild(this.arrows);
        this.arrows.width = this.item.width;
        this.arrows.height = this.item.height;
        Tool.getInstance().setAnchorPoint(this.arrows);
        this.arrows.x = this.item.width / 2;
        this.arrows.y = this.item.height / 2;
        egret.Tween.get(this.arrows, { loop: true }).to({ scaleX: 1.1, scaleY: 1.1 }, 400).to({ scaleX: 1, scaleY: 1 }, 200);
    };
    TG_ItemEffect.prototype.CreateItem = function (layerid, row, col) {
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid); // LoadNetworkImageUtils.getResNameByLayerId(layerid);
        // let extendType:number = parseInt(obj.extendType);
        if (obj.extendType > 0) {
            //带加步数的功能块
            this.isFunction = true;
            this.extendType = obj.extendType;
            this.extendParam = obj.extendParam;
            this.createItem(str, layerid, row, col);
        }
        else {
            this.createItem(str, layerid, row, col);
        }
    };
    //横向四连的元素块
    TG_ItemEffect.prototype.createItemET_Hor = function (layerid, row, col) {
        //普通块
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
        //箭头
        this.createArrows(0);
    };
    //纵向四连的元素块
    TG_ItemEffect.prototype.createItemET_Ver = function (layerid, row, col) {
        //普通块
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
        //箭头
        this.createArrows(1);
    };
    //创建变色块元素块
    TG_ItemEffect.prototype.createItemET_ChangeColor = function (layerid, row, col) {
        //普通块
        var layeridStr = layerid.toString();
        // let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
    };
    //黑洞的元素块
    TG_ItemEffect.prototype.CreateET_Black = function (layerid, row, col) {
        //普通块
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
    };
    //炸弹的元素块
    TG_ItemEffect.prototype.CreateET_Gold = function (layerid, row, col) {
        //普通块
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
    };
    //风车的元素块
    TG_ItemEffect.prototype.CreateET_Bird = function (layerid, row, col) {
        var layeridStr = layerid.toString();
        var obj = TG_MapData.getInstance().mapConfigData[layeridStr];
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.createItem(str, layerid, row, col);
    };
    TG_ItemEffect.prototype.SetAlreadyExplode = function (flag) {
        this.IsEffectAlreadyExplode = flag;
    };
    TG_ItemEffect.prototype.GetAlreadyExplode = function () {
        return this.IsEffectAlreadyExplode;
    };
    TG_ItemEffect.prototype.SetSecondBoomSuper = function (flag) {
        this.SecondBoomSuper = flag;
    };
    TG_ItemEffect.prototype.GetSecondBoomSuper = function () {
        return this.SecondBoomSuper;
    };
    TG_ItemEffect.prototype.SetIsBullet = function (flag) {
        this.IsBullet = flag;
    };
    TG_ItemEffect.prototype.GetIsBullet = function () {
        return this.IsBullet;
    };
    TG_ItemEffect.prototype.SetBulletPos = function (pos) {
        this.BulletPos = pos;
    };
    TG_ItemEffect.prototype.GetBulletPos = function () {
        return this.BulletPos;
    };
    /*普通爆炸*/
    TG_ItemEffect.prototype.DoExplode = function (isDetonate, IsInfectVenom) {
        //isDetonate 是否被引爆
        //IsInfectVenom 是否是被毒液感染爆炸
        if (isDetonate === void 0) { isDetonate = false; }
        if (IsInfectVenom === void 0) { IsInfectVenom = false; }
        //普通块消除
        // TG_Game.getInstance().DoInfect(this);
        if (this.GetVenonatId() <= 0) {
            this.SetIsInfectVenom(IsInfectVenom);
            //设置爆炸状态为true
            this.SetExploding(true);
            if (isDetonate) {
                if (!this.IsEffectGold()) {
                    this.isDetonate = true;
                }
            }
            TG_Game.getInstance().DoExplode(this);
        }
        else {
            //处理毛球逻辑
            if (this.GetVenonatId() == 7001) {
                this.SetVenonatId(0);
                this.isMove = true;
                var hair = this.sp2.getChildAt(0);
                // 游戏中，飞到消除目标位置的动画
                TG_Game.getInstance().ItemFlyToGoal(hair);
                //加分数
                TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeHairBall);
                if (hair) {
                    hair.Release();
                }
                this.CanAroundDetonate = false;
                this.sp2.removeChildren();
            }
            else {
                this.SetDetonate2(true);
            }
        }
    };
    /**
     * 黑色毛球爆破
     * @constructor
     */
    TG_ItemEffect.prototype.DoExplodeHairBall = function () {
        this.SetVenonatId(this.GetVenonatId() - 1);
        var hair = this.sp2.getChildAt(0);
        // 游戏中，飞到消除目标位置的动画
        TG_Game.getInstance().ItemFlyToGoal(hair);
        //加分数
        TG_Game.getInstance().AddScore(ScoreType.ST_ExplodeHairBall);
        if (hair) {
            hair.Release();
        }
        this.CanAroundDetonate = true;
        this.sp2.removeChildren();
        var newVenatId = this.GetVenonatId();
        var obj = TG_CreateItem.CreateHairBall(newVenatId, this.SitePos.Y, this.SitePos.X);
        this.sp2.addChild(obj);
        App.MessageCenter.dispatch(Msg.Event.CreateHairBall, this.SitePos);
    };
    TG_ItemEffect.prototype.changeColor = function (layerid) {
        var str = LoadNetworkImageUtils.getResNameByLayerId(layerid);
        this.item.texture = RES.getRes(str);
        this.SetBlockId(layerid);
        var obj = TG_MapData.getInstance().mapConfigData[layerid];
        var color = obj.color;
        this.SetColorType(color);
    };
    /**
     * 取出毛球
     */
    TG_ItemEffect.prototype.getHairBall = function () {
        var hair = null;
        if (this.sp2.numChildren > 0)
            hair = this.sp2.getChildAt(0);
        return hair;
    };
    /**
     *  添加毛球
     * @param hair
     */
    TG_ItemEffect.prototype.addHairBall = function (hair) {
        if (hair)
            this.sp2.addChild(hair);
    };
    TG_ItemEffect.prototype.CreateHair = function () {
        this.isMove = false;
        this.SetVenonatId(7001);
        this.CanAroundDetonate = true;
        this.sp2.removeChildren();
        var newVenatId = this.GetVenonatId();
        var obj = TG_CreateItem.CreateHairBall(newVenatId, this.SitePos.Y, this.SitePos.X);
        this.sp2.addChild(obj);
        obj.scaleX = obj.scaleY = .1;
        egret.Tween.get(obj).to({ scaleX: 1.2, scaleY: 1.2 }, 500).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
            if (obj) {
                egret.Tween.removeTweens(obj);
            }
        }.bind(this), this);
    };
    /*移除对象*/
    TG_ItemEffect.prototype.Release = function () {
        this.SecondBoomSuper = false;
        this.IsEffectAlreadyExplode = false;
        if (this.item) {
            TG_Object.Release(this.item);
            this.item = null;
        }
        if (this.arrows) {
            egret.Tween.removeTweens(this.arrows);
            TG_Object.Release(this.arrows);
            this.arrows = null;
        }
    };
    /*改变文字*/
    TG_ItemEffect.prototype.changeText = function (row, col, rowMarkNum, colMarkNum) {
        if (rowMarkNum === void 0) { rowMarkNum = 0; }
        if (colMarkNum === void 0) { colMarkNum = 0; }
        if (this.text) {
            this.text.text = "[" + col + "," + row + "]" + "\n" + "【" + colMarkNum + "," + rowMarkNum + "】";
        }
    };
    return TG_ItemEffect;
}(TG_Item));
__reflect(TG_ItemEffect.prototype, "TG_ItemEffect");
//# sourceMappingURL=TG_ItemEffect.js.map