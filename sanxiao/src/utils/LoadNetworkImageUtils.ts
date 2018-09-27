/**
 * Created by Administrator on 2018/7/18.
 */
class LoadNetworkImageUtils {
    // 要初始化加载的网路图片数据格式 [{Id: 2001, Texture: "1"},{Id: 2002, Texture: "2"},...]
    public static loadNetworkImage = [];
    // 网络图片加载组
    public static groupName = "networkImage";
    // 网络图片资源名前缀
    public static prefix = "networkImage_";
    // 网络图片资源名后缀
    public static suffix = "_png";
    // 网络图片资源类型
    public static file_type = ".png";

    /**
     * 加载网络图片
     * 将图片加载到组名为networkImage中
     */
    public static loadImg():void {
        let url_keys = [];
        let texture;
        // console.info(this.loadNetworkImage);
        for (let idIndex in this.loadNetworkImage) {
            texture = this.loadNetworkImage[idIndex]["Texture"];
            url_keys.push(this.prefix + texture + this.suffix);
            let data = {"name": this.prefix + texture + this.suffix,"type":"image","url": ConfigConst.networkLink + texture + this.file_type};
            // console.log(data);
            RES.$addResourceData(data);
        }


        //加入头像和封面信息
        if(TG_Stage.TextureUrl.length > 0)
        {
            texture = TG_Stage.TextureUrl;
            let data = {"name": this.prefix + texture + this.suffix,"type":"image","url": ConfigConst.networkLink + texture + this.file_type};
            RES.$addResourceData(data);
        }
        if(TG_Stage.Author["Avatar"].length > 0)
        {
            texture = TG_Stage.Author["Avatar"];
            let data = {"name": this.prefix + texture + this.suffix,"type":"image","url": ConfigConst.networkLink + texture + this.file_type};
            RES.$addResourceData(data);
        }
        //创建分组
        RES.createGroup(this.groupName,url_keys);

    }


    /**
     * 网络资源loadNetworkImage中是否有 layerid
     */
    private static hasLayerId(layerId:number):boolean {
        for (let idIndex in this.loadNetworkImage) {
            if (layerId == Number(idIndex)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据layerId 获取 要加载的资源名
     */
    public static getResNameByLayerId(layerId:number):string {
        // console.info(layerId);
        let hasLayerId = this.hasLayerId(layerId);
        let img = "";
        if (hasLayerId) {// 网络图片
            let texture = this.loadNetworkImage[layerId]["Texture"];
            img = this.prefix + texture + this.suffix;
        } else {// 本地图片
            let layerIdStr = layerId;
            let obj=TG_MapData.getInstance().mapConfigData[layerIdStr];
            img = obj.image + this.suffix;
        }
        // Log.getInstance().trace(img, 0 );
        return img;
    }
    public static getRandom_LayerId(layerId:number):number
    {
        let new_layerid = layerId;
        let obj=TG_MapData.getInstance().mapConfigData[layerId];
        if(obj.name.indexOf("随机") != -1) {
            let setColorNumElement = TG_Stage.SetColorNumElement;
            let usedColorNumElement = [];
            do {
                let color:number = setColorNumElement[Math.floor(Math.random() * setColorNumElement.length)];
                if (TsList.contains(usedColorNumElement,color)) {
                    continue;
                }
                usedColorNumElement.push(color);
                new_layerid= Math.floor(new_layerid/10) *10 +color;
            } while (usedColorNumElement.length <setColorNumElement.length);
        } else {
            new_layerid = layerId;
        }
        return new_layerid;
    }

}
