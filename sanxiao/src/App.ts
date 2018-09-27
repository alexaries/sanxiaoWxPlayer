/**
 * Created by HuDe Zheng on 2018/6/28.
 */
class App {

    /**
     * 服务器返回的消息处理中心
     * @type {MessageCenter}
     */
    public static get MessageCenter(): MessageCenter {
        return MessageCenter.getInstance(0);
    }
    /**
     * 调试工具
     * @type {DebugUtils}
     */
    public static get DebugUtils(): DebugUtils {
        return DebugUtils.getInstance();
    }
    /**
     * 统一的计时器和帧刷管理类
     * @type {TimerManager}
     */
    public static get TimerManager(): TimerManager {
        return TimerManager.getInstance();
    }
    /**
     * 设备工具类
     */
    public static get DeviceUtils(): DeviceUtils {
        return DeviceUtils.getInstance();
    }
    /**
     * 显示对象工具类
     * @type {DisplayUtils}
     */
    public static get DisplayUtils(): DisplayUtils {
        return DisplayUtils.getInstance();
    }
    /**
     * 模块管理类
     * @type {ControllerManager}
     */
    public static get ControllerManager(): ControllerManager {
        return ControllerManager.getInstance();
    }

    /**
     * 场景管理类
     * @type {SceneManager}
     */
    public static get SceneManager(): SceneManager {
        return SceneManager.getInstance();
    }
    /**
     * 通用Loading动画
     * @returns {any}
     * @constructor
     */
    public static get EasyLoading(): EasyLoading {
        return EasyLoading.getInstance();
    }
    /**
     * 资源加载工具类
     */
    public static get ResourceUtils(): ResourceUtils {
        return ResourceUtils.getInstance();
    }
    /**
     * View管理类
     * @type {ViewManager}
     */
    public static get ViewManager(): ViewManager {
        return ViewManager.getInstance();
    }
    /**
     * Http请求
     * @type {Http}
     */
    public static get Http(): Http {
        return Http.getInstance();
    }
    /**
     *  舞台适配工具类
     * @returns {any}
     * @constructor
     */
    public static get StageScaleMode():StageUtils
    {
        return StageUtils.getInstance();
    }
    /**
     * 获取音乐管理器
     */
    public static get SoundManager():SoundManager
    {
        return SoundManager.getInstance();
    }
    /**
    * RGB滤镜
    * */
    public static get FiltersManager():FiltersManager
    {
        return FiltersManager.getInstance();
    }
    /*
    *  数组操作管理器
    *
    * */
    public static get ArrayManager():ArrayManager
    {
        return ArrayManager.getInstance();
    }
    /**
     *  初始化
     * @constructor
     */
    public static Init(): void {
        // console.log("当前引擎版本: ", egret.Capabilities.engineVersion);
        //开启调试模式
        App.DebugUtils.isOpen(false);
        App.Http.initServer("http://192.168.0.77:8091/h5Server/sendGame/getStageInfo","0");

    }
}