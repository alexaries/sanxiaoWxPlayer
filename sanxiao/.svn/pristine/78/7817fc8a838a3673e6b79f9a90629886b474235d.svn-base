/**
 * RGB管理类
 */
class FiltersManager extends BaseClass {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }
    public Setfilters(image, arr) {
        if (arr.length<3){
            return;
        }
        let red=Number(arr[0]);
        let green=Number(arr[1]);
        let blue=Number(arr[2]);
        let colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = red / 255;
        colorMatrix[6] = green/ 255;
        colorMatrix[12] = blue / 255;
        let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        image.filters = [colorFilter];
    }


}