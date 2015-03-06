/// <reference path="../jquery-1.8.1.js" />
$(function () {

    Top.initEventFunction();
    Top.CheckHotWarning();
    Top.CheckWordsWarning();
    Top.CheckTask();
    Top.Quit();
    //Top.PlaySound();
    Top.loadPage("monitorInfo.html", function () { });

});

var pageParmas = { "type": "1", "page": "" };
var _top = new Object;
var Top = _top.property = {
    initEventFunction: function () {
        $("#SysSetting").unbind("hover").hover(function () {
            $("#divSetting").show();
        }, function () {
            $("#divSetting").hide();
        });
        $("#divSetting").unbind("hover").hover(function () {
            $(this).show();
        }, function () {
            $(this).hide();
        });

        $("#WeiboTongJi").unbind().hover(function () {
            $("#WeiboTongJiDiv").show();
        }, function () {
            $("#WeiboTongJiDiv").delay(200).hide();
        });
        $("#WeiboTongJiDiv").unbind().hover(function () {
            $(this).show();
        }, function () {
            $(this).hide();
        });

        $("#TabUL").find("li").unbind("click").click(function () {
            $(this).siblings().removeClass();
            $(this).addClass("on");
        });
        $("a[name='topClick']").unbind("click").click(function () {
            $("#TabUL").find("li").removeClass();
        });
        $("#divSetting ul li").unbind("click").click(function () {
            $("#TabUL li").removeClass("on");
            $("#TabUL li[name='sysmanage_li']").addClass("on");

        });
        $("#WeiboTongJiDiv ul li").unbind("click").click(function () {
            $("#TabUL li").removeClass("on");
            $("#TabUL li[name='weibotongji_li']").addClass("on");

        });
        $("#hotWarn").unbind("click").click(function () {
            Top.loadWarningInfo("warningInfo.html", "heatWarn", "");
        });
        $("#wordWarn").unbind("click").click(function () {
            Top.loadWarningInfo("warningInfo.html", "sensitiveWarn", "");
        });
    },
    WarnSound: { "wordsound": "", "hotsound": "", "playstart": 0 },
    PlaySound: function () {
        var c = 2;
        switch (Top.WarnSound.playstart) {
            case 0:
                if (Top.WarnSound.wordsound !== "") {
                    Top.soundPlay(Top.WarnSound.wordsound);
                }
                Top.WarnSound.playstart = 1;
                break;
            case 1:
                if (Top.WarnSound.hotsound !== "") {
                    Top.soundPlay(Top.WarnSound.hotsound);
                }
                Top.WarnSound.playstart = 0
                break;
            default:
                break;
        }
        setTimeout(Top.PlaySound, 5000);
    },
    CheckHotWarning: function () {
        $.post("Handler/EarlyWarnHotHandler.ashx", { "act": "HotWarning" },
                     function (data) {
                         //Top.soundPlay("sound/msg.wav");
                         Top.WarnSound.hotsound = "sound/hotsound.mp3";
                         if (data && data["TotalCount"] > 0) {
                             var oWarnNum = parseInt($("#hotWarnNum").html());
                             if (oWarnNum < parseInt(data["TotalCount"])) {
                                 //Top.soundPlay("sound/msg.wav");
                                 Top.WarnSound.hotsound = "sound/hotsound.mp3";
                                 Top.soundPlay("sound/hotsound.mp3");
                             }
                             $("#hotWarnNum").html(data["TotalCount"]);
                             $("#hotWarnNum").parent().parent("div").show();
                         }
                         else {
                             $("#hotWarnNum").parent().parent("div").hide();
                             Top.WarnSound.hotsound = "";
                         }
                     }, "json"
                  );
        setTimeout(Top.CheckHotWarning, 60000);
    },
    CheckWordsWarning: function () {
        $.post("Handler/EarlyWarnWordHandler.ashx", { "act": "WordWarning" },
                     function (data) {
                         if (data && data["TotalCount"] > 0) {
                             var oNumber = parseInt($("#wordWarnNum").html());
                             if (oNumber < parseInt(data["TotalCount"])) {
                                 //Top.soundPlay("sound/msg.wav");
                                 Top.soundPlay("sound/wordsound.mp3");
                             }
                             Top.WarnSound.wordsound = "sound/wordsound.mp3";
                             $("#wordWarnNum").html(data["TotalCount"]);
                             $("#wordWarnNum").parent().parent("div").show();
                         }
                         else {
                             $("#wordWarnNum").parent().parent("div").hide();
                             Top.WarnSound.wordsound = "";
                         }
                     }, "json"
                  );
        setTimeout(Top.CheckWordsWarning, 60000);
    },
    CheckTask: function () {
        $.post("Handler/WeiboTopicHandler.ashx", { "act": "GetTasksCount" },
                     function (data) {
                         if (data && data["TotalCount"] > 0) {
                             $("#tasksCount").html(data["TotalCount"]);
                             $("#tasksCount").parent().parent("div").show();
                         }
                         else {
                             $("#tasksCount").parent().parent("div").hide();
                         }
                     }, "json"
                  );
        setTimeout(Top.CheckTask, 60000);
    }, Quit: function () {
        $("#a_quid").click(function () {
            $.post("Handler/User.ashx", { "action": "quit" }, function (data) {
                if (data && data["SuccessCode"] == "1") {
                    window.parent.location.href = "login.html";
                }
            }, "json");
        })
    }, loadPage: function (url, callBack) {
        Top.SaveLog(url);
        $.ajaxSetup({
            cache: false //关闭AJAX相应的缓存 
        });
        $("#mainbody").empty();
        $("#mainbody").load(url, callBack);
    }, loadPersonalDetailsPage: function (url, type, page) {  /*分析任务*/
        pageParmas["type"] = type;
        pageParmas["page"] = page;
        this.loadPage(url, function () {
            InitPage(pageParmas);
        });
    }, loadWarningInfo: function (url, type, hotminid) {
        pageParmas["type"] = type;
        pageParmas["hotminid"] = hotminid;
        this.loadPage(url, function () {
            WarningInfoInitPage(pageParmas);
        });
    }, loadWeiBoStatisticPage: function (url, topicid, name, page) {
        pageParmas["topicid"] = topicid;
        pageParmas["name"] = name;
        pageParmas["page"] = page;
        this.loadPage(url, function () {
            weiBoStatisTicsInit(pageParmas);
        });

    }, ToChaKanPingLun: function (url, topicid, name, page) {
        pageParmas["topicid"] = topicid;
        pageParmas["name"] = name;
        pageParmas["page"] = page;
        this.loadPage(url, function () {
            //weiBoStatisTicsInit(pageParmas);
            ChaKanPingLun(pageParmas);
        });
    }, loadTopicOfWeibo: function (url, topicName, topicId, jobState, currPage) {
        pageParmas["topicName"] = topicName;
        pageParmas["topicId"] = topicId;
        pageParmas["jobState"] = jobState;
        pageParmas["backPage"] = currPage;
        this.loadPage(url, function () {
            topicOfWeiboFun(pageParmas);
        });
    }, soundPlay: function (file) {
        var src = "sound/msg.wav";
        // if (file) {
        src = file;
        // }
        var playControl = document.getElementById("soundPlay");
        playControl.src = src;
    }, loadCaseLibraryInfo: function (eid, defPage) {
        //案例库详情页面加载
        $("#mainbody").empty();
        $("#mainbody").load("caseLibraryInfo.html", function () {
            CaseLibraryInfo.newEventId = eid;
            CaseLibraryInfo.backIndex = defPage;
            CaseLibraryInfo.newEvents.init();
            CaseLibraryInfo.getEventsInfo();
            CaseLibraryInfo.getActionInfo();
            CaseLibraryInfo.getReportList();
            CaseLibraryInfo.init();
        });
    }, loadCaseLibary: function (pageIndex) {
        //案例库页面加载
        $("#mainbody").empty();
        $("#mainbody").load("CaseLibrary.html", function () {
            CaseLibrary.defPageStartIndex = pageIndex;
            CaseLibrary.searchObj.init();
            CaseLibrary.newEvents.init();
            CaseLibrary.loadEventItem(CaseLibrary.eventListQeuryParams);
            CaseLibrary.duiBi.init();
            CaseLibrary.eventList.init();
        });
    }, personDetailsByName: function (userName, webSource) {
        $("#mainbody").load("personalDetails.html", function () {
            PersonalDetails.isUserInfo = true;
            PersonalDetails.LoadStart = false;
            PersonalDetails.Init();
            PersonalDetails.LoadEvent();
            PersonalDetails.ready(userName, webSource); //单个人
        });

    }, personDetailsByAll: function () {
        $("#mainbody").load("personalDetails.html", function () {
            PersonalDetails.isUserInfo = false;
            PersonalDetails.LoadStart = true;
            PersonalDetails.Init();
            PersonalDetails.LoadEvent();
            PersonalDetails.ready("", 0);
        });
    }, SaveLog: function (url) {
        var data = { "act": "add", "url": url };
        $.ajax("../../Handler/OperatingLogHandler.ashx", {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: function (data) {
            },
            error: function () {
            }
            //Top.SaveLog();
        });
    }
}

