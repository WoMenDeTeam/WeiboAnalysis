$(document).ready(function() {
    /*$("#username").val("在此输入用户名");
    $("#username").focus(function() {
    $("#username").val("");
    });*/
    Login.DisUserName();

    $("#loginButton").click(function() {
        Login.Btnclick();
    });
    $("body").keydown(function(e) {
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
    $("#loading").ajaxStart(function() {
        $(this).show();
    });

});
var _login = new Object;
var Login = _login.property = {
    UserInfoCheck: function(UserName, PassWord, CodeStr) {
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
        /*if (CodeStr == "") {
        $("#LabelError").show();
        $("#LabelError").empty().html("验证码不能为空！");
        return false;
        }
        else {
        $("#LabelError").empty();
        }*/
        return Flag;
    },
    Btnclick: function() {
        var UserName = $("#username").val();
        var PassWord = $("#pwd").val();
        //var CodeStr = $("#VerifyCode").val();
        if (Login.UserInfoCheck(UserName, PassWord)) {
            $.post("Handler/User.ashx", { 'action': 'user_login', 'User_Name': UserName, 'Pass_Word': PassWord },
                function(Data, textStatus) {
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
                }, "json"
            );
        }
    },
    Init_log: function() {
        $.get("Handler/log.ashx",
            null,
            function(data) {
                $("#log_list").empty().html(data);
            }
        );
    },
    DisUserName: function() {
        $.post("Handler/User.ashx", { 'action': 'get_user_accid' },
            function(Data, textStatus) {
                if (Data) {
                    if (Data["SuccessCode"] == "1") {
                        $("#username").val(unescape(Data.AccId));
                    }
                }
            }, "json"
        );
    }
}





