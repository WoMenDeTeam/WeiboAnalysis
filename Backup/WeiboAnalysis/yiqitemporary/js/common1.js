// JavaScript Document
var Config = {
    //专题追踪的父级栏目ID
    ThemeParentCate: 412,
    IndexHotMapJob: "safejob_clusters",
    IdolHttp: "Handler/GetImage.ashx",
    SGMapJob: "myjob_SG",
    //微博所对应的IDOL库名
    weibodatabase: "WeiboAnjian",
    ReportHttp: "http://10.16.6.100/Admin/reportcontent/",
    MinZhengNews: "PortalSafety+safety",
    HotKeyWordDiv: null,
    HotWords: "煤矿,安全生产,瓦斯爆炸",
    FilterKeyWords: "瓦斯,爆炸,透水,瞒报,矿难,安监,煤监,溃坝,煤矿安全",
    TimeSpan: 332,
    VideoHost: "http://10.16.0.183/",
    LeaderVideoKeyWork: "\"付建华\",\"黄毅\",\"黄玉治\",\"李万疆\",\"彭建勋\",\"孙华山\",\"王德学\",\"王树鹤\",\"杨栋梁\",\"杨元元\",\"赵铁锤\",\"赵惠令\"",
    WeiboDatabase: "WEIBO",
    VideoDatabase: "NewVideo"
}

var _Common = new Object;
var Common = _Common.prototype = {
    IndexHotMapJob: "safejob_clusters",
    IdolHttp: "Handler/GetImage.ashx",
    SGMapJob: "myjob_SG",
    ReportHttp: "http://10.16.6.100/Admin/reportcontent/",
    HotKeyWordDiv: null,
    HotWords: "煤矿,安全生产,瓦斯爆炸",
    FilterKeyWords: "瓦斯,爆炸,透水,瞒报,矿难,安监,煤监,溃坝,煤矿安全",
    ThemeParentCate: 412,
    TimeSpan: 332,
    LogVisitor: function () {
        $.post("Handler/User.ashx", { 'action': 'log_visitor', 'page_url': location.href },
            function (Data, textStatus) {

            }, "json");
    },
    CheckUser: function () {
        $.post("Handler/User.ashx", { 'action': 'check_user' },
            function (Data, textStatus) {
                if (Data["SuccessCode"] == "1") {
                    $("div[name='head_list_div']").show();
                    $("#subnav_index").attr("href", unescape(Data.path));
                    Common.InitBodyClick();
                    Common.InnitCopyright();
                    Common.InnitSurveyData();
                    Common.InnitOtherNavList();
                    Common.InnitBtnFn();
                    //Common.LogVisitor();
                    Common.DisUserName(Data);
                    Common.LoginEventFn(Data);
                    Common.InnitHotKeyWordClickFn();
                    Common.InitCueInput();
                }
                else {
                    location.href = unescape(Data.path);
                }
            }, "json");
    },
    InitBodyClick: function () {
        $("body").keyup(function (e) {
            var intkey = -1;
            if (window.event) {
                intkey = event.keyCode;
            }
            else {
                intkey = e.which;
            }
            if (intkey == 13) {
                Common.ClickFn();
            }
        });
    },
    InitCueInput: function () {
        var width = parseInt($("#keyword").width()) + 8;
        var content = [];
        content.push("<div class=\"term_frame\" id=\"sel\" style=\"width:" + width + "px;\" >");
        content.push("<table style=\"width:" + width + "px;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">");
        content.push("<tbody id=\"term_list\"></tbody></table></div>");
        $(".search").css("text-align", "left");
        $(".search").find(".form_list").before(content.join(""));
        var params = { "InputObj": "keyword", "SelObj": "sel", "ItemList": "term_list" };
        Inputcue.init(params);
    },
    InnitHotKeyWordClickFn: function () {
        $("#look_hot_keyword").click(function (e) {
            if (!Common.HotKeyWordDiv) {
                var div = document.createElement("DIV");
                $(div).attr("class", "select_layer");
                $(div).css({ "width": "180px" });
                $(div).attr("pid", "1");
                var content = [];
                content.push("<h1><span class=\"left\">热点关键词</span>");
                content.push("<span class=\"right\"><a class=\"btn_close\" href=\"javascript:void(null);\" ");
                content.push("id=\"close_keyword_frame\"></a></span></h1>");
                content.push("<div class=\"clear\"></div>");
                content.push("<ul class=\"form_list\">");
                var word_list = Common.HotWords.split(',');
                for (var i = 0, j = word_list.length; i < j; i++) {
                    content.push("<li><a name=\"hot_word_item\" href=\"javascript:void(null)\">");
                    content.push(word_list[i] + "</a></li>");
                }
                content.push("</ul>");
                $(div).html(content.join(""));
                $(".search").find(".search_line_2").first().before($(div));
                Common.HotKeyWordDiv = div;
                $("#close_keyword_frame").click(function () {
                    $(Common.HotKeyWordDiv).hide();
                    $(Common.HotKeyWordDiv).attr("pid", "0");
                });
                $("a[name='hot_word_item']").click(function () {
                    var word = $.trim($("#keyword").val());
                    var l_word = $(this).html();
                    if (word) {
                        word += " " + l_word;
                    } else {
                        word = l_word;
                    }
                    $("#keyword").val(word);
                });
            } else {
                var tag = $(Common.HotKeyWordDiv).attr("pid");
                if (tag == "1") {
                    $(Common.HotKeyWordDiv).hide();
                    $(Common.HotKeyWordDiv).attr("pid", "0");
                } else {
                    $(Common.HotKeyWordDiv).show();
                    $(Common.HotKeyWordDiv).attr("pid", "1");
                }
            }

        });
    },
    InnitCopyright: function () {
        var info_str = "<span class=\"left\">主办单位：国家安全生产监督管理总局<br />"
        + "承办单位：国家安全生产监督管理总局通信信息中心 </span><span class=\"right\">"
        + "<span class=\"left\">办公室电话：</span>"
        + "(010)64464191<br />(010)64464271 </span>"
        + "<div class=\"clear\"></div>"
        + "网站管理员邮箱:wlyq@chinasafety.gov.cn<br />（浏览本网主页，建议将电脑显示屏的分辨率调为1024*768）";
        $("#footer_info").empty().html(info_str);
    },
    DisUserName: function (data) {
        //$(".user_info b").first().empty().html(unescape(data.userName));
        var dayObj = new Date();
        var monthStr = dayObj.getMonth() + 1;
        var year2000 = dayObj.getFullYear();
        var day = dayObj.getDay();
        if (year2000 < 99) year2000 = 2000 + dayObj.getYear();

        var week = "";
        if (day == 1) week = "星期一";
        if (day == 2) week = "星期二";
        if (day == 3) week = "星期三";
        if (day == 4) week = "星期四";
        if (day == 5) week = "星期五";
        if (day == 6) week = "星期六";
        if (day == 0) week = "星期天";
        var content = [];
        content.push("您好！<b class=\"color_2\"></b>");
        content.push("今天是<code class=\"color_1\">" + year2000 + "</code>年");
        content.push("<code class=\"color_1\">" + monthStr + "</code>月");
        content.push("<code class=\"color_1\">" + dayObj.getDate() + "</code>日");
        content.push("<code class=\"color_1\"> " + week + "</code>");
        $(".user_info").empty().html(content.join(""));
        //        $(".user_info code:eq(0)").text(year2000);
        //        $(".user_info code:eq(1)").text(monthStr);
        //        $(".user_info code:eq(2)").text(dayObj.getDate());
        //        $(".user_info code:eq(3)").text("" + week);
        $(".btn_logout").attr("href", "Handler/LoginOut.ashx");
    },
    LoginEventFn: function (data) {
        return null;
    },
    InnitBtnFn: function () {
        $("#btn_search").click(function () {
            Common.ClickFn();
        });
    },
    ClickFn: function () {
        var keyword = $.trim($("#keyword").val());
        if (!keyword || keyword == "输入您关注的内容关键字...") {
            return;
        }
        location.href = ("search.html?keyword=" + keyword + "&searchButton=搜索");
    },
    InnitSurveyData: function () {
        var innitData = { "subnav_1": { "DisCount": 8, "disurl": "ylfl.html", "moreurl": "ylfllist.html" },
            "subnav_2": { "DisCount": 5, "disurl": "district.html", "moreurl": "district.html" }
        };
        var postparams = { "subnav_1": "226", "subnav_2": "312" };
        $.post("Handler/GetSurveyData.ashx",
            postparams,
            function (data) {
                if (data) {
                    for (var item in innitData) {
                        var row = data[item];
                        delete row["SuccessCode"];
                        for (var one in row) {
                            innitData[item][one] = row[one];
                        }
                    }
                    Common.InnitCategoryList(data);
                    Common.InnitNavList(innitData);
                }
            },
            "json"
        );
    },
    InnitCategoryList: function (data) {
        return null;
    },
    NavData: { "subnav_3": { "周报": "zblist.html?type=1", "专报": "zblist.html?type=2", "事故": "zblist.html?type=4", "其他": "zblist.html?type=3" },
        "subnav_4": { "舆情专题": "ylzt.html", "舆情热点": "hotlist.html" }
    },
    InnitNavList: function (menudata) {
        var IndustryData = menudata;
        for (var item in IndustryData) {
            var IndustryContent = [];
            IndustryContent.push("<ul>");
            var count = 1;
            var row = IndustryData[item];
            var dishref = row["disurl"];
            var morehref = row["moreurl"];
            delete row["moreurl"];
            delete row["disurl"];
            var discount = parseInt(row["DisCount"]) + 1;
            delete row["DisCount"];
            for (var one in row) {
                if (count < discount) {
                    IndustryContent.push("<li><a target=\"_blank\" href=\"" + dishref + "?categoryid=" + one.split('_')[0] + "_&categoryname=" + unescape(row[one]) + "\"");
                    IndustryContent.push(" >" + unescape(row[one]) + "</a></li>");
                }
                count++;
            }
            if (count >= discount) {
                IndustryContent.push("<li><a class=\"btn_more\" href=\"" + morehref + "\" target=\"_blank\">更多</a></li>");
            }
            IndustryContent.push("</ul>");
            $("#" + item).empty().html(IndustryContent.join(""));
        }
    },
    InnitOtherNavList: function () {
        var data = Common.NavData;
        for (var one in data) {
            var content = [];
            content.push("<ul>")
            var row = data[one];
            var count = 1;
            for (var item in row) {
                if (count < 5) {
                    content.push("<li><a target=\"_blank\" href=\"" + row[item] + "\"");
                    content.push(" >" + item + "</a></li>");
                }
                count++;
            }
            if (count > 5) {
                content.push("<li><a class=\"btn_more\" href=\"ylfl.html\" target=\"_blank\">更多</a></li>");
            }
            content.push("</ul>");
            $("#" + one).empty().html(content.join(""));
        }
    },
    TabControl: function (s, current_class, nocurrent_class) {
        var TabList = [];
        var DisList = [];
        for (var item in s) {
            TabList.push(item);
            DisList.push(s[item]);
        }
        for (var i = 0, j = TabList.length; i < j; i++) {
            $("#" + TabList[i]).click(function () {
                for (var k = 0; k < j; k++) {
                    $("#" + TabList[k]).attr("class", nocurrent_class);
                    $("#" + DisList[k]).hide();
                }
                $(this).attr("class", current_class);
                $("#" + s[$(this).attr("id")]).show();
            });
        }
    },
    ClickTab: function (obj_list, current_class, no_current_class) {
        obj_list.each(function () {
            var current_obj = this;
            $(this).click(function () {
                obj_list.each(function () {
                    $(this).parent("dl").attr("class", no_current_class);
                });
                $(current_obj).parent("dl").attr("class", current_class);
            });
        });
    },
    GetMonth: function (obj) {
        var time = new Date();
        $("#" + obj).empty().html(time.getFullYear() + "年" + (time.getMonth() + 1) + "月");
    },
    GetDay: function (obj) {
        var time = new Date();
        $("#" + obj).empty().html(time.getDate());
    },
    DownFlash: function (obj, falsh_url, width, height) {
        $("#" + obj).flash(
			{
			    src: falsh_url,
			    width: width,
			    height: height
			},
			{ version: 10 }
       );
    },
    CategoryMenu: function (obj, current_class, nocurrent_class, str_where, left, tag, page) {
        var current_obj = this;
        $.post("Handler/CategoryMenu.ashx",
		    { "str_where": str_where, "left": left, "page": page },
		    function (data) {
		        $("#" + obj).empty().html(unescape(data));
		        if (page) {
		            $("#" + obj).children("a").click(function () {
		                $("#sub_menu").remove();
		                current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		            });
		        } else {
		            var child_list = $("#" + obj).children("li").children("ul").hide().first().show();
		            $("#" + obj).find("li").each(function () {
		                if (tag) {
		                    $(this).children("a").click(function () {
		                        current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		                    });
		                    $(this).children("span").children("a").click(function () {
		                        current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		                    });
		                } else {
		                    if ($(this).children("ul").length == 0) {
		                        $(this).children("a").click(function () {
		                            current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		                        });
		                        $(this).children("span").children("a").click(function () {
		                            current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		                        });
		                    }
		                }

		                if ($(this).has("ul")) {
		                    $(this).click(function () {
		                        $(this).children("ul").show().end().siblings().children("ul").hide();
		                    });
		                }
		            });
		        }
		        current_obj.CategoryMenuInit();
		    }
		)
    },
    CategoryMenuClick: function (data, text) {
        return null;
    },
    CategoryMenuInit: function () {
        return null;
    },
    LightPicData: function (s, page_tag, current_id) {
        $.ajax({
            type: "get",
            url: "Handler/GetSGData.ashx",
            data: s,
            beforeSend: function (XMLHttpRequest) {
                $("#hot_image").html("趋势图正在加载中……");
            },
            success: function (data, textStatus) {
                var map = $("#hotspotMapData");
                map.html(data);
                if (current_id)
                    $("#hotclusternode_" + current_id).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                //隐藏文字说明
                $(".hot_node_text").each(function () {
                    $(this).hide();
                });
                if ($.browser.msie) {
                    $(".hotnode").each(function (n) {
                        var width = $(this).width();
                        var height = $(this).height();
                        $(this).html("<div style=\"background-color:#CCC; filter:alpha(opacity=0); width:" + width + "px;height:" + height + "px;\"></div>");
                    });
                }

                $(".hotnode").each(function (n) {

                    $(this).mouseover(function () {
                        $(this).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                        var num = $(this).attr("id").split("_")[1];
                        $("#hotclustertitle_" + num).show();
                    });

                    $(this).mouseout(function () {
                        if ($(this).attr("id") != current_id)
                            $(this).css("border", "none");
                        if (current_id != null)
                            $("#hotclusternode_" + current_id).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                        var num = $(this).attr("id").split("_")[1];
                        $("#hotclustertitle_" + num).hide();
                    });

                    $(this).click(function () {
                        $("#hotclusternode_" + current_id).css("border", "none");
                        current_id = $(this).attr("id").split('_')[1];
                        $(this).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                        var info_list = $(this).attr("pid").split("※");
                        if (page_tag == "index") {
                            location.href = "trend.html?point_id=" + info_list[0] + "&from_time_id=" + info_list[1] + "_&end_time_id=" + info_list[2] + "_&current_id=" + current_id;
                        }
                        else
                            Trend.getSGDataResults(info_list[0], info_list[1], info_list[2]);
                    });
                }); //each end
            },
            complete: function (XMLHttpRequest, textStatus) {
                $("#hot_image").html("舆情趋势图<br/>(点击红色方块，可在右侧区域获取文章列表)");
            },
            error: function () {
                //请求出错处理
            }
        });
    },
    GetJSONLength: function (jsonObject) {
        var propCount = 0;
        for (var prop in jsonObject) {
            propCount++;
        }
        return propCount;
    },
    GetCookie: function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;

        function getCookieVal(offset) {
            var endstr = document.cookie.indexOf(";", offset);
            if (endstr == -1)
                endstr = document.cookie.length;
            return unescape(document.cookie.substring(offset, endstr));
        }
    },
    DisplayHtml: function (data, obj, tag) {
        $("#search_keyword").empty().html(obj.query_params["text"]);
        if (obj.query_params["minscore"] != "0") {
            $("#search_quality").empty().html(obj.query_params["minscore"]);
        } else {
            $("#search_quality").empty();
        }
        var htmlcontent = [];
        delete data["totalcount"];
        delete data["Success"];
        for (var item in data) {
            var entity = data[item];
            var basetitle = unescape(entity["title"]);
            var distitle = basetitle.length > 25 ? basetitle.slice(0, 25) + "..." : basetitle;
            htmlcontent.push("<div class=\"news\"><h1><a name=\"btn_look_info_snapshot\" href=\"" + unescape(entity["href"]) + "\" title=\"" + basetitle + "\" target=\"_blank\">" + distitle + "</a></h1>");

            htmlcontent.push("<h2>");
            htmlcontent.push("【相关度】<code>" + unescape(entity["weight"]) + "</code>　<br />");
            htmlcontent.push("【时间】<span class=\"date\">" + unescape(entity["time"]).slice(0, -3) + "</span><br />");
            htmlcontent.push("【来源】<span class=\"rss\">" + unescape(entity["site"]) + "</span><br />");
            //htmlcontent.push("<a name=\"look_snapshot\" class=\"btn_photo\" pid=\"" + entity["href"] + "\">查看快照</a>");
            //htmlcontent.push("【作者】<span class=\"rss\">" + unescape(entity["author"]) + "</span><br />");
            //htmlcontent.push("【回帖】<span class=\"rss\">" + unescape(entity["replynum"]) + "</span><br />");
            //htmlcontent.push("<a class=\"btn_favorite\" href=\"javascript:void(null);\">关注</a>");
            //htmlcontent.push("<a name=\"article_delete\" class=\"btn_delete\" pid=\"" + unescape(entity["docid"]) + "\" href=\"javascript:void(null);\">删除");
            //htmlcontent.push("<a class=\"btn_add\" href=\"javascript:void(null);\">添加</a>");
            htmlcontent.push("</h2><p>" + unescape(entity["content"]) + "</p>");
            htmlcontent.push("<a name=\"search_suggest_result_" + unescape(entity["docid"]) + "\" style=\"display:none;\" class=\"link_off\" href=\"javascript:void(null);\">相关资讯</a>");
            htmlcontent.push("<ul style=\"display:none;\" class=\"news_list\" id=\"suggest_" + unescape(entity["docid"]) + "\"></ul></div>");
        }
        $("#" + obj.result_id).empty().html(htmlcontent.join(""));
        Common.InitWebURL(obj.result_id, "btn_look_info_snapshot");
        //        $("#" + obj.result_id).find("a[name='look_snapshot']").click(function() {
        //            var web_url = $(this).attr("pid");
        //            if (web_url) {
        //                window.open("snapshot.html?url=" + web_url);
        //            }
        //        });
        Common.Suggest(tag);
        //        $("a[name='article_delete']").click(function() {
        //            if (!confirm("您确定要删除该信息么？")) {
        //                return;
        //            }
        //            var current_obj = this;
        //            var docid = $(this).attr("id").split("_")[1];
        //            $.post(
        //                "Handler/TrainTag.ashx",
        //                { "type": "deletedoc", "docid_list": docid },
        //                function(data) {
        //                    if (data == "success") {
        //                        $(current_obj).parents("div.news").remove();
        //                        alert("删除成功！");
        //                    } else {
        //                        alert("删除失败！");
        //                    }
        //                }
        //            );
        //        });
    },
    Suggest: function (tag) {
        var l_tag = tag;
        var doc_id = [];
        $("*[id^='suggest_']").each(function (n) {
            var l_doc_id = $(this).attr("id").split('_')[1];
            doc_id.push(l_doc_id);
        });
        $("#news_flash").empty();
        $.post("Handler/SuggestResult.ashx",
            { "doc_id_list": doc_id.join(","), "type": "suggest" },
            function (data) {
                if (data) {
                    for (var item in data) {
                        var con = unescape(data[item]);
                        if (con.indexOf("<a href=") == -1) {
                            $("#suggest_" + item).hide();
                            $("[name='search_suggest_result_" + item + "']").hide();
                        }
                        else {
                            $("#suggest_" + item).hide();
                            $("#suggest_" + item).empty().html(con);
                            Common.InitWebURL("suggest_" + item, "look_info_snapshot");
                            //$("[name^='doc_']").show(500);
                            $("[name='search_suggest_result_" + item + "']").show(500);
                            $("[name='search_suggest_result_" + item + "']").click(function () {
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
                            if (l_tag) {
                                $("#news_flash").empty();
                                Common.DownFlash("news_flash", "flash/news.swf?doc_id=s" + item, 600, 550);
                                l_tag = false;
                            }
                        }
                    }
                }
            },
            "json"
        )
    },
    MapArea: { "xj": "新疆", "xz": "西藏", "qh": "青海", "gs": "甘肃", "nmg": "内蒙古", "hlj": "黑龙江", "jl": "吉林",
        "ln": "辽宁", "sd": "山东", "heb": "河北", "shx": "山西", "bj": "北京", "tj": "天津", "sx": "陕西", "nx": "宁夏",
        "hen": "河南", "js": "江苏", "ah": "安徽", "sh": "上海", "zj": "浙江", "jx": "江西", "fj": "福建", "gd": "广东",
        "han": "海南", "gx": "广西", "gz": "贵州", "yn": "云南", "sc": "四川", "cq": "重庆", "hn": "湖南", "hb": "湖北",
        "tw": "台湾", "xg": "香港", "am": "澳门"
    },
    InnitComplexionMap: function () {
        $.post("Handler/ComplexionMap.ashx",
            null,
            function (data) {
                if (data) {
                    delete data["SuccessCode"];
                    Common.Map(data);
                    Common.OtherMapFn(data);
                }
            },
            "json"
        );
    },
    Map: function (data) {
        var current_obj = this;
        var current_div = null;
        var width = $(".ditu").width();
        var height = $(".ditu").height();
        var stand_data = 600;
        for (var item in data) {
            var row = data[item];
            var totalhits = parseInt(row["totalhits"]);
            $(".chinese_" + item).attr("pid", totalhits);
            $(".chinese_" + item).attr("query", unescape(row["queryrule"]));
            if (totalhits >= stand_data) {
                $(".chinese_" + item).empty().html("<img src=\"img/tb_03.gif\" border=\"0\" />");
            }
            else if (totalhits >= 400 && totalhits < stand_data) {
                $(".chinese_" + item).empty().html("<img src=\"img/tb_06.gif\" border=\"0\" />");
            }
            else {
                $(".chinese_" + item).empty().html("<img src=\"img/tb_08.gif\" border=\"0\" />");
            }
        }
        $(".chinese_ditu").children("div").click(function () {
            var categoryid = $(this).attr("query");
            var categoryname = Common.MapArea[$(this).attr("class").split("_")[1]];
            Common.MapAreaClickFn(categoryid, categoryname);
            //Category.InitData(categoryid, categoryname);
            //window.open("ylfl.html?categoryid=" + categoryid + "_&categoryname=" + categoryname);
        });
        $(".chinese_ditu").children("div").each(function (n) {
            $(this).hover(
                function () {
                    var position = $(this).position();
                    var left = position.left;
                    var top = position.top;
                    var div = document.createElement("DIV");
                    $(div).attr("class", "map_cue");
                    if ((left + 105) > width) {
                        if ((top + 55) >= height) {
                            $(div).css({ "left": position.left - 85, "top": position.top - 35 });
                        }
                        else {
                            $(div).css({ "left": position.left - 85, "top": position.top + 15 });
                        }
                    }
                    else {
                        if ((top + 55) >= height) {
                            $(div).css({ "left": position.left + 15, "top": position.top - 35 });
                        }
                        else {
                            $(div).css({ "left": position.left + 15, "top": position.top + 15 });
                        }
                    }
                    current_div = div;
                    $(div).html(Common.MapArea[$(this).attr("class").split("_")[1]] + "<br/>文章数：" + $(this).attr("pid"));
                    $(".chinese_ditu").append(div);
                },
                function () {
                    $(current_div).remove();
                }
          );
        });
    },
    OtherMapFn: function (data) {
        return null;
        //District.InnitChinaArea(data);
    },
    MapAreaClickFn: function (categoryid, categoryname) {
        return null;
    },
    GetTimeStr: function (timestr) {
        if (timestr) {
            timestr = Common.replaceAll(timestr, "-", "/");
            var time = new Date(timestr);
            return time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear();
        }
    },
    GetTimeSpanStr: function (timespan) {
        var time = new Date();
        var parsedatespan = Date.parse(time);
        var newtimespan = parsedatespan + 86400000 * timespan;
        var new_time = new Date(newtimespan);
        return new_time.getFullYear() + "-" + (new_time.getMonth() + 1) + "-" + new_time.getDate();
    },
    replaceAll: function (s, s1, s2) {
        return s.replace(new RegExp(s1, "gm"), s2);
    },
    getActualTimeStr: function (time) {
        var l_time = new Date(parseInt(time) * 1000 + Common.TimeSpan * 24 * 60 * 60 * 1000);
        var year = l_time.getFullYear();
        var month = l_time.getMonth() + 1;
        var day = l_time.getDate();
        var hour = l_time.getHours();
        var minute = l_time.getMinutes();

        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        hour = (hour < 10) ? '0' + hour : hour;
        minute = (minute < 10) ? '0' + minute : minute;

        return year + "-" + month + "-" + day;
    },
    SliceStr: function (str, len) {
        var l_len = 0;
        var str_len = str.length;
        var slice_len = 0;
        for (var i = 0, j = str_len; i < j; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                l_len = l_len + 0.5;
                slice_len++;
            } else {
                l_len = l_len + 1;
                slice_len++;
            }
            if (l_len >= len) {
                break;
            }
        }
        var back_str = str.slice(0, slice_len);
        if (slice_len < str_len) {
            return back_str + "...";
        }
        return back_str;
    },
    InitMarquee: function (obj_id, num, currentheight, parentheight, MarqueTtime, spanTime) {
        var all_height = parseInt($("#" + obj_id).find("li:first").height()) * num;
        $("#" + obj_id).parent("div").css({ "height": parentheight + "px", "overflow": "hidden" });
        $("#" + obj_id).css({ "overflow": "hidden", "z-index": -10, "height": currentheight });
        var height = "-" + all_height + "px";
        var TMarquee = setInterval(Marquee, MarqueTtime);
        $("#" + obj_id).find("li").hover(
	        function () {
	            clearInterval(TMarquee);
	        },
	        function () {
	            TMarquee = setInterval(Marquee, MarqueTtime);
	        }
	    );
        function Marquee() {
            //            $("#" + obj_id).animate({
            //                marginTop: height
            //            }, spanTime, function() {                
            //                var current_obj = this;
            //                $(this).find("li").each(function(n) {
            //                    if (n < num) {
            //                        $(this).appendTo(current_obj);
            //                    }
            //                });
            //                $(this).css({ marginTop: "0px" });
            //            });
            var current_obj = $("#" + obj_id);
            $("#" + obj_id).find("li").each(function (n) {
                if (n < num) {
                    $(this).fadeIn(spanTime + n * 15);
                    $(this).appendTo(current_obj);
                    $(this).show();
                }
            });
        }
    },
    InitWebURL: function (parentid, tagname, type) {
        $("#" + parentid).find("a[name='" + tagname + "']").each(function () {
            var url = $(this).attr("href");
            if (type) {
                url = $(this).attr("pid");
            }
            if (url) {
                //alert(encodeURI(url));
                if (type) {
                    $(this).attr("href", "article.html?id=" + url + "_");
                } else {
                    $(this).attr("href", "snapshot.html?url=" + escape(url));
                }
            }
        });
    }, //g_div 背景层，模拟锁屏的层
    ShowEditFrame: function (g_div, child_div, parent_div, close_btn) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
        var top = document.documentElement.scrollTop;
        var left = document.documentElement.scrollLeft;
        var height = document.documentElement.clientHeight + 20;
        var width = document.documentElement.clientWidth + 20;
        $("#" + g_div).css("top", top + "px");
        $("#" + g_div).css("left", left + "px");
        $("#" + g_div).css("width", width + "px");
        $("#" + g_div).css("height", height + "px");
        $("#" + g_div).css("backgroundColor", "#000");
        $("#" + g_div).css("opacity", "0.5"); //div层透明度为50%，在FF下
        $("#" + g_div).css("position", "absolute");
        $("#" + parent_div).show();
        $("#" + g_div).show();
        $("html").css("overflow", "hidden");

        var l_height = parseInt($("#layer_inner").height()) / 2;
        var l_width = parseInt($("#" + child_div).width()) / 2;
        //alert(l_height);
        var body_offsetTop = $(document).scrollTop() + 150;
        $("#" + parent_div).css({ "position": "absolute", "top": (top + height / 2 - l_height) + "px", "left": (left + width / 2 - l_width) + "px" });
        $("#" + close_btn).click(function () {
            $("#" + parent_div).hide();
            $("#" + g_div).hide();
            $("html").css("overflow", "");
        });
        var div_move = new divMove(child_div, parent_div);
        div_move.init();
        var mydiv = $("#" + g_div);
        var mydiv_resize = function () {
            mydiv.css("top", document.documentElement.scrollTop + "px");
            mydiv.css("left", document.documentElement.scrollLeft + "px");
            mydiv.height(document.body.clientHeight);
            mydiv.width(document.body.clientWidth);
        }
        window.onresize = mydiv_resize;
    }
}

function SelectFrame(btn_obj, select_obj) {
    this.btn_obj = btn_obj;
    this.select_obj = select_obj;
}

SelectFrame.prototype.CreateSelectFrame = function (btn_obj, select_obj) {
    var tag = false;
    $("#" + btn_obj).click(function () {
        if (!tag) {
            $("#" + select_obj).show();
            tag = true;
        } else {
            $("#" + select_obj).hide();
            tag = false;
        }
    });
    var current_obj = this;
    $("#" + select_obj).find("input").click(function () {
        var val = $(this).val();
        var type = $(this).attr("pid");
        current_obj.SelectClickFn(val);
        $("#" + btn_obj).empty().html(type);
        $("#" + select_obj).hide();
        tag = false;
    });
}
SelectFrame.prototype.SelectClickFn = function (val) {
    return null;
}



function SqlList() {
}
SqlList.prototype = {
    initData: { "page_size": 10, "result_id": "SearchResult", "status_bar_id": "PagerList", "post_url": "SqlSearch.ashx" },
    SqlQueryParams: { "action": "", "strwhere": "", "strorder": "", "display_style": 6 },
    Search: function () {
        var obj = this;
        if (obj.SqlQueryParams["action"]) {
            var Lpager = new Pager(obj.initData);
            Lpager.Display = function (data, l_obj) {
                obj.DisplayHtml(data, l_obj);
            };
            Lpager.LoadData(1, obj.SqlQueryParams);
        }
    },
    DisplayHtml: function (data, l_obj) {
        return null;
    }
}



var _flashchart = new Object;
var FlashChart = _flashchart.property = {
    GetLineXmlData: function (headparams, data, disYcount, totalcount) {
        var content = [];
        content.push(FlashChart.GetXmlHead(headparams));
        var dispan = parseInt(totalcount / disYcount);
        var count = 0;
        for (var item in data) {
            if (count % dispan == 0) {
                content.push("<set name='" + item + "' value='" + parseInt(data[item]) + "'/>");
            } else {
                content.push("<set name='' value='" + parseInt(data[item]) + "'/>");
            }
            count++;
        }
        content.push("</graph>");
        return content.join("");
    },
    GetXmlHead: function (params) {
        var content = [];
        content.push("<?xml version='1.0' encoding='gb2312'?>");
        content.push("<graph");
        /*设置标题*/
        var caption = params.caption;
        if (caption) {
            content.push(" caption='" + caption + "' ");
        }
        /*设置X轴名称*/
        var xaxisname = params.xaxisname;
        if (xaxisname) {
            content.push(" xAxisName='" + xaxisname + "'");
        }
        /*设置小数位的位数，默认为0*/
        var decimalprecision = params.decimalprecision == null ? "0" : params.decimalprecision;
        content.push(" decimalPrecision='" + decimalprecision + "'");

        /*设置画布边框厚度，默认为1*/
        var canvasborderthickness = params.canvasborderthickness == null ? "1" : params.canvasborderthickness;
        content.push(" canvasBorderThickness='" + canvasborderthickness + "'");

        /*设置画布边框颜色，默认为a5d1ec*/
        var canvasbordercolor = params.canvasbordercolor == null ? "a5d1ec" : params.canvasbordercolor;
        content.push(" canvasBorderColor='" + canvasbordercolor + "'");

        /*设置图标字体大小，默认为12*/
        var basefontsize = params.basefontsize == null ? "12" : params.basefontsize;
        content.push(" baseFontSize='" + basefontsize + "'");

        /*设置是否格式化数据（如3000为3K），默认为0(否)*/
        var formatnumberscale = params.formatnumberscale == null ? "0" : params.formatnumberscale;
        content.push(" formatNumberScale='" + formatnumberscale + "'");

        /*设置是否显示横向坐标轴(x轴)标签名称，默认为1(是)*/
        var shownames = params.shownames == null ? "1" : params.shownames;
        content.push(" showNames='" + shownames + "'");

        /*设置是否在图表显示对应的数据值，默认为0（否）*/
        var showvalues = params.showvalues == null ? "0" : params.showvalues;
        content.push(" showValues='" + showvalues + "'");

        /*设置是否在横向网格带交替的颜色，默认为1（是）*/
        var showalternatehgridcolor = params.showalternatehgridcolor == null ? "1" : params.showalternatehgridcolor;
        content.push(" showAlternateHGridColor='" + showalternatehgridcolor + "'");

        /*设置横向网格带交替的颜色，默认为ff5904*/
        var alternatehgridcolor = params.alternatehgridcolor == null ? "ff5904" : params.alternatehgridcolor;
        content.push(" AlternateHGridColor='" + alternatehgridcolor + "'");

        /*设置水平分区线颜色，默认为ff5904*/
        var divlinecolor = params.divlinecolor == null ? "ff5904" : params.divlinecolor;
        content.push(" divLineColor='" + divlinecolor + "'");

        /*设置水平分区线透明度，默认为20*/
        var divlinealpha = params.divlinealpha == null ? "20" : params.divlinealpha;
        content.push(" divLineAlpha='" + divlinealpha + "'");

        /*设置横向网格带的透明度，默认为5*/
        var alternatehgridalpha = params.alternatehgridalpha == null ? "5" : params.alternatehgridalpha;
        content.push(" alternateHGridAlpha='" + divlinealpha + "'");

        /*以下为折线图的各项参数*/
        if (params.type == "brokenline") {
            /*设置折线节点半径，默认为0*/
            var anchorradius = params.anchorradius == null ? "0" : params.anchorradius;
            content.push(" anchorRadius='" + anchorradius + "'");
        }
        content.push(" >");
        return content.join("");
    },
    InsertFusionChartsByDataUrl: function (flash_url, vector_id, data_url, width, height) {
        var chart = new FusionCharts(flash_url, vector_id, width, height);
        chart.setDataURL(data_url);
        chart.render(vector_id);
    },
    InsertFusionChartsByDataXml: function (flash_url, vector_id, data_xml, width, height) {
        var chart = new FusionCharts(flash_url, vector_id, width, height);
        chart.setDataXML(data_xml);
        chart.render(vector_id);
    }
}