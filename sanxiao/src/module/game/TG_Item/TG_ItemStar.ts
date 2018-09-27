/**
 * Created by ZhangHui on 2018/6/11.
 */
class TG_ItemStar extends TG_Item{
    /*单例 消除的星星*/
    private static tG_ItemStar:TG_ItemStar;
    public static getInstance(){
        if(!this.tG_ItemStar){
            this.tG_ItemStar=new TG_ItemStar();
        }
        return this.tG_ItemStar;
    }
    public Create(str){
        //str纹理
        this.item=TG_Object.Create(str);
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