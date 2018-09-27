/**
 * Created by HuDe Zheng on 2018/7/31.
 */

class DetailItem_itemView  extends eui.ItemRenderer
{
    public itemData:any;

    public url:string = "";
    public num:number = 0;

    public img_item1:eui.Image;
    public img_rect1:eui.Image;
    public des_txt1:eui.Label;


    public constructor()
    {
        super();
        this.skinName = "detailItem_item";
    }

    protected dataChanged():void
    {
        super.dataChanged();
        this.itemData = this.data;
        if(this.itemData)
        {
            this.num = parseInt(this.itemData.num);
            this.url = this.itemData.url;
            this.img_rect1.source = this.url;
            if(this.num > 0)
            {

                this.des_txt1.text = "x" + this.num;
            }
            else
            {
                this.des_txt1.text = "";
            }



        }
    }
}