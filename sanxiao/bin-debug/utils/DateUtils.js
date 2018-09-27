var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DateUtils = (function () {
    function DateUtils() {
    }
    /**
     * 根据时间戳获取对应字符串
     * @param timestamp
     */
    DateUtils.getDateByTimeStamp = function (timestamp) {
        var date = new Date(timestamp);
        return date;
    };
    /**
     * 根据时间获取时间戳
     * @param date
     */
    DateUtils.getTimeStampByDate = function (date) {
        var timeStamp = Date.parse(date.toISOString());
        return timeStamp;
    };
    /**
     * 时间转字符串格式时间工具类
     * @param date
     * @param fmt
     *
     * yyyy-MM-dd hh:mm:ss.S  2006-07-02 08:09:04.423
     * yyyy-MM-dd E HH:mm:ss  2009-03-10 二 20:09:04
     * yyyy-MM-dd EE hh:mm:ss 2009-03-10 周二 08:09:04
     * yyyy-MM-dd EEE hh:mm:ss 2009-03-10 星期二 08:09:04
     * yyyy-M-d h:m:s.S        2006-7-2 8:9:4.18
     *
     *
     * var date = new Date();
     * window.alert(date.format(date,"yyyy-MM-dd hh:mm:ss"));
     *
     */
    DateUtils.format = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    /**
     * 将时间字符串转日期
     * @param dateStr 时间日期字符串
     * @param fmt 时间日期字符串格式
     * 2018/05/19 07:06:01 == 》 Sat May 19 2018 07:06:01 GMT+0800 (中国标准时间)
     * 2018/05/19 22:40:09 == 》 Sat May 19 2018 22:40:09 GMT+0800 (中国标准时间)
     */
    DateUtils.prototype.parse = function (dateStr) {
        return new Date(Date.parse(dateStr.replace(/-/g, "/")));
    };
    return DateUtils;
}());
__reflect(DateUtils.prototype, "DateUtils");
//# sourceMappingURL=DateUtils.js.map