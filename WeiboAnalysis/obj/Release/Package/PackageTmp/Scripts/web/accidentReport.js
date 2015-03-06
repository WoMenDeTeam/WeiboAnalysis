/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />

/*事故调查报告*/
//BETWEEN -1 AND 0
var AccidentReport = {
    CityList: ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "大连", "宁波", "厦门", "青岛", "深圳", "新疆建设兵团"],
    SqlInitData: { "page_size": 50, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/AccidentReportHandler.ashx" },
    SqlData: { "action": "getpage", "where": " State = 0  And LEN(Title)>5 ", "orderBy": " State DESC, CreateTime DESC " },
    CurrPageIndex: 1,
    ReportState: "0",
    ListTemplate: function (data) { },
    Init: function () {
        $("#accidentalarm_start_time").val("");
        $("#accidentalarm_end_time").val("");
        $("#accidentalarm_keyword_txt").val("");
        $("#accidentalarm_search_btn").unbind().bind("click", AccidentReport.AdvancedSearch);
        $("#accidentalarm_start_time").val(new Date().getFullYear() + "-01-01");
        AccidentReport.Quit();
        AccidentReport.GetPageList();
        AccidentReport.PageEventBind();

        $("#add-report-btn").unbind().bind("click", function () {
            $("input[type='text']").val("");
            Common.ShowEditFrame("bg_div", "move_column", "layer", "btn_close");
            $("#submit_btn").unbind().bind("click", AccidentReport.AddReport);
        });

        $("#area-sel option").remove();
        $("#search-area-sel option").remove();

        $("#area-sel").append("<option value=\"\" ></option>");
        $("#search-area-sel").append("<option value=\"\" >全部地区</option>");
        for (var i = 0, j = AccidentReport.CityList.length; i < j; i++) {
            var cityname = AccidentReport.CityList[i];
            $("#area-sel").append("<option value=" + cityname + ">" + cityname + "</option>");
            $("#search-area-sel").append("<option value=" + cityname + ">" + cityname + "</option>");
        }

        $("#search_bar_btn").unbind().bind("click", function () {
            $("#advanced_search_div").show();
        });
        $("#close_advanced_search_a").unbind().bind("click", function () {
            $("#advanced_search_div").hide();
        })

        $("#search-list-sel").change(function () {
            var type_txt = this.value;
            if (type_txt == "sysj") {
                $("#accidentalarm_start_time,#accidentalarm_end_time").hide();
            } else {
                $("#accidentalarm_start_time,#accidentalarm_end_time").show();
            }
        });


        //待处理
        $("#pending_report").unbind().bind("click", AccidentReport.PendingReport);
        //报告回收站
        $("#recycle_report").unbind().bind("click", AccidentReport.RecycleReport)
        //已发布报告
        $("#published_report").unbind().bind("click", AccidentReport.PublishedReport);
    },
    AdvancedSearch: function () {
        var obj = AccidentReport.GetPargeParam();
        obj["filed"] = "CreateTime";
        var type = $("#search-list-sel").val();
        if (type === "fbsj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,PublishTime  DESC "

        } else if (type === "fssj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,OccurrenceTime  DESC "
            obj["filed"] = "OccurrenceTime";
        } else if (type === "rksj" || type == "sysj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,CreateTime  DESC "
            obj["filed"] = "CreateTime";
        }
        AccidentReport.CurrPageIndex = 1;
        AccidentReport.GetPageList(obj);
        $("#advanced_search_div").hide();
    },
    PendingReport: function () {
        $("#reset-report-btn").hide();
        $("#delete-report-btn").show();
        AccidentReport.Reset(0);
        $(this).addClass("no");
    },
    RecycleReport: function () {
        $("#reset-report-btn").show();
        $("#delete-report-btn").hide();
        AccidentReport.Reset(-2);
        $(this).addClass("no");
    },
    PublishedReport: function () {
        $("#reset-report-btn").show();
        $("#delete-report-btn").show();
        AccidentReport.Reset(-1);
        $(this).addClass("no");
    },
    Reset: function (state) {
        AccidentReport.ReportState = state;
        AccidentReport.SqlData["where"] = " State = " + state + "  And LEN(Title)>5 ";
        AccidentReport.CurrPageIndex = 1;
        $("#pending_report,#recycle_report,#published_report").removeClass("no");
        $("#search-list-sel option:first").prop("selected", 'selected');
        $("#search-level-sel option:first").prop("selected", 'selected');
        $("#search-department-sel option:first").prop("selected", 'selected');
        $("#search-area-sel option:first").prop("selected", 'selected');

        AccidentReport.AdvancedSearch();
    },
    SearchGetPage: function () {
        var obj = AccidentReport.GetPargeParam();
        obj["filed"] = "CreateTime";
        var type = $("#search-list-sel").val();
        if (type === "fbsj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,CreateTime  DESC "
        } else if (type === "fssj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,CreateTime  DESC "
            obj["filed"] = "OccurrenceTime";
        } else if (type === "rksj") {
            AccidentReport.SqlData["orderBy"] = " State DESC,CreateTime  DESC "
            obj["filed"] = "CreateTime";
        }
        //AccidentReport.CurrPageIndex = 1;
        AccidentReport.GetPageList(obj);
        $("#advanced_search_div").hide();
    },
    PageEventBind: function () {

        $("#click_all_ckbox").change(function () {
            $("#list_body_div [name = chkItem]:checkbox").attr("checked", this.checked);
            AccidentReport.ResetCheckState();
        });
        $("#read-report-btn").unbind().bind("click", function () {
            if (confirm("确定标记为已读报告吗？")) {
                AccidentReport.DelAralmByIDs();
            }
        });
        $("#delete-report-btn").unbind().bind("click", function () {
            if (confirm("确定标记为删除报告吗？")) {
                AccidentReport.DeleteAralmByIds();
            }
        })

        $("#reset-report-btn").unbind().bind("click", AccidentReport.RevocationReportList)

        //按时间排序按钮
        var bytime_btn = $("#bytime");
        //按预警级别排序按钮
        var bybyurgent_btn = $("#byurgent");
        bytime_btn.unbind().bind("click", function () {
            bybyurgent_btn.removeClass("on");
            bytime_btn.addClass("on");

            AccidentReport.GetPageListByTime();
        });
        bybyurgent_btn.unbind().bind("click", function () {
            bytime_btn.removeClass("on");
            bybyurgent_btn.addClass("on");
            AccidentReport.GetPageListByUrgent();
        });
    },
    ResetCheckState: function () {
        var checkboxCount = $("[name = chkItem]:checkbox").length;
        var checkedCount = $("[name = chkItem]:checkbox:checked").length;
        var checkstate = false;
        if (checkboxCount != 0 && (checkboxCount == checkedCount)) {
            checkstate = true;
        }
        $("#click_all_ckbox").attr("checked", checkstate);
        $("#checknumber").html(checkedCount);
    },
    GetPargeParam: function () {
        var stime = $("#accidentalarm_start_time").val();
        var etiem = $("#accidentalarm_end_time").val();
        var keywordtext = $("#accidentalarm_keyword_txt").val();
        var area = $("#search-area-sel").val();
        var department = $("#search-department-sel").val();
        var level = $("#search-level-sel").val();
        stime = stime == null ? "" : stime;
        etiem = etiem == null ? "" : etiem;
        var type = $("#search-list-sel").val();
        if (type == "sysj") {
            stime = "";
            etiem = "";
        }
        //sysj
        keywordtext = keywordtext == null ? "" : keywordtext;
        var obj = { "starttime": stime, "endtime": etiem, "keywordtext": keywordtext, "area": area, "department": department, "level": level };
        return obj;
    },
    GetPageListByTime: function () {
        AccidentReport.SqlData["orderBy"] = " State DESC , PublishTime DESC "; //
        var param = AccidentReport.GetPargeParam();
        AccidentReport.GetPageList(param);
    },
    GetPageListByUrgent: function () {
        AccidentReport.SqlData["orderBy"] = "  State DESC,HigLevel DESC "; //
        var param = AccidentReport.GetPargeParam();
        AccidentReport.GetPageList(param);
        AccidentReport.GetPageList();
    }, GetPageList: function (parm) {
        if (parm == undefined || parm == null) {
            AccidentReport.SqlData["starttime"] = "";
            AccidentReport.SqlData["endtime"] = "";
            AccidentReport.SqlData["keywordtext"] = "";
            AccidentReport.SqlData["filed"] = "";
        } else {
            AccidentReport.SqlData["starttime"] = parm["starttime"];
            AccidentReport.SqlData["endtime"] = parm["endtime"];
            AccidentReport.SqlData["keywordtext"] = parm["keywordtext"];
            AccidentReport.SqlData["filed"] = parm["filed"];
            AccidentReport.SqlData["area"] = parm["area"];
            AccidentReport.SqlData["department"] = parm["department"];
            AccidentReport.SqlData["level"] = parm["level"];
        }
        var currpage_b = $("#currpage_b");
        var count_b = $("#count_b");
        var listBody_div = $("#list_body_div");
        var sp = new SqlPager(AccidentReport.SqlInitData);
        sp.pagelist = true;

        sp.Display = function (data) {
            currpage_b.text(this.currPageIndex + "/" + this.page_count);
            count_b.text(this.totalCount);
            AccidentReport.CurrPageIndex = this.currPageIndex;
            listBody_div.empty();
            if (data.data.length == 0) {
                Common.LoadingImg("list_body_div", "none");
            }
            for (var i = 0, j = data.data.length; i < j; i++) {
                var newdata = data.data[i];
                var result = AccidentReport.ListTemplate(newdata); // AccidentReport.loadDataTemp(newdata);
                listBody_div.append(result);
            }
            AccidentReport.ResetCheckState();
        }
        sp.LoadData(AccidentReport.CurrPageIndex, AccidentReport.SqlData);
    },
    //页面列表信息模版
    loadDataTemp: function (data) {
        var count = parseInt(data.HigLevel);
        var degree = "";
        var id = data.ID;
        var title = unescape(data.Title);
        //去掉后面时间的正则
        var doc = [];
        doc.push("<li>");
        doc.push("<span class=\"btn\">");
        if (data.State == 0) {
            doc.push("<a class=\"btn_alert\" title=\"已读\" name=\"deleteAlarr\" aid=\"" + id + "\" act=\"deleteAlarr\" href=\"javascript:void(0);\"></a>");
        }

        doc.push("<a  title=\"编辑\" class=\"btn_edit\" name=\"updateAlarr\" aid=\"" + id + "\"  href=\"javascript:void(0);\"></a> ");
        if (AccidentReport.ReportState >= -1) {
            doc.push(" <a  title=\"删除\" class=\"btn_delete\" name=\"delete\" aid=\"" + id + "\"  href=\"javascript:void(0);\"></a>");
        }
        if (AccidentReport.ReportState != 0) {
            doc.push(" <a  title=\"撤销\" class=\"btn_renew\" name=\"reset\" aid=\"" + id + "\"  href=\"javascript:void(0);\"></a>");
        }
        doc.push("</span>");
        doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        doc.push("<span class=\"text\"><a aid=" + id + " title='" + title + "' class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + title + "</a></span>");
        doc.push("<code>");
        doc.push("发布时间：");
        doc.push(data.PublishTime.split(' ')[0] + "");

        if (data.CreateTime != "") {
            doc.push(" 入库时间：");
            doc.push(data.CreateTime.split(' ')[0]);
        }
        if (data.OccurrenceTime != "") {
            doc.push(" 发生时间：");
            doc.push(data.OccurrenceTime.split(' ')[0]);
        }
        doc.push("　" + unescape(data["Department"]));
        if (data.AccidentLevel != "") {
            doc.push(" 事故类别: " + data.AccidentLevel);
        }
        if (data.RegulatoryDepartment != "") {
            doc.push(" 监管监察: " + data.RegulatoryDepartment);
        }
        if (data.Area != "") {
            doc.push(" 地区: " + data.Area);
        }

        doc.push("</code>");
        doc.push("</li>");
        var html = doc.join("");
        var _doc = $(html);
        _doc.find("[name='chkItem']:checkbox").change(function () {
            AccidentReport.ResetCheckState();
        });
        //标记已读
        _doc.find("a[name='deleteAlarr']").unbind().bind("click", data, AccidentReport.ReadState);
        _doc.find("a[name='delete']").unbind().bind("click", data, AccidentReport.DeleteState);
        _doc.find("a[name='updateAlarr']").unbind().bind("click", data, AccidentReport.EditReport);
        _doc.find("a[name='reset']").unbind().bind("click", data, AccidentReport.RevocationReport);
        return _doc;
    },
    EditReport: function (data) {
        var newdata = data.data;
        $("#SubmitContent input[type='text']").val("");
        $("#report-tile-txt").val(unescape(newdata["Title"]));
        $("#report-rul-txt").val(unescape(newdata["Url"]));
        $("#report-area-txt").val(unescape(newdata["Department"]));
        $("#report-time-txt").val(newdata["PublishTime"].split(' ')[0]);
        //$("#report-createtime-txt").val(newdata["CreateTime"]);
        $("#report-occurrencetime-txt").val(newdata["OccurrenceTime"].split(' ')[0]);
        $("#submit_btn").unbind().bind("click", newdata, AccidentReport.UpdateReport);
        $("#accidentlevel-sel").val(newdata["AccidentLevel"]);
        $("#regulatorydepartment-sel").val(newdata["RegulatoryDepartment"]);
        $("#area-sel").val(newdata["Area"]);
        Common.ShowEditFrame("bg_div", "move_column", "layer", "btn_close");
    },
    AddReport: function () {
        var newdata = {};
        newdata["Title"] = $("#report-tile-txt").val();
        newdata["Url"] = $("#report-rul-txt").val();
        newdata["Department"] = $("#report-area-txt").val();
        //newdata["CreateTime"] = ""; $("#report-createtime-txt").val();
        newdata["PublishTime"] = $("#report-time-txt").val();
        newdata["OccurrenceTime"] = $("#report-occurrencetime-txt").val();
        newdata["action"] = "add";
        newdata["ID"] = "0";
        newdata["Content"] = "";
        newdata["AccidentLevel"] = $("#accidentlevel-sel").val();
        newdata["RegulatoryDepartment"] = $("#regulatorydepartment-sel").val();
        newdata["Area"] = $("#area-sel").val();
        AccidentReport.OffWarning(newdata);
    },
    UpdateReport: function (data) {
        var ischeck = true;
        var newdata = data.data;
        newdata["Title"] = $("#report-tile-txt").val();
        newdata["Url"] = $("#report-rul-txt").val();
        newdata["Department"] = $("#report-area-txt").val();
        newdata["PublishTime"] = $("#report-time-txt").val();
        newdata["OccurrenceTime"] = $("#report-occurrencetime-txt").val();
        newdata["AccidentLevel"] = $("#accidentlevel-sel").val();
        newdata["RegulatoryDepartment"] = $("#regulatorydepartment-sel").val();
        newdata["Area"] = $("#area-sel").val();
        newdata["Content"] = "";
        newdata["action"] = "update";
        var msg = "";
        if (ischeck && newdata["OccurrenceTime"] == "") {
            ischeck = false;
            msg = "请填写事故发生时间";
        }
        if (ischeck && newdata["AccidentLevel"] == "") {
            ischeck = false;
            msg = "请选择事故发生级别";
        }
        if (ischeck && newdata["RegulatoryDepartment"] == "") {
            ischeck = false;
            msg = "请填择事故监管部门";
        }
        if (ischeck && newdata["Area"] == "") {
            ischeck = false;
            msg = "请填择事故发生地区";
        }
        if (ischeck) {
            AccidentReport.OffWarning(newdata);
        } else {
            alert(msg);
        }

    },
    ReadState: function (data) {
        var id = data.data["ID"];
        //发生时间不能为空
        if (data.data["OccurrenceTime"] == "" || data.data["AccidentLevel"] == "" || data.data["RegulatoryDepartment"] == "" || data.data["Area"] == "") {
            alert("请编辑完善事故信息!");
            //AccidentReport.EditReport(data);

        } else {
            AccidentReport.OffWarning({ "action": "readstate", "ids": id })
        }
    },
    DeleteState: function (data) {
        if (confirm("确定删除报告吗?")) {
            var id = data.data["ID"];
            AccidentReport.OffWarning({ "action": "deletestate", "ids": id })
        }
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
        AccidentReport.MyAjax(senddata, function (d) {
            if (d["success"] == 1) {
                AccidentReport.SearchGetPage();
                $("#bg_div,#layer").hide();
            }
        });

    },
    RevocationReport: function (data) {
        var id = data.data["ID"];
        var senddata = { "action": "revocation", "ids": id, "state": 0 };
        AccidentReport.MyAjax(senddata, function (d) {
            if (d["success"] == 1) {
                AccidentReport.SearchGetPage();
            }
        });
    },
    DelAralmByIDs: function () {
        var id = "";
        var checkedBoxs = $("[name = chkItem]:checkbox:checked");
        var ids = [];
        for (var i = 0; i < checkedBoxs.length; i++) {
            ids.push(checkedBoxs[i].value);
        }
        id = ids.join(',');
        AccidentReport.OffWarning({ "action": "readstate", "ids": id });
    },
    DeleteAralmByIds: function () {
        var id = "";
        var checkedBoxs = $("[name = chkItem]:checkbox:checked");
        var ids = [];
        for (var i = 0; i < checkedBoxs.length; i++) {
            ids.push(checkedBoxs[i].value);
        }
        id = ids.join(',');
        AccidentReport.OffWarning({ "action": "deletestate", "ids": id });
    },
    OffWarning: function (data) {
        AccidentReport.MyAjax(data, function (d) {
            if (d["success"] == 1) {
                AccidentReport.SearchGetPage();
                $("#bg_div,#layer").hide();
            }
        });
    },
    MyAjax: function (data, callfun) {
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
    },
    Quit: function () {
        $("#a_quid").click(function () {
            $.post("Handler/User.ashx", { "action": "quit" }, function (data) {
                if (data && data["SuccessCode"] == "1") {
                    window.parent.location.href = "login.html";
                }
            }, "json");
        })
    }
}


$(function () {
    AccidentReport.ListTemplate = AccidentReport.loadDataTemp;
    AccidentReport.Init();
})







