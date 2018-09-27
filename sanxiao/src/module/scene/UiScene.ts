/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class UiScene extends BaseScene
{
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

        //初始化添加ui层级
        this.addLayer(LayerManager.UI_Main);
        // this.addLayer(LayerManager.UI_Popup);
        // this.addLayer(LayerManager.UI_Tips);
        this.addLayer(LayerManager.UI_Message);



        LayerManager.UI_Message.addChild(Panel_PopupLayer.getInstance());//弹窗
    }

    /**
     * 退出Scene调用
     */
    public onExit():void{
        super.onExit();

    }
}
