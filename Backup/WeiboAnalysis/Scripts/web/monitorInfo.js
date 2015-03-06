
/// <reference path="../jquery-1.8.1.js" />

/**
*Idol请求基础参数：IdolParameter
*Idol数据库配置 command.js/  Config.IdolDataBase["newweibo"]
*/


var MonitorInfo = {
    IdolParameter: { "display_style": 8, "act": "weiboCountent", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "false", "nearTime": "0,d" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    Attention: {},
    Init: function () {
        Material.Init();
        this._Template = new Analysis();
        MonitorInfo.IdolParameter["isNearTime"] = "true";
        MonitorInfo.IdolParameter["nearTime"] = "0,d";
        this._Template.analysis.IdolParameter = this.IdolParameter;
        this.catchData = new CatcheInfoData();
        this._Template.analysis.Init();
        this._Template.analysis.loadAdvanceChange();

        MonitorInfo.GetPostAjax({ "act": "getattention" }, this.LoadAttention);
        var time = Config.GetTimeDDMMYYYY("/"); //d + "/" + M + "/" + y;
        $("#custom_end_time").val(time);
        //加载左边列表
        HotWeiboUser.GetHotUser({}, null);
    },
    isSaveHistory: false, //是否记录历史搜索
    isKuaiJie: true,
    advance: { "isVip": "0", "websource": "0", "province": "0" },
    _Template: null,
    LoadEvent: function () { /*页面事件*/
        this.changeTime();
        this.searchRecently(); /*按近几日搜索快捷事件*/
        this.searchFixedTime(); /*时间段搜索时间*/
        this.realTimeWeibo();
        this.forwardNumSort();
        this.replyNumSort();
        this.screeningWeibo();
        this.souSuo2();

    },
    LoadinImg: function () {
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
        $("#pagebar").empty();
    },
    LoadAttention: function (data) {
        MonitorInfo.Attention = data;
        MonitorInfo._Template.analysis.AttentionList = data;
        MonitorInfo.GetPageAjax();
    },
    changeTime: function () { //时间选项卡切换
        $("#wbdatesh_div ul li").click(function () {
            $("#wbdatesh_div ul li").removeClass("on");
            $(this).removeClass("on").addClass("on");
            var idx = $(this).index();
            $(".wb_currentnr").addClass("none_dis");
            $(".wb_currentnr:eq(" + idx + ")").removeClass("none_dis");
        });
    },
    searchRecently: function () { //按近几日搜索事件
        $("#recently_div li a").click(function () {
            MonitorInfo.isSaveHistory = true;
            $("#recently_div li").removeClass("on");
            $(this).parent().removeClass("on").addClass("on");
            var res = $(this).removeClass("").attr("value");
            MonitorInfo.IdolParameter["isNearTime"] = "true";
            MonitorInfo.IdolParameter["nearTime"] = res;
            MonitorInfo.IdolParameter["maxdate"] = "";
            MonitorInfo.IdolParameter["mindate"] = "";
            MonitorInfo.LoadinImg(); /*等待图片*/
            MonitorInfo.isKuaiJie = true;
            MonitorInfo.GetPageAjax();
        });
    },
    searchFixedTime: function () {//按给定时间搜索(自己定义时间)
        $("#custom_search_btn").click(function () {
            MonitorInfo.isSaveHistory = true;
            var startTime = $("#custom_start_time").val();
            //结束时间
            var endTime = $("#custom_end_time").val();
            MonitorInfo.IdolParameter["mindate"] = startTime;
            MonitorInfo.IdolParameter["maxdate"] = endTime;
            MonitorInfo.IdolParameter["isNearTime"] = "false";
            MonitorInfo.LoadinImg(); /*等待图片*/
            //s.push
            MonitorInfo.GetPageAjax();
        });
    },
    sortByWhere: function (dom, sortWhere) {
        MonitorInfo.isSaveHistory = false;
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        MonitorInfo.IdolParameter["sort"] = sortWhere;
        MonitorInfo.LoadinImg();
        MonitorInfo.GetPageAjax();
    },
    realTimeWeibo: function () {//实时微博
        $("#real_time_btn").click(function () {
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            MonitorInfo.sortByWhere(this, "Date");
        })
    },
    forwardNumSort: function () {//转发最多
        $("#hot_point_btn").click(function () {
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            MonitorInfo.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
    },
    replyNumSort: function () {// 评论微博 
        $("#negative_btn").click(function () {
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            MonitorInfo.sortByWhere(this, "REPLYNUM:numberdecreasing");
        });
    },
    screeningWeibo: function () {//微博筛选
        $("#weibo_screening_btn").click(function () {

            var keyw = $("#keyword_txt").val();
            if (keyw == "" || keyw == undefined || keyw == null) {
                $("#keyword_txt").focus();
                alert("请输入关键词");
                return;
            }
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            MonitorInfo.LoadinImg();
            MonitorInfo.isSaveHistory = true;
            MonitorInfo.IdolParameter["sort"] = "Relevance";
            $("#actionBtns li").removeClass("on");
            $("#recently_div li").removeClass("on");

            var startTime = $("#custom_start_time").val();
            var endTime = $("#custom_end_time").val();
            MonitorInfo.IdolParameter["mindate"] = startTime;
            MonitorInfo.IdolParameter["maxdate"] = endTime;
            MonitorInfo.IdolParameter["isNearTime"] = "false";

            MonitorInfo.isKuaiJie = false;
            MonitorInfo.GetPageAjax();
            $("#advanced_search_div").hide();
            //二次检索
        });
    },
    souSuo2: function () {
        $("#sousuo2_a").unbind().bind("click", function () {

            Common.ShowEditFrame("sad", "shousuo_move", "shousuo", "close_sousuo_btn");
            $("#keyword2_txt").val("");
        });
        $("#sousuo2_btn").unbind().bind("click", function () {
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            var keyword = $("#keyword_txt").val();
            var keyword2 = $("#keyword2_txt").val();
            if (keyword2 == "" || keyword2 == undefined || keyword2 == null) {
                $("#keyword2_txt").focus();
                alert("请输入关键词");
                return;
            }
            if (keyword == "" || keyword == undefined || keyword == null) {
                keyword = keyword2;
            } else {
                if (keyword2 == "" || keyword2 == undefined || keyword2 == null) {
                } else {
                    keyword = keyword + " " + keyword2;
                }
            }
            $("#keyword_txt").val(keyword);
            MonitorInfo.isKuaiJie = false;
            MonitorInfo.GetPageAjax();
            $("#sad,#shousuo").hide();
        });

    },
    catchData: new Object(),  //选择分析微博
    GetAttention: function () {
    }, GetPostAjax: function (data, callback) {
        $.post("Handler/MonitorInfo.ashx", data, function (data) {
            callback(data);
        }, "json");
    }, GetPageAjax: function () {
        //请求列表Ajax
        var filetextArray = [];
        var history = {};
        var condition = [];
        MonitorInfo.IdolParameter["text"] = MonitorInfo.getKeywords(); //keyWorde;

        if ($("#ckIsvip").attr("checked")) {
            filetextArray.push("MATCH{1}:ISVIP");
        }

        var webSource = $("#websource_sct").val();
        if ("0" != webSource) {
            filetextArray.push("MATCH{" + webSource + "}:WEBSOURCE");
        }
        var proviceName = $("#province_sct").val();
        if ("0" != proviceName) {
            filetextArray.push("MATCH{" + $("#province_sct").val() + "}:PROVINCE");
        }
        filetextArray.push("EXISTS{}:DRETITLE");
        MonitorInfo.IdolParameter["fieldtext"] = filetextArray.join(" AND ");

        MonitorInfo.IdolParameter["basematch"] = "";
        var isbase = $("#ckIsBase").attr("checked") == "checked";
        var keywordisnull = true;
        if (MonitorInfo.IdolParameter["text"] == "*") {
            keywordisnull == false;
        }
        //        if (MonitorInfo.isKuaiJie) {
        //            MonitorInfo.IdolParameter["text"] = "*";
        //        }
        if (!MonitorInfo.isKuaiJie && isbase) {
            MonitorInfo.IdolParameter["basematch"] = "WEIBO";
        }
        MonitorInfo.IdolParameter["minscore"] = $("#minscore_txt").val();
        MonitorInfo._Template.analysis.IdolParameter = MonitorInfo.IdolParameter;
        if (MonitorInfo.isSaveHistory)
            MonitorInfo._Template.analysis.addHistory();

        $("#history_div ul li").click(function (d) {
            // $("#history_div").hide();
            var index = $("#history_div ul li").index(this);
            MonitorInfo._Template.analysis.IdolParameter = MonitorInfo._Template.analysis.history[index].data;
            MonitorInfo.LoadinImg();
            MonitorInfo._Template.analysis.reductionHistory(index);
            MonitorInfo._Template.analysis.showAdvanceCondition();
            MonitorInfo.loadIdol();
        });
        MonitorInfo.loadIdol();
    }, getKeywords: function () {
        var keyword = $("#keyword_txt").val();
        if (keyword == "" || keyword == undefined || keyword == null) {
            keyword = "*";
        }
        var keywords = [];
        var newKeywords = [];
        if (keyword != "*") {
            keywords = keyword.split(" ");
        }
        for (var i = 0; i < keywords.length; i++) {
            newKeywords.push("\"" + keywords[i] + "\"");
        }
        if (keyword != "*") {
            // keyword = "(" + newKeywords.join(" AND ") + ") OR (" + newKeywords.join("") + ")";
            keyword = newKeywords.join(" AND ");
        }
        return keyword;
    }, loadIdol: function () {
        var Lpager = new Pager(MonitorInfo.PageInitParameter);
        Lpager.Display = function (data) {
            //加载模板
            $("#zhuanfaCount_b").html("0");
            $("#pinglunCount_b").html("0");
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            MonitorInfo._Template.analysis.resultDataIdol(data.data);
            MonitorInfo._Template.analysis.showUserInfoDiv(); //t添加/取消关注事件
            MonitorInfo._Template.analysis.checkboxChange(); //加载复选框事件
        };
        Lpager.LoadData(1, MonitorInfo._Template.analysis.IdolParameter);
    }
}

$(document).ready(function () {

    Common.LoginInitFun = function () {
        // Top.SaveLog();

        hs.graphicsDir = 'Scripts/graphics/';
        hs.graphicsDir = 'Scripts/graphics/';
        hs.fadeInOut = true;
        hs.dimmingOpacity = .6;
        MonitorInfo.Init();
        MonitorInfo.LoadEvent();
    }
    Common.CheckUser();
});
