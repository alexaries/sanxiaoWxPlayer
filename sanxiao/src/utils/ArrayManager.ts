/**
 * Created by ZhangHui on 2018/8/23.
 * Array 管理类
 */
class ArrayManager extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }
    /*从小到大*/
    public ArrayUp(arr){
        arr.sort(function (num1,num2) {
            return num1-num2;
        });
        return arr;
    }
    /*从大到小*/
    public ArrayDown(arr){
        arr.sort(function (num1,num2) {
            return num2-num1;
        });
        return arr;
    }
    /*从小到大 按照对象中字段值*/
    public ArrayUpItem(arr,item){
        function compare(property) {
            return function (a,b) {
                let value1=a[property];
                let value2=b[property];
                return value1-value2;
            }
        }
        arr.sort(compare(item));
        return arr;
    }
    /*从大到小 按照对象中字段值*/
    public ArrayDownItem(arr,item){
        function compare(property) {
            return function (a,b) {
                let value1=a[property];
                let value2=b[property];
                return value2-value1;
            }
        }
        arr.sort(compare(item));
        return arr;
    }
    /*删除一个元素*/
    public removeItem(num,arr){
        let index=this.getIndex(num,arr);
        if(index>-1){
            //数组中存在要删除元素
            arr.splice(index,1);
        }
        return arr;
    }
    /*查找元素的index*/
    public getIndex(num,arr){
        for(let i=0;i<arr.length;i++){
            if(arr[i]==num){
                return i;
            }
        }
        return -1;
    }
    /*数组去重*/
    public distinct(arr){
        let result=[];
        arr.forEach(function (v,i,arr) {
            let bool=arr.indexOf(v,i+1);
            if(bool===-1){
                result.push(v)
            }
        });
        return result;
    }
    /*
    * 深赋值拷贝数据
    * @param obj:当前数字、字符串、对象、数组 暂无问题
    * */
    public deepCopy(obj){
        let newObj=obj.constructor===Array?[]:{};//判断深拷贝是对象还是数组
        for(let i in obj){
            if(typeof obj[i]==='object'){
                // 如果要拷贝的对象的属性依然是个复合类型，继续递归
                newObj[i]=this.deepCopy(obj[i]);
            }else {
                newObj[i]=obj[i];
            }
        }
        return newObj;
    }


}