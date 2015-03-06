
/// <reference path="weiboAnalysis.js" />
/// <reference path="../jquery-1.8.1.js" />


function WarningInfoInitPage(params) {
    //alert(JSON.stringify(params));
    // Common.LoginInitFun = function () {
    var warnType = params["type"]; //"hot"; //
    var warnMinID = params["hotminid"]; // "1"; //
    var warnWordCount = params["wordcount"]; // 30; //
    WarningInfo.cacheData = new CacheInfoData();
    WarningInfo._Template = new Analysis();
    WarningInfo.InitEventFun();
    WarningInfo.InitAttention(function (data) {
        WarningInfo.attention = data;
        switch (warnType) {
            case "heatWarn":
                $("dd a[name='warnTab']:eq(3)").parent().addClass("on");
                WarningInfo.InitWarnHot("0");
                $("#warnType").empty().html("热度预警");
                break;
            case "sensitiveWarn":
                $("dd a[name='warnTab']:eq(0)").parent().addClass("on");
                $("#warnType").empty().html("事故预警");
                WarningInfo.InitWarnWord("0");
                break;
            case "hot":
                $("dd a[name='warnTab']:eq(3)").parent().addClass("on");
                $("#warnType").empty().html("热度预警");
                WarningInfo.InitWarnHot(warnMinID);
                break;
            case "word":
                $("dd a[name='warnTab']:eq(0)").parent().addClass("on");
                $("#warnType").empty().html("敏感预警");
                WarningInfo.InitWarnWord(warnWordCount);
                break;
        }
        WarningInfo.clickAllCkbox(); //初始化全选框
        CreateTopicAnalysis(); //初始化创建话题
    });
    Material.Init();
}



//初始化关注人列表
var _warningInfo = new Object;
var WarningInfo = _warningInfo.property = {
    wordData: { "page_size": 5, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx" },
    wordQeuryParams: { "action": "warnWordList", "wordCount": ""  },
    hotData: { "page_size": 5, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx" },
    hotQeuryParams: { "action": "warnHotList", "minID": "" },
    OrgSqlParams: { "page_size": 9999, "result_id": "followerList", "status_bar_id": "pager_list", "load_img": "", "info_id": "page_info", "sql_tag": "item", "web_url": "Handler/KeyWordsHandler.ashx" },
    OrgPageParams: { "act": "initKeywords", "where": "", "orderBy": "ID DESC" },
    personSqlParams: { "page_size": 9999, "result_id": "followerList", "status_bar_id": "pager_list", "load_img": "", "info_id": "page_info", "sql_tag": "item", "web_url": "Handler/KeyWordsHandler.ashx" },
    personPageParams: { "act": "initKeywords", "where": "", "orderBy": "ID DESC" },
    idolParameter: { "display_style": 8, "act": "personalDetails", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "true", "nearTime": "0,d" },
    pageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    actionType: "",
    _Template: new Analysis(),
    monitorInfoHander: "Handler/MonitorInfo.ashx",
    attention: {},
    webSource: Config.WeiboSource,
    pingLunUrl: Config.WeiboPingLunUrl,
    zhuanFaUrl: Config.WeiboZhuanFaUrl,
    init: function () {
        Material.Init();
        this._Template = new Analysis();
        this._Template.analysis.Init();
    },
    cacheData: new Object, //临时选择的数据
    InitWarnHot: function (warnMinID) {
        WarningInfo.actionType = "warnhot";
        if (warnMinID != "0") {
            WarningInfo.hotQeuryParams["minID"] = warnMinID;
        }
        else {
            WarningInfo.hotQeuryParams["minID"] = "";
        }
        var sp = new SqlPager(WarningInfo.hotData);
        sp.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            var count = 1;
            var entity = data["entity_" + count];
            var Warningjson = "";
            if (!entity) {
                Common.LoadingImg("list_body_div", "0");
                return;
            }
            function _material(data) {
                data = data.data;
                var newData = {};
                newData["profileImageUrl"] = unescape(data.Profile_image_url);
                newData["reference"] = data.MainID;
                newData["authorName"] = unescape(data.Nick);
                newData["dreContent"] = unescape(data.Text);
                newData["thumbnailPic"] = unescape(data.Thumbnail_pic);
                var ws = parseInt(data.WebSource);
                if (ws > 0) {
                    newData["siteName"] = WarningInfo.webSource[ws];
                }
                //转发
                newData["forwardNum"] = data.Count;
                newData["replyNum"] = data.MCount;
                newData["url"] = unescape(data.URL);
                newData["timesTamp"] = unescape(data.Timestamp);
                Material.addMaterial(newData);
            }
            $("#list_body_div").empty();
            var ids = [];
            while (entity) {
                var _html = WarningInfo.LoadTamplateData(entity, count);
                _html.find("a[name='add_material_library_a']").unbind().bind("click", entity, _material);
                entity["reference"] = entity.MainID;
                _html.find("a[name='weiboCommentsA']").unbind("click").bind("click", entity, PingLun.Init);
                ids.push(entity.MainID);
                $("#list_body_div").append(_html);
                entity = data["entity_" + (++count)];
            }
            var data = { "action": "plcount", "ids": ids.join(",") };
            $.ajax("Handler/ReItemHandler.ashx", {
                type: "get",
                dataType: "json",
                data: data,
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        $("span[mid='" + data[i].MainID + "']").show();
                    }
                }, error: function () {
                }
            });
            //鼠标背景色
            $("#list_body_div .wb_boxnr").hover(
            function () {
                $(this).addClass("on");
            },
            function () {
                $(this).removeClass("on");
            });
            //重新绑定页面复选框事件
            WarningInfo.resetPageEvent();
        }
        sp.LoadData(1, WarningInfo.hotQeuryParams);
    },
    InitWarnWord: function (warnWordCount) {
        //敏感预警
        WarningInfo.actionType = "warnword";
        if (warnWordCount != "0") {
            WarningInfo.wordQeuryParams["wordCount"] = warnWordCount;
        }
        else {
            WarningInfo.wordQeuryParams["wordCount"] = "";
        }
        var sp = new SqlPager(WarningInfo.wordData);
        sp.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            $("#list_body_div").empty();
            var count = 1;
            var entity = data["entity_" + count];
            var Warningjson = "";
            if (!entity) {
                Common.LoadingImg("list_body_div", "0");
                return;
            }
            function _material(data) {
                data = data.data;
                var newData = {};
                newData["profileImageUrl"] = unescape(data.Profile_image_url);
                newData["reference"] = data.MainID;
                newData["authorName"] = unescape(data.Nick);
                newData["dreContent"] = unescape(data.Text);
                newData["thumbnailPic"] = unescape(data.Thumbnail_pic);
                var websourceTitle = "";
                var ws = parseInt(data.WebSource);
                if (ws > 0) {
                    websourceTitle = WarningInfo.webSource[ws];
                }
                newData["siteName"] = websourceTitle;

                newData["url"] = unescape(data.URL);
                newData["timesTamp"] = unescape(data.Timestamp);
                Material.addMaterial(newData);
            }
            while (entity) {
                var _html = WarningInfo.LoadTamplateData(entity, count);
                entity["reference"] = entity.MainID
                _html.find("a[name='add_material_library_a']").bind("click", entity, _material);
                _html.find("a[name='weiboCommentsA']").unbind("click").bind("click", entity, PingLun.Init);
                $("#list_body_div").append(_html);
                entity = data["entity_" + (++count)];
            }
            //鼠标背景色
            $("#list_body_div .wb_boxnr").hover(
            function () {
                $(this).addClass("on");
            },
            function () {
                $(this).removeClass("on");
            });
            WarningInfo.resetPageEvent();
        }
        sp.LoadData(1, WarningInfo.wordQeuryParams);
    },
    InitPerson: function (id) {
        WarningInfo.actionType = "warnperson";
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");

        WarningInfo.personPageParams["where"] = "KeywordType=" + id;
        var sp = new SqlPager(WarningInfo.personSqlParams);
        sp.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            var names = [];
            var count = 1;
            var entity = data["entity_" + count];
            if (!entity) {
                Common.LoadingImg("followerList", "2");
                return;
            }
            while (entity) {
                names.push(unescape(entity.Name));
                entity = data["entity_" + (++count)];
            }
            WarningInfo.GetPsersonOrOrgIdolData(names.join(','));
        }
        sp.LoadData(1, WarningInfo.personPageParams);
    },
    InitOrg: function (id) {
        WarningInfo.actionType = "warnorg";
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");

        WarningInfo.OrgPageParams["where"] = "KeywordType=" + id;
        var sp = new SqlPager(WarningInfo.OrgSqlParams);
        sp.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            var names = [];
            var count = 1;
            var entity = data["entity_" + count];
            if (!entity) {
                Common.LoadingImg("followerList", "2");
                return;
            }
            while (entity) {
                names.push(unescape(entity.Name));
                entity = data["entity_" + (++count)];
            }
            WarningInfo.GetPsersonOrOrgIdolData(names.join(','));
        }
        sp.LoadData(1, WarningInfo.OrgPageParams);
    },
    GetPsersonOrOrgIdolData: function (keyword) {
        //text
        WarningInfo.idolParameter["text"] = keyword;
        WarningInfo.idolParameter["fieldtext"] = "EXISTS{}:DRETITLE";

        var Lpager = new Pager(WarningInfo.pageInitParameter);
        Lpager.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);

            WarningInfo._Template.analysis.resultDataIdol(data.data);
            WarningInfo._Template.analysis.showUserInfoDiv();
            $("a[name='favorite']").click(function () {
                WarningInfo._Template.analysis.initFavoriteEvent(this);
            });
            WarningInfo._Template.analysis.checkboxChange();
        };
        Lpager.LoadData(1, WarningInfo.idolParameter);
    },
    InitEventFun: function () {
        $("a[name='warnTab']").unbind("click").click(function () {
            if (!$(this).parent().attr("class")) {
                $(this).parent().siblings().removeClass();
                $(this).parent().addClass("on");
                switch ($(this).attr("pid")) {
                    case "0":
                        $("#warnType").empty().html("事故预警");
                        WarningInfo.InitWarnWord("0");
                        break;
                    case "1":
                        $("#warnType").empty().html("热度预警");
                        WarningInfo.InitWarnHot("0");
                        break;
                    case "2":
                        //导入机构预警JS Fun
                        $("#warnType").empty().html("机构预警");
                        WarningInfo.InitOrg("3");
                        break;
                    case "3":
                        //导入人物预警JS Fun
                        $("#warnType").empty().html("人物预警");
                        WarningInfo.InitPerson("4");
                        break;

                }
            }
        });
    },
    InitAttention: function (cb) {
        $.post("Handler/MonitorInfo.ashx", { "act": "getattention" }, function (data) {
            cb(data);
        }, "json");
    },
    resetPageEvent: function () {//重置状态
        this.checkboxChange();
        this.showUserInfo();
        this.bindFavorite();
        this.delWarning();
    },
    delWarning: function () {
        $("#list_body_div a[name='delwarning']").click(function () {
            var id = $(this).attr("iid");
            var _$doc = this;
            var handlerUrl = "";
            if (WarningInfo.actionType == "warnword") {
                handlerUrl = "Handler/EarlyWarnWordHandler.ashx";
            } else if (WarningInfo.actionType == "warnhot") {
                handlerUrl = "Handler/EarlyWarnHotHandler.ashx";
            } else {
                return;
            }
            $.post(handlerUrl, { "act": "delwarning", "id": id },
                    function (data) {
                        if (data && data["Success"] == 1) {
                            $(_$doc).removeClass("btn_mail").addClass("btn_mailread");
                        }
                    }, "json");
        });
    },
    bindFavorite: function () {
        $("a[name='favorite']").click(function () {
            WarningInfo._Template.analysis.addFavorite(this);
        });
    },
    showUserInfo: function () {
        var sett = setTimeout;
        $(".wb_boxnr").each(function () {
            var d = this;
            var wb_tac2 = $(this).find(".wb_tac");
            function _hide() {
                $(wb_tac2).fadeOut(200);
            }
            $(d).find("img[name='headimg']").hover(
            function () {
                wb_tac2.fadeIn(200);
                wb_tac2.hover(function () {
                    clearTimeout(sett);
                },
                function () {
                    wb_tac2.fadeOut(200);
                });
            },
            function () {
                sett = setTimeout(_hide, 1000);
            });

        });

        $("a[name='userinfo_a']").hover(function () {
            var t = this;
            $(this).parent().parent().find(".wb_tac").show()
            .unbind("hover").hover(function () {
                $(this).show();
                clearTimeout(sett);
                $(".jiagz a").unbind("click").click(function () {
                    $(this).html("提交中...");
                    var $dom = this;
                    var datas = {};
                    if ($(this).attr("act") == "tj") {
                        datas["act"] = "addattention";
                    } else {
                        datas["act"] = "removeattention";
                    }
                    datas["webSource"] = $(this).attr("source");
                    datas["nick"] = $(this).attr("nick");
                    datas["userName"] = $(this).attr("name");
                    if (datas["webSource"] == 1 && datas["nick"] == "") {
                        datas["nick"] = datas["userName"];
                    }
                    datas["d"] = new Date().getTime();
                    WarningInfo.addGuanZhu(datas, this);
                });
            },
             function () {

                 $(this).hide();
             });
        }, function () {
            var hiddom = $(this).parent().parent().find(".wb_tac");
            sett = setTimeout(function () { $(hiddom).hide(); }, 300);
        });
    },
    addGuanZhu: function (data, dom) {//添加关注
        var datas = data;
        this.getPostAjax(data, this.monitorInfoHander, function (data) {
            if (data.success == "1") {
                if (data.act == "tj") {
                    WarningInfo.attention[datas["userName"] + "_" + datas["webSource"]] = datas["nick"];
                    $(dom).attr("act", "qx");
                    $(dom).html("取消关注");
                    $("#" + datas["userName"] + "_" + datas["webSource"]).addClass("wb_ygz");
                } else {
                    WarningInfo.attention[datas["userName"] + "_" + datas["webSource"]] = "";
                    $(dom).attr("act", "tj");
                    $(dom).html("添加关注");
                    $("#" + datas["userName"] + "_" + datas["webSource"]).removeClass("wb_ygz");
                }
            }
        });
    },
    getPostAjax: function (data, url, cb) {

        $.post(url, data, function (data) {
            if (typeof (cb) == "function") {
                //是否有回调函数
                cb(data);
            }
        }, "json");
    },
    LoadTamplateData: function (data, index) {
        var nick = unescape(data.Nick);
        var name = unescape(data.Name);
        var href = unescape(data.URL);
        var attAttr = name + "_" + data.WebSource;
        var temp = [];
        temp.push("<div class=\"wb_boxnr\" >");
        temp.push("<div class=\"wb_boximg\"> ");
        temp.push("<span><img name='headimg' src=\"" + unescape(data.Profile_image_url) + "\" onerror=\"this.src='img/userdefault.jpg'\" ></span>");
        temp.push("<input id=\"" + data.MainID + "\" name=\" \" type=\"checkbox\" value=\"" + data.ItemID + "\" class=\"wb_inputmar\" webSource=\"" + data.WebSource + "\" /> ");
        temp.push("</div> ");
        temp.push("<div class=\"wb_boxusernr\">");


        temp.push("<div  class=\"wb_tac\" style=\"display:none\" >"); /*个人信息*/
        temp.push("<div class=\"wb_tac2\">");
        temp.push("<div class=\"wb_boximg\">");
        if (WarningInfo.attention[attAttr] == nick) {
            temp.push("<div class=\"wb_ygz\" id=\"" + attAttr + "\" ></div>");
        } else {
            temp.push("<div  id=\"" + attAttr + "\" ></div>");
        }
        temp.push("<span><img src=\"" + unescape(data.Profile_image_url) + "\" onerror=\"this.src='img/userdefault.jpg'\"  /></span>"); /*头像*/
        temp.push("</div>");
        temp.push("<div class=\"wb_tacnr\">");
        temp.push(nick);                      /*昵称*/
        temp.push(data.IsVip == "1" ? "<img src=\"img/v.gif\" align=\"absmiddle\">" : ""); /*是否加+V*/
        //temp.push("性别图片位置预留")/*性别图片位置预留*/
        temp.push("<br />");
        temp.push("<a href=\"javascript:void(0);\">关注 （" + data.Friends_count + "）</a> | <a href=\"javascript:void(0);\">微博 （" + data.Statuses_count + "）</a> | <a href=\"javascript:void(0);\">粉丝 （" + data.Followers_count + "）</a>"); /*关注数、微博数、粉丝数*/
        temp.push(data.WebSource == "1" ? "http://weibo.com/" + data.UserID : "http://1.t.qq.com/" + name);         /*个人微博连接地址*/
        temp.push("<br />");
        temp.push(unescape(data.Verified_reason));             /*+V个人说明*/
        temp.push("</div>");
        temp.push("<div class=\"jiagz\">");
        // temp.push(" <a href=\"#\">加关注</a></div>"); /*添加关注*/
        if (WarningInfo.attention[attAttr] == nick) {
            temp.push("<a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.WebSource + " nick=\"" + nick + "\" name=\"" + name + "\" act=\"qx\">取消关注</a></div>"); /*取消关注*/
        } else {
            temp.push("<a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.WebSource + " nick=\"" + nick + "\" name=\"" + name + "\" act=\"tj\">添加关注</a></div>"); /*添加关注*/
        }
        temp.push("<div class=\"clear\">");
        temp.push("</div>");
        temp.push("</div>");
        temp.push(" </div>");

        temp.push(" <div class=\"wb_usertit\">");
        temp.push("<a name=\"userinfo_a\"  href=\"javascript:void(0)\"><b>" + name + "：</b></a>");
        temp.push(unescape(data.Text));

        temp.push("<div style=\"display:none\" class=\"wb_pl\" id=pl" + data.MainID + "><a class=\"btn_close\" href=\"javascript:\" title=\"关闭\"></a><ul></ul><div class=\"page\" id=plpage" + data.MainID + "></div> </div>");

        temp.push("</div>");
        temp.push("</div>");
        temp.push("<div class=\"clear\"></div>");

        //微博按钮模板
        temp.push("<div class=\"new_top10\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tr>");
        temp.push("<td>");
        if (data.URL) {
            //temp.push("<a href=\"javascript:void(0)\" target=\"_blank\"><b>" + unescape(data.Timestamp) + "</b></a>"); /*时间*/
            temp.push("<a href=\"" + href + "\" target=\"_blank\"><b>" + unescape(data.Timestamp) + "</b></a>"); /*时间*/
        } else {
            temp.push("<b>" + unescape(data.Timestamp) + "</b>");
        }
        var ws = parseInt(data.WebSource);
        var SiteName = "";
        if (ws > 0) {
            SiteName = WarningInfo.webSource[ws];
        }
        temp.push("　" + SiteName); /*来源*/

        temp.push("</td>");
        temp.push("<td align=\"right\">");

        var zhuanfa = "";
        var pinglun = "";
        if (ws > 0) {
            zhuanfa = href + WarningInfo.zhuanFaUrl[ws];
            pinglun = href + WarningInfo.pingLunUrl[ws];
        }

        if (href != "") {
            temp.push("<span><a href=\"" + zhuanfa + "\" target=\"_blank\" >转发</a>（<b class=\"color_2\">" + data.Count + "</b>）</span>"); /*转发量*/
            temp.push("|");
            temp.push(" <span><a href=\"" + pinglun + "\" target=\"_blank\"> 评论</a>（<b class=\"color_2\">" + data.MCount + "</b>）</span>"); /*评论量*/
            temp.push("|");
            //temp.push(" <span><a name=\"weiboCommentsA\" href=\"javascript:void(0)\" >评论精华</a></span>"); /*评论量*/
            temp.push("<span style='display:none;' mid=" + data.MainID + "><a name=\"weiboCommentsA\" href=\"javascript:void(0);\"  mid=\"" + data.MainID + "\">精华评论</a></span>");
        } else {
            temp.push("<span>转发（<b class=\"color_2\">" + data.Count + "</b>）</span>"); /*转发量*/
            temp.push("|");
            temp.push(" <span> 评论（<b class=\"color_2\">" + data.MCount + "</b>）</span>"); /*评论量*/
            temp.push("|");
            temp.push("<span style='display:none;' mid=" + data.MainID + "><a name=\"weiboCommentsA\" href=\"javascript:void(0);\"  mid=\"" + data.MainID + "\">精华评论</a></span>");
        }
        temp.push("</td>");
        temp.push("<td align=\"right\" width=\"84\">");
        temp.push("<span class=\"btn\">");
        if (data.IsRead == 1) {
            temp.push("<a class=\"btn_mailread\" title=\"已阅读\"></a>");
        } else if (data.IsRead == 0) {
            temp.push("<a class=\"btn_mail\" title=\"标记为已阅读\" name=\"delwarning\" act=\"delwarning\" iid=\"" + data.ID + "\" pid=\"" + data.MainID + "\" href=\"javascript:void(0)\"></a>");
        }
        temp.push("<a class=\"btn_file\" title=\"加入简报夹\" name='add_material_library_a' href=\"javascript:void(0);\"></a>");
        temp.push("<a class=\"btn_favorite\" title=\"收藏\" name=\"favorite\" pid=\"" + data.MainID + "\" href=\"javascript:void(0)\"></a>");
        temp.push("</span>");
        temp.push("</td>");
        temp.push("</tr>");
        temp.push("</table>");
        temp.push("</div>");

        var incre = data.increment;
        if (index != 0 && incre != undefined) {
            //**************************************需要改热度值的位置*************************//
            //低速，中速，高速
            var lv = data.increment / 30;
            var speedImg = (data.increment < 500 ? "btn_speed_green.gif" : data.increment > 500 && data.increment < 1000 ? "btn_speed_yellow.gif" : "btn_speed_red.gif")
            var speedBoder = (data.increment < 500 ? "wb_rightc_green" : data.increment > 500 && data.increment < 1000 ? "wb_rightc_yellow" : "wb_rightc_red")
            var speedTxt = (data.increment < 500 ? "半小时内转发<b class=\"color_1\">" + data.increment + "</b>条，传播速度<b class=\"color_1\">" + lv.toFixed(2) + "条/分</b>，达到<b class=\"color_1\">绿色</b>预警" : data.increment > 500 && data.increment < 1000 ? "半小时内转发<b class=\"color_3\">" + data.increment + "</b>条，传播速度<b class=\"color_3\">" + lv.toFixed(2) + "条/分</b>，达到<b class=\"color_3\">黄色</b>预警" : "半小时内转发<b class=\"color_2\">" + data.increment + "</b>条，传播速度<b class=\"color_2\">" + lv.toFixed(2) + "条/分</b>，达到<b class=\"color_2\">红色</b>预警")

            temp.push("<div class=\"wb_rightc " + speedBoder + "\">");
            temp.push("<h1><img src=\"img/" + speedImg + "\" width=\"45\" height=\"27\" /></h1>");
            temp.push("<p>" + speedTxt + "</p>");
            temp.push("<div class=\"clear\"></div>");
            temp.push("</div>");
        }
        else {
            
        }

        temp.push("</div> ");
        return $(temp.join(""));

    }, clickAllCkbox: function () { //全选/全不选框
        $("#click_all_ckbox").click(function () {
            var ckd = this.checked;
            $("#list_body_div .wb_inputmar").each(function () {
                if (ckd) { //选中状态
                    if (this.checked) {

                    } else {
                        var source = $(this).attr("webSource");
                        WarningInfo.cacheData.add(this.id, this.value, source);
                        $("#checknumber").empty().append(WarningInfo.cacheData.items.length);
                    }
                } else {
                    WarningInfo.cacheData.remove(this.id);
                    $("#checknumber").empty().append(WarningInfo.cacheData.items.length);
                }
                this.checked = ckd;
            });
            WarningInfo.checkShow();
        });
    }, checkboxChange: function () {  //更新页面复选框的绑定事件
        $("#list_body_div .wb_inputmar").change(function () {
            if (this.checked) { //选中状态
                var source = $(this).attr("webSource");
                WarningInfo.cacheData.add(this.id, this.value, source);
                $("#checknumber").empty().append(WarningInfo.cacheData.items.length);
            } else {
                WarningInfo.cacheData.remove(this.id);
                $("#checknumber").empty().append(WarningInfo.cacheData.items.length);
            }
            //判断当页是否全选了
            var len = $("#list_body_div .wb_inputmar").length;
            var count = 0;
            $("#list_body_div .wb_inputmar").each(function () {
                if (this.checked) {
                    count++;
                }
            });
            $("#click_all_ckbox").attr("checked", count == len);
        });
        WarningInfo.checkShow();
    },
    checkShow: function () {
        for (var i = 0; i < WarningInfo.cacheData.items.length; i++) {
            var cid = "#" + WarningInfo.cacheData.items[i].referenceid;
            $(cid).attr("checked", "checked");
        }
        //判断当页是否全选
        var len = $("#list_body_div .wb_inputmar").length;
        var count = 0;
        $("#list_body_div .wb_inputmar").each(function () {
            if (this.checked) { count++; }
        });
        $("#click_all_ckbox").attr("checked", count == len);
    }
}

/*弹出添加话题层显示、隐藏*/
//创建话题事件
function CreateTopicAnalysis() {
    //输入话题
    var promptText = "给微博话题取个名字吧...";
    $("#show_topic_div").click(function () {
        if (WarningInfo.cacheData.items.length > 0) {
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        } else {
            alert("请选择话题");
        }
    });

    $("#close_topic_div").click(function () {
        $("#topic_analysis_div").hide();
    });
    $("#topic_content_txt")
            .focusin(function () {
                if (this.value == promptText) {
                    $(this).text("");
                }
            })
            .focusout(function () {
                if (this.value == "" || this.value == promptText) {
                    $(this).text(promptText);
                    $("#create_topic_analysis").unbind();
                } else {
                    $("#create_topic_analysis").unbind().click(AddWeiboTopicAnalysis);
                }
            });
}

//创建话题(入库)
function AddWeiboTopicAnalysis() {
    $("#create_topic_analysis").unbind();
    var catchD = WarningInfo.cacheData.items;
    //话题类容
    //话题数据
    if (catchD.length > 0) {
        var analysisdata = "";
        for (var i = 0; i < catchD.length; i++) {
            analysisdata += catchD[i].referenceid + "," + catchD[i].itemid + "," + catchD[i].websource + "|";
        }
        $.post("Handler/MonitorInfo.ashx", { "data": analysisdata, "topicName": $("#topic_content_txt").val() }, function (data) {
            if (data.success == "1") {
                Common.SubmitPop("submitPopDiv");
                Common.CloseEditFrame("sad", "layer");
                WarningInfo.cacheData.items.length = 0;
                $("input[type='checkbox']").removeAttr("checked");
                $("textarea").val("给微博话题取个名字吧...");
                $("#checknumber").empty().append("0");
                WarningInfo.checkShow();
            }
        }, "json");
    }
}


/*页面数据Data*/
function CacheInfoData() {
    $("#TabUL li").removeClass("on");
    this.items = new Array();
    this.add = function (refid, itemid, websource) {
        var model = new Object();
        model.referenceid = refid;
        model.itemid = itemid;
        model.websource = websource;
        this.items.push(model);
    }
    this.remove = function (id) {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].referenceid == id) {
                this.items.splice(i, 1);
            }
        }
    }
}
