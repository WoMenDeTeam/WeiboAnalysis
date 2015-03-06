/// <reference path="jquery.js" />
/// <reference path="Pager.js" />
/// <reference path="common.js" />

$(document).ready(function () {
    //    Common.LoginEventFn = function (data) {
    //        var type = $.query.get('type');
    //        if (type) {
    //            $("#report_type").val(type);
    //        }
    //        AccidentReportList.LSqlList = new SqlList();
    //        AccidentReportList.Init();
    //        AccidentReportList.InnitClickFn();
    //        AccidentReportList.BindOrderFilde();
    //    }
    //    Common.CheckUser();


    AccidentReportList.LSqlList = new SqlList();
    AccidentReportList.Init();
    AccidentReportList.InnitClickFn();
    AccidentReportList.BindOrderFilde();
});

var AccidentReportList = {

    LSqlList: new SqlList(),
    CityList: ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "大连", "宁波", "厦门", "青岛", "深圳", "新疆建设兵团"],
    Init: function () {
        var defaultTime = new Date().getFullYear() + "-01-01";
        AccidentReportList.LSqlList.SqlQueryParams["strwhere"] = " State =-1 AND OccurrenceTime>= " + defaultTime;
        AccidentReportList.LSqlList.SqlQueryParams["action"] = "accidentreportlist";
        AccidentReportList.LSqlList.SqlQueryParams["strorder"] = "Department DESC";
        AccidentReportList.GetPageList();


        $("#area_sel option").remove();
        $("#area_sel").append("<option value=\"\" >全部地区</option>");
        for (var i = 0, j = AccidentReportList.CityList.length; i < j; i++) {
            var cityname = AccidentReportList.CityList[i];
            $("#area_sel").append("<option value=" + cityname + ">" + cityname + "</option>");
        }

        $("#start_time").val(defaultTime);



        var headhtml = [];
        var d = "日一二三四五六".charAt(new Date().getDay());

        headhtml.push("<a class=\"btn_logout\" href=\"http://10.16.6.100:8000/Handler/LoginOut.ashx\" target=\"_self\">退出</a> <span class=\"user_info\">");
        headhtml.push("您好！<b class=\"color_2\"></b>今天是<code class=\"color_1\">2014</code>年<code class=\"color_1\">2</code>月<code");
        headhtml.push("class=\"color_1\">" + new Date().getDate() + "</code>日<code class=\"color_1\"> 星期" + d + "</code></span>");
        $("#headuserinfo").empty().append(headhtml.join(""));

    }, GetPageList: function () {
        AccidentReportList.LSqlList.initData["page_size"] = 30;
        AccidentReportList.LSqlList.initData["post_url"] = "ReportList.ashx"
        AccidentReportList.LSqlList.DisplayHtml = function (data, l_obj) {
            AccidentReportList.DisplayHtml(data, l_obj);
        }
        AccidentReportList.LSqlList.Search();
    },
    DisplayHtml: function (data, l_obj) {
        if (parseInt(data["totalcount"]) > 0) {
            var entitylist = data["entitylist"];
            delete entitylist["SuccessCode"];
            var content = [];
            for (var item in entitylist) {

                var entity = entitylist[item];
                var title = unescape(entity["title"]);
                var url = unescape(entity["url"]);
                var creattime = unescape(entity["occurrencetime"]);
                var department = unescape(entity["department"]);
                if (title == "undefined") {
                    continue;
                }
                content.push("<li><a title=\"" + title + "\" href=\"" + url + "\" >");
                content.push("<span class=\"text\">" + title + "</span>");
                content.push("<span class=\"text\">" + department + "</span>");
                if (creattime != "undefined" && creattime != "") {
                    content.push("<span class=\"date\">" + creattime + "</span></a></li>");
                }
            }
            $("#" + l_obj.result_id).empty().html(content.join(""));
        } else {
            $("#" + l_obj.result_id).empty().html("<li><center>对不起，没有数据。</center></li>");
        }
    },
    InnitClickFn: function () {
        $("#btn_look_result").click(function () {
            var strwhere = [];
            var starttime = $("#start_time").val();
            var endtime = $("#end_time").val();
            var jgjc = $("#search_jgjc_sel").val();
            var sgjb = $("#search_sgjb_sel").val();
            var area = $("#area_sel").val();
            strwhere.push(" State =-1 AND ");
            if (starttime) {
                strwhere.push(" OccurrenceTime>='" + starttime + "'AND");
            }
            if (endtime) {
                strwhere.push(" OccurrenceTime<='" + endtime + "'AND");
            }
            if (jgjc) {
                strwhere.push(" RegulatoryDepartment like '%" + jgjc + "%' AND");
            }
            if (sgjb) {
                strwhere.push(" AccidentLevel = '" + sgjb + "' AND");
            }
            if (area) {
                strwhere.push(" Area = '" + area + "' AND");
            }
            AccidentReportList.LSqlList.SqlQueryParams["strwhere"] = strwhere.join("").slice(0, -3);
            AccidentReportList.GetPageList();
        });
    },
    BindOrderFilde: function () {
        $("#orderTabUl li[name='sort_search_type']").unbind().bind("click", function () {
            var orderbyFile = $(this).attr("pid");
            $("#orderTabUl li[name='sort_search_type']").removeClass().addClass("tab_off");
            $(this).addClass("tab_on");
            AccidentReportList.LSqlList.SqlQueryParams["strorder"] = orderbyFile + " DESC ";
            AccidentReportList.GetPageList();
        });
    }
}