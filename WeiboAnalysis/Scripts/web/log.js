
/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../template.js" />
/// <reference path="../SqlPager.js" />

var Logs = {
    sqlPageParam: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "../../Handler/OperatingLogHandler.ashx" },
    sqlParam: { "act": "getpagelist", "orderBy": " OperateTime DESC " },
    GetList: function () {
        var sp = new SqlPager(Logs.sqlPageParam);
        sp.Display = function (data) {

            var jsonData = data.data;
            $("#list_body_div").empty();
            var newdata = { "list": jsonData };
            var html = template.render('list_tempss', newdata);
            $("#list_body_div").append(html);
        }
        sp.LoadData(1, Logs.sqlParam);
    }
}
$(function () {
    Logs.GetList();
    HotWeiboUser.GetHotUser({}, null);
});