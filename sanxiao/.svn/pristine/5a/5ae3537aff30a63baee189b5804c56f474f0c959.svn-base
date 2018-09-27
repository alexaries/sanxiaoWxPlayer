/**
 * Created by ZhangHui on 2018/6/1.
 */
class Panel_GameLayer extends egret.Sprite{
    /*单例*/
    private static panel_GameLayer:Panel_GameLayer;
    public static getInstance(){
        if(!this.panel_GameLayer){
            this.panel_GameLayer=new Panel_GameLayer();
        }
        return this.panel_GameLayer;
    }
    /*开始游戏*/
    public initPanel(){
        // this.addChild(GamePanel.getInstance());
        LayerManager.Game_Main.addChild(GamePanel.getInstance());
         GamePanel.getInstance().initGamePanel();
        // App.ViewManager.open(ViewConst.Prop);
    }


}