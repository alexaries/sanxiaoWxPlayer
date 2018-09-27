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
var RankView = (function (_super) {
    __extends(RankView, _super);
    function RankView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.skinName = "begin_rankUi";
        _this.rank_player_win_list_view.itemRenderer = RankPlayerWinView;
        _this.all_rank_player_hasbody_group.visible = false;
        _this.all_rank_player_nobody_group.visible = true;
        _this.rank_player_first_win_view.first_rank_player_win_group.visible = false;
        _this.rank_player_first_win_view.first_rank_player_nobody.visible = true;
        _this.rank_player_win_my_view.my_rank_player_win_hasRank.visible = false;
        _this.rank_player_win_my_view.my_rank_player_win_noHasRank.visible = true;
        return _this;
    }
    /**
     *
     * 初始化任务目标
     *
     */
    RankView.prototype.init = function () {
        this.rankData = this.getRankViewData();
    };
    /**
     *
     * 获取排行榜数据
     *
     */
    RankView.prototype.getRankViewData = function () {
        App.MessageCenter.addListener("wx_findRankInfo", this.findRankViewInfoBack, this);
        var stageId;
        var playerId;
        // if (ConfigConst.env == "dev" || ConfigConst.env == "demo") {
        //     stageId = "1";
        //     playerId = "5b98cbfae5d2d91d2018260c";
        // } else {
        //     stageId = TG_Stage.StageId;
        //     playerId = WxUser.getInstance().wxUserId;
        // }
        stageId = TG_Stage.StageId;
        playerId = WxUser.getInstance().wxUserId;
        var findStageRank = ConfigConst.findStageRank;
        var preUrl = findStageRank.substring(0, findStageRank.indexOf("${STAGEID}"));
        findStageRank = preUrl + stageId + "/playerId/" + playerId;
        App.Http.initServer(findStageRank, "1");
        App.Http.send("wx_findRankInfo", new URLVariables("page=1&size=20"));
    };
    /**
     * 查询排行榜数据信息回调
     */
    RankView.prototype.findRankViewInfoBack = function (data) {
        // console.info(data);
        this.rankData = data;
        if (!data.succ) {
            console.info(data.errMsg);
        }
        if (data.succ) {
            if (data.succResp && data.succResp.firstWinRankObj) {
                var firstWinRankObj = data.succResp.firstWinRankObj;
                // console.info(firstWinRankObj);
                this.rank_player_first_win_view.init(firstWinRankObj);
            }
            if (data.succResp && data.succResp.myRankObj) {
                var myRankObj = data.succResp.myRankObj;
                this.rank_player_win_my_view.init(myRankObj);
            }
            if (data.succResp && data.succResp.rankLstObj) {
                var rankLstObj = data.succResp.rankLstObj;
                var listData = new eui.ArrayCollection();
                // console.info(88888)
                // console.info(rankLstObj.page.datas)
                if (rankLstObj.page.datas && rankLstObj.page.datas.length > 0) {
                    this.all_rank_player_hasbody_group.visible = true;
                    this.all_rank_player_nobody_group.visible = false;
                    listData.source = rankLstObj.page.datas;
                    this.rank_player_win_list_view.dataProvider = listData;
                    listData.refresh();
                }
                else {
                    this.all_rank_player_hasbody_group.visible = false;
                    this.all_rank_player_nobody_group.visible = true;
                }
            }
        }
        return this.rankData;
    };
    return RankView;
}(BaseEuiView));
__reflect(RankView.prototype, "RankView");
//# sourceMappingURL=RankView.js.map