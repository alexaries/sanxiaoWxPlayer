/**
 * 有2个接口需要外部调用
 * start() 启动控制台
 * addLog() 添加日志
 * 1.2 版本信息显示
 * 1.3 输出派发事件---在总控制台得到每个人的日志
 * v 1.3
 */
var AH_tester=(function(){
    function AH_tester(){
        this.proId="X5";/*项目id*/
        this.c_version="1.0.0";/*当前版本号*/
        this.addPoint=1;/*版本坐标*/
        this.direction=1;/*竖横屏*/
        this.version_div;/*版本div*/
        this.content_div;/*内容div*/
        this._isAddContent=true;/*是否点击版本号显示日志版本内容*/
        this.versionType="demo";/*版本类型*/
        this.serverInfo="";/*服务器信息*/
        this.logInfoList=[];/*日志信息列表*/
        this.currentPage=0;/*当前页*/
        this.currLogType=-1;/*当前日志类型*/
        /*字体1*/
        this.fontSize1="25px";
        /*字体2*/
        this.fontSize2="10px";
        /*字体3*/
        this.fontSize3="9px";
        /*是否显示时间*/
        this._isAddTime=true;
        // this.version_info_url="http://www.xingtianji.com/h5/php/pro/game/version.php";
    }

    AH_tester.prototype = {
        /**
         * 启动测试器
         * proId 项目id  X1 C1 D1
         * cVersion 当前版本号码 0.0
         * point 号码显示位置[1-4]左上 左下 右上 右下
         * direction  1竖屏 2横屏左边 3横屏右边
         * _isAddContent 是否显示调试控制台 【日志输出，版本信息】
         * versionType 版本类型【demo #00cccc（日志不会上传） alpha  #fff release #00ff00】
         * serverInfo 服务器信息
         * */
        start:function(proId,v,point,direction,_isAddContent,versionType,serverInfo){
            /*显示logo*/
            this.addLogo();
            /*配置基础数据*/
            this.proId=proId;
            this.c_version=v;
            if(point)this.addPoint=point;
            if(direction)this.direction=direction;
            if(_isAddContent!=undefined)this._isAddContent=_isAddContent;
            if(versionType)this.versionType=versionType;
            if(serverInfo)this.serverInfo=serverInfo;
            /*显示版本号*/
            this.addVersion();

        },
        /**
         * 填充日志内容
         * str 内容 必须是字符串
         * type 类型（0表示错误类型 分类用到了）
         * userId  用户标识id (总控制台查询用到)
         * */
        addLog:function(str,type,color,userId){
            if(typeof str=="object"){
                this.traceObject(str,type,color,userId);
                return;
            }
            /*大于2万条自动清空*/
            if(this.logInfoList.length>3000)this.logInfoList=[];
            if(!this.userId&&userId)this.userId=userId;
            var arr=[type,str,new Date().getTime(),color];
            this.logInfoList.push(arr);
            /*实时显示*/
            if(this.content_div&&this.currentPage==0){
                this.addOneLog(this.currLogType,arr);
            }
            /*派发总控制台事件*/
            if(window&&window.dispatchEvent){
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('myConsoleTrace',true,true);
                evt.str=arr;
                window.dispatchEvent(evt);
                evt=null;
            }
        },
        /*显示版本号*/
        addVersion:function(){
            /*显示层*/
            this.version_div=document.createElement("div");
            document.body.appendChild(this.version_div);
            this.version_div.style.position="fixed";
            this.version_div.style.zIndex="990";
            /*坐标*/
            switch(this.addPoint){
                case 1:
                    // this.version_div.style.top="2px";
                    // this.version_div.style.left="2px";
                    this.version_div.style.top="40px";
                    this.version_div.style.left="5px";
                    break;
                case 2:
                    this.version_div.style.left="2px";
                    this.version_div.style.bottom="2px";
                    break;
                case 3:
                    this.version_div.style.right="5px";
                    this.version_div.style.top="5px";
                    break;
                default:
                    this.version_div.style.right="2px";
                    this.version_div.style.bottom="2px";
                    break;
            }
            this.version_div.style.fontSize="20px";
            this.version_div.style.fontFamily="微软雅黑";
            this.version_div.style.padding="2px";
            this.version_div.style.borderRadius="50%";
            switch(this.versionType){/*颜色区分版本类型*/
                case "demo":
                    this.version_div.style.color="#FF2D2D";
                    break;
                case "alpha":
                    this.version_div.style.color="#fff";
                    break;
                case "release":
                    this.version_div.style.color="#00cccc";
                    break;
                default:
                    this.version_div.style.color="#ff0000";
                    break;
            }
            this.version_div.style.background="rgba(255,255,255,0.1)";
            this.version_div.style.textAlign="center";
            this.version_div.style.height=this.version_div.style.width=this.version_div.style.lineHeight="40px";
            /*旋转*/
            switch(this.direction){
                case 2:
                    this.version_div.style.webkitTransform="rotate(90deg)";
                    break;
                case 3:
                    this.version_div.style.webkitTransform="rotate(-90deg)";
                    break;
                default:break;
            }
            this.version_div.innerHTML=this.c_version;
            if(this._isAddContent){
                this.version_div.addEventListener("click",this.addContent.bind(this));
                this.version_div.addEventListener("touchend",this.addContent.bind(this));
                /*捕获系统错误消息*/
                this.getError();
            }
        },
        /*显示控制台内容*/
        addContent:function(){
            if(this.content_div)return;
            /*显示层*/
            this.content_div=document.createElement("div");
            document.body.appendChild(this.content_div);
            this.content_div.style.position="fixed";
            this.content_div.style.zIndex="999";
            this.content_div.style.background="rgba(0,0,0,.3)";
            /*旋转*/
            switch(this.direction){
                case 2:
                    this.content_div.style.webkitTransform="rotate(90deg)";
                    break;
                case 3:
                    this.content_div.style.webkitTransform="rotate(-90deg)";
                    break;
                default:
                    break;
            }
            if(this.direction==1){
                this.content_div.style.width="100%";
                this.content_div.style.height="100%";
                this.content_div.style.top=0;
                this.content_div.style.left=0;
            }
            else{
                this.content_div.style.width=window.innerHeight+"px";
                this.content_div.style.height=window.innerWidth+"px";
                this.content_div.style.top=window.innerHeight/2-window.innerWidth/2+"px";
                this.content_div.style.left=window.innerWidth/2-window.innerHeight/2+"px";
            }
            this.content_div.style.padding="4%";
            this.content_div.style.webkitBoxSizing="border-box";
            /*显示内部内容*/
            var center_div=document.createElement("div");
            this.content_div.appendChild(center_div);
            center_div.style.height="100%";
            center_div.style.width="100%";
            center_div.style.position="relative";
            center_div.style.background="#E9EEF1";
            /*顶部按钮*/
            var ul=document.createElement("ul");
            ul.style.listStyle="none";
            ul.style.padding=0;
            ul.style.height="35px";
            ul.style.fontSize="15px";
            ul.style.lineHeight=ul.style.height;
            ul.style.textAlign="center";
            ul.style.margin=0;
            center_div.appendChild(ul);
            /*日志按钮*/
            var logBtn=this.addMenuBtn("日志","50%",false,btnClick1);
            ul.appendChild(logBtn);
            /*更多按钮*/
            var moreBtn=this.addMenuBtn("关闭","50%",true,closePage);
            ul.appendChild(moreBtn);
            /*内容区域*/
            this.contentInfoDiv=document.createElement("div");
            center_div.appendChild(this.contentInfoDiv);
            this.contentInfoDiv.style.width="96%";
            this.contentInfoDiv.style.marginLeft="2%";
            this.contentInfoDiv.style.marginTop="10px";
            this.contentInfoDiv.style.background="#ffffff";
            this.contentInfoDiv.style.height=center_div.offsetHeight-ul.offsetHeight-20+"px";
            this.contentInfoDiv.style.overflowY="scroll";
            this.contentInfoDiv.style.overflowX="hidden";
            this.contentInfoDiv.style.padding="5px";
            this.contentInfoDiv.style.webkitBoxSizing="border-box";
            this.contentInfoDiv.style.fontSize=this.fontSize2;
            /*更多按钮 操作区域*/
            var moveDiv=document.createElement("ul");
            moveDiv.style.width="20%";
            moveDiv.style.background="#2196F3";
            moveDiv.style.position="absolute";
            moveDiv.style.top=ul.style.height;
            moveDiv.style.right=0;
            moveDiv.style.listStyle="none";
            moveDiv.style.padding="0px";
            moveDiv.style.lineHeight=ul.style.height;
            moveDiv.style.textAlign="center";
            moveDiv.style.margin=0;
            moveDiv.style.webkitBoxSizing="border-box";
            center_div.appendChild(moveDiv);
            /*按钮点击事件*/
            var self=this;
            function btnClick(){
                logBtn.setType("");
                verInfoBtn.setType("");
            }
            /*输出日志*/
            function btnClick1(e){
                if(e.currentTarget.current)return;
                btnClick();
                e.currentTarget.setType("down");
                self.setPageInfo(0);
            }
            function closeMoreDiv(){
                moreBtn.current=false;
                moveDiv.style.display="none";
            }
            /*关闭页面*/
            function closePage(){
                self.closeContent();
            }
            /*清空输出日志页面*/
            function clearTraceLog(){
                self.logInfoList=[];
                if(self.currentPage==0){
                    self.addLogInfoList(self.currLogType);
                }
            }
            /*显示不同类型日志*/
            function addLog(e){
                var id=Number(e.currentTarget.id);
                if(self.currLogType==id)return;
                self.currLogType=id;
                if(self.currentPage==0){
                    logBtn.innerHTML="日志("+ e.currentTarget.innerHTML.split("日志")[0]+")";
                    self.addLogInfoList(self.currLogType);
                    closeMoreDiv();
                }
            }
            logBtn.setType("down");
            self.setPageInfo(this.currentPage);
            closeMoreDiv();
        },
        /*关闭控制台显示*/
        closeContent:function(){
            if(this.content_div){
                document.body.removeChild(this.content_div);
            }
            this.content_div=null;
        },
        /*实例化按钮*/
        addMenuBtn:function(str,w,border,btnClick){
            var btn=document.createElement("li");
            btn.style.width=w;
            btn.style.height="100%";
            btn.style.background="#2196F3";
            btn.style.float="left";
            btn.innerHTML=str;
            btn.style.webkitBoxSizing="border-box";
            btn.current=false;
            btn.setType=function(type){
                if(type=="down"){
                    btn.style.background="#E9EEF1";
                    btn.style.color="#888";
                    btn.current=true;
                }else{
                    btn.style.background="#2196F3";
                    btn.style.color="#fff";
                    btn.current=false;
                }
            }
            if(border) btn.style.borderLeft="1px solid #1976D2";
            btn.style.size=this.fontSize1;
            btn.setType("");
            btn.addEventListener("click",btnClick);
            return btn;
        },
        /*切换页面内容*/
        setPageInfo:function(id){
            this.currentPage=id;
            switch(id){
                case 0:/*日志页面*/
                    this.addLogInfoList(this.currLogType);
                    break;
                case 1:/*版本页面*/
                    this.addVersionInfo();
                    break;
                case 2:/*更多*/
                    break;
                default:
                    break;
            }
        },
        /*显示日志内容列表*/
        addLogInfoList:function(type){
            this.emptyDiv(this.contentInfoDiv);
            for(var i in this.logInfoList){
                this.addOneLog(type,this.logInfoList[i]);
            }
        },
        /*显示一条日志内容*/
        addOneLog:function(type,info){
             console.log(info)
            if(type==-1||(info[0]==type)){
                /*添加一条日志*/
                var str="<p style='word-wrap:break-word; word-break:normal;margin: 2px;'>",time;
                /*时间*/
                if(this._isAddTime){
                    var style1="";
                    if(type==-1)style1="color:"+info[3];
                    time="<span style='"+style1+"'>["+this.getTime(info[2])+" ~]</span>";
                    str+=time;
                }
                /*内容*/
                str+=" "+info[1]+"<br></p>";
                this.contentInfoDiv.innerHTML+=str;
            }
            /*拉到最底层*/
            this.contentInfoDiv.scrollTop=this.logInfoList.length*30;


        },
        /*显示历史版本内容*/
        addVersionInfo:function(){
            this.emptyDiv(this.contentInfoDiv);
            var self=this;
            if(!this.versionInfo){
                this.getServiceInfo(this.version_info_url,"proId="+this.proId,addList);
            }else{
                addList(this.versionInfo);
            }
            function addList(info){
                self.versionInfo=info;
                if(self.c_version!=info.nVId){
                    var tip=addLabel("p",{"color":"#ff0000","margin":"0","text-align":"center","width":"100%"});
                    tip.innerHTML="当前版本不是最新哒!";
                    self.contentInfoDiv.appendChild(tip);
                }
                var ul=addLabel("ul",{"list-style":"none","margin":"1rem 0 5rem 0"});
                self.contentInfoDiv.appendChild(ul);
                for(var i=info.vInfo.length-1;i>=0;i--){
                    var obj=info.vInfo[i];
                    var li=addLabel("li",{"width":"96%","padding":" 0 0 0 4%"});
                    ul.appendChild(li);
                    var topDiv=addLabel("div",{"height":"3.5rem"});
                    li.appendChild(topDiv);
                    /*圈*/
                    var quanDiv=addLabel("div",{"text-align":"center","color":"#888","float":"left","background":"#cacaca","width":"3.7rem","height":"3.7rem","border-radius":"50%"});
                    topDiv.appendChild(quanDiv);
                    if(obj.v==self.c_version){
                        quanDiv.style.background="#67C7BC";
                        quanDiv.style.color="#1c687b";
                    }
                    /*日期*/
                    var timeArr=obj.time.split("-");
                    var time1=addLabel("p",{"font-size":"1.1rem","margin":".9rem 0 0 0","line-height":"1.3rem"});
                    time1.innerHTML=(timeArr[1]+"-"+timeArr[2]);
                    quanDiv.appendChild(time1);
                    var time2=addLabel("p",{"font-size":".4rem","margin":"2px 0 0 0"});
                    time2.innerHTML=("-"+timeArr[0]+"-");
                    quanDiv.appendChild(time2);
                    var vStr=obj.v;
                    if(obj.name){
                        vStr=obj.v+" 【"+obj.name+"】";
                    }
                    /*右侧内容*/
                    var rightTitle=addLabel("p",{"float":"left","height":"3.5rem","line-height":"3.5rem","font-size":"1.5rem","margin":"0 0 0 1rem"});
                    rightTitle.innerHTML=vStr;
                    topDiv.appendChild(rightTitle);

                    /*底部内容*/
                    var section=addLabel("section",{"width":"75%","padding":"0 0 1rem 2.1rem","margin":"0 0 3px 1.75rem ","border-left":"3px solid #67C7BC","min-height":"3rem"});
                    li.appendChild(section);
                    var div=addLabel("div",{"background":"#eee","padding":".5rem .5rem .6rem .5rem"});
                    section.appendChild(div);
                    var p;
                    if(obj.add&&obj.add.length!=0){
                        var title_1=addLabel("p",{"font-size":"1rem","color":"#888","font-weight":"bold"});
                        title_1.innerHTML=("更新内容");
                        div.appendChild(title_1);
                        for(var s in obj.add){
                            p=addP(obj.add[s]);
                            div.appendChild(p);
                        }
                    }
                    if(obj.repair&&obj.repair.length!=0){;
                        var title_2=addLabel("p",{"font-size":"1rem","color":"#888","font-weight":"bold","margin-top":".5rem"});
                        title_2.innerHTML=("修改日志");
                        div.appendChild(title_2);
                        for(s in obj.repair){
                            p=addP(obj.repair[s]);
                            div.appendChild(p);
                        }
                    }

                }
                function addP(str){
                    p=addLabel("p",{"font-size":".8rem","color":"#aaa","line-height":"1.2rem"});
                    p.innerHTML=(str);
                    return p;
                }
                function addLabel(name,css){
                    var label=document.createElement(name);
                    for(var i in css){
                        label.style[i]=css[i];
                    }
                    return label;
                }
            }

        },
        /*清空div*/
        emptyDiv:function(div){
            while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
            {
                div.removeChild(div.firstChild);
            }
            div.innerHTML="";
        },
        /*获取当前时间 分和秒*/
        getTime:function(timestamp){
            if(timestamp){
                timestamp=new Date(timestamp);
                // var m=timestamp.getMinutes(); //获取当前分钟数(0-59)
                // m=m>9?m:("0"+m);
                // var s=timestamp.getSeconds(); //获取当前分钟数(0-59)
                // s=s>9?s:("0"+s);
                // return m+":"+s;
                var y = timestamp.getFullYear();
                var m = timestamp.getMonth()+1;
                m=m>9?m:("0"+m);
                var d = timestamp.getDate();
                d=d>d?d:("0"+d);
                var h = timestamp.getHours();
                h=h>9?h:("0"+h);
                var mm = timestamp.getMinutes();
                mm=mm>9?mm:("0"+mm);
                var s = timestamp.getSeconds();
                s=s>9?s:("0"+s);
                return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;





            }
            return "";
        },
        /*捕获系统异常错误*/
        getError:function(){
            /**
             * @param {String}  errorMessage   错误信息
             * @param {String}  scriptURI      出错的文件
             * @param {Long}    lineNumber     出错代码的行号
             * @param {Long}    columnNumber   出错代码的列号
             * @param {Object}  errorObj       错误的详细信息，Anything
             */
            var self=this,str;
            window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
                scriptURI=scriptURI.split("/");
                scriptURI=scriptURI[scriptURI.length-1];
                str="<span style='color: #cc0000'>"+errorMessage+"</span><p style='margin: 1px;text-decoration:underline;text-align: right;color: #cc0000;font-size: 9px;'>"+scriptURI+" ("+lineNumber+","+columnNumber+")</p>";
                self.addLog(str,0,"#cc0000",0);
            }
        },
        /*复杂日志输出*/
        traceObject:function(obj,type,color,userId){
            var self = this, num = 0;
            myWhile(obj, "[object]","");
            function log(str) {
                //console.log("%c" + str, "color:" + color);
                /**测试器
                 * 填充日志内容
                 * str 内容 必须是字符串
                 * type 类型（0表示错误类型 分类用到了）
                 * userId  用户标识id (总控制台查询用到)
                 * */
                str= str.replace(' ', '&nbsp');
                ah_tester.addLog(str,type,color,userId);
            }
            function myWhile(obj, name , str , _isArr) {
                log(str + (_isArr ? ("[") : (name + ":{")));
                for (var i in obj) {
                    if (num > 400) {
                        if (type != -1)
                            log("...小朋友输出超限了 ");
                        type = -1;
                        return;
                    }
                    if (typeof obj[i] == "object") {
                        myWhile(obj[i], i, str + "    ", obj[i] instanceof Array);
                    } else {
                        num += Number((obj[i]).toString().length);
                        log(str + "    " + (!_isArr ? (i + ":" + obj[i]) : (obj[i])));
                    }

                }
                log(str + (_isArr ? "]" : "}"));
            }

        },
        addLogo:function (){
            console.log("%c                          |    _ooOoo_    |", "color:#ffff00");
            console.log("%c                          |   o8888888o   |", "color:#ffff00");
            console.log('%c                          |   88" . "88   |', "color:#ffff00");
            console.log("%c                          |   (| -_- |)   |", "color:#00ff00");
            console.log("%c                          |    O\\ = /O    |", "color:#00ff00");
            console.log("%c                          |____/`---'\\____|", "color:#00ff00");
            console.log("%c                          | -____/\\____-  |", "color:#00ff00");
            console.log("%c                          |     __|__     |", "color:#ff0000");
            console.log("%c                          |      |n|      |", "color:#ff0000");
            console.log("%c                          |此    |o|    求|", "color:#ff0000");
            console.log("%c                          | 生   |b|   归 |", "color:#ff0000");
            console.log("%c                          |  徒  |u|  剑  |", "color:#ff0000");
            console.log("%c                          |    然|g|制    |", "color:#ff0000");
            console.log("%c                          .......\\/........", "color:#ff0000");
        },
        /*ajax*/
        getServiceInfo:function(url,data,backFun){
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 发送信息至服务器时内容编码类型
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                    if(obj.responseText){
                        data=JSON.parse(obj.responseText);
                        if(data&&data.state){
                            backFun(data.info);
                        }
                        console.log(data);
                    }
                }
            }
            obj.send(data);
        }
    }
    return AH_tester;
})();
var ah_tester=new AH_tester();