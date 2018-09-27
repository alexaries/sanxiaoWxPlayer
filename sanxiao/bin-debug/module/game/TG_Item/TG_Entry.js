var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/7/10.
 */
var TG_Entry = (function () {
    function TG_Entry() {
    }
    /*柑橘blockId 查找整个obj*/
    TG_Entry.GetEntryObj = function (blockId) {
        var obj = TG_MapData.getInstance().mapConfigData[blockId];
        return obj;
    };
    /*根据blockId 查找xml中上下左右是否可以引爆*/
    TG_Entry.GetEntry = function (blockId) {
        var entry = {
            detonateTop: false,
            detonateButtom: false,
            detonateLeft: false,
            detonateRight: false
        };
        var obj = TG_MapData.getInstance().mapConfigData[blockId].detonateDirection;
        var detonateDirectionArr = obj.split(",");
        entry.detonateTop = Number(detonateDirectionArr[0]) == 1;
        entry.detonateButtom = Number(detonateDirectionArr[1]) == 1;
        entry.detonateLeft = Number(detonateDirectionArr[2]) == 1;
        entry.detonateRight = Number(detonateDirectionArr[3]) == 1;
        return entry;
    };
    /*根据blockId 查找是否存在不提前结束的块 isAdvanceEnd*/
    TG_Entry.GetEntryIsAdvanceEnd = function (blockId) {
        var obj = TG_MapData.getInstance().mapConfigData[blockId];
        if (obj["isAdvanceEnd"]) {
            return obj["isAdvanceEnd"];
        }
        else {
            return null;
        }
    };
    /*根据blockId 查找fatherElements*/
    TG_Entry.GetEntryFatherElements = function (blockId) {
        var obj = TG_MapData.getInstance().mapConfigData[blockId];
        var fatherElements = [];
        if (obj.fatherElement) {
            var fatherElementEm = obj.fatherElement;
            var fatherElementArr = fatherElementEm.split(',');
            for (var _i = 0, fatherElementArr_1 = fatherElementArr; _i < fatherElementArr_1.length; _i++) {
                var blockIdStr = fatherElementArr_1[_i];
                fatherElements.push(blockIdStr);
            }
        }
        return fatherElements;
    };
    return TG_Entry;
}());
__reflect(TG_Entry.prototype, "TG_Entry");
//# sourceMappingURL=TG_Entry.js.map