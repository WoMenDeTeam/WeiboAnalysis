/// <reference path="common.js" />


$(document).ready(function () {
    /*对Common.InnitCategoryList进行重写*/
    Common.InnitCategoryList = function (data) {
        NewIndex.InnitCategory(data);
    }
    /*对登录后事件进行重写*/
    Common.LoginEventFn = function (data) {
        NewIndex.Innit();
    }
    Common.CheckUser();
});

var _newindex = new Object;
var NewIndex = _newindex.property = {
    query_params: { "action": "categoryquery", "display_style": 6, "totalresults": "true",
        "summary": "context", "sort": "Date", "characters": "600"
    },
    ClustersList: { "society_clusters": "SAFEJOB_CLUSTERS" },
    Innit: function () {
        /*初始化首页上的各个选项单*/
        NewIndex.InnitSelectFn();
        /*初始化首页上的各个选项卡*/
        NewIndex.InnitTabClickFn();
        /*初始化热点聚焦*/
        NewIndex.InnitClusters();
        /*初始化今日预警*/
        NewIndex.InitSentiveWord("sensive");
        /*初始化地区分类*/
        NewIndex.InnitAreaMapAndList();
        /*初始化重点专题*/
        NewIndex.InnitEventSQ();
        /*初始化周报列表*/
        NewIndex.InnitWeekReport("week");
        /*初始化博客论坛热议*/
        NewIndex.InnitBlogBbsHot();

        NewIndex.InitClickFn();

        NewIndex.InitVideo();
        //查二期的微博热度预警的微博
        //NewIndex.InitWeibo();
        //根据关键字查询热度微博
        NewIndex.InitWeibo2();
    },
    /*初始化第二屏的信息分类*/
    InnitCategory: function (data) {
        var list = data["subnav_1"];
        var count = 1;
        var s = {};
        var frame = "special_category";
        var content = [];
        var innitcategory = null;
        for (var item in list) {
            content.push("<li class=\"");
            if (count == 1) {
                innitcategory = item;
                content.push("tab_on");
            } else {
                content.push("tab_off");
            }
            content.push("\" id=\"special_category_" + item + "\"><a href=\"javascript:void(null);\">");
            content.push(unescape(list[item]) + "</a></li>");
            var tab = "special_category_" + item;
            s[tab] = frame;
            count++;
        }
        /*初始化事故信息按钮*/
        content.push("<li class=\"tab_off\"");
        content.push("\" id=\"special_category_swsg_200\"><a href=\"javascript:void(null);\">");
        content.push("事故信息</a></li>");
        var tab = "special_category_swsg_200";
        s[tab] = "special_swsg";
        $("#category_list").empty().html(content.join(""));
        /*初始化舆情快报*/
        NewIndex.InitPublicCategory(innitcategory);
        Common.TabControl(s, "tab_on", "tab_off");
    },
    /*初始化新闻、论坛、博客分类信息的点击事件*/
    InitClickFn: function () {
        $("*[id^='btn_look_']").click(function () {
            var info = $("#category_list").find("li[class='tab_on']").attr("id").split('_');
            var categoryid = info[2];
            var categoryname = $("#category_list").find("li[class='tab_on']").children("a").html();
            var tag = $(this).attr("id").split('_')[2];
            window.open("ylfl.html?categoryid=" + categoryid + "_&categoryname=" + categoryname + "&type=" + tag);
        });
    },
    /*初始化敏感词预警*/
    InitSentiveWord: function (type) {
        $("#sentive_word").empty().html("<img src=\"img/loading_icon.gif\" alt=\"loading...\" />");
        $.post("Handler/Warning.ashx", { "type": type }, function (data) {
            if (data) {
                delete data["SuccessCode"];
                var content = [];
                if (type == "sensive") {
                    for (var item in data) {
                        var keyword = unescape(item).split('_')[0];
                        var row = data[item];
                        var href = unescape(row["href"]);
                        var basetitle = unescape(row["title"]);
                        var distitle = Common.SliceStr(basetitle, 22);
                        content.push("<li><a name=\"look_info_snapshot\" target=\"_blank\" title=\"" + basetitle + "\" href=\"" + href + "\">");
                        content.push("<span class=\"text\" >" + distitle + "</span>");
                        content.push("<span class=\"date\">" + unescape(row["time"]) + "</span></a>");
                        //content.push("<a class=\"color_2\" title=\"查看更多" + keyword + "相关信息\"");
                        //content.push(" href=\"search.html?keyword=" + keyword + "\" target=\"_blank\"></a>");
                        //content.push("<span class=\"rss\">敏感词：</span>");
                        //content.push("<b class=\"color_2\">" + keyword + "</b></a>");
                        content.push("</li>");
                    }
                } else {
                    var stand_view_num = 500;
                    for (var item in data) {
                        var row = data[item];
                        var href = unescape(row["href"]);
                        var viewnum = parseInt(unescape(row["viewcount"]));
                        if (viewnum >= stand_view_num) {
                            var persent = stand_view_num / viewnum * 100;
                            var basetitle = unescape(row["title"]);
                            var distitle = Common.SliceStr(basetitle, 22);
                            content.push("<li><a name=\"look_info_snapshot\" href=\"" + href + "\" title=\"" + basetitle + "\" target=\"_blank\">");
                            content.push("<span class=\"text\">" + distitle + "</span><span class=\"rate\">预警：<b class=\"color_3\">" + stand_view_num + "</b>");
                            content.push(" 访问：<b class=\"color_2\">" + viewnum + "</b></span>");
                            content.push("<span class=\"rule\"><b style=\"width:" + persent + "%;\"></b></span></a></li>");
                        }
                    }
                }

                if (content.length > 0) {
                    $("#sentive_word").empty().html(content.join(""));
                    Common.InitWebURL("sentive_word", "look_info_snapshot");
                    //HCmarquee("sentive_word", 310, 340, 15, 7, 5, 200, "up");
                    Common.InitMarquee("sentive_word", 3, 130, 130, 5000);
                }
            }
        },
        "json");
    },
    /*初始化统计信息*/
    InnitStatistInfo: function (objID) {
        //$("#hot_day_word_list").empty().html("<img src=\"img/loading_icon.gif\" />");
        $("#" + objID).empty().html("<img src=\"img/loading_icon.gif\" />");
        $.getJSON("Handler/StatistInfo.ashx?type=day_bbs",
            null,
            function (data) {
                if (data) {
                    //NewIndex.InnitHotWordList(data["HotDayKeyword"], "hot_day_word_list");
                    //NewIndex.InnitHotWordList(data["HotWeekKeyword"], "hot_week_word_list");
                    //NewIndex.InnitHotBBSList(data["HotDayBBs"], objID);
                    //NewIndex.InnitHotBBSList(data["HotWeekBBs"], "hot_week_bbs_list");
                }
            },
            "json"
        );
    },
    /*初始化专题分类的选项卡事件*/
    InnitTabClickFn: function () {

        var PublicSpecial = { "weekly": "tab_download_1", "monthly": "tab_download_2", "publicSpecial": "tab_download_3" };
        Common.TabControl(PublicSpecial, "tab_on", "tab_off");


        var ordertab = { "point_blog_sel": "point_blog_frame", "point_bbs_sel": "point_bbs_frame", "point_weibo_sel": "point_weibo_frame" };
        Common.TabControl(ordertab, "tab_on", "tab_off");


        var reporttab = { "report_week_sel": "report_week_frame", "report_month_sel": "report_month_frame", "report_special_sel": "report_special_frame", "report_sginfo_sel": "report_sginfo_frame" };
        Common.TabControl(reporttab, "tab_on", "tab_off");
        for (var tab in reporttab) {
            $("#" + tab).click(function () {
                var type = tab.split('_')[1];
                NewIndex.InnitWeekReport(type);
            });
        }
    },
    GetClustersParams: function (l_data) {
        var params = {};
        var data = {};
        if (l_data) {
            data = l_data;
        } else {
            data = NewIndex.ClustersList;
        }
        var count = 1;
        for (var item in data) {
            $("#" + item).empty().html("<img src=\"img/loading_icon.gif\" alt=\"loading...\" />");
            params["type_" + count] = data[item];
            count++;
        }
        return params;
    },
    /*拼接舆情聚焦HTML*/
    InnitClusters: function (clusters_list) {
        var params = NewIndex.GetClustersParams(clusters_list);
        $.post("Handler/NewIndex.ashx",
            params,
            function (data) {
                delete data["SuccessCode"];
                var clusterdata = null;
                if (clusters_list) {
                    clusterdata = clusters_list;
                } else {
                    clusterdata = NewIndex.ClustersList;
                }
                for (var item in clusterdata) {
                    var key = clusterdata[item];
                    var row = data[key];
                    var content = [];
                    var count = 1;
                    var tag = false;
                    delete row["SuccessCode"];
                    for (var entity in row) {
                        var rowlist = row[entity];
                        delete rowlist["SuccessCode"];
                        if (Common.GetJSONLength(rowlist) > 0) {
                            if (count == 1) {
                                content.push("<li name=\"clusters_list\" class=\"tab_on\">");
                            } else {
                                content.push("<li name=\"clusters_list\" class=\"tab_off\">");
                            }

                            var itemcount = 1;
                            for (var one in rowlist) {
                                var itemlist = rowlist[one];
                                var basetitle = unescape(itemlist["title"]);
                                var title = Common.SliceStr(basetitle, 18);
                                if (itemcount == 1) {
                                    content.push("<a name=\"look_info_snapshot\" href=\"" + unescape(itemlist["href"]) + "\" target=\"_blank\" title=\"" + basetitle + "\">");
                                    content.push("<span class=\"text font_2\">" + title);
                                    content.push("</span><span class=\"rss\">【" + unescape(itemlist["site"]) + "】");
                                    content.push("</span><span class=\"date\">" + unescape(itemlist["time"]) + "</span></a>");
                                    if (count == 1) {
                                        content.push("<ul class=\"news_list\">");
                                    } else {
                                        content.push("<ul class=\"news_list\" style=\"display:none;\">");
                                    }
                                }
                                else {

                                    content.push("<li><a name=\"look_info_snapshot\" target=\"_blank\" href=\"" + unescape(itemlist["href"]) + "\" title=\"" + basetitle + "\">");
                                    content.push("<span class=\"text color_7\">" + title + "</span></a></li>");

                                }
                                itemcount++;
                            }
                            content.push("</ul>");
                            count++;
                            content.push("</li>");
                        }
                    }
                    $("#" + item).empty().html(content.join(""));
                    Common.InitWebURL(item, "look_info_snapshot");
                    NewIndex.InnitClustersHoverFn(item);
                }
            },
            "json"
        );
    },
    /*定义聚焦的鼠标移动事件*/
    InnitClustersHoverFn: function (id) {
        $("#" + id).children("li").hover(function () {
            $("#" + id).find("li[name='clusters_list']").attr("class", "tab_off");
            $("#" + id).find("ul").hide();
            $(this).find("ul").show();
            $(this).attr("class", "tab_on");
        }, function () {

        });
    },
    InnitSelectFn: function () {
        /*初始化敏感词的选项事件*/
        NewIndex.InnitSelectSensiveWords();
        /*初始化舆情快报的选项事件*/
        NewIndex.InnitSelectSlide();
        /*初始化社会热点聚焦的选项事件*/
        //NewIndex.InnitSelectClusters("society_clusters_type", "society_clusters_frame", "society_clusters");
    },
    InnitSelectSensiveWords: function () {
        var slideselect = new SelectFrame("a_warning", "warning_frame");
        slideselect.SelectClickFn = function (val) {
            NewIndex.InitSentiveWord(val);
        }
        slideselect.CreateSelectFrame("a_warning", "warning_frame");
    },
    InnitSelectClusters: function (obj_type, obj_frame, obj_result) {
        var slideselect = new SelectFrame(obj_type, obj_frame);
        slideselect.SelectClickFn = function (val) {
            var list = {};
            list[obj_result] = val;
            NewIndex.InnitClusters(list)
        }
        slideselect.CreateSelectFrame(obj_type, obj_frame);
    },
    InnitSelectSlide: function () {
        var slideselect = new SelectFrame("select_slide_type", "select_slide_frame");
        slideselect.SelectClickFn = function (val) {
            if (val == "all") {
                NewIndex.InnitSlideNews();
            } else {
                NewIndex.InnitSlideNews(val);
            }
        }
        slideselect.CreateSelectFrame("select_slide_type", "select_slide_frame");
    },
    /*初始化舆情分类*/
    InitPublicCategory: function (innit_categoryid) {
        $("li[id^='special_category_']").each(function () {
            $(this).click(function () {
                //$("#special_category").hide();

                var cate = $(this).attr("id").split("_")[2];
                //$("#special_category_list_" + cate).show();
                if (cate == "swsg") {
                    var cid = $(this).attr("id").split("_")[3];
                    NewIndex.InitSgxx(cid);
                } else {
                    NewIndex.query_params["category"] = cate;
                    NewIndex.query_params["columnid"] = $(this).attr("id").split("_")[3];
                    NewIndex.query_params["fieldtext"] = "MATCH{news}:C1";
                    NewIndex.query_params["sitetype"] = 1;
                    NewIndex.InnitSlideNews("slide_news_list");
                    NewIndex.query_params["fieldtext"] = "MATCH{blog}:C1";
                    NewIndex.query_params["sitetype"] = 2;
                    NewIndex.InnitSlideNews("blog_list");
                    NewIndex.query_params["fieldtext"] = "MATCH{bbs}:C1";
                    NewIndex.query_params["sitetype"] = 3;
                    NewIndex.InnitSlideNews("bbs_list");
                }
            });
        });
        $("#special_category_" + innit_categoryid).click();
    },
    InitSgxx: function (columnId) {
        var url = "Handler/ArticleHandler.ashx";
        $.post(url,
        { "act": "getArticleInfo", "id": columnId },
        function (data) {
            if (data.Success == 1) {
                NewIndex.BindSgxxJson(data);
            }
        },
        "json");
    },
    BindSgxxJson: function (data) {
        delete data.Success;
        var sgxx = $("#sgxx_content");
        sgxx.empty();
        for (var item in data) {
            var row = data[item];
            var li = $("<li></li>");
            var basetitle = unescape(row["articletitle"]);

            li.append("<span class=\"swsg_category_tag\"><a  target=\"_blank\" href=\"AccidentInfoList.html?type=" + row["columnid"] + "_\">" + unescape(row["COLUMNNAME"]) + "</a></span>");
            li.append("<span class=\"swsg_category_link\"><a name=\"look_info_snapshot\" target=\"_blank\" title=\"" + basetitle + "\" pid=\"" + row["id"] + "\" href=\"javascript:void(null);\">" + Common.SliceStr(basetitle, 26) + "</a></span>");
            li.append("<span class=\"swsg_category_site\">" + unescape(row["articlesource"]) + "</span>");
            li.append("<span class=\"swsg_category_date\">" + unescape(row["articlebasedate"]) + "</span>");
            sgxx.append(li);
        }
        Common.InitWebURL("sgxx_content", "look_info_snapshot", 2);
    },
    /*拼接舆情快报的HTML*/
    InnitSlideNews: function (result_id) {
        var innitdata = { "page_size": 10, "result_id": result_id, "status_bar_id": "status_bar_id" };
        var Lpager = new Pager(innitdata);
        Lpager.Display = function (data, l_obj) {
            NewIndex.InnitSlideHtml(data, l_obj);
        };
        Lpager.LoadData(1, NewIndex.query_params);
    },
    InnitSlideHtml: function (data, obj) {
        var result_id = obj.result_id;
        delete data["Success"];
        delete data["totalcount"];
        var content = [];
        for (var item in data) {
            var row = data[item];
            var title = unescape(row["title"]);
            var l_title = Common.SliceStr(title, 20);
            content.push("<li><a name=\"look_info_snapshot\" href=\"" + unescape(row["href"]) + "\" target=\"_blank\" title=\"" + title + "\">");
            content.push("<span class=\"date\">" + unescape(row["time"]).slice(5, 10) + "</span>");
            content.push("<span class=\"text\">" + l_title + "</span></a></li>");
        }
        $("#" + result_id).empty().html(content.join(""));
        Common.InitWebURL(result_id, "look_info_snapshot");
    },
    GetTimeStr: function (time_str) {
        var basetime = new Date(NewIndex.replaceAll(time_str, "-", "/"));
        return (basetime.getMonth() + 1) + "-" + basetime.getDate();
    },
    replaceAll: function (s, s1, s2) {
        return s.replace(new RegExp(s1, "gm"), s2);
    },
    GetCountHtml: function (count, hotcount, commoncount) {
        if (count >= 1500) {
            return "<span class=\"temperature_red\" title=\"" + count + "\">高温</span>";
        } else if (count >= 500 && count < 1500) {
            return "<span class=\"temperature_blue\" title=\"" + count + "\">中温</span>";
        } else {
            return "<span class=\"temperature_green\" title=\"" + count + "\">低温</span>";
        }
    },
    Static: function () {
        var tagdata = { "entity_1": { "tag": "安监总局", "count": "50", "cssClass": "color_0" },
            "entity_2": { "tag": "瓦斯爆炸", "count": "43", "cssClass": "color_0" },
            "entity_3": { "tag": "煤矿事故", "count": "42", "cssClass": "color_1" },
            "entity_4": { "tag": "交通事故", "count": "38", "cssClass": "color_3" },
            "entity_5": { "tag": "消防火灾", "count": "33", "cssClass": "color_3" },
            "entity_6": { "tag": "安全生产", "count": "22", "cssClass": "color_3" }
        };
        var word_list = [];
        for (var item in tagdata) {
            word_list.push(tagdata[item]);
        }
        $("#hot_keywords").tagCloud(word_list);
        $("#hot_keywords").find("a").click(function () {
            var keyword = $(this).html();
            window.open("search.html?keyword=" + keyword);
        });
    },
    InnitAreaMapAndList: function () {
        Common.MapAreaClickFn = function (categoryid, categoryname) {
            window.open("district.html?categoryid=" + categoryid + "_&categoryname=" + categoryname);
        }
        Common.InnitComplexionMap();
    },
    GetTempHtml: function (totalhits) {
        var htmlstr = null;
        if (totalhits >= 1800) {
            htmlstr = "<span class=\"temperature_red\" title=\"" + totalhits + "\">升温</span>";
        } else if (totalhits >= 500 && totalhits < 1800) {
            htmlstr = "<span class=\"temperature_blue\" title=\"" + totalhits + "\">恒温</span>";
        } else {
            htmlstr = "<span class=\"temperature_green\" title=\"" + totalhits + "\">降温</span>";
        }
        return htmlstr;
    },
    /* 初始化专题 */
    InnitEventSQ: function () {
        var LSqlList = new SqlList();
        LSqlList.initData = { "page_size": 5, "result_id": "special_category_list", "status_bar_id": "null", "post_url": "SqlSearch.ashx" };
        LSqlList.SqlQueryParams = { "action": "getindexspeciallist", "strwhere": " PARENTCATE=202 AND ISEFFECT=1", "strorder": " SEQUEUE DESC", "display_style": 6 };
        LSqlList.DisplayHtml = function (data, l_obj) {
            var newcategory = data["newcategory"];
            $("#index_new_category").empty();
            if (newcategory) {
                var newcategoryhtml = [];
                newcategoryhtml.push("<li><a href=\"theme.html?id=" + newcategory["categoryid"] + "_" + newcategory["parentcate"] + "_" + newcategory["id"] + "&columnid=" + newcategory["id"] + "&name=" + unescape(newcategory["categoryname"]) + "\" target=\"_blank\">");
                newcategoryhtml.push("<span class=\"text font_2\">" + unescape(newcategory["categoryname"]) + "</span><span class=\"rate\">");
                newcategoryhtml.push("已经发布：<b class=\"color_2\">" + newcategory["totalcount"] + "</b>");
                newcategoryhtml.push("　今日发布：<b class=\"color_2\">" + newcategory["daycount"] + "</b></span></a></li>");
                $("#index_new_category").html(newcategoryhtml.join(""));
            }
            var entitylist = data["pagerstr"]["entitylist"];
            delete entitylist["SuccessCode"];
            var count = 1;
            var content = [];
            var imghtml = [];
            //配置专题
            $.ajax({
                url: "xmldata/zhuanti.xml",
                type: "GET",
                contentType: "application/x-www-form-urlencoded",
                dataType: "xml",
                cache: false,
                error: function () {
                    _listOther();
                },
                success: function (xml) {
                    $(xml).find("data zhuanti").each(function (a, b) {
                        var status = $(b).find("status").text();
                        var url = $(b).find("url").text();
                        var title = $(b).find("title").text();
                        var imgurl = $(b).find("imgurl").text();
                        var data = $(b).find("data").text();
                        if (status == 1) {
                            if (count == 1)
                                imghtml.push("<a  href=\"" + url + "\" title=\"" + title + "\" target=\"_blank\">");
                            else
                                imghtml.push("<a style=\"display:none;  href=\"" + url + "\" title=\"" + title + "\" target=\"_blank\">");
                            imghtml.push("<img  src=\"" + imgurl + "\" /></a>");
                            //$("#special_category_image").empty().html(imghtml.join(""));
                            content.push("<li><a href=\"" + url + "\" title=\"" + title + "\" target=\"_blank\"><span class=\"num\">" + count + "</span><span class=\"text\">" + title + "</span><span class=\"date\">" + data + "</span></a></li>");
                            count++;
                        }
                        _listOther();
                    });

                }
            });

            function _listOther() {
                for (var item in entitylist) {
                    if (count <= 5) {
                        var entity = entitylist[item];
                        var id = entity["id"];
                        var parentcate = entity["parentcate"];
                        var categoryname = unescape(entity["categoryname"]);
                        var discategoryname = Common.SliceStr(categoryname, 16);
                        var categoryid = entity["categoryid"];
                        var eventdate = unescape(entity["eventdate"]);
                        var web_href = "theme.html?id=" + categoryid + "_" + parentcate + "_" + id + "&name=" + categoryname;
                        content.push("<li");
                        var img_path = unescape(entity["categoryimgpath"]);
                        var dis_img_path = img_path == "" ? "img/theme_default.gif" : img_path;
                        if (count == 1) {
                            imghtml.push("<a href=\"" + web_href + "\" title=\"" + categoryname + "\" target=\"_blank\">");
                            imghtml.push("<img  src=\"" + dis_img_path + "\" /></a>");
                            $("#special_category_image").empty().html(imghtml.join(""));
                            content.push(" class =\"on\" ");
                        } else {
                            imghtml.push("<a style=\"display:none;\" href=\"" + web_href + "\" title=\"" + categoryname + "\" target=\"_blank\">");
                            imghtml.push("<img  src=\"" + dis_img_path + "\" /></a>");
                        }
                        content.push("><a href=\"" + web_href + "\" title=\"" + categoryname + "\" target=\"_blank\"><span class=\"num\">" + count + "</span><span class=\"text\">" + discategoryname + "</span><span class=\"date\">" + eventdate + "</span></a></li>");

                    } count++;
                }
                $("#special_category_list").empty().html(content.join(""));
                $("#special_category_image").empty().html(imghtml.join(""));
                NewIndex.InnitImgRotate();
            }
        }
        LSqlList.Search();
    },
    InitVideo: function () {
        var pageInitParameter = { "page_size": 10, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/Search.ashx" };
        var videoIdolParameter = { "display_style": 9, "act": "weiboVideoCountent", "action": "query",
            "characters": "300", "mindate": "", "maxdate": "",
            "database": Config.VideoDatabase,
            "totalresults": "True",
            "summary": "context",
            "maxresults": "5",
            "text": Config.HotWords,
            "print": "all",
            "sort": "Date",
            "start": "1",
            "predict": "false"
        };

        var filetextArray = [];
        filetextArray.push("MATCH{cntv}:SITENAME");
        filetextArray.push("EXISTS{}:DRETITLE ");
        videoIdolParameter["fieldtext"] = filetextArray.join(" AND ");

        var Lpager = new Pager(pageInitParameter);
        Lpager.Display = function (data, obj) {
            $("#video_list").empty();
            for (var i = 0; i < data.data.length; i++) {
                var liList = [];
                liList.push("<li>");
                liList.push("<a href=\"javascript:void(0);\">");
                liList.push("<span class=\"img\"><img  onerror=\"this.src='" + data.data[i].videoThumbPic + "'\" src=\"" + Config.VideoHost + "video/" + data.data[i].videoThumbPic + "\"/></span>");
                liList.push("<span class=\"text\">" + unescape(data.data[i].title) + "</span>");
                liList.push("<span class=\"date\">" + data.data[i].datetime.split(' ')[0].replace(/\//g, "-") + "</span>");
                liList.push("</a>");
                liList.push("</li>");

                var html = liList.join("");
                var _doc = $(html);
                var d = data.data[i];
                $(_doc).find("a").unbind().bind("click", d, MyVideo.playVideo);

                $("#video_list").append(_doc);
            }
            Common.InitMarquee("video_list", 2, 340, 200, 2000);
        };
        Lpager.LoadData(1, videoIdolParameter);
    }, InitWeibo2: function () {
        var mytime = new Date();
        var maxd = mytime.getDate() + "/" + (mytime.getMonth() + 1) + "/" + mytime.getFullYear();

        var mindate = mytime.addDate(-10);
        var mind = mindate.getDate() + "/" + (mindate.getMonth() + 1) + "/" + mindate.getFullYear();
        var IdolParameter = { "display_style": 6, "act": "weiboCountent", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": mind, "maxdate": maxd, "database": Config.WeiboDatabase, "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "fieldtext": "EXISTS{}:DRETITLE" };
        var pageInitParameter = { "page_size": 30, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/Search.ashx" };
        IdolParameter["text"] = "*"; // Config.HotWords; //FilterKeyWords;
        var Lpager = new Pager(pageInitParameter);
        Lpager.Display = function (data, obj) {
            var liList = [];
            //var result_id = obj.result_id;
            delete data["Success"];
            delete data["totalcount"];
            var content = [];
            var doccount = 1;

            for (var item in data) {
                var row = data[item];
                if (row["author"] == undefined)
                    continue;

                //var web_href = unescape(row["href"]);
                var web_href = unescape(row["url"]);
                var strContent = Common.SliceStr(unescape(row["content"]), 80);
                content.push("<li>");
                content.push("<div class=\"wb_boxnr\">");
                content.push("<div class=\"wb_boxusernr\">");
                content.push("<div class=\"wb_usertit\">");
                content.push("<div style=\"height:88px\">");
                content.push("<a class=\"aname\" name=\"weibourl\" href=\"" + web_href + "\" target=\"_blank\"><b>" + unescape(row["author"]) + "：</b></a>" + strContent + "");
                content.push("</div>");
                content.push("<div class=\"new_top10\">")
                content.push("<table border=\"0\" cellSpacing=\"0\" cellPadding=\"0\" width=\"100%\">");
                content.push("<tbody>");
                content.push("<tr>");
                content.push("<td><b>" + unescape(row["time"]) + "</b>　来源：" + unescape(row["site"]) + " </td>")
                content.push("</tr>");
                content.push("</tbody>");
                content.push("</table>");
                content.push("</div>");
                content.push("</div>");
                content.push("</div>");
                content.push("<div class=clear></div>");
                content.push("</div>");
                content.push("</li>");

                doccount++;
            }
            $("#point_weibo_frame").empty().html(content.join(""));
            //Common.InitWebURL("point_weibo_frame", "weibourl");
            Common.InitMarquee("point_weibo_frame", 2, 236, 285, 2000);

        };
        Lpager.LoadData(1, IdolParameter);
    }, InitWeibo: function () {
        var mytime = new Date();
        var maxd = mytime.getDate() + "/" + (mytime.getMonth() + 1) + "/" + mytime.getFullYear();

        var mindate = mytime.addDate(-1);
        var mind = mindate.getDate() + "/" + (mindate.getMonth() + 1) + "/" + mindate.getFullYear();

        var IdolParameter = { "display_style": 6, "act": "weiboCountent", "action": "hotweibo", "strorder": " ewh.InsertTime DESC ,ewh.IsRead " };
        var pageInitParameter = { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/SqlSearch.ashx" };
        IdolParameter["text"] = Config.HotWords; //FilterKeyWords;
        var Lpager = new Pager(pageInitParameter);
        Lpager.Display = function (data, obj) {
            var liList = [];
            //var result_id = obj.result_id;
            delete data["Success"];
            delete data["totalcount"];
            var content = [];
            var doccount = 1;
            data = data.data;
            var wbsource = ["新浪", "腾讯", "凤凰", "网易", "搜狐"];
            for (var item in data) {
                var row = data[item];
                if (row["Name"] == undefined || row["Name"] == "")
                    continue;
                var strContent = Common.SliceStr(unescape(row["Text"]), 80);
                content.push("<li>");
                content.push("<div class=\"wb_boxnr\">");
                content.push("<div class=\"wb_boxusernr\">");
                content.push("<div class=\"wb_usertit\">");
                content.push("<div style=\"height:88px\">");
                content.push("<a class=\"aname\" href=\"javascript:void(0);\"><b>" + unescape(row["Name"]) + "：</b></a>" + strContent + "");
                content.push("</div>");
                content.push("<div class=\"new_top10\">")
                content.push("<table border=\"0\" cellSpacing=\"0\" cellPadding=\"0\" width=\"100%\">");
                content.push("<tbody>");
                content.push("<tr>");
                var sname = parseInt(row["WebSource"]);
                sname = isNaN(sname) ? "其他" : wbsource[sname];

                content.push("<td><b>" + unescape(row["Timestamp"]) + "</b>　来源：" + sname + " </td>")
                content.push("</tr>");
                content.push("</tbody>");
                content.push("</table>");
                content.push("</div>");
                content.push("</div>");
                content.push("</div>");
                content.push("<div class=clear></div>");
                content.push("</div>");
                content.push("</li>");
                doccount++;
            }
            $("#point_weibo_frame").empty().html(content.join(""));
            Common.InitMarquee("point_weibo_frame", 2, 236, 360, 2000);
            //Common.InitWebURL("point_weibo_frame", "look_info_snapshot1");
        };
        Lpager.LoadData(1, IdolParameter);
    },
    /*初始化博客论坛热议*/
    InnitBlogBbsHot: function () {
        var itemlist = { "point_blog_frame": "MATCH{blog}:C1", "point_bbs_frame": "MATCH{bbs}:C1" };
        var columnlist = { "point_blog_frame": "140", "point_bbs_frame": "141" };
        var query_params = { "action": "query", "display_style": 6, "totalresults": "true",
            "summary": "context", "sort": "Date", "characters": "600", "text": Config.FilterKeyWords, "printfields": "DRETITLE,MYSITENAME,DREDATE,DOMAINSITENAME,READNUM"
        };
        var innitdata = { "page_size": 10, "result_id": "", "status_bar_id": "dddd" };
        for (var item in itemlist) {
            innitdata["result_id"] = item;
            if (item == "point_yaowen_frame") {
                query_params["database"] = "NewsSource+Safety+PortalSafety";
                delete query_params["text"];
            } else {
                delete query_params["database"];
                query_params["text"] = Config.FilterKeyWords;
            }
            query_params["fieldtext"] = itemlist[item];
            var Lpager = new Pager(innitdata);
            Lpager.Display = function (data, obj) {
                var result_id = obj.result_id;
                delete data["Success"];
                delete data["totalcount"];
                var content = [];
                var doccount = 1;
                for (var item in data) {
                    var row = data[item];
                    var title = unescape(row["title"]);
                    var web_href = unescape(row["href"]);
                    var l_title = Common.SliceStr(title, 17);
                    //if (result_id == "point_blog_frame")
                    if (title != undefined && title != "undefined" && title != "") {
                        content.push("<li><a name=\"look_info_snapshot\" href=\"" + web_href + "\" title=\"" + title + "\" target=\"_blank\"><span class=\"");
                        if (doccount <= 3) {
                            content.push("num red");
                        } else {
                            content.push("num");
                        }
                        content.push("\">" + doccount + "</span><span class=\"text color_7\">" + l_title + "</span>");
                        //content.push("<span class=\"text\">浏览量：" + row["clicknum"] + "</span>");
                        content.push("<span class=\"date\">" + unescape(row["time"]).slice(5, 10) + "</span></a></li>");
                    }
                    doccount++;
                }
                $("#" + result_id).empty().html(content.join(""));
                Common.InitWebURL(result_id, "look_info_snapshot");
            };
            Lpager.LoadData(1, query_params);
        }
    },
    InnitImgRotate: function () {
        var category_list = $("#special_category_list").children("li");
        var img_list = $("#special_category_image").children("a");
        category_list.each(function (n) {
            $(this).hover(
                function () {
                    $(img_list).hide();
                    $(img_list[n]).show();
                    $(img_list[n]).css("display", "block");
                    $(category_list).removeAttr("class");
                    $(this).attr("class", "on");
                }
            )
        });
    },
    /*初始化舆情周报*/
    InnitWeekReport: function (type) {
        var reporttype = { "week": "1", "special": "2", "month": "3", "sginfo": "4" };
        var LSqlList = new SqlList();
        LSqlList.initData = { "page_size": 10, "result_id": "report_" + type + "_frame", "status_bar_id": "null", "post_url": "SqlSearch.ashx" };

        LSqlList.SqlQueryParams = { "action": "getreportlist", "strwhere": " TYPE=" + reporttype[type] + " AND STATUS=3", "strorder": "CREATETIME DESC", "display_style": 6 };
        LSqlList.DisplayHtml = function (data, l_obj) {
            var entitylist = data["entitylist"];
            delete entitylist["SuccessCode"];
            var content = [];
            for (var item in entitylist) {
                var entity = entitylist[item];
                var title = unescape(entity["title"]);
                var url = unescape(entity["url"]);
                var creattime = unescape(entity["creattime"]);
                content.push("<li><span class=\"text\">" + title);
                content.push("</span><a class=\"btn_download\" href=\"" + Config.ReportHttp + url + "\">下载</a>");
                content.push("</li>");
            }

            $("#report_" + type + "_frame").empty().html(content.join(""));
        }
        LSqlList.Search();
    }
}



Date.prototype.addDate = function (num) {
    var ns = this.getTime();
    var ps = num * 1000 * 60 * 60 * 24;
    var nS = ns + ps;
    return new Date(parseInt(nS));
}

MyVideo = {
    playVideo: function (data) {
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        //alert(JSON.stringify(data));
        //videoFileCount

        $("#btn_close").click(function () {
            jwplayer("video_div").stop();
        });
        $("#newsCount").html(unescape(data.data.title));

        var videoFileCount = data.data.videoFileCount;
        var videoFile = Config.VideoHost + "video/" + data.data.videofilePath;
        var img = Config.VideoHost + "video/" + data.data.videoThumbPic;
        var videoJson = [];
        var videoHostPath = Config.VideoHost + "video/";
        var videoFileName = data.data.videofilePath;
        var videoName = videoFileName.split('_')[0];
        var videoType = videoFileName.split('.')[1];
        if (videoFileCount > 1) {
            for (var i = 0; i < videoFileCount; i++) {
                var newVideoName = videoHostPath + videoName;
                if (i < 10)
                    newVideoName += "_0" + i + "." + videoType;
                else
                    newVideoName += "_" + i + "." + videoType;
                videoJson[i] = { "file": newVideoName };
            }
        } else {
            videoJson[0] = { "file": videoFile }
        }
        jwplayer('video_div').setup({
            file: videoFile,
            width: "640",
            height: "360",
            primary: "flash",
            image: img,
            autostart: "true",
            playlist: videoJson

        });
    }
}