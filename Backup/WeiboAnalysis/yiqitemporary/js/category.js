var _category = new Object;
var Category = _category.property = {
    initData: { "page_size": 5, "result_id": "SearchResult", "status_bar_id": "PagerList", "disotherinfo": true },
    CommanQuery: { "action": "categoryquery", "totalresults": "true", "display_style": 6, "print": "fields",
        "summary": "context", "start": "1", "page_size": "4",
        "predict": "false", "characters": 450
    },
    ResultTag: false,
    Init: function (tid, tname) {
        var id = $.query.get('categoryid');
        var name = $.query.get('categoryname');
        var type = $.query.get('type');
        if (type) {
            $("*[id^='tab_']").attr("class", "tab_off");
            $("#tab_" + type).attr("class", "tab_on");
        }
        if (id) {
            id = id.replace("_", "");
            this.InitData(id, unescape(name));
        }
        else {
            this.InitData(tid, tname);
        }
        $("#btn_look_result").click(function () {
            Category.GetSpecialData();
        });
        var tablist = $("li[id^='tab_']");
        $("li[id^='tab_']").click(function () {
            tablist.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            Category.GetSpecialData();
        });
        var sortlist = $("li[id^='sort_']");
        $("li[id^='sort_']").click(function () {
            sortlist.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            Category.GetSpecialData();
        });
    },
    InnitStartAndEndTime: function () {
        var start_time = Common.GetTimeSpanStr(-7);
        var end_time = Common.GetTimeSpanStr(0);
        $("#start_time").val(start_time);
        $("#end_time").val(end_time);
    },
    InitData: function (categoryid, categoryname) {
        Category.CommanQuery["category"] = categoryid;
        $("#title_cue").attr("pid", categoryid);
        $("#title_cue").empty().html(categoryname);
        Category.GetSpecialData();
    },
    GetSpecialData: function () {
        var max_date = $.trim($("#end_time").val());
        if (max_date) {
            Category.CommanQuery["maxdate"] = Common.GetTimeStr(max_date);
        }
        else {
            delete Category.CommanQuery["maxdate"];
        }

        var min_date = $.trim($("#start_time").val());
        if (min_date) {
            Category.CommanQuery["mindate"] = Common.GetTimeStr(min_date);
        }
        else {
            delete Category.CommanQuery["mindate"];
        }
        this.CommanQuery["sort"] = $("li[id^='sort_'][class='tab_on']").attr("pid");
        var fieldtext = Category.GetNewsType();
        if (fieldtext) {
            this.CommanQuery["fieldtext"] = fieldtext;
        } else {
            delete this.CommanQuery["fieldtext"];
        }

        var Lpager = new Pager(this.initData);
        Lpager.Display = function (data, l_obj) {
            if (parseInt(data["TotalCount"]) == 0) {
                $("#SearchResult").html("<center>对不起，没有数据</center>");
                $("#PagerList").empty();
            } else {
                Common.DisplayHtml(data, l_obj);
            }
            //            if (!Category.ResultTag) {
            //                Category.InnitOtherInfo();
            //                Category.ResultTag = true;
            //            }
        };
        Lpager.LoadData(1, this.CommanQuery);
    },
    GetNewsType: function () {
        var str = [];
        var type_condition = $.trim($("li[id^='tab_'][class='tab_on']").attr("pid"));
        if (type_condition) {
            delete Category.CommanQuery["database"];
            delete Category.CommanQuery["printfields"];
            if (type_condition != "all") {
                if (str.length == 0) {
                    str.push(type_condition);
                } else {
                    str.push("+AND+" + type_condition);
                }
            }
        } else {
            //Category.CommanQuery["database"] = Config.weibodatabase;
            // Category.CommanQuery["printfields"] = "all"; //Config.weiboprintfields;
        }
        if (str.length == 0) {
            return "";
        } else {
            return str.join("");
        }
    },
    InnitOtherInfo: function () {
        var categoryid = this.CommanQuery["category"];
        $("#category_menu").find("a[pid^='" + categoryid + "']").after("<ul id=\"sub_menu_info\"><img src=\"img/loading_icon.gif\" /></ul>");
        $.post("Handler/ResultInfo.ashx",
            this.CommanQuery,
            function (data) {
                if (data) {
                    $("#sub_menu_info").remove();
                    Category.StoreStateID = unescape(data["StoreStateID"]);
                    Category.InnitResultInfoHtml(/*"leader_info",*/data);
                } else {
                    //$("#leader_info").empty().html("没有数据");
                    //$("#org_info").empty().html("没有数据");
                }
            },
            "json"
        );
    },
    InnitResultInfoHtml: function (data) {
        var content = [];
        content.push("<ul id=\"sub_menu\">");
        content.push("<li>");
        content.push("<a href=\"javascript:void(null);\"><b>重要人物</b></a><ul class=\"submenu\">");
        for (var item in data["leaderinfo"]) {
            delete data["leaderinfo"]["SuccessCode"];

            var row = data["leaderinfo"][item];
            var keyword = unescape(row["tag"]);
            var count = parseInt(row["count"]);
            if (count > 0) {
                content.push("<li><a href=\"javascript:void(null);\" queryrule=\"" + row["queryrule"] + "\"");
                content.push(" pid=\"" + Category.StoreStateID + "\"><b>" + keyword + "<span class=\"color_5\">");
                content.push("（<code class=\"color_2\">" + count + "</code>）</span></b></a></li>");
            }
        }
        content.push("</ul></li>");
        content.push("<li>");
        content.push("<a href=\"javascript:void(null);\"><b>关注机构</b></a><ul class=\"submenu\">");
        for (var item in data["orginfo"]) {
            delete data["orginfo"]["SuccessCode"];

            var row = data["orginfo"][item];
            var keyword = unescape(row["tag"]);
            var count = parseInt(row["count"]);
            if (count > 0) {
                content.push("<li><a href=\"javascript:void(null);\" queryrule=\"" + row["queryrule"] + "\"");
                content.push(" pid=\"" + Category.StoreStateID + "\"><b>" + keyword + "<span class=\"color_5\">");
                content.push("（<code class=\"color_2\">" + count + "</code>）</span></b></a></li>");
            }
        }
        content.push("</ul></li>");

        content.push("</ul>");

        var pid = $("#title_cue").attr("pid");
        $("#category_menu").find("a[pid^='" + pid + "']").after(content.join(""));

        $("ul.submenu li").find("a").click(function () {
            var StoreStateID = $(this).attr("pid");
            var queryrule = unescape($(this).attr("queryrule"));
            Category.CommanQuery["action"] = "query";
            Category.CommanQuery["minscore"] = "0";
            Category.CommanQuery["start"] = "1";
            Category.CommanQuery["text"] = queryrule;
            Category.CommanQuery["statematchid"] = StoreStateID;
            Category.GetSpecialData();
        });
    }
}