/// <reference path="../jquery-1.8.1.js" />

var UserManage = {
    leftListTemp: " <dd><a href='javascript:void(null);' name='categoryKey' cid='<%=ID %>' pid='<%=GroupIndex %>'><%=GroupName %></a></dd>",
    eventChildrenTemps: "<li><span><%=Nick%></span><a class='btn_edit' title='编辑用户资料' act='edit' cid='<%=ID %>' gid='<%=GroupID %>'></a><a class='btn_delete' title=\"删除分组\" act='del' cid='<%=ID %>' gid='<%=GroupID %>'></a></li>",
    eventChildrenTemps2: "<li><span><%=GroupName%></span><a class='btn_edit' title='编辑用户资料' act='edit' cid='<%=ID %>' gname='<%=GroupName%>' pid='<%=GroupIndex %>'></a><a class='btn_delete' title=\"删除分组\" act='del' cid='<%=ID %>' pid='<%=GroupIndex %>'></a></li>",
    userManageHandler: "../../Handler/SysGroupHandler.ashx",
    sqlInitParams: { "page_size": 100, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "orderBy": "OccurrenceTime", "sql_tag": "item", "web_url": "../../Handler/SysGroupHandler.ashx" },
    sqlRequestParams: { "action": "getuser", "orderBy": "" },
    groupData: {},
    init: function () {
        UserManage.getEventGroup2();
        $("#btnNewAdd").unbind().bind("click", function () {
            $("#grouplist").hide();
            $("#newGroupName").show();
            $("#newsCount").html("添加用户组");
            $("#txtKWName").val("");
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
            $("#btnAddKey").unbind().bind("click", UserManage.addEventType2);
        });

        $("#leftBtn a").unbind().bind("click", function () {
            $("#grouplist").hide();
            $("#newGroupName").show();
            var act = $(this).attr("act");
            if (act == "add") {
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", UserManage.addEventType2);
            } else if (act == "update") {
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", UserManage.updateEventType);
            } else if (act == "del") {
                if (confirm("确定要删除吗？")) {
                    var id = $("#accidentId").val();
                    UserManage.delEventType(id);
                }
            }
        });
        $("#keywordList ul li a").die("click");
        $("#keywordList ul li a").unbind().live("click", function () {
            $("#grouplist").hide();
            $("#newGroupName").show();
            var act = $(this).attr("act");
            var _cid = $(this).attr("cid");
            var _gid = $(this).attr("pid");
            if (act == "edit") {
                $("#accidentId").val(_cid);
                $("#accidentPid").val(_gid);
                $("#txtKWName").val($(this).attr("gname"));
                $("#newsCount").html("修改用户组");
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", UserManage.updateEventType);
            } else if (act == "del") {
                if (confirm("确定要删除吗？")) {
                    UserManage.delEventType(_cid);
                }
            }
        });
    }, getEventGroup: function () {
        var data = { "action": "getlist" };
        UserManage.eventGroupAjax(data, function (d) {
            $("#leftList_dl").empty();
            var jsonData = d.data;
            for (var i = 0; i < jsonData.length; i++) {
                var tempDate = jsonData[i];
                var ready = template.compile(UserManage.leftListTemp);
                var html = ready(tempDate); $("#leftList_dl").append(html);
            }
            UserManage.groupData = jsonData;
            var ready = template.compile(UserManage.leftListTemp);
            var html = ready({ "ID": "0", "GroupName": "未分组", "GroupIndex": "0" }); $("#leftList_dl").append(html);

            $("#leftList_dl a").unbind().bind("click", UserManage.getEventType);
            $("#leftList_dl dd").unbind().bind("click", function () {
                $("#leftList_dl .on").removeClass("on");
                $(this).addClass("on");
            });
            UserManage.setGroupSel();
        });
    }, getEventGroup2: function () {
        $("#leftList_dl").empty();
        var data = { "action": "getlist" };
        UserManage.eventGroupAjax(data, function (d) {
            var jsonData = d.data;
            UserManage.groupData = jsonData;
            $("#keywordList").empty();
            var temps = [];
            temps.push("<ul>");
            for (var i = 0; i < jsonData.length; i++) {
                var tempDate = jsonData[i];
                var ready = template.compile(UserManage.eventChildrenTemps2);
                var html = ready(tempDate); //$("#leftList_dl").append(html);
                temps.push(html);
            }
            temps.push("</ul>");
            $("#keywordList").append(temps.join(""));
        });
    }, setGroupSel: function () {
        $("#selKType option").remove();
        $("#selKType").append(obj);
        for (var i in UserManage.groupData) {
            if (UserManage.groupData[i].GroupName != undefined) {
                var obj = new Option(UserManage.groupData[i].GroupName, UserManage.groupData[i].ID);
                $("#selKType").append(obj);
            }
        }
        var o = new Option("未分组", "0");
        $("#selKType").append(o);
    },
    eventGroupAjax: function (data, callfun) {
        $.ajax(UserManage.userManageHandler, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }, getEventType: function () {
        var _pid = $(this).attr("pid");
        var _id = $(this).attr("cid");
        var _name = $(this).text();

        var sp = new SqlPager(UserManage.sqlInitParams);
        UserManage.sqlRequestParams["id"] = _id;
        sp.Display = function (data) {
            $("#keywordList").empty();
            var jsonData = data.data;
            var temps = [];
            temps.push("<ul>");
            if (data.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(UserManage.eventChildrenTemps);
                    var html = ready(tempDate);
                    temps.push(html);
                }
            }
            temps.push("</ul>");
            $("#keywordList").append(temps.join(""));
        }
        sp.LoadData(1, UserManage.sqlRequestParams);
    },
    addEventType: function () {
        var newGroupName = $("#txtKWName").val();
        var data = { "action": "add", "groupName": newGroupName };
        UserManage.eventGroupAjax(data, function (d) {
            var jsonData = d.data; var temps = [];
            if (d.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i]; var ready = template.compile(UserManage.eventChildrenTemps); var html = ready(tempDate);
                    temps.push(html);
                }
            }
            $("#keywordList ul ").append(temps.join(""));
            UserManage.hideLayer();
        });

    }, addEventType2: function () {
        var newGroupName = $("#txtKWName").val();
        var data = { "action": "add", "groupName": newGroupName };
        UserManage.eventGroupAjax(data, function (d) {
            $("#txtKWName").val("");
            UserManage.getEventGroup2();
            UserManage.hideLayer();
        });
    }, updateEventType: function () {
        var id = $("#accidentId").val();
        var pIndex = $("#accidentPid").val();
        var newGroupName = $("#txtKWName").val();
        var data = { "action": "update", "groupName": newGroupName, "id": id, "pindex": pIndex };
        UserManage.eventGroupAjax(data, function (d) {
            $("#txtKWName").val("");
            UserManage.getEventGroup2();
            UserManage.hideLayer();
        });
    }, updateEventChildrenType: function () {
        var id = $("#accidentId").val();
        var pid = $("#accidentPid").val();
        var gid = $("#selKType").val();
        var data = { "action": "updateusergroup", "gid": gid, "id": id };
        if (pid != gid) {
            UserManage.eventGroupAjax(data, function (d) {
                $("a[act='edit'][cid=" + id + "][gid=" + pid + "]").parent().remove()
                UserManage.hideLayer();
            });
        }
    }, delEventChildrenType: function (id, pid) {

        var cdata = { "action": "delusergroup", "id": id };
        UserManage.eventGroupAjax(cdata, function (d) {
            $("a[act='del'][cid=" + id + "][gid=" + pid + "]").parent().remove()
        });

    }, delEventType: function (id) {
        var cdata = { "action": "del", "id": id };
        UserManage.eventGroupAjax(cdata, function (cd) {
            UserManage.getEventGroup2();
        });
    },
    getEventChildrenType: function (pid) {
        var cdata = { "action": "getlist", "pid": pid };
        UserManage.eventGroupAjax(cdata, function (d) {
            $("#keywordList").empty();
            var jsonData = d.data;
            var temps = [];
            temps.push("<ul>");
            if (d.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(UserManage.eventChildrenTemps);
                    var html = ready(tempDate);
                    temps.push(html);
                }
            }
            temps.push("</ul>");
            $("#keywordList").append(temps.join(""));

        });
    }, hideLayer: function () {
        $("#sad").fadeOut(300);
        $("#layer").hide();
    }
}

$(function () {
    UserManage.init();
    HotWeiboUser.GetHotUser({}, null);
});

