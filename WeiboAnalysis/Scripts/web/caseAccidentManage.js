/// <reference path="../jquery-1.8.1.js" />



var AccidentManage = {
    leftListTemp: " <dd><a href='javascript:void(null);' name='categoryKey' cid='<%=ID %>' pid='<%=pid %>'><%=AccidentName %></a></dd>",
    eventChildrenTemps: "<li><span><%=AccidentName%></span><a class='btn_edit' title='编辑事故类型' name=<%=AccidentName%> act='edit' cid='<%=ID %>' pid='<%=pid %>'></a><a class='btn_delete' act='del' title=\"删除类型\"  cid='<%=ID %>' pid='<%=pid %>'></a></li>",
    caseAccidentHandler: "../../Handler/CaseAccidentHandler.ashx",
    init: function () {
        AccidentManage.getEventGroup();
        $("#btnNewAdd").unbind().bind("click", function () {
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
            $("#btnAddKey").unbind().bind("click", AccidentManage.addEventType);
        });
        $("#leftBtn a").unbind().bind("click", function () {
            var act = $(this).attr("act");
            if (act == "add") {
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", AccidentManage.addEventType2);
            } else if (act == "update") {
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", AccidentManage.updateEventType);
            } else if (act == "del") {
                if (confirm("确定要删除吗？")) {
                    var id = $("#accidentId").val();
                    AccidentManage.delEventType(id);
                }
            }
        })
        $("#keywordList ul li a").die("click");
        $("#keywordList ul li a").unbind().live("click", function () {
            var act = $(this).attr("act");
            var _cid = $(this).attr("cid");
            var _pid = $(this).attr("pid");
            if (act == "edit") {
                $("#accidentId").val(_cid);
                $("#accidentPid").val(_pid);
                $("#txtKWName").val(this.name);
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btnAddKey").unbind().bind("click", AccidentManage.updateEventChildrenType);
            } else if (act == "del") {
                if (confirm("确定要删除吗？")) {
                    AccidentManage.delEventChildrenType(_cid, _pid);
                }
            }
        });
    }, getEventGroup: function () {
        var data = { "action": "getlist", "pid": "0" };
        AccidentManage.eventGroupAjax(data, function (d) {
            $("#leftList_dl").empty();
            var jsonData = d.data;
            var pid = 0;
            for (var i = 0; i < jsonData.length; i++) {
                if (i == 0) {
                    pid = jsonData[i].ID;
                }

                var tempDate = jsonData[i];
                var ready = template.compile(AccidentManage.leftListTemp);
                var html = ready(tempDate);
                $("#leftList_dl").append(html);
            }

            var data = { "action": "getlist", "pid": pid };
            AccidentManage.EventTypePost(data);

            $("#leftList_dl a").unbind().bind("click", AccidentManage.getEventType);
            $("#leftList_dl dd").unbind().bind("click", function () {
                $("#leftList_dl .on").removeClass("on");
                $(this).addClass("on");
            });
            $("#leftList_dl dd:eq(0)").addClass("on");
        });
    }, eventGroupAjax: function (data, callfun) {
        $.ajax(AccidentManage.caseAccidentHandler, {
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
        $("#accidentId").val(_id);
        $("#accidentPid").val(_pid);
        var pid = this.attributes.cid.value;
        var data = { "action": "getlist", "pid": pid };
        AccidentManage.EventTypePost(data);

    }, EventTypePost: function (data) {
        AccidentManage.eventGroupAjax(data, function (d) {
            $("#keywordList").empty();
            var jsonData = d.data;
            var temps = [];
            temps.push("<ul>");
            if (d.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(AccidentManage.eventChildrenTemps);
                    var html = ready(tempDate);
                    temps.push(html);
                }
            }
            temps.push("</ul>");
            $("#keywordList").append(temps.join(""));
        });
    },
    addEventType: function () {
        var pid = $("#accidentId").val();
        var newGroupName = $("#txtKWName").val();
        var isCF = false;
        var data = { "action": "addnew", "CaseName": newGroupName, "pid": pid };
        $("#keywordList span:contains(" + newGroupName + ")").each(function () {
            var okey = $(this).text();
            if (okey == newGroupName) {
                isCF = true;
            }
        });
        if (isCF) {
            return;
        }
        AccidentManage.eventGroupAjax(data, function (d) {
            var jsonData = d.data; var temps = [];
            if (d.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(AccidentManage.eventChildrenTemps); 
                    var html = ready(tempDate);
                    temps.push(html);
                }
                AccidentManage.hideLayer();
            }
            $("#txtKWName").val("");
            $("#keywordList ul ").append(temps.join(""));
        });
        $("#btnAddKey").unbind("click");
    }, addEventType2: function () {
        var newGroupName = $("#txtKWName").val();
        var data = { "action": "addnew", "CaseName": newGroupName, "pid": "0" };

        AccidentManage.eventGroupAjax(data, function (d) {
            $("#txtKWName").val("");
            AccidentManage.getEventGroup();
        });
    }, updateEventType: function () {
        //修改事件分类
        var id = $("#accidentId").val();
        var pid = $("#accidentPid").val();
        var newGroupName = $("#txtKWName").val();
        var data = { "action": "upload", "CaseName": newGroupName, "pid": pid, "id": id };
        AccidentManage.eventGroupAjax(data, function (d) {
            $("#txtKWName").val("");
            AccidentManage.getEventGroup();
        });
    }, updateEventChildrenType: function () {
        var id = $("#accidentId").val();
        var pid = $("#accidentPid").val();
        var newGroupName = $("#txtKWName").val();
        var kl = $("#keywordList span:contains(" + newGroupName + ")").length;
        if (kl > 0) {
            return;
        }
        var data = { "action": "upload", "CaseName": newGroupName, "pid": pid, "id": id };
        AccidentManage.eventGroupAjax(data, function (d) {
            AccidentManage.hideLayer();
            $("#txtKWName").val("");
            AccidentManage.getEventChildrenType(pid);
        });
    }, delEventChildrenType: function (id, pid) {

        var cdata = { "action": "del", "id": id };
        AccidentManage.eventGroupAjax(cdata, function (d) {
            AccidentManage.getEventChildrenType(pid);
        });

    }, delEventType: function (id) {
        var cdata = { "action": "del", "id": id };
        AccidentManage.eventGroupAjax(cdata, function (cd) {
            AccidentManage.getEventGroup();
        });
    },
    getEventChildrenType: function (pid) {
        var cdata = { "action": "getlist", "pid": pid };
        AccidentManage.eventGroupAjax(cdata, function (d) {
            $("#keywordList").empty();
            var jsonData = d.data;
            var temps = [];
            temps.push("<ul>");
            if (d.success == "1") {
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(AccidentManage.eventChildrenTemps);
                    var html = ready(tempDate);
                    temps.push(html);
                }
            }
            temps.push("</ul>");
            $("#keywordList").append(temps.join(""));
        });
    }, hideLayer: function () {
        $("#sad").hide();
        $("#layer").hide();
    }
}

$(function () {
    AccidentManage.init();
});