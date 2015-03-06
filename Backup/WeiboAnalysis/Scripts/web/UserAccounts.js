/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../template.js" />
/// <reference path="../SqlPager.js" />
var UserAccount = {
    sqlPageParam: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "../../Handler/User.ashx" },
    sqlParam: { "action": "getuserlist", "orderBy": "" },
    roleSqlParam: { "action": "getrolelist", "orderBy": "" },
    userList: {},
    userData: {},
    cData: {},
    cRoleData: [],
    userRole: {},
    userInfo: {},
    Init: function () {
        UserAccount.GetRole();
        UserAccount.GetUserRole();
        UserAccount.GetUserInfo();
        $("#adduser_btn").unbind().bind("click", UserAccount.AddUser);
        $("#updatepassword_a").unbind().bind("click", UserAccount.UpdatePassword);
        $("#addJueSe_a").unbind().bind("click", UserAccount.AddRole);
        $("#quanxianguanli_div dl dd").unbind().bind("click", function () {
            $("#quanxianguanli_div dl dd").removeClass("on");
            var act = $(this).attr("act");
            //true 用户管理
            if (act == "yhgl") {
                $("#yhgl_tr").show();
                $("#jsgl_tr").hide();
                UserAccount.GetUserInfo();
            } else {
                $("#yhgl_tr").hide();
                $("#jsgl_tr").show();
                UserAccount.GetRoleList();
            }
            $(this).addClass("on");
        });
    },
    GetRoleList: function () {
        var sp = new SqlPager(UserAccount.sqlPageParam);
        sp.Display = function (data) {
            $("#list_body_div").empty();
            var html = template.render('listrole_temps', data);
            $("#list_body_div").append(html);
            $("#list_body_div table tbody a[act='edit']").click(UserAccount.EditRole);
            $("#list_body_div table tbody a[act='del']").click(UserAccount.DelRole);
        }
        sp.LoadData(1, UserAccount.roleSqlParam);
    },
    CheckUser: function () {
        if (UserAccount.userRole.ID != 1) {
            alert("非管理员不可操作!");
            return;
        }
    },
    EditRole: function () {
        var id = $(this).attr("cid");
        var name = $(this).attr("rname");
        $("#updaterolename_txt").val(name);
        Common.ShowEditFrame("bg_cover", "updaterolemove", "updaterolediv", "updaterole_close");
        $("#updaterole_submit").unbind().bind("click", function () {
            var rname = $("#updaterolename_txt").val();
            var data = { "action": "updaterole", "rid": id, "rolename": rname };
            UserAccount.UserAjax(data, function (data) {
                if (data.success == 1) {
                    $("#bg_cover,#updaterolediv").hide();
                    UserAccount.GetRoleList();
                } else {
                    alert(data.errormsg);
                }
            });
        });
    },
    AddRole: function () {
        Common.ShowEditFrame("bg_cover", "addrolemove", "addrolediv", "addrole_close");
        $("#addrole_submit").unbind().bind("click", function () {
            var rolename = $("#addrolename_txt").val();
            var data = { "action": "addrole", "rolename": rolename };
            UserAccount.UserAjax(data, function (data) {
                if (data.success == 1) {
                    UserAccount.GetRoleList();
                    $("#bg_cover,#addrolediv").hide();
                } else {
                    alert(data.errormsg);
                }
            });
        });

    }, DelRole: function () {
        if (!confirm("确定删除吗")) {
            return;
        }
        var rid = $(this).attr("cid");
        var data = { "action": "delrole", "rid": rid };
        UserAccount.UserAjax(data, function (data) {
            if (data.success == 1) {
                UserAccount.GetRoleList();
            } else {
                alert(data.errormsg);
            }
        });
    },
    GetList: function () {
        var sp = new SqlPager(UserAccount.sqlPageParam);
        sp.Display = function (data) {
            UserAccount.userList = data.data;
            UserAccount.LoadList(data);
        }
        sp.LoadData(1, UserAccount.sqlParam);
    },
    LoadList: function (data) {
        $("#list_body_div").empty();
        var html = template.render('list_temps', data);
        $("#list_body_div").append(html);
        $("#list_body_div table tbody a").click(UserAccount.Operation);
    },

    Operation: function () {
        if (UserAccount.userRole.ID != 1) {
            alert("非管理员不可操作!");
            return;
        }
        var callFun = function () { };
        var index = $(this).attr("index");
        var data = UserAccount.userList[index];
        UserAccount.userData = data;
        var switch_on = $(this).attr("act");
        switch (switch_on) {
            case "edit":
                callFun = UserAccount.UpdateUser;
                break;
            case "del":
                callFun = UserAccount.DelUser;
                break;
            default:
                break;
        }
        callFun(data, index);
    },
    UpdateUser: function (data, index) {
        Common.ShowEditFrame("bg_cover", "topicmove_column", "layer", "btn_close");
        $("#USERNAME").text(data.USERNAME);
        $("#EMAIL").val(data.EMAIL);
        $("#Power").attr("checked", data.Power == 0 ? false : true);
        $("#submit_btn").unbind().bind("click", _submitFun);
        $("#user_role_sel").val(data.RoleID);
        $("#up_realname").val(data.RealName);
        $("#up_departmentname").val(data.DepartmentName);
        function _submitFun() {
            data["action"] = "updateuser";
            data.EMAIL = $("#EMAIL").val();
            data.Power = $("#Power").attr("checked") ? 1 : 0;
            data.RoleID = $("#user_role_sel").val();
            data.RealName = $("#up_realname").val();
            data.DepartmentName = $("#up_departmentname").val();
            data.RoleName = $("#user_role_sel").find("option:selected").text();
            UserAccount.userList[index] = data;
            UserAccount.UserAjax(data, function (data) {
                var newdata = { "data": UserAccount.userList };
                UserAccount.LoadList(newdata);
                $("#bg_cover").fadeOut(200);
                $("#layer").hide();
            });
        }
    },
    DelUser: function (data, index) {
        data["action"] = "deluser";
        if (confirm("确定删除吗")) {
            UserAccount.UserAjax(data, function () {
                UserAccount.userList.splice(index, 1);
                var newdata = { "data": UserAccount.userList };
                UserAccount.LoadList(newdata);
            });
        }
    },
    AddUser: function () {
        if (UserAccount.userRole.ID != 1) {
            alert("非管理员不可操作!");
            return;
        }
        Common.ShowEditFrame("bg_cover", "addUserMove_div", "adduser_div", "addUserClose_btn");
        $("#addUser_btn").unbind().bind("click", _addUser);
        function _addUser() {
            var data = { "action": "adduser" };
            data["USERNAME"] = $("#add_username").val();
            if (data["USERNAME"] == "admin") {
                alert("此帐号不可创建!");
                return;
            }
            data["EMAIL"] = $("#add_email").val();
            data["PASSWORD"] = $("#add_password").val();
            if (!(data["PASSWORD"] == $("#add_password2").val())) {
                alert("密码确认错误!");
                return;
            }
            data["Power"] = $("#add_power").attr("checked") ? 1 : 0;
            data["MOBILE"] = "";
            data["OrgTag"] = "anjian";
            data["roleid"] = $("#role_sel").val();
            data["RealName"] = $("#add_realname").val();
            data["DepartmentName"] = $("#add_departmentname").val();
            UserAccount.UserAjax(data, function () {
                UserAccount.GetList();
                $("#bg_cover").fadeOut(200);
                $("#adduser_div").hide();
                $("#add_username").val("");
                $("#add_email").val("");
                $("#add_password").val("");
                $("#add_password2").val("");
                $("#add_power").attr("checked", false);
            });
        }
    },
    UpdatePassword: function () {
        Common.ShowEditFrame("bg_cover", "updatepassword_move_div", "updatepassword", "updatepassword_close");
        $("#updatepassword_btn").unbind().bind("click", function () {
            var pw1 = $("#Password1").val();
            var pw2 = $("#Password2").val();
            if (pw1 != pw2) {
                alert("密码确认错误");
                return;
            }
            var data = { "action": "updatepassword", "password": pw1 };
            UserAccount.UserAjax(data, function (d) {
                alert("密码修改成功!");
                $("#bg_cover").fadeOut(200);
                $("#updatepassword").hide();
            });
        });
    },
    GetRole: function () {
        var data = { "action": "getrole" }
        UserAccount.UserAjax(data, function (data) {
            UserAccount.cRoleData = data;
            var roleSel = document.getElementById("role_sel");
            var userRoleSel = document.getElementById("user_role_sel");
            for (var i = 0; i < data.length; i++) {
                $("#role_sel").append("<option value=" + data[i].ID + ">" + data[i].RoleName + "</option>");
                $("#user_role_sel").append("<option value=" + data[i].ID + ">" + data[i].RoleName + "</option>");
            }
        });
    },
    GetUserRole: function () {
        var data = { "action": "getuserrole" };
        UserAccount.UserAjax(data, function (data) {
            UserAccount.userRole = data;
            if (UserAccount.userRole.ID == 1) {
                $("#quanxianguanli_div dl dd[act='jsgl']").show();
            }
        });
    },
    GetUserInfo: function () {
        var data = { "action": "getuserinfo" };
        UserAccount.UserAjax(data, function (data) {
            UserAccount.userInfo = data[0];
            if (data[0].RoleID == 1) {
                UserAccount.GetList();
                $("#updatepassword_a").hide();
            } else {
                $("#updatepassword_a").hide();
                UserAccount.LoadUserInfo();
            }
        });
    },
    LoadUserInfo: function () {
        data = [UserAccount.userInfo];
        var newdata = { "data": data };
        var html = template.render('list_temps', newdata);
        var _html = $(html);
        _html.find("a[act='del']").hide();
        _html.find("a[act='edit']").unbind().bind("click", function () {
            UserAccount.UpdateUserInfo(UserAccount.userInfo);
        });
        $("#list_body_div").empty().append(_html);
    },
    UpdateUserInfo: function (data) {
        Common.ShowEditFrame("bg_cover", "updateinfodiv_move_div", "updateinfodiv", "updateinfodiv_close");
        $("#info_username").text(data.USERNAME);
        $("#info_realname").val(data.RealName);
        $("#info_departmentname").val(data.DepartmentName);
        $("#info_password1").val(data.PASSWORD);
        $("#info_password2").val(data.PASSWORD);
        $("#info_email").val(data.EMAIL);
        $("#info_power").attr("checked", data.Power == 0 ? false : true);
        //$("#info_role").val(data.RoleID);
        $("#update_userinfo").unbind().bind("click", _submitFun);
        function _submitFun() {
            var p1 = $("#info_password1").val();
            var p2 = $("#info_password2").val();
            if (p1 != p2) {
                alert("确认密码错误");
                $("#info_password2").focus();
                return;
            }
            data["action"] = "updateuser";
            data.EMAIL = $("#info_email").val();
            data.Power = $("#info_power").attr("checked") ? 1 : 0;
            //data.RoleID = $("#user_role_sel").val();
            data.RealName = $("#info_realname").val();
            data.DepartmentName = $("#info_departmentname").val();
            data.PASSWORD = p1;
            //data.RoleName = $("#user_role_sel").find("option:selected").text();
            UserAccount.UserAjax(data, function (d) {
                UserAccount.userInfo = data;
                UserAccount.LoadUserInfo();
                $("#bg_cover").fadeOut(200);
                $("#updateinfodiv").hide();
            });
        }
    },
    UserAjax: function (data, callfun) {

        $.ajax("../../Handler/User.ashx", {
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
$(function () {
    UserAccount.Init();

});
