/// <reference path="../jquery-1.8.1.js" />

var _weiboRank = new Object;
var WeiboRank = _weiboRank.property = {
    RankQueryParams: { "act": "weiboRank", "action": "GetQueryTagValues", "fieldname": "AUTHORNAME", "text": "*", "database": Config.IdolDataBase["newweibo"], "documentcount": "true", "mindate": "", "maxdate": "", "sort": "DocumentCount", "maxresults": "20" },
    groupData: {},
    ids: [],
    sqlInitParams: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "orderBy": "OccurrenceTime", "sql_tag": "item", "web_url": "../../Handler/SysGroupHandler.ashx" },
    sqlRequestParams: { "action": "getuser", "orderBy": "InsertTime DESC" },
    userManageHandler: "../../Handler/SysGroupHandler.ashx",
    leftListTemp: " <dd><a href='javascript:void(null);' name='categoryKey' cid='<%=ID %>' pid='<%=GroupIndex %>'><%=GroupName %></a></dd>",
    gzTemps: "<li><span class='text'><input type='checkbox' name='gzlist' value='<%=ID%>' />&nbsp;&nbsp;<a title='<%=Nick%>' href='javascript:void(0);'onclick='Top.personDetailsByName(\"<%=Nick%>\",0 )'><%=Nick.length > 11 ? Nick.substring(0, 11):Nick %></a></span><span class=\"btn\"><a act=\"del\" class=\"btn_delete\" cid=<%=ID%> gid=<%=GroupID%> href=\"javascript:void(0)\" title=\"取消关注\"></a></span></li>",
    init: function () {
        $("#clickall_ckb").unbind().bind("click", function () {
            $("#rankList input[type='checkbox']").attr("checked", this.checked);
        });
        var time = Config.GetTimeDDMMYYYY();
        $("#custom_start_time").val(time); $("#custom_end_time").val(time);
        WeiboRank.RankQueryParams["mindate"] = time;
        WeiboRank.RankQueryParams["maxdate"] = time; $("#custom_end_time").val();
        WeiboRank.getEventGroup();
        $("#setGroup").unbind().bind("click", function () {
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
            $("#btnAddT").unbind().bind("click", WeiboRank.updateGroup);
        });

        $("#allUser dd").unbind().bind("click", function () {
            $("#leftList_dl .on").removeClass("on");
            $(this).addClass("on");
            $("#real_time_btn").show();
            $("#clickall_ckb,#setGroup").hide();
            $("#weibo_screening_btn").removeClass("no");

        });

        $("#allUser dd a").unbind().bind("click", function () {
            Common.LoadingImg("rankList", "1");
            WeiboRank.RankQueryParams["mindate"] = $("#custom_start_time").val();
            WeiboRank.RankQueryParams["maxdate"] = $("#custom_end_time").val();
            WeiboRank.InitWeiboRank();
            $("#pageBar").empty();
            $("#clickall_ckb").attr("checked", false);

        });
        WeiboRank.InitWeiboRank();
    },
    InitWeiboRank: function (param) {
        if (param == null || param == undefined) {
            param = WeiboRank.RankQueryParams;
        }
        $.post("Handler/WeiboEventHandler.ashx", param,
                     function (data) {
                         if (data && data["Success"] == "1") {
                             var count = 1;
                             var entity = data["entity_" + count];
                             var weiboRankJson = [];
                             var weiboRankJsonright = [];
                             if (!entity) {
                                 Common.LoadingImg("rankList", "0");
                                 return;
                             }
                             //2013.04.17 梁新加
                             weiboRankJson.push("<ul>");
                             weiboRankJsonright.push("<ul>");
                             while (entity) {
                                 var title = unescape(entity.title);
                                 title = title.length > 11 ? title.substring(0, 11) : title;
                                 if (count <= 10) {
                                     weiboRankJson.push("<li>");
                                     if (count < 10)
                                         if (count <= 3)
                                             weiboRankJson.push("<span class=\"num hot\">0" + count + "</span>");
                                         else
                                             weiboRankJson.push("<span class=\"num\">0" + count + "</span>");
                                     else
                                         weiboRankJson.push("<span class=\"num\">" + count + "</span>");
                                     weiboRankJson.push("<span class=\"text\"> <a title=\"" + unescape(entity.title) + "\" onclick='Top.personDetailsByName(\"" + unescape(entity.title) + "\",0 )'>" + title + "</a></span>");
                                     weiboRankJson.push("<code>微博：<b class=\"color_2\">" + unescape(entity.count) + "</b></code>");
                                     weiboRankJson.push("</li>");
                                 } else {
                                     weiboRankJsonright.push("<li>");
                                     weiboRankJsonright.push("<span class=\"num\">" + count + "</span>");
                                     weiboRankJsonright.push("<span class=\"text\"> <a title=\"" + unescape(entity.title) + "\" onclick='Top.personDetailsByName(\"" + unescape(entity.title) + "\",0 )'>" + title + "</a></span>");
                                     weiboRankJsonright.push("<code>微博：<b class=\"color_2\">" + unescape(entity.count) + "</b></code>");
                                     weiboRankJsonright.push("</li>");
                                 }
                                 entity = data["entity_" + (++count)];
                             }

                             weiboRankJson.push("</ul>");
                             weiboRankJsonright.push("</ul>");
                             //$("#rankList").addClass("wb_httit4");
                             $("#rankList,#rankListRight").removeClass("wb_httit5").removeClass("wb_httit3").addClass("wb_httit4");
                             $("#rankList").empty().html(weiboRankJson.join(""));
                             $("#rankListRight").empty().html(weiboRankJsonright.join(""));
                         }

                     }, "json");
    },
    CacheHistory: function (title, d) {
        var _el = $("<li><a href='javascript:void(0);'>" + title + "</a></li>").click(function () {
            Common.LoadingImg("rankList", "1");
            WeiboRank.InitWeiboRank(d);
        });
        $("#historyList ul").prepend(_el);
        $("#historyList ul li:gt(10)").remove();
    },
    GetNewParam: function (param) {
        var newParam = {};
        for (var i in param) {
            newParam[i] = param[i];
        }
        return newParam;
    },
    InitEventFun: function () {

        $("#btn_history").unbind().bind("click", function () {
            $("#history_div").show();
        });

        $("#colse_history_div").unbind().bind("click", function () {
            $("#history_div").hide();
        });

        $("#custom_search_btn").unbind("click").bind("click", function () {
            var ht = [];
            Common.LoadingImg("rankList", "1");
            WeiboRank.RankQueryParams["mindate"] = $("#custom_start_time").val();
            ht.push($("#custom_start_time").val());
            WeiboRank.RankQueryParams["maxdate"] = $("#custom_end_time").val();
            ht.push($("#custom_end_time").val());
            var word = $("#keyword_txt").val();
            //WeiboRank.RankQueryParams["text"] = word == "" ? "*" : word;
            if (word != "") {
                ht.push(word);
                WeiboRank.RankQueryParams["fieldtext"] = "STRING{" + word + "}:AUTHORNAME";
            } else {
                WeiboRank.RankQueryParams["fieldtext"] = "";
            }
            var d = WeiboRank.GetNewParam(WeiboRank.RankQueryParams);
            WeiboRank.CacheHistory(ht.join("+"), d);
            WeiboRank.InitWeiboRank();
        });

        $("#weibo_screening_btn").unbind("click").bind("click", function () {
            var ht = [];

            Common.LoadingImg("rankList", "1");
            WeiboRank.RankQueryParams["mindate"] = $("#custom_start_time").val();
            ht.push($("#custom_start_time").val());
            WeiboRank.RankQueryParams["maxdate"] = $("#custom_end_time").val();
            ht.push($("#custom_end_time").val());
            var word = $("#keyword_txt").val();
            if (word != "") {
                ht.push(word);
                WeiboRank.RankQueryParams["fieldtext"] = "STRING{" + word + "}:AUTHORNAME";
            } else {
                WeiboRank.RankQueryParams["fieldtext"] = "";
            }
            var d = WeiboRank.GetNewParam(WeiboRank.RankQueryParams);
            WeiboRank.CacheHistory(ht.join("-"), d);
            WeiboRank.InitWeiboRank();
            $("#allUser dd").addClass("on");
            $("#leftList_dl dd").removeClass("on");

        });
    }, getEventGroup: function () {
        var data = { "action": "getlist" };
        WeiboRank.eventGroupAjax(data, function (d) {
            $("#leftList_dl").empty();
            var ready = template.compile(WeiboRank.leftListTemp);
            var html = ready({ "ID": "0", "GroupName": "未分组用户", "GroupIndex": "0" });
            $("#leftList_dl").append(html);

            var jsonData = d.data;
            for (var i = 0; i < jsonData.length; i++) {
                var tempDate = jsonData[i];
                var html = ready(tempDate); $("#leftList_dl").append(html);
            }
            WeiboRank.groupData = jsonData;
            $("#leftList_dl a").unbind().bind("click", WeiboRank.getEventType);
            $("#leftList_dl dd").unbind().bind("click", function () {
                $("#leftList_dl .on").removeClass("on");
                $("#allUser dd").removeClass("on");
                $(this).addClass("on");
                $("#clickall_ckb").attr("checked", false);
                $("#real_time_btn").hide();

                $("#clickall_ckb,#setGroup").show();
                $("#weibo_screening_btn").addClass("no");
            });

            WeiboRank.setGroupSel();
        });
    }, setGroupSel: function () {
        $("#selKType option").remove();

        for (var i in WeiboRank.groupData) {
            if (WeiboRank.groupData[i].GroupName != undefined) {
                $("#selKType").append("<option value=" + WeiboRank.groupData[i].ID + ">" + WeiboRank.groupData[i].GroupName + "</option>");
            }
        }

        $("#selKType").append("<option value=0>未分组</option>");

    }, getEventType: function () {
        var _id = $(this).attr("cid");
        var sp = new SqlPager(WeiboRank.sqlInitParams);
        WeiboRank.sqlRequestParams["id"] = _id;
        sp.Display = function (data) {
            $("#rankList").empty();
            var jsonData = data.data;
            var temps = [];
            var tempsR = [];
            //分两排
            temps.push("<ul>");
            tempsR.push("<ul>");
            if (data.success == 1 && data.data != undefined) {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(WeiboRank.gzTemps);
                    var html = ready(tempDate);
                    //if (i < 10) {
                    temps.push(html);
                    //                    } else {
                    //                        tempsR.push(html);
                    //                    }
                }
                temps.push("</ul>");
                tempsR.push("</ul>");
                $("#rankList,#rankListRight").removeClass("wb_httit5").removeClass("wb_httit4").addClass("wb_httit3");

                $("#rankList").empty().html(temps.join(""));
                $("#rankList a[act='del']").bind("click", WeiboRank.quXiaoGuanZhu);
                //rankListRight
                $("#rankListRight").empty().html(tempsR.join(""));
                $("#rankListRight a[act='del']").bind("click", WeiboRank.quXiaoGuanZhu);
            }

        }
        sp.LoadData(1, WeiboRank.sqlRequestParams);
    },
    quXiaoGuanZhu: function () {
        var id = $(this).attr("cid");
        var el = this;
        var cdata = { "action": "delusergroup", "id": id };
        WeiboRank.eventGroupAjax(cdata, function (d) {
            $(el).parent().parent().remove();
        });
    },
    updateGroup: function () {
        var checkeds = $("#rankList input:checked");
        var ids = [];
        for (var i = 0; i < checkeds.length; i++) {
            ids.push(checkeds[i].value);
        }
        var gid = $("#selKType").val();
        var data = { "action": "setusergroup", "ids": ids.join(','), "gid": gid };
        WeiboRank.eventGroupAjax(data, function (d) {
            $("#rankList input:checked").parent().parent().remove();
            WeiboRank.hideLayer();
        });
    },
    eventGroupAjax: function (data, callfun) {
        $.ajax(WeiboRank.userManageHandler, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }, hideLayer: function () {
        $("#sad").fadeOut(300);
        $("#layer").hide();
    }
}

$(function () {
    Common.LoadingImg("rankList", "1");
    // WeiboRank.InitWeiboRank();
    WeiboRank.InitEventFun();
    WeiboRank.init();
});
   