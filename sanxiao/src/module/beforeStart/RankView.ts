/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class RankView extends BaseEuiView
{
    public rankData:any;

    public all_rank_player_hasbody_group:eui.Group;
    public all_rank_player_nobody_group:eui.Group;
    public rank_player_first_win_view:RankPlayerFirstWinView;// 最先通过的玩家
    public rank_player_win_my_view:RankPlayerWinView;// 我的排行
    public rank_player_win_list_view:eui.List;// 排行榜列表


    public constructor(controller:BaseController, parent:eui.Group) {
        super(controller, parent);
        this.skinName = "begin_rankUi";
        this.rank_player_win_list_view.itemRenderer = RankPlayerWinView;

        this.all_rank_player_hasbody_group.visible = false;
        this.all_rank_player_nobody_group.visible = true;
        this.rank_player_first_win_view.first_rank_player_win_group.visible = false;
        this.rank_player_first_win_view.first_rank_player_nobody.visible = true;
        this.rank_player_win_my_view.my_rank_player_win_hasRank.visible = false;
        this.rank_player_win_my_view.my_rank_player_win_noHasRank.visible = true;
    }

    /**
     *
     * 初始化任务目标
     *
     */
    public init() {
        this.rankData = this.getRankViewData();
    }

    /**
     *
     * 获取排行榜数据
     *
     */
    public getRankViewData () {
        App.MessageCenter.addListener("wx_findRankInfo",this.findRankViewInfoBack,this);
        let stageId;
        let playerId;
        // if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
        //     stageId = "1";
        //     playerId = "5b98cbfae5d2d91d2018260c";
        // } else {
        //     stageId = TG_Stage.StageId;
        //     playerId = WxUser.getInstance().wxUserId;
        // }
        stageId = TG_Stage.StageId;
        playerId = WxUser.getInstance().wxUserId;
        let findStageRank = ConfigConst.findStageRank;
        let preUrl = findStageRank.substring(0,findStageRank.indexOf("${STAGEID}"));
        findStageRank = preUrl + stageId + "/playerId/" + playerId;
        App.Http.initServer(findStageRank,"1");
        App.Http.send("wx_findRankInfo",new URLVariables("page=1&size=20"));
    }

    /**
     * 查询排行榜数据信息回调
     */
    public findRankViewInfoBack(data) {
        // console.info(data);
        this.rankData = data;
        if (!data.succ) {
            console.info(data.errMsg);

        }
        if (data.succ) {
            if (data.succResp && data.succResp.firstWinRankObj) {
                let firstWinRankObj = data.succResp.firstWinRankObj;
                // console.info(firstWinRankObj);
                this.rank_player_first_win_view.init(firstWinRankObj);
            }
            if (data.succResp && data.succResp.myRankObj) {
                let myRankObj = data.succResp.myRankObj;
                this.rank_player_win_my_view.init(myRankObj);
            }
            if (data.succResp && data.succResp.rankLstObj) {
                let rankLstObj = data.succResp.rankLstObj;
                let listData:eui.ArrayCollection = new eui.ArrayCollection();
                // console.info(88888)
                // console.info(rankLstObj.page.datas)
                if (rankLstObj.page.datas && rankLstObj.page.datas.length > 0) {
                    this.all_rank_player_hasbody_group.visible = true;
                    this.all_rank_player_nobody_group.visible = false;
                    listData.source = rankLstObj.page.datas;
                    this.rank_player_win_list_view.dataProvider = listData;
                    listData.refresh();
                } else {
                    this.all_rank_player_hasbody_group.visible = false;
                    this.all_rank_player_nobody_group.visible = true;
                }

            }
        }
        return this.rankData;
    }
}