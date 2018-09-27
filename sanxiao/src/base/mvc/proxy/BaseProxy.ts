/**
 * Created by HuDe Zheng on 2018/7/9.
 */
class BaseProxy extends BaseClass
{
    public _controller:BaseController;
    public constructor(_controller:BaseController)
    {
        super();

        this._controller = _controller;
    }
}