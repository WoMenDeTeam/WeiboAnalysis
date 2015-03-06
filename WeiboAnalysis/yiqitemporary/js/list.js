$(document).ready(function() {
    Common.LoginEventFn = function() {
        List.Init();
    }
    Common.CheckUser();
});
var _list = new Object;
var List = _list.prototype = {
    initData: { "page_size": 5, "result_id": "SearchResult", "status_bar_id": "PagerList" },
    CommanQuery: { "action": "query", "display_style": 6, "sort": "Date"},
    Init: function() {
        var statematchid = $.query.get('statematchid');
        var keyword = $.query.get('keyword');
        if (statematchid) {
            this.CommanQuery["statematchid"] = statematchid;
            this.CommanQuery["text"] = encodeURI(keyword);
            var Lpager = new Pager(this.initData);
            Lpager.Display = function(data, l_obj) {
                Common.DisplayHtml(data, l_obj);
            };
            Lpager.LoadData(1, this.CommanQuery);
        }
    }
}