/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class RankPlayerWinView  extends eui.ItemRenderer
{
    public itemData:any;
    public my_rank_player_rect1:eui.Rect;
    public my_rank_player_rect2:eui.Rect;
    public my_rank_player_win_noHasRank:eui.Label;
    public my_rank_player_win_hasRank:eui.Group;
    private my_rank_player_num_id:eui.Label;
    private my_rank_player_num_img_id:eui.Image;
    private my_win_player_head_img:eui.Image;
    private my_win_player_nickname:eui.Label;
    private my_win_player_chengji:eui.Label;
    private my_win_player_btn:eui.Button;
    public constructor() {
        super();
        this.skinName = "rank_player_winUi";
    }

    public myRankObj;
    public init(myRankObj) {
        if (myRankObj && myRankObj.hasOwnProperty("player_id")) {
            // console.info(myRankObj)
            // console.info(firstWinRankObj)
            this.my_rank_player_win_hasRank.visible = true;
            this.my_rank_player_win_noHasRank.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                myRankObj.player_img = "head001_png";
            }
            // myRankObj.rankNum  =12;
            if (myRankObj.rankNum) {
                switch (myRankObj.rankNum) {
                    case 1:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no1_1_png";
                        break;
                    case 2:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no2_1_png";
                        break;
                    case 3:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no3_1_png";
                        break;
                    default:
                        this.my_rank_player_num_img_id.visible = false;
                        this.my_rank_player_num_id.visible = true;
                        this.my_rank_player_num_id.text = myRankObj.rankNum;
                        break;
                }
            }
            this.my_win_player_head_img.source = myRankObj.player_img;
            this.my_win_player_nickname.text = myRankObj.player_name;
            switch (myRankObj.sort_order) {
                case 1:
                    this.my_win_player_chengji.text = "使用步数: "+myRankObj.used_step_num+"步";
                    break;
                case 2:
                    this.my_win_player_chengji.text = "使用时间: "+myRankObj.used_time+"秒";
                    break;
                case 3:
                    this.my_win_player_chengji.text = "达成分数: " + myRankObj.score_num +"分";
                    break;
                case 4:
                    this.my_win_player_chengji.text = "完成目标数: "+myRankObj.remove_block_num+"个";
                    break;
                default:
                    break;
            }
            this.my_win_player_btn.touchEnabled = true;
            this.my_win_player_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.detailBtnBack,this);
            this.myRankObj = myRankObj;
        } else {
            // 还没有最先通过玩家
            this.my_rank_player_win_hasRank.visible = false;
            this.my_rank_player_win_noHasRank.visible = true;
        }

    }

    public detailBtnBack () {
        App.ViewManager.open(ViewConst.GameRankDetail, this.myRankObj,0);
    }

    protected dataChanged():void
    {
        super.dataChanged();
        this.itemData = this.data;
        if(this.itemData)
        {
            // console.info(this.itemData);
            // console.info(this.itemIndex +1);
            this.itemData.rankNum = this.itemIndex +1;
            this.my_rank_player_win_hasRank.visible = true;
            this.my_rank_player_win_noHasRank.visible = false;
            if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
                this.itemData.playerImg = "head001_png";
            }
            if ((this.itemIndex+1)%2 == 0) {
                this.my_rank_player_rect1.fillColor = MergeColorUtils.mergeColor(135,173,220);
                this.my_rank_player_rect2.fillColor = MergeColorUtils.mergeColor(173,199,216);
            } else {
                this.my_rank_player_rect1.fillColor = MergeColorUtils.mergeColor(165,191,212);
                this.my_rank_player_rect2.fillColor = MergeColorUtils.mergeColor(187,205,219);
            }
            if (this.itemIndex) {
                switch (this.itemIndex +1) {
                    case 1:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no1_1_png";
                        break;
                    case 2:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no2_1_png";
                        break;
                    case 3:
                        this.my_rank_player_num_img_id.visible = true;
                        this.my_rank_player_num_id.visible = false;
                        this.my_rank_player_num_img_id.source = "ui_paihangbang_no3_1_png";
                        break;
                    default:
                        this.my_rank_player_num_img_id.visible = false;
                        this.my_rank_player_num_id.visible = true;
                        this.my_rank_player_num_id.text = this.itemIndex +1+"";
                        break;
                }
            }
            this.my_win_player_head_img.source = this.itemData.playerImg;
            this.my_win_player_nickname.text = this.itemData.playerName;
            switch (this.itemData.sortOrder) {
                case 1:
                    this.my_win_player_chengji.text = "使用步数: "+this.itemData.usedStepNum+"步";
                    break;
                case 2:
                    this.my_win_player_chengji.text = "使用时间: "+this.itemData.usedTime+"秒";
                    break;
                case 3:
                    this.my_win_player_chengji.text = "达成分数: " + this.itemData.scoreNum +"分";
                    break;
                case 4:
                    this.my_win_player_chengji.text = "完成目标数: "+this.itemData.removeBlockNum+"个";
                    break;
                default:
                    break;
            }
            this.my_win_player_btn.touchEnabled = true;
            this.my_win_player_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
                App.ViewManager.open(ViewConst.GameRankDetail, this.itemData,1);
            },this);
        }
    }
}