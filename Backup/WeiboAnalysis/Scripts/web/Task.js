/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../common.js" />
/// <reference path="../SqlPager.js" />
/// <reference path="../template.js" />
var Tasks = {
    UserInfo: {},
    Init: function () {
        HotWeiboUser.GetHotUser({}, null);
        Tasks.GetUserInfo();
        $("#fenPeiRenWu_a").click(Tasks.ShowAssignTasks_Div);
        $("#chaKan_a").click(Tasks.ViewCompletion);
        $("#add_task_btn").click(Tasks.ShowAddTask_Div);
    },
    GetUserInfo: function () {
        var url = "../../Handler/User.ashx";
        var data = { "action": "getuserinfo" };
        Tasks.PostAjax(url, data, function (data) {
            Tasks.UserInfo = data[0];
            //RoleID：1-管理员，2-网评员
            if (data[0].RoleID == 1) {
                $("#dwc_li,#ywc_li").hide();
                AdminTasks.Init(data[0]);
            } else if (data[0].RoleID == 2) {
                $("#wfp_li,#yfp_li").hide();
                UserTasks.Init(data[0]);
            } else {
            }
        });
    }, ShowAssignTasks_Div: function () {
        Common.ShowEditFrame("bg_div", "topicmove_column", "layer", "btn_close");
    }, ViewCompletion: function () {
        Common.ShowEditFrame("bg_div", "completion_move", "completion_layer", "completion_close");
    }, ShowAddTask_Div: function () {
        Common.ShowEditFrame("bg_div", "add_task_move", "add_task_layer", "add_task_close");
    }, AddTask: function () {
        var data = {};
    },
    PostAjax: function (url, data, callfun) {
        if (url == null) {
            url = "../../Handler/TaskHandler.ashx";
        }
        $.ajax(url, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }
}

//管理员操作
var AdminTasks = {
    InitParam: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "orderBy": "", "sql_tag": "item", "web_url": "../../Handler/TaskHandler.ashx" },
    PostParam: { "action": "gettasklist" },
    UserInfo: {},
    isFenPei: 0,
    TaskID: 0,
    CurrPage: 1,
    Init: function (uinfo) {
        AdminTasks.UserInfo = uinfo;
        AdminTasks.PostParam["SenderID"] = uinfo.USERID
        $("#add_task_submit_btn").unbind("click").bind("click", AdminTasks.AddTasks);
        $("#fp_task_btn").unbind("click").bind("click", AdminTasks.TaskAllocation);
        $("#wfp_li,#yfp_li").unbind("click").bind("click", function () {
            $("#wfp_li,#yfp_li").removeClass("on");
            AdminTasks.isFenPei = $(this).attr("value");
            AdminTasks.GetList();
            $(this).addClass("on");
        });
        $("#btn_search").unbind("click").bind("click", function () {
            $("#wfp_li,#yfp_li").removeClass("on");
            $("#wfp_li").addClass("on");
            AdminTasks.isFenPei = 0;
            AdminTasks.GetList();
        });
        $("#button_ok").unbind().bind("click", function () {
            $("#bg_div").hide();
            $("#completion_layer").hide();
        });
        $("#update_submit_btn").unbind().bind("click", AdminTasks.UpdateTaskInfo);
        AdminTasks.GetList();
    },
    AddTasks: function () {
        var senderId = AdminTasks.UserInfo.USERID;
        var senderName = AdminTasks.UserInfo.USERNAME;
        var url = $("#add_task_url").val();
        var contents = $("#add_task_context").val();
        var endTime = $("#add_task_endtime").val();
        var data = { "action": "addtask", "ID": "", "SenderID": senderId, "SenderName": senderName, "URL": url, "Contents": contents, "EndTime": endTime };
        AdminTasks.PostAjax(data, function (d) {
            if (d.success == 1) {
                AdminTasks.GetList();
                alert("添加成功!");
            } else {
            }
        });
    },
    GetList: function () {
        AdminTasks.PostParam["ISAllocation"] = AdminTasks.isFenPei;
        UserTasks.PostParam["STime"] = $("#start_time").val();
        UserTasks.PostParam["ETime"] = $("#end_time").val();
        var sp = new SqlPager(AdminTasks.InitParam);
        sp.Display = function (data) {
            AdminTasks.CurrPage = this.currPageIndex;
            var newdata = { "list": data.data };
            var html = template.render("admin_task_temps", newdata);
            var _html = $(html);
            _html.find("a[name='fprw']").unbind("click").bind("click", AdminTasks.TaskAllocationInfo);
            _html.find("a[name='wcqk']").unbind("click").bind("click", AdminTasks.WanChengQingKuang);
            _html.find("a[name='update']").unbind("click").bind("click", function () {
                var id = $(this).attr("taskid");
                var data = { "action": "gettaskinfo", "id": id };
                AdminTasks.GetTaskInfo(data);
            });
            _html.find("a[name='delete']").unbind("click").bind("click", AdminTasks.DelTask);
            $("#list_body_div").empty().append(_html);
        }
        sp.LoadData(AdminTasks.CurrPage, AdminTasks.PostParam);
    },
    TaskAllocation: function () {
        var list = [];
        $("#fp_user_info li").each(function () {
            var uid = $(this).attr("uid");
            var uname = $(this).attr("uname");
            if (uid != undefined && uname != undefined) {
                var pval = uid + "_" + uname;
                list.push(pval);
            }
        });
        var data = { "action": "taskallocation", "ID": AdminTasks.TaskID, "userlist": list.join(',') };
        AdminTasks.PostAjax(data, function (data) {
            $("#bg_div").hide();
            $("#layer").hide();
            AdminTasks.GetList();
        });
    }, DelTask: function () {
        if (confirm("确定删除吗？")) {
            var id = $(this).attr("taskid");
            var data = { "action": "deletetask", "id": id };
            AdminTasks.PostAjax(data, function (d) {
                AdminTasks.GetList();
            });
        }
    }, GetTaskInfo: function (data) {
        AdminTasks.PostAjax(data, function (data) {
            Common.ShowEditFrame("bg_div", "updateTask_move", "updateTask", "updateClose_a");
            $("#update_url_txt").val(data.URL);
            $("#update_time_txt").val(data.EndTime.split(' ')[0]);
            $("#update_description_txt").val(data.Contents);
            $("#updatetaskid").val(data.ID);
        });
    }, UpdateTaskInfo: function () {
        var url = $("#update_url_txt").val();
        var endTime = $("#update_time_txt").val();
        var contents = $("#update_description_txt").val();
        var id = $("#updatetaskid").val();
        var data = { "action": "updatetask", "ID": id, "URL": url, "Contents": contents, "EndTime": endTime };

        AdminTasks.PostAjax(data, function (d) {
            $("#bg_div,#updateTask").hide();
            AdminTasks.GetList();
        });

    },
    TaskAllocationInfo: function () {
        //分配任务
        var id = $(this).attr("taskid");
        AdminTasks.TaskID = id;
        var data = { "action": "allocationinfo", "ID": id };
        var wfpUserInfo = {};
        var fpUserInfo = {};
        AdminTasks.ShowAssignTasks_Div();
        AdminTasks.PostAjax(data, function (data) {
            if (data.success != 1) {
                return;
            }
            var taskInfo = data.taskinfo[0];
            $("#task_url").val(taskInfo.URL);
            $("#task_contents").val(taskInfo.Contents);
            //分配人信息
            fpUserInfo = data.fpuser;
            //未分配人信息
            wfpUserInfo = data.wfpuser;
            _fpUser();
            _wfpUser();
            _moveEvent();
        });
        function _fpUser() {
            $("#fp_user_info").empty();
            if (fpUserInfo != 0) {
                for (var i = 0; i < fpUserInfo.length; i++) {
                    var _li = "<li><a href=\"javascript:void(null);\">" + fpUserInfo[i].ReceiverName + "</a></li>";
                    $("#fp_user_info").append(_li);
                }
            }
        }
        function _wfpUser() {
            $("#wfp_user_info").empty();
            if (wfpUserInfo != 0) {
                for (var i = 0; i < wfpUserInfo.length; i++) {
                    var name = wfpUserInfo[i].RealName;
                    name = name == "" ? wfpUserInfo[i].USERNAME : name;
                    var _li = "<li weizhi='left' uid=" + wfpUserInfo[i].USERID + " uname=" + name + "><a href=\"javascript:void(null);\" uid=" + wfpUserInfo[i].USERID + " >" + name + "</a></li>";
                    $("#wfp_user_info").append(_li);
                }
            }
        }
        function _moveEvent() {
            $("#wfp_user_info li").unbind("click").bind("click", function () {
                var weizhi = $(this).attr("weizhi");
                var uid = $(this).attr("uid");
                if (uid == null || uid == undefined) {
                    return;
                }
                if (weizhi == "left") {
                    $(this).attr("weizhi", "right");
                    $("#fp_user_info").append(this);
                } else {
                    $(this).attr("weizhi", "left");
                    $("#wfp_user_info").append(this);
                }
            });
        }
    },
    ShowAssignTasks_Div: function () {
        Common.ShowEditFrame("bg_div", "topicmove_column", "layer", "btn_close");
    },
    WanChengQingKuang: function () {
        Common.ShowEditFrame("bg_div", "completion_move", "completion_layer", "completion_close");
        var id = $(this).attr("taskid");
        var data = { "action": "wcqk", "ID": id }
        AdminTasks.PostAjax(data, function (data) {
            if (data.success == 1) {
                $("#wcqk_info tbody").empty();
                data = data.data;
                for (var i = 0; i < data.length; i++) {
                    var uname = data[i].ReceiverName;
                    var status = data[i].CompleteStatus == 1 ? data[i].CompleteInfo : "未完成";
                    var s = "<tr> <td align=\"center\">" + uname + "</td><td align=\"center\">" + status + "</td></tr>";
                    var _tr = $(s);
                    $("#wcqk_info tbody").append(_tr);
                }
            }
        });
    },
    PostAjax: function (data, callfun) {
        var url = "../../Handler/TaskHandler.ashx";
        $.ajax(url, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
                //alert("error");
            }
        });
    }
}


var UserTasks = {
    InitParam: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBarq", "orderBy": "", "sql_tag": "item", "web_url": "../../Handler/TaskHandler.ashx" },
    PostParam: { "action": "usertasklist" },
    userInfo: {},
    submitID: 0,
    isWanCheng: 0,
    Init: function (uinfo) {
        UserTasks.userInfo = uinfo;
        UserTasks.GetList();
        $("#btn_search").unbind("click").bind("click", function () {
            $("#dwc_li,#ywc_li").removeClass("on");
            $("#dwc_li").addClass("on");
            UserTasks.isWanCheng = 0;
            UserTasks.GetList();
        });
        $("#completion_submit").unbind("click").bind("click", UserTasks.CompletionSubmit);
        $("#dwc_li,#ywc_li").unbind("click").bind("click", function () {
            $("#dwc_li,#ywc_li").removeClass("on");
            UserTasks.isWanCheng = $(this).attr("value");
            UserTasks.GetList();
            $(this).addClass("on");

        });
    },
    GetList: function () {
        UserTasks.PostParam["UserID"] = UserTasks.userInfo.USERID;
        UserTasks.PostParam["IsWanCheng"] = UserTasks.isWanCheng;
        UserTasks.PostParam["STime"] = $("#start_time").val();
        UserTasks.PostParam["ETime"] = $("#end_time").val();
        var sp = new SqlPager(UserTasks.InitParam);
        sp.Display = function (data) {
            var newdata = { "list": data.data };
            var html = template.render("user_task_temps", newdata);
            var _html = $(html);
            _html.find("a").unbind("click").bind("click", UserTasks.ShowInfo);
            $("#list_body_div").empty().append(_html);
        }
        sp.LoadData(1, UserTasks.PostParam);
    },
    ShowInfo: function () {
        UserTasks.submitID = $(this).attr("utid");
        Common.ShowEditFrame("bg_div", "user_completion_move_bar", "user_completion_layer", "user_completion_close_btn");
    },
    CompletionSubmit: function () {
        var contentinfo = $("#complete_info_txt").val();
        if (contentinfo == "" || contentinfo == undefined) {
            alert("请填写完成信息");
            $("#complete_info_txt").focus();
        } else {
            var data = { "action": "completionsubmit", "ID": UserTasks.submitID, "contextinfo": contentinfo };
            UserTasks.PostAjax(data, function (d) {
                $("#bg_div").hide();
                $("#user_completion_layer").hide();
                UserTasks.GetList();
            });
        }
    },
    PostAjax: function (data, callfun) {
        var url = "../../Handler/TaskHandler.ashx";
        $.ajax(url, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {

            }
        });
    }
}


$(function () {
    Tasks.Init();
});
