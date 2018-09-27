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
 * Created by HuDe Zheng on 2018/7/30.
 */
var GameOverRankPlayerFirstWinView = (function (_super) {
    __extends(GameOverRankPlayerFirstWinView, _super);
    function GameOverRankPlayerFirstWinView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.skinName = "gameover_RankPlayerFirstWinUi";
        return _this;
        // this.first_win_player_head_img.width = this.first_win_player_head_img.height = 42;
    }
    GameOverRankPlayerFirstWinView.prototype.init = function (firstWinRankObj) {
        console.info(firstWinRankObj);
        if (firstWinRankObj && firstWinRankObj.hasOwnProperty("player_id")) {
            // console.info(firstWinRankObj)
            this.gameover_first_rank_player_win_group.visible = true;
            this.gameover_first_rank_player_nobody.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                firstWinRankObj.player_img = "head001_png";
            }
            this.gameover_first_win_player_head_img.source = firstWinRankObj.player_img;
            this.gameover_first_win_player_nickname.text = firstWinRankObj.player_name;
            this.gameover_first_win_player_create_time.text = DateUtils.format(new Date(firstWinRankObj.created_date), "yyyy/MM/dd HH:mm:ss");
            // this.gameover_first_win_player_detail_btn.touchEnabled = true;
            // this.gameover_first_win_player_detail_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.detailBtnBack,this);
            this.firstWinRankObj = firstWinRankObj;
        }
        else {
            // 还没有最先通过玩家
            this.gameover_first_rank_player_win_group.visible = false;
            this.gameover_first_rank_player_nobody.visible = true;
        }
    };
    GameOverRankPlayerFirstWinView.prototype.detailBtnBack = function () {
        App.ViewManager.open(ViewConst.GameRankDetail, this.firstWinRankObj);
        // if (this.firstWinRankObj && this.firstWinRankObj._id) {
        //     console.info(this.firstWinRankObj);
        // } else {
        //     console.info("没有详情信息");
        // }
    };
    return GameOverRankPlayerFirstWinView;
}(BaseEuiView));
__reflect(GameOverRankPlayerFirstWinView.prototype, "GameOverRankPlayerFirstWinView");
//# sourceMappingURL=GameOverRankPlayerFirstWinView.js.map