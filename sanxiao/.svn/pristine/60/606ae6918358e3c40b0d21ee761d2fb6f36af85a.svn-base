/**
 * Created by ZhangHui on 2018/6/1.
 */
class Panel_GameLayerCtr extends BaseController1{
    /*单例*/
    private static panel_GameLayerCtr:Panel_GameLayerCtr;
    public static getInstance(){
        if(!this.panel_GameLayerCtr){
            this.panel_GameLayerCtr=new Panel_GameLayerCtr();
        }
        return this.panel_GameLayerCtr;
    }
    /*开始游戏*/
    public gameStart(){
        /*刷新地图*/
        // Panel_GameLayer.getInstance().initPanel();
        //先加载游戏必要的网络资源
        let networkImageArr = LoadNetworkImageUtils.loadNetworkImage;
        if (networkImageArr.length == 0) {
            Panel_GameLayer.getInstance().initPanel();
        } else {
            App.MessageCenter.addListener(Msg.Event.NetLoadComplete,this.loadCompleteHandler,this);
            App.EasyLoading.showLoading();
            RES.loadGroup(LoadNetworkImageUtils.groupName,0,App.EasyLoading);
        }

    }
    public loadCompleteHandler()
    {
        App.MessageCenter.removeListener(Msg.Event.NetLoadComplete,this.loadCompleteHandler,this);
        App.EasyLoading.hideLoading();
        Panel_GameLayer.getInstance().initPanel();
    }
}