/// <reference path="../jquery-1.8.1.js" />

var _keywords = new Object;
var AlarmKeywords = _keywords.property = {
    IsInit: true,
    BackAlarmTypeId: 0,
    KeywordksQueryParams: { "act": "initKeywords", "where": "", "orderBy": "", "orderByWord": ""
    },
    BackFun: function () {
        //加载完成左边列表后回调方法
        AlarmKeywords.InitEventFun();
        var id = $("#categoryKeys dl dd.on a").attr("pid");
        AlarmKeywords.InitKeywordList(id);
        //selKType
    },
    KeywordksInitData: { "page_size": 52, "result_id": "keywordList", "status_bar_id": "pager_list",
        "info_id": "pager_list", "sql_tag": "item", "web_url": "Handler/AlarmKeywordsHandler.ashx"
    },
    GetAlarmKeywordsTypeList: function () {
        $.post("Handler/AlarmKeywordsTypeHandler.ashx", { "act": "getlist" },
                     function (data) {
                         if (data && data["success"] == 1) {
                             $("#categoryKeys").empty();
                             AlarmKeywords.LoadLeftDocument(data.data, null);
                             $("#categoryKeys dl dd:eq(0)").addClass("on");
                             AlarmKeywords.BackFun();
                         }
                     }, "json");
    },
    LoadLeftDocument: function (data, calfun) {
        if (data != "") {
            $("#categoryKeys").append("<dl></dl>");
            $("#selKType option").remove();
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var id = data[i]["ID"];
                var name = data[i]["TypeName"];
                $("#categoryKeys dl").append("<dd><a href=\"javascript:void(null);\" name=\"categoryKey\" pid=\"" + id + "\">" + name + "</a></dd>");
                $("#selKType").append("<option value=" + id + ">" + name + "</option>");
            }
        }
    },
    InitKeywordList: function (type) {
        AlarmKeywords.KeywordksQueryParams["where"] = "KeywordType=" + type;
        if (AlarmKeywords.KeywordksQueryParams["orderByWord"] != "") {
            AlarmKeywords.KeywordksQueryParams["where"] += " and Tag=" + "'" + AlarmKeywords.KeywordksQueryParams["orderByWord"] + "'";
        }
        AlarmKeywords.KeywordksQueryParams["orderBy"] = " tag ";
        var sp = new SqlPager(AlarmKeywords.KeywordksInitData);
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
                KwList.push("<span>" + unescape(entity.Keyword) + "</span>");
                KwList.push("<a class=\"btn_edit\" title=\"编辑关键词\"  name=\"edit_" + entity.ID + "\" pid=\"" + entity.ID + "\" t=\"" + entity.KeywordType + "\" kname=\"" + entity.Keyword + "\" ></a>");
                KwList.push("<a class=\"btn_delete\" title=\"删除关键词\"  name=\"del_" + entity.ID + "\" pid =\"" + entity.ID + "\"></a>");
                KwList.push("</li>");
                entity = data["entity_" + (++count)];
            }
            KwList.push("</ul>");
            KwList.push("<div class=\"clear\"></div>");

            $("#keywordList").empty().html(KwList.join(""));
            AlarmKeywords.EventFun();
        }
        sp.LoadData(1, AlarmKeywords.KeywordksQueryParams);
    },
    EventFun: function () {
        $("a[name^='edit_']").unbind("click").click(function () {
            var type = $(this).attr("t");
            var id = $(this).attr("pid");
            var name = $(this).attr("kname");
            $("#txtKWName").val(unescape(name));
            $("#txtKWName").attr("pid", id);
            $("#selKType").val(type);
            $("#btnAddKey").attr("t", "edit");
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        });
        $("a[name^='del_']").unbind("click").click(function () {
            var id = $(this).attr("pid");
            var thisa = $(this);
            if (confirm("确认删除吗？")) {
                $.post("Handler/AlarmKeywordsHandler.ashx", { "act": "delete", "keyID": id },
                     function (data) {
                         if (data && data["success"] == 1) {
                             thisa.parent().remove();
                             Common.SubmitPop("submitPopDiv");
                         }

                     }, "json"
                  );
            }
        });
    },
    InitEventFun: function () {
        Common.ValIsEmpty("btn_close", "txtKWName", "txtKWNameCheck");
        Common.ValIsEmpty("alarm_type_close", "alarm_type_name", "alarm_type_name_error");
        //添加类型
        $("#btn_addtype").unbind().bind("click", function () {
            AlarmKeywords.Reset();
            Common.ShowEditFrame("sad", "alarm_type_column", "alarm_type_layer", "alarm_type_close");
            $("#alarm_type_submit").unbind().bind("click", AlarmKeywords.AddAlarmType);

        });

        //添加编辑类型
        $("#btn_edittype").unbind().bind("click", function () {
            AlarmKeywords.Reset();
            var value = $("#categoryKeys").find("dd.on a").html();
            $("#alarm_type_name").val(value);
            Common.ShowEditFrame("sad", "alarm_type_column", "alarm_type_layer", "alarm_type_close");
            $("#alarm_type_submit").unbind().bind("click", AlarmKeywords.UpdateAlarmType);


        });
        //删除类型
        $("#btn_deltype").unbind().bind("click", AlarmKeywords.DeleteAlarmType);

        $("#orderByWord").find("a").unbind("click").click(function () {
            $(this).parent().siblings().removeClass("on");
            $(this).parent().addClass("on");
            AlarmKeywords.KeywordksQueryParams["orderByWord"] = $(this).text().length > 1 ? "" : $(this).text();
            var pid = $("#categoryKeys").find("dd.on a").attr("pid");
            $("#selKType").val(pid);
            AlarmKeywords.InitKeywordList(pid);
        });
        $("#btnNewAdd").unbind("click").click(function () {
            $("#btnAddKey").attr("t", "new");
            AlarmKeywords.Reset();
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
                $.post("Handler/AlarmKeywordsHandler.ashx", { "act": "insert", "keyword": keyword, "keytype": keyType, "tag": tag, "keyID": id },
                     function (data) {
                         if (data && data["success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             AlarmKeywords.Reset();
                             Common.SubmitPop("submitPopDiv");
                             AlarmKeywords.InitKeywordList($("#categoryKeys").find("dd.on a").attr("pid"));
                         }
                     }, "json"
                  );
            } else if (addType = "edit") {
                $.post("Handler/AlarmKeywordsHandler.ashx", { "act": "update", "keyword": keyword, "keytype": keyType, "keyID": id, "tag": tag },
                     function (data) {
                         if (data && data["success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             AlarmKeywords.Reset();
                             Common.SubmitPop("submitPopDiv");
                             AlarmKeywords.InitKeywordList($("#categoryKeys").find("dd.on a").attr("pid"));

                         }

                     }, "json"
                  );
            }
        });

        $("#btnReset,#alarm_type_reset").unbind("click").click(function () {
            AlarmKeywords.Reset();
        });
        $("a[name='categoryKey']").unbind("click").click(function () {
            if (!$(this).parent().attr("class")) {
                AlarmKeywords.KeywordksQueryParams["orderByWord"] = "";
                $("#orderByWord").find("li").removeClass().eq(0).addClass("on");
                $(this).parent().siblings().removeClass();
                $(this).parent().addClass("on");
                AlarmKeywords.InitKeywordList($(this).attr("pid"));
            }
        });
    },
    Reset: function () {
        $("#txtKWName").val("");
        $("#txtKWName").attr("pid", "");
        $("#alarm_type_name").val("");
        $("#selKType").val($("#categoryKeys").find(".on a").attr("pid"));
    }, AddAlarmType: function () {
        var typeName = $("#alarm_type_name").val();
        $.post("Handler/AlarmKeywordsTypeHandler.ashx", { "act": "add", "typeName": typeName },
                     function (data) {
                         if (data && data["success"] == 1) {
                             AlarmKeywords.GetAlarmKeywordsTypeList();
                             Common.CloseEditFrame("sad", "alarm_type_layer");
                         }
                     }, "json");

    }, UpdateAlarmType: function () {
        var id = $("#categoryKeys").find("dd.on a").attr("pid");
        var typeName = $("#alarm_type_name").val();
        $.post("Handler/AlarmKeywordsTypeHandler.ashx", { "act": "update", "id": id, "typeName": typeName },
                     function (data) {
                         if (data && data["success"] == 1) {
                             AlarmKeywords.GetAlarmKeywordsTypeList();
                             Common.CloseEditFrame("sad", "alarm_type_layer");
                         }
                     }, "json");
    }, DeleteAlarmType: function () {
        var len = $("#keywordList ul li").length
        if (len > 0) {
            alert("删除时请保证分类下没有其他分词");
        } else {
            if (confirm("确定删除吗？")) {
                var id = $("#categoryKeys").find("dd.on a").attr("pid");
                $.post("Handler/AlarmKeywordsTypeHandler.ashx", { "act": "del", "id": id },
                     function (data) {
                         if (data && data["success"] == 1) {
                             AlarmKeywords.GetAlarmKeywordsTypeList();
                         }
                     }, "json");
            }
        }
    }
}
$(function () {
    AlarmKeywords.GetAlarmKeywordsTypeList();
});