/**
 * * Created by HuDe Zheng on 2017/02/24
 * Debug调试工具 用于计算函数或者消息的执行时间等
 * 调用方法 start 执行代码 stop
 */
class DebugUtils extends BaseClass {
    private _isOpen:boolean;
    private _startTimes:any;
    private _threshold:number = 3;

    public constructor() {
        super();
        this._startTimes = {};
    }

    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    public isOpen(flag:boolean):void {
        this._isOpen = flag;
    }

    /**
     * 是否是调试模式
     * @returns {boolean}
     */
    public get isDebug():boolean {
        return this._isOpen;
    }

    /**
     * 开始
     * @param key 标识
     *
     */
    public start(key:string):void {
        if (!this._isOpen) {
            return;
        }

        this._startTimes[key] = egret.getTimer();
    }

    /**
     * 停止
     *
     */
    public stop(key):number {
        if (!this._isOpen) {
            return 0;
        }

        if (!this._startTimes[key]) {
            return 0;
        }

        var cha:number = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Log.getInstance().trace(key + ": " + cha,0);
        }
        return cha;
    }

    /**
     * 设置时间间隔阈值
     * @param value
     */
    public setThreshold(value:number):void {
        this._threshold = value;
    }
}
