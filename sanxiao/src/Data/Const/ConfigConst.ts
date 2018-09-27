/**
 * Created by Administrator on 2018/6/19.
 */

class ConfigConst {

    //是否开启微信登录
    public static open_wxLogin:boolean = false;

    // 开发环境:dev 测试环境demo 预发布环境pre 正式发布环境pro
    public static env:string = "pro";
    // 关卡数据连接
    public static url = "";
    public static devUrl="http://192.168.0.77:8091/h5Server/sendGame/getStageInfo";
    public static demoUrl="http://192.168.0.77:8091/h5Server/sendGame/getStageInfo";
    public static preUrl="http://120.92.210.53:8091/h5Server/sendGame/getStageInfo";
    public static proUrl="http://39.107.237.225:8093/h5Server/sendGame/getStageInfo";

    // 微信授权登录url
    public static h5wxloginUrl = "";
    // public static devH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?abc=123&sType=1";
    // public static testH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?abc=123&sType=1";
    public static preH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize";
    public static proH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize";

    public static appId = "wxcf772152e35e4086";
    public static backUrl = "http://h5wxlogin.ugcapp.com/wxLogin/wxCallBack";

    // 获取微信用户信息url
    public static wxUserInfoUrl = "";
    // public static devWxUserInfoUrl = "http://192.168.0.77:8001/wxLogin/getUserInfo";
    // public static testWxUserInfoUrl = "http://192.168.0.77:8001/wxLogin/getUserInfo";
    public static preWxUserInfoUrl = "http://39.107.237.225:8001/wxLogin/getWxUserInfo";
    public static proWxUserInfoUrl = "http://39.107.237.225:8001/wxLogin/getWxUserInfo";

    // 查询关卡排行榜信息
    public static findStageRank = "";
    public static devfindStageRank = "http://192.168.0.77:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    public static demofindStageRank = "http://192.168.0.77:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    public static prefindStageRank = "http://39.107.237.225:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    public static profindStageRank = "http://39.107.237.225:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";

    // 提交排行榜数据
    public static initPostRankData = "";
    public static devInitPostRankData = "http://192.168.0.77:8001/stageRank/add";
    public static demoInitPostRankData = "http://192.168.0.77:8001/stageRank/add";
    public static preInitPostRankData = "http://39.107.237.225:8001/stageRank/add";
    public static proInitPostRankData = "http://39.107.237.225:8001/stageRank/add";

    // 跨域请求图片前缀链接 完整链接请拼接 00a5484527414f4cb9e2ed6f54dc6ce4.png
    public static networkLink = "";
    public static devNetWorkLink = "http://192.168.0.77:8001/fileSearchServer/image/";
    public static demoNetWorkLink = "http://192.168.0.77:8001/fileSearchServer/image/";
    public static preNetWorkLink = "https://tt-game-js.oss-cn-beijing.aliyuncs.com/images/";
    public static proNetWorkLink = "https://tt-game.oss-cn-beijing.aliyuncs.com/images/";

    // 阿里云cdn服务器加速前缀地址
    // public static cdnImgPathPrefix = "http://h5cdn.ugcapp.com/resource/";
    // 阿里云cdn服务器加速后缀地址
    // public static cdnImgPathSuffix = ".png";

    // dev  => 20180702  0.1
    // demo => 20180702  0.1
    // pre  => 20180702  1.1
    // pro  => 20180702  1.1
    public static version = "2.55";

    /**
     *
     * 配置数据初始化
     *
     */
    public static init() {
        // 关卡数据连接初始化
        this.getUrl();
        // 获取微信用户信息url
        this.getWxUserInfoUrl();
        // h5登录连接
        this.getH5wxloginUrl();
        // 图片服务器前缀初始化
        this.getNetWorkLink();
        // 关卡排行榜信息初始化
        this.getFindStageRank();
        // 提交排行榜数据
        this.getInitPostRankData();
    }

    public static getInitPostRankData() {
        if (this.env == "dev") {
            this.initPostRankData = this.devInitPostRankData;
        }
        if (this.env == "demo") {
            this.initPostRankData = this.demoInitPostRankData;
        }
        if (this.env == "pre") {
            this.initPostRankData = this.preInitPostRankData;
        }
        if (this.env == "pro") {
            this.initPostRankData = this.proInitPostRankData;
        }
        return this.initPostRankData;
    }
    /**
     * 查询关卡排行榜信息
     */
    public static getFindStageRank() {
        if (this.env == "dev") {
            this.findStageRank = this.devfindStageRank;
        }
        if (this.env == "demo") {
            this.findStageRank = this.demofindStageRank;
        }
        if (this.env == "pre") {
            this.findStageRank = this.prefindStageRank;
        }
        if (this.env == "pro") {
            this.findStageRank = this.profindStageRank;
        }
        return this.findStageRank;
    }
    /**
     * h5 微信登录连接 只有线上和预发布环境可以请求
     */
    public static getH5wxloginUrl() {
        if (this.env == "dev") {
        }
        if (this.env == "demo") {
        }
        if (this.env == "pre") {
            this.h5wxloginUrl = ConfigConst.preH5wxloginUrl;
        }
        if (this.env == "pro") {
            this.h5wxloginUrl = ConfigConst.proH5wxloginUrl;
        }
        // let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        // url = url.replace("APPID",this.appId).replace("REDIRECT_URI",encodeURI(this.backUrl));
        // this.h5wxloginUrl = url;
        // console.info(this.h5wxloginUrl);
        return this.h5wxloginUrl;
    }
    /**
     * 获取图片服务器连接前缀
     * @returns {string}
     */
    public static getNetWorkLink() {
        if (this.env == "dev") {
            this.networkLink = ConfigConst.devNetWorkLink;
        }
        if (this.env == "demo") {
            this.networkLink = ConfigConst.demoNetWorkLink;
        }
        if (this.env == "pre") {
            this.networkLink = ConfigConst.preNetWorkLink;
        }
        if (this.env == "pro") {
            this.networkLink = ConfigConst.proNetWorkLink;
        }
        return this.networkLink;
    }

    public static getWxUserInfoUrl() {
        if (this.env == "pre") {
            this.wxUserInfoUrl = ConfigConst.preWxUserInfoUrl;
        }
        if (this.env == "pro") {
            this.wxUserInfoUrl = ConfigConst.proWxUserInfoUrl;
        }
        return this.wxUserInfoUrl;
    }

    /**
     * 获取关卡数据连接
     */
    public static getUrl () {
        this.url = "";
        if (this.env == "dev") {
            this.url = ConfigConst.devUrl;
        }
        if (this.env == "demo") {
            this.url = ConfigConst.demoUrl;
        }
        if (this.env == "pre") {
            this.url = ConfigConst.preUrl;
        }
        if (this.env == "pro") {
            this.url = ConfigConst.proUrl;
        }
        return this.url;
    }

}
