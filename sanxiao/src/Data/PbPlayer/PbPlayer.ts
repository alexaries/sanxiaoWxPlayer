/**
 * Created by Administrator on 2018/6/14.
 *
 * 备注 玩家信息
 */
class PbPlayer extends BaseClass
{
    private OpenId:string;//微信平台用户唯一标识
    private HeadUrl:string;//用户头像url
    private Sex:string;//用户性别
    private NickName:string;//用户昵称

    private Id:number;
    private Name:string;
    private Level:number;
    private ServerId:number;
    private CurServerId:number;
    private LadderLv:number;
    private LadderStar:number;
    private Avatar:string;
    private State:number;
    private NeedGuild:boolean;
    private Rank:number;
    private Model:number;
    private Nationality:number;
    private Avaters:number;
    private Signature:string;
    private Constellation:number;
    private Age:number;
    private City:string;
    private GenLon:number;
    private GenLat:number;
    private LadderAddStarScore:number;

    /**
     * 初始化微信用户资料
     * @param obj
     * @constructor
     */
    public set Init_Wx_UserInfo(obj:any)
    {
        this.OpenId = obj["openid"];
        this.HeadUrl = obj["headimgurl"];
        this.Sex = obj["sex"];
        this.NickName = obj["nickname"];
    }
    public get openid():string
    {
        return  this.OpenId;
    }
    public get headimg():string
    {
        return  this.HeadUrl;
    }
    public get sex():string
    {
        return  this.Sex;
    }
    public get nickname():string
    {
        return  this.NickName;
    }
}
