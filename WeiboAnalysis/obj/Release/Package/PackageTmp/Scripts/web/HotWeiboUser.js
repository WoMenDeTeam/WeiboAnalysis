/// <reference path="../jquery-1.8.1.js" />
var HotWeiboUser = {
    infoData: Object,
    isInit: false,
    interval: setInterval,
    initParam: {},

    leftListTemp: " <dd><a href='javascript:void(null);' name='categoryKey' cid='<%=ID %>' pid='<%=GroupIndex %>'><%=GroupName %></a></dd>",
    GetHotUser: function (params, callfun) {
        $("#left_user_hot_plan").removeClass().addClass("wb_httit"); //.height(540);
        var param = { "act": "weiboRank", "action": "GetQueryTagValues", "fieldname": "AUTHORNAME", "text": "*", "database": Config.IdolDataBase["newweibo"], "documentcount": "true", "mindate": "", "maxdate": "", "sort": "DocumentCount", "maxresults": "10" };
        for (var i in params) {
            param[i] = params[i];
        }
        if (typeof (callfun) == "function") {
            HotWeiboUser.CallFun = callfun;
        }
        HotWeiboUser.initParam = param;

        if (HotWeiboUser.isInit) {
            HotWeiboUser.CallFun();
        } else {
            HotWeiboUser.GetData();
            HotWeiboUser.interval = setInterval(HotWeiboUser.GetData, 60000);
        }
    }, GetData: function () {
        var param = HotWeiboUser.initParam;
        $.post("Handler/WeiboEventHandler.ashx", param,
        function (data) {
            if (HotWeiboUser.isInit) {
                HotWeiboUser.infoData = data;
            } else {
                HotWeiboUser.isInit = true;
                HotWeiboUser.infoData = data;
                HotWeiboUser.CallFun();
            }
        }, "json");
    },
    CallFun: function () {
        var data = HotWeiboUser.infoData;
        if (data && data["Success"] == "1") {
            var count = 1;
            var entity = data["entity_" + count];
            var weiboRankJson = [];
            if (!entity) {
                Common.LoadingImg("rankList", "0");
                return;
            }
            weiboRankJson.push("<ul>");
            while (entity) {
                weiboRankJson.push("<li>");
                if (count < 10) {
                    if (count <= 3)
                        weiboRankJson.push("<span class=\"num hot\">0" + count + "</span>");
                    else
                        weiboRankJson.push("<span class=\"num\">0" + count + "</span>");
                } else {
                    weiboRankJson.push("<span class=\"num\">" + count + "</span>");
                }
                weiboRankJson.push("<span class=\"text\">" + unescape(entity.title) + "</span>");

                weiboRankJson.push("<code><b class=\"color_2\">" + unescape(entity.count) + "</b></code>");
                weiboRankJson.push("</li>");

                entity = data["entity_" + (++count)];
            }
            weiboRankJson.push("</ul>");
            $("#left_user_hot_plan").empty().html(weiboRankJson.join(""));
        }
    }
}