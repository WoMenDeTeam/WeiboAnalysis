$(function () {
    Login.InitOrg();
    Login.DisUserName();
    $("#loginButton").click(function () {
        Login.Btnclick();
    });
    $("body").keydown(function (e) {
        var intkey = -1;
        if (window.event) {
            intkey = event.keyCode;
        }
        else {
            intkey = e.which;
        }
        if (intkey == 13) {
            Login.Btnclick();
        }
    });
    $("#loading").hide();
    $("#loading").ajaxStart(function () {
        $(this).show();
    });
});
var _login = new Object;
var Login = _login.property = {
    UserInfoCheck: function (UserName, PassWord, CodeStr, ServerName) {
        var Flag = true;

        if (UserName == "") {
            $("#LabelError").show();
            $("#LabelError").empty().html("用户名不能为空！");
            return false;
        }
        else {
            $("#LabelError").empty();
        }
        if (PassWord == "") {
            $("#LabelError").show();
            $("#LabelError").empty().html("密码不能为空！");
            return false;
        }
        else {
            $("#LabelError").empty();
        }
        if (ServerName && ServerName != "") {
            //alert($("input[type='radio']:checked").val());
            $("#LabelError").empty();
        } else {
            $("#LabelError").show();
            $("#LabelError").empty().html("请选择登录服务器！");
            return false;
        }
        return Flag;
    },
    Btnclick: function () {
        var UserName = $("#username").val();
        var PassWord = $("#pwd").val();
        var ServerName = $("#org_list select").val();
        if (Login.UserInfoCheck(UserName, PassWord, "", ServerName)) {
            $.post("Handler/User.ashx", { 'action': 'user_login', 'username': UserName, 'password': PassWord, "servername": ServerName },
                function (Data, textStatus) {
                    if (Data) {
                        if (Data["SuccessCode"] == "1") {
                            location.href = Data["path"];
                        }
                        else if (Data["SuccessCode"] == "-1") {
                            $("#LabelError").show();
                            $("#LabelError").empty().html("您输入的验证码出错！");
                        } else {
                            $("#LabelError").show();
                            $("#LabelError").empty().html("用户信息出错，请您认真审核！");
                        }
                    }
                }, "json");
        }
    },
    Init_log: function () {
        $.get("Handler/log.ashx",
            null,
            function (data) {
                $("#log_list").empty().html(data);
            }
        );
    },
    DisUserName: function () {
        $.post("Handler/User.ashx", { 'action': 'get_user_accid' },
            function (Data, textStatus) {
                if (Data) {
                    if (Data["SuccessCode"] == "1") {
                        $("#username").val(unescape(Data.AccId));
                    }
                }
            }, "json"
        );
    }, InitOrg: function () {
        $.post("Handler/User.ashx", { 'action': 'getorg' },
            function (Data, textStatus) {
                if (Data && Data["SuccessCode"] == "1") {
                    for (var i = 0; i < Data.data.length; i++) {
                        $("#org_list select").append("<option value=" + Data.data[i].OrgTag + " >" + Data.data[i].OrgDesc + "</option>");
                    }
                }
            }, "json"
        );
    }
}
