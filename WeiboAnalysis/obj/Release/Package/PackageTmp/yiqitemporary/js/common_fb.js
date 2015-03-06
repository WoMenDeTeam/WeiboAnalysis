// JavaScript Document
var Config = {
    //热点岛图的JOBNAME
    IndexHotMapJob: "safejob_clusters",
    //获取热点岛图图片的链接
    IdolImgUrl: "Handler/GetImage.ashx",
    //光谱图的JOBNAME
    SGMapJob: "myjob_SG",
    //舆情周报的前缀
    ReportHttp: "http://123.103.15.153:8188/Admin/reportcontent/",    
    //热点关键词
    HotWords: "福利彩票,养老,收养",
    //过滤关键词组
    FilterKeyWords: "福利彩票,社团组织,社会组织,养老,居家养老,收养,殡葬,陵园,婚姻登记,村民自治,村民选举,社区选举,慈善,民政系统反腐倡廉",
    //IDOL服务器与WEB应用服务器的时间差，以天为单位
    TimeSpan: 0,
    //微博所对应的IDOL库名
    weibodatabase: "WeiboAnjian",
    //微博查询数据是需要返回的字段，默认为全部
    weiboprintfields: "DREDATE,DOMAINSITENAME",
    //民政新闻
    MinZhengNews: "NewAnjian",
    //民政论坛
    MinZhengBBS:"bbs",
    //IDOL对应的所有库名
    AllDataBase:"mingzh+newssource+bbs+MINZHWEIBO",
    //专题追踪的父级栏目ID
    ThemeParentCate: 412,
    //民政库
    MinzhengDB: "mingzh",
    //民政库字段
    MinzhengPrintFields: "DRETITLE,MYSITENAME,MYDREDATE,DREDATE,DOMAINSITENAME,SAMENUM"
}


var _Common = new Object;
var Common = _Common.prototype = {
    //初始化页面底部的版本信息
    InnitCopyright: function() {
        //var info_str = "<span class=\"left\">主办单位：国家安全生产监督管理总局<br />"
        //+ "承办单位：国家安全生产监督管理总局通信信息中心 </span><span class=\"right\">"
        //+ "<span class=\"left\">办公室电话：</span>"
        //+ "(010)64464191<br />(010)64464271 </span>"
        //+ "<div class=\"clear\"></div>"
        //+ "网站管理员邮箱:wlyq@chinasafety.gov.cn<br />（浏览本网主页，建议将电脑显示屏的分辨率调为1024*768）";
        //$("#footer_info").empty().html(info_str);
    },
    //导航条对应的名称和链接
    NavData: { "subnav_3": { "周报": "zblist.html?type=1", "专报": "zblist.html?type=2", "其他": "zblist.html?type=3" },
        "subnav_4": { "舆情专题": "ylzt.html", "舆情热点": "hotlist.html" }
    },
    //初始化导航条
    InnitSurveyData: function() {
        var innitData = { "subnav_1": { "DisCount": 8, "disurl": "ylfl.html", "moreurl": "ylfllist.html" },
            "subnav_2": { "DisCount": 5, "disurl": "district.html", "moreurl": "district.html" }
        };
        var postparams = { "subnav_1": "411", "subnav_2": "312" };
        $.post("Handler/GetSurveyData.ashx",
            postparams,
            function(data) {
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
    //热点关键词所包含的容器
    HotKeyWordDiv: null,
    //记录用户访问LOG
    LogVisitor: function() {
        $.post("Handler/User.ashx", { 'action': 'log_visitor', 'page_url': location.href },
            function(Data, textStatus) {

            }, "json");
    },    
    //检查用户是否登录，其他JS类里必须实现该函数
    CheckUser: function() {
        $.post("Handler/User.ashx", { 'action': 'check_user' },
            function(Data, textStatus) {
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
                    location.href = "login.html";
                    //location.href = unescape(Data.path);
                }
            }, "json");
    },
    //初始化整个页面的键盘事件
    InitBodyClick: function() {
        $("body").keyup(function(e) {
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
    //初始化输入前提示，与inputcue.js相关联
    InitCueInput: function() {
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
    //初始化关键词的点击事件
    InnitHotKeyWordClickFn: function() {
        $("#look_hot_keyword").click(function(e) {
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
                var word_list = Config.HotWords.split(',');
                for (var i = 0, j = word_list.length; i < j; i++) {
                    content.push("<li><a name=\"hot_word_item\" href=\"javascript:void(null)\">");
                    content.push(word_list[i] + "</a></li>");
                }
                content.push("</ul>");
                $(div).html(content.join(""));
                $(".search").find(".search_line_2").first().before($(div));
                Common.HotKeyWordDiv = div;
                $("#close_keyword_frame").click(function() {
                    $(Common.HotKeyWordDiv).hide();
                    $(Common.HotKeyWordDiv).attr("pid", "0");
                });
                $("a[name='hot_word_item']").click(function() {
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
    //显示用户名
    DisUserName: function(data) {
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
    //确认登录后的函数，可在具体JS中重写该方法
    LoginEventFn: function(data) {
        return null;
    },
    //初始化按钮
    InnitBtnFn: function() {
        $("#btn_search").click(function() {
            Common.ClickFn();
        });
    },
    ClickFn: function() {
        var keyword = $.trim($("#keyword").val());
        if (!keyword || keyword == "输入您关注的内容关键字...") {
            return;
        }
        location.href = ("search.html?keyword=" + keyword + "&searchButton=搜索");
    },

    InnitCategoryList: function(data) {
        return null;
    },

    InnitNavList: function(menudata) {
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
    InnitOtherNavList: function() {
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
    //选项卡
    TabControl: function(s, current_class, nocurrent_class) {
        var TabList = [];
        var DisList = [];
        for (var item in s) {
            TabList.push(item);
            DisList.push(s[item]);
        }
        for (var i = 0, j = TabList.length; i < j; i++) {
            $("#" + TabList[i]).click(function() {
                for (var k = 0; k < j; k++) {
                    $("#" + TabList[k]).attr("class", nocurrent_class);
                    $("#" + DisList[k]).hide();
                }
                $(this).attr("class", current_class);
                $("#" + s[$(this).attr("id")]).show();
            });
        }
    },
    /*
    *嵌入flash
    * @param string 容器的ID值
    * @param string flash的URL地址
    * @param int flash的宽度
    * @param int flash的高度
    */
    DownFlash: function(obj, falsh_url, width, height) {
        $("#" + obj).flash(
			{
			    src: falsh_url,
			    width: width,
			    height: height
			},
			{ version: 10 }
       );
    },
    //初始化光谱图   
    LightPicData: function(s, page_tag, current_id) {
        $.ajax({
            type: "get",
            url: "Handler/GetSGData.ashx",
            data: s,
            beforeSend: function(XMLHttpRequest) {
                $("#hot_image").html("趋势图正在加载中……");
            },
            success: function(data, textStatus) {
                var map = $("#hotspotMapData");
                map.html(data);
                if (current_id)
                    $("#hotclusternode_" + current_id).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                //隐藏文字说明
                $(".hot_node_text").each(function() {
                    $(this).hide();
                });
                if ($.browser.msie) {
                    $(".hotnode").each(function(n) {
                        var width = $(this).width();
                        var height = $(this).height();
                        $(this).html("<div style=\"background-color:#CCC; filter:alpha(opacity=0); width:" + width + "px;height:" + height + "px;\"></div>");
                    });
                }

                $(".hotnode").each(function(n) {

                    $(this).mouseover(function() {
                        $(this).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                        var num = $(this).attr("id").split("_")[1];
                        $("#hotclustertitle_" + num).show();
                    });

                    $(this).mouseout(function() {
                        if ($(this).attr("id") != current_id)
                            $(this).css("border", "none");
                        if (current_id != null)
                            $("#hotclusternode_" + current_id).css({ "border-right": "2px solid white", "border-left": "2px solid white" });
                        var num = $(this).attr("id").split("_")[1];
                        $("#hotclustertitle_" + num).hide();
                    });

                    $(this).click(function() {
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
            complete: function(XMLHttpRequest, textStatus) {
                $("#hot_image").html("舆情趋势图<br/>(点击红色方块，可在右侧区域获取文章列表)");
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    //获取json对象的长度
    GetJSONLength: function(jsonObject) {
        var propCount = 0;
        for (var prop in jsonObject) {
            propCount++;
        }
        return propCount;
    },
    //获取cookie值
    GetCookie: function(name) {
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
    /*
    *IDOL数据展示
    * @param 返回的json数据
    * @param pager类，具体实现方法参考pager.js
    * @param 
    */
    DisplayHtml: function(data, obj, tag) {
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
            if (obj.dissamenews) {
                if (unescape(entity["samenum"]) > 0) {
                    //相同新闻
                    htmlcontent.push("<a name=\"search_samelinksuggest_result_" + unescape(entity["docid"]) + "\"  style=\"display:none;\"  class=\"link_off2\" href=\"javascript:void(null);\"></a>");
                    htmlcontent.push("<ul style=\"display:none;\" class=\"news_list\" samenum=\"" + unescape(entity["samenum"]) + "\" hiddentxt=\"" + entity["href"] + "\" id=\"samelinksuggest_" + unescape(entity["docid"]) + "\"></ul>");
                }
            } else {
                htmlcontent.push("<a name=\"search_suggest_result_" + unescape(entity["docid"]) + "\" style=\"display:none;\" class=\"link_off\" href=\"javascript:void(null);\">相关资讯</a>");
                htmlcontent.push("<ul style=\"display:none;\" class=\"news_list\" id=\"suggest_" + unescape(entity["docid"]) + "\"></ul>");
            }
            htmlcontent.push("</div>");
        }
        $("#" + obj.result_id).empty().html(htmlcontent.join(""));
        Common.InitWebURL(obj.result_id, "btn_look_info_snapshot");
        if (obj.dissamenews) {
            Common.SameLinkSuggest(tag);
        }
        else {
            Common.Suggest(tag);
        }
    },
    //展示相关资讯
    Suggest: function(tag) {
        var l_tag = tag;
        var doc_id = [];
        $("*[id^='suggest_']").each(function(n) {
            var l_doc_id = $(this).attr("id").split('_')[1];
            doc_id.push(l_doc_id);
        });
        $("#news_flash").empty();
        $.post("Handler/SuggestResult.ashx",
            { "doc_id_list": doc_id.join(","), "type": "suggest" },
            function(data) {
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
                            $("[name='search_suggest_result_" + item + "']").click(function() {
                                var suggest_info = $(this).siblings("ul[id^='suggest_']");
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
    //展示相关新闻
    SameLinkSuggest: function(tag) {
        var l_tag = tag;
        var doc_link = [];
        if ($("*[id^='samelinksuggest_']").length > 0) {
            $("*[id^='samelinksuggest_']").each(function(n) {
                var l_doc_link = $(this).attr("id").split('_')[1] + "~" + $(this).attr("hiddentxt") + "~" + $(this).attr("samenum");
                doc_link.push(l_doc_link);
            });

            $.post("Handler/SuggestResult.ashx",
            { "doc_link_list": doc_link.join(","), "type": "sameNewsSuggest" },
            function(data) {
                if (data) {
                    for (var item in data) {
                        var con = unescape(data[item]);

                        if (con.indexOf("<a href=") == -1) {
                            $("#samelinksuggest_" + item).hide();
                            $("[name='search_samelinksuggest_result_" + item + "']").hide();
                        }
                        else {
                            $("#samelinksuggest_" + item).hide();
                            $("#samelinksuggest_" + item).empty().html(con);
                            Common.InitWebURL("samelinksuggest_" + item, "look_info_snapshot");
                            $("[name='search_samelinksuggest_result_" + item + "']").width("120px");
                            $("[name='search_samelinksuggest_result_" + item + "']").text("共有" + $(con + "li").length + "条相同新闻");
                            $("[name='search_samelinksuggest_result_" + item + "']").show(500);
                            $("[name='search_samelinksuggest_result_" + item + "']").click(function() {
                                var suggest_info = $(this).siblings("ul[id^='samelinksuggest_']");
                                $("#newsCount").text("相同新闻(" + $(con + "li").length + ")");
                                var show_tag = $(suggest_info).attr("pid");
                                if (undefined == show_tag || show_tag == "0") {
                                    $("#news_list").empty().html($(suggest_info).html());
                                    Common.ShowEditFrame("sad", "layer_inner", "layer", "btn_close");
                                } else {
                                    $(suggest_info).hide();
                                }
                            });
                        }
                    }

                }
            },
            "json"
        );

        }
    },
    //MAP所对应地区以及编号
    MapArea: { "xj": "新疆", "xz": "西藏", "qh": "青海", "gs": "甘肃", "nmg": "内蒙古", "hlj": "黑龙江", "jl": "吉林",
        "ln": "辽宁", "sd": "山东", "heb": "河北", "shx": "山西", "bj": "北京", "tj": "天津", "sx": "陕西", "nx": "宁夏",
        "hen": "河南", "js": "江苏", "ah": "安徽", "sh": "上海", "zj": "浙江", "jx": "江西", "fj": "福建", "gd": "广东",
        "han": "海南", "gx": "广西", "gz": "贵州", "yn": "云南", "sc": "四川", "cq": "重庆", "hn": "湖南", "hb": "湖北",
        "tw": "台湾", "xg": "香港", "am": "澳门"
    },
    //初始化地区热点分布图
    InnitComplexionMap: function() {
        $.post("Handler/ComplexionMap.ashx",
            null,
            function(data) {
                if (data) {
                    delete data["SuccessCode"];
                    Common.Map(data);
                    Common.OtherMapFn(data);
                }
            },
            "json"
        );
    },
    Map: function(data) {
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
        $(".chinese_ditu").children("div").click(function() {
            var categoryid = $(this).attr("query");
            var categoryname = Common.MapArea[$(this).attr("class").split("_")[1]];
            Common.MapAreaClickFn(categoryid, categoryname);
            //Category.InitData(categoryid, categoryname);
            //window.open("ylfl.html?categoryid=" + categoryid + "_&categoryname=" + categoryname);
        });
        $(".chinese_ditu").children("div").each(function(n) {
            $(this).hover(
                function() {
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
                function() {
                    $(current_div).remove();
                }
          );
        });
    },
    OtherMapFn: function(data) {
        return null;
        //District.InnitChinaArea(data);
    },
    MapAreaClickFn: function(categoryid, categoryname) {
        return null;
    },
    //获取IDOL对应时间字符串 dd/MM/yyyy
    GetTimeStr: function(timestr) {
        if (timestr) {
            timestr = Common.replaceAll(timestr, "-", "/");
            var time = new Date(timestr);
            return time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear();
        }
    },
    GetTimeSpanStr: function(timespan) {
        var time = new Date();
        var parsedatespan = Date.parse(time);
        var newtimespan = parsedatespan + 86400000 * timespan;
        var new_time = new Date(newtimespan);
        return new_time.getFullYear() + "-" + (new_time.getMonth() + 1) + "-" + new_time.getDate();
    },
    //对字符串进行正则替换
    replaceAll: function(s, s1, s2) {
        return s.replace(new RegExp(s1, "gm"), s2);
    },
    getActualTimeStr: function(time) {
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
    SliceStr: function(str, len) {
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
    InitMarquee: function(obj_id, num, currentheight, parentheight, MarqueTtime, spanTime) {
        var all_height = parseInt($("#" + obj_id).find("li:first").height()) * num;
        $("#" + obj_id).parent("div").css({ "height": parentheight + "px", "overflow": "hidden" });
        $("#" + obj_id).css({ "overflow": "hidden", "z-index": -10, "height": currentheight });
        var height = "-" + all_height + "px";
        var TMarquee = setInterval(Marquee, MarqueTtime);
        $("#" + obj_id).find("li").hover(
	        function() {
	            clearInterval(TMarquee);
	        },
	        function() {
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
            $("#" + obj_id).find("li").each(function(n) {
                if (n < num) {
                    $(this).fadeIn(spanTime + n * 15);
                    $(this).appendTo(current_obj);
                    $(this).show();
                }
            });
        }
    },
    InitWebURL: function(parentid, tagname, type) {
        $("#" + parentid).find("a[name='" + tagname + "']").each(function() {
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
    },
    //g_div 背景层，模拟锁屏的层
    ShowEditFrame: function(g_div, child_div, parent_div, close_btn) {
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

        var l_height = parseInt($("#" + child_div).height()) / 2;
        var l_width = parseInt($("#" + child_div).width()) / 2;
        var body_offsetTop = $(document).scrollTop() + 150;
        $("#" + parent_div).css({ "position": "absolute", "top": top + height / 2 - l_height + "px", "left": left + width / 2 - l_width + "px" });
        $("#" + close_btn).click(function() {
            $("#" + parent_div).hide();
            $("#" + g_div).hide();
            $("html").css("overflow", "");
        });
        var div_move = new divMove(child_div, parent_div);
        div_move.init();
        var mydiv = $("#" + g_div);
        var mydiv_resize = function() {
            mydiv.css("top", document.documentElement.scrollTop + "px");
            mydiv.css("left", document.documentElement.scrollLeft + "px");
            mydiv.height(document.body.clientHeight);
            mydiv.width(document.body.clientWidth);
        }
        window.onresize = mydiv_resize;
    },
    //显示微博数据
    DisplayWeiboHTML: function(data, l_obj) {
        Common.weibojson = {};
        if (parseInt(data["totalcount"]) > 0) {
            delete data["totalcount"];
            delete data["Success"];
            var content = [];
            var count = 0;
            var base_num = l_obj.query_params["start"];
            var entitylist = data;
            for (var item in entitylist) {
                var l_dis_num = base_num + count;
                var entity = entitylist[item];
                var contenthtml = unescape(entity["content"]);
                content.push("<li><span class=\"");
                if (l_dis_num <= 3) {
                    content.push("num red");
                } else {
                    content.push("num");
                }
                content.push("\">" + l_dis_num + "</span>");
                content.push("<span class=\"text\"><a href=\"" + unescape(entity["href"]) + "\" target=\"_blank\">");
                content.push(contenthtml + "</a></span>");
                content.push("<span class=\"name\">【转发】<b class=\"color_2\">" + entity["forwardnum"] + "</b>");
                content.push("【评论】<b class=\"color_2\">" + entity["replynum"] + "</b><br />");
                content.push("【时间】<b class=\"color_7\">" + unescape(entity["publishtime"]) + "</b><br />");
                content.push("【作者】<a href=\"" + unescape(entity["authorurl"]) + "\" target=\"_blank\">" + unescape(entity["author"]) + "</a></span>");
                content.push("<div class=\"clear\"></div>");
                content.push("<a name=\"search_suggest_result_" + entity["docid"] + "\" style=\"display:none;\" class=\"link_off\" href=\"javascript:void(null);\">原微博</a>");
                content.push("<ul style=\"display:none;\" cate=\"" + entity["sourceurl"] + "\" class=\"news_list\" id=\"suggest_" + entity["docid"] + "\"></ul>");
                content.push("</li>");
                Common.weibojson[entity["sourceurl"]] = entity["docid"];
                count++;
            }
            $("#" + l_obj.result_id).empty().html(content.join(""));
            Common.WeiBoSuggest();
        } else {
            $("#" + l_obj.result_id).empty().html("<li><center>对不起，没有数据。</center></li>");
        }
    },
    WeiBoSuggest: function() {
        var doc_url = [];
        $("*[id^='suggest_']").each(function(n) {
            var l_doc_url = $(this).attr("cate");
            if (l_doc_url) {
                doc_url.push(unescape(l_doc_url));
            }
        });
        $("#news_flash").empty();
        if (doc_url.length > 0) {
            $.post("Handler/SuggestResult.ashx",
                { "doc_url_list": escape(doc_url.join(",")), "type": "weibosuggest" },
                function(data) {
                    if (data) {
                        for (var item in data) {
                            var con = unescape(data[item]);
                            if (con.indexOf("<a href=") == -1) {
                                $("#suggest_" + item).hide();
                                $("[name='search_suggest_result_" + item + "']").hide();
                            }
                            else {
                                var id_item = Common.weibojson[item];
                                $("#suggest_" + id_item).hide();
                                $("#suggest_" + id_item).empty().html(con);
                                //Common.InitWebURL("suggest_" + item, "look_info_snapshot");
                                //$("[name^='doc_']").show(500);
                                $("[name='search_suggest_result_" + id_item + "']").show(500);
                                $("[name='search_suggest_result_" + id_item + "']").click(function() {
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
                            }

                        }
                    }
                },
                "json"
            );
        }
    }
}

function SelectFrame(btn_obj, select_obj) {
    this.btn_obj = btn_obj;
    this.select_obj = select_obj;
}

SelectFrame.prototype.CreateSelectFrame = function(btn_obj, select_obj) {
    var tag = false;
    $("#" + btn_obj).click(function() {
        if (!tag) {
            $("#" + select_obj).show();
            tag = true;
        } else {
            $("#" + select_obj).hide();
            tag = false;
        }
    });
    var current_obj = this;
    $("#" + select_obj).find("input").click(function() {
        var val = $(this).val();
        var type = $(this).attr("pid");
        current_obj.SelectClickFn(val);
        $("#" + btn_obj).empty().html(type);
        $("#" + select_obj).hide();
        tag = false;
    });
}
SelectFrame.prototype.SelectClickFn = function(val) {
    return null;
}


/*访问数据库的JS类*/
function SqlList() {
}
SqlList.prototype = {
    initData: { "page_size": 10, "result_id": "SearchResult", "status_bar_id": "PagerList", "post_url": "SqlSearch.ashx" },
    SqlQueryParams: { "action": "", "strwhere": "", "strorder": "", "display_style": 6 },
    Search: function() {
        var obj = this;
        if (obj.SqlQueryParams["action"]) {
            var Lpager = new Pager(obj.initData);
            Lpager.Display = function(data, l_obj) {
                obj.DisplayHtml(data, l_obj);
            };
            Lpager.LoadData(1, obj.SqlQueryParams);
        }
    },
    DisplayHtml: function(data, l_obj) {
        return null;
    }
}


/*flashchart类*/
var _flashchart = new Object;
var FlashChart = _flashchart.property = {
    GetLineXmlData: function(headparams, data, disYcount, totalcount) {
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
    GetXmlHead: function(params) {
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
    InsertFusionChartsByDataUrl: function(flash_url, vector_id, data_url, width, height) {
        var chart = new FusionCharts(flash_url, vector_id, width, height);
        chart.setDataURL(data_url);
        chart.render(vector_id);
    },
    InsertFusionChartsByDataXml: function(flash_url, vector_id, data_xml, width, height) {
        var chart = new FusionCharts(flash_url, vector_id, width, height);
        chart.setDataXML(data_xml);
        chart.render(vector_id);
    }
}