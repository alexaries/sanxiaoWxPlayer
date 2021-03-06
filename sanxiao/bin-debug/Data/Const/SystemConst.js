var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2018/6/19.
 */
var SystemConst = (function () {
    function SystemConst() {
    }
    /**
     * 在生产环境 和预发布环境临时使用 待所有功能开发完成将该功能移除
     * <span>判断layerId是否是已经开发完成的方块</span>
     *
     */
    SystemConst.isUsedblockLayerId = function (layerId) {
        var exists = TsList.contains(this.usedblockLayerIdArr, layerId);
        return exists;
    };
    /**
     * 获取根据某个layerId获取layerId
     * 如果为使用过的layerId, 直接返回
     * 如果为未使用的layerId 返回 -1；
     *
     */
    SystemConst.getUsedblockLayerId = function (layerId) {
        var exists = TsList.contains(this.usedblockLayerIdArr, layerId);
        if (!exists) {
            return -1;
        }
        return layerId;
    };
    /* 获取url参数 */
    SystemConst.urlParameters = [];
    /* 获取url链接 */
    SystemConst.urlLink = "";
    /**
     * 保存项目初始化要读取的xml配置文件
     */
    SystemConst.xmlConfigConst = [
        { "name": "stageConfigXml", "type": "xml", "url": "resource/assets/xml/main.elementConfig.xml" },
        { "name": "userAvaterConfigXml", "type": "xml", "url": "resource/assets/xml/main.Avater.xml" }
    ];
    /*
    * 项目中已经实现的方块layerId
    *
    */
    SystemConst.usedblockLayerIdArr = [
        // 爆炸后的填充块
        -1,
        // 空块
        1001,
        // 正常格
        1002,
        // 传染块(红) 传染块(绿) ---wg 2018-09-03
        1003, 1004,
        // 月饼坑
        1006,
        // 可以穿过的空块
        1005,
        // 普通1 2 3 4 5 6 随机
        2001, 2002, 2003, 2004, 2005, 2006, 2009,
        // 黑洞
        2098,
        // 横线特效1 2 3 4 5 6 随机
        2011, 2012, 2013, 2014, 2015, 2016, 2019,
        // 竖线特效1 2 3 4 5 6 随机
        2021, 2022, 2023, 2024, 2025, 2026, 2029,
        // 爆炸特效1 2 3 4 5 6 随机
        2031, 2032, 2033, 2034, 2035, 2036, 2039,
        // 风车特效1 2 3 4 5 6 随机
        2041, 2042, 2043, 2044, 2045, 2046, 2049,
        // 1层礼品盒 2层礼品盒 3层礼品盒 4层礼品盒 5层礼品盒 6层礼品盒 (雪块)
        2101, 2102, 2103, 2104, 2105, 2106,
        // 榛子（银币） 宝石块（钻石）
        2121, 2131,
        // 毒液
        2141,
        // 道具宝箱
        2201,
        // 上魔法石 1 2 3
        2301, 2317, 2318,
        // 下魔法石 1 2 3
        2302, 2319, 2320,
        // 左魔法石 1 2 3
        2303, 2321, 2322,
        // 右魔法石 1 2 3
        2304, 2323, 2324,
        // 鸡蛋块红 1 2 3
        2311, 2325, 2326,
        // 鸡蛋块蓝 1 2 3
        2312, 2327, 2328,
        // 鸡蛋块紫 1 2 3
        2313, 2329, 2330,
        // 鸡蛋块绿1 2 3
        2314, 2331, 2332,
        // 鸡蛋块黄1 2 3
        2315, 2333, 2334,
        // 鸡蛋块橙1 2 3
        2316, 2335, 2336,
        // 1层冰层 2层冰层 3层冰层 1层流沙
        3001, 3002, 3003, 3011,
        // 铁丝网
        4001,
        // 1层云层 2层云层
        5001, 5002,
        // 栏杆 上 下 左 右
        6001, 6002, 6004, 6008,
        // 浅色毛球 深色毛球
        7001, 7002,
        // 月饼
        2151,
        // 虫子
        // 8001,
        // 普通加步数  红 蓝 紫 绿 黄 橙 随机加步数
        2401, 2402, 2403, 2404, 2405, 2406, 2409,
        // 普通加时间  红 蓝 紫 绿 黄 橙 随机加时间
        2501, 2502, 2503, 2504, 2505, 2506, 2509,
        // 变色块 变色块1 变色块2 变色块3 变色块4 变色块5 变色块6
        2600, 2601, 2602, 2603, 2604, 2605, 2606,
        // 传送门 红 蓝 紫 绿 黄 橙 直 弯
        2340, 2341, 2342, 2343, 2344, 2345, 2346, 2347,
        // 正常格1 2
        10021, 10022,
        // 普通_bu 1 2 3 4 5 6
        // 20011,20021,20031,20041,20051,20061,
        // 普通_shi 1 2 3 4 5 6
        // 20012,20022,20032,20042,20052,20062,
        // 粽子1 2 3 4
        // 30091,30092,30093,30094,
        // groundMask h_tip v_tip nan1 none select bullet
        40001, 40002, 40003, 40004, 40005, 40006, 40007
    ];
    return SystemConst;
}());
__reflect(SystemConst.prototype, "SystemConst");
//# sourceMappingURL=SystemConst.js.map