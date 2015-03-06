/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />

var AccidentReportRecycle = {
    SqlInitData: { "page_size": 50, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/AccidentReportHandler.ashx" },
    SqlData: { "action": "getpage", "where": " State = -2 And LEN(Title)>5 ", "orderBy": " PublishTime DESC " },
    CurrPageIndex: 1,
    State: "-2",
    GetURLParam: function () {
        String.prototype.getQueryString = function (name)//name 是URL的参数名字 
        {
            var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)"), r;
            if (r = this.match(reg)) return unescape(r[2]); return null;
        };
        //直接可以传参数名 就可以 得到参数的值 
        var pvalue = window.location.href.getQueryString("state");
        AccidentReportRecycle.State = pvalue == null ? "-2" : pvalue;
    },
    Init: function () {
        AccidentReportRecycle.GetURLParam();
        AccidentReportRecycle.SqlData["where"] = " State = " + AccidentReportRecycle.State + " And LEN(Title)>5 ";
        $("#click_all_ckbox").change(function () {
            $("#list_body_div [name = chkItem]:checkbox").attr("checked", this.checked);
            AccidentReportRecycle.ResetCheckState();
        });
        $("#revocation-report-btn").unbind().bind("click", function () {
            AccidentReportRecycle.RevocationReportList();
        });

        AccidentReportRecycle.GetPageList({});

    }, GetPageList: function (parm) {
        var currpage_b = $("#currpage_b");
        var count_b = $("#count_b");
        var listBody_div = $("#list_body_div");

        var sp = new SqlPager(AccidentReportRecycle.SqlInitData);
        sp.pagelist = true;
        sp.Display = function (data) {
            currpage_b.text(this.currPageIndex + "/" + this.page_count);
            count_b.text(this.totalCount);
            AccidentReportRecycle.CurrPageIndex = this.currPageIndex;
            listBody_div.empty();
            if (data.data.length == 0) {
                Common.LoadingImg("list_body_div", "none");
            }
            for (var i = 0, j = data.data.length; i < j; i++) {
                var newdata = data.data[i];
                var result = AccidentReportRecycle.loadDataTemp(newdata);
                listBody_div.append(result);
            }
            AccidentReportRecycle.ResetCheckState();
        }
        sp.LoadData(AccidentReportRecycle.CurrPageIndex, AccidentReportRecycle.SqlData);
    }, //页面列表信息模版
    loadDataTemp: function (data) {
        var count = parseInt(data.HigLevel);
        var degree = "";
        var id = data.ID;
        var title = unescape(data.Title);
        var doc = [];
        doc.push("<li>");
        //if (data.AlarmState == 0) 
        doc.push("<span class=\"btn\">");
        if (data.State == 0) {
            doc.push("<a class=\"btn_alert\" title=\"已读\" name=\"deleteAlarr\" aid=\"" + id + "\" act=\"deleteAlarr\" href=\"javascript:void(0);\"></a>");
        }
        doc.push(" <a  title=\"撤销\" class=\"\" name=\"revocation-report\" aid=\"" + id + "\"  href=\"javascript:void(0);\">撤销</a>");
        doc.push("</span>");
        doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        doc.push("<span class=\"text\"><a name=\"deleteAlarr\" aid=" + id + " title='" + title + "' class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + title + "</a></span>");
        doc.push("<code>");
        doc.push("发布时间：");
        doc.push(data.PublishTime.split(' ')[0] + "");
        if (data.OccurrenceTime != "") {
            doc.push(" 发生时间：");
            doc.push(data.OccurrenceTime.split(' ')[0]);
        }
        doc.push("　" + unescape(data["Department"]));
        doc.push("</code>");
        doc.push("</li>");
        var html = doc.join("");
        var _doc = $(html);

        _doc.find("[name='chkItem']:checkbox").change(function () {
            AccidentReportRecycle.ResetCheckState();
        });

        //撤销删除的报告
        _doc.find("a[name='revocation-report']").unbind().bind("click", data, AccidentReportRecycle.RevocationReport);
        return _doc;

    }, ResetCheckState: function () {
        var checkboxCount = $("[name = chkItem]:checkbox").length;
        var checkedCount = $("[name = chkItem]:checkbox:checked").length;
        var checkstate = false;
        if (checkboxCount != 0 && (checkboxCount == checkedCount)) {
            checkstate = true;
        }
        $("#click_all_ckbox").attr("checked", checkstate);
        $("#checknumber").html(checkedCount);
    },
    RevocationReportList: function () {
        var id = "";
        var checkedBoxs = $("[name = chkItem]:checkbox:checked");
        var ids = [];
        for (var i = 0; i < checkedBoxs.length; i++) {
            ids.push(checkedBoxs[i].value);
        }
        id = ids.join(',');

        var senddata = { "action": "revocation", "ids": id, "state": 0 };
        AccidentReportRecycle.MyAjax(senddata, function (d) {
            if (d["success"] == 1) {
                AccidentReportRecycle.GetPageList({});
                $("#bg_div,#layer").hide();
            }
        });

    },
    RevocationReport: function (data) {
        var id = data.data["ID"];
        var senddata = { "action": "revocation", "ids": id, "state": 0 };
        AccidentReportRecycle.MyAjax(senddata, function (d) {
            if (d["success"] == 1) {
                AccidentReportRecycle.GetPageList({});
                $("#bg_div,#layer").hide();
            }
        });
    }, MyAjax: function (data, callfun) {
        $.ajax("Handler/AccidentReportHandler.ashx", {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }
}

$(function () {
    AccidentReportRecycle.Init();
});