/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../../Handler/ReItemHandler.ashx" />

//$(document).ready(function () {
//    ReItem.init();
//    HotWeiboUser.GetHotUser({}, null);

//});
function ChaKanPingLun(params) {
    ReItem.TopicId = params["topicid"];
    $("#blackPage").unbind().bind("click", function () {
        Top.loadWeiBoStatisticPage("weiboStatistics.html", params["topicid"], params["name"], params["page"]);
    });
    HotWeiboUser.GetHotUser({}, null);
    ReItem.init();
}
var ReItem = {
    TopicId: 53,
    SqlInitData: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/ReItemHandler.ashx" },
    SqlData: { "action": "getreitemlist", "orderBy": "Timestamp ASC" },
    WeiboSource: Config.WeiboSource,
    init: function () {
        Material.Init();
        var data = { "action": "getreitemlist", "mid": 53 }
        ReItem.GetMainId();
        $("#orderbytime_li").toggle(function () {
            ReItem.SqlData["orderBy"] = " Timestamp DESC ";
            $(this).find("a").text("时间排序↑");
            ReItem.GetReItem();
        }, function () {
            ReItem.SqlData["orderBy"] = " Timestamp ASC ";
            $(this).find("a").text("时间排序↓");
            ReItem.GetReItem();
        });
    },
    GetMainId: function () {
        var data = { "act": "query", "topicId": ReItem.TopicId };
        var mainIds = [];
        ReItem.GetAjax("/Handler/TopicOfWeibo.ashx", data, function (data) {
            for (var i = 0; i < data.data.length; i++) {
                mainIds.push(data.data[i].mainId);
            }
            ReItem.SqlData["mainids"] = mainIds.join(",");
            ReItem.SqlData["where"] = " MainID in(" + mainIds.join(",") + ")";
            ReItem.GetReItem();
        });
    },
    GetReItem: function () {
        var sp = new SqlPager(ReItem.SqlInitData);
        sp.Display = function (data) {

            function _material(datas) {
                var orgdata = datas.data;
                var newData = {};
                newData["profileImageUrl"] = unescape(orgdata.Profile_image_url);
                newData["reference"] = orgdata.MainID;
                newData["authorName"] = unescape(orgdata.Nick);
                newData["dreContent"] = unescape(orgdata.Text);
                newData["thumbnailPic"] = unescape(orgdata.Thumbnail_pic);
                var websourceTitle = "";
                var websourceTitle = ReItem.WeiboSource[orgdata.WebSource];

                newData["siteName"] = websourceTitle == undefined ? "其他" : websourceTitle;
                newData["url"] = unescape(orgdata.URL);
                newData["timesTamp"] = unescape(orgdata.Timestamp);
                Material.addMaterial(newData);
            }
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            var count = 1;
            var entity = data["entity_" + count];
            $("#list_body_div").empty();
            while (entity) {
                var newData = entity;
                var _html = ReItem.LoadTamplateData(newData, 0);
                _html.find("a[name='add_material_library_a']").bind("click", entity, _material);
                $("#list_body_div").append(_html);
                entity = data["entity_" + (++count)];
            }
        }
        sp.LoadData(1, ReItem.SqlData);
    },
    LoadTamplateData: function (data, index) {
        var temp = [];
        var nick = unescape(data.Nick);
        var name = unescape(data.Name);
        var profileUrl = unescape(data.Profile_image_url)
        temp.push("<div class=\"wb_boxnr\">");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<span>");
        temp.push("<img onerror=\"this.src='img/userdefault.jpg'\" src=\"" + profileUrl + "\" name=\"headimg\"></span><input style=\"display:none;\"  type=\"checkbox\" websource=\"" + data.WebSource + "\" class=\"wb_inputmar\" value=\"" + data.ItemID + "\" name=\" \" id=\"" + data.MainID + "\">");
        temp.push("</div>");
        temp.push("<div class=\"wb_boxusernr\">");
        temp.push("<div style=\"display: none;\" class=\"wb_tac\">");
        temp.push("<div class=\"wb_tac2\">");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<div id=\"zega_1\">");
        temp.push("</div>");
        temp.push("<span>");
        temp.push("<img onerror=\"this.src='img/userdefault.jpg'\" src=\"http://tp2.sinaimg.cn/1650577433/50/5664607257/1\"></span></div>");
        temp.push("<div class=\"wb_tacnr\">");
        temp.push("zega<br>");
        temp.push("<a href=\"javascript:void(0);\">关注 （457）</a> | <a href=\"javascript:void(0);\">微博 （4998）</a>");
        temp.push("| <a href=\"javascript:void(0);\">粉丝 （978）</a>http://weibo.com/1650577433<br>");
        temp.push("</div>");
        temp.push("<div class=\"jiagz\">");
        temp.push("<a act=\"tj\" name=\"zega\" nick=\"zega\" source=\"1\" href=\"javascript:void(0)\" class=\"add_guan_zhu\">");
        temp.push("  添加关注</a></div>");
        temp.push("<div class=\"clear\">");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("<div class=\"wb_usertit\">");
        temp.push("<a href=\"javascript:void(0);\" name=\"userinfo_a\"><b>" + nick + "：</b></a>");
        temp.push(Common.displayExpression(unescape(data.Text)));
        temp.push("<div class=\"new_top10\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tbody>");
        temp.push("<tr>");
        temp.push("<td>");
        var sitename = ReItem.WeiboSource[data.WebSource];
        temp.push("<a target=\"_blank\" href=\"javascript:void(0);\"><b> " + unescape(data.Timestamp) + "</b></a> " + sitename + "");
        temp.push("</td>");
        temp.push("<td align=\"right\">");
        temp.push("<span><a class=\"btn_file\" title=\"加入简报夹\" href=\"javascript:void(0);\" name=\"add_material_library_a\"></a></span>");
        temp.push("</td>");
        temp.push("</tr>");
        temp.push("</tbody>");
        temp.push("</table>");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("<div class=\"clear\">");
        temp.push("</div>");
        temp.push("</div>");
        return $(temp.join(""));
    },
    GetAjax: function (url, data, callfun) {
        $.ajax(url, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
                // alert("error");
            }
        });

    }
}