$(document).ready(function() {
    Common.LoginEventFn = function(data) {
        Ylfl.LSqlList = new SqlList();        
        Ylfl.Innit();       
    }
    Common.CheckUser();
});

var _ylfl = new Object;
var Ylfl = _ylfl.property = {
    LSqlList: null,
    Innit: function() {
        Ylfl.LSqlList.initData = { "page_size": 30, "result_id": "SearchResult", "status_bar_id": "PagerList",
            "post_url": "SqlSearch.ashx", "diszhuanfatag": false
        };
        Ylfl.LSqlList.SqlQueryParams["action"] = "getylfllist";
        Ylfl.LSqlList.SqlQueryParams["strorder"] = " SEQUEUE";
        if (Ylfl.LSqlList.SqlQueryParams["strwhere"]) {
            Ylfl.LSqlList.SqlQueryParams["strwhere"] += " AND PARENTCATE=226 AND ISEFFECT=1";
        } else {
            Ylfl.LSqlList.SqlQueryParams["strwhere"] = " PARENTCATE=226 AND ISEFFECT=1";
        }
        Ylfl.LSqlList.DisplayHtml = function(data, l_obj) {
            Ylfl.DisplayHtml(data, l_obj, 16);
        };
        Ylfl.LSqlList.Search();
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
                var tid = $(this).attr("pid").split('_')[0];
                window.open("ylfl.html?categoryid=" + tid + "_&categoryname=" + tname);
            });
        } else {
            $("#" + l_obj.result_id).empty().html("<li><center>对不起，没有数据。</center></li>");
        }
    }
}
