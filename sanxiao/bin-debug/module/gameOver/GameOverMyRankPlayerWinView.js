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
var GameOverMyRankPlayerWinView = (function (_super) {
    __extends(GameOverMyRankPlayerWinView, _super);
    // private gameover_my_win_player_btn:eui.Button;
    function GameOverMyRankPlayerWinView() {
        var _this = _super.call(this) || this;
        _this.skinName = "gameover_RankPlayerWinUi";
        return _this;
    }
    GameOverMyRankPlayerWinView.prototype.init = function (myRankObj) {
        if (myRankObj && myRankObj.hasOwnProperty("player_id")) {
            this.gameover_my_rank_player_noRankNum1.visible = false;
            this.gameover_my_rank_player_noRankNum2.visible = false;
            // console.info(myRankObj)
            // console.info(firstWinRankObj)
            this.gameover_my_rank_player_win_hasRank.visible = true;
            this.gameover_my_rank_player_win_noHasRank.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                myRankObj.player_img = "head001_png";
            }
            // myRankObj.rankNum  =12;
            if (myRankObj.rankNum) {
                switch (myRankObj.rankNum) {
                    case 1:
                        this.gameover_my_rank_player_num_img_id.visible = true;
                        this.gameover_my_rank_player_num_id.visible = false;
                        this.gameover_my_rank_player_num_img_id.source = "ui_paihangbang_no1_1_png";
                        break;
                    case 2:
                        this.gameover_my_rank_player_num_img_id.visible = true;
                        this.gameover_my_rank_player_num_id.visible = false;
                        this.gameover_my_rank_player_num_img_id.source = "ui_paihangbang_no2_1_png";
                        break;
                    case 3:
                        this.gameover_my_rank_player_num_img_id.visible = true;
                        this.gameover_my_rank_player_num_id.visible = false;
                        this.gameover_my_rank_player_num_img_id.source = "ui_paihangbang_no3_1_png";
                        break;
                    default:
                        this.gameover_my_rank_player_num_img_id.visible = false;
                        this.gameover_my_rank_player_num_id.visible = true;
                        this.gameover_my_rank_player_num_id.text = myRankObj.rankNum;
                        break;
                }
            }
            this.gameover_my_win_player_head_img.source = myRankObj.player_img;
            this.gameover_my_win_player_nickname.text = myRankObj.player_name;
            switch (myRankObj.sort_order) {
                case 1:
                    this.gameover_my_win_player_chengji.text = "使用步数: " + myRankObj.used_step_num + "步";
                    break;
                case 2:
                    this.gameover_my_win_player_chengji.text = "使用时间: " + myRankObj.used_time + "秒";
                    break;
                case 3:
                    this.gameover_my_win_player_chengji.text = "达成分数: " + myRankObj.score_num + "分";
                    break;
                case 4:
                    this.gameover_my_win_player_chengji.text = "完成目标数: " + myRankObj.remove_block_num + "个";
                    break;
                default:
                    break;
            }
            // this.gameover_my_win_player_btn.touchEnabled = true;
            // this.gameover_my_win_player_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.detailBtnBack,this);
            this.myRankObj = myRankObj;
        }
        else {
            this.gameover_my_rank_player_num_img_id.visible = false;
            this.gameover_my_rank_player_num_id.visible = false;
            this.gameover_my_rank_player_noRankNum1.visible = true;
            this.gameover_my_rank_player_noRankNum2.visible = true;
            this.gameover_my_win_player_head_img.source = WxUser.getInstance().headimgurl;
            this.gameover_my_win_player_nickname.text = WxUser.getInstance().nickname;
            var postData = TG_Game.getInstance().getRankPostData();
            // console.info(postData)
            if (postData.stage_type == 0) {
                if (postData.condition_limit == -1) {
                    this.gameover_my_win_player_chengji.text = "达成分数: " + postData.score_num + "分";
                }
                if (postData.condition_limit == 0) {
                    this.gameover_my_win_player_chengji.text = "使用步数: " + postData.used_step_num + "步";
                }
                if (postData.condition_limit == 1) {
                    this.gameover_my_win_player_chengji.text = "使用时间: " + postData.used_time + "秒";
                }
            }
            if (postData.stage_type == 1) {
                this.gameover_my_win_player_chengji.text = "完成目标数: " + postData.remove_block_num + "个";
            }
        }
    };
    GameOverMyRankPlayerWinView.prototype.detailBtnBack = function () {
        App.ViewManager.open(ViewConst.GameRankDetail, this.myRankObj, 0);
    };
    return GameOverMyRankPlayerWinView;
}(eui.ItemRenderer));
__reflect(GameOverMyRankPlayerWinView.prototype, "GameOverMyRankPlayerWinView");
//# sourceMappingURL=GameOverMyRankPlayerWinView.js.map