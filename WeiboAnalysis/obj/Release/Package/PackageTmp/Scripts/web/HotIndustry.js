/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />


var HotIndustry = {
    data: [],
    Init: function () {
        var time = Config.GetTime("-");
        $("#custom_start_time").val(time);
        var week = HotIndustry.GetOfYellWeek();
        week = parseInt(week) - 1;
        $("#week_txt").val(week)
        HotIndustry.InitEvent();
        HotIndustry.MyJson();
    }, InitEvent: function () {
        $("#submit_serach").unbind().bind("click", HotIndustry.MyJson);
    }, MyJson: function () {
        var url = HotIndustry.GetHotUrl();
        $.ajax(url, {
            type: "get",
            dataType: "json",
            success: function (data) {
                HotIndustry.DataToDocument(data);
                HotIndustry.DataToPieChartData(data);
            }, error: function () {
                $("#rankList").empty().append("暂无数据");
                $("#right_list").empty();
                $("#container").empty();
            }
        });
    }, DataToDocument: function (data) {
        HotIndustry.data = data.data;
        $("#rankList").empty();
        $("#right_list").empty();
        var docUl = [];
        var docR = [];
        var WeiboCount = 0;
        docUl.push("<ul>");
        docR.push("<ul>");
        for (var i = 0; i < HotIndustry.data.length; i++) {

            var weiboTrend = HotIndustry.data[i].weiboTrend;
            var paihangTrend = HotIndustry.data[i].paihangTrend;
            var weibo = weiboTrend < 0 ? "<img src=\"img/btn_arrow_down_act.gif\" />" : weiboTrend > 0 ? "<img src=\"img/btn_arrow_up_act.gif\" />" : "<img src=\"img/btn_arrow_null_act.gif\" />";
            var paihang = paihangTrend < 0 ? "<img src=\"img/btn_arrow_down.gif\" />" : paihangTrend > 0 ? "<img src=\"img/btn_arrow_up.gif\" />" : "";

            var weight = HotIndustry.data[i].weight;
            WeiboCount = WeiboCount + parseInt(weight);
            var num = (i + 1 < 10) ? "0" + (i + 1) : (i + 1);
            if (i < 6) {
                if (i < 3) {
                    docUl.push("<li><span class=\"num hot\">" + num + "</span><span class=\"text\">" + HotIndustry.data[i].text + paihang + "</span> <code>微博：<b class=\"color_2\">" + weight + weibo + "</b></code> </li>");
                } else {
                    docUl.push("<li><span class=\"num\">" + num + "</span><span class=\"text\">" + HotIndustry.data[i].text + paihang + "</span> <code>微博：<b class=\"color_2\">" + weight + weibo + "</b></code> </li>");
                }
            } else {
                docR.push("<li><span class=\"num\">" + num + "</span><span class=\"text\">" + HotIndustry.data[i].text + paihang + "</span> <code>微博：<b class=\"color_2\">" + weight + weibo + "</b></code> </li>");
            }
        }
        docUl.push("</ul>");
        docR.push("</ul>");
        $("#rankList").append(docUl.join(""));
        $("#right_list").append(docR.join(""));
        $("#countWeibo").html(WeiboCount);
    },
    GetHotUrl: function () {
        var d = $("#custom_start_time").val();
        var fileName = d.split('-')[0] + $("#week_txt").val();
        var url = Config.HotIndustry + fileName + ".json";

        return url;
    }, DataToPieChartData: function (data) {
        data = data.data;
        var newdata = [];
        for (var i = 0; i < data.length; i++) {
            var d = [];
            d.push(data[i].text);
            d.push(data[i].weight);
            newdata.push(d);
        }
        HotIndustry.PieChart(newdata);
    }, LineChart: function (data) {
        var linechart;
        linechart = new Highcharts.Chart({
            chart: {
                renderTo: 'linechart',
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: '信息趋势',
                x: -20
            },

            xAxis: {
                categories: ["1", "2", "3", "4", "5", "6", "7"]
            },
            yAxis: {
                title: {
                    text: '微博数'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                min: 0
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/> 微博数' + this.y + '';
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: data
        });
    }
    , PieChart: function (data) {
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: '行业排行'
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b><br/>微博数: ' + this.y + '<br/>比例:' + this.percentage.toFixed(2) + ' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function () {
                            //return '<b>' + this.point.name + '</b><br/>微博数: ' + this.y + '<br/>比例:' + this.percentage.toFixed(2) + ' %';
                            return '<b>' + this.point.name + '</b>' + this.percentage.toFixed(2) + ' %';
                            //return '<b>' + this.point.name + '</b>比例:' + this.percentage.toFixed(2) + ' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '',
                data: data
            }]
        });
    }, GetOfYellWeek: function () {
        var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var result = 0;
        for (var i = 0; i < month; i++) {
            result += dateArr[i];
        }
        result += day;
        //判断是否闰年
        if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            result += 1;
        }
        result += 2;
        var s = parseInt(result / 7);
        var m = result % 7;
        if (m != 0) {
            s = s + 1;
        }
        if (s < 10) {
            s = "0" + s;
        }
        return s;
    }, YearMonthWeekCallFun: function () {

    }, YMWWeekCallFun: function () {
        var v = $("#week_sel").val();
        var y = $("#years_sel").val();
        v = v.split("_")[0];
        $("#week_b").html(v);
        $("#years_b").html(y);
        v = parseInt(v) < 10 ? "0" + v : v;
        $("#week_txt").val(v);
    }
}
$(function () {
    YearMonthWeek.Init({ callfun: HotIndustry.YearMonthWeekCallFun, weekfun: HotIndustry.YMWWeekCallFun });
    HotIndustry.Init()
});
