/// <reference path="underscore-1.1.6.js" />
/// <reference path="backbone.js" />

/*****************************************************************************
*时间趋势图请求的Handler：      amChartSetting/baseboneAmPieData.ashx
*用户发帖数量统计请求的Handler：amChartSetting/baseboneAmPieData.ashx
*网站报道数量统计请求的Handler：Handler/Statistic.ashx
*Idol数据库配置：               Scripts/common.js 的 Config.IdolDataBase["statistic"]
*时间趋势图参数配置变量：       TimeTrendParameter
*柱图参数配置变量：             SiteSummaryParameter
*饼图参数配置变量:              InfoSummaryParameter
******************************************************************************/

window.onload = function() {
    Common.GetTab('tabs');
    window.app = new StatisticView();
    app.TimeTrend();
    app.SiteSummary();
    app.InfoSummary();
}
var BaseModel = Backbone.Model.extend({
    url: "amChartSetting/amTrendsetting.ashx"
});

var colors = Highcharts.getOptions().colors;
var chart;
var chartInfo;
var chartTime;
// "safety+newssource+portalsafety"
var Statistic = {
    /*Idol 时间趋势图请求参数*/
    TimeTrendParameter: { "selType": "trend", "action": "GetQueryTagValues", "fieldname": "AUTN_DATE", "sort": "ReverseDate", "dateperiod": "day", "documentcount": "True", "database": Config.IdolDataBase["statistic"], "text": "*", "mindate": "01/01/2010" },
    /*Idol 柱状图请求参数*/
    SiteSummaryParameter: { "action": "GetQueryTagValues", "fieldname": "MYSITENAME", "sort": "DocumentCount", "dateperiod": "day", "documentcount": "True", "database": Config.IdolDataBase["statistic"], "disnum": "6", "text": "*", "isBackbone": "true" },
    /*Idol 饼图请求参数 */
    InfoSummaryParameter: { "selType": "pie", "action": "GetQueryTagValues", "fieldname": "AUTHORNAME", "sort": "DocumentCount", "documentcount": "True", "database": Config.IdolDataBase["statistic"], "predict": "false", "disnum": " 5", "text": " *" },
    //  CommQuery: { "selType": "pie", "action": "GetQueryTagValues", "fieldname": "AUTHORNAME", "sort": "DocumentCount", "documentcount": "True", "databasematch": Config.IdolDataBase["statistic"], "predict": "false", "disnum": "5", "text": "*" },
    TimeTrendModel: null,
    InfoSummaryModel: null,
    SiteSummaryModel: null,
    //舆情分析-贪污受贿
    InitModel: function() {

        this.TimeTrendModel = new BaseModel();
        this.TimeTrendModel.url = "amChartSetting/baseboneAmPieData.ashx";
        this.InfoSummaryModel = new BaseModel();
        this.InfoSummaryModel.url = "amChartSetting/baseboneAmPieData.ashx";
        this.SiteSummaryModel = new BaseModel();
        this.SiteSummaryModel.url = "Handler/Statistic.ashx";
    }, TimeTrendView: function(data) {
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: "缩放",
                rangeSelectorFrom: "",
                rangeSelectorTo: "至"
            }
        });
        chartTime = new Highcharts.StockChart({
            chart: {
                renderTo: "total_date_flash",
                events: {
                    load: function() {
                        $("#btn_redraw").toggle(function() {
                            $("#btn_redraw").val("显示峰值");
                            chartTime.series[0].dataLabelsGroup.hide();
                        }, function() {
                            $("#btn_redraw").val("隐藏峰值");
                            chartTime.series[0].dataLabelsGroup.show();
                        });
                    }
                },
                height: 360,
                width: 990
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        borderRadius: 5
                        //                        borderRadius: 5,
                        //                        backgroundColor: 'rgba(252, 255, 197, 0.7)',
                        //                        borderWidth: 1,
                        //                        borderColor: '#AAA',
                        //                        y: -12
                    }
                }
            },
            rangeSelector: {
                inputEnabled: true,
                enabled: true,
                buttons: [
                        {
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
                selected: 0
            },


            title: {
                text: '时间趋势统计图'
            },
            scrollbar: {
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    second: '%Y-%m-%d<br/>%H:%M:%S',
                    minute: '%Y-%m-%d<br/>%H:%M',
                    hour: '%Y-%m-%d<br/>%H:%M',
                    day: '%d日',
                    week: '%m月%d日',
                    month: '%Y年%m月',
                    year: '%Y年'
                }
            },
            tooltip: {/*鼠标放上去 提示框*/
                formatter: function() {
                    return '<b>' + this.y + '</b>';
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

    }, SiteSummaryView: function(categories, datas) { /*站点统计*/
        var data = [];
        data = datas;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'total_site_flash',
                type: 'column',
                height: 360,
                width: 490
            },
            credits: {
                enabled: false
            },
            title: {
                text: '站点'
            },
            subtitle: {
                text: ' '
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        color: "green",
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            return this.y;
                        }
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    var point = this.point,
                        s = this.x + ':<b>' + this.y + '</b><br/>';
                    return s;
                }
            },
            series: [{
                name: "网站报道数量统计图",
                data: data,
                color: 'white',
                showInLegend: false}],
                exporting: {
                    enabled: false
                }
            });
        }, InfoSummaryView: function(datas) {/*信息汇总*/
            chartInfo = new Highcharts.Chart({
                chart: {
                    renderTo: "total_faan_flash",
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height: 360,
                    width: 495
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '用户发帖数量统计图'
                },
                tooltip: {
                    formatter: function() {/*鼠标放上去提示*/
                        var str = this.percentage + "";
                        if (str.substring(0, str.indexOf('.'))) {
                            str = str.substr(0, str.indexOf('.')) + str.substr(str.indexOf('.'), 3);
                        }
                        return '<b>' + this.point.name + ' ' + this.y + '篇</b>: (' + str + ' %)';
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        showInLegend: true, /*是否显示横提示(Lable)*/
                        // size: 110, /*饼图显示大小*/
                        slicedOffset: 3,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                var str = this.percentage + "";
                                if (str.substring(0, str.indexOf('.'))) {
                                    str = str.substr(0, str.indexOf('.')) + str.substr(str.indexOf('.'), 3);
                                }
                                return '<b>' + this.point.name + " " + this.y + '篇</b>: (' + str + '%)';
                            }
                        },
                        dataLabels: {
                            distance: 5
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: datas
                }
]
            });
        }
    }

    var StatisticView = Backbone.View.extend({
        initialize: function() {
            Statistic.InitModel();
        }, TimeTrend: function() {
            Statistic.TimeTrendModel.fetch({ data: Statistic.TimeTrendParameter,
                success: function(model, response) {
                    Statistic.TimeTrendView(model.get("data"));
                },
                error: function() {
                    //alert("error:TimeTrend");
                }
            });
        }, SiteSummary: function() {/*网站报道数量统计——柱状图*/
            var set_params = [];
            Statistic.SiteSummaryModel.fetch({ data: Statistic.SiteSummaryParameter,
                success: function(model, response) {
                    Statistic.SiteSummaryView(model.get("names"), model.get("data"));
                },
                error: function() {
                    //alert("error:SiteSummary");
                }
            });
        }, InfoSummary: function() { /*用户发帖数量统计——饼图 */
            Statistic.InfoSummaryModel.fetch({ data: Statistic.InfoSummaryParameter,
                success: function(model, response) {
                    Statistic.InfoSummaryView(model.get("data"));
                },
                error: function() {
                    //alert("error:InfoSummary");
                }
            });

        }
    });
    




    



