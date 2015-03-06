
var _keywords = new Object;
var Keywordks = _keywords.property = {
    KeywordksQueryParams: { "act": "initKeywords", "where": "", "orderBy": "", "orderByWord": ""
    },
    KeywordksInitData: { "page_size": 52, "result_id": "keywordList", "status_bar_id": "pager_list",
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
                Common.LoadingImg("rankList", "0");
                return;
            }
            var KwList = [];
            KwList.push("<ul>");
            while (entity) {
                KwList.push("<li>");
                KwList.push("<span>" + unescape(entity.Name) + "</span>");
                KwList.push("<a class=\"btn_edit\" title=\"编辑关键词\"  name=\"edit_" + entity.ID + "\" pid=\"" + entity.ID + "\" t=\"" + entity.KeywordType + "\" kname=\"" + entity.Name + "\" ></a>");
                KwList.push("<a class=\"btn_delete\" title=\"删除关键词\"  name=\"del_" + entity.ID + "\" pid =\"" + entity.ID + "\"></a>");
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
                $.post("Handler/KeyWordsHandler.ashx", { "act": "delete", "keyID": id },
                     function (data) {
                         if (data && data["Success"] == 1) {
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
                         if (data && data["Success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             Keywordks.Reset();
                             Common.SubmitPop("submitPopDiv");
                             Keywordks.InitKeywordList($("#categoryKeys").find(".on a").attr("pid"));

                         }

                     }, "json"
                  );
            } else if (addType = "edit") {
                $.post("Handler/KeyWordsHandler.ashx", { "act": "update", "keyword": keyword, "keytype": keyType, "keyID": id, "tag": tag },
                     function (data) {
                         if (data && data["Success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             Keywordks.Reset();
                             Common.SubmitPop("submitPopDiv");
                             Keywordks.InitKeywordList($("#categoryKeys").find(".on a").attr("pid"));

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
                Keywordks.InitKeywordList($(this).attr("pid"));
            }
        });
    },
    Reset: function () {
        $("#txtKWName").val("");
        $("#txtKWName").attr("pid", "");
        $("#selKType").val($("#categoryKeys").find(".on a").attr("pid"));
    }

}
$(function () {
   // Common.LoginInitFun = function () {
        Keywordks.InitEventFun();
        Keywordks.InitKeywordList("1");
   // }
   // Common.CheckUser();
});