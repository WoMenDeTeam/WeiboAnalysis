$(document).ready(function() {
    Common.LoginEventFn = function() {        
        LeaderList.Init();
        LeaderList.InnitClickFn();
    }
    Common.CheckUser();
});
var _leaderlist = new Object;
var LeaderList = _leaderlist.property = {
    LSqlList: null,
    Search: function() {
        LeaderList.LSqlList.initData = { "page_size": 5, "result_id": "SearchResult", "status_bar_id": "PagerList", "post_url": "SqlSearch.ashx" };
        LeaderList.LSqlList.SqlQueryParams["action"] = "getleaderlist";
        LeaderList.LSqlList.SqlQueryParams["strorder"] = " PUSHTYPE DESC";
        var starttime = $.trim($("#time_str").val());
        if (starttime) {
            LeaderList.LSqlList.SqlQueryParams["time_str"] = starttime;
        } else {
            delete LeaderList.LSqlList.SqlQueryParams["time_str"];
        }
        //        if (LeaderList.LSqlList.SqlQueryParams["strwhere"]) {
        //            LeaderList.LSqlList.SqlQueryParams["strwhere"] += " AND PARENTCATE=226 AND ISEFFECT=1";
        //        } else {
        //            LeaderList.LSqlList.SqlQueryParams["strwhere"] = " PARENTCATE=226 AND ISEFFECT=1";
        //        }
        LeaderList.LSqlList.DisplayHtml = function(data, l_obj) {
            Common.DisplayHtml(data, l_obj, false);
        };
        LeaderList.LSqlList.Search();
    },
    InnitClickFn: function() {
        $("#btn_look_result").click(function() {
            LeaderList.Search();
        });
    },
    Init: function() {
        $.post("Handler/SqlSearch.ashx",
            { "action": "getleaderinfodate" },
            function(data) {
                if (data) {
                    $("#time_str").val(data["date"]);
                    LeaderList.LSqlList = new SqlList();
                    LeaderList.Search();
                }
            },
            "json"
        )

    }
}