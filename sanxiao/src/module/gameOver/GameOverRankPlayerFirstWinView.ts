/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class GameOverRankPlayerFirstWinView extends BaseEuiView
{
    // 最先通关玩家头像
    public gameover_first_win_player_head_img:eui.Image;
    // 最先通关玩家头像昵称
    public gameover_first_win_player_nickname:eui.Label;
    // 最先通关玩家创建时间
    public gameover_first_win_player_create_time:eui.Label;
    // 最先通过玩家点击详情
    // public gameover_first_win_player_detail_btn:eui.Button;
    // 有最先通关玩家信息显示
    public gameover_first_rank_player_win_group:eui.Group;
    // 没有最先通关玩家显示
    public gameover_first_rank_player_nobody:eui.Label;


    public constructor(controller:BaseController, parent:eui.Group) {
        super(controller, parent);
        this.skinName = "gameover_RankPlayerFirstWinUi";
        // this.first_win_player_head_img.width = this.first_win_player_head_img.height = 42;
    }
    public firstWinRankObj;
    public init(firstWinRankObj) {
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
            this.gameover_first_win_player_create_time.text =  DateUtils.format(new Date(firstWinRankObj.created_date),"yyyy/MM/dd HH:mm:ss");
            // this.gameover_first_win_player_detail_btn.touchEnabled = true;
            // this.gameover_first_win_player_detail_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.detailBtnBack,this);
            this.firstWinRankObj = firstWinRankObj;
        } else {
            // 还没有最先通过玩家
            this.gameover_first_rank_player_win_group.visible = false;
            this.gameover_first_rank_player_nobody.visible = true;
        }

    }

    public detailBtnBack () {
        App.ViewManager.open(ViewConst.GameRankDetail, this.firstWinRankObj);

        // if (this.firstWinRankObj && this.firstWinRankObj._id) {
        //     console.info(this.firstWinRankObj);
        // } else {
        //     console.info("没有详情信息");
        // }
    }
}