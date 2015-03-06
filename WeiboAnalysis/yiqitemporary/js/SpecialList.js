$(document).ready(function() {
    Common.LoginEventFn = function(data) {
        SpecialList.LSqlList = new SqlList();
        //SpecialList.HotSqlList = new SqlList();
        SpecialList.Innit();
        //SpecialList.InnitHotEvent();
        SpecialList.InnitClickFn();
    }
    Common.CheckUser();
});

var _speciallist = new Object;
var SpecialList = _speciallist.property = {
    LSqlList: null,
    HotSqlList: null,
    Innit: function() {
        SpecialList.LSqlList.initData["page_size"] = 20;
        SpecialList.LSqlList.initData["diszhuanfatag"] = false;
        SpecialList.LSqlList.SqlQueryParams["action"] = "getspeciallist";
        SpecialList.LSqlList.SqlQueryParams["strorder"] = " EVENTDATE DESC";
        if (SpecialList.LSqlList.SqlQueryParams["strwhere"]) {
            SpecialList.LSqlList.SqlQueryParams["strwhere"] += " AND PARENTCATE=" + Config.ThemeParentCate + " AND ISEFFECT=1";
        } else {
            SpecialList.LSqlList.SqlQueryParams["strwhere"] = " PARENTCATE=" + Config.ThemeParentCate + " AND ISEFFECT=1";
        }
        SpecialList.LSqlList.DisplayHtml = function(data, l_obj) {
            SpecialList.DisplayHtml(data, l_obj, 30);
        };
        SpecialList.LSqlList.Search();
    },
    InnitHotEvent: function() {
        SpecialList.HotSqlList.initData = { "page_size": 15, "result_id": "hot_event_list", "status_bar_id": "ssss", "post_url": "SqlSearch.ashx" };
        SpecialList.HotSqlList.SqlQueryParams["action"] = "getspeciallist";
        SpecialList.HotSqlList.SqlQueryParams["strorder"] = " SEQUEUE";
        SpecialList.HotSqlList.DisplayHtml = function(data, l_obj) {
            SpecialList.DisplayHtml(data, l_obj, 16);
        };
        SpecialList.HotSqlList.Search();
    },
    DisplayHtml: function(data, l_obj, len) {
        if (parseInt(data["totalcount"]) > 0) {
            var entitylist = data["entitylist"];
            delete entitylist["SuccessCode"];
            var content = [];
            for (var item in entitylist) {
                var entity = entitylist[item];
                var id = entity["id"];
                var parentcate = entity["parentcate"];
                var categoryname = unescape(entity["categoryname"]);
                var discategoryname = categoryname.length > len ? categoryname.slice(0, len) + "..." : categoryname;
                var categoryid = entity["categoryid"];
                var eventdate = unescape(entity["eventdate"]);
                content.push("<li><a href=\"javascript:void(null);\" cate=\"" + entity["columnid"] + "\" title=\"" + categoryname + "\" pid=\"" + categoryid + "_" + parentcate + "_" + id + "\" name=\"" + categoryname + "\">");
                content.push("<span class=\"text\">" + discategoryname + "</span>");
                content.push("<span class=\"date\">" + eventdate + "</span></a></li>");
            }
            $("#" + l_obj.result_id).empty().html(content.join(""));
            $("#" + l_obj.result_id).find("a").click(function() {
                var tname = $(this).attr("name");
                var tid = $(this).attr("pid");
                var columnid = $(this).attr("cate");
                window.open("theme.html?id=" + tid + "&name=" + tname);
            });
        } else {
            $("#" + l_obj.result_id).empty().html("<li><center>对不起，没有数据。</center></li>");
        }
    },
    InnitClickFn: function() {
        $("#btn_look_result").click(function() {
            var strwhere = [];
            var starttime = $("#start_time").val();
            var endtime = $("#end_time").val();
            if (starttime) {
                strwhere.push(" EVENTDATE>=to_date('" + starttime + "','yyyy-MM-dd') AND");
            }
            if (endtime) {
                strwhere.push(" EVENTDATE<=to_date('" + endtime + "','yyyy-MM-dd') AND");
            }
            SpecialList.LSqlList.SqlQueryParams["strwhere"] = strwhere.join("").slice(0, -3);
            SpecialList.Innit();
        });
    }
}
