/**
 * Created by ZhangHui on 2018/6/1.
 */
class Panel_PopupLayer extends BaseClassSprite{
    /*浮层框提示*/
    private myAlertSp:egret.Sprite;
    public myAlert(str,time=700,vy=Main.stageHeight*.5){
        if(this.myAlertSp){
            egret.Tween.removeTweens(this.myAlertSp);
            App.DisplayUtils.removeFromParent(this.myAlertSp);
            this.myAlertSp=null;
        }
        try{
            this.myAlertSp=new egret.Sprite();
            this.addChild(this.myAlertSp);
            let bg=new egret.Bitmap(RES.getRes("common_bg1"));
            this.myAlertSp.addChild(bg);
            let txt=new egret.TextField();
            this.myAlertSp.addChild(txt);
            txt.textAlign="center";
            txt.verticalAlign="middle";
            txt.textColor=0xffffff;
            txt.text=str;
            txt.size=50;
            bg.width=txt.width*1.2;
            bg.height=120;
            txt.x=txt.width*.1;
            txt.y=35;
            this.myAlertSp.x=Main.stageWidth/2-bg.width/2;
            this.myAlertSp.y=vy-bg.height/2+20;
            this.myAlertSp.alpha=0;
            egret.Tween.get(this.myAlertSp).to({y:this.myAlertSp.y-20,alpha:1},100).wait(time).to({y:this.myAlertSp.y-40,alpha:0},150).call(function(){
                if(this.myAlertSp){
                    App.DisplayUtils.removeFromParent(this.myAlertSp);
                    this.myAlertSp=null;
                }
            }.bind(this),this)
        }catch (e) {
            console.log("浮框背景未加载...")
        }

    }
}