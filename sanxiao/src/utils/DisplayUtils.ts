/**
 * Created by Hu Dezheng on 2018/7/6.
 * 显示对象工具类
 */
class DisplayUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }
    /**
     * 从父级移除child
     * @param child
     */
    public removeFromParent(child:egret.DisplayObject) {
        if (child.parent == null)
            return;

        child.parent.removeChild(child);
    }
}
