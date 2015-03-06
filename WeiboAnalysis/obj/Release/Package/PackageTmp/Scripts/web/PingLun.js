/// <reference path="../jquery-1.8.1.js" />
var PingLun = {
    SqlInitData: { "page_size": 3, "result_id": "result_id", "status_bar_id": "page", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/ReItemHandler.ashx" },
    SqlData: { "action": "getreitemlist", "orderBy": "Timestamp DESC" },
    WeiboSource: Config.WeiboSource,
    Init: function (rData) {
        //alert(JSON.stringify(rData));
        var MainId = rData.data.reference;
        var pageID = "plpage" + MainId;
        var listdiv = "#pl" + MainId;

        $(listdiv + " a").unbind().bind("click", function () {
            $(this).parent().hide();
        });

        PingLun.SqlInitData["status_bar_id"] = pageID;
        PingLun.SqlData["where"] = "MainID =" + MainId;
        var sp = new SqlPager(PingLun.SqlInitData);
        sp.Display = function (data) {
            var id = listdiv + " ul";
            $(id).empty();
            var count = 1;
            var entity = data["entity_" + count];
            while (entity) {
                var newData = entity;
                var _html = PingLun.LoadTamplateData(newData, 0);
                $(id).append(_html);
                entity = data["entity_" + (++count)];
            }
            if (count > 1) {
                $(listdiv).show();
            } else {
                //$(id).append("</li>无精华评论信息</li>");
            }

        }
        sp.LoadData(1, PingLun.SqlData);
    }, LoadTamplateData: function (data, index) {
        var temp = [];
        var nick = unescape(data.Nick);
        var name = unescape(data.Name);
        var profileUrl = unescape(data.Profile_image_url)
        temp.push("<li>");
        temp.push("<div class=\"wb_boxnr\">");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<span>");
        temp.push("<img onerror=\"this.src='img/userdefault.jpg'\" src=\"" + profileUrl + "\" name=\"headimg\"></span><input style=\"display:none;\"  type=\"checkbox\" websource=\"" + data.WebSource + "\" class=\"wb_inputmar\" value=\"" + data.ItemID + "\" name=\" \" id=\"" + data.MainID + "\">");
        temp.push("</div>");
        //            temp.push("<div class=\"wb_boxusernr\">");
        //                temp.push("<div style=\"display: none;\" class=\"wb_tac\">");
        //                    temp.push("<div class=\"wb_tac2\">");
        //                        temp.push("<div class=\"wb_boximg\">");
        //                            temp.push("<div id=\"zega_1\">");
        //                            temp.push("</div>");
        //                        temp.push("<span>");
        //                        temp.push("<img onerror=\"this.src='img/userdefault.jpg'\" src=\"http://tp2.sinaimg.cn/1650577433/50/5664607257/1\"></span></div>");
        //                        temp.push("<div class=\"wb_tacnr\">");
        //                        temp.push("zega<br>");
        //                        temp.push("<a href=\"javascript:void(0);\">关注 （457）</a> | <a href=\"javascript:void(0);\">微博 （4998）</a>");
        //                        temp.push("| <a href=\"javascript:void(0);\">粉丝 （978）</a>http://weibo.com/1650577433<br>");
        //                    temp.push("</div>");
        //                    temp.push("<div class=\"jiagz\">");
        //                        temp.push("<a act=\"tj\" name=\"zega\" nick=\"zega\" source=\"1\" href=\"javascript:void(0)\" class=\"add_guan_zhu\">");
        //                    temp.push("  添加关注</a></div>");
        //                    temp.push("<div class=\"clear\">");
        //                    temp.push("</div>");
        //                temp.push("</div>");
        //            temp.push("</div>");
        temp.push("<div class=\"wb_usertit\">");
        temp.push("<a href=\"javascript:void(0);\" name=\"userinfo_a\"><b>" + nick + "：</b></a>");
        temp.push(Common.displayExpression(unescape(data.Text)));
        temp.push("<div class=\"new_top10\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tbody>");
        temp.push("<tr>");
        temp.push("<td>");
        var sitename = PingLun.WeiboSource[data.WebSource];
        temp.push("<a target=\"_blank\" href=\"javascript:void(0);\"><b> " + unescape(data.Timestamp) + "</b></a>");
        temp.push("</td>");
        temp.push("<td align=\"right\">");
        temp.push("</td>");
        temp.push("</tr>");
        temp.push("</tbody>");
        temp.push("</table>");
        temp.push("</div>");
        temp.push("</div>");
        //temp.push("</div>");
        temp.push("<div class=\"clear\">");
        temp.push("</div>");
        temp.push("</div>");
        temp.push("</li>");
        return temp.join("");
    }
}