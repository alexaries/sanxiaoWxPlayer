/**
 * Created by HuDe Zheng on 2018/7/17.
 * 游戏场景
 */
class GameScene extends BaseScene{
    /**
     * 构造函数
     */
    public constructor(){
        super();
    }

    /**
     * 进入Scene调用
     */
    public onEnter():void{
        super.onEnter();

        this.addLayerAt(LayerManager.Game_Main, 0);
        this.addLayer(LayerManager.Game_UI);
        this.addLayer(LayerManager.UI_Message);

        LayerManager.Game_UI.addChild(Panel_PopupLayer.getInstance());
       // App.ViewManager.open(ViewConst.Game);
       // App.ViewManager.open(ViewConst.GameUI);
    }

    /**
     * 退出Scene调用
     */
    public onExit():void{
        super.onExit();
    }
}

