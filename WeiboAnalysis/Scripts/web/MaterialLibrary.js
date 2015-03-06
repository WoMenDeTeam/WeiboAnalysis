/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../template.js" />

var Material = {
    temps: "<% for (var i in list) { if(list[i].ID!=\"\"&&list[i].referenceId!=\"\"){ %><div class=\"wb_boxnr\"><div class=\"wb_boximg\"><span class=\"head\"><img onerror=\"this.src='img/userdefault.jpg'\" src=\"<%=list[i].profileImageUrl %>\" /></span><input class=\"wb_inputmar\" type=\"checkbox\" value=\"<%=list[i].ID %>\" /></div><div class=\"wb_boxusernr\"><div class=\"wb_usertit\"><a class=\"aname\" href=\"javascript:void(null);\" target=\"_blank\"><b><%=list[i].authorName %>：</b></a><%=list[i].dreContent%><%if(list[i].thumbnailPic!=\"\"){ %><br/><img src=\"<%=list[i].thumbnailPic%>\" /><%} %></div></div><div class=\"clear\"></div><div class=\"new_top10\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\"><tbody><tr><td><a href=\"<%=list[i].weiboUrl %>\" target=\"_blank\"><%=list[i].timesTamp%></a>　<%=list[i].siteName %><br /><% if(list[i].forwardNum!=\"\"){  %> 转发（<b class=\"color_2\"><%=list[i].forwardNum %></b>）<%}%>　<% if(list[i].replyNum!=\"\"){  %> 评论（<b class=\"color_2\"><%=list[i].replyNum %></b>）<%}%></tr></tbody></table></div></div>    <%} }%>",
    ListData: [],
    Init: function () {
        $("#showsucai_a").unbind().bind("click", function () {
            Material.LoadMaterialList();
        });
    },
    LoadMaterialList: function () {
        Material.refreshList();
    },
    addMaterial: function (d) {
        d["action"] = "addreport";
        Material.myAjax(d, function (data) {
            if (data.success == 1) {
                if (data.data == 1) {
                    Material.refreshList();
                }
                else {
                    Material.refreshList();
                    alert("已添加至简报夹!");
                }
            }
        });
    },
    myAjax: function (data, callfun) {
        $.ajax("../../Handler/ReportHandler.ashx", {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {

            }
        });
    },
    refreshList: function () {
        var data = { "action": "getlistreport" };
        Material.myAjax(data, function (data) {
            if (data.success == 1) {
                if (data.count == 1) {
                    $("#material_library_list_div").empty();
                    var newData = { "list": data.data };
                    var ready = template.compile(Material.temps);
                    var _html = ready(newData);
                    $("#material_library_list_div").append(_html);
                    $("#material_library_div").show();
                } else {
                    $("#material_library_div").hide();
                }
            }
        });
        Material.event();
    },
    event: function () {
        $("#del_material_btn").unbind("click").bind("click", function () {
            if (confirm("确定删除吗？")) {
                var groupList = [];
                var groupDoc = $("#material_library_list_div input[type=checkbox]:checked");
                groupDoc.each(function () { groupList.push(this.value); });
                var data = { "action": "delreport", "ids": groupList.join(",") };
                Material.myAjax(data, function (data) {
                    Material.refreshList();
                    $("#checkbox_all").attr("checked", false);
                    alert("删除成功!");
                });
            }
        });

        $("#create_jianbao_btn").unbind("click").bind("click", function () {
            var data = { "action": "createreport" };
            Material.myAjax(data, function (data) {
                window.location.href = "../../DownloadReport.aspx?filename=" + data.data;
            });
        });

        $("#checkbox_all").unbind("click").bind("click", function () {
            var ckVal = $(this).attr("checked") ? true : false;
            $("#material_library_list_div input[type=checkbox]").attr("checked", ckVal);
        });

        $("#close_material_btn").unbind().bind("click", function () { $("#material_library_div").hide(); });
    }
}
