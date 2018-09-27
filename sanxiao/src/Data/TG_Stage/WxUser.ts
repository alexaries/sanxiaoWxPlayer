class WxUser {
    private static wxUser:WxUser;
    public static getInstance(){
        if(!this.wxUser){
            this.wxUser=new WxUser();
        }
        return this.wxUser;
    }
    public status:number;
    public msg:string;
    // 微信openid
    public openid:string;
    // 微信用户id
    public wxUserId:string;
    // 用户昵称
    public nickname:string;
    // 性别 1 男 0 女
    public  sex:number;
    // 头像
    public headimgurl:string;
    // 语言
    public language:string;
    // 国家
    public country:string;
    // 省份
    public province:string;
    // 城市
    public city:string;
}