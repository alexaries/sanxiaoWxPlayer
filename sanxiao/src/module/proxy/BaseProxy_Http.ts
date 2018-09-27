/**
 * Created by ZhangHui on 2018/6/5.
 */
import Logger = egret.Logger;

class BaseProxy_Http extends BaseProxy1{
    private static baseProxy_Http:BaseProxy_Http;
    public static getInstance(){
        if(!this.baseProxy_Http){
            this.baseProxy_Http=new BaseProxy_Http();
        }
        return this.baseProxy_Http;
    }
    public connectServer(){
        let env = ConfigConst.env;
        let urlParamArr = SystemConst.urlParameters;
        this.address = ConfigConst.url;
        let isTest = urlParamArr["IsTest"];
        let obj;
        if (isTest == "true") {// 如果有IsTest参数将自动创建测试数据
            env = "dev";
        } else {
            obj={
                "StageId":urlParamArr["StageId"]
            };
        }
        if(env=="dev"){
            BaseProxy_Http_Dev.createDevData();
        } else {
            // 开发测试环境 预发布环境 线上环境请求真实数据
            BaseProxy_Http.getInstance().getServiceInfo(this.address,obj,function (data) {
                App.MessageCenter.addListener(Msg.Event.RePlay,BaseProxy_Http.getInstance().connectServer,this);
                // 初始化收到的棋盘数据
                Log.getInstance().trace("初始化收到的棋盘数据");
                if (data.status == -1 || !data.result.Stage || !data.result.Stage.Blocks) {
                    Log.getInstance().trace("查询棋盘数据异常");
                    alert("查询棋盘数据异常");
                    TG_MapData.getInstance().stageData = data.result;
                    return;
                }
                data = data.result;
                // Log.getInstance().trace("1234567895451515");
                // console.info(data);
                if (env == "demo" || env == "pre" || env == "pro") {// 开发测试 预发布环境 线上环境
                    Log.getInstance().trace("=============== 测试 阿里 金山 网络图片读取并将图片存储到loadNetworkImage中 ===================");
                    let itemMotifs = data["Stage"]["ItemMotifs"];
                    // Log.getInstance().trace(itemMotifs,0);
                    for (let item in itemMotifs) {
                        let id = itemMotifs[item]["Id"];
                        let texture = itemMotifs[item]["Texture"];
                        // ###
                        // 将特殊的网络图片块加入loadNetworkImage中
                        if (texture.indexOf("item_") != 0) {
                            TG_MapData.getInstance().loadNetworkImage[id] = itemMotifs[item];
                        }
                    }
                    // TG_MapData.getInstance().loadNetworkImage;
                    // ### 将要加载的网络图片存储到加载组中
                    LoadNetworkImageUtils.loadNetworkImage = TG_MapData.getInstance().loadNetworkImage;
                    let allBlock = data["Stage"]["Blocks"];
                    for (let index in allBlock) {
                        let oneBlock = allBlock[index];
                        let oneBlockId1 = oneBlock["Id1"];
                        if (oneBlockId1 == -1) {
                            oneBlock["Id1"] = 1002;
                        }
                    }

                    // ====================== start 所有功能块开发完成后该部分将被移除 ================================
                    // 预发布环境 和 线上环境 对返回的数据进行处理
                    let Targets1 = data["Stage"]["Targets1"];
                    let Targets2 = data["Stage"]["Targets2"];
                    for (let index in Targets1) {
                        let isUsed = SystemConst.isUsedblockLayerId(Targets1[index]["Target"]);
                        if (!isUsed) {
                            // 2001 - 2006 中的一个块
                            Targets1[index]["Target"] = 2000+ Math.floor(Math.random() * 6) + 1;
                        }
                    }
                    for (let index in Targets2) {
                        let isUsed = SystemConst.isUsedblockLayerId(Targets2[index]["Target"]);
                        if (!isUsed) {
                            // 2001 - 2006 中的一个块
                            Targets2[index]["Target"] = 2000+ Math.floor(Math.random() * 6) + 1;
                        }
                    }

                    let dropBlocks = data["Stage"]["DropBlocks"];
                    if(dropBlocks)
                    {
                        for (let i = 0;i <dropBlocks.length;i++) {
                            for (let j = 0; j < dropBlocks[i]["DropIds"].length; j++)
                            {
                                let layerIdTemp = dropBlocks[i]["DropIds"][j];
                                let isUsed = SystemConst.isUsedblockLayerId(layerIdTemp);
                                // debugger;
                                if (!isUsed) {
                                    dropBlocks[i]["DropIds"][j] = 2009;
                                }
                            }
                        }
                    }
                    let blocks = data["Stage"]["Blocks"];
                    // Log.getInstance().trace(blocks, 0);
                    let layerIdTemp;
                    // if (env == "demo" ||env == "pre" || env == "pro") {
                    for (let index in blocks){
                        for (let i =1;i< 8;i++) {
                            // 判断是否在方块是否开发完毕
                            layerIdTemp = blocks[index]["Id"+i];
                            let isUsed = SystemConst.isUsedblockLayerId(layerIdTemp);
                            // debugger;
                            if (isUsed) {
                                // 开发完成的方块不处理
                                // console.log(layerIdTemp);
                            } else {
                                // console.log(isUsed+":"+layerIdTemp);
                                // 还未开发的方块，将其替换为已开发完成的方块
                                if (i == 1) {
                                    layerIdTemp = 1002;
                                }
                                if (i == 2) {
                                    layerIdTemp = 2009;
                                }
                                if (i == 3) {
                                    layerIdTemp = -1;
                                }
                                if (i == 4) {
                                    layerIdTemp = -1;
                                }
                                if (i == 5) {
                                    layerIdTemp = -1;
                                }
                                if (i == 6) {
                                    layerIdTemp = -1;
                                }
                                if (i == 7) {
                                    layerIdTemp = -1;
                                }
                                if (i == 8) {
                                    layerIdTemp = -1;
                                }
                            }
                            blocks[index]["Id"+i] = layerIdTemp;
                        }
                    }
                    // }
                    // ====================== end 所有功能块开发完成后该部分将被移除 ================================

                    // Log.getInstance().trace(blocks, 0);
                    TG_MapData.getInstance().beginStageData =BaseProxy_Http.deepCopy(data["Stage"]["Blocks"]);
                    // Log.getInstance().trace(data,0);
                    // Log.getInstance().trace(TG_MapData.getInstance().beginStageData, 0);
                    // data["Stage"]["Blocks_src"] = data["Stage"]["Blocks"];
                    let tmpBlocks = data["Stage"]["Blocks"];
                    TG_MapData.getInstance().blocksDataTemp = [];
                    for (let oneBlock in tmpBlocks) {
                        let oneBlockObj = tmpBlocks[oneBlock];
                        let rowNum = Math.floor(Number(oneBlock) / 9);
                        let colNum = Number(oneBlock) % 9;
                        let tempBlocks;
                        for (let oneElement in oneBlockObj) {
                            let oneElementObj = oneBlockObj[oneElement];
                            if (oneElement == "Id2") {
                                tempBlocks = new TG_Blocks();
                                tempBlocks.setLayerId(oneElementObj);
                                tempBlocks.setLayer(2);
                                tempBlocks.setRow(rowNum);
                                tempBlocks.setCol(colNum);
                                tempBlocks.setCellNum(Number(oneBlock));
                                let endNum = oneElementObj % 10;
                                if (endNum == 9 || endNum == 0) {
                                    tempBlocks.setIsRandom(1);
                                } else {
                                    tempBlocks.setIsRandom(0);
                                }
                                TG_MapData.getInstance().blocksDataTemp.push(tempBlocks);
                            }
                        }
                    }
                    // 棋盘预设数据颜色值
                    let setColorNumElement = data["Stage"]["SetColorNumElement"];
                    // 生成随机方块
                    TG_Game.getInstance().geneSpecByRandom(setColorNumElement);
                    // 将随机生成的方块放回Id2的对象中
                    Log.getInstance().trace("==将随机生成的方块放回Id2的对象中==");
                    let blocksDataTemp = TG_MapData.getInstance().blocksDataTemp;
                    for (let oneBlocks in blocksDataTemp) {
                        let oneElementBlocks = blocksDataTemp[oneBlocks];
                        let cellNum = oneElementBlocks.getCellNum();
                        let layerId = oneElementBlocks.getLayerId();
                        data["Stage"]["Blocks"][cellNum]["Id2"] = layerId;
                    }
                    TG_MapData.getInstance().stageData = data;
                    // 初始化TG_Stage 数据
                    TG_Stage.init();
                    App.MessageCenter.dispatch(Msg.Event.BeginGame);
                }
                App.MessageCenter.dispatch(Msg.Event.H5ServerDataInitComplete);
            });
        }
    }
    public static deepCopy(obj_src:any):any
    {
        let obj={};//用于最后返回一个对象，这个对象是深复制的结果
        for(let attr in obj_src){//遍历这个对象的每一个属性
            if(obj_src.hasOwnProperty(attr)){//主要是递归自有属性
                if(typeof obj_src[attr]==='object'){//如果对象的属性是一个对象，就递归复制它的每一个属性
                    if(obj_src[attr]===null){//如果对象为null
                        obj[attr]=null;
                    }else if(obj_src[attr] instanceof  Array){//如果是个数组
                        obj[attr]=[];
                        for(let i=0;i<obj_src[attr].length;i++){
                            obj[attr].push(BaseProxy_Http.deepCopy(obj_src[attr][i]));
                        }
                    }else{//object
                        obj[attr]=BaseProxy_Http.deepCopy(obj_src[attr]);
                    }
                }else{
                    obj[attr]=obj_src[attr];
                }
            }
        }
        return obj;
    }
    /*基础通信*/
    private getServiceInfo(url,data,backFun){
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        request.open(url,egret.HttpMethod.POST)
        Log.getInstance().trace("======发送的数据======");
        // console.info(JSON.stringify(data));
        request.send(JSON.stringify(data));
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete.bind(this,backFun),this);
    }
    private onGetComplete(backFun,event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        backFun(JSON.parse(request.response))
    }

}