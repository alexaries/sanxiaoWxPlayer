/**
 * Created by Administrator on 2018/6/28.
 * 栏杆数据层 第七层
 *
 */
class TG_ItemRailings extends TG_Item {
    public constructor(){
        super();
    }

    public Create(layerid,row =-1,col = -1){
        let layeridStr = layerid.toString();
        let obj=TG_MapData.getInstance().mapConfigData[layeridStr];
        let imageName=obj.image;
        let color=obj.color;
        this.itemType = obj.itemType;
        this.SetColorType(color);
        this.item=TG_Object.Create(LoadNetworkImageUtils.getResNameByLayerId(layerid));
        this.initItemW_H();//初始化宽高
        this.addChild(this.item);
        this.SetSitPos(col,row);
        this.SetBlockId(layerid);
        this.SetMarkedHor(0);
        this.SetMarkedVel(0);
        this.SetItemWidth(this.item.width);
        this.SetStopMoveMask(layerid);
        return this.item;
    }
    public SetStopMoveMask(id){
        this.StopMoveMask = id % 10;
    }
    /*检测阻碍某个方向是否的移动
    * <param name="direction"> 1-2-3-4 : 上-下-左-右</param>
    * */
    public StopMoveMask;
    public CheckStopMove(direction){
        if ((this.StopMoveMask >> (direction -1) & 0x01) == 1) {
            return true;
        }
        return false;
    }
    /*移除对象*/
    public Release(){
        if(this.item){
            this.StopMoveMask=0;
            TG_Object.Release(this.item);
            this.item=null;
        }
    }
}