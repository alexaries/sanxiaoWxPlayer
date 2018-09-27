var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var JsonpReq = (function () {
    function JsonpReq() {
    }
    JsonpReq.process = function (url, callback, callobj) {
        JsonpReq.completeCall["call_" + JsonpReq._regID] = callback.bind(callobj);
        JsonpReq.startLoader(url, JsonpReq._regID++);
    };
    JsonpReq.startLoader = function (url, id) {
        var script = document.createElement('script');
        script.src = url + "JsonpReq.completeCall.call_" + id + "";
        document.body.appendChild(script);
    };
    JsonpReq._regID = 0;
    JsonpReq.completeCall = {};
    return JsonpReq;
}());
__reflect(JsonpReq.prototype, "JsonpReq");
//# sourceMappingURL=JsonpReq.js.map