/// <reference path="../jslib/backbone/underscore-1.1.6.js" />
/// <reference path="../jslib/backbone/backbone.js" />

$(document).ready(function() {
    $(".qh2 div:first").show();
    $(".qh div:first").show();
    if (EventsCenter.InitModels()) {
        window.appView = new AppView();
    }
});

var evid = $.query.get("eveid");
if (evid == '' || isNaN(evid)) {
    evid = 430
}
/*基础Model*/
var _Model = Backbone.Model.extend({
    initialize: function() {
    },
    url: "Handler/EventsHandler.ashx"
});
/*基础集合*/
var _ModelColl = Backbone.Collection.extend({
    model: _Model,
    url: "Handler/Search.ashx"
});

var EventsCenter = {
    CommanQuery: { "action": "query", "print": "fields", "database": Config.MinZhengNews,
        "text": "", "characters": "300", "predict": "true", "sort": "Date",
        "printfields": "DREDATE,DOMAINSITENAME,AUTHORNAME,SITENAME,DRECONTENT", "display_style": "8",
        "totalresults": "True", "summary": "context", "page_size": "10"
    },
    staticsTotalCount: { "action": "GetQueryTagValues", "database": Config.MinZhengNews, "text": "", "sort": "ReverseDate",
        "FieldName": "DATENUM", "DocumentCount": "true", "mindate": beforeDate(true), "maxdate": beforeDate(false)
    },
    UrlData: { "queryact": "querystr", "act": "initEvent", "eventid": evid },
    /*模版数据*/
    ClueTemp: "<ul><li><h3><%=ClueTime%></h3><p><a href=\"javascript:void(null);\"><%=ClueTitle%></a></p></li>",
    NewsTemp: "<dl><dt><a href=\"<%= href%>\" target=\"_blank\"><%=title%></a></dt><dd><%=content%></dd></dl>",
    AllNewsTemp: "<li><span class=\"right\"><%=time%></span><a href=\"<%=href%>\" target=\"_blank\"><%=title%></a></li>",
    WeiBoTemp: "<dl><dt><span class=\"red_wb\"><%=time%></span><span class=\"colblue\"><%=author%></span><span><%=site%></span></dt><dd><%=content%></dd></dl>",
    EventTemp: "<div class=\"box_01tit\"><span class=\"font12\">观点</span><span class=\"font14\"><%=topid%></span><a href=\"#\"><%=TopicTitle%></a></div><div class=\"top_bg01\"></div><div class=\"box_01nr\"><%=TopicContent%><div class=\"clear\"></div></div><div class=\"top_bg02\"></div>",
    /*Model集合*/
    ZuiXinModels: null,         /*最新报道*/
    ZuiReModels: null,          /*最热报道*/
    WeiBoModels: null,          /*微博*/
    ZhuYaoEventsModels: null,   /*主要观点(事件)*/
    DaoDuModel: null,           /*导读*/
    EventClueModels: null,      /*事件导航*/
    InitCategoryFlash: null,    /*统计图*/
    InitModels: function() {
        this.ZuiXinModels = new _ModelColl();
        this.ZuiReModels = new _ModelColl();
        this.WeiBoModels = new _ModelColl();
        this.ZhuYaoEventsModels = new _ModelColl();
        this.EventClueModels = new _ModelColl();
        this.DaoDuModel = new _Model();
        this.InitCategoryFlash = new _Model();
        return true;
    }
}

/*页面数据页面数据绑定操作*/
var DataBindView = Backbone.View.extend({
    template: _.template(EventsCenter.NewsTemp),
    tempVal: "news",
    clue: function() {
        var arrt = this.model.toJSON();
        for (var item in arrt) {
            var val = unescape(arrt[item]);
            if (item === "ClueTime") {
                val = val.substring(0, 10);
            }
            arrt[item] = val;
        }
        $(this.el).html(this.template(arrt));
        return this;
    },
    news: function() {
        var arrt = this.model.toJSON();
        for (var item in arrt) {
            var val = unescape(arrt[item]);
            if (item == "content" && val.length > 38) {
                arrt[item] = val.substring(0, 36) + "...";
            } else if (item == "title" && val.length > 25) {
                arrt[item] = val.substring(0, 23) + "...";
            } else {
                arrt[item] = val;
            }
        }
        $(this.el).html(this.template(arrt));
        return this;
    }, allNews: function() {
        var arrt = this.model.toJSON();
        for (var item in arrt) {
            var val = unescape(arrt[item]);
            if (item == "time") {
                arrt[item] = val.substr(0, 11);
            } else if (item == "title" && val.length > 25) {
                arrt[item] = val.substring(0, 23) + "...";
            }
            else {
                arrt[item] = val;
            }
        }
        $(this.el).html(this.template(arrt));
        return this;
    }, weiBo: function() {
        var arrt = this.model.toJSON();
        for (var item in arrt) {
            var val = unescape(arrt[item]);
            if (item == "time") {
                arrt[item] = val.substr(0, 11);
            } else {
                arrt[item] = val;
            }
        }
        $(this.el).html(this.template(arrt));
        return this;
    }, eventsTop: function(i) {
        var arrt = this.model.toJSON();
        arrt["topid"] = i;
        for (var item in arrt) {
            var val = unescape(arrt[item]);
            arrt[item] = val;
        }
        $(this.el).html(this.template(arrt));
        return this;
    }
});

var AppView = Backbone.View.extend({
    el: "body",
    events: {
}, initialize: function() {
    /*绑定查询列表返回事件*/
    EventsCenter.ZuiXinModels.bind("reset", this.ResutlZuiXin, this);
    EventsCenter.WeiBoModels.bind("reset", this.ResultWeiBo, this);
    EventsCenter.ZuiReModels.bind("reset", this.ResultZuiRe, this);
    EventsCenter.ZhuYaoEventsModels.bind("reset", this.ResultZhuYaoEvents, this);
    EventsCenter.EventClueModels.bind("reset", this.ResultClue, this);
    this.Init();
}, Init: function() {
    EventsCenter.DaoDuModel.fetch({ data: EventsCenter.UrlData,
        success: function(model, response) {
            $(".read_dd").empty().html(unescape($(model.get("data")).attr("summary")));
            EventsCenter.DaoDuModel.set(EventsCenter.DaoDuModel.get("data"));
            EventsCenter.DaoDuModel.unset("data");
            appView.InitAllNews();
            appView.AllWeiboData();
            appView.InitArticleData();
            appView.InitEventTopic();
            appView.InitEventClue();
            appView.InitCategoryFlash();
            appView.loadbodyImg();
        },
        error: function() {
            alert("error");
        }
    });
}, InitEventClue: function() {
    EventsCenter.EventClueModels.url = "Handler/EventsHandler.ashx";
    EventsCenter.UrlData["act"] = "initClue";
    EventsCenter.EventClueModels.fetch({ data: EventsCenter.UrlData,
        error: function() {
            alert("加载异常");
        }
    });
}, ResultClue: function() {
    $("#eventClue").empty();
    EventsCenter.EventClueModels.each(function(model) {
        var clueView = new DataBindView({ model: model });
        clueView.template = _.template(EventsCenter.ClueTemp);
        $("#eventClue").append(clueView.clue().el);
    });
}, InitAllNews: function() {/*最新报道*/
    EventsCenter.CommanQuery["text"] = unescape(EventsCenter.DaoDuModel.get("keywords"));
    EventsCenter.CommanQuery["page_size"] = "20";
    EventsCenter.ZuiXinModels.fetch({
        data: EventsCenter.CommanQuery,
        error: function() {
            alert("加载最新报道异常");
        }
    });
}, ResutlZuiXin: function() {
    $("#newNewsDiv").empty();
    EventsCenter.ZuiXinModels.each(function(model, i) {
        if (i == 0) {
            if ($("#newsDiv li").length <= 0) {
                $("#newsDiv").empty();
                $("#newsDivR").empty();
            }
        }
        if (model.has("Success")) {
            EventsCenter.ZuiXinModels.remove(model);
        } else {
            if (i < 2) {
                var newsView = new DataBindView({ model: model });
                $("#newNewsDiv").append(newsView.news().el.innerHTML);
            }
            this.appView.AllNews(model); /*显示所有的新闻*/
        }
    });
}, AllWeiboData: function() { /*微博*/
    EventsCenter.CommanQuery["fieldtext"] = "";
    EventsCenter.CommanQuery["database"] = Config.weibodatabase;
    EventsCenter.WeiBoModels.fetch({
        data: EventsCenter.CommanQuery,
        error: function() {
            alert("加载最新微博异常");
        }
    });
}, ResultWeiBo: function() {
    $("#weibodiv").empty();
    var docUl = $("<ul></ul>");
    $("#weibodiv").append(docUl);
    EventsCenter.WeiBoModels.each(function(model, i) {
        if (model.has("Success")) {
            EventsCenter.WeiBoModels.remove(model);
        } else {
            var weiboView = new DataBindView({ model: model });
            weiboView.template = _.template(EventsCenter.WeiBoTemp);
            $("#weibodiv ul").append(weiboView.weiBo().el.innerHTML);
        }
    });
    $("#weibodiv ul").append("<div class=\"gd_bg\"></div>");
    $("#weibodiv").height($(".four_box").height() - 5);
    startmarquee(10, 1000, 'weibodiv');
}, InitArticleData: function() {
    EventsCenter.CommanQuery["page_size"] = "2";
    EventsCenter.CommanQuery["database"] = Config.MinZhengNews;
    EventsCenter.CommanQuery["sort"] = "SAMENUM:numberdecreasing";
    EventsCenter.ZuiReModels.fetch({ data: EventsCenter.CommanQuery, error: function() { alert("加载最热报道异常"); } });
}, ResultZuiRe: function() {
    $("#hotNewsDiv").empty();
    if ($("#newsDiv li").length <= 0) {
        $("#newsDiv").empty();
        $("#newsDivR").empty();
    }
    EventsCenter.ZuiReModels.each(function(model, i) {
        if (model.has("Success")) {
            EventsCenter.ZuiReModels.remove(model);
        } else {
            if (i < 2) {
                var newsView = new DataBindView({ model: model });
                $("#hotNewsDiv").append(newsView.news().el.innerHTML);
            }
            this.appView.AllNews(model);
        }
    });
}, InitEventTopic: function() {/*主要观点*/
    EventsCenter.UrlData["act"] = "initTopic";
    EventsCenter.ZhuYaoEventsModels.url = "Handler/EventsHandler.ashx";
    EventsCenter.ZhuYaoEventsModels.fetch({ data: EventsCenter.UrlData,
        error: function() {
        }
    });
}, ResultZhuYaoEvents: function() {
    EventsCenter.ZhuYaoEventsModels.each(function(model, i) {
        var eventView = new DataBindView({ model: model });
        eventView.template = _.template(EventsCenter.EventTemp);
        $(".four_box").append(eventView.eventsTop(i + 1).el.innerHTML);
    });
}, AllNews: function(model) {
    var allDataBindView = new DataBindView({ model: model });
    allDataBindView.template = _.template(EventsCenter.AllNewsTemp);
    var ihtml = allDataBindView.allNews().el.innerHTML;
    if ($("#newsDiv li").length < 10) {
        $("#newsDiv").append(ihtml);
    } else if ($("#newsDivR li").length < 10) {
        $("#newsDivR").append(ihtml);
    } else {
    }
}, InitCategoryFlash: function() {
    var allX = getCategroute();
    var categrout = [];
    for (var i = 0; i < allX.length; i++) {
        if (i % 6 == 0) {
            categrout[i] = allX[i];
        } else {
            categrout[i] = "";
        }
    }
    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'trend_data_pic',
            type: 'line',
            marginRight: 130,
            marginBottom: 25,
            height: 190,
            width: 630
        },
        title: {
            text: '微博数量统计',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: categrout,
            reversed: true
        },
        yAxis: {
            title: {
                text: ''
            },
            //min: 0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'}]
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b>' +
                                       allX[this.point.x] + '<br/>' + this.y + '篇'// this.y + '篇';
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
            series: []
        });


        EventsCenter.staticsTotalCount["database"] = Config.MinZhengNews;
        EventsCenter.staticsTotalCount["text"] = unescape(EventsCenter.DaoDuModel.get("keywords"));
        $.post("Handler/Search.ashx", EventsCenter.staticsTotalCount, function(data) {
            var timeDate = getTrimeData(data.title, data.datas);
            chart.addSeries({ "name": "新闻", "data": timeDate });
        }, "json");

        EventsCenter.staticsTotalCount["database"] = Config.weibodatabase;
        EventsCenter.staticsTotalCount["text"] = unescape(EventsCenter.DaoDuModel.get("keywords"));
        $.post("Handler/Search.ashx", EventsCenter.staticsTotalCount, function(data) {
            var timeDate = getTrimeData(data.title, data.datas);
            chart.addSeries({ "name": "微博", "data": timeDate });

        }, "json");
    },
    loadbodyImg: function() {
        EventsCenter.UrlData["act"] = "initImg";
        $.post("Handler/EventsHandler.ashx", EventsCenter.UrlData, function(data) {
            //alert(JSON.stringify(data));
            $("#scrollArea ul").empty();
            $("#ul_title").empty();
            $("#num").empty();
            for (var i = 0; i < data.length; i++) {
                if (data[i].ImgType == "1") {
                    //大图
                    $(".mainbody").css("background-image", "url(" + unescape(data[i].ImgPath) + ")");
                } else if (data[i].ImgType == "0") {
                    //小图
                    $("#scrollArea ul").append("<li><a href=" + unescape(data[i].ImgUrl) + " target='_blank'><img src=" + unescape(data[i].ImgPath) + " /></a></li>");
                    $("#ul_title").append("<h2><a href=" + unescape(data[i].ImgUrl) + " target='_blank'>" + unescape(data[i].ImgTitle) + "</a></h2>");
                    var len = $("#num li").length;
                    $("#num").append("<li>" + (len + 1) + "</li>");
                } else if (data[i].ImgType == "2") {
                    //背景
                    $("body").css("background-image", "url(" + unescape(data[i].ImgPath) + ")");
                }
            }
            Flash.rendy();
        }, "json");
    }
});

function getCategroute() {
    var result = [];
    var count = 0;
    var mode = { "y": "/", "M": "/", "d": "" };
    for (var i = 0; i <= 30; i++) {
        result[i] = getAddTime(i, mode);
    }
    return result.reverse();
}
function getTrimeData(cata, data) {
    var d = new Date();
    var resData = [];
    var days = 24 * 3600 * 1000;
    var count = 0;
    var mode = { "y": "", "M": "", "d": "" };
    for (var i = 0; i <= cata.length; i++) {
        while (true) {
            if (count > 30) break;
            if (getAddTime(count, mode) == cata[i]) {
                resData[count] = data[i];
                count++;
                break;
            } else {
                resData[count] = 0;
                count++;
            }
        }
    }
    return resData.reverse();
}

function getAddTime(addDay, model) {
    var dtime = new Date()
    dtime.setTime(dtime.getTime() - (30 - addDay) * 24 * 3600 * 1000);
    //dtime.setTime(dtime.getTime() + (addDay * 24 * 3600 * 1000));
    var y = dtime.getFullYear();
    var m = dtime.getMonth() + 1;
    var d = dtime.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    return y + model.y + m + model.M + d + model.d;

}

function beforeDate(isBefore) {
    var d = new Date();
    if (isBefore) {
        d.setTime(d.getTime() - 30 * 24 * 3600 * 1000);
    }
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}


(function() {
    //
    var root = this;
    var ImgFlash = root.Flash;
    var Flash;
    if (typeof exports !== 'undefined') {
        Flash = exports;
    } else {
        Flash = root.Flash = {};
    }

    Flash.c = 0; //当前第几个
    Flash.n = 0; //图片张数
    Flash.wid; // 重复序列
    Flash.autoPlay = function() {
        Flash.c++ //指向下张图  
        if (Flash.c >= Flash.n) Flash.c = 0   //循环回去
        $($("#num li")[Flash.c]).addClass("current")  //设置当前
        $($("#num li")[Flash.c]).siblings().removeClass("current")
        $($("#scrollArea li")[Flash.c]).fadeTo(300, 1)
        $($("#scrollArea li")[Flash.c]).siblings().hide()
        $($("#focus h2")[Flash.c]).show()
        $($("#focus h2")[Flash.c]).siblings("h2").hide()
    }
    Flash.rendy = function() {
        Flash.n = $("#num li").size() //图片张数
        $("#num li:first").addClass("current")
        $("#scrollArea li:first").show()
        $("#focus h2:first").show()
        $("#num li").css("right", function(i) { return (Flash.n - i) * 18 })

        $("#num li").hover(function() {
            window.clearInterval(Flash.wid)   //停止序列
            $(this).addClass("current")
            $(this).siblings().removeClass("current")
            Flash.c = $(this).index()
            $($("#scrollArea li")[Flash.c]).fadeTo(300, 1)
            $($("#scrollArea li")[Flash.c]).siblings().hide()
            $($("#focus h2")[Flash.c]).show()
            $($("#focus h2")[Flash.c]).siblings("h2").hide()

        }, function() { Flash.wid = window.setInterval(Flash.autoPlay, 3000) } //鼠标拿开重新设置序列
	)
        Flash.wid = window.setInterval(Flash.autoPlay, 3000)  //启动自动播放函数
    }
}).call(this);