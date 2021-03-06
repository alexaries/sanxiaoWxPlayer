/** 道具显示类 新
 *
 * Created by HuDe Zheng on 2018/8/10.
 */
class PropNewView extends BaseEuiView
{
    public itemWidth:number = 0;

    public bgImg:eui.Image;

    public constructor(controller:BaseController, parent:eui.Group)
    {
        super(controller, parent);
        this.skinName = "propNewUI";
        this.cacheAsBitmap = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseBegin,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.mouseEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
    }
    public mouseBeginX:number = 0;

    public move:boolean = false;
    public mouseBegin(e:egret.TouchEvent)
    {
        this.mouseBeginX = e.stageX;
        this.move = true;
    }
    public mouseMove(e:egret.TouchEvent)
    {
        if(!this.move) return;
        let temp = this.mouseBeginX - e.stageX;
        let moveWidth:number = 20;
        if(Math.abs(temp) > 80)
        {
            moveWidth = 20;
        }
        else
        {
            moveWidth = temp;
        }

        for (let i = 0; i < PropNewView.itemList.length; i++) {
            let item =PropNewView.itemList[i];
            if(temp > 0 )
            {
                if(i == 0) {
                    if (item.x - moveWidth < -560)
                    {
                        this.move = false;
                        return;
                    }
                    else
                    {
                        //向左
                        item.x -= Math.abs(moveWidth);
                    }
                }
                else
                {
                    //向左
                    item.x -= Math.abs(moveWidth);
                }
            }
            else
            {
                if(i == 0) {
                    if (item.x + Math.abs(moveWidth) > this.kong) {
                        this.move = false;
                        return;
                    }
                    else
                    {
                        //向右
                        item.x += Math.abs(moveWidth);
                    }
                }
                else
                {
                    //向右
                    item.x += Math.abs(moveWidth);
                }
            }
        }

        this.OnDragRound();
        this.mouseBeginX = e.stageX;
    }
    public mouseEnd(e:egret.TouchEvent)
    {
        this.move = false;
    }


    /**
     *  道具数量变化
     * @param propId 道具id
     * @param type 0减 1加
     * @param num 变化数量
     */
    public useProp(propId:number,type:number = 0,num:number = 1)
    {
        for (let i = 0; i < PropNewView.itemList.length; i++) {
            let item =PropNewView.itemList[i];
            if(item.type == propId)
            {
                item.refreshData(num,type);
                //先排序
                this.handleProps();
                this.OnDragRound();
                return;
            }
        }

    }
    private fitPanel:egret.DisplayObject;

    public thisHeight:number = 0;
    public open(...param:any[]):void {
        super.open(param);

        if(param.length >0)
        {
            this.fitPanel = param[0];
        }
        this.initData1();
        if(this.thisHeight == 0)
        {
            this.thisHeight = this.height
        }
        this.y = Main.stageHeight - this.thisHeight+ 80;
        this.bgImg.y = this.thisHeight - 200;
        let px:number = (Main.stageWidth - 1080)/2;

        this.bgImg.x = -px;
        this.bgImg.width = Main.stageWidth;

    }
    private listData_src:Array<any> = [];
    public static itemList:Array<PropNewItem> = [];
    public item_num:number = 0;

    public initData1()
    {

        this.item_num = 0;
        PropNewView.itemList=[];
        if( PropNewView.itemList.length == 0)
        {
            for(let i = 0;i < 10;i++) {

                this["item" + (i+1)].visible = false;

            }
        }
        this.listData_src = [];
        this.baseXList=[];
        let items = TG_Stage.Items;
        let img  = ConfigGameData.getInstance().PropImage;
        //当前是什么模式
        let mode_type = 0;
        let ti_arr:Array<number> = [];

        for(let types in img)
        {
            if(TG_Stage.IsTimeLimit)//是否有时间限制
            {
                if(parseInt(types) == 7 || parseInt(types) == 8)
                    continue;
            }
            else if(TG_Stage.IsStepLimit)//是否有回合限制
            {
                if(parseInt(types) == 9 || parseInt(types) == 10)
                    continue;
            }

           PropNewView.itemList.push(this["item" + (parseInt(types))]);
            let obj1:any = img[types];
            let num = this.getItems(items,parseInt(types));

            let item: PropNewItem =PropNewView.itemList[PropNewView.itemList.length - 1];
            item.type = parseInt(types);
            item.num = num;

             item.refreshData2();//刷新状态
            item.visible = true;
            item.numTex.text = "免费" + num.toString();
            item.propImg.source = obj1;
            if(num <= 0)
            {
                item.title.visible = false;
                item.hs();
            }
            this.listData_src.push({"rect":"","img":obj1,"num":num,"type":types});
            item.index = this.item_num;
            // item.currentIndex=this.item_num;

            item.x = this.item_num * (this.cellHeight + 27) + this.kong;
            // console.log(types+"++++"+item.x)
            this.baseXList.push(item.x);
            item.y = 0;
            this.itemWidth += item.width;
            this.item_num++;
        }
        //中心点坐标
        this.center =  (1080 - this.kong*2)/2;
        //先排序
        this.handleProps();    
        this.OnDragRound();
    }
    public close(...param:any[]):void{
        super.close(param);
    }
    public kong:number = 50;
    public cellHeight:number = 176;
    private center:number = 0

    private conX:number =0;
    private conY:number = 500;

    /*根据道具数量排序*/
    private baseXList=[];
    public handleProps(){
        let baseArr=[0,1,2,3,4,5,6,7];
        //首先按照正常的道具顺序排序
        let itemList=[];
        for(let i=0;i<baseArr.length;i++){
            for(let j=0;j<PropNewView.itemList.length;j++){
                if(PropNewView.itemList[j].index==baseArr[i]){
                    PropNewView.itemList[j].currentIndex=PropNewView.itemList[j].index;
                    PropNewView.itemList[j].x=this.baseXList[i];
                    itemList.push(PropNewView.itemList[j]);
                }
            }
        }
        //数量不为0的道具，找到之前第一个数量为0的道具 交换currentIndex
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].num>0){
                for(let j=0;j<i+1;j++){
                    if(itemList[j].num==0){
                        let temp1=itemList[i];
                        let temp2=itemList[j];
                        let index1=temp1.index;
                        let index2=temp2.index;
                        let x1=temp1.x;
                        let x2=temp2.x;
                        itemList[i]=temp2;
                        itemList[j]=temp1;
                        itemList[i].x=x1;
                        itemList[j].x=x2;
                        itemList[i].currentIndex=index1;
                        itemList[j].currentIndex=index2;
                    }
                }
            }
        }
        //根据currentIndex进行排序
        PropNewView.itemList=App.ArrayManager.ArrayUpItem(itemList,"currentIndex");
    }
    public OnDragRound(){
        let ballRadius = this.cellHeight/2;
        this.baseXList=[];
        for (let i = 0; i < PropNewView.itemList.length; i++)
        {
            let item =PropNewView.itemList[i];
            let index = item.index;

            if(item.x <= this.center)
            {
                let yy =  ((this.center - item.x) / this.center);
                yy = yy * 60;
                 item.y = yy;
            }
            else
            {
                let yy =  Math.abs((this.center - item.x) / this.center)+0.1;
                yy = yy * 60;
                 item.y = yy;
            }
            this.baseXList.push(item.x)
            // console.log("&&&&&");
            // console.log(item.index+"++++"+item.x)
        }
    }

    public getItems(arr:Array<any>,id:number)
    {
        for(let i = 0;i < arr.length;i ++)
        {
            if(id == arr[i]["id"])
            {
                return arr[i]["num"];
            }
        }
        return 0;
    }

}