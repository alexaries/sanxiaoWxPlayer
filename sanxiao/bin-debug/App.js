var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by HuDe Zheng on 2018/6/28.
 */
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "MessageCenter", {
        /**
         * 服务器返回的消息处理中心
         * @type {MessageCenter}
         */
        get: function () {
            return MessageCenter.getInstance(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DebugUtils", {
        /**
         * 调试工具
         * @type {DebugUtils}
         */
        get: function () {
            return DebugUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TimerManager", {
        /**
         * 统一的计时器和帧刷管理类
         * @type {TimerManager}
         */
        get: function () {
            return TimerManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DeviceUtils", {
        /**
         * 设备工具类
         */
        get: function () {
            return DeviceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DisplayUtils", {
        /**
         * 显示对象工具类
         * @type {DisplayUtils}
         */
        get: function () {
            return DisplayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ControllerManager", {
        /**
         * 模块管理类
         * @type {ControllerManager}
         */
        get: function () {
            return ControllerManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SceneManager", {
        /**
         * 场景管理类
         * @type {SceneManager}
         */
        get: function () {
            return SceneManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EasyLoading", {
        /**
         * 通用Loading动画
         * @returns {any}
         * @constructor
         */
        get: function () {
            return EasyLoading.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        /**
         * 资源加载工具类
         */
        get: function () {
            return ResourceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ViewManager", {
        /**
         * View管理类
         * @type {ViewManager}
         */
        get: function () {
            return ViewManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "Http", {
        /**
         * Http请求
         * @type {Http}
         */
        get: function () {
            return Http.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageScaleMode", {
        /**
         *  舞台适配工具类
         * @returns {any}
         * @constructor
         */
        get: function () {
            return StageUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SoundManager", {
        /**
         * 获取音乐管理器
         */
        get: function () {
            return SoundManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "FiltersManager", {
        /**
        * RGB滤镜
        * */
        get: function () {
            return FiltersManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ArrayManager", {
        /*
        *  数组操作管理器
        *
        * */
        get: function () {
            return ArrayManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  初始化
     * @constructor
     */
    App.Init = function () {
        // console.log("当前引擎版本: ", egret.Capabilities.engineVersion);
        //开启调试模式
        App.DebugUtils.isOpen(false);
        App.Http.initServer("http://192.168.0.77:8091/h5Server/sendGame/getStageInfo", "0");
    };
    return App;
}());
__reflect(App.prototype, "App");
//# sourceMappingURL=App.js.map