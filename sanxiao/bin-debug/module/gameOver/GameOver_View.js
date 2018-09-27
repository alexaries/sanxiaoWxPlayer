/**
 * Created by HuDe Zheng on 2018/6/29.
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
var GameOver_View = (function (_super) {
    __extends(GameOver_View, _super);
    function GameOver_View() {
        var _this = _super.call(this) || this;
        App.ControllerManager.register(ControllerConst.GameOverRank, new GameOverController());
        return _this;
    }
    GameOver_View.prototype.init = function (_type) {
        var postData = TG_Game.getInstance().getRankPostData();
        postData.type = _type;
        this.postData = postData;
        // 查询数据
        // 查询排行榜成绩
        App.MessageCenter.addListener("gameover_findRankInfo", this.gameoverFindRankViewInfoBack, this);
        var stageId = TG_Stage.StageId;
        var playerId = WxUser.getInstance().wxUserId;
        var findStageRank = ConfigConst.findStageRank;
        var preUrl = findStageRank.substring(0, findStageRank.indexOf("${STAGEID}"));
        findStageRank = preUrl + stageId + "/playerId/" + playerId;
        App.Http.initServer(findStageRank, "1");
        App.Http.send("gameover_findRankInfo", new URLVariables("page=1&size=5"));
        // //关闭道具面板
        // this.touchEnabled = true;
        // App.ViewManager.close(ViewConst.Prop);
        // App.ViewManager.close(ViewConst.Title);
        //
        // this.type = _type;
        // let btm:egret.Bitmap;
        // if(this.type == 0){
        //     btm = TG_Object.Create("failure_png");
        //     this.addChild(btm);
        // }else{
        //     btm = TG_Object.Create("success_png");
        //     this.addChild(btm);
        // }
        // btm.width = Main.stageWidth;
        // btm.height = Main.stageHeight;
        //
        // this.taskItemArr = [];
        //
        // //0:消除 1:收集
        // let ruleType =TG_Stage.RuleType;
        // this.gatherSp = new egret.Sprite();
        // this.addChild(this.gatherSp);
        //
        // if(ruleType == 1){
        //     //收集模式
        //     let ATaskTargets=TG_Game.getInstance().ATaskTargets;
        //     if(ATaskTargets) {
        //         this.addTesk(ATaskTargets, 0);
        //     }
        // }
        // this.gatherSp.x = Main.stageWidth/2 - this.gatherSp.width/2;
        //
        // this.sure_button = TG_Object.Create("sure_button_png");
        // this.sure_button.x = Main.stageWidth/2 - this.sure_button.width/2;
        // this.sure_button.y = Main.stageHeight - this.sure_button.height * 2;
        // this.addChild(this.sure_button);
        // this.sure_button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.sure_click,this);
        // this.sure_button.touchEnabled = true;
        //
        // this.gatherSp.y =  this.sure_button.y -this.gatherSp.height - 200;
    };
    GameOver_View.prototype.gameoverFindRankViewInfoBack = function (data) {
        this.postData.respData = data;
        var postDataStr = JSON.stringify(this.postData);
        App.ViewManager.open(ViewConst.GameOverRank, postDataStr);
    };
    return GameOver_View;
}(BaseClassSprite));
__reflect(GameOver_View.prototype, "GameOver_View");
//# sourceMappingURL=GameOver_View.js.map