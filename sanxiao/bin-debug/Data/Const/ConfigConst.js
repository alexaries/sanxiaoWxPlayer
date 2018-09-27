/**
 * Created by Administrator on 2018/6/19.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ConfigConst = (function () {
    function ConfigConst() {
    }
    /**
     *
     * 配置数据初始化
     *
     */
    ConfigConst.init = function () {
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
    };
    ConfigConst.getInitPostRankData = function () {
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
    };
    /**
     * 查询关卡排行榜信息
     */
    ConfigConst.getFindStageRank = function () {
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
    };
    /**
     * h5 微信登录连接 只有线上和预发布环境可以请求
     */
    ConfigConst.getH5wxloginUrl = function () {
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
    };
    /**
     * 获取图片服务器连接前缀
     * @returns {string}
     */
    ConfigConst.getNetWorkLink = function () {
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
    };
    ConfigConst.getWxUserInfoUrl = function () {
        if (this.env == "pre") {
            this.wxUserInfoUrl = ConfigConst.preWxUserInfoUrl;
        }
        if (this.env == "pro") {
            this.wxUserInfoUrl = ConfigConst.proWxUserInfoUrl;
        }
        return this.wxUserInfoUrl;
    };
    /**
     * 获取关卡数据连接
     */
    ConfigConst.getUrl = function () {
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
    };
    //是否开启微信登录
    ConfigConst.open_wxLogin = false;
    // 开发环境:dev 测试环境demo 预发布环境pre 正式发布环境pro
    ConfigConst.env = "pro";
    // 关卡数据连接
    ConfigConst.url = "";
    ConfigConst.devUrl = "http://192.168.0.77:8091/h5Server/sendGame/getStageInfo";
    ConfigConst.demoUrl = "http://192.168.0.77:8091/h5Server/sendGame/getStageInfo";
    ConfigConst.preUrl = "http://120.92.210.53:8091/h5Server/sendGame/getStageInfo";
    ConfigConst.proUrl = "http://39.107.237.225:8093/h5Server/sendGame/getStageInfo";
    // 微信授权登录url
    ConfigConst.h5wxloginUrl = "";
    // public static devH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?abc=123&sType=1";
    // public static testH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize?abc=123&sType=1";
    ConfigConst.preH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize";
    ConfigConst.proH5wxloginUrl = "http://h5wxlogin.ugcapp.com/wxLogin/authorize";
    ConfigConst.appId = "wxcf772152e35e4086";
    ConfigConst.backUrl = "http://h5wxlogin.ugcapp.com/wxLogin/wxCallBack";
    // 获取微信用户信息url
    ConfigConst.wxUserInfoUrl = "";
    // public static devWxUserInfoUrl = "http://192.168.0.77:8001/wxLogin/getUserInfo";
    // public static testWxUserInfoUrl = "http://192.168.0.77:8001/wxLogin/getUserInfo";
    ConfigConst.preWxUserInfoUrl = "http://39.107.237.225:8001/wxLogin/getWxUserInfo";
    ConfigConst.proWxUserInfoUrl = "http://39.107.237.225:8001/wxLogin/getWxUserInfo";
    // 查询关卡排行榜信息
    ConfigConst.findStageRank = "";
    ConfigConst.devfindStageRank = "http://192.168.0.77:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    ConfigConst.demofindStageRank = "http://192.168.0.77:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    ConfigConst.prefindStageRank = "http://39.107.237.225:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    ConfigConst.profindStageRank = "http://39.107.237.225:8001/stageRank/findStageRank/stageId/${STAGEID}/playerId/${PLAYERID}";
    // 提交排行榜数据
    ConfigConst.initPostRankData = "";
    ConfigConst.devInitPostRankData = "http://192.168.0.77:8001/stageRank/add";
    ConfigConst.demoInitPostRankData = "http://192.168.0.77:8001/stageRank/add";
    ConfigConst.preInitPostRankData = "http://39.107.237.225:8001/stageRank/add";
    ConfigConst.proInitPostRankData = "http://39.107.237.225:8001/stageRank/add";
    // 跨域请求图片前缀链接 完整链接请拼接 00a5484527414f4cb9e2ed6f54dc6ce4.png
    ConfigConst.networkLink = "";
    ConfigConst.devNetWorkLink = "http://192.168.0.77:8001/fileSearchServer/image/";
    ConfigConst.demoNetWorkLink = "http://192.168.0.77:8001/fileSearchServer/image/";
    ConfigConst.preNetWorkLink = "https://tt-game-js.oss-cn-beijing.aliyuncs.com/images/";
    ConfigConst.proNetWorkLink = "https://tt-game.oss-cn-beijing.aliyuncs.com/images/";
    // 阿里云cdn服务器加速前缀地址
    // public static cdnImgPathPrefix = "http://h5cdn.ugcapp.com/resource/";
    // 阿里云cdn服务器加速后缀地址
    // public static cdnImgPathSuffix = ".png";
    // dev  => 20180702  0.1
    // demo => 20180702  0.1
    // pre  => 20180702  1.1
    // pro  => 20180702  1.1
    ConfigConst.version = "2.55";
    return ConfigConst;
}());
__reflect(ConfigConst.prototype, "ConfigConst");
//# sourceMappingURL=ConfigConst.js.map