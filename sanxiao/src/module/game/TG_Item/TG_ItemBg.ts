/**
 * Created by ZhangHui on 2018/6/11.
 */
class TG_ItemBg extends TG_Item{
    /*深浅背景块*/
    public constructor(){
        super();
    }
    /*创建对象*/

    public Create(id){
        let str="gamePanel_Bg"+id;
        this.item=TG_Object.Create(str);
        this.addChild(this.item);


        this.initItemW_H();//初始化宽高
        return this.item;
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}