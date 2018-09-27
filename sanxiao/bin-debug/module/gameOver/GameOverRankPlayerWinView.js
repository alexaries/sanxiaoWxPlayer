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
var GameOverRankPlayerWinView = (function (_super) {
    __extends(GameOverRankPlayerWinView, _super);
    // private gameover_win_player_btn:eui.Button;
    function GameOverRankPlayerWinView() {
        var _this = _super.call(this) || this;
        _this.skinName = "gameover_RankPlayerWinUi";
        return _this;
    }
    GameOverRankPlayerWinView.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.itemData = this.data;
        if (this.itemData) {
            // console.info(this.itemData);
            // console.info(this.itemIndex +1);
            this.itemData.rankNum = this.itemIndex + 1;
            this.gameover_rank_player_win_hasRank.visible = true;
            this.gameover_rank_player_win_noHasRank.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                this.itemData.playerImg = "head001_png";
            }
            if ((this.itemIndex + 1) % 2 == 0) {
                this.gameover_rank_player_rect1.fillColor = MergeColorUtils.mergeColor(135, 173, 220);
                this.gameover_rank_player_rect2.fillColor = MergeColorUtils.mergeColor(173, 199, 216);
            }
            else {
                this.gameover_rank_player_rect1.fillColor = MergeColorUtils.mergeColor(165, 191, 212);
                this.gameover_rank_player_rect2.fillColor = MergeColorUtils.mergeColor(187, 205, 219);
            }
            if (this.itemIndex) {
                switch (this.itemIndex + 1) {
                    case 1:
                        this.gameover_rank_player_num_img_id.visible = true;
                        this.gameover_rank_player_num_id.visible = false;
                        this.gameover_rank_player_num_img_id.source = "ui_paihangbang_no1_1_png";
                        break;
                    case 2:
                        this.gameover_rank_player_num_img_id.visible = true;
                        this.gameover_rank_player_num_id.visible = false;
                        this.gameover_rank_player_num_img_id.source = "ui_paihangbang_no2_1_png";
                        break;
                    case 3:
                        this.gameover_rank_player_num_img_id.visible = true;
                        this.gameover_rank_player_num_id.visible = false;
                        this.gameover_rank_player_num_img_id.source = "ui_paihangbang_no3_1_png";
                        break;
                    default:
                        this.gameover_rank_player_num_img_id.visible = false;
                        this.gameover_rank_player_num_id.visible = true;
                        this.gameover_rank_player_num_id.text = this.itemIndex + 1 + "";
                        break;
                }
            }
            this.gameover_win_player_head_img.source = this.itemData.playerImg;
            this.gameover_win_player_nickname.text = this.itemData.playerName;
            switch (this.itemData.sortOrder) {
                case 1:
                    this.gameover_win_player_chengji.text = "使用步数: " + this.itemData.usedStepNum + "步";
                    break;
                case 2:
                    this.gameover_win_player_chengji.text = "使用时间: " + this.itemData.usedTime + "秒";
                    break;
                case 3:
                    this.gameover_win_player_chengji.text = "达成分数: " + this.itemData.scoreNum + "分";
                    break;
                case 4:
                    this.gameover_win_player_chengji.text = "完成目标数: " + this.itemData.removeBlockNum + "个";
                    break;
                default:
                    break;
            }
            // this.gameover_win_player_btn.touchEnabled = true;
            // this.gameover_win_player_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            //     App.ViewManager.open(ViewConst.GameRankDetail, this.itemData,1);
            // },this);
        }
    };
    return GameOverRankPlayerWinView;
}(eui.ItemRenderer));
__reflect(GameOverRankPlayerWinView.prototype, "GameOverRankPlayerWinView");
//# sourceMappingURL=GameOverRankPlayerWinView.js.map