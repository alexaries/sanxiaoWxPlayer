class RankDetailView extends BaseEuiView
{
    // 弹框背景
    public begin_rank_detail_rect:eui.Rect;
    // 排行榜数字图片
    public begin_rank_detail_number_img :eui.Image;
    // 排行榜文字
    public begin_rank_detail_number_label:eui.Label;
    // 排行榜用户头像
    public begin_rank_detail_usr_img:eui.Image;
    // 排行榜用户昵称
    public begin_rank_detail_usr_nickname:eui.Label;
    // 排行榜任务目标
    public begin_rank_detail_target:eui.Label;
    // 排行榜分数
    public begin_rank_detail_score:eui.Label;

    public constructor(controller: BaseController, parent: eui.Group) {
        super(controller, parent);
        this.skinName = "begin_rank_detailUi";
    }
    /**
     * 开启界面
     */
    public open(...param: any[]): void {
        super.open(param);
        let userInfoView = param[0];
        let type = param[1];
        if (type == 0) {
            if (userInfoView) {
                if (userInfoView.rankNum) {
                    // userInfoView.rankNum = 4
                    switch (userInfoView.rankNum) {
                        case 1:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no1_1_png";
                            break;
                        case 2:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no2_1_png";
                            break;
                        case 3:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no3_1_png";
                            break;
                        default:
                            this.begin_rank_detail_number_img.visible = false;
                            this.begin_rank_detail_number_label.visible = true;
                            this.begin_rank_detail_number_label.text = userInfoView.rankNum;
                            break;
                    }
                    this.begin_rank_detail_usr_nickname.text = userInfoView.player_name;
                    this.begin_rank_detail_usr_img.source = userInfoView.player_img;
                    // userInfoView.sort_order =4;
                    switch (userInfoView.sort_order) {
                        case 1:
                            this.begin_rank_detail_target.text = "使用步数: "+userInfoView.used_step_num+"步";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.score_num +"分";
                            break;
                        case 2:
                            this.begin_rank_detail_target.text = "使用时间: "+userInfoView.used_time+"秒";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.score_num +"分";
                            break;
                        case 3:
                            this.begin_rank_detail_target.text = "";
                            this.begin_rank_detail_score.x = 4.67;
                            this.begin_rank_detail_score.y = 35.46;
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.score_num +"分";
                            break;
                        case 4:
                            this.begin_rank_detail_target.text = "完成目标数: "+userInfoView.used_time+"个";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.score_num +"分";
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if (type == 1) {
            if (userInfoView) {
                if (userInfoView.rankNum) {
                    // let _this = param[2];
                    // userInfoView.rankNum = 4
                    switch (userInfoView.rankNum) {
                        case 1:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no1_1_png";
                            break;
                        case 2:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no2_1_png";
                            break;
                        case 3:
                            this.begin_rank_detail_number_img.visible = true;
                            this.begin_rank_detail_number_label.visible = false;
                            this.begin_rank_detail_number_img.source = "ui_paihangbang_no3_1_png";
                            break;
                        default:
                            this.begin_rank_detail_number_img.visible = false;
                            this.begin_rank_detail_number_label.visible = true;
                            this.begin_rank_detail_number_label.text = userInfoView.rankNum;
                            break;
                    }
                    this.begin_rank_detail_usr_nickname.text = userInfoView.playerName;
                    this.begin_rank_detail_usr_img.source = userInfoView.playerImg;
                    // userInfoView.sort_order =4;
                    switch (userInfoView.sortOrder) {
                        case 1:
                            this.begin_rank_detail_target.text = "使用步数: "+userInfoView.usedStepNum+"步";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.scoreNum +"分";
                            break;
                        case 2:
                            this.begin_rank_detail_target.text = "使用时间: "+userInfoView.usedTime+"秒";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.scoreNum +"分";
                            break;
                        case 3:
                            this.begin_rank_detail_target.text = "";
                            this.begin_rank_detail_score.x = 4.67;
                            this.begin_rank_detail_score.y = 35.46;
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.scoreNum +"分";
                            break;
                        case 4:
                            this.begin_rank_detail_target.text = "完成目标数: "+userInfoView.usedTime+"个";
                            this.begin_rank_detail_score.text = "达成分数: " + userInfoView.scoreNum +"分";
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        // this.refreshIconState();
    }
    public refreshIconState()
    {
        
    }
}