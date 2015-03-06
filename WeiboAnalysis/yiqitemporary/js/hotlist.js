$(document).ready(function() {
    Common.LoginEventFn = function() {
        HotList.SqlList = new SqlList();
        HotList.Init();
    }
    Common.CheckUser();
});

var _hotlist = new Object;
var HotList = _hotlist.property = {
    SqlList: null,
    Init: function() {
        HotList.InitJobInfo();
    },
    InitJobInfo: function() {
        HotList.SqlList.initData["page_size"] = 5;
        HotList.SqlList.SqlQueryParams["action"] = "getclusterlist";
        HotList.SqlList.DisplayHtml = function(data) {
            HotList.DisPlayHtmlStr(data);
        };
        HotList.SqlList.Search();
    },
    DisPlayHtmlStr: function(data) {
        $("#SearchResult").empty();
        delete data["totalcount"];
        delete data["Success"];
        for (var one in data) {
            var entity = data[one];
            if (entity && undefined != entity) {
                var basetitle = unescape(entity["title"]);
                var distitle = basetitle.length > 25 ? basetitle.slice(0, 25) + "..." : basetitle;
                var htmlcontent = [];
                htmlcontent.push("<div class=\"news\"><h1><a name=\"btn_look_info_snapshot\" href=\"" + unescape(entity["href"]) + "\" title=\"" + basetitle + "\" target=\"_blank\">" + distitle + "</a></h1>");
                htmlcontent.push("<h2>");
                htmlcontent.push("【时间】<span class=\"date\">" + unescape(entity["time"]).slice(0, -3) + "</span><br />");
                htmlcontent.push("【来源】<span class=\"rss\">" + unescape(entity["site"]) + "</span><br />");
                //htmlcontent.push("<a name=\"look_snapshot\" class=\"btn_photo\" pid=\"" + entity["href"] + "\">查看快照</a>");
                htmlcontent.push("</h2><p>" + unescape(entity["content"]) + "</p>");
                htmlcontent.push("<a name=\"search_suggest_result_" + unescape(entity["docid"]) + "\" style=\"display:none;\" class=\"link_off\" href=\"javascript:void(null);\">相关资讯</a>");
                htmlcontent.push("<ul style=\"display:none;\" class=\"news_list\" id=\"suggest_" + unescape(entity["docid"]) + "\"></ul></div>");
                $("#SearchResult").append(htmlcontent.join(""));                
                HotList.Suggest(entity["childlist"], entity["docid"]);
            }
        }
        Common.InitWebURL("SearchResult", "btn_look_info_snapshot");
    },
    Suggest: function(data, docid) {
        delete data["Success"];
        var firstid = docid;
        var tag = HotList.CheckData(data);
        if (tag) {
            $("#suggest_" + firstid).hide();
            var con = [];
            for (var item in data) {
                var entity = data[item];
                var basetitle = unescape(entity["title"]);
                var distitle = basetitle.length > 30 ? basetitle.slice(0, 30) + "..." : basetitle;
                con.push("<li><a name=\"look_info_snapshot\" href=\"" + unescape(entity["href"]) + "\" title=\"" + basetitle + "\"");
                con.push(" target=\"_blank\"><span class=\"text color_7\">" + distitle + "</span>");
                con.push("　<span class=\"date\">" + unescape(entity["time"]).slice(0, 10) + "</span></a></li>");
            }
            $("#suggest_" + firstid).empty().html(con.join(""));
            Common.InitWebURL("suggest_" + firstid, "look_info_snapshot");
            $("[name='search_suggest_result_" + firstid + "']").show(500);
            $("[name='search_suggest_result_" + firstid + "']").click(function() {
                var suggest_info = $(this).siblings("ul");
                var show_tag = $(suggest_info).attr("pid");
                if (undefined == show_tag || show_tag == "0") {
                    $(suggest_info).show(200);
                    $(suggest_info).attr("pid", "1");
                    $(this).attr("class", "link_on");
                } else {
                    $(suggest_info).hide();
                    $(suggest_info).attr("pid", "0");
                    $(this).attr("class", "link_off");
                }
            });
        } else {
            $("#suggest_" + firstid).hide();
            $("[name='search_suggest_result_" + firstid + "']").hide();
        }
    },
    CheckData: function(data) {
        var tag = false;
        var count = 0;
        for (var item in data) {
            count++;
            if (count > 1) {
                tag = true;
                break;
            }
        }
        return tag;
    }
}