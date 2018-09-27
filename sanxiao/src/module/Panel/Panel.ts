/**
 * Created by ZhangHui on 2018/6/1.
 */
class Panel extends Main{
    /*单例*/
    private static panel:Panel;
    public static getInstance(){
        if(!this.panel){
            this.panel=new Panel();
        }
        return this.panel;
    }
    /*初始化层级*/
    public initLayerLev(){
        /*游戏层*/
        this.MainThis.addChild(Panel_GameLayer.getInstance());
        /*弹框层*/
        this.MainThis.addChild(Panel_AlertLayer.getInstance());
        /*浮框层*/
        this.MainThis.addChild(Panel_PopupLayer.getInstance());
        /*加载层*/
        // this.MainThis.addChild(Panel_LoadLayer.getInstance());
    }

}