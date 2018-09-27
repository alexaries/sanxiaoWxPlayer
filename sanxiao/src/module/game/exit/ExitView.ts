class ExitView extends BaseEuiView
{
    public bg:eui.Rect;
    public continueBtn:eui.Button;
    public replayBtn:eui.Button;

    public musicGroup1:eui.Group;
    public musicGroup2:eui.Group;
    public musicIcon1:eui.Image;
    public musicIcon2:eui.Image;

    public gameDetailBtn:eui.Group;
    
    

    public constructor(controller: BaseController, parent: eui.Group) {
        super(controller, parent);
        this.skinName = "exitUI";


    }
    /**
     * 开启界面
     */
    public open(...param: any[]): void {
        super.open(param);

        this.refreshIconState();

        
    }
    public refreshIconState()
    {
        let bgOn = App.SoundManager.getBgOn();
        let effectOn = App.SoundManager.getEffectOn();
         if(bgOn)
        {
            this.musicIcon1.source = "ui_battle_pause_button_music_png";
        }
        else
        {
            this.musicIcon1.source = "ui_battle_pause_button_music_off_png";
        }
        if(effectOn)
        {
            this.musicIcon2.source = "ui_battle_pause_button_volume_png";
        }
        else
        {
            this.musicIcon2.source = "ui_battle_pause_button_volume_off_png";
        }
    }
}