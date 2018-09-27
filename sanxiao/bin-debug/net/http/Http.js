var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * Http请求处理
 */
var Http = (function (_super) {
    __extends(Http, _super);
    /**
     * 构造函数
     */
    function Http() {
        return _super.call(this) || this;
    }
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    Http.prototype.initServer = function (serverUrl, method) {
        this._data = new DynamicChange();
        this._cache = [];
        this._request = new egret.URLRequest();
        this._isRequesting = false;
        if (method == "0") {
            this._request.method = egret.URLRequestMethod.GET;
        }
        if (method == "1") {
            this._request.method = egret.URLRequestMethod.POST;
        }
        this._request.requestHeaders = [
            // new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"),
            new egret.URLRequestHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"),
            new egret.URLRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"),
            new egret.URLRequestHeader("Access-Control-Max-Age", "3600"),
            new egret.URLRequestHeader("Access-Control-Allow-Origin", "*")
        ];
        this._urlLoader = new egret.URLLoader();
        this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        this._serverUrl = serverUrl;
    };
    Object.defineProperty(Http.prototype, "Data", {
        /**
         * 数据缓存
         * @returns {DynamicChange}
         * @constructor
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Http错误处理函数
     * @param e
     */
    Http.prototype.onError = function (e) {
        // this.nextPost();
        console.info("error");
        console.info(e.data);
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    Http.prototype.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.post();
    };
    /**
     * 请求服务器
     */
    Http.prototype.post = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        var type = arr[0];
        var urlVariables = arr[1];
        this._type = type;
        this._request.url = this._serverUrl;
        this._request.data = urlVariables;
        this._request.method = egret.URLRequestMethod.POST;
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
    };
    /**
     * 数据返回
     * @param event
     */
    Http.prototype.onLoaderComplete = function (event) {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            this._data.pUpdate.update(this._type, t_obj);
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.getInstance().trace("Http错误:" + t_obj["s"]);
        }
        // this.nextPost();
    };
    return Http;
}(BaseClass));
__reflect(Http.prototype, "Http");
//# sourceMappingURL=Http.js.map