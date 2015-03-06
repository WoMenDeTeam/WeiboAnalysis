$(document).ready(function() {
    Common.LoginEventFn = function(data) {
        var type = $.query.get('type');
        if (type) {
            $("#report_type").val(type);
        }
        ReportList.LSqlList = new SqlList();
        ReportList.Innit();
        ReportList.InnitClickFn();
    }
    Common.CheckUser();
});

var _reportlist = new Object;
var ReportList = _reportlist.property = {
    LSqlList: null,
    Innit: function() {
        ReportList.LSqlList.initData["page_size"] = 30;
        ReportList.LSqlList.initData["diszhuanfatag"] = false;
        ReportList.LSqlList.SqlQueryParams["action"] = "getreportlist";
        ReportList.LSqlList.SqlQueryParams["strorder"] = " CREATETIME DESC";

        if (ReportList.LSqlList.SqlQueryParams["strwhere"]) {
            ReportList.LSqlList.SqlQueryParams["strwhere"] += " AND STATUS=3";
        } else {
            ReportList.LSqlList.SqlQueryParams["strwhere"] = " STATUS=3";
        }
        var report_type = $("#report_type").val();
        if (report_type != "-1") {
            ReportList.LSqlList.SqlQueryParams["strwhere"] = ReportList.LSqlList.SqlQueryParams["strwhere"] + " AND TYPE=" + report_type;
        }
        ReportList.LSqlList.DisplayHtml = function(data, l_obj) {
            ReportList.DisplayHtml(data, l_obj);
        };
        ReportList.LSqlList.Search();
    },
    DisplayHtml: function(data, l_obj) {
        if (parseInt(data["totalcount"]) > 0) {
            var entitylist = data["entitylist"];
            delete entitylist["SuccessCode"];
            var content = [];
            for (var item in entitylist) {
                var entity = entitylist[item];
                var title = unescape(entity["title"]);
                var url = unescape(entity["url"]);
                var creattime = unescape(entity["creattime"]);
                content.push("<li><a href=\"" + Config.ReportHttp + url + "\" >");
                content.push("<span class=\"text\">" + title + "</span>");
                content.push("<span class=\"date\">" + creattime + "</span></a></li>");
            }
            $("#" + l_obj.result_id).empty().html(content.join(""));
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
                strwhere.push(" CREATETIME>=to_date('" + starttime + "','yyyy-MM-dd') AND");
            }
            if (endtime) {
                strwhere.push(" CREATETIME<=to_date('" + endtime + "','yyyy-MM-dd') AND");
            }
            ReportList.LSqlList.SqlQueryParams["strwhere"] = strwhere.join("").slice(0, -3);
            ReportList.Innit();
        });
    }
}