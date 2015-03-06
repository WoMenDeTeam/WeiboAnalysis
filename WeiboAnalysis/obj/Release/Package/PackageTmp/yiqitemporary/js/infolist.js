$(document).ready(function() {
    Common.LoginEventFn = function() {
        InfoList.LSqlList = new SqlList();
        InfoList.Init();
        InfoList.InnitClickFn();
    }

    Common.CheckUser();
});

var _infolist = new Object;
var InfoList = _infolist.property = {
    LSqlList: null,
    Init: function() {
        InfoList.LSqlList.initData["page_size"] = 15;
        InfoList.LSqlList.initData["diszhuanfatag"] = false;
        InfoList.LSqlList.SqlQueryParams["action"] = "getinfolist";
        InfoList.LSqlList.SqlQueryParams["strorder"] = " AddDate DESC,ID DESC";

        InfoList.LSqlList.DisplayHtml = function(data, l_obj) {
            InfoList.DisplayHtml(data, l_obj);
        };
        InfoList.LSqlList.Search();
    },
    DisplayHtml: function(data, l_obj) {
        if (parseInt(data["totalcount"]) > 0) {
            var entitylist = data["entitylist"];
            delete entitylist["SuccessCode"];
            var content = [];
            for (var item in entitylist) {
                var entity = entitylist[item];
                var title = unescape(entity["title"]);
                var url = unescape(entity["url"]);
                var adddate = unescape(entity["adddate"]);
                var addusername = unescape(entity["addusername"]);
                content.push("<li style=\"width:100%;\">");
                content.push("<input style=\"float:left; margin-top:15px;\" pid=\"" + entity["id"] + "\" name=\"note_list\" type=\"checkbox\" />");
                content.push("<a href=\"" + url + "\" title=\"" + title + "\" target=\"_blank\">");

                content.push("<span class=\"text\">" + Common.SliceStr(title, 40) + "</span>");
                content.push("<span class=\"date\">" + adddate + "</span>");
                content.push("<span class=\"date\"><font size=\"3\">发送者：" + unescape(entity["addusername"]) + "</font></span>");
                content.push("</a></li>");
            }
            $("#" + l_obj.result_id).empty().html(content.join(""));
        } else {
            $("#" + l_obj.result_id).empty().html("<li><center>对不起，没有数据。</center></li>");
        }

    },
    InnitClickFn: function() {
        $("#btn_look_result").click(function() {
            var strwhere = [];
            var starttime = $("#start_time").val();
            var endtime = $("#end_time").val();
            var enddate = new Date(new Date(endtime).valueOf() + 1 * 24 * 60 * 60 * 1000);
            endtime = enddate.getFullYear() + "-" + (enddate.getMonth() + 1) + "-" + enddate.getDate();
            if (starttime) {
                strwhere.push(" AddDate >='" + starttime + "' and");
            }
            if (endtime) {
                strwhere.push(" AddDate <='" + endtime + "' and");
            }
            InfoList.LSqlList.SqlQueryParams["strwhere"] = strwhere.join("").slice(0, -3);
            InfoList.Init();
        });

        $("#select_all").click(function() {
            var tag = $(this).attr("checked");
            if (tag) {
                $("input[name='note_list']").attr("checked", "checked");
            } else {
                $("input[name='note_list']").removeAttr("checked");
            }
        });

        $("#btn_delete").click(function() {
            var len = $("input[name='note_list']:checked").length;
            if (len == 0) {
                alert("请选择您要删除的邮件!");
                return;
            }
            if (!confirm("此操作不可恢复，您确定要删除么？")) {
                return;
            }
            var idlist = [];
            $("input[name='note_list']:checked").each(function() {
                var id = $(this).attr("pid");
                idlist.push(id);
            });
            $.post("Handler/InfoManage.ashx",
                { "doc_id_list": idlist.join(","), "type": "deletenote" },
                function(data) {
                    if (data.SuccessCode == 1) {
                        $("#btn_look_result").click();
                    } else {
                        alert("删除失败");
                    }
                },
                "json"
            )
        });
    }
}