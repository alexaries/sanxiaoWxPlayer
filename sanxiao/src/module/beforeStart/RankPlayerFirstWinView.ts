/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class RankPlayerFirstWinView extends BaseEuiView
{
    // 最先通关玩家头像
    public first_win_player_head_img:eui.Image;
    // 最先通关玩家头像昵称
    public first_win_player_nickname:eui.Label;
    // 最先通关玩家创建时间
    public first_win_player_create_time:eui.Label;
    // 最先通过玩家点击详情
    public first_win_player_detail_btn:eui.Button;
    // 有最先通关玩家信息显示
    public first_rank_player_win_group:eui.Group;
    // 没有最先通关玩家显示
    public first_rank_player_nobody:eui.Label;


    public constructor(controller:BaseController, parent:eui.Group) {
        super(controller, parent);
        this.skinName = "rank_player_first_winUi";
        // this.first_win_player_head_img.width = this.first_win_player_head_img.height = 42;

    }
    public firstWinRankObj;
    public init(firstWinRankObj) {
        console.info(firstWinRankObj);
        if (firstWinRankObj && firstWinRankObj.hasOwnProperty("player_id")) {
            // console.info(firstWinRankObj)
            this.first_rank_player_win_group.visible = true;
            this.first_rank_player_nobody.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                firstWinRankObj.player_img = "head001_png";
            }
            this.first_win_player_head_img.source = firstWinRankObj.player_img;
            this.first_win_player_nickname.text = firstWinRankObj.player_name;
            this.first_win_player_create_time.text =  DateUtils.format(new Date(firstWinRankObj.created_date),"yyyy/MM/dd HH:mm:ss");
            this.first_win_player_detail_btn.touchEnabled = true;
            this.first_win_player_detail_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.detailBtnBack,this);
            this.firstWinRankObj = firstWinRankObj;
        } else {
            // 还没有最先通过玩家
            this.first_rank_player_win_group.visible = false;
            this.first_rank_player_nobody.visible = true;
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