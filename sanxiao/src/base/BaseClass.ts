/**
 * Created by HuDe Zheng on 2018/6/28.
 * 所有类的基类
 */
class BaseClass {

    /**
     * 返回该类对象的单例
     * 最多支持携带2个参数，如果需要，可以再进行扩展
     * */
    public static getInstance(...param:any[]):any
    {
        var Class:any = this;
        var len:number = param.length;

        if(!Class._instance)
        {
            if(len == 0)
                Class._instance = new Class();
            else if(len == 1)
                Class._instance = new Class(param[0]);
            else if(len == 2)
                Class._instance = new Class(param[0],param[1]);
        }
        return Class._instance;
    }
}