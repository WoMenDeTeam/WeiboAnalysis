/**
*Staticits.Path:JSON文件路径
*Staticits.MainID:话题ID
*/
//初始化页面绑定-事件
(function () {
    var root = this;
    var Staticits;
    if (typeof exports !== 'undefined') {
        Staticits = exports;
    } else {
        Staticits = root.Staticits = {};
    }
    Staticits.IdolParameter = { "action": "GetQueryTagValues", "FieldName": "Gender", "Text": "*", "databasematch": Config.IdolDataBase["newweibo"], "documentcount": "true", "FieldText": "MATCH{2303339,2280172}:DREREFERENCE" };
    Staticits.HanderUrl = "../../Handler/WeiboStatistics.ashx";
    Staticits.MainID = "48";
    /*JSON路径*/
    Staticits.Path = "20120921/";
    Staticits.JsonData = {};
    Staticits.host = Config.IdolDataBase["host"]; //"http://123.103.15.153:8388/json/" 
    Staticits.bindID = ".pageBar";
    Staticits.upPage = 1;
    Staticits.isLoadRay = true;
    /*初始化页面事件*/
    Staticits.LoadEvent = function () {
    }
    /*文件地址*/
    Staticits.GetURL = function (filds) {
        Staticits.MainID = "48";
    }
    Staticits.GetJSONFilds = function (fildpath, fildName, calback) {/*返回Json数据*/
        var url = Staticits.host + "jsonfile.aspx?fileName=" + fildpath + "&jsonName=" + fildName + "&jsoncallback=?";
        //alert(url);
        $.getJSON(url, function (data) {
            //  alert("OK");
            Staticits.JsonData = data;
            calback(data);
        });
    }
    Staticits.GetAjaxSql = function (manid, callback) { /*获取话题相关搜索微博*/
        $.post(Staticits.HanderUrl, { "manid": manid, "act": "sql" }, callback, "json");
    }
    Staticits.GetAjaxIdol = function (callback) { /*获取IDOL数据*/
        $.post(Staticits.HanderUrl, Staticits.IdolParameter, function (data) {
        }, "json");
    }
    Staticits.LoadingImg = function (domID) {
        $(domID).empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
    }
    //地区关注排行（单位：转发次数）
    Staticits.TopCity = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, TopCityRanking);
    }
    //按粉丝数-转发量统计排行
    Staticits.FollowCount = function (jsonfile) {
        var data = this.GetJSONFilds(Staticits.Path, jsonfile, FollowNumRanking);
    }
    //转发层级人数统计
    Staticits.Hierarchy = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, HierarchyRanking);
    }
    Staticits.TimeTrend = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, TimeTrend);
    }
    Staticits.EffectAnalysis = function (jsonfile, isval) {
        WeiboStatistics.CommunicationPath(Staticits.Path, jsonfile);
    }
    //用户身份分析 (是否+V)
    Staticits.UserIdentityAnalysis = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, UserIdentityAnalysisPid);
    }
    //性质分析
    Staticits.NatureAnalysis = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, NatureAnalysis);
    }
    Staticits.ForwardingSort = function (jsonfile) {
        this.GetJSONFilds(Staticits.Path, jsonfile, ForwardingSort);
    }
    //性别分析
    Staticits.GenderAnalysis = function () {
        Staticits.IdolParameter.FieldName = "GENDER";
        function callback(data) {
            Staticits.IdolParameter.FieldText = "MATCH{" + data.data.join(",") + "}:DREREFERENCE";
            Staticits.IdolParameter["act"] = "idol";
            Staticits.GetAjaxIdol("");
        }
        Staticits.GetAjaxSql(Staticits.MainID, callback);
    }
    Staticits.getBlack = function () {
        $("#blackPage").click(function () {
            Top.loadPersonalDetailsPage('topicList.html', 1, Staticits.upPage)
        });
    }

    Staticits.SourceTypeAnalysis = function () {
        Staticits.IdolParameter.FieldName = "SITENAME";
    }
    Staticits.ShortData = [];
    Staticits.ShortArray = [];
    //上下页
    Staticits.pageCount = 1;
    Staticits.pageSize = 10;
    //向后 按钮
    Staticits.Next = function () {
        $("#next").click(function () {
            var $v_show = $("#user_list");
            var $v_content = $("#user_content");
            var v_width = $v_content.width();
            var len = $v_show.find("li").length;
            var page_count = Math.ceil(len / Staticits.pageSize);
            if (!$v_show.is(":animated")) {
                if (Staticits.pageCount == page_count) {
                } else {
                    $v_show.animate({ left: '-=' + v_width }, "slow");
                    Staticits.pageCount++;
                }
                $("#pageInfo").empty().append(Staticits.pageCount + "/" + page_count);
            }
        });
    }
    Staticits.Prev = function () {
        $("#prev").click(function () {
            var $v_show = $("#user_list");
            var $v_content = $("#user_content");
            var v_width = $v_content.width();
            var len = $v_show.find("li").length;
            var page_count = Math.ceil(len / Staticits.pageSize);
            if (!$v_show.is(":animated")) {
                if (Staticits.pageCount == 1) {
                } else {
                    $v_show.animate({ left: '+=' + v_width }, "slow");
                    Staticits.pageCount--;
                }
                $("#pageInfo").empty().append(Staticits.pageCount + "/" + page_count);
            }
        });
    }
}).call(this);

var WeiboStatistics = {
    CommunicationPath: function (fildpath, fildName) {
        $("#chuanbolujing object").remove();
        var url = "" + fildpath + "&host=" + Staticits.host;
        WeiboStatistics.loadPath(url);
    },
    loadPath: function (url) {

        var html = [];
        html.push("<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" id=\"demos\" name=\"demos\" codebase=\"http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab\" height=\"488px\" width=\"590px\">");
        html.push("<param name=\"movie\" value=\"../../flash/demos.swf?r=''\">");
        html.push("<param name=\"quality\" value=\"high\">");
        html.push("<param name=\"bgcolor\" value=\"#ffffff\">");
        html.push("<param name=\"allowNetworking\" value=\"all\">");
        html.push("<param name=\"allowScriptAccess\" value=\"always\">");
        html.push("<param name=\"allowNetworking\" value=\"all\">");
        html.push("<param name=\"flashVars\" value=\"statuePath=http://tp1.sinaimg.cn/&dataUrl=../../Handler/JsonServer.ashx?fileid=" + url + "&pageUrl=http://www.doodod.com/doodod/upload\">");
        html.push("<param name=\"width\" value=\"590px\">");
        html.push("<param name=\"height\" value=\"488px\">");
        html.push("<embed src=\"../../flash/demos.swf\" quality=\"high\" bgcolor=\"#ffffff\"  play=\"true\" loop=\"false\" allowscriptaccess=\"all\" allownetworking=\"all\" flashvars=\"statuePath=http://tp1.sinaimg.cn/&dataUrl=../../Handler/JsonServer.ashx?fileid=" + url + "&pageUrl=http://www.doodod.com/doodod/upload\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer\" align=\"middle\" height=\"488px\" width=\"590px\">");
        html.push("</object>");
        $("#chuanbolujing").empty().append(html.join(""));
    }
}
//地区关注排行（单位：转发次数）
function TopCityRanking(datas) {
    $("#chuanbodiyu").empty();
    $('#chuanbodiyu').each(function (index, node) {
        var data = {};
        var provinceView = new shu.ProvinceView(node);
        var options = { tips_name: "转发数量" };
        if (datas.data) {
            provinceView.render(datas.data, options);
        }
    });
}

//按粉丝数 - 转发量统计排行
function FollowNumRanking(datas) {
    var xtitle = ["<50", "<100", "<200", "<500", "<1k", "<5k", "<50k", "<1W", "10W+"];
    var nXtitle = [];
    for (var i = 0; i < datas.repostsName.length; i++) {
        nXtitle.push(xtitle[i]);
    }

    var repostsColor = ["#4572a7", "#4572a7", "#4572a7", "#4572a7", "#4572a7", "#4572a7", "#4572a7", "#4572a7", "#4572a7"];
    for (var i = 0; i < datas.repostsData.length; i++) {
        clmColor = datas.repostsData[i].color;
        datas.repostsData[i]["color"] = eval('(' + clmColor + ')');
    }
    var data = [];
    data = datas;
    var follwChart;
    follwChart = new Highcharts.Chart({
        chart: {
            renderTo: 'fensirenshu',
            type: 'column',
            height: 220
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: nXtitle
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
                    formatter: function () {
                        return this.y + "人";
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return this.x + ':<b>' + '转发' + this.y + '次</b><br/>';
            }
        },
        series: [{
            name: "粉丝",
            data: datas.repostsData,
            showInLegend: true
        }
]
    });
}
//转发层级人数统计
function HierarchyRanking(datas) {
    var hierarchyChart;
    hierarchyChart = new Highcharts.Chart({
        chart: {
            renderTo: 'zhuanfacengji',
            height: 220,
            type: "line"
        },
        credits: {
            enabled: false
        },
        title: {
            text: '　'
        },
        xAxis: {
            categories: datas.repostsName,
            labels: {
                style: {
                    color: "#333333",
                    fontFamily: "",
                    fontSize: "12px"
                }
            }
        },
        yAxis: {
            title: {
                text: ' '
            },
            min: 0
        },
        plotOptions: {
            series: {
                lineWidth: 3, //线条宽度
                color: "#4572a7", //线条颜色
                marker: {
                    radius: 6, //点大小
                    color: "#E95613"
                },
                dataLabels: {
                    staggerLines: 3,
                    enabled: true,
                    color: "#333333", //峰值颜色(文字颜色)
                    formatter: function () {
                        return "<b class=\"color_2\">" + this.y + "</b>";
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return this.x + "：转发<b class=\"color_2\">" + this.y + "</b>次<br/>";

            }
        },
        series: [{
            name: "每级转发",
            data: datas.repostsData
        }
],
        exporting: {
            enabled: false
        }

    });

}
var _highchart = "ok";
//时间趋势图 Time trend
function TimeTrend(datas) {
    var data = datas.data;
    var minD = data[0].x;
    var maxD = data[0].x + (1000 * 3600 * 24 * 1);
    var l = data.length;
    var maxD2 = data[l - 2].x;
    Highcharts.setOptions({/*时间趋势图*/
        lang: {
            rangeSelectorZoom: "缩放",
            rangeSelectorFrom: "从",
            rangeSelectorTo: "至"
        },
        global: {
            useUTC: false
        }
    });

    _highchart = new Highcharts.StockChart({
        chart: {
            renderTo: "chuanboqushi",
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
                    formatter: function () {
                        var v = 1;
                        if (this.y > 0 && this.y < 1) {
                            v = 1;
                        } else {
                            v = parseInt(this.y);
                        }
                        return v > 0 ? v : ""; //单位
                    },
                    y: -12
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        rangeSelector: {
            selected: 1
        },
        title: {
            text: ' '
        },
        scrollbar: {
        },
        rangeSelector: {
            inputEnabled: true,
            enabled: true,
            buttons: [
                   { type: 'day', count: 1, text: '1天' },
                   { type: 'week', count: 1, text: '1周' },
                   { type: 'month', count: 1, text: '1月' },
                   { type: 'month', count: 3, text: '3月' },
                   { type: 'month', count: 6, text: '半年' },
                   { type: 'all', text: '所有'}],
            inputDateFormat: "%Y-%m-%d",
            inputPosition: { align: "right" },
            selected: 0
        },
        navigation: {
            buttonOptions: {
                align: "right"
            }
        },
        navigator: {/*数据块移动*/
            enabled: true,
            xAxis: {
                min: minD,
                // max: maxD,
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
            allowDecimals: false,
            type: 'datetime',
            min: minD,
            max: maxD,
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
            allowDecimals: false,
            labels: {
                x: -1
            },
            minorTickWidth: 10,
            minPadding: 10,
            //maxPadding: 1, /*设置刻度大小*/
            maxZoom: 10, /*设置刻度大小*/
            min: 0

        },
        tooltip: {/*鼠标放上去 提示框*/
            formatter: function () {
                var showY = this.y > 0 ? parseInt(this.y) : this.y < 1 ? 1 : 0;
                return "转发：<b class=\"color_2\">" + showY + "</b><br/>时间：<b class=\"color_2\">" + getLocalTime(this.x) + "</b>";
            }
        },
        series: [{
            name: 'AAPL Stock Price',
            data: data,
            index: 20,
            tooltip: {
                valueDecimals: 2
            }, marker: {
                enabled: true,
                radius: 3
            }
        }]
    });
    _highchart.xAxis[0].max = maxD2;

}
function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
//用户分析饼图
function UserIdentityAnalysisPid(datas) {
    var repostsColor = ["#4572a7", "#E95613"];
    var data = [["+V用户", datas.total_vip], ["普通用户", (datas.total_reposts - datas.total_vip)]];
    var userChart;
    userChart = new Highcharts.Chart({
        chart: {
            renderTo: 'yonghuleixing',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        colors: [           /*修改饼图颜色*/
            '#AA4643',
	        '#4572A7'],
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: ' '
        },
        tooltip: {
            formatter: function () {
                return this.point.name + '<b>' + Math.round(this.percentage) + '</b>%';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: 20, /*文字与饼图距离*/
                    color: null, /*饼图颜色*/
                    formatter: function () {
                        return '<b>' + Math.round(this.percentage) + '</b>%'; /*this.point.name*/
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '用户+V分析',
            data: data
        }
]
    });
}
function ForwardingSort(data) {
    var d = data.data;
    var html = [];

    html.push("<li><b class='num'>排名</b> <b class='name'>昵 称</b> <b class='type'>用户类型</b> <b class='fan'>粉丝</b> <b class='forwarding'>转发量</b> <b class='two'>二次转发</b> <b class='date'>发布时间</b></li>");
    if (data && data.data) {
        for (var i = 0; i < 10; i++) {
            var li = "";
            if (i < 3)
                li = "<li><span class='num hot'>" + (i + 1) + "</span> <span class='name'>" + d[i].NickName + "</span> <span class='type'>" + d[i].UserType + "</span> <span class='fan'>" + d[i].FansCount + "</span> <span class='forwarding'>" + d[i].Forward + "</span> <span class='two'>" + d[i].TwoForward + "</span> <span class='date'>" + d[i].ReleaseTime + "</span> </li>"
            else
                li = "<li><span class='num'>" + (i + 1) + "</span> <span class='name'>" + d[i].NickName + "</span> <span class='type'>" + d[i].UserType + "</span> <span class='fan'>" + d[i].FansCount + "</span> <span class='forwarding'>" + d[i].Forward + "</span> <span class='two'>" + d[i].TwoForward + "</span> <span class='date'>" + d[i].ReleaseTime + "</span> </li>"
            html.push(li);
        }
    }
    $("#statistics_list").empty().append(html.join(""));
}

//微博性质分析
function NatureAnalysis(data) {
    // alert(JSON.stringify(data));
    var natureChart;
    natureChart = new Highcharts.Chart({
        chart: {
            renderTo: 'taiduqingxiang',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        colors: [                   /*修改饼图颜色*/
	        '#89A54E',
	        '#4572A7',
            '#AA4643'],
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: ' '
        },
        tooltip: {
            formatter: function () {
                return this.point.name + '<b>' + Math.round(this.percentage) + '</b>%';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: 20, /*文字与饼图距离*/
                    color: null,
                    formatter: function () {
                        return '<b>' + Math.round(this.percentage) + '</b>%'; /*this.point.name*/
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '态度倾向分析',
            data: data.data
        }
]
    });
}

//var root;
////传播图
//function EffectAnalysis(json) {
//    Staticits.ShortData.length = 0;
//    root = json;
//    function collapse(d) {
//        if (d.children) {
//            d.children.forEach(collapse);
//        }
//        Staticits.ShortData.push(d);
//    }
//    root.children.forEach(collapse);
//    update(root);
//}

//function ShortInfo(d) {

//    var data = Staticits.ShortData;
//    var len = data.length;
//    if (Staticits.isLoadRay)
//        for (var i = 0; i < len; i++) {
//            for (var j = (i + 1); j < len; j++) {
//                if (data[i].name == data[j].name) {
//                    data.splice(j, 1);
//                    len--;
//                    continue;
//                }
//                if (parseInt(data[i].reposts_count) < parseInt(data[j].reposts_count)) {
//                    var temp = data[i];
//                    data[i] = data[j];
//                    data[j] = temp;
//                }
//            }
//        }
//    Staticits.ShortData = data;
//    var info = [];
//    info.push("<ul>");
//    for (var k = 0; k < data.length; k++) {
//        var d = data[k];
//        info.push("<li  >");
//        info.push("<span class=\"img\" onmouseover=\"test100();\" onmouseout=\"disShow();\"><img  onclick='alert(2)'   src='" + d.profile_image_url + "' /></span>");
//        info.push("</li>");
//    }
//    info.push("</ul>");
//    $("#UserInfo .user_list").append(info.join(""));
//    var liLen = $(".user_list li").length
//    $("#pageInfo").empty().append("1" + "/" + Math.ceil(liLen / Staticits.pageSize));
//    $("#UserInfo").show();
//}
//var duration = 1000;
//var radius = 720 / 2;
//var vis;
//var xy = d3.geo.albers();
//function update(source) {
//    Staticits.ShortData.length = 0;
//    $("#UserInfo .v_content_list").empty();
//    $("#chuanbolujing").empty();

//    var tree = d3.layout.tree()
//                     .size([360, radius])
//                     .separation(function (a, b) {  //此函数用于计算node之间的距离。具体算法有待调整。
//                         var repost = Math.abs(a.reposts_count - b.reposts_count);
//                         if (repost < 300) {
//                             return (a.parent == b.parent ? 1 : 2) / a.depth;
//                         }
//                         else {
//                             return repost / 270;
//                         }
//                     });
//    var diagonal = d3.svg.diagonal.radial()
//                        .projection(function (d, i) {
//                            return [d.y, d.x / 180 * Math.PI];
//                        });

//    vis = d3.select("#chuanbolujing").append("svg")
//                    .attr("width", radius * 2)
//                    .attr("height", radius * 2)
//                    .attr("transform", "translate(" + radius + "," + radius + ")") //rotate(" + radius + ", " + radius + ")");
//                    .attr("viewBox", "-360 -360 720 720")
//                    .call(d3.behavior.zoom()
//                    .on("zoom", redraw))
//                     .append("g")
//                     .attr("transform", "translate(" + 0 + "," + 0 + ")");
//    var nodes = tree.nodes(root);
//    var link = vis.selectAll("path.link")
//                    .data(tree.links(nodes))
//                    .enter().append("path")
//                    .attr("class", "link")
//                    .attr("d", diagonal);

//    var node = vis.selectAll("g.node")
//                    .data(nodes)
//                    .enter().append("g")
//                    .attr("class", "node")
//                    .attr("transform", function (d) {
//                        if (d.reposts_count && d.reposts_count > 0) {
//                            Staticits.ShortData.push(d);
//                        }
//                        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
//                    });
//    ShortInfo("");
//    var topindex = 0;
//    node.append("circle")
//            .attr("r", function (d) {
//                if (d._children && d._children.length > 0) {
//                    return 5;
//                } else {
//                    return 1;
//                }
//            })
//            .on("click", treeClick)
//            .on("mouseover", teamover)
//.on("mouseout", teamout);
//    topindex = 0;
//    node.append("text")
//            .attr("dy", ".31em")
//            .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
//            .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
//            .text(function (d) {
//                if (d.reposts_count && d.reposts_count >= Staticits.ShortData[10].reposts_count) {
//                    if (topindex < 10) {
//                        topindex++;
//                        return d.name;
//                    }
//                }
//            });
//}
//function treeClick(d) {
//    if (d.children) {
//        d._children = d.children;
//        d.children = null;
//    } else {
//        d.children = d._children;
//        d._children = null;
//    }
//    update(d);
//}
//var divx;
//var divy;
//if (navigator.appName == 'Netscape') {
//    document.onmousemove = function (e) {
//        e = jQuery.event.fix(e);
//        divx = e.pageX;
//        divy = e.pageY;
//    }
//}

//function redraw() {
//    xa = d3.event.translate;
//    vis.attr("transform", "translate(" + xa + ")scale(" + d3.event.scale + ")");
//}

////鼠标事件 传播图
//function teamover(d, e) {
//    if (!(navigator.appName == "Netscape")) {
//        divx = window.event.clientX;
//        divy = window.event.clientY;
//        divy += document.documentElement.scrollTop;
//    }
//    if ($("#" + d.name).length > 0) {
//        $("#" + d.name).show();
//    } else {
//        var tooltip = this.tooltip;

//        divy += 3;
//        divx += 3;
//        var _div = $("<div class='userMsg' id='" + d.name + "'></div>");
//        _div.css("top", divy + "px").css("left", divx + "px").addClass("addClass")
//    .html("<span class=\"img\"><img src='" + d.profile_image_url +
//    "' /></span><span class=\"text\"><b>" + d.name + "" + "</b><br />粉丝：<b class=\"color_2\">" + d.followers_count
//    + "</b><br/>转发：<b class=\"color_2\">" + d.reposts_count + "</b></span><span class=\"clear\"></span>").hover(
//    function () { clearTimeout(closeSettime); $(this).show() }, function () { $(this).hide(); });
//        $("#userdivs").append(_div);
//    }
//}
//var closeSettime = setTimeout;
//function teamout(d) {
//    var _id = "#" + d.name;
//    closeSettime = setTimeout(" $(\"" + _id + "\" ).hide()", 3000);
//}

//function checkBrowser() {
//    var maxBrowser = { "IE": 9.0, "FF": 13.0 }
//    var isIE = $.browser.msie;
//    var isFF = $.browser.mozilla;
//    var browserType = "";
//    var version = $.browser.version;
//    if (isIE) {
//        browserType = "IE";
//    }
//    if (isFF) {
//        browserType = "FF";
//    }
//    return version >= maxBrowser[browserType];
//}

//
//add for flash wheel event Start
//var type = -1;
//function disable_wheel(a) {

//    if (document.addEventListener) {
//        document.addEventListener('DOMMouseScroll', scrollFunc, false);
//    } //W3C
//    window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome

//}
//function scrollFunc(evt) {
//    try {
//        var value = 0;

//        evt = evt || window.event;
//        if (evt.wheelDelta) {//IE/Opera/Chrome 
//            value = evt.wheelDelta;
//            evt.cancelBubble = true;
//            evt.returnValue = false;
//            type = 0;
//            evt.target.flash_zoom(value, type);
//        } else if (evt.detail) {//Firefox 
//            value = evt.detail;
//            type = 1;
//            evt.preventDefault();
//            evt.stopPropagation();
//            document["demos"].flash_zoom(value, type);
//        }
//    } catch (e) {

//    }
//    return false;
//}

//function enable_wheel() {
//    //alert("ok");
//    if (document.removeEventListener) {
//        document.removeEventListener('DOMMouseScroll', scrollFunc, false);
//    } //W3C
//    window.onmousewheel = document.onmousewheel = null; //IE/Opera/Chrome

//}
//add for flash wheel event  End// <reference path="../../Handler/chartImg.ashx" />

var ChartToJpe = {
    Init: function () {
        $("#diqusvg_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("chuanbodiyu") });
        $("#taiduqingxiang_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("taiduqingxiang") });
        $("#yonghuleixing_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("yonghuleixing") });
        $("#chuanboqushi_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("chuanboqushi") });
        $("#fensirenshu_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("fensirenshu") });
        $("#zhuanfacengji_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("zhuanfacengji") });
        $("#chuanbolujing_a").unbind("click").bind("click", function () { ChartToJpe.saveAjax("chuanbolujing") });
    },
    saveAjax: function (docId) {
        var svg = ChartToJpe.getSvg(docId);
        var data = { "type": "image/jpeg", "svg": svg, "filename": "test", "width": "300" };
        $.ajax("../../Handler/chartImg.ashx", {
            data: data,
            type: "POST",
            dataType: "JSON",
            success: function (d) {
                if (d.success == 1) {
                    Material.refreshList();
                    alert("添加素材成功!");
                }
            }
        });
    },
    getSvg: function (docId) {

        var svg = document.getElementById(docId).innerHTML;
        if (docId != "chuanbodiyu") {
            svg = document.getElementById(docId).children[0].innerHTML;
        }
        if (docId == "chuanboqushi") {
            svg = document.getElementById(docId).children[1].innerHTML;
        }
        svg = svg
			.replace(/zIndex="[^"]+"/g, '')
			.replace(/isShadow="[^"]+"/g, '')
			.replace(/symbolName="[^"]+"/g, '')
			.replace(/jQuery[0-9]+="[^"]+"/g, '')
			.replace(/isTracker="[^"]+"/g, '')
			.replace(/url\([^#]+#/g, 'url(#')
			.replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')
			.replace(/ href=/g, ' xlink:href=')
			.replace(/\n/, ' ')
			.replace(/<\/svg>.*?$/, '</svg>')
			.replace(/&nbsp;/g, '\u00A0')
			.replace(/&shy;/g, '\u00AD')
        // IE specific
			.replace(/<IMG /g, '<image ')
			.replace(/height=([^" ]+)/g, 'height="$1"')
			.replace(/width=([^" ]+)/g, 'width="$1"')
			.replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>')
			.replace(/id=([^" >]+)/g, 'id="$1"')
			.replace(/class=([^" ]+)/g, 'class="$1"')
			.replace(/ transform /g, ' ')
			.replace(/:(path|rect)/g, '$1')
			.replace(/style="([^"]+)"/g, function (s) {
			    return s.toLowerCase();
			});
        // IE9 beta bugs with innerHTML. Test again with final IE9.
        svg = svg.replace(/(url\(#highcharts-[0-9]+)&quot;/g, '$1')
			.replace(/&quot;/g, "'");
        if (svg.match(/ xmlns="/g).length === 2) {
            svg = svg.replace(/xmlns="[^"]+"/, '');
        }
        return svg;
    }
}



function weiBoStatisTicsInit(params) {
    $("#chakanpinglun_a").unbind().bind("click", function () {
        Top.ToChaKanPingLun("reItem.html", params["topicid"], params["name"], params["page"]);
    });
    var reg = /^\d+$/;
    var topicid = params["topicid"];
    var topicName = params["name"];
    var uppage = params["page"];
    if (reg.test(uppage)) { Staticits.upPage = uppage; }
    if (!reg.test(topicid)) { return; }
    $("#topicName").html(topicName);
    Staticits.Path = topicid; //+ "/";
    $("dd").click(function () {
        $("dd").removeClass();
        $(this).addClass("on");
    });
    Staticits.Hierarchy(Config.JsonFileName["level"]);
    //    //传播路径分析
    Staticits.EffectAnalysis(Config.JsonFileName["newrayjson"], true);
    //    ////Staticits.EffectAnalysis(Config.JsonFileName["rayjson"], false);
    //    //传播地域分析
    Staticits.TopCity(Config.JsonFileName["province"]);
    //    //chuanbodiyu
    //    //粉丝人数分析
    Staticits.FollowCount(Config.JsonFileName["follow"]);
    //    //    //传播趋势分析
    Staticits.TimeTrend(Config.JsonFileName["timetend"]);
    $("#gender_analysis_a").click(function () {
        Staticits.GenderAnalysis();
    });
    //    //用户+V分析
    Staticits.UserIdentityAnalysis(Config.JsonFileName["timetend"]);
    //    //态度倾向分析
    Staticits.NatureAnalysis(Config.JsonFileName["emotionResult"]);
    Staticits.ForwardingSort(Config.JsonFileName["ForwardingSort"]);
    //    //默认
    Staticits.getBlack();

    ChartToJpe.Init();
    Material.Init();
};
