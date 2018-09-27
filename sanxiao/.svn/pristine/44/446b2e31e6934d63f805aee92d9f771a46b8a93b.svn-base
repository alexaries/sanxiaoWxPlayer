/**
 * Created by HuDe Zheng on 2018/8/07.
 */
class RankDetailController extends BaseController
{
    private view:RankDetailView


    public constructor() {
        super();
        this.view = new RankDetailView(this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.GameRankDetail, this.view);

        this.view.begin_rank_detail_rect.touchEnabled = true;
        this.view.begin_rank_detail_rect.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backHandler,this);
    }
    private backHandler(e)
    {
         App.ViewManager.close(ViewConst.GameRankDetail);
    }
    public init()
    {

    }


}
