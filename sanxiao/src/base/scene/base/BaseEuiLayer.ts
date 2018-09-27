/**
 * Created by HuDe Zheng on 2018/7/17.
 * EUI布局基类
 */
class BaseEuiLayer extends eui.Group {
    public constructor() {
        super();

        this.percentWidth = 100;
        this.percentHeight = 100;

        this.touchEnabled = false;
    }
}
