/// <reference path="../jquery-1.8.1.js" />
var ZhuanFa = {
    SqlInitData: { "page_size": 3, "result_id": "result_id", "status_bar_id": "page", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/RetweetItemHandler.ashx" },
    SqlData: { "action": "getreitemlist", "orderBy": "Timestamp DESC" },
    WeiboSource: Config.MediaType,
    Init: function (rData) {
        var MainId = rData.data.reference;
        var pageID = "plpage" + MainId;
        var listdiv = "#pl" + MainId;
        $(listdiv).show();
        $(listdiv + " a").unbind().bind("click", function () {
            $(this).parent().hide();
        });
        ZhuanFa.SqlInitData["status_bar_id"] = pageID;
        ZhuanFa.SqlData["where"] = "ID =" + MainId;
        var sp = new SqlPager(ZhuanFa.SqlInitData);
        sp.Display = function (data) {
            var id = listdiv + " ul";
            $(id).empty();
            var count = 1;
            var entity = data["entity_" + count];
            while (entity) {
                var newData = entity;
                var _html = ZhuanFa.LoadTamplateData(newData, 0);
                $(id).append(_html);
                entity = data["entity_" + (++count)];
            }
        }
        sp.LoadData(1, ZhuanFa.SqlData);
    }, LoadTamplateData: function (data, index) {
        var temp = [];
        var nick = unescape(data.Nick);
        var name = unescape(data.Name);
        var profileUrl = unescape(data.Profile_image_url)
        temp.push("<div class=\"wb_boxnr\">");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<span>");
        temp.push("<img onerror=\"this.src='img/userdefault.jpg'\" src=\"" + profileUrl + "\" name=\"headimg\"></span><input style=\"display:none;\"  type=\"checkbox\" websource=\"" + data.WebSource + "\" class=\"wb_inputmar\" value=\"" + data.ItemID + "\" name=\" \" id=\"" + data.MainID + "\">");
        temp.push("</div>");
        temp.push("<div class=\"wb_usertit\">");
        temp.push("<a href=\"javascript:void(0);\" name=\"userinfo_a\"><b>" + nick + "：</b></a>");
        temp.push(Common.displayExpression(unescape(data.Text)));
        temp.push("<div class=\"new_top10\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tbody>");
        temp.push("<tr>");
        temp.push("<td>");
        var sitename = ZhuanFa.WeiboSource[data.WebSource];
        temp.push("<a target=\"_blank\" href=\"javascript:void(0);\"><b> " + unescape(data.Timestamp) + "</b></a>&#12288;来源&nbsp;" + sitename + "");
        temp.push("</td>");
        temp.push("<td align=\"right\">");
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
    }
}