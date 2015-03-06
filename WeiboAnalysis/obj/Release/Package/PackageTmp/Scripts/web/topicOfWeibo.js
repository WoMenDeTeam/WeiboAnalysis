/// <reference path="weiboAnalysis.js" />



var topicid;
var topicName;
var topicStart;
function topicOfWeiboFun(params) {
    topicid = params["topicId"];
    topicName = params["topicName"];
    topicStart = params["jobstate"];
    var page = params["backPage"];
    $("#blackPage").unbind("click").bind("click", (function () {
        Top.loadPersonalDetailsPage('topicList.html', 1, page)
    }));
    TopicOfWeibo.init();
}

var _topicOfWeibo = new Object;
var TopicOfWeibo = _topicOfWeibo.property = {
    idolParameter: { "display_style": 8, "act": "topicOfWeibo", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "page_size": "15", "text": "*", "print": "all", "start": "1", "predict": "false" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "/Handler/WeiboEventHandler.ashx" },
    commentQueryParams: { "action": "loadComments", "topicid": "", "orderby": "" },
    commentInitData: { "page_size": 10, "result_id": "topicList", "status_bar_id": "pager_list",
        "info_id": "page_info", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx"
    },
    sqlParams: { "act": "query", "topicId": 0 },
    topicOfWeiboHander: "/Handler/TopicOfWeibo.ashx",
    _Template: new Analysis(),
    sqldata: null,
    backpage: 0,
    mainIds: [],
    init: function () {
        this._Template = new Analysis();
        this._Template.analysis.Init();
        this._Template.analysis.viewId = "#list_body_div";
        this.sqlParams["topicId"] = topicid;
        if (topicStart == "3")
            this._Template.analysis.replyNumStart = 1;
        this.getTopicItem();
        if (topicStart == "0")
            $("#delete_topic").click(TopicOfWeibo.delWeiboTopic);
        $("#topicName").html(topicName);
        HotWeiboUser.GetHotUser({}, null);
    },
    getTopicItem: function () {
        this.sqlParams["act"] = "query"
        this.sqlParams["d"] = new Date().getTime();
        this._Template.analysis.getPostJson(this.topicOfWeiboHander, this.sqlParams, this.loadSqlTopicItem);
    },
    loadSqlTopicItem: function (data) {
        if (data.error) {
            TopicOfWeibo.mainIds.length = 0;
            TopicOfWeibo.sqldata = data;
            for (var i = 0; i < data.data.length; i++) {
                TopicOfWeibo.mainIds.push(data.data[i].mainId);
            }
        }
        TopicOfWeibo.idolParameter["MatchReference"] = TopicOfWeibo.mainIds.join("+");
        TopicOfWeibo.loadIdol();
    },
    loadIdol: function () {
        var Lpager = new Pager(TopicOfWeibo.PageInitParameter);
        Lpager.Display = function (data) {
            //加载模板
            TopicOfWeibo._Template.analysis.resultDataIdol(data.data);
            TopicOfWeibo._Template.analysis.showUserInfoDiv();
            $("#cm_close").unbind("click").click(function () {
                $("#cmLayer").hide();
            });
            $("#list_body_div span[name='favorite'] a").html("收藏").click(function () {
                TopicOfWeibo._Template.analysis.addFavorite(this);
            });
            if (topicStart == "0") //加载复选框事件
                TopicOfWeibo._Template.analysis.checkboxChange();
            else {
                $("#list_body_div .wb_inputmar").hide();
                $("#actionBtns").hide();
            }
        };
        Lpager.LoadData(1, TopicOfWeibo.idolParameter);
    },
    delWeiboTopic: function () {
        var ids = [];
        var datas = TopicOfWeibo._Template.analysis.catcheData.items;
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                ids.push(datas[i].referenceid);
            }
            TopicOfWeibo.sqlParams["act"] = "delete";
            TopicOfWeibo.sqlParams["mainids"] = ids.join(",");
            TopicOfWeibo._Template.analysis.getPostJson(TopicOfWeibo.topicOfWeiboHander, TopicOfWeibo.sqlParams, function (data) {
                if (data.error) {
                    $("#list_body_div").empty();
                    TopicOfWeibo._Template.analysis.catcheData.items.length = 0;
                    TopicOfWeibo.getTopicItem();
                }
            });
        }
    },
    loadComments: function (topicId) {
        TopicOfWeibo.commentQueryParams["topicid"] = topicId;
        var sp = new SqlPager(TopicOfWeibo.commentInitData);
        sp.Display = function (l_obj, data) {
            var count = 1;
            var entity = data["entity_" + count];
            var weiboComment = [];
            if (!entity) {
                Common.LoadingImg("topicComments", "2");
                return;
            }
            while (entity) {
                weiboComment += TopicOfWeibo.LoadTamplateData(entity, 0);
                entity = data["entity_" + (++count)];
            }
            $("#topicComments").empty().html(weiboComment);
        }
        sp.LoadData(1, TopicOfWeibo.commentQueryParams);
    },
    LoadTamplateData: function (data, index) {
        var nick = unescape(data.Nick);
        var name = unescape(data.Name);
        var attAttr = name + "_" + data.WebSource;
        var temp = [];
        temp.push("<div class=\"wb_boxnr\" >");
        temp.push("<div class=\"wb_boximg\"> ");
        temp.push("<span><img src=\"" + unescape(data.Profile_image_url) + "\" onerror=\"this.src='img/userdefault.jpg'\" ></span>");
        temp.push("</div> ");
        temp.push("<div class=\"wb_boxusernr\">");
        temp.push("<div  class=\"wb_tac\" style=\"display:none\" >"); /*个人信息*/
        temp.push("<div class=\"wb_tac2\">");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<div  id=\"" + attAttr + "\" ></div>");
        temp.push("<span><img src=\"" + unescape(data.Profile_image_url) + "\" onerror=\"this.src='img/userdefault.jpg'\"  /></span>"); /*头像*/
        temp.push("</div>");
        temp.push("<div class=\"wb_tacnr\">");
        temp.push(nick);                      /*昵称*/
        temp.push(data.IsVip == "1" ? "<img src=\"img/v.gif\" align=\"absmiddle\">" : ""); /*是否加+V*/
        temp.push("<br />");
        temp.push(data.WebSource == "1" ? "http://weibo.com/" + data.UserID : "http://1.t.qq.com/" + name);         /*个人微博连接地址*/
        temp.push("<br />");
        temp.push("</div>");
        temp.push("<div class=\"jiagz\">");
        temp.push("</div>"); /*添加关注*/
        temp.push("<div class=\"clear\">");
        temp.push("</div>");
        temp.push("</div>");
        temp.push(" </div>");
        temp.push(" <div class=\"wb_usertit\">");
        temp.push("<a name=\"userinfo_a\"  href=\"" + (data.WebSource == "1" ? "http://weibo.com/" + data.UserID : "http://1.t.qq.com/" + name) + "\"><b>" + name + "：</b></a>");
        temp.push(unescape(data.Text));
        temp.push("<div class=\"new_top10\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tr>");
        temp.push("<td>");
        temp.push("<b>" + unescape(data.Timestamp) + "</b>"); /*时间*/
        temp.push("</td>");
        temp.push("</tr>");
        temp.push("</table>");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("<div class=\"clear\"> ");
        temp.push("</div >");
        temp.push("</div> ");
        return temp.join("");
    }
}