/// <reference path="weiboAnalysis.js" />
var _personalDetails = new Object;
var PersonalDetails = _personalDetails.property = {
    IdolParameter: { "display_style": 8, "act": "personalDetails", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "true", "nearTime": "0,d" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    FollowerData: { "page_size": 16, "result_id": "followerList", "status_bar_id": "pager_list", "load_img": "", "info_id": "page_info", "sql_tag": "item", "web_url": "Handler/FollowerHandler.ashx" },
    IdolCategoryquery: { "display_style": "8", "act": "agencyCategory", "action": "GetQueryTagValues", "mindate": "01/01/2012", "fieldname": "DATENUM", "sort": "ReverseDate", "documentcount": "True", "database": Config.IdolDataBase["newweibo"], "predict": "false", "text": "*" },
    isSaveHistory: false,
    LoadStart: true,
    isUserInfo: true,
    FollowerQueryParams: { "act": "InitFollower", "where": "", "orderBy": "ID DESC" },
    Attention: {},
    FiletextArray: [],
    uaerAccount: "",
    webSource: "",
    _Template: null,
    Init: function () {
        Material.Init();
        PersonalDetails.IdolParameter["isNearTime"] = "true";
        this.cacheData = new CatcheInfoData();
        this.LoadinImg();
        this._Template = new Analysis();
        this._Template.analysis.isLoadUserInfo = false;
        this._Template.analysis.IdolParameter = this.IdolParameter;
        this._Template.analysis.Init();
        this.clickAll();
    },
    LoadEvent: function () { /*页面事件*/
        this.realTimeWeibo(); //实时
        this.forwardNumSort(); //转发
        this.replyNumSort(); //评论
        this.screeningWeibo(); //条件筛选
        this.advanceSearch(); //高级搜索


    }, ready: function (userName, webSource) {
        PersonalDetails.uaerAccount = userName;
        PersonalDetails.webSource = webSource;
        GetPageAjax();
    },
    clickAll: function () {
        $("#click_all").click(function () {
            $("#followerList dd").removeClass("on");
            PersonalDetails.LoadStart = true;
            $(this).addClass("on");
            GetPageAjax();
        });

    },
    loadCondition: function () { //高级搜索条件筛选
        //关键字
        var keyword = "*";
        keyword = $("#keyword_txt").val() == "" ? "*" : $("#keyword_txt").val();
        PersonalDetails.IdolParameter["text"] = keyword;
        PersonalDetails.IdolCategoryquery["text"] = keyword;
        var filetextData = [];
        $("#shaixuan_checkbox_div :checkbox").each(function () { /*筛选条件*/
            if (this.checked) {
                filetextData.push("MATCH{" + this.value + "}:" + this.name);
            }
        });
        if ($("#province_sct").val() != "0") {
            filetextData.push("MATCH{" + $("#province_sct").val() + "}:PROVINCE");
        }
        if (PersonalDetails.LoadStart) {
            //PersonalDetails.LoadStart = false;
            $("#widget_outer").hide();
            filetextData.push("MATCH{1}:ISFOLLOWER");
        } else {
            $("#widget_outer").show();
            filetextData.push("MATCH{" + PersonalDetails.uaerAccount + "}:AUTHORGTRUENAME");
            //filetextData.push("MATCH{" + PersonalDetails.webSource + "}:WEBSOURCE");
        }
        PersonalDetails.IdolParameter["fieldtext"] = filetextData.join(" AND ");
        PersonalDetails.IdolCategoryquery["fieldtext"] = filetextData.join(" AND ");

    },
    advanceSearch: function () {
        $("#close_advanced_search_a").click(function () {
            $("#advanced_search_div").hide();
        });
    },
    LoadinImg: function () {
        if (PersonalDetails.isUserInfo) {
            Common.LoadingImg("user_info_div", "1");
        }
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
        $("#pagebar").empty();
    },
    loadAttention: function (data) {
        PersonalDetails.Attention = data;
        GetPageAjax();
    },
    sortByWhere: function (dom, sortWhere) {
        PersonalDetails.isUserInfo = false;
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        PersonalDetails.IdolParameter["sort"] = sortWhere;
        PersonalDetails.LoadinImg();
        GetPageAjax();
    },
    realTimeWeibo: function () {//实时微博
        $("#real_time_btn").click(function () {
            PersonalDetails.sortByWhere(this, "Date");
        })
    },
    forwardNumSort: function () {//转发最多
        $("#hot_point_btn").click(function () {
            PersonalDetails.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
    },
    replyNumSort: function () {// 评论微博 
        $("#negative_btn").click(function () {
            PersonalDetails.sortByWhere(this, "REPLYNUM:numberdecreasing");
        });
    },
    screeningWeibo: function () {//微博筛选
        $("#weibo_screening_btn").click(function () {
            PersonalDetails.isUserInfo = false;
            var keyword = $("#keyword_txt").val();
            PersonalDetails.LoadinImg();
            GetPageAjax();
            if (keyword != "") {
                PersonalDetails.isSaveHistory = true;
                PersonalDetails.getTimeTrend();
            }

        });
    },
    clickShowTimerTrend: function () {
        $("#show_timer_trend").click(function () {
            Common.ShowEditFrame("timer_t", "time_topicmove_column", "time_layer", "time_close");
        });
    },
    getTimeTrend: function () {
        PersonalDetails._Template.analysis.getPostJson("../Handler/WeiboEventHandler.ashx", PersonalDetails.IdolCategoryquery, function (data) {
            TimeTrend(data);
        });
    },
    cacheData: new Object(), // new CatchInfoData(), //选择分析微博
    InitFollower: function () {
        PersonalDetails.FollowerData["load_img"] = "img/load_icon.gif";
        var sp = new SqlPager(PersonalDetails.FollowerData);
        sp.Display = function (data, l_obj) {
            var count = 1;
            var entity = l_obj["entity_" + count];
            if (!entity) {
                Common.LoadingImg("followerList", "2");
                return;
            }
            var KwList = [];
            KwList.push("<dl>");
            while (entity) {
                KwList.push("<dd>");
                KwList.push("<a href=\"javascript:void(null);\"  name=\"follower_" + entity.ID + "\" uName =\"" + entity.UserName + "\" uSource=\"" + entity.WebSource + "\">" + unescape(entity.Nick) + "</a>");
                KwList.push("<dd>");
                entity = l_obj["entity_" + (++count)];
            }
            KwList.push("</dl>");

            $("#followerList").empty().html(KwList.join(""));
            if (!PersonalDetails.LoadStart) {
                $("#followerList").find("dd").eq(0).addClass("on");
            } else {
                $("#click_all").addClass("on");
            }
            PersonalDetails.FollowerEventFun();
            var follower = $("#followerList").find(".on a");
            var source = unescape(follower.attr("uSource"));
            var name = unescape(follower.attr("uName"));
            PersonalDetails.ready(name, source);
            PersonalDetails.getTimeTrend();
        }
        sp.LoadData(1, PersonalDetails.FollowerQueryParams);
    },
    FollowerEventFun: function () {
        $("#followerList").find("a").unbind("click").click(function () {
            PersonalDetails.LoadStart = false;
            $("#click_all").removeClass("on");
            $(this).parent().siblings().removeClass();
            $(this).parent().addClass("on");
            var follower = $("#followerList").find(".on a");
            var source = unescape(follower.attr("uSource"));
            var name = unescape(follower.attr("uName"));
            PersonalDetails.ready(name, source);
            PersonalDetails.getTimeTrend();
            PersonalDetails.isUserInfo = true;
        });
    }
}

function GetPostAjax(data, callback) {
    $.post("Handler/PersonalDetails.ashx", data, function (data) {
        callback(data);
    }, "json");
}

//请求列表Ajax
function GetPageAjax() {
    PersonalDetails.loadCondition(); //加载查询条件
    PersonalDetails._Template.analysis.IdolParameter = PersonalDetails.IdolParameter;
    if (PersonalDetails.isSaveHistory) {
        PersonalDetails._Template.analysis.addHistory();
        PersonalDetails.isSaveHistory = false;

        $("#history_div ul li").click(function (d) {
            //$("#history_div").hide();
            var index = $("#history_div ul li").index(this);
            PersonalDetails._Template.analysis.IdolParameter = PersonalDetails._Template.analysis.history[index].data;
            PersonalDetails.LoadinImg();
            PersonalDetails._Template.analysis.reductionHistory(index);
            loadIdol();
        });
    }

    loadIdol();
}

function loadIdol() {
    var Lpager = new Pager(PersonalDetails.PageInitParameter);
    Lpager.Display = function (data) {
        $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
        $("#count_b").text(this.totalCount);
        if (!data || data == "") {
            Common.LoadingImg("user_info_div", "1");
            return;
        }
        var domArry = [];
        for (var i in data.data) {
            var id = data.data[i].retweetId;
        }
        var weiboLength = data.data.length;
        if (weiboLength > 0 && PersonalDetails.isUserInfo) {
            var userInfo = PersonalDetails._Template.analysis.userInfoTemp2(data.data[0]);
            $("#user_info_div").empty().append(userInfo);
            PersonalDetails.clickShowTimerTrend();
            PersonalDetails.getTimeTrend();
        }

        PersonalDetails._Template.analysis.resultDataIdol(data.data);


        //返回结果
        $(".add_guan_zhu").unbind("click").click(function () {
            if ($(this).attr("act") == "qx") {
                if (!confirm("确认取消吗？")) {
                    return;
                }
            }
            PersonalDetails._Template.analysis.addAttention(null, this)
            //            if (!confirm("确认取消吗？")) {
            //                return;
            //            }

            //            var datas = {};
            //            datas["d"] = new Date().getTime();
            //            datas["act"] = "delete";
            //            datas["id"] = $("#followerList").find(".on a").attr("name").split("_")[1];
            //            $.post("Handler/FollowerHandler.ashx", datas, function (data) {
            //                if (data.Success == "1") {
            //                    PersonalDetails.InitFollower();
            //                }
            //            }, "json");
        });
        //收藏/取消收藏
        $("span[name='favorite'] a").click(function () {
            PersonalDetails._Template.analysis.initFavoriteEvent(this);
        });
        PersonalDetails._Template.analysis.checkboxChange();
    };
    Lpager.LoadData(1, PersonalDetails._Template.analysis.IdolParameter); //PersonalDetails.IdolParameter);
}

//关注用户发的微博的时间趋势图
var _highchart;
//时间趋势图 Time trend
function TimeTrend(datas) {

    var data = datas.data;
    for (var i = 0, j = data.length; i < j; i++) {
        var datax = data[i]["x"] + "";
        var y = datax.substring(0, 4);
        var m = parseInt(datax.substring(4, 6), 10) - 1;
        var d = datax.substring(6, 8);
        data[i]["x"] = Date.UTC(y, m, d, -8);
    }

    Highcharts.setOptions({/*时间趋势图*/
        lang: {
            rangeSelectorZoom: "缩放",
            rangeSelectorFrom: "从",
            rangeSelectorTo: "至"
        },
        global: {
            useUTC: true
        }
    });
    _highchart = new Highcharts.StockChart({
        chart: {
            renderTo: "content",
            events: {
                load: function () {
                    $("#btn_redraw").toggle(function () {
                        $("#btn_redraw").val("显示峰值");
                        _highchart.series[0].dataLabelsGroup.hide();
                    }, function () {
                        $("#btn_redraw").val("隐藏峰值");
                        _highchart.series[0].dataLabelsGroup.show();
                    });
                },
                redraw: function () { /*移动块*/
                    // alert("okRedraw");
                    //chart.series[0].dataLabelsGroup.hide();
                    //chart.series[0].dataLabelsGroup.show();
                }
            }
        },

        plotOptions: { /*时间趋势图*/
            series: {
                lineWidth: 3, //线条宽度
                color: "#4572a7", //线条颜色
                marker: {
                    radius: 6, //点大小
                    color: "#E95613"
                },
                dataLabels: { /*趋势图线是否显示X值*/
                    staggerLines: 1,
                    enabled: true,
                    //rotation: -90,//旋转角度
                    //borderRadius: 10,
                    //backgroundColor: 'rgba(252, 255, 197, 0.3)',
                    //borderWidth: 1,
                    //borderColor: '#AAA',
                    y: -12
                }
            }
        },
        credits: {
            enabled: false
        },
        rangeSelector: {
            selected: 1
        },
        title: {
            text: ''
        },
        scrollbar: {
        },
        rangeSelector: {
            inputEnabled: true,
            enabled: true,
            buttons: [
                   {

                       type: 'day',
                       count: 1,
                       text: '1天'
                   }, {
                       type: 'month',
                       count: 1,
                       text: '1月'
                   }, {
                       type: 'month',
                       count: 3,
                       text: '3月'
                   }, {
                       type: 'month',
                       count: 6,
                       text: '半年'
                   }, {
                       type: 'year',
                       count: 1,
                       text: '1年'
                   }, {
                       type: 'all',
                       text: '所有'
                   }
],
            inputDateFormat: "%Y-%m-%d",
            selected: 1
        },
        navigator: {/*数据块移动*/
            enabled: true,
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    second: '%d日 %H:%M:%S',
                    minute: '%d日 %H:%M',
                    hour: '%d日 %H:%M',
                    day: '%m月%d日',
                    week: '%Y年%m月%d日',
                    month: '%Y年%m月',
                    year: '%Y年'
                }
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                second: '%d日<br/>%H:%M:%S',
                minute: '%d日<br/>%H:%M',
                hour: '%d日<br/>%H:%M',
                day: '%m月%d日',
                week: '%m月%d日',
                month: '%Y年%m月',
                year: '%Y年'
            }
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return this.value + '';
                },
                x: -2
            },
            minorTickWidth: 10,
            maxPadding: 0.05, /*设置刻度大小*/
            maxZoom: 1, /*设置刻度大小*/
            min: 0

        },
        tooltip: {/*鼠标放上去 提示框*/
            formatter: function () {
                return "微博数：<b class=\"color_2\">" + this.y + "</b><br/>时间：<b class=\"color_2\">" + getLocalTime(this.x) + "</b>";
            }
        },
        series: [{
            name: 'AAPL Stock Price',
            data: data,
            tooltip: {
                valueDecimals: 2
            }, marker: {
                enabled: true,
                radius: 3
            }
        }
]
    });
}
function getLocalTime(nS) {
    //return new Date(parseInt(nS)).toLocaleString().substr(0, 17);
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    // return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}























