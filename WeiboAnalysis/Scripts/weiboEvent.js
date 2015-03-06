$(document).ready(function() {
    Common.GetTab("tabs");
    Index.InitMainTab();
    $(".main_tab").find("li").eq(0).attr("class", "tab_on");
    $("#tab_main_1").show();
    // $("#tab_main_1").attr("class", "tab_on");
    Index.DisplayDiv("tab_main_1");
});


var _index = new Object;
var Index = _index.property = {
    initData: { "page_size": 5, "result_id": "result_list", "status_bar_id": "pager_list", "disotherinfo": true },
    statisticPNinitData: { "page_size": 5, "result_id": "divPositivenegative", "status_bar_id": "PNPager_List", "disotherinfo": true },
    TopicInitData: { "page_size": 12, "result_id": "weibo_topic_body", "status_bar_id": "topic_pager_list",
        "info_id": "topic_pager_list", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx"
    },
    FriendsInitDate: { "page_size": 12, "result_id": "friendsBody", "status_bar_id": "friends_pager_list",
        "info_id": "friends_page_info", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx"
    },
    FellowInitDate: { "page_size": 12, "result_id": "fellowfriendsBody", "status_bar_id": "fellowfriends_pager_list",
        "info_id": "fellowfriends_page_info", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx"
    },
    queryParams: { "action": "query", "display_style": 8, "totalResults": true, "FieldText": "",
        "Print": "fields", "Predict": "false", "database": "WEIBO", "printfields": "DRECONTENT,SITENAME,REPLYNUM,TIMESTAMP,FORWARDNUM,AUTHORURL,AUTHORNAME",
        "sort": "", "maxdate": "", "mindate": getDate(), "text": ""
    },
    statisticPNqueryParams: { "action": "query", "display_style": 8, "totalResults": true, "FieldText": "",
        "Print": "fields", "Predict": "false", "database": "WEIBO", "printfields": "DRECONTENT,SITENAME,REPLYNUM,TIMESTAMP,FORWARDNUM,AUTHORURL,AUTHORNAME",
        "sort": "Date", "maxdate": "", "mindate": "", "text": ""
    },
    topicQeuryParams: { "action": "weibotopiccontent", "topickeywds": "", "topicIndustry": "", "stime": "", "etime": ""
    },
    FriendsQueryParams: { "action": "friendsContent", "groupid": ""
    },
    FellowQueryParams: { "action": "fellowContent", "groupid": ""
    },
    //初始化主选项卡 （事件发现， 微博列表，微博管理
    InitMainTab: function() {
        $("li[name=tab_main_div]").click(function() {
            $(".main_tab").find("li").each(function() {
                $(this).attr("class", "tab_off");
            });
            $("li[name=tab_main_div]").each(function() {
                $("#" + $(this).attr("did")).hide();
            });
            $(this).attr("class", "tab_on");
            $("#statisticTopicDiv").hide();
            $("div[name='tab_display_manage_div']").css("display", "none");
            var did = $(this).attr("did");
            $("#" + did).show();
            Index.DisplayDiv(did);
        });
    },
    //初始化主选项卡数据
    DisplayDiv: function(id) {
        switch (id) {
            case "tab_main_1":
                Index.WeiboEventInit();  //main_1 事件发现
                break;
            case "tab_main_2":
                Index.weiboTopicInit(); //main_2 微博列表
                break;
            case "tab_main_3":
                Index.weiboIndustryCategoryInit(); //加载行业类别页面
                $("#tab_manage_1").show(); //默认展示第一个选项卡
                Index.WeiboManageInit(); //mian_3 微博管理
                break;
        }
    },
    //初始化微博管理子选项列表
    WeiboManageInit: function() {
        //        $("#ManageList").unbind("click");
        //        $("#ManageList").click(function() {
        //            if ($("#displayManage").css("display") == 'none') {
        //                $("#displayManage").css("display", "block");
        //            }
        //            else {
        //                $("#displayManage").css("display", "none");
        //            }
        //        });
        $("#displayManage").unbind("click");
        $("#displayManage").find("a[name='manageList_div']").click(function() {
            //            $("#displayManage").find("a[name='manageList_div']").each(function() { 
            //                $("#" + $(this).attr("manageid")).hide(300);
            //            }); class="off"
            $("div[name='tab_display_manage_div']").hide();
            $("#displayManage").find("li").each(function() {
                $(this).attr("class", "off");
            });
            $(this).parent().attr("class", "on");
            $("#" + $(this).attr("manageid")).show();
            switch ($(this).attr("manageid")) {
                case "tab_manage_1":
                    Index.weiboIndustryCategoryInit();
                    break;
                case "tab_manage_2":
                    Index.InitKeyWordsManage();
                    break;
                case "tab_manage_3":
                    Index.WeiboAttentionFriend();
                    break;
                case "tab_manage_4":
                    Index.WeiboAttentionFellow();
                    break;
            }
        });

    },
    //初始化事件发现
    WeiboEventInit: function() {
        //事件发现标签
        Index.InitTab();
        //分类标签
        Index.InitTabCategory();
        //微博内容
        Index.GetWeiboContent();
        //按钮事件
        Index.InitBtnClick();
    },
    InitTab: function() {
        var act = { "act": "InitTab" };
        var set_url = "Handler/WeiboEventHandler.ashx";
        $.post(set_url, act,
            function(data) {
                if (data && data["Success"] == 1) {
                    var cg = data["category"];
                    var cghtml = [];
                    var cgsel = []
                    cghtml.push("<li>");
                    cghtml.push("<a href=\"javascript:void(null);\" name=\"category_atag\" id=\"category_diqu_\"><b>地区</b></a>");
                    cghtml.push("<div style=\"display: none;\">");
                    cghtml.push("<ul class=\"submenu\">");
                    cgsel.push("<option value='0' selected='selected'>地区</option>");
                    for (var item in cg) {
                        var entity = cg[item];
                        var kwd = entity["CATEGORYNAME"];
                        //kws = Common.replaceAll(entity["KEYWORD"], "+", "");
                        //kwd = Common.replaceAll(entity["KEYWORD"], "OR", ",");
                        //<input name=\"areahid\" type=\"hidden\" pid=\"area_" + entity["ID"] + "_hid\" value='" + kwd + "'/>
                        cghtml.push("<li><a href=\"javascript:void(null)\" name=\"keywordAtag\" >" + kwd + "</a></li>");
                        cgsel.push("<option value='" + kwd + "'>" + kwd + "</option>");
                    }
                    cghtml.push("</ul>");
                    cghtml.push("</div>");
                    cghtml.push("</li>");
                    //var tc = data["topic"];
                    //for (var entity in tc) {
                    //
                    //}
                    $("#selArea").empty().html(cgsel.join(""));
                    //$("#category_menu").empty().html(cghtml.join(""));
                    Index.DisplayCategory();
                }
            },
            "json"
        );
    },
    InitTabCategory: function() {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "initCategoryList" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var count = 1;
                    delete data["Success"];
                    var entity = data["entity_" + count];
                    var industryCate = [];
                    //        [ID]
                    //      , [CategoryName]
                    //      , [ParentCate]
                    //      , [Catepath]
                    //      , [Iseffect]
                    //      , [Keywords]
                    //      , [MinScore]
                    //      , [orderID]
                    industryCate.push("<option value=\"\" selected='selected'>分类</option>");

                    while (entity) {
                        var name = entity["CategoryName"];
                        var kwd = entity["Keywords"];
                        industryCate.push("<option value='" + unescape(kwd) + "' >" + unescape(name) + "</option>");
                        entity = data["entity_" + (++count)];
                    }
                    $("#selCategory").empty().html(industryCate.join(""));
                }
            }, "json"
        );
    },
    GetWeiboContent: function() {
        Index.queryParams["sort"] = "Date";
        Index.DisplayPager(Index.initData, Index.queryParams);
    },
    //热门转发
    GetWeiboHotComment: function() {
        Index.queryParams["sort"] = "REPLYNUM:numberdecreasing";
        Index.DisplayPager(Index.initData, Index.queryParams);
    },
    //热门评论
    GetWeiboHotForward: function() {

        Index.queryParams["sort"] = "FORWARDNUM:numberdecreasing";
        Index.DisplayPager(Index.initData, Index.queryParams);

    },
    DisplayCategory: function() {
        $("#category_menu").unbind("click");
        $("#category_menu").find("a[name='category_atag']").click(function() {
            $("#category_menu li[class=on]").attr("class", "");
            if ((!$(this).parent().children("div").attr("display"))) {
                $(this).parent().parent().find("div").hide();
                $(this).parent().attr("class", "on");
                $(this).parent().children("div").show(300);
            }
        });
        $("#category_menu").find("a[name='keywordAtag']").click(function() {
            Index.queryParams["FieldText"] = "MATCH{" + $(this).text() + "}:PROVINCE:CITY";
            Index.SwitTab($(".tab_on").attr("pid"));

        })
    },
    //分页显示
    DisplayPager: function(initdata, params) {
        var Lpager = new Pager(initdata);
        Lpager.Display = function(data, l_obj) {

            var count = 1;
            var entity = data["entity_" + count];
            var htmlcontent = [];
            while (entity) {
                //AUTHORNAME   AUTHORURL
                htmlcontent.push("<div class=\"gw_news_text_weibo\"><a class=\"topic_yuanwen\">" + unescape(entity["DISPLAYCONTENT"]) + "</a>");
                htmlcontent.push("<p class=\"weibo_search\"><a href=\"javascript:void(null)\" name=\"addTopicFrame\">添加为话题</a></p>");
                htmlcontent.push("<div class=\"find_text_thre\"><a href=\"" + unescape(entity["AUTHORURL"]) + "\" target=\"_blank\">" + unescape(entity["AUTHORNAME"]) + "</a>&nbsp&nbsp");
                htmlcontent.push(unescape(entity["TIMESTAMP"]) + "【" + unescape(entity["SITENAME"]) + "】&nbsp&nbsp<span>转发（<span style=\"color: #F00;\">" +
                                unescape(entity["FORWARDNUM"]) + "</span>）&nbsp&nbsp<span>评论（<span style=\"color: #F00;\">" + unescape(entity["REPLYNUM"]) + "</span>）</span></div> <div class=\"clear\"></div></div>");
                entity = data["entity_" + (++count)];
            }
            $("#result_list").empty().html(htmlcontent.join(""));
            Index.InitEventaddTopicFrame();
        };
        Lpager.LoadData(1, params);

    },
    //添加话题
    InitEventaddTopicFrame: function() {
        $("#result_list").unbind("click");
        $("#result_list").find("a[name='addTopicFrame']").click(function() {
            clearhid();
            $("#generateWeiboDataDiv").hide();
            shEd("sad", "topicmove_column", "layer", "btn_close");
        });

    },
    //初始化行业分类及按钮点击事件
    InitBtnClick: function() {
        $.post("Handler/WeiboEventHandler.ashx", { "act": "industryCategory" },
                    function(data) {

                        if (data && data["Success"] == 1) {
                            var cg = data["category"];
                            var industryCate = [];
                            industryCate.push("<option value=\"\" selected='selected'>行业分类</option>");

                            for (var item in cg) {
                                var entity = cg[item];
                                var kwd = entity["CATEGORYNAME"];
                                industryCate.push("<option value=\"" + kwd + "\" >" + kwd + "</option>");
                            }
                            $("#txtIndustry").empty().html(industryCate.join(""));
                        }
                    }, "json"
                );
        $("li[name=tabContent]").unbind("click");
        $("li[name=tabContent]").click(function() {
            $("li[name=tabContent]").attr("class", "tab_off");
            var currTab = $(this);
            currTab.attr("class", "tab_on");
            Index.queryParams["FieldText"] = "";
            Index.SwitTab(currTab.attr("pid"));
        });
        ///////keywds关键词 textarea     ，，，data_source_starttime，，，data_source_endtime，，，selArea
        $("#btnSearch").unbind("click");
        $("#btnSearch").click(function() {
            var txta = $("#keywds").val();
            var stime = $("#data_source_starttime").val();
            var etime = $("#data_source_endtime").val();
            var sarea = $("#selArea").val();
            var selCategory = $("#selCategory").val();
            var weiboType = $("#selWeiboType").val();
            var attentionType = $("#selMyFriends").val();
            Index.queryParams["FieldText"] = "";
            Index.queryParams["mindate"] = getDate();
            Index.queryParams["maxdate"] = "";
            Index.queryParams["text"] = "";
            if (attentionType != "") {
                if (weiboType != "") {
                    Index.queryParams["FieldText"] = "MATCH{1}:WEBSOURCE+AND+MATCH{3}:WEBTYPE";
                }
                else {
                    alert("请选择需要关注的微博类型");
                    return;
                }
            }

            if (weiboType != "") {
                if (Index.queryParams["FieldText"] != "") {
                    Index.queryParams["FieldText"] = Index.queryParams["FieldText"] + "+AND+MATCH{" + weiboType + "}:WEBSOURCE";
                } else {
                    Index.queryParams["FieldText"] = "MATCH{" + weiboType + "}:WEBSOURCE";
                }
            }
            if (sarea != "0") {
                if (Index.queryParams["FieldText"] != "") {
                    Index.queryParams["FieldText"] = Index.queryParams["FieldText"] + "+AND+MATCH{" + sarea + "}:PROVINCE:CITY";
                }
                else {
                    Index.queryParams["FieldText"] = "MATCH{" + sarea + "}:PROVINCE:CITY";
                }
            }
            if (txta != "" && txta != "关键词") {
                Index.queryParams["text"] = txta;
            }
            if (selCategory != "") {
                Index.queryParams["text"] = Index.queryParams["text"] + "," + selCategory;
            }
            if (stime != "") {
                Index.queryParams["mindate"] = stime;
            }

            if (etime != "") {
                Index.queryParams["maxdate"] = etime;
            }



            Index.SwitTab($("li[name='tabContent'][class='tab_on']").attr("pid"));
        });
        focusBlur("keywds");


        $("#btnAddT").unbind("click");
        $("#btnAddT").click(function() {
            $("#btnAddT").attr("visible", "true");
            var ne = $("#txtTopicName").val();
            var kws = $("#txtKeywords").val();
            var indstry = $("#txtIndustry").val();
            if (ne == "") {
                alert("请输入话题名称");
                return false;
            }
            if (kws == "") {
                alert("请输入关键词");
                return false;
            }
            if (indstry == "") {
                alert("请输入所属行业");
                return false;
            }
            alert($("#generateWeiboDataDiv").css("display"));
            $("#generateWeiboDataDiv").show();
            var act = { "act": "addTopic", "tName": ne, "keyword": kws, "industry": indstry };
            var set_url = "Handler/WeiboEventHandler.ashx";

            $.post(set_url, act, function(data) {
               
                if (data["Success"] == "1") {
                    Common.CloseEditFrame("sad", "layer");
                    $("#generateWeiboDataDiv").hide();
                    alert("操作成功");
                }
            }, "json");

        });
        $("#btnReset").unbind("click");
        $("#btnReset").click(function() {
            clearhid();
        });



    },
    //根据选择的标签返回相关信息(all:微博正文,forward:热门转发,comment:热门评论)
    SwitTab: function(tab) {
        switch (tab) {
            case "all":
                Index.GetWeiboContent();
                break;
            case "forward":
                Index.GetWeiboHotForward();
                break;
            case "comment":
                Index.GetWeiboHotComment();
                break;
        }
    },
    //初始化话题列表
    weiboTopicInit: function() {
        Index.loadWeiboTopic();
        Index.InitHotTopic();
        Index.InitTopicIndustry();
        Index.loadWeiboTopicBtn();
    },
    loadWeiboTopic: function() {
        var sp = new SqlPager(Index.TopicInitData);
        sp.Display = function(data, l_obj) {
            var count = 1;
            var entity = l_obj["entity_" + count];
            var weibo_topics = [];
            while (entity) {
                weibo_topics.push("<tr>");
                weibo_topics.push("<td class=\"left\"  ><a href=\"javascript:void(null);\"  name=\"weibo_topic_name\" pid=\"topic_" + entity["ID"] + "\">" + unescape(entity["NAME"]) + "</a></td>");
                weibo_topics.push("<td class=\"center\"><a class=\"btn_edit\" title=\"编辑话题名称\" href=\"javascript:void(null);\" name=\"weibo_topic_edit\" pid=\"topic_edit_" + entity["ID"] + "\"></a></td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["ORIGINALCOUNT"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["FORWARDCOUNT"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["COMMENTCOUNT"]));
                weibo_topics.push("<input type=\"hidden\" id=\"topic_" + entity["ID"] + "_hid\" tname=\"" + entity["NAME"] + "\" tkeywd=\"" + entity["KEYWORD"] + "\" tindust=\"" + entity["INDUSTRY"] + "\"  /></td>");
                weibo_topics.push("</tr>");
                entity = l_obj["entity_" + (++count)];
            }
            $("#weibo_topic_body").empty().html(weibo_topics.join(""));
            Index.loadWeiboTopicAtag();
        }
        sp.LoadData(1, Index.topicQeuryParams);


    },
    loadWeiboTopicAtag: function() {
        $("#weibo_topic_body").find("a[name='weibo_topic_name']").unbind("click");
        $("#weibo_topic_body").find("a[name='weibo_topic_name']").click(function() {
            var tid = $(this).attr("pid").split("_")[1];
            var iphid = $("#topic_" + tid + "_hid");
            $("#tab_main_2").hide();
            Index.statisticTopic(tid, "tab_main_2", unescape(iphid.attr("tkeywd")));

        });
        $("#weibo_topic_body").find("a[name='weibo_topic_edit']").unbind("click");
        $("#weibo_topic_body").find("a[name='weibo_topic_edit']").click(function() {
            clearhid();
            var tid = $(this).attr("pid").split("_")[2];
            var hid = $("#topic_" + tid + "_hid");
            $("#txtTopicName").val(unescape(hid.attr("tname")));
            $("#txtKeywords").val(unescape(hid.attr("tkeywd")));
            $("#txtIndustry").val(unescape(hid.attr("tindust")));
            $("#txtTopicName").attr("sid", tid);
            $("#txtTopicName").attr("stype", "edit");
            $("#generateWeiboDataDiv").hide();
            shEd("sad", "topicmove_column", "layer", "btn_close");
        });
    },
    InitHotTopic: function() {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "hotComment" },
            function(data) {
                //topicHotCommentDisplayDiv
                if (data && data["Success"] == "1") {
                    delete data["Success"];
                    var hchtml = [];
                    var count = 1;
                    var entity = data["entity_" + count];
                    hchtml.push("<ul class=\"submenu\">");
                    while (entity) {
                        hchtml.push("<li><a href=\"javascript:void(null);\" name=\"hotCommentItem\" tid=\"" + unescape(entity["ID"]) + "\" ><b>" + unescape(entity["NAME"]) + "(" + unescape(entity["COMMENTCOUNT"]) + ")</b></a></li>");
                        entity = data["entity_" + (++count)];
                    }
                    hchtml.push("</ul>");
                    $("#topicHotCommentDisplayDiv").empty().html(hchtml.join(""));
                    $("#topicHotCommentDisplayDiv").find("a[name='hotCommentItem']").unbind("click");
                    $("#topicHotCommentDisplayDiv").find("a[name='hotCommentItem']").click(function() {
                        var hottid = $(this).attr("tid");
                        var iphid = $("#topic_" + hottid + "_hid");

                        $("#tab_main_2").hide();
                        Index.statisticTopic(hottid, "tab_main_2", unescape(iphid.attr("tkeywd")));
                    });
                }
            }, "json"
        );

        $.post("Handler/WeiboTopicHandler.ashx", { "act": "hotForward" },
            function(data) {
                if (data && data["Success"] == "1") {
                    delete data["Success"];
                    var hchtml = [];
                    var count = 1;
                    var entity = data["entity_" + count];
                    hchtml.push("<ul class=\"submenu\">");
                    while (entity) {
                        hchtml.push("<li><a href=\"javascript:void(null);\" name=\"hotForwardItem\"  tid=\"" + unescape(entity["ID"]) + "\"><b>" + unescape(entity["NAME"]) + "(" + unescape(entity["FORWARDCOUNT"]) + ")</b></a></li>");
                        entity = data["entity_" + (++count)];
                    }
                    hchtml.push("</ul>");
                    $("#topicHotForwardDisplayDiv").empty().html(hchtml.join(""));
                    $("#topicHotForwardDisplayDiv").find("a[name='hotForwardItem']").unbind("click");
                    $("#topicHotForwardDisplayDiv").find("a[name='hotForwardItem']").click(function() {
                        var hottid = $(this).attr("tid");
                        var iphid = $("#topic_" + hottid + "_hid");
                        $("#tab_main_2").hide();
                        Index.statisticTopic(hottid, "tab_main_2", unescape(iphid.attr("tkeywd")));
                    });
                }
            }, "json"
        );
    },
    InitTopicIndustry: function() {
        $.post("Handler/WeiboEventHandler.ashx", { "act": "industryCategory" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var cg = data["category"];
                    var industryCate = [];
                    industryCate.push("<option value=\"\" selected='selected'>行业分类</option>");

                    for (var item in cg) {
                        var entity = cg[item];
                        var kwd = entity["CATEGORYNAME"];
                        industryCate.push("<option value=\"" + kwd + "\" >" + kwd + "</option>");
                    }
                    $("#topicIndustryCate").empty().html(industryCate.join(""));
                    $("#txtIndustry").empty().html(industryCate.join(""));
                }

            }, "json"
        );
    },
    loadWeiboTopicBtn: function() {
        //        $("#topicHotComment").unbind("click");
        //        $("#topicHotComment").click(function() {
        //            if (!$("#topicHotCommentDisplayDiv").css("display") || $("#topicHotCommentDisplayDiv").css("display") == "none") {
        //                $("#topicHotCommentDisplayDiv").show(300);
        //            }
        //            else {
        //                $("#topicHotCommentDisplayDiv").hide(300);
        //            }
        //        });
        //        $("#topicHotForward").unbind("click");
        //        $("#topicHotForward").click(function() {
        //            if (!$("#topicHotForwardDisplayDiv").css("display") || $("#topicHotForwardDisplayDiv").css("display") == "none") {
        //                $("#topicHotForwardDisplayDiv").show(300);
        //            }
        //            else {
        //                $("#topicHotForwardDisplayDiv").hide(300);
        //            }
        //        });
        $("#topicSearch").unbind("click");
        $("#topicSearch").click(function() {
            var topickwds = $("#topicKeywds").val();
            var topicIndstry = $("#topicIndustryCate").val();
            var stime = $("#topicstarttime").val();
            var etime = $("#topicendtime").val();
            if (topickwds != "关键词") {
                Index.topicQeuryParams["topickeywds"] = topickwds;
            }
            if (topicIndstry != "") {
                Index.topicQeuryParams["topicIndustry"] = topicIndstry;
            }
            if (stime != "") {
                Index.topicQeuryParams["stime"] = stime;
            }
            if (etime != "") {
                Index.topicQeuryParams["etime"] = etime;
            }
            Index.loadWeiboTopic();
            Index.topicQeuryParams["topickeywds"] = "";
            Index.topicQeuryParams["topicIndustry"] = "";
            Index.topicQeuryParams["stime"] = "";
            Index.topicQeuryParams["etime"] = "";
        });
        focusBlur("topicKeywds");
        $("#btnAddT").unbind("click");
        $("#btnAddT").click(function() {
            var ne = $("#txtTopicName").val();
            var sid = $("#txtTopicName").attr("sid");
            var kws = $("#txtKeywords").val();
            var indstry = $("#txtIndustry").val();
            var subtype = $("#txtTopicName").attr("stype");

            if (ne == "") {
                alert("请输入话题名称");
                return false;
            }
            if (kws == "") {
                alert("请输入关键词");
                return false;
            }
            if (indstry == "") {
                alert("请输入所属行业");
                return false;
            }
            var act = { "act": "addTopic", "sid": sid, "submittype": subtype, "tName": ne, "keyword": kws, "industry": indstry };
            var set_url = "Handler/WeiboEventHandler.ashx";
            $.post(set_url, act, function(data) {
                if (data["Success"] == "1") {
                    Common.CloseEditFrame("sad", "layer");
                    $("#txtTopicName").attr("stype", "");
                    $("#txtTopicName").attr("sid", "");
                    Index.loadWeiboTopic();
                    alert("操作成功");
                }
            }, "json");

        });
    },
    weiboIndustryCategoryInit: function() {
        Index.InitIndustryCategoryList();
        Index.InitIndustrySingleBtn();
    }
    ,
    InitIndustryCategoryList: function() {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "initCategoryList" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var count = 1;
                    delete data["Success"];
                    var entity = data["entity_" + count];
                    var industryCate = [];
                    //        [ID]
                    //      , [CategoryName]
                    //      , [ParentCate]
                    //      , [Catepath]
                    //      , [Iseffect]
                    //      , [Keywords]
                    //      , [MinScore]
                    //      , [orderID]
                    while (entity) {
                        industryCate.push("<tr>");
                        var cateid = entity["ID"];
                        var name = entity["CategoryName"];
                        var kwd = entity["Keywords"];
                        var minscroe = entity["MinScore"];
                        industryCate.push("<td class=\"left\">" + unescape(name) + "</td>");
                        //                        industryCate.push("<td class=\"classify_text_two_right\">" + unescape(kwd) + "</td>");
                        industryCate.push("<td class=\"center\"><a class=\"btn_edit\" title=\"编辑话题名称\" href=\"javascript:void(null)\" name=\"updateIndustryCategory\" cateid=\"" + cateid + "\"></a></td>");
                        industryCate.push("<td class=\"center\"><a class=\"btn_delete\" title=\"删除话题\" href=\"javascript:void(null)\" name=\"delIndustryCategory\" cateid=\"" + cateid + "\"></a>");
                        industryCate.push("<input type=\"hidden\" id=\"industrycategory_" + cateid + "_hid\" tname=\"" + name + "\" minscore=\"" + minscroe + "\" tkeywd=\"" + kwd + "\"   />" + "</td>");
                        industryCate.push("</tr>");
                        entity = data["entity_" + (++count)];
                    }
                    $("#industryCategoryBody").empty().html(industryCate.join(""));
                    Index.InitIndustryCategoryBtn();
                }

            }, "json"
        );
    }, //初始化分类编辑按钮
    InitIndustryCategoryBtn: function() {
        $("#industryCategoryBody").find("a[name='updateIndustryCategory']").unbind("click");
        $("#industryCategoryBody").find("a[name='updateIndustryCategory']").click(function() {
            var tid = $(this).attr("cateid");
            var hid = $("#industrycategory_" + tid + "_hid");
            $("#categoryLayerName").val(unescape(hid.attr("tname")));
            $("#categoryLayerName").attr("sid", tid);
            $("#categoryLayerKeyword").val(unescape(hid.attr("tkeywd")));
            $("#categoryMScore").val(unescape(hid.attr("minscore")));
            //categoryLayerBtnAdd .click
            //categoryLayerBtnReset .click
            $("#categoryLayerBtnAdd").attr("stype", "edit");
            shEd("sad", "categorymove_column", "categoryLayer", "categoryLayer_close");
        });
        $("#industryCategoryBody").find("a[name='delIndustryCategory']").unbind("click");
        $("#industryCategoryBody").find("a[name='delIndustryCategory']").click(function() {
            var tid = $(this).attr("cateid");
            if (confirm("确认删除吗？")) {
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "delCategory", "cateid": tid },
                     function(data) {
                         if (data && data["Success"] == 1) {
                             Common.CloseEditFrame("sad", "categoryLayer");
                             Index.InitIndustryCategoryList();
                             alert("删除成功");
                         }

                     }, "json"
            );
            }
        });
    },
    InitIndustrySingleBtn: function() {
        $("#categoryLayerBtnReset").unbind("click");
        $("#categoryLayerBtnReset").click(function() {
            clearIndustryState();
        });
        $("#addIndustryCategory").unbind("click");
        $("#addIndustryCategory").click(function() {
            clearIndustryState();
            shEd("sad", "categorymove_column", "categoryLayer", "categoryLayer_close");
        });
        $("#categoryLayerBtnAdd").unbind("click");
        $("#categoryLayerBtnAdd").click(function() {
            var AddState = $(this).attr("stype");
            var IndstName = $("#categoryLayerName").val();
            var IndstKeyword = $("#categoryLayerKeyword").val();
            var categoryId = $("#categoryLayerName").attr("sid");
            var minscore = $("#categoryMScore").val();
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "addCategory", "stype": AddState, "cateName": IndstName, "cateKeyword": IndstKeyword, "sid": categoryId, "minscore": minscore },
            function(data) {
                if (data && data["Success"] == 1) {

                    Common.CloseEditFrame("sad", "categoryLayer");
                    clearIndustryState();
                    Index.InitIndustryCategoryList();
                    alert("操作成功");
                }

            }, "json"
            );
        });
    },
    InitKeyWordsManage: function() {
        Index.InitKeyWordsContent();
        Index.InitKeywordsSubmitBtn();

    }
    , InitKeyWordsContent: function() {

        $.post("Handler/WeiboTopicHandler.ashx", { "act": "initKeywordsList" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var count = 1;
                    delete data["Success"];
                    var entity = data["entity_" + count];
                    var industryCate = [];
                    while (entity) {
                        industryCate.push("<tr>");
                        var cateid = entity["ID"];
                        var name = entity["Name"];
                        var kwd = entity["KWRelevance"];
                        industryCate.push("<td class=\"left\">" + unescape(name) + "</td>");
                        industryCate.push("<td class=\"center\">" + unescape(kwd) + "</td>");
                        industryCate.push("<td class=\"center\"><a class=\"btn_edit\" title=\"编辑话题\" href=\"javascript:void(null)\" name=\"updateKeywords\" cateid=\"" + cateid + "\"></a></td>");
                        industryCate.push("<td class=\"center\"><a class=\"btn_delete\" title=\"删除话题\" href=\"javascript:void(null)\" name=\"delKeywords\" cateid=\"" + cateid + "\"></a>");
                        industryCate.push("<input type=\"hidden\" id=\"keywords_" + cateid + "_hid\" tname=\"" + name + "\"  tkeywd=\"" + kwd + "\"   />" + "</td>");
                        industryCate.push("</tr>");
                        entity = data["entity_" + (++count)];
                    }
                    $("#KeywordsBody").empty().html(industryCate.join(""));
                    Index.InitKeyWordsEditBtn();
                }

            }, "json"
        );

    }, //初始化关键词编辑按钮
    InitKeyWordsEditBtn: function() {

        $("#KeywordsBody").find("a[name='updateKeywords']").unbind("click");
        $("#KeywordsBody").find("a[name='updateKeywords']").click(function() {
            var tid = $(this).attr("cateid");
            var hid = $("#keywords_" + tid + "_hid");
            $("#txtKeywordsName").val(unescape(hid.attr("tname")));
            $("#txtKeywordsName").attr("sid", tid);
            $("#txtKWRelevance").val(unescape(hid.attr("tkeywd")));

            $("#btnAddKeywords").attr("stype", "edit");
            shEd("sad", "keywordsmove_column", "keywordsLayer", "keywordsLayer_close");
        });
        $("#KeywordsBody").find("a[name='delKeywords']").unbind("click");
        $("#KeywordsBody").find("a[name='delKeywords']").click(function() {
            var tid = $(this).attr("cateid");
            if (confirm("确认删除吗？")) {
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "delKeywods", "cateid": tid },
                     function(data) {
                         if (data && data["Success"] == 1) {
                             Common.CloseEditFrame("sad", "keywordsLayer");
                             Index.InitKeyWordsContent();
                             alert("删除成功");
                         }

                     }, "json"
            );
            }
        });
    }, //初始化关键词弹出层提交按钮
    InitKeywordsSubmitBtn: function() {
        $("#categoryLayerBtnReset").unbind("click");
        $("#categoryLayerBtnReset").click(function() {
            clearKeywordsState();
        });
        $("#AddKeyword").unbind("click");
        $("#AddKeyword").click(function() {
            clearKeywordsState();
            shEd("sad", "keywordsmove_column", "keywordsLayer", "keywordsLayer_close");
        });
        $("#btnAddKeywords").unbind("click");
        $("#btnAddKeywords").click(function() {
            var AddState = $(this).attr("stype");
            var IndstName = $("#txtKeywordsName").val();
            var IndstKeyword = $("#txtKWRelevance").val();
            var categoryId = $("#txtKeywordsName").attr("sid");
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "addKeywords", "stype": AddState, "cateName": IndstName, "KWRelevance": IndstKeyword, "sid": categoryId },
            function(data) {
                if (data && data["Success"] == 1) {

                    Common.CloseEditFrame("sad", "keywordsLayer");
                    clearKeywordsState();
                    Index.InitKeyWordsContent();
                    alert("操作成功");
                }

            }, "json"
            );
        });

    }, //初始化微博关注人页面
    WeiboAttentionFriend: function() {
        //1.初始化关注人内容
        //2.初始化全选，编辑，批量添加按钮事件,初始化加入分组弹出层事件
        Index.InitFriendsContent();

        //3.初始化分组列表
        //4.初始化添加分组事件,初始化创建分组弹出层事件
        //5.初始化弹出层提交创建分组事件
        //6.初始化弹出层提交加入分组事件
        Index.InitFriendsGroupList();


    }, //初始化关注人内容
    InitFriendsContent: function() {
        var sp = new SqlPager(Index.FriendsInitDate);
        sp.Display = function(data, l_obj) {
            var count = 1;
            var entity = l_obj["entity_" + count];
            var weibo_topics = [];
            if (!entity) {
                weibo_topics.push("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/error.gif\" /></div></div>");
                $("#friendsBody").empty().html(weibo_topics.join(""));
                return false;
            }
            while (entity) {
                weibo_topics.push("<tr>");
                weibo_topics.push("<td class=\"center\" ><input type=\"checkbox\"   name=\"groupFriends\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                weibo_topics.push("<td class=\"center\">" + (unescape(entity["IsVip"]) == "1" ? "<b class=\"color_2\">+V</b>" : "") + "</td>");
                weibo_topics.push("<td class=\"left\" >" + unescape(entity["UName"]) + "</td>");
                weibo_topics.push("<td class=\"center\">" + unescape(entity["Province"]) + "</td>");
                //                weibo_topics.push("<td class=\"person_two_buttom_right\">" + unescape(entity["City"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["FriendsCount"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["FellowCount"]) + "</td>");
                //                weibo_topics.push("<td class=\"person_two_buttom_right\"><input type=\"checkbox\"   name=\"groupFriends\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                weibo_topics.push("<td class=\"center\"><input class=\"btn_file\" type=\"button\"  name=\"addSingleGroup\" uid=\"" + unescape(entity["ID"]) + "\" value=\"分组\" /></td>");
                weibo_topics.push("</tr>");
                entity = l_obj["entity_" + (++count)];
            }
            $("#friendsBody").empty().html(weibo_topics.join(""));
            Index.loadFriendBtnClick();
        }
        sp.LoadData(1, Index.FriendsQueryParams);

    },
    InitFriendsGroupList: function() {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "FriendsGroupList", "attionType": "1" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var count = 1;
                    delete data["Success"];
                    var entity = data["entity_" + count];
                    var industryCate = [];
                    var grpoption = [];
                    grpoption.push("<option value='' selected=\"selected\">请选择</option>");
                    while (entity) {
                        var cateid = entity["id"];
                        var ecount = entity["count"];
                        var groupname = entity["groupname"];
                        industryCate.push("<tr>");
                        if (cateid != "0") {
                            industryCate.push("<td class=\"left off\">");
                        }
                        else {
                            industryCate.push("<td class=\"left on\">");
                        }
                        industryCate.push("<input id=\"groupname_hid_" + unescape(cateid) + "\" style=\"display:none;\" value=\"" + unescape(groupname) + "\" />");
                        if (cateid != "0")
                            industryCate.push("<div class=\"person_btn\"><input class=\"btn_edit\" type=\"button\" name=\"btnEditGroupName\" btntype=\"edit\" groupid=\"" + unescape(cateid) + "\" value=\"\"/>&nbsp&nbsp<input class=\"btn_delete\" type=\"button\" name=\"btnDelGroupName\" id=\"btnDelGroupName_" + unescape(cateid) + "\"  groupid=\"" + unescape(cateid) + "\" value=\"\"/><input class=\"btn_false\" type=\"button\" id=\"btnCancelGroup_" + unescape(cateid) + "\" style=\"display:none;\" groupid=\"" + unescape(cateid) + "\" value=\"\"/></div>");
                        industryCate.push("<a href=\"javascript:void(null);\"  name=\"attentionGroupAtag\" gpname=\"" + unescape(groupname) + "\" id=\"attentionAtag_" + unescape(cateid) + "\" groupid=\"" + unescape(cateid) + "\">" + unescape(groupname) + "</a>");
                        industryCate.push("(<span class=\"color_2\">" + unescape(ecount) + "</span>)");
                        industryCate.push("</td></tr>");
                        grpoption.push("<option value='" + cateid + "'>" + unescape(groupname) + "</option>");
                        entity = data["entity_" + (++count)];
                    }

                    $("#selGroupFriendList").empty().html(grpoption.join(""));
                    $("#attentionGroupSetting").empty().html(industryCate.join(""));
                    Index.initAttentionGroupbtnTag();

                }

            }, "json"
        );
    },
    initAttentionGroupbtnTag: function() {
        $("#attentionGroupSetting").find("input[name='btnDelGroupName']").unbind("click");
        $("#attentionGroupSetting").find("input[name='btnDelGroupName']").click(function() {
            if (confirm("删除会将该组的话题重置为未分组，确认删除吗？")) {
                var groupid = $(this).attr("groupid");
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "DelAttentionGroup", "delAttentionGroupid": groupid },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            Index.InitFriendsGroupList();
                        }
                    }, "json"
                   );
            }
        });
        $("#attentionGroupSetting").find("input[name='btnEditGroupName']").unbind("click");
        $("#attentionGroupSetting").find("input[name='btnEditGroupName']").click(function() {
            var currEdit = $(this);
            var groupid = currEdit.attr("groupid");
            if (currEdit.attr("btntype") == "edit") {
                currEdit.attr("btntype", "subm");
                $("#btnDelGroupName_" + groupid).hide();

                currEdit.val(""); //确认
                currEdit.attr("class", "btn_true");
                $("#attentionAtag_" + groupid).hide();
                $("#groupname_hid_" + groupid).val($("#attentionAtag_" + groupid).attr("gpname"));
                $("#groupname_hid_" + groupid).show();
                $("#btnCancelGroup_" + groupid).show();
            }
            else if (currEdit.attr("btntype") == "subm") {
                var grouptxt = $("#groupname_hid_" + groupid).val();
                if (grouptxt == "") {
                    alert("请输入分组名称");
                    return false;
                }
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "updateAttentionGroup", "groupId": groupid, "grouptxt": grouptxt },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            $("#groupname_hid_" + groupid).val("");
                            $("#groupname_hid_" + groupid).hide();
                            currEdit.val(""); //编辑
                            currEdit.attr("class", "btn_edit");
                            currEdit.attr("btntype", "edit");
                            $("#attentionAtag_" + groupid).show();
                            $("#btnDelGroupName_" + groupid).show();
                            currEdit.show();
                            $("#btnCancelGroup_" + groupid).hide();
                            Index.InitFriendsGroupList();

                        }
                    }, "json"
                   );
            }
            $("#btnCancelGroup_" + groupid).click(function() {
                $("#groupname_hid_" + groupid).val("");
                $("#groupname_hid_" + groupid).hide();
                $("#btnDelGroupName_" + groupid).show();
                currEdit.val(""); //编辑
                currEdit.attr("class", "btn_edit");
                currEdit.attr("btntype", "edit");
                $("#attentionAtag_" + groupid).show();
                currEdit.show();
                $(this).hide();
            });



        });
        $("#btnAddSingleAttentionGroup").unbind("click");
        $("#btnAddSingleAttentionGroup").click(function() {
            $(this).hide();
            $("#addAttentionGroupName").val("");
            $("#addAttentionGroupNameDiv").show();


        });
        $("#btnCancelAttentionGroupAdd").unbind("click");
        $("#btnCancelAttentionGroupAdd").click(function() {
            $("#addAttentionGroupName").val("");
            $("#addAttentionGroupNameDiv").hide();
            $("#btnAddSingleAttentionGroup").show();
        });
        $("#btnAddAttentionGroupName").unbind("click");
        $("#btnAddAttentionGroupName").click(function() {
            var groupName = $("#addAttentionGroupName").val();
            if (groupName == "") {
                alert("请输入分组名称");
                return false;
            }
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "addAttentionGroupName", "groupName": groupName, "attionType": "1", "mainuid": "2659126494" },
                                function(data) {
                                    if (data && data["Success"] == 1) {
                                        $("#addAttentionGroupName").val("");
                                        $("#addAttentionGroupNameDiv").hide();
                                        $("#btnAddSingleAttentionGroup").show();
                                        Index.InitFriendsGroupList();
                                        alert("操作成功");
                                    }
                                }, "json"
                );
        });
        $("#attentionGroupSetting").find("a[name='attentionGroupAtag']").unbind("click");
        $("#attentionGroupSetting").find("a[name='attentionGroupAtag']").click(function() {
            Index.FriendsQueryParams["groupid"] = $(this).attr("groupid");
            $("#attentionGroupSetting").find("td").attr("class", "left off");
            $(this).parent().attr("class", "left on");
            var sp = new SqlPager(Index.FriendsInitDate);
            sp.Display = function(data, l_obj) {
                var count = 1;
                var entity = l_obj["entity_" + count];
                var weibo_topics = [];
                if (!entity) {
                    weibo_topics.push("<tr><td colspan=\"7\" style=\"height:240px; line-height:240px; text-align:center;\">暂无数据</td></tr>");
                    $("#friendsBody").empty().html(weibo_topics.join(""));
                    return false;
                }
                while (entity) {
                    weibo_topics.push("<tr>");
                    weibo_topics.push("<td class=\"center\" ><input type=\"checkbox\"   name=\"groupFriends\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                    weibo_topics.push("<td class=\"center\">" + (unescape(entity["IsVip"]) == "1" ? "<b class=\"color_2\">+V</b>" : "") + "</td>");
                    weibo_topics.push("<td class=\"left\" >" + unescape(entity["UName"]) + "</td>");
                    weibo_topics.push("<td class=\"center\">" + unescape(entity["Province"]) + "</td>");
                    //                    weibo_topics.push("<td class=\"person_two_buttom_right\">" + unescape(entity["City"]) + "</td>");
                    weibo_topics.push("<td class=\"right\">" + unescape(entity["FriendsCount"]) + "</td>");
                    weibo_topics.push("<td class=\"right\">" + unescape(entity["FellowCount"]) + "</td>");
                    weibo_topics.push("<td class=\"center\"><input class=\"btn_file\" type=\"button\"  name=\"addSingleGroup\" uid=\"" + unescape(entity["ID"]) + "\" value=\"分组\" /></td>");
                    weibo_topics.push("</tr>");
                    entity = l_obj["entity_" + (++count)];
                }
                $("#friendsBody").empty().html(weibo_topics.join(""));
                Index.loadFriendBtnClick();
            }
            sp.LoadData(1, Index.FriendsQueryParams);
            Index.FriendsQueryParams["groupid"] = "";
        });
    },
    loadFriendBtnClick: function() {
        //全选按钮
        $("#groupAllFriends").unbind("click");
        $("#groupAllFriends").click(function() {
            var ischeck = $(this).attr("checked");
            $("#friendsBody").find("input[name='groupFriends']").each(function() {
                $(this).attr("checked", ischeck);
            });
        });
        //批量添加分组
        $("#btnBatchGroup").unbind("click");
        $("#btnBatchGroup").click(function() {
            clearFriendsGroup();
            var ids = "";
            $("#friendsBody").find("input[name='groupFriends']").each(function() {
                if ($(this).attr("checked")) {
                    ids += $(this).val() + ",";
                }
            });
            if (ids == "") {
                alert("请选择需要分组的用户");
                return false;
            }
            ids = ids.substring(0, ids.length - 1);
            $("#selgrpids").attr("grpids", ids);
            shEd("sad", "friendsmove_column", "friendsLayer", "friendsLayer_close");
            //$("#selgrpids").attr("grpids");
        });
        //单个创建分组
        $("#friendsBody").find("input[name='addSingleGroup']").unbind("click");
        $("#friendsBody").find("input[name='addSingleGroup']").click(function() {
            clearFriendsGroup();
            var uid = $(this).attr("uid");
            $("#btnAddFriends").attr("addsingle");
            $("#selgrpids").attr("grpids", uid);
            shEd("sad", "friendsmove_column", "friendsLayer", "friendsLayer_close");
        });
        //单机创建按钮事件
        $("#btnWarningCreate").unbind("click");
        $("#btnWarningCreate").click(function() {
            $("#liWarning").hide();
            $("#liCreateGroup").css("display", "block");
        });
        $("#btnWarningCancel").unbind("click");
        $("#btnWarningCancel").click(function() {
            $("#liWarning").show();
            $("#liCreateGroup").css("display", "none");
        });
        //单机提交按钮，修改分组ID
        $("#btnAddFriends").unbind("click");
        $("#btnAddFriends").click(function() {
            var stype = $(this).attr("stype");
            var groupid = $("#selGroupFriendList").val();
            if (groupid == "") {
                alert("请选择分组");
                return undefined;
            }
            var groupids = $("#selgrpids").attr("grpids");

            $.post("Handler/WeiboTopicHandler.ashx", { "act": "GroupAttention", "groupId": groupid, "grids": groupids },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            Common.CloseEditFrame("sad", "friendsLayer");
                            clearFriendsGroup();
                            Index.InitFriendsContent();
                            Index.InitFriendsGroupList();
                        }
                    }, "json"
                   );
        });
        $("#btnCreateGroup").unbind("click");
        $("#btnCreateGroup").click(function() {
            var gname = $("#txtGroupName").val();
            if (gname == "") {
                alert("请输入分组名称");
                return false;
            }
            Index.addAttentionGroup(gname, "1");
        });


    },
    addAttentionGroup: function(gname, atstype) {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "addAttentionGroup", "gpName": gname, "attype": atstype },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            var retid = data["ID"];
                            var retgName = data["groupName"];
                            var ops = $("<option value='" + retid + "' selected='selected'>" + retgName + "</option>");
                            $("#selGroupFriendList").append(ops);
                            $("#txtGroupName").val("");
                        }
                    }, "json"
         );
    },
    //粉丝管理/////////////////////////////////////
    WeiboAttentionFellow: function() {
        Index.InitFellowContent();
        Index.InitFellowGroupList();
    },
    InitFellowContent: function() {
        var sp = new SqlPager(Index.FellowInitDate);
        sp.Display = function(data, l_obj) {
            var count = 1;
            var entity = l_obj["entity_" + count];
            var weibo_topics = [];
            if (!entity) {
                weibo_topics.push("<tr><td colspan=\"7\" style=\"height:240px; line-height:240px; text-align:center;\">暂无数据</td></tr>");
                $("#fellowfriendsBody").empty().html(weibo_topics.join(""));
                return false;
            }
            while (entity) {
                weibo_topics.push("<tr>");
                weibo_topics.push("<td class=\"center\" ><input type=\"checkbox\"   name=\"groupFellow\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                weibo_topics.push("<td class=\"center\">" + (unescape(entity["IsVip"]) == "1" ? "<b class=\"color_2\">+V</b>" : "") + "</td>");
                weibo_topics.push("<td class=\"left\" >" + unescape(entity["UName"]) + "</td>");
                weibo_topics.push("<td class=\"center\">" + unescape(entity["Province"]) + "</td>");
                //                weibo_topics.push("<td class=\"person_two_buttom_right\">" + unescape(entity["City"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["FriendsCount"]) + "</td>");
                weibo_topics.push("<td class=\"right\">" + unescape(entity["FellowCount"]) + "</td>");
                //                weibo_topics.push("<td class=\"person_two_buttom_right\"><input type=\"checkbox\"   name=\"groupFriends\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                weibo_topics.push("<td class=\"center\"><input class=\"btn_file\" type=\"button\"  name=\"fellowaddSingleGroup\" uid=\"" + unescape(entity["ID"]) + "\" value=\"分组\" /></td>");
                weibo_topics.push("</tr>");
                entity = l_obj["entity_" + (++count)];
            }
            $("#fellowfriendsBody").empty().html(weibo_topics.join(""));
            Index.loadFellowBtnClick();
        }
        sp.LoadData(1, Index.FellowQueryParams);

    }, loadFellowBtnClick: function() {
        //全选按钮
        $("#groupAllFellow").unbind("click");
        $("#groupAllFellow").click(function() {
            var ischeck = $(this).attr("checked");
            $("#fellowfriendsBody").find("input[name='groupFellow']").each(function() {
                $(this).attr("checked", ischeck);
            });
        });
        //批量添加分组
        $("#fellowbtnBatchGroup").unbind("click");
        $("#fellowbtnBatchGroup").click(function() {
            clearFellowGroup();
            var ids = "";
            $("#fellowfriendsBody").find("input[name='groupFellow']").each(function() {
                if ($(this).attr("checked")) {
                    ids += $(this).val() + ",";
                }
            });
            if (ids == "") {
                alert("请选择需要分组的用户");
                return false;
            }
            ids = ids.substring(0, ids.length - 1);
            $("#fellowselgrpids").attr("grpids", ids);
            shEd("sad", "fellowmove_column", "fellowLayer", "fellowLayer_close");
            //$("#selgrpids").attr("grpids");
        });
        //单个创建分组
        $("#fellowfriendsBody").find("input[name='fellowaddSingleGroup']").unbind("click");
        $("#fellowfriendsBody").find("input[name='fellowaddSingleGroup']").click(function() {
            clearFellowGroup();
            var uid = $(this).attr("uid");
            $("#btnAddFriends").attr("addsingle");
            $("#fellowselgrpids").attr("grpids", uid);
            shEd("sad", "fellowmove_column", "fellowLayer", "fellowLayer_close");
        });
        //单机创建按钮事件
        $("#fellowbtnWarningCreate").unbind("click");
        $("#fellowbtnWarningCreate").click(function() {
            $("#fellowliWarning").hide();
            $("#fellowliCreateGroup").css("display", "block");
        });
        $("#fellowbtnWarningCancel").unbind("click");
        $("#fellowbtnWarningCancel").click(function() {
            $("#fellowliWarning").show();
            $("#fellowliCreateGroup").css("display", "none");
        });
        //单机提交按钮，修改分组ID
        $("#btnAddFellow").unbind("click");
        $("#btnAddFellow").click(function() {
            var stype = $(this).attr("stype");
            var groupid = $("#fellowselGroupFriendList").val();
            if (groupid == "") {
                alert("请选择分组");
                return undefined;
            }
            var groupids = $("#fellowselgrpids").attr("grpids");

            $.post("Handler/WeiboTopicHandler.ashx", { "act": "GroupAttention", "groupId": groupid, "grids": groupids },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            Common.CloseEditFrame("sad", "fellowLayer");
                            clearFellowGroup();
                            Index.InitFellowContent();
                            Index.InitFellowGroupList();
                        }
                    }, "json"
                   );
        });
        $("#fellowbtnCreateGroup").unbind("click");
        $("#fellowbtnCreateGroup").click(function() {
            var gname = $("#fellowtxtGroupName").val();
            if (gname == "") {
                alert("请输入分组名称");
                return false;
            }
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "addAttentionGroup", "gpName": gname, "attype": "2" },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            var retid = data["ID"];
                            var retgName = data["groupName"];
                            var ops = $("<option value='" + retid + "' selected='selected'>" + retgName + "</option>");
                            $("#fellowselGroupFriendList").append(ops);
                            $("#fellowtxtGroupName").val("");
                            $("#fellowliWarning").show();
                            $("#fellowliCreateGroup").css("display", "none");
                        }
                    }, "json"
         );
        });
    },
    InitFellowGroupList: function() {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "FriendsGroupList", "attionType": "2" },
            function(data) {
                if (data && data["Success"] == 1) {
                    var count = 1;
                    delete data["Success"];
                    var entity = data["entity_" + count];
                    var industryCate = [];
                    var grpoption = [];
                    grpoption.push("<option value='' selected=\"selected\">请选择</option>");
                    while (entity) {
                        var cateid = entity["id"];
                        var ecount = entity["count"];
                        var groupname = entity["groupname"];
                        industryCate.push("<tr><");
                        if (cateid != "0") {
                            industryCate.push("<td class=\"left off\">");
                        }
                        else {
                            industryCate.push("<td class=\"left on\">");
                        }
                        industryCate.push("<input id=\"fellowgroupname_hid_" + unescape(cateid) + "\" style=\"display:none;\" value=\"" + unescape(groupname) + "\" />");
                        if (cateid != "0")
                            industryCate.push("<div class=\"person_btn\"><input class=\"btn_edit\" type=\"button\" name=\"fellowbtnEditGroupName\" btntype=\"edit\" groupid=\"" + unescape(cateid) + "\" value=\"\"/>&nbsp;&nbsp;<input class=\"btn_delete\" type=\"button\" name=\"fellowbtnDelGroupName\" id=\"fellowbtnDelGroupName_" + unescape(cateid) + "\"  groupid=\"" + unescape(cateid) + "\" value=\"\"/><input class=\"btn_false\" type=\"button\" id=\"fellowbtnCancelGroup_" + unescape(cateid) + "\" style=\"display:none;\" groupid=\"" + unescape(cateid) + "\" value=\"\"/></div>");
                        industryCate.push("<a href=\"javascript:void(null);\"  name=\"fellowattentionGroupAtag\" gpname=\"" + unescape(groupname) + "\" id=\"fellowattentionAtag_" + unescape(cateid) + "\" groupid=\"" + unescape(cateid) + "\">" + unescape(groupname) + "</a>");
                        industryCate.push("(<span class=\"color_2\">" + unescape(ecount) + "</span>)");
                        industryCate.push("</td></tr>");
                        grpoption.push("<option value='" + cateid + "'>" + unescape(groupname) + "</option>");
                        entity = data["entity_" + (++count)];
                    }

                    $("#fellowselGroupFriendList").empty().html(grpoption.join(""));
                    $("#fellowattentionGroupSetting").empty().html(industryCate.join(""));
                    Index.initFellowAttentionGroupbtnTag();

                }

            }, "json"
        );
    },
    initFellowAttentionGroupbtnTag: function() {
        $("#fellowattentionGroupSetting").find("input[name='fellowbtnDelGroupName']").unbind("click");
        $("#fellowattentionGroupSetting").find("input[name='fellowbtnDelGroupName']").click(function() {
            if (confirm("删除会将该组的话题重置为未分组，确认删除吗？")) {
                var groupid = $(this).attr("groupid");
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "DelAttentionGroup", "delAttentionGroupid": groupid },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            Index.InitFellowGroupList();
                        }
                    }, "json"
                   );
            }
        });
        $("#fellowattentionGroupSetting").find("input[name='fellowbtnEditGroupName']").unbind("click");
        $("#fellowattentionGroupSetting").find("input[name='fellowbtnEditGroupName']").click(function() {
            var currEdit = $(this);
            var groupid = currEdit.attr("groupid");
            if (currEdit.attr("btntype") == "edit") {
                currEdit.attr("btntype", "subm");
                $("#fellowbtnDelGroupName_" + groupid).hide();
                currEdit.val(""); //确认
                currEdit.attr("class", "btn_true");
                $("#fellowattentionAtag_" + groupid).hide();
                $("#fellowgroupname_hid_" + groupid).val($("#fellowattentionAtag_" + groupid).attr("gpname"));
                $("#fellowgroupname_hid_" + groupid).show();
                $("#fellowbtnCancelGroup_" + groupid).show();
            }
            else if (currEdit.attr("btntype") == "subm") {

                var grouptxt = $("#fellowgroupname_hid_" + groupid).val();
                if (grouptxt == "") {
                    alert("请输入分组名称");
                    return false;
                }
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "updateAttentionGroup", "groupId": groupid, "grouptxt": grouptxt },
                    function(data) {
                        if (data && data["Success"] == 1) {
                            $("#fellowgroupname_hid_" + groupid).val("");
                            $("#fellowgroupname_hid_" + groupid).hide();
                            currEdit.val(""); //确定
                            currEdit.attr("class", "btn_true");
                            currEdit.attr("btntype", "edit");
                            $("#fellowattentionAtag_" + groupid).show();
                            $("#fellowbtnDelGroupName_" + groupid).show();
                            currEdit.show();
                            $("#fellowbtnCancelGroup_" + groupid).hide();
                            Index.InitFellowGroupList();
                        }
                    }, "json"
                   );
            }
            $("#fellowbtnCancelGroup_" + groupid).click(function() {
                $("#fellowgroupname_hid_" + groupid).val("");
                $("#fellowgroupname_hid_" + groupid).hide();
                currEdit.val(""); //编辑
                $("#fellowbtnDelGroupName_" + groupid).show();
                currEdit.attr("class", "btn_edit");
                currEdit.attr("btntype", "edit");
                $("#fellowattentionAtag_" + groupid).show();
                currEdit.show();
                $(this).hide();
            });



        });
        $("#fellowbtnAddSingleAttentionGroup").unbind("click");
        $("#fellowbtnAddSingleAttentionGroup").click(function() {
            $(this).hide();
            $("#fellowaddAttentionGroupName").val("");
            $("#fellowaddAttentionGroupNameDiv").show();


        });
        $("#fellowbtnCancelAttentionGroupAdd").unbind("click");
        $("#fellowbtnCancelAttentionGroupAdd").click(function() {
            $("#fellowaddAttentionGroupName").val("");
            $("#fellowaddAttentionGroupNameDiv").hide();
            $("#fellowbtnAddSingleAttentionGroup").show();
        });
        $("#fellowbtnAddAttentionGroupName").unbind("click");
        $("#fellowbtnAddAttentionGroupName").click(function() {
            var groupName = $("#fellowaddAttentionGroupName").val();
            if (groupName == "") {
                alert("请输入分组名称");
                return false;
            }
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "addAttentionGroupName", "groupName": groupName, "attionType": "2", "mainuid": "2659126494" },
                                function(data) {
                                    if (data && data["Success"] == 1) {
                                        $("#fellowaddAttentionGroupName").val("");
                                        $("#fellowaddAttentionGroupNameDiv").hide();
                                        $("#fellowbtnAddSingleAttentionGroup").show();
                                        Index.InitFellowGroupList();
                                        alert("操作成功");
                                    }
                                }, "json"
                );
        });
        $("#fellowattentionGroupSetting").find("a[name='fellowattentionGroupAtag']").unbind("click");
        $("#fellowattentionGroupSetting").find("a[name='fellowattentionGroupAtag']").click(function() {
            Index.FellowQueryParams["groupid"] = $(this).attr("groupid");
            $("#fellowattentionGroupSetting").find("td").attr("class", "left off");
            $(this).parent().attr("class", "left on");
            var sp = new SqlPager(Index.FellowInitDate);
            sp.Display = function(data, l_obj) {
                var count = 1;
                var entity = l_obj["entity_" + count];
                var weibo_topics = [];
                if (!entity) {
                    weibo_topics.push("<tr><td colspan=\"7\" style=\"height:240px; line-height:240px; text-align:center;\">暂无数据</td></tr>");
                    $("#fellowfriendsBody").empty().html(weibo_topics.join(""));
                    return false;
                }
                while (entity) {
                    weibo_topics.push("<tr>");
                    weibo_topics.push("<td class=\"center\" ><input type=\"checkbox\"   name=\"groupFellow\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                    weibo_topics.push("<td class=\"center\">" + (unescape(entity["IsVip"]) == "1" ? "<b class=\"color_2\">+V</b>" : "") + "</td>");
                    weibo_topics.push("<td class=\"left\" >" + unescape(entity["UName"]) + "</td>");
                    weibo_topics.push("<td class=\"center\">" + unescape(entity["Province"]) + "</td>");
                    //                    weibo_topics.push("<td class=\"right\">" + unescape(entity["City"]) + "</td>");
                    weibo_topics.push("<td class=\"right\">" + unescape(entity["FriendsCount"]) + "</td>");
                    weibo_topics.push("<td class=\"center\">" + unescape(entity["FellowCount"]) + "</td>");
                    //                weibo_topics.push("<td class=\"person_two_buttom_right\"><input type=\"checkbox\"   name=\"groupFriends\" value=\"" + unescape(entity["ID"]) + "\" /></td>");
                    weibo_topics.push("<td class=\"center\"><input class=\"btn_file\" type=\"button\"  name=\"fellowaddSingleGroup\" uid=\"" + unescape(entity["ID"]) + "\" value=\"分组\" /></td>");
                    weibo_topics.push("</tr>");
                    entity = l_obj["entity_" + (++count)];
                }
                $("#fellowfriendsBody").empty().html(weibo_topics.join(""));
                Index.loadFellowBtnClick();
            }
            sp.LoadData(1, Index.FellowQueryParams);
            Index.FellowQueryParams["groupid"] = "";
        });
    },
    //统计页面
    statisticTopic: function(topicid, transferPath, keyword) {
        $("#advanceSearch_tab").find("li").attr("class", "tab_off");
        $("#advanceSearch_tab").find("li").eq(0).attr("class", "tab_on");
        Index.statisticTopicCount(topicid);
        $("#statisticTopicDiv").show();
        Index.statisticTopicdateSWF(topicid);
        $("#retTopicMain").click(function() { $("#statisticTopicDiv").hide(); $("#" + transferPath).show(); });
        Index.statisticPNqueryParams["text"] = keyword;
        Index.statisticPNqueryParams["FieldText"] = "MATCH{2}:EMOTION"; //MATCH{2}:EMOTION 
        Index.statisticTopicPN(keyword);
        Index.DisplayPNPager(Index.statisticPNinitData, Index.statisticPNqueryParams, "2"); //默认显示正面微博内容
        Index.DisplayPNISVIP(keyword);
        Index.DisplayPNProvince(keyword);
    },
    statisticTopicCount: function(topicid) {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "statisticTopic", "topicid": topicid },
                                function(data) {
                                    if (data && data["Success"] == 1) {
                                        //params :OriginalCount,ForwardCount,CommentCount
                                        var entity = data["entity_1"];
                                        var statisticTopic = [];
                                        var keywords;
                                        if (entity) {
                                            var topicname = entity["Name"];
                                            var ocount = parseInt(entity["OriginalCount"]);
                                            var fcount = parseInt(entity["ForwardCount"]);
                                            var ccount = parseInt(entity["CommentCount"]);
                                            keywords = entity["Keywords"];
                                            var allcount = ocount + fcount + ccount;
                                            $("#statisticTopicName").text(unescape(topicname));
                                            statisticTopic.push("<tr><td class=\"left\" width=\"28%\">微博总数</td><td class=\"right\"><span class=\" color_2\">" + allcount + "</span></td></tr>");
                                            statisticTopic.push("<tr><td class=\"left\" width=\"28%\">原创</td><td class=\"right\"><b>" + ocount + "</b></td></tr>");
                                            statisticTopic.push("<tr><td class=\"left\" width=\"28%\">转发</td><td class=\"right\"><b>" + fcount + "</b></td></tr>");
                                            statisticTopic.push("<tr><td class=\"left\" width=\"28%\">评论</td><td class=\"right\"><b>" + ccount + "</b></td></tr>");
                                        }
                                        $("#statisticTopicBody").empty().html(statisticTopic.join(""));
                                        //                                        if (keywords) {
                                        //                                            Index.statisticTopicPN(keywords);
                                        //                                        }
                                        //load html statistic Topic
                                    }
                                }, "json"
                );
    }, //统计话题趋势
    statisticTopicdateSWF: function(topicid) {
        var flash_url = "Chart/amstock.swf";
        var flash_params = { wmode: "transparent" };
        var set_params = [];
        set_params.push("selType=topicTrend");
        set_params.push("action=getTopicDate");
        set_params.push("dateperiod=" + topicid);
        var set_url = "amChartSetting/amTrendsetting.ashx?act=" + set_params.join("|");
        var flashVars =
        {
            settings_file: set_url
        };
        swfobject.embedSWF(flash_url, "total_date_flash", "580", "360", "8.0.0", "amchatsflash/expressInstall.swf", flashVars);
    }, //话题内容正负面
    statisticTopicPN: function(keywords) {
        $("#advanceSearch_tab").find("li").unbind("click");
        $("#advanceSearch_tab").find("li").click(function() {
            $("#advanceSearch_tab").find("li").attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            Index.statisticPNqueryParams["text"] = keywords;
            Index.statisticPNqueryParams["FieldText"] = "MATCH{" + $(this).attr("pid") + "}:EMOTION";
            Index.DisplayPNPager(Index.statisticPNinitData, Index.statisticPNqueryParams, $(this).attr("pid"));
        });
    },
    DisplayPNPager: function(initdata, params, displayType) {
        var Lpager = new Pager(initdata);
        Lpager.Display = function(data, l_obj) {
            var dtypetext;
            var dtypeclass;
            if (displayType == -2) {
                dtypetext = "负";
                dtypeclass = "fu";
            } else if (displayType == 0) {
                dtypetext = "中";
                dtypeclass = "zhong";
            }
            else {
                dtypetext = "正";
                dtypeclass = "zheng";
            }
            var count = 1;
            var entity = data["entity_" + count];
            var htmlcontent = [];
            while (entity) {
                htmlcontent.push("<div class=\"gw_news_text_weibo\"><div class=\"button_topic_" + dtypeclass + "\">" + dtypetext + "</div><a class=\"topic_yuanwen\">" + unescape(entity["DISPLAYCONTENT"]) + "</a>");
                //htmlcontent.push("<p class=\"weibo_search\" style=\"float: right; height: 26px; width: 80px; margin-right: 6px;\"><a href=\"javascript:void(null)\" name=\"addTopicFrame\">添加为话题</a></p>");
                htmlcontent.push("<div class=\"find_text_thre\"><a href=\"" + unescape(entity["AUTHORURL"]) + "\" target=\"_blank\">" + unescape(entity["AUTHORNAME"]) + "</a>&nbsp&nbsp");
                htmlcontent.push(unescape(entity["TIMESTAMP"]) + "【" + unescape(entity["SITENAME"]) + "】&nbsp&nbsp<span>转发（<span style=\"color: #F00;\">" +
                                unescape(entity["FORWARDNUM"]) + "</span>）&nbsp&nbsp<span>评论（<span style=\"color: #F00;\">" + unescape(entity["REPLYNUM"]) + "</span>）</span></div> <div class=\"clear\"></div></div>");
                entity = data["entity_" + (++count)];
            }
            $("#divPositivenegative").empty().html(htmlcontent.join(""));
        };
        Lpager.LoadData(1, params);

    },
    DisplayPNISVIP: function(keywords) {
        var set_params = [];
        set_params.push("selType=pieISVIP");
        set_params.push("action=GetQueryTagValues");
        set_params.push("fieldname=ISVIP");
        set_params.push("sort=DocumentCount");
        set_params.push("documentcount=True");
        set_params.push("databasematch=WEIBO");
        set_params.push("predict=false");
        set_params.push("disnum=5");
        set_params.push("text=" + keywords);
        var set_url = "amChartSetting/amPieData.ashx?act=" + set_params.join("|");
        var flashVars =
            {
                settings_file: "amChartSetting/pieSetting.xml",
                data_file: set_url
            };
        swfobject.embedSWF("Chart/ampie.swf", "total_faan_flash", "400", "300", "8.0.0", "Chart/expressInstall.swf", flashVars);
        //total_province_flash
    },
    DisplayPNProvince: function(keywords) {
        var set_params = [];
        var flash_url = "Chart/FCF_Column3D.swf";
        var victor_id = "total_province_flash";
        var width = 370;
        var height = 260;
        set_params.push("selType=piePROVINCE");
        set_params.push("action=GetQueryTagValues");
        set_params.push("fieldname=PROVINCE");
        set_params.push("sort=DocumentCount");
        set_params.push("documentcount=True");
        set_params.push("databasematch=WEIBO");
        set_params.push("predict=false");
        set_params.push("disnum=40");
        set_params.push("text=" + keywords);
        //Chart/FCF_Column3D.swf
        var set_url = "amChartSetting/amPieData.ashx?act=" + set_params.join("|");
        //        var flashVars =
        //            {
        //                settings_file: "amChartSetting/provincePieSetting.xml",
        //                data_file: set_url
        //            };
        // swfobject.embedSWF("Chart/ampie.swf", "total_province_flash", "400", "300", "8.0.0", "Chart/expressInstall.swf", flashVars);
        var chart = new FusionCharts(flash_url, victor_id, width, height);
        chart.setDataURL(set_url);
        chart.render(victor_id);
        //
        //        var victor_id = "total_province_flash";
        //        var set_params = [];
        //        set_params.push("action=GetQueryTagValues");
        //        set_params.push("fieldname=MYSITENAME");
        //        set_params.push("sort=DocumentCount");
        //        set_params.push("dateperiod=day");
        //        set_params.push("documentcount=True");
        //        set_params.push("databasematch=safety");
        //        set_params.push("disnum=6");
        //        set_params.push("text=*");
        //        var xmlstr = [];
        //        var width = 350;
        //        var height = 260;
        //        var post_url = "Handler/Statistic.ashx?act=" + set_params.join("|");
        //        var chart = new FusionCharts(flash_url, victor_id, width, height);
        //        chart.setDataURL(post_url);
        //        chart.render(victor_id);
    }

}


function shEd(a, b, c, d) {
    Common.ShowEditFrame(a, b, c, d);
}
function getDate() {
    var dat = new Date();
    return dat.getDate() + "/" + (dat.getMonth() + 1) + "/" + dat.getFullYear();

}

function clearhid() {
    $("#txtTopicName").val("");
    $("#txtKeywords").val("");
    $("#txtIndustry").val("");
}
function clearFriendsGroup() {
    $("#groupAllFriends").attr("checked", false);
    $("#selGroupFriendList").val("");
    $("#liWarning").show();
    $("#liCreateGroup").css("display", "none");
    $("#selgrpids").attr("grpids", "");
}
function clearFellowGroup() {
    $("#groupAllFellow").attr("checked", false);
    $("#fellowselGroupFriendList").val("");
    $("#fellowliWarning").show();
    $("#fellowliCreateGroup").css("display", "none");
    $("#fellowselgrpids").attr("grpids", "");
}
function clearKeywordsState() {
    $("#txtKeywordsName").val("");
    $("#txtKeywordsName").attr("sid", "");
    $("#txtKWRelevance").val("");
    $("#categoryLayerBtnAdd").attr("stype", "");
    $("#categoryMScore").val("");
}
function clearIndustryState() {
    $("#categoryLayerName").val("");
    $("#categoryLayerName").attr("sid", "");
    $("#categoryLayerKeyword").val("");
    $("#btnAddKeywords").attr("stype", "");
}
function focusBlur(txtid) {
    $("#" + txtid).focus(function() {
        if ($(this).text() == "关键词") {
            $(this).text("");
        }
    });
    $("#" + txtid).blur(function() {
        if ($(this).text() == "") {
            $(this).text("关键词");
        }
    });
}

