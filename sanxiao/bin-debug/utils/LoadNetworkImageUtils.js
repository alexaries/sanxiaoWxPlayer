var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/7/18.
 */
var LoadNetworkImageUtils = (function () {
    function LoadNetworkImageUtils() {
    }
    /**
     * 加载网络图片
     * 将图片加载到组名为networkImage中
     */
    LoadNetworkImageUtils.loadImg = function () {
        var url_keys = [];
        var texture;
        // console.info(this.loadNetworkImage);
        for (var idIndex in this.loadNetworkImage) {
            texture = this.loadNetworkImage[idIndex]["Texture"];
            url_keys.push(this.prefix + texture + this.suffix);
            var data = { "name": this.prefix + texture + this.suffix, "type": "image", "url": ConfigConst.networkLink + texture + this.file_type };
            // console.log(data);
            RES.$addResourceData(data);
        }
        //加入头像和封面信息
        if (TG_Stage.TextureUrl.length > 0) {
            texture = TG_Stage.TextureUrl;
            var data = { "name": this.prefix + texture + this.suffix, "type": "image", "url": ConfigConst.networkLink + texture + this.file_type };
            RES.$addResourceData(data);
        }
        if (TG_Stage.Author["Avatar"].length > 0) {
            texture = TG_Stage.Author["Avatar"];
            var data = { "name": this.prefix + texture + this.suffix, "type": "image", "url": ConfigConst.networkLink + texture + this.file_type };
            RES.$addResourceData(data);
        }
        //创建分组
        RES.createGroup(this.groupName, url_keys);
    };
    /**
     * 网络资源loadNetworkImage中是否有 layerid
     */
    LoadNetworkImageUtils.hasLayerId = function (layerId) {
        for (var idIndex in this.loadNetworkImage) {
            if (layerId == Number(idIndex)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 根据layerId 获取 要加载的资源名
     */
    LoadNetworkImageUtils.getResNameByLayerId = function (layerId) {
        // console.info(layerId);
        var hasLayerId = this.hasLayerId(layerId);
        var img = "";
        if (hasLayerId) {
            var texture = this.loadNetworkImage[layerId]["Texture"];
            img = this.prefix + texture + this.suffix;
        }
        else {
            var layerIdStr = layerId;
            var obj = TG_MapData.getInstance().mapConfigData[layerIdStr];
            img = obj.image + this.suffix;
        }
        // Log.getInstance().trace(img, 0 );
        return img;
    };
    LoadNetworkImageUtils.getRandom_LayerId = function (layerId) {
        var new_layerid = layerId;
        var obj = TG_MapData.getInstance().mapConfigData[layerId];
        if (obj.name.indexOf("随机") != -1) {
            var setColorNumElement = TG_Stage.SetColorNumElement;
            var usedColorNumElement = [];
            do {
                var color = setColorNumElement[Math.floor(Math.random() * setColorNumElement.length)];
                if (TsList.contains(usedColorNumElement, color)) {
                    continue;
                }
                usedColorNumElement.push(color);
                new_layerid = Math.floor(new_layerid / 10) * 10 + color;
            } while (usedColorNumElement.length < setColorNumElement.length);
        }
        else {
            new_layerid = layerId;
        }
        return new_layerid;
    };
    // 要初始化加载的网路图片数据格式 [{Id: 2001, Texture: "1"},{Id: 2002, Texture: "2"},...]
    LoadNetworkImageUtils.loadNetworkImage = [];
    // 网络图片加载组
    LoadNetworkImageUtils.groupName = "networkImage";
    // 网络图片资源名前缀
    LoadNetworkImageUtils.prefix = "networkImage_";
    // 网络图片资源名后缀
    LoadNetworkImageUtils.suffix = "_png";
    // 网络图片资源类型
    LoadNetworkImageUtils.file_type = ".png";
    return LoadNetworkImageUtils;
}());
__reflect(LoadNetworkImageUtils.prototype, "LoadNetworkImageUtils");
//# sourceMappingURL=LoadNetworkImageUtils.js.map