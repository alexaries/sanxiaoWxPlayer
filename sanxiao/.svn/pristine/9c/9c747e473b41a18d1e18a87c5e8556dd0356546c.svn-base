/**
 * Created by ZhangHui on 2018/7/10.
 */
class TG_Entry{
    /*柑橘blockId 查找整个obj*/
    public static GetEntryObj(blockId){
        let obj=TG_MapData.getInstance().mapConfigData[blockId];
        return obj;
    }
    /*根据blockId 查找xml中上下左右是否可以引爆*/
    public static GetEntry(blockId){
        let entry={
            detonateTop:false,
            detonateButtom:false,
            detonateLeft:false,
            detonateRight:false
        };
        let obj=TG_MapData.getInstance().mapConfigData[blockId].detonateDirection;
        let detonateDirectionArr=obj.split(",")
        entry.detonateTop = Number(detonateDirectionArr[0]) == 1;
        entry.detonateButtom = Number(detonateDirectionArr[1]) == 1;
        entry.detonateLeft =Number(detonateDirectionArr[2]) == 1;
        entry.detonateRight =Number(detonateDirectionArr[3]) == 1;
        return entry;
    }
    /*根据blockId 查找是否存在不提前结束的块 isAdvanceEnd*/
    public static GetEntryIsAdvanceEnd(blockId){
        let obj=TG_MapData.getInstance().mapConfigData[blockId];
        if(obj["isAdvanceEnd"]){
            return obj["isAdvanceEnd"];
        }else {
            return null;
        }
    }
    /*根据blockId 查找fatherElements*/
    public static GetEntryFatherElements(blockId){
        let obj=TG_MapData.getInstance().mapConfigData[blockId];
        let fatherElements=[];
        if(obj.fatherElement){
            let fatherElementEm=obj.fatherElement;
            let fatherElementArr = fatherElementEm.split(',');
            for (let blockIdStr of fatherElementArr){
                fatherElements.push(blockIdStr);
            }
        }
        return fatherElements;
    }


}