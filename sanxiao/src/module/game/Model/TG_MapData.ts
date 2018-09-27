/**
 * Created by ZhangHui on 2018/6/4.
 */
class TG_MapData{
    /*单例*/
    private static tG_MapData:TG_MapData;
    public static getInstance(){
        if(!this.tG_MapData){
            this.tG_MapData=new TG_MapData();
        }
        return this.tG_MapData;
    }
    /*地图数据*/
    public rowNum=9;//行数
    public colNum=9;//列数
    // 棋盘初始数据
    public beginStageData;
    // 棋盘数据
    public stageData;
    // 棋盘数据图片名称数组
    public stageDataImageArr=[];
    //xml地图配置表
    public mapConfigData={};
    // 要加载的本地图片数据
    public mapConfigDataImage={};
    // 二层块临时存放内存
    public blocksDataTemp = [];
    // 需要加载的网络图片
    public loadNetworkImage = [];
    // 用户头像服饰配置信息 map表
    public userAvaterConfigXml = {};
    // 要加载的用户头像服饰配置图片
    public userAvaterConfigImage = {};
    // 道具xml 配置表数据
    public itemConfigXml = {};
    // 道具xml 配置表图片
    public itemConfigImage = {};
    public initMapConfigData(){
        // Log.getInstance().trace("stageConfigXml .....", 0);
        let mapConfigXml:egret.XML = egret.XML.parse(RES.getRes("main.elementConfig_xml"));//stageConfigXml
        this.mapConfigDataFunBack(mapConfigXml);
        let itemConfigXml:egret.XML = egret.XML.parse(RES.getRes("main.itemConfig_xml"));//stageConfigXml
        this.itemConfigDataFunBack(itemConfigXml);
        let userAvaterConfigXml:egret.XML = egret.XML.parse(RES.getRes("Avater_xml"));// userAvaterConfigXml
        this.userAvaterConfigXmlFunBack(userAvaterConfigXml);
    }
    private itemConfigDataFunBack(e:any):void {
        for(let i=0;i<e.children.length;i++) {
            let id = 0;
            for (let j in e.children[i].attributes) {
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
        for (let itemConfigIndex in this.itemConfigXml) {
            let itemConfig = this.itemConfigXml[itemConfigIndex];
            let itemimagepath = itemConfig.itemimagepath;
            let imageCnt = this.itemConfigImage[itemimagepath];
            if (imageCnt) {
                imageCnt ++;
            } else {
                imageCnt = 1;
            }
            this.itemConfigImage[itemimagepath] = imageCnt;
        }
        // Log.getInstance().trace("===============9999999999999999999999=======================",0);
        // Log.getInstance().trace(this.itemConfigImage,0);
    }
    // 读取地图数据
    private mapConfigDataFunBack(e:any):void {
        if(ConfigConst.env == "demo" || ConfigConst.env=="pre" || ConfigConst.env=="pro"||ConfigConst.env=="dev") {// 开发环境 测试环境 预发布环境 线上环境
            // Log.getInstance().trace("=======================");
            // Log.getInstance().trace(e.children.length,0);
            // 加载xml配置数据 并且  将所有图片的集合去重
            for(let i=0;i<e.children.length;i++) {
                let layerid = 0;
                for (let j in e.children[i].attributes) {
                    if (j == 'layerid') {
                        layerid = e.children[i].attributes[j];
                        if(Number(layerid)==1001){
                            e.children[i].attributes["image"]="item_groundMask";
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
            for (let config in this.mapConfigData) {
                let oneConfig = this.mapConfigData[config];
                let imageAttr = oneConfig.image;
                let imageCnt = this.mapConfigDataImage[imageAttr];
                if (imageCnt) {
                    imageCnt ++;
                } else {
                    imageCnt = 1;
                }
                this.mapConfigDataImage[imageAttr] = imageCnt;
            }
        }
    }

    private userAvaterConfigXmlFunBack(e:any):void {
        for(let i=0;i<e.children.length;i++) {
            let id = 0;
            for (let j in e.children[i].attributes) {
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
        for (let userAvaterConfigIndex in this.userAvaterConfigXml) {
            let userAvaterConfig = this.userAvaterConfigXml[userAvaterConfigIndex];
            let iconName = userAvaterConfig.IconName;
            let imageCnt = this.userAvaterConfigImage[iconName];
            if (imageCnt) {
                imageCnt ++;
            } else {
                imageCnt = 1;
            }
            this.userAvaterConfigImage[iconName] = imageCnt;
        }
        // Log.getInstance().trace("88888888888888888888");
        // Log.getInstance().trace(this.userAvaterConfigImage,0);
    }













}