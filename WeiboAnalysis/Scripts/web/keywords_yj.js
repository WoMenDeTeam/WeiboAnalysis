/// <reference path="../jquery-1.8.1.js" />


var _keywords = new Object;
var Keywordks = _keywords.property = {
    KeywordksQueryParams: {
        "act": "initKeywords", "where": "", "orderBy": "", "orderByWord": ""
    },
    KeywordksInitData: {
        "page_size": 52, "result_id": "keywordList", "status_bar_id": "pager_list",
        "info_id": "pager_list", "sql_tag": "item", "web_url": "Handler/KeyWordsHandler.ashx"
    },
    InitKeywordList: function (type) {


        Keywordks.KeywordksQueryParams["where"] = "KeywordType=" + type;
        if (Keywordks.KeywordksQueryParams["orderByWord"] != "") {
            Keywordks.KeywordksQueryParams["where"] += " and Tag=" + "'" + Keywordks.KeywordksQueryParams["orderByWord"] + "'";
        }
        Keywordks.KeywordksQueryParams["orderBy"] = " tag ";
        var sp = new SqlPager(Keywordks.KeywordksInitData);
        sp.Display = function (data, l_obj) {
            var count = 1;
            var entity = data["entity_" + count];
            if (!entity) {
                Common.LoadingImg("keywordList", "0");
                return;
            }
            var KwList = [];
            KwList.push("<ul>");
            while (entity) {
                KwList.push("<li>");
                KwList.push("<span>" + unescape(entity.Name) + "</span>");
                KwList.push("<a class=\"btn_edit\" title=\"编辑关键词\"  name=\"edit_" + entity.ID + "\" pid=\"" + entity.ID + "\" t=\"" + entity.KeywordType + "\" kname=\"" + entity.Name + "\" ></a>");
                KwList.push("<a class=\"btn_delete\" title=\"删除关键词\" _n=\"" + entity.Name + "\"  name=\"del_" + entity.ID + "\" pid =\"" + entity.ID + "\"></a>");
                KwList.push("</li>");
                entity = data["entity_" + (++count)];
            }
            KwList.push("</ul>");
            KwList.push("<div class=\"clear\"></div>");


            $("#keywordList").empty().html(KwList.join(""));
            Keywordks.EventFun();
        }
        sp.LoadData(1, Keywordks.KeywordksQueryParams);
    },
    EventFun: function () {
        $("#keywordList a[name^='edit_']").unbind("click").click(function () {
            var type = $(this).attr("t");
            var id = $(this).attr("pid");
            var name = $(this).attr("kname");
            $("#txtKWName").val(unescape(name));
            $("#txtKWName").attr("pid", id);
            $("#selKType").val(type);
            $("#btnAddKey").attr("t", "edit");
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        });
        $("#keywordList a[name^='del_']").unbind("click").click(function () {
            var id = $(this).attr("pid");
            var keyword = $(this).attr("_n");
            var thisa = this;
            if (confirm("确认删除吗？")) {
                $.post("Handler/KeyWordsHandler.ashx", { "act": "delete", "keyID": id },
                     function (data) {
                         if (data && data["success"] == 1) {
                             $(thisa).parent().remove();
                             Common.SubmitPop("submitPopDiv");
                             Keywordks.SaveLog("删除临时预警词" + unescape(keyword));
                         }
                     }, "json"
                  );
            }
        });

        $("#update_sleep_time_btn").unbind().bind("click", Keywordks.updateSleepTime);
        $("#update_jinqi_btn").unbind().bind("click", Keywordks.updateJinQi);
    },
    InitEventFun: function () {
        Common.ValIsEmpty("btn_close", "txtKWName", "txtKWNameCheck");
        $("#orderByWord").find("a").unbind("click").click(function () {
            $(this).parent().siblings().removeClass("on");
            $(this).parent().addClass("on");
            Keywordks.KeywordksQueryParams["orderByWord"] = $(this).text().length > 1 ? "" : $(this).text();
            var pid = $("#categoryKeys").find(".on a").attr("pid");
            $("#selKType").val(pid);
            Keywordks.InitKeywordList(pid);
        });
        $("#btnNewAdd").unbind("click").click(function () {
            $("#btnAddKey").attr("t", "new");
            Keywordks.Reset();
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        });

        $("#btnAddKey").unbind("click").click(function () {
            var addType = $(this).attr("t");
            var keyword = $("#txtKWName").val();
            $("#txtKWName").blur();
            var id = $("#txtKWName").attr("pid");
            var keyType = $("#selKType").val();
            var tag = ""; // txtKWNameCheck
            if (keyword == "") {
                return;
            }
            tag = $("#txtKWName").toPinyin();
            tag = tag.substring(0, 1).toLowerCase();
            if (addType == "new") {
                $.post("Handler/KeyWordsHandler.ashx", { "act": "insert", "keyword": keyword, "keytype": keyType, "tag": tag, "keyID": id },
                     function (data) {
                         if (data && data["success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             Keywordks.Reset();
                             Common.SubmitPop("submitPopDiv");
                             Keywordks.InitKeywordList($("#categoryKeys").find(".on a").attr("pid"));
                             Keywordks.SaveLog("增加临时预警词" + keyword);

                         }

                     }, "json"
                  );
            } else if (addType = "edit") {
                $.post("Handler/KeyWordsHandler.ashx", { "act": "update", "keyword": keyword, "keytype": keyType, "keyID": id, "tag": tag },
                     function (data) {
                         if (data && data["success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             Keywordks.Reset();
                             Common.SubmitPop("submitPopDiv");
                             Keywordks.InitKeywordList($("#categoryKeys").find(".on a").attr("pid"));
                             Keywordks.SaveLog("修改临时预警词" + keyword);
                         }

                     }, "json"
                  );
            }
        });

        $("#btnReset").unbind("click").click(function () {
            Keywordks.Reset();
        });
        $("a[name='categoryKey']").unbind("click").click(function () {
            if (!$(this).parent().attr("class")) {
                Keywordks.KeywordksQueryParams["orderByWord"] = "";
                $("#orderByWord").find("li").removeClass().eq(0).addClass("on");
                $(this).parent().siblings().removeClass();
                $(this).parent().addClass("on");
                var _type = $(this).attr("_t");
                if (_type === "setkeyword") {
                    $("#set_keyword_div").show();
                    $("#set_time_div").hide();
                    Keywordks.InitKeywordList($(this).attr("pid"));
                } else if (_type === "settime") {
                    $("#set_keyword_div").hide();
                    $("#set_time_div").show();
                    Keywordks.getNonWarningTime();
                } else if (_type === "sethonebook") {

                }
            }
        });
    },
    Reset: function () {
        $("#txtKWName").val("");
        $("#txtKWName").attr("pid", "");
        $("#selKType").val($("#categoryKeys").find(".on a").attr("pid"));
    }, getNonWarningTime: function (type) {
        $.ajax("Handler/KeyWordsHandler.ashx", {
            url: "Handler/KeyWordsHandler.ashx",
            type: "POST",
            data: { "act": "initKeywords", "start": 1, "page_size": 10, "where": " KeywordType IN (200,201) ", "orderBy": " KeywordType ASC" },
            dataType: "JSON",
            success: function (data) {
                // data = { "entity_1": { "RowNumber": "1", "ID": "216", "Name": "30", "KWRelevance": "0", "KeywordType": "201", "Tag": "", "maxId": "0" }, "entity_2": { "RowNumber": "2", "ID": "215", "Name": "21-7", "KWRelevance": "0", "KeywordType": "200", "Tag": "", "maxId": "0" }, "Count": 2 }
                var count = 1;
                var entity = data["entity_" + count];
                if (!entity) {
                    Common.LoadingImg("keywordList", "0");
                    return;
                }
                var KwList = [];
                KwList.push("<ul>");
                while (entity) {
                    if (entity.KeywordType === "200") {
                        var times = entity.Name.split('-');
                        var li = ' <li><span>夜间预警规则：' + (parseInt(times[0]) < 10 ? "0" + times[0] : times[0]) + ':00-' + (parseInt(times[1]) < 10 ? "0" + times[1] : times[1]) + ':00 ' + times[2] + '人</span><a name="edit_11" title="编辑" class="btn_edit" _type="sleeptime" _cache="' + escape(JSON.stringify(entity)) + '"></a></li>';
                        KwList.push(li);
                    } else if (entity.KeywordType === "201") {
                        var tTime = new Date();
                        tTime.setDate(tTime.getDate() - parseInt(entity.Name));
                        var li2 = ' <li><span>最近报警记录：' + tTime.getFullYear() + '.' + (tTime.getMonth() + 1) + '.' + tTime.getDate() + '-现在</span><a name="edit_11" title="编辑" class="btn_edit" _cache="' + escape(JSON.stringify(entity)) + '"></a></li>';
                        KwList.push(li2);
                    }
                    entity = data["entity_" + (++count)];
                }
                KwList.push("</ul>");
                KwList.push("<div class=\"clear\"></div>");
                $("#settime_list").empty().append(KwList.join(""));

                $("#settime_list a[name^='edit_']").unbind("click").click(function () {
                    var type = $(this).attr("_type");
                    if (type === "sleeptime") {
                        var cache = $(this).attr("_cache")
                        var data = JSON.parse(unescape(cache));
                        var t = data.Name.split('-');
                        $("#selXW").val(t[0]);
                        $("#selSW").val(t[1]);
                        $("#yjfz_txt").val(t[2]);
                        $("#mrfz_txt").val(t[3]);
                        $("#sleep_cache").val(cache);
                        Common.ShowEditFrame("sad", "topicmove_column2", "layer2", "btn_close2");
                    } else {
                        var cache = $(this).attr("_cache")
                        var data = JSON.parse(unescape(cache));
                        $("#jinqi_day").val(data.Name);
                        $("#day_cache").val(cache);
                        Common.ShowEditFrame("sad", "topicmove_column3", "layer3", "btn_close3");
                    }
                });
            }
        });
    }, updateSleepTime: function () {
        var _data = unescape($("#sleep_cache").val());
        _data = JSON.parse(_data);
        var keyword = $("#selXW").val() + "-" + $("#selSW").val() + "-" + $("#yjfz_txt").val() + "-" + $("#mrfz_txt").val();
        $.ajax("Handler/KeyWordsHandler.ashx", {
            url: "Handler/KeyWordsHandler.ashx",
            type: "POST",
            data: { "act": "update", "keyID": _data.ID, "keyword": keyword, "keytype": _data.KeywordType, "tag": "" },
            dataType: "JSON",
            success: function (data) {
                Common.CloseEditFrame("sad", "layer2");
                Common.SubmitPop("submitPopDiv");
                Keywordks.getNonWarningTime();
                Keywordks.SaveLog("设置预警规则:晚" + keyword.split('-')[0] + "点至" + keyword.split('-')[1] + "点" + keyword.split('-')[2] + "人，默认" + keyword.split('-')[3] + "人");
            }
        });
    }, updateJinQi: function () {
        var _data = unescape($("#day_cache").val());
        _data = JSON.parse(_data);
        var keyword = $("#jinqi_day").val();
        $.ajax("Handler/KeyWordsHandler.ashx", {
            url: "Handler/KeyWordsHandler.ashx",
            type: "POST",
            data: { "act": "update", "keyID": _data.ID, "keyword": keyword, "keytype": _data.KeywordType, "tag": "" },
            dataType: "JSON",
            success: function (data) {
                Common.CloseEditFrame("sad", "layer3");
                Common.SubmitPop("submitPopDiv");
                Keywordks.getNonWarningTime();
                Keywordks.SaveLog("设置显示近期" + keyword + "的预警信息");
            }
        });
    }, SaveLog: function (url) {
        var data = { "act": "add", "url": url };
        $.ajax("../../Handler/OperatingLogHandler.ashx", {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: function (data) {
            },
            error: function () {
            }
            //Top.SaveLog();
        });
    }
}
$(function () {
    $.ajax({
        type: "post", url: "Handler/User.ashx", async: false, data: { 'action': 'check_user' },
        success: function (Data, textStatus) {
            if (Data["SuccessCode"] == "1") {
                Keywordks.InitEventFun();
                Keywordks.InitKeywordList("100");
            }
            else {
                location.href = "login.html";
            }
        }, dataType: "json"
    });
});