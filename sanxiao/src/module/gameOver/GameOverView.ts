class GameOverView extends BaseEuiView {
    // 比赛结果
    public postData:any;
    public game_over_head_win_group:eui.Group;
    public game_over_head_lose_group:eui.Group;
    public game_over_body_tasktarget_img:eui.Image;
    public game_over_body_tasktarget_title:eui.Label;
    public game_over_body_tasktarget_score:eui.Label;
    public game_over_body_replay_btn:eui.Button;
    public game_over_body_download_btn:eui.Button;
    public gameover_footer_author_head_img:eui.Image;
    public gameover_footer_author_stagename:eui.Label;
    public gameover_footer_author_nickname:eui.Label;
    public gameOverRankPlayerFirstWinView:GameOverRankPlayerFirstWinView;
    public gameOverMyRankPlayerWinView:GameOverMyRankPlayerWinView;
    public game_over_body_rank_list:eui.List;
    public game_over_body_rank_label:eui.Label;

    public constructor(controller: BaseController, parent: eui.Group) {
        super(controller, parent);
        this.skinName = "game_overUI";
    }

    /**
     * 开启界面
     */
    public open(...param: any[]): void {
        super.open(param);
        this.game_over_body_rank_list.itemRenderer = GameOverRankPlayerWinView;
        this.postData = JSON.parse(param[0]);
        let respData = this.postData.respData;
        if (respData) {
            this.gameoverFindRankViewInfoBack(respData)
        } else {
            App.ViewManager.close(ViewConst.GameOverRank);
        }
    }

    public gameoverFindRankViewInfoBack(data) {
        this.refreshIconState();
        this.addEventTask();
        // console.info(data);
        if (!data.succ) {
            // console.info(data.errMsg);
            this.gameOverRankPlayerFirstWinView.gameover_first_rank_player_win_group.visible = false;
            this.gameOverRankPlayerFirstWinView.gameover_first_rank_player_nobody.visible = true;
            this.gameOverMyRankPlayerWinView.gameover_my_rank_player_win_hasRank.visible = false;
            this.gameOverMyRankPlayerWinView.gameover_my_rank_player_win_noHasRank.visible = true;
            this.game_over_body_rank_list.visible = false;
            this.game_over_body_rank_label.visible = true;
        }
        if (data.succ) {
            this.gameOverRankPlayerFirstWinView.gameover_first_rank_player_win_group.visible = true;
            this.gameOverRankPlayerFirstWinView.gameover_first_rank_player_nobody.visible = false;
            this.gameOverMyRankPlayerWinView.gameover_my_rank_player_win_hasRank.visible = true;
            this.gameOverMyRankPlayerWinView.gameover_my_rank_player_win_noHasRank.visible = false;
            this.game_over_body_rank_list.visible = true;
            this.game_over_body_rank_label.visible = false;

            //
            if (data.succResp && data.succResp.firstWinRankObj) {
                let firstWinRankObj = data.succResp.firstWinRankObj;
                // console.info(firstWinRankObj);
                this.gameOverRankPlayerFirstWinView.init(firstWinRankObj);
            }
            if (data.succResp && data.succResp.myRankObj) {
                let myRankObj = data.succResp.myRankObj;
                this.gameOverMyRankPlayerWinView.init(myRankObj);
            }
            if (data.succResp && data.succResp.rankLstObj) {
                let rankLstObj = data.succResp.rankLstObj;
                let listData:eui.ArrayCollection = new eui.ArrayCollection();
                // console.info(88888)
                // console.info(rankLstObj.page.datas)
                if (rankLstObj.page.datas && rankLstObj.page.datas.length > 0) {
                    this.game_over_body_rank_list.visible = true;
                    this.game_over_body_rank_label.visible = false;
                    listData.source = rankLstObj.page.datas;
                    this.game_over_body_rank_list.dataProvider = listData;
                    listData.refresh();
                } else {
                    this.game_over_body_rank_list.visible = false;
                    this.game_over_body_rank_label.visible = true;
                }

            }

        }
    }
    private addEventTask() {
        this.game_over_body_replay_btn.touchEnabled = true;
        this.game_over_body_download_btn.touchEnabled = true;
        this.game_over_body_replay_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClickBack,this);
        this.game_over_body_download_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClickBack,this);
    }

    private btnClickBack(e:egret.TouchEvent) {
        if (e.target == this.game_over_body_replay_btn) {
            this.game_over_body_replay_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClickBack,this);
            App.ViewManager.close(ViewConst.GameOverRank);
            App.MessageCenter.dispatch(Msg.Event.RePlay);
        }
        if (e.target == this.game_over_body_download_btn) {
            this.game_over_body_download_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClickBack,this);
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                alert("线上环境可以下载");
            } else {
                window.location.href="http://www.ugcapp.com/firstpage/downloadApp";
            }
        }
    }
    private refreshIconState() {
        // console.info(this.postData);
        // 本次游戏得分
        if (this.postData.stage_type == 0) {
            if (this.postData.condition_limit == -1) {
                this.game_over_body_tasktarget_title.text = "得到分数";
                this.game_over_body_tasktarget_score.text =  this.postData.score_num +"分"
            }
            if (this.postData.condition_limit == 0) {
                this.game_over_body_tasktarget_title.text = "使用步数";
                this.game_over_body_tasktarget_score.text =  this.postData.used_step_num +"步"
            }
            if (this.postData.condition_limit == 1) {
                this.game_over_body_tasktarget_title.text = "使用时间";
                this.game_over_body_tasktarget_score.text =  this.postData.used_time +"秒"
            }
        }
        if (this.postData.stage_type == 1) {
            this.game_over_body_tasktarget_title.text = "完成目标数";
            this.game_over_body_tasktarget_score.text =  this.postData.remove_block_num +"个"
        }
        // 头部胜利 失败图片显示
        if (this.postData.type == 0) {
            this.game_over_head_win_group.visible = false;
            this.game_over_head_lose_group.visible = true;
            this.game_over_body_tasktarget_img.source = "ui_jiesuan_hengfu_blue_png";
        }
        if (this.postData.type == 1) {
            this.game_over_head_win_group.visible = true;
            this.game_over_head_lose_group.visible = false;
            this.game_over_body_tasktarget_img.source = "ui_jiesuan_hengfu_yellow_png";
        }
        // console.info(TG_Stage.Author);
        // 底部关卡信息显示
        if(TG_Stage.Author["Avatar"].length > 0) {
            try {
                if(Number(TG_Stage.Author["Avatar"]) <= 13) {
                    this.gameover_footer_author_head_img.source = "userDefault_" + TG_Stage.Author["Avatar"]+ "_png";
                } else {
                    this.gameover_footer_author_head_img.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
                }
            } catch (e) {
                this.gameover_footer_author_head_img.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
            }
        }
        this.gameover_footer_author_stagename.text = TG_Stage.Name +"  (ID:"+TG_Stage.StageId+")";
        this.gameover_footer_author_nickname.text = TG_Stage.Author.Name;

    }
}