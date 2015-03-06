$(document).ready(function() {
    Common.LoginEventFn = function(Data) {
        if (Data.Show == 1) {
            $("#look_url").parent("span").show();
        } else {
            $("#look_url").parent("span").hide();
        }

        Article.Display();
    }
    Common.CheckUser();
});

var _article = new Object;
var Article = _article.property = {
    InnitData: { "page_size": 1, "result_id": "result_list", "status_bar_id": "pager_list" },
    CommanQuery: { "action": "query", "display_style": 6, "print": "all", "database": Config.AllDataBase,
        "isrecordclick": true, "clickref": escape(location.href)
    },
    Display: function() {
        var web_url = $.query.get('url');
        if (web_url) {
            $("#look_url").attr("href", web_url);
            this.CommanQuery["matchreference"] = web_url;
            var Lpager = new Pager(this.InnitData);
            Lpager.Display = function(data, l_obj) {
                var entity = data["entity_1"];
                var htmlcontent = [];
                $("#article_title").empty().html(unescape(entity["title"]));
                $("#article_time").empty().html(unescape(entity["time"]));
                $("#article_site").empty().html(unescape(entity["site"]));
                $("#article_content").empty().html(unescape(entity["allcontent"]));
                htmlcontent.push("<a name=\"search_suggest_result_" + unescape(entity["docid"]) + "\" style=\"display:none;\" class=\"link_off\" href=\"javascript:void(null);\">相关资讯</a>");
                htmlcontent.push("<ul style=\"display:none;\" class=\"news_list\" id=\"suggest_" + unescape(entity["docid"]) + "\"></ul>");
                $("#suggest_info").empty().html(htmlcontent.join(""));
                Common.Suggest(true);
            };
            Lpager.LoadData(1, this.CommanQuery);
        }
    }
}