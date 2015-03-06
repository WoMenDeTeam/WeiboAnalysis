/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />
/// <reference path="../cloud/jquery.3DTagCloud.js" />

Date.prototype.addDay = function (val) {
    var ns = this.getTime();
    var ps = val * 1000 * 60 * 60 * 24;
    var nS = ns;
    nS = ns + ps;
    return new Date(parseInt(nS));
}

var HotWord = {
    data: [],
    isLoad: false,
    hotwordnum: 0,
    Init: function () {
        var today = new Date();
        var d = today.getDate();
        var M = today.getMonth();
        var y = today.getFullYear();
             var w = today.getDay() - 1;
        
        HotWord.ShowData(y, M, d, w);
        var week = HotWord.GetOfYellWeek();
        $("#week_b").html(week);
        $("#years_b").html(y);
        HotWord.InitEvent();
        HotWord.MyJson();
        $dp.hide = function () { };
    },
    InitEvent: function () {
        $("#submit_serach").unbind().bind("click", HotWord.MyJson);
    }, MyJson: function () {
        var url = HotWord.GetHotUrl();
        $.ajax(url, {
            type: "get",
            dataType: "json",
            success: function (data) {
                HotWord.DataToDocument(data);
            }, error: function () {
                $("#rankList").empty().append("暂无数据");
                $("#rankRight").empty().append("暂无数据");
            }
        });
    }, DataToDocument: function (data) {
        HotWord.data = data.data;
        $("#rankList").empty();
        $("#rankRight").empty();
        var docUl = [];
        var docRight = [];
        docUl.push("<ul>");
        docRight.push("<ul>");
        for (var i = 0; i < HotWord.data.length; i++) {
            var num = (i + 1 < 10) ? "0" + (i + 1) : (i + 1);
            var weiboTrend = HotWord.data[i].weiboTrend;
            var paihangTrend = HotWord.data[i].paihangTrend;
            var weibo = weiboTrend < 0 ? "↓" : weiboTrend > 0 ? "↑" : "";
            var paihang = paihangTrend < 0 ? "↓" : paihangTrend > 0 ? "↑" : "";
            if (i < 20) {
                if (i < 3) {
                    docUl.push("<li><span class=\"num hot\">");
                } else {
                    docUl.push("<li><span class=\"num\">");
                }
                docUl.push(num);
                docUl.push("</span>");
                docUl.push("<span class=\"text\">");
                docUl.push(HotWord.data[i].text);
                docUl.push(paihang);
                docUl.push("</span>");
                docUl.push("</span> <code>微博：<b class=\"color_2\">");
                docUl.push(HotWord.data[i].weight);
                docUl.push(weibo);
                docUl.push("</b></code> </li>");
            } else {
                docRight.push("<li><span class=\"num\">");
                docRight.push(num);
                docRight.push("</span>");
                docRight.push("<span class=\"text\">");
                docRight.push(HotWord.data[i].text);
                docRight.push(paihang);
                docRight.push("</span>");
                docRight.push("</span> <code>微博：<b class=\"color_2\">");
                docRight.push(HotWord.data[i].weight);
                docRight.push(weibo);
                docRight.push("</b></code> </li>");
            }
        }
        docUl.push("</ul>");
        docRight.push("</ul>");
        $("#rankList").append(docUl.join(""));
        $("#rankRight").append(docRight.join(""));

        HotWord.LoadCloud();
    },
    GetHotUrl: function () {
        var d = $("#custom_start_time").val();
        var fileName = d.split('-')[0] + $("#week_txt").val();
        var url = Config.HotWordPath + fileName + ".json";
        return url;
    }, GetOfYellWeek: function () {
        var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth(); //getMonth()是从0开始
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
        result += 1;
        var s = parseInt(result / 7);
        var m = result % 7;
        if (m != 0) {
            s = s + 1;
        }
        if (s < 10) {
            s = "0" + s;
        }
        return s;
    }, LoadCloud: function () {
        $("#container3").empty();
        var newid = "hotword" + HotWord.hotwordnum;
        $("#container3").append("<div id=\"" + newid + "\"></div>")
        var cloudEL = [];
        cloudEL.push("<ul>");
        var historyWeight = 40;
        var fsize = 40;
        var fj = 3;
        for (var i = 0; i < HotWord.data.length; i++) {
            if (HotWord.data[i].weight != historyWeight) {
                if (i < 10) {
                    fj = 40;
                } else if (i < 20) {
                    fj = 32;
                } else if (i < 30) {
                    fj = 24;
                } else {
                    fj = 18;
                }
                fsize = fj; //40 - fj;
            }
            cloudEL.push("<li style=\"font-size: " + fsize + "px;\"><a style=\"font-size: " + fsize + "px;\" href=\"javascript:void(0)\" rel=\"" + HotWord.data[i].weight + "\">" + HotWord.data[i].text + "</a></li>");
        }
        cloudEL.push("</ul>");

        $("#container3 #" + newid).append(cloudEL.join(""));
        //$("#container3").tagcloud({ centrex: 350, centrey: 180, init_motion_x: 10, init_motion_y: 10 });
        $("#container3 #" + newid).tagCloud({ randomColor: true, speed: 3, radius: 250 });
        //HotWord.hotwordnum += 1;

        //setInterval($.fn.tagCloud.update, 1000);

        //$("#container3").jQCloud(HotWord.data);
    }, RandomColor: function () {
        var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
        var r = "";
        for (var i = 0; i < 6; i++) {
            var n = parseInt(Math.random() * 16);
            r += a[n].toString();
        }
        return r;

    }, myDateFun: function () {
        var newDay = { "一": 0, "二": 1, "三": 2, "四": 3, "五": 4, "六": 5, "日": 6 };

        
       
        var w = newDay[$dp.cal.getP('D')];
        var y = $dp.cal.getP('y');
        var m = parseInt($dp.cal.getP('M')) - 1;
        var d = $dp.cal.getP('d');
         $("#week_b").html($dp.cal.getP('W', 'WW'););
        $("#years_b").html(y);
        
        HotWord.ShowData(y, m, d, w);
    }, ShowData: function (y, m, d, w) {
        var stime = new Date(y, m, d).addDay(-w).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        var etime = new Date(y, m, d).addDay(6 - w).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

        $("#custom_start_time").val(stime.split(" ")[0]);
        $("#endTime").val(etime.split(" ")[0]);

    }

    }


$(function () { HotWord.Init(); });
