/// <reference path="weiboAnalysis.js" />

(function () {
    var root = this;
    if (typeof exports !== 'undefined') {
        Agency = exports;
    } else {
        Agency = root.agency = {};
    }
    
    Agency.weiboAnalysis = new Analysis().analysis;
    Agency.idolParameter = { "display_style": 8, "act": "personalDetails", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "true", "nearTime": "0,d" };
    Agency.pageInitParameter = { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" };
    Agency.sqlParameter = { "page_size": 16, "result_id": "followerList", "status_bar_id": "pager_list", "load_img": "", "info_id": "page_info", "sql_tag": "item", "web_url": "Handler/KeyWordsHandler.ashx" };
    Agency.sqlPageParameter = { "act": "initKeywords", "where": "", "orderBy": "ID DESC" };
    Agency.idolCategoryquery = { "display_style": "8", "act": "agencyCategory", "action": "GetQueryTagValues", "mindate": "01/01/2012", "fieldname": "DATENUM", "sort": "ReverseDate", "documentcount": "True", "database": Config.IdolDataBase["newweibo"], "predict": "false", "text": "*" };

    Agency.weiboAnalysis.IdolParameter = Agency.idolParameter;
    Agency.idolHanderUrl = "../Handler/WeiboEventHandler.ashx";
    Agency.isSaveHistory = false;
    Agency.isGetCategoryQuery = true;
    Agency.startPage = 1;
    Agency.agencyName = "";

    
    Agency.Init = function () {
        Agency.weiboAnalysis = new Analysis().analysis;
        Agency.weiboAnalysis.Init();
        Agency.weiboAnalysis.loadAdvanceChange();
        Agency.serach();
        Agency.byRealTime();
        Agency.byReplyNum();
        Agency.byForwardNum();
        //Agency.clickJigou();
        //Agency.clickYongHu();
        //Agency.postAjax();
    }
    Agency.rendy = function (keyword) {
        Agency.weiboAnalysis.clearAdvPlan();
        $("#condition_div").empty();
        Agency.agencyName = keyword;
        Agency.postAjax();
    }
    Agency.loadImg = function () {
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
    }
    Agency.sortBy = function (dom, field) {
        //MonitorInfo.isSaveHistory = false;
        Agency.isSaveHistory = false;
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        Agency.idolParameter["sort"] = field;
        //MonitorInfo.LoadinImg();
        Agency.postAjax();
    }
    //按微博发布时间排序
    Agency.byRealTime = function () {
        $("#real_time_btn").click(function () {
            Agency.sortBy(this, "Date");
        })
    }
    //按微博转发数量最多的排序
    Agency.byForwardNum = function () {
        $("#hot_point_btn").click(function () {
            Agency.sortBy(this, "FORWARDNUM:numberdecreasing");
        });
    }
    //按微博评论数量最多的排序
    Agency.byReplyNum = function () {
        $("#negative_btn").click(function () {
            Agency.sortBy(this, "REPLYNUM:numberdecreasing");
        });
    }
    Agency.serach = function () {
        $("#weibo_screening_btn").click(function () {
            var keyword = $("#keyword_txt").val();
            if (keyword == "") {
                alert("请输入搜索关键字");
                return;
            }
            Agency.isSaveHistory = true;
            Agency.isGetCategoryQuery = true;
            Agency.postAjax();
        });
    }
    Agency.clickJigou = function () {
        $("#jigou_a").click(function () {
            Agency.InitFollower("3");
        });
    }
    Agency.clickYongHu = function () {
        $("#yonghu_a").click(function () {
            Agency.InitFollower("4");
        });
    }

    Agency.postAjax = function () {
        Agency.loadImg();
        var filetextArray = [];
        var keyWorde = $("#keyword_txt").val() == "" ? "*" : $("#keyword_txt").val(); /*搜索关键字*/
        if (keyWorde != "*") {
            Agency.idolParameter["text"] = Agency.agencyName + "+ AND +" + keyWorde;
            Agency.idolCategoryquery["text"] = Agency.agencyName + "+ AND +" + keyWorde;
            //Agency.idolCategoryquery["fieldtext"] = "MATCH{" + Agency.agencyName + "AND" + keyWorde + "}:DRECONTENT";
            //"fieldtext": "MATCH{赵铁锤}:DRECONTENT
        } else {
            Agency.idolParameter["text"] = Agency.agencyName;
            Agency.idolCategoryquery["text"] = Agency.agencyName;

        }
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
        Agency.idolParameter["fieldtext"] = filetextArray.join(" AND ");
        Agency.weiboAnalysis.IdolParameter = Agency.idolParameter;
        if (Agency.isSaveHistory) {
            Agency.isSaveHistory = false;
            Agency.weiboAnalysis.addHistory();
            $("#history_div ul li").click(function (d) {
                $("#history_div").hide();
                var index = $("#history_div ul li").index(this);
                Agency.weiboAnalysis.IdolParameter = Agency.weiboAnalysis.history[index].data;
                Agency.loadImg()
                Agency.weiboAnalysis.reductionHistory(index);
                Agency.loadIdol();
            });
        }
        Agency.loadIdol();
    }
    Agency.loadIdol = function () {
        var Lpager = new Pager(Agency.pageInitParameter);
        Lpager.Display = function (data) {
            Agency.weiboAnalysis.resultDataIdol(data.data);
            Agency.weiboAnalysis.showUserInfoDiv();
            $("span[name='favorite'] a").click(function () {
                Agency.weiboAnalysis.initFavoriteEvent(this);
            });
            Agency.weiboAnalysis.checkboxChange();
        };
        Lpager.LoadData(Agency.startPage, Agency.weiboAnalysis.IdolParameter);
        if (Agency.isGetCategoryQuery) {
            Agency.isGetCategoryQuery = false;
            Agency.getCategoryQuery();
        }
    }
    //获取微博的时间趋势图数据
    Agency.getCategoryQuery = function () {
        Agency.weiboAnalysis.getPostJson(Agency.idolHanderUrl, Agency.idolCategoryquery, function (data) {
            TimeTrend(data);
        })
    };

    Agency.InitFollower = function (id) {
        Agency.sqlParameter["load_img"] = "img/load_icon.gif";
        Agency.sqlPageParameter["where"] = "KeywordType=" + id;
        var sp = new SqlPager(Agency.sqlParameter);
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
                KwList.push("<a href=\"javascript:void(null);\"  name=\"follower_" + entity.ID + "\" uName =\"" + entity.Name + "\" >" + unescape(entity.Name) + "</a>");
                KwList.push("<dd>");
                entity = l_obj["entity_" + (++count)];
            }
            KwList.push("</dl>");
            $("#followerList").empty().html(KwList.join(""));
            $("#followerList").find("dd").eq(0).addClass("on");
            Agency.leftListEventFun();
            var follower = $("#followerList").find(".on a");
            var name = unescape(follower.attr("uName"));
            Agency.rendy(name);
        }
        sp.LoadData(1, Agency.sqlPageParameter);
    }

    Agency.leftListEventFun = function () {
        $("#followerList").find("a").unbind("click").click(function () {
            // PersonalDetails.LoadStart = false;
            $("#click_all").removeClass("on");
            $(this).parent().siblings().removeClass();
            $(this).parent().addClass("on");
            var follower = $("#followerList").find(".on a");
            var name = unescape(follower.attr("uName"));
            Agency.isGetCategoryQuery = true;
            Agency.rendy(name);
        });
    }

}).call(this);


var _highchart;
function TimeTrend(datas) {
    var data = datas.data;

    for (var i = 0, j = data.length; i < j; i++) {
        var datax = data[i]["x"] + "";
        var y = datax.substring(0, 4);
        var m = parseInt(datax.substring(4, 6), 10) - 1;
        var d = datax.substring(6, 8);
        data[i]["x"] = Date.UTC(y, m, d, -8);
    }

    /*时间趋势图*/
    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: "缩放",
            rangeSelectorFrom: "从",
            rangeSelectorTo: "至"
        },
        global: { useUTC: true }
    });
    _highchart = new Highcharts.StockChart({
        chart: {
            renderTo: "user_info_div",
            events: {
                click: function () {

                },
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
                    day: '%d日',
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
                day: '%d日',
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
                // rotation: -45, /*旋转°*/
                x: -2
            },
            minorTickWidth: 10,
            //minPadding: 10,
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
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}