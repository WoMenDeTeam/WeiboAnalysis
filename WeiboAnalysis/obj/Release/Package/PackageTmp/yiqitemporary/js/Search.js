$(document).ready(function () {
    Common.ClickFn = function () {
        advanceSearch.Search();
    }
    Common.LoginEventFn = function () {
        var keyword_value = $.query.get('keyword');
        var btn_value = $.query.get('searchButton');
        var type = $.query.get('type');
        if ($.trim(keyword_value) != "") {
            //delete advanceSearch.CommanQuery["maxdate"];
            //delete advanceSearch.CommanQuery["mindate"];
            advanceSearch.Search(keyword_value);
            //advanceSearch.Suggest(keyword_value);
            Inputcue.init_value = keyword_value;
            Inputcue.GetCueValue(keyword_value);
        }
        $("#BtnSearch").click(function () {
            $("#total_count").empty();
            $("#search_second").empty();
            $("#dis_num").empty();
            advanceSearch.Search();
        });
        advanceSearch.BtnSelInit();
    }
    Common.CheckUser();
});
var _advanceSearch = new Object;
var advanceSearch = _advanceSearch.prototype = {

    initData: { "page_size": 20, "result_id": "result_list", "status_bar_id": "pager_list", "disotherinfo": true },
    queryParams: { "action": "query", "display_style": 6, "Characters": 300, "combine": "simple", "totalResults": true,
        "Highlight": "summaryterms", "Print": "fields", "summary": "context", "Predict": "false",
        "isrecordkeyword": true
    },
    CommanQuery: { "action": "query", "display_style": 6, "TotalResults": true, "Highlight": "summaryterms", "Print": "fields",
        "summary": "context", "Predict": "false", "Combine": "simple"
    },
    StoreStateID: null,
    Search: function (keyword) {
        $("#term_frame").hide();
        if (keyword) {
            $("#keyword").val(keyword);
        }
        if (this.check()) {
            delete this.CommanQuery["statematchid"];
            $("#pager_list").show().empty().html("<center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center>");
            this.queryParams["action"] = "query";
            //this.initData["page_size"] = parseInt($("#select_num").val());
            this.queryParams["text"] = $.trim($("#keyword").val());
            this.queryParams["sort"] = $("li[name='sort_search_type'][class='tab_on']").attr("pid");

            if ($("#quality").val() != "0")
                this.queryParams["minscore"] = $("#quality").val();
            else
                delete this.queryParams["minscore"];
            var min_date = advanceSearch.GetTimeStr($("#min_date_input").val());
            if (min_date) {
                this.queryParams["mindate"] = min_date;
            } else {
                delete this.queryParams["mindate"];
            }
            var max_date = advanceSearch.GetTimeStr($("#max_date_input").val());
            if (max_date) {
                this.queryParams["maxdate"] = max_date;
            } else {
                delete this.queryParams["maxdate"];
            }
            if (advanceSearch.GetNewsType()) {
                this.queryParams["fieldtext"] = advanceSearch.GetNewsType() + "+AND+EMPTY{}:CONTURL";
            }
            else {
                this.queryParams["fieldtext"] = "EMPTY{}:CONTURL";
            }
            var Lpager = new Pager(this.initData);
            Lpager.Display = function (data, l_obj) {
                if (!advanceSearch.queryParams["database"]) {
                    Common.DisplayHtml(data, l_obj, true);
                } else {
                    Common.DisplayHtml(data, l_obj, false);
                }
                //advanceSearch.InnitOtherInfo(advanceSearch.queryParams);
            };
            Lpager.LoadData(1, this.queryParams);

            //advanceSearch.Suggest($.trim($("#queryword").val()));
        }
    },
    InnitOtherInfo: function (params) {
        $("#leader_info").empty().html("<li><center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center></li>");
        $("#org_info").empty().html("<li><center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center></li>");
        params["action"] = "query";
        $.post("Handler/ResultInfo.ashx",
            params,
            function (data) {
                if (data) {
                    advanceSearch.StoreStateID = unescape(data["StoreStateID"]);
                    delete data["StoreStateID"];
                    advanceSearch.InnitResultInfoHtml("leader_info", data["leaderinfo"]);
                    advanceSearch.InnitResultInfoHtml("org_info", data["orginfo"]);
                } else {
                    $("#leader_info").empty().html("没有数据");
                    $("#org_info").empty().html("没有数据");
                }
            },
            "json"
        );
    },
    InnitResultInfoHtml: function (obj, data) {
        delete data["SuccessCode"];
        var content = [];
        for (var item in data) {
            var row = data[item];
            var keyword = unescape(row["tag"]);
            var count = parseInt(row["count"]);
            if (count > 0) {

                content.push("<li><a href=\"javascript:void(null);\" queryrule=\"" + row["queryrule"] + "\"");
                content.push(" pid=\"" + advanceSearch.StoreStateID + "\"><b>" + keyword + "<span class=\"color_5\">");
                content.push("（<code class=\"color_2\">" + count + "</code>）</span></b></a></li>");
            }
        }
        $("#" + obj).empty().html(content.join(""));
        $("#" + obj).find("a").click(function () {
            var StoreStateID = $(this).attr("pid");
            var queryrule = unescape($(this).attr("queryrule"));
            advanceSearch.CommanQuery["minscore"] = "0";
            advanceSearch.CommanQuery["text"] = queryrule;
            advanceSearch.CommanQuery["statematchid"] = StoreStateID;
            var Lpager = new Pager(advanceSearch.initData);
            Lpager.Display = function (data, l_obj) {
                Common.DisplayHtml(data, l_obj, true);
            };
            Lpager.LoadData(1, advanceSearch.CommanQuery);
        });
    },
    GetNewsType: function () {
        var str = [];
        var type_condition = $.trim($("li[name='search_site_type'][class='tab_on']").attr("pid"));
        if (type_condition) {
            delete advanceSearch.queryParams["database"];
            delete advanceSearch.queryParams["printfields"];
            if (type_condition != "all") {
                //if (type_condition == "MATCH{news}:C1") {
                advanceSearch.initData["dissamenews"] = type_condition; //true;
                //                } else {
                //                    delete advanceSearch.initData["dissamenews"];
                //                }
                if (str.length == 0) {
                    str.push(type_condition);
                } else {
                    str.push("+AND+" + type_condition);
                }
            }
        } else {
            advanceSearch.queryParams["database"] = Config.weibodatabase;
            advanceSearch.queryParams["printfields"] = Config.weiboprintfields;
        }
        var blog_name = $("#blog_name").val();
        if (blog_name) {
            if (str.length == 0) {
                str.push("MATCH{" + blog_name + "}:DOMAINNAME");
            } else {
                str.push("+AND+MATCH{" + blog_name + "}:DOMAINNAME");
            }
        }
        if (str.length == 0) {
            return "";
        } else {
            return str.join("");
        }
    },
    check: function () {
        var keyword = $.trim($("#keyword").val());
        if (keyword == "" || keyword == "输入您关注的内容关键字...") {
            alert("请输入关键字");
            return false;
        }
        else {
            return true;
        }
    },
    TimeInit: function () {
        $("[id^='time_']").each(function () {
            var type = $(this).attr("id").split('_')[2];
            $(this).empty();
            switch (type) {
                case "day":
                    for (var i = 1; i <= 31; i++) {
                        if (i < 10) {
                            $(this).append("<option value=\"0" + i + "\">0" + i + "</option>");
                        }
                        else {
                            $(this).append("<option value=\"" + i + "\">" + i + "</option>");
                        }
                    }
                    break;
                case "month":
                    for (var i = 1; i <= 12; i++) {
                        if (i < 10) {
                            $(this).append("<option value=\"0" + i + "\">0" + i + "</option>");
                        }
                        else {
                            $(this).append("<option value=\"" + i + "\">" + i + "</option>");
                        }
                    }
                    break;
                case "year":
                    for (var i = 2000; i <= 2020; i++) {
                        $(this).append("<option value=\"" + i + "\">" + i + "</option>");
                    }
                    break;
                default:
                    break;
            }
        });
        setTimeout(advanceSearch.InitTimeSelect, 50);
    },
    InitTimeSelect: function () {
        var now_time = new Date();
        var ago_time = new Date(now_time - 86400000);
        $("#time_min_day").val(ago_time.getDate() < 10 ? "0" + ago_time.getDate() : ago_time.getDate());
        $("#time_min_month").val((ago_time.getMonth() + 1) < 10 ? "0" + (ago_time.getMonth() + 1) : (ago_time.getMonth() + 1));

        $("#time_max_day").val(now_time.getDate() < 10 ? "0" + now_time.getDate() : now_time.getDate());
        $("#time_max_month").val((now_time.getMonth() + 1) < 10 ? "0" + (now_time.getMonth() + 1) : (now_time.getMonth() + 1));
        $("#time_max_year").val(now_time.getFullYear());
    },
    GetDate: function (type) {
        var time_str = "";
        $("[id^='time_" + type + "_']").each(function () {
            time_str = time_str + $(this).val() + "/";
        });
        return time_str.slice(0, time_str.length - 1);
    },
    KeywordSearch: function (keyword) {
        $("#pager_list").show().empty().html("<center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center>");
        this.initData["page_size"] = 20;
        this.CommanQuery["text"] = keyword;
        var Lpager = new Pager(this.initData);
        Lpager.Display = function (data, l_obj) {
            Common.DisplayHtml(data, l_obj, true);
            //advanceSearch.InnitOtherInfo(advanceSearch.CommanQuery);
        };
        Lpager.LoadData(1, this.CommanQuery);

    },
    PgerOtherFn: function (obj, totalcount) {
        var html_str = $.trim($("#total_count").html());
        if (totalcount) {
            if (totalcount == obj.query_params["start"]) {
                $("#dis_num").empty().html(obj.query_params["start"]);
            }
            else if (totalcount < (obj.page_size + obj.query_params["start"])) {
                $("#dis_num").empty().html(obj.query_params["start"] + "-" + totalcount);
            }
            else {
                $("#dis_num").empty().html(obj.query_params["start"] + "-" + (obj.query_params["page_size"] + obj.query_params["Start"] - 1));
            }
        }
        if (totalcount && html_str == "") {
            $("#total_count").empty().html(totalcount);
            obj.end_time = obj.end_time - 86400000;
            obj.Start_time = obj.Start_time - 86400000;
            var time_span = (obj.end_time - obj.Start_time) / 1000 / 5 + "";
            time_span = time_span.slice(0, time_span.indexOf(".") + 4);
            $("#search_second").empty().html(time_span);
            if (obj.query_params["text"] != "*") {
                $("#search_keyword").empty().html(obj.query_params["text"]);
                if (!obj.query_params["characters"])
                    $("#keyword").val(obj.query_params["text"]);
            }
        }
        $("#search_quality").empty().html(obj.query_params["minscore"] + "%");
        //advanceSearch.Suggest();
    },
    BtnSelInit: function () {
        $("#look_all_result").click(function () {
            advanceSearch.Search();
        });
        advanceSearch.InnitSelectClick("search_site_type");
        advanceSearch.InnitSelectClick("sort_search_type");
    },
    InnitSelectClick: function (l_name) {
        var search_type_list = $("li[name='" + l_name + "']");
        search_type_list.css("cursor", "pointer");
        $("li[name='" + l_name + "']").each(function () {
            $(this).click(function () {

                search_type_list.attr("class", "tab_off");
                $(this).attr("class", "tab_on");
                if (l_name == "search_site_type") {
                    $("li[name='sort_search_type']").each(function () {
                        $(this).attr("class", "tab_off");
                    });
                    //$("li[name='sort_search_type'][pid='Date']").attr("class", "tab_off");
                    $("li[name='sort_search_type'][pid='Date']").attr("class", "tab_on");
                }
                if (advanceSearch.check()) {
                    advanceSearch.Search();
                }
            });
        });
        //        if (l_name == "search_site_type") {
        //            $("li[name='sort_search_type']").each(function() {
        //                $(this).attr("class", "tab_off");
        //            });
        //            $("li[name='sort_search_type'][pid='Date']").attr("class", "tab_on");
        //        }
    },
    GetTimeStr: function (timestr) {
        if (timestr) {
            var time = new Date(timestr);
            return time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear();
        } else {
            return null;
        }
    }
}