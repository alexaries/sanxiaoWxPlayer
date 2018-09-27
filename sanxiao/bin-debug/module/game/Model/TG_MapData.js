var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by ZhangHui on 2018/6/4.
 */
var TG_MapData = (function () {
    function TG_MapData() {
        /*地图数据*/
        this.rowNum = 9; //行数
        this.colNum = 9; //列数
        // 棋盘数据图片名称数组
        this.stageDataImageArr = [];
        //xml地图配置表
        this.mapConfigData = {};
        // 要加载的本地图片数据
        this.mapConfigDataImage = {};
        // 二层块临时存放内存
        this.blocksDataTemp = [];
        // 需要加载的网络图片
        this.loadNetworkImage = [];
        // 用户头像服饰配置信息 map表
        this.userAvaterConfigXml = {};
        // 要加载的用户头像服饰配置图片
        this.userAvaterConfigImage = {};
        // 道具xml 配置表数据
        this.itemConfigXml = {};
        // 道具xml 配置表图片
        this.itemConfigImage = {};
    }
    TG_MapData.getInstance = function () {
        if (!this.tG_MapData) {
            this.tG_MapData = new TG_MapData();
        }
        return this.tG_MapData;
    };
    TG_MapData.prototype.initMapConfigData = function () {
        // Log.getInstance().trace("stageConfigXml .....", 0);
        var mapConfigXml = egret.XML.parse(RES.getRes("main.elementConfig_xml")); //stageConfigXml
        this.mapConfigDataFunBack(mapConfigXml);
        var itemConfigXml = egret.XML.parse(RES.getRes("main.itemConfig_xml")); //stageConfigXml
        this.itemConfigDataFunBack(itemConfigXml);
        var userAvaterConfigXml = egret.XML.parse(RES.getRes("Avater_xml")); // userAvaterConfigXml
        this.userAvaterConfigXmlFunBack(userAvaterConfigXml);
    };
    TG_MapData.prototype.itemConfigDataFunBack = function (e) {
        for (var i = 0; i < e.children.length; i++) {
            var id = 0;
            for (var j in e.children[i].attributes) {
                if (j == 'id') {
                    id = e.children[i].attributes[j];
                }
            }
            // 将xml中数据加载到mapConfigData中
            this.itemConfigXml[id] = e.children[i].attributes;
        }
        // Log.getInstance().trace("===============9999999999999999999999=======================",0);
        // Log.getInstance().trace(this.itemConfigXml,0);
        // 预加载用到图片
        for (var itemConfigIndex in this.itemConfigXml) {
            var itemConfig = this.itemConfigXml[itemConfigIndex];
            var itemimagepath = itemConfig.itemimagepath;
            var imageCnt = this.itemConfigImage[itemimagepath];
            if (imageCnt) {
                imageCnt++;
            }
            else {
                imageCnt = 1;
            }
            this.itemConfigImage[itemimagepath] = imageCnt;
        }
        // Log.getInstance().trace("===============9999999999999999999999=======================",0);
        // Log.getInstance().trace(this.itemConfigImage,0);
    };
    // 读取地图数据
    TG_MapData.prototype.mapConfigDataFunBack = function (e) {
        if (ConfigConst.env == "demo" || ConfigConst.env == "pre" || ConfigConst.env == "pro" || ConfigConst.env == "dev") {
            // Log.getInstance().trace("=======================");
            // Log.getInstance().trace(e.children.length,0);
            // 加载xml配置数据 并且  将所有图片的集合去重
            for (var i = 0; i < e.children.length; i++) {
                var layerid = 0;
                for (var j in e.children[i].attributes) {
                    if (j == 'layerid') {
                        layerid = e.children[i].attributes[j];
                        if (Number(layerid) == 1001) {
                            e.children[i].attributes["image"] = "item_groundMask";
                        }
                        // ### 替换配置中的所有网络图片
                        if (this.loadNetworkImage[layerid] && this.loadNetworkImage[layerid]["Texture"]) {
                            e.children[i].attributes["image"] = this.loadNetworkImage[layerid]["Texture"];
                        }
                    }
                }
                // 将xml中数据加载到mapConfigData中
                this.mapConfigData[layerid] = e.children[i].attributes;
            }
            // 预加载用到图片
            for (var config in this.mapConfigData) {
                var oneConfig = this.mapConfigData[config];
                var imageAttr = oneConfig.image;
                var imageCnt = this.mapConfigDataImage[imageAttr];
                if (imageCnt) {
                    imageCnt++;
                }
                else {
                    imageCnt = 1;
                }
                this.mapConfigDataImage[imageAttr] = imageCnt;
            }
        }
    };
    TG_MapData.prototype.userAvaterConfigXmlFunBack = function (e) {
        for (var i = 0; i < e.children.length; i++) {
            var id = 0;
            for (var j in e.children[i].attributes) {
                if (j == 'id') {
                    id = e.children[i].attributes[j];
                }
            }
            // 将xml中数据加载到mapConfigData中
            this.userAvaterConfigXml[id] = e.children[i].attributes;
        }
        // Log.getInstance().trace("===============33333=======================")
        // Log.getInstance().trace(this.userAvaterConfigXml, 0);
        // 预加载用到图片
        for (var userAvaterConfigIndex in this.userAvaterConfigXml) {
            var userAvaterConfig = this.userAvaterConfigXml[userAvaterConfigIndex];
            var iconName = userAvaterConfig.IconName;
            var imageCnt = this.userAvaterConfigImage[iconName];
            if (imageCnt) {
                imageCnt++;
            }
            else {
                imageCnt = 1;
            }
            this.userAvaterConfigImage[iconName] = imageCnt;
        }
        // Log.getInstance().trace("88888888888888888888");
        // Log.getInstance().trace(this.userAvaterConfigImage,0);
    };
    return TG_MapData;
}());
__reflect(TG_MapData.prototype, "TG_MapData");
//# sourceMappingURL=TG_MapData.js.map