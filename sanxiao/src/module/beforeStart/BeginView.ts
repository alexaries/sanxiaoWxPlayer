import Group = eui.Group;
/**
 * Created by HuDe Zheng on 2018/7/30.
 */
class BeginView extends BaseEuiView implements RES.PromiseTaskReporter
{
    public tabBar:game.DimTabGroup;
    public datile_group:Group;
    public rank_group:Group;

    public loadingBar:eui.Image;
    public loadingBarBg:eui.Image;
    public numField:eui.Label;

    public beginBtn:eui.Button;

    public datile_view:DetailView;
    public BeginRect:eui.Rect;//背景图
    
    public UserVoice:eui.Group;//声音Group
    public UserVoiceText:eui.Label;//声音长度

    public textureImg:eui.Image;//封面图
    public headImg:eui.Image;//玩家头像
    public nameTex:eui.Label;//玩家名称

    public authorTex:eui.Label;//作者名称
    public head_mask:eui.Image;//玩家头像遮罩
    public IsWin:eui.Image;//玩家是否通关

    public UserGmaeLabel:eui.Label;    //玩家 在此关卡游戏次数
    public UserLikeLabel:eui.Label;    //玩家 喜欢次数

    //public CheckpoinAdoptRateGroup :eui.Group;//关卡通过率Group
    //public CheckpoinAdoptRateImage :eui.Image;//关卡通过率Group
    public CheckpoinAdoptRateText :eui.Label;//关卡通过率Group

    public LodingBack:eui.Image;//未加载完成时loding背景


    public constructor(controller:BaseController, parent:eui.Group) {
        super(controller, parent);
        this.skinName = "beginUI";
        this.init();
    }
    public open(...param:any[]):void {
        super.open(param);
        Log.getInstance().trace("开启开始界面窗口")
         this.x = 0;
         this.y = 0;
          //播放背景音乐
        App.SoundManager.playBg("bgSound");
    }
    public callback() {

    }
    // 设置当前页面信息
    public init(){
        this.LodingBack.visible = true;
        if(TG_Stage.TextureUrl.length > 0) {
            this.textureImg.source = "networkImage_" + TG_Stage.TextureUrl + "_png";
        }
        if(TG_Stage.Author["Avatar"].length > 0) {
            try {
                if(Number(TG_Stage.Author["Avatar"]) <= 13) {
                    // RES.getResAsync("userDefault_" + TG_Stage.Author["Avatar"]+ "_png");
                    this.headImg.source = "userDefault_" + TG_Stage.Author["Avatar"]+ "_png";
                    // console.info(this.headImg.source);
                } else {
                    this.headImg.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
                }
            } catch (e) {
                this.headImg.source = ConfigConst.networkLink + TG_Stage.Author["Avatar"] + ".png";
            }

        }
        // console.info(this.headImg.source);
        this.headImg.mask = this.head_mask;

        if(TG_Stage.Name && TG_Stage.Name.length > 0) {
            this.nameTex.text = TG_Stage.Name;
        }else{
            this.nameTex.text ="神秘关卡";
        }
        if(TG_Stage.Author["Name"] && TG_Stage.Author["Name"].length > 0) {
            this.authorTex.text = TG_Stage.Author["Name"];
        }else
        {
            this.authorTex.text = "无名小卒";
        }

        //设置玩家录音
        if(TG_Stage.VoiceTime){
            this.UserVoice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.UserVoiceOpen, this);

            if(TG_Stage.VoiceTime){
                this.UserVoiceText.text = TG_Stage.VoiceTime+"''";
            }else{
                this.UserVoiceText.text = "0"+"''";
            }
        }
        
        //设置玩家游戏次数
        if(TG_Stage){
             this.UserGmaeLabel.text = "00";
        }
         //设置玩家喜欢次数(点击心的次数)
        if(TG_Stage){
             this.UserLikeLabel.text = "00";
        }
        //设置通过率
        if(TG_Stage){
             this.CheckpoinAdoptRateText.text = "通过率"+"00";
        }
        //设置通过图片
        if(TG_Stage){
           this.IsWin.source=""; 
        }
        
    }
    private UserVoiceOpen(){
        App.SoundManager.playBg(TG_Stage.VoiceUrl+"");
    }

    /** 进度信息 */
    public onProgress(current: number, total: number): void {

        App.MessageCenter.dispatch("jiazaijindu",current,total);
    }

}
