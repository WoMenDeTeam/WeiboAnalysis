/// <reference path="../jquery-1.8.1.js" />
/// <reference path="emergencywarning.js" />
var AccidentAlarm = {
    Init: function () {
        EmergencyWaring.ListTemplate = AccidentAlarm.LoadDataTemplate;
        EmergencyWaring.AdminWhere = "";
        EmergencyWaring.Init();
        $("#addNewAlarm").unbind().bind("click", AccidentAlarm.AddAlarmInfo);
    },
    LoadDataTemplate: function (data) {
        //DeadCount 死 IsMassDeath 群 InjuredCount 伤  LostCount 失踪 HigLevel=DeadCount+LostCount 严重指数;
        var count = parseInt(data.HigLevel);
        var degree = EmergencyWaring.MarkLevelClass(count, data.IsMassDeath, data.SourceType, data.AlarmState);
        var id = data.ID;
        var doc = [];
        var title = unescape(data.Title);
        title = title.length > 22 ? title.substring(0, 22) : title;
        doc.push("<li>");
        //if (data.AlarmState == 0)
        doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        doc.push("<span class=\"text\"><a name=\"deleteAlarr\" title=" + data.Title + " aid=" + id + " class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + title + "</a></span>");
        doc.push("<code>");
        doc.push(data.CreateTime);
        doc.push("</code>");
        if (data.SourceType == "1") {

            doc.push("<code>");
            doc.push("LV" + data.Level);
            doc.push("来源鹰眼");
            doc.push("</code>");
        }
        doc.push("<span class=\"btn\">");
        if (data.AlarmState == 0) {
            doc.push("<a class=\"btn_alert\" title=\"取消报警\" name=\"deleteAlarr\" aid=\"" + id + "\" act=\"deleteAlarr\" href=\"javascript:void(0);\"></a>");
        }
        doc.push("<a  title=\"编辑报警信息\" class=\"btn_edit\" name=\"updateAlarr\" aid=\"" + id + "\"  href=\"javascript:void(0);\"></a> ");
        doc.push(" <a  title=\"删除报警信息\" class=\"btn_delete\" name=\"delete\" aid=\"" + id + "\"  href=\"javascript:void(0);\"></a>");
        doc.push("</span>");
        doc.push("</li>");
        var html = doc.join("");
        var _doc = $(html);
        _doc.find("[name='chkItem']:checkbox").change(function () {
            EmergencyWaring.ResetCheckState();
        });
        _doc.find("a[name='updateAlarr']").unbind().bind("click", data, AccidentAlarm.ShowUpdateAlarmInfo);
        _doc.find("a[name='delete']").unbind().bind("click", data, AccidentAlarm.DeleteAlarmIfo);
        //_doc.find("a[name='delete']").unbind().bind("click", AccidentAlarm.AddAlarmInfo);//添加预警代码
        return _doc;
    }, DeleteAlarmIfo: function (data) {
        var id = data.data.ID;
        if (confirm("删除后将不可恢复，确定操作吗？")) {
            EmergencyWaring.MyAjax({ "action": "delete", "id": id }, function (d) {
                EmergencyWaring.GetPageList();
                EmergencyWaring.RealTimeDetection();
            });
        }

    }, ShowUpdateAlarmInfo: function (data) {
        var newdata = data.data;
        var content = $("#formsContent");
        content.empty();
        var s = "";
        s.replace
        //style=\"width: 450px;\"
        var strHtml = [];
        strHtml.push("<div id=\"SubmitContent\">");
        strHtml.push("<span class=\"input\">红色<b style='color:red;'>*</b>为必填选项</span>");
        strHtml.push("<ul class=\"form_list\">");
        strHtml.push("<li style=\"display:none;\"><span class=\"name\">ID</span> <span class=\"input\" >");
        strHtml.push("<input type=\"text\" id=\"txtID\"   value=\"" + newdata.ID + "\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">标题</span> <span class=\"input\" style=\"width: 500px;\">");
        strHtml.push("<input type=\"text\" id=\"txtTitle\" value=\"" + unescape(newdata.Title) + "\" style=\"width: 490px;\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        //strHtml.push("<li><span class=\"name\">内容</span> <span class=\"textarea\">");
        //strHtml.push("<textarea id=\"txtContent\" cols=\"20\" rows=\"5\"></textarea>");
        //strHtml.push("</span> <span class=\"note\"></span></li>");
        strHtml.push("<li><span class=\"name\">链接</span> <span class=\"input\" style=\"width: 500px;\">");
        strHtml.push("<input type=\"text\" id=\"txtUrl\" value=\"" + unescape(newdata.Url) + "\" style=\"width: 490px;\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">死亡</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtDeadCount\" value=\"" + newdata.DeadCount + "\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">受伤</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtInjuredCount\" value=\"" + newdata.InjuredCount + "\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">失踪</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtLostCount\" value=\"" + newdata.LostCount + "\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">性质</span> <span class=\"radio\">");
        if (parseInt(newdata.IsMassDeath) == 0) {
            strHtml.push("<input type=\"radio\" name=\"radMassDeath\" checked=\"checked\" value=\"0\" />非群体性质 ");
            strHtml.push("<input type=\"radio\" name=\"radMassDeath\" value=\"1\" />群体性质");
        } else {
            strHtml.push("<input type=\"radio\" name=\"radMassDeath\" value=\"0\" />非群体性质 ");
            strHtml.push("<input type=\"radio\" name=\"radMassDeath\" checked=\"checked\" value=\"1\" />群体性质");
        }
        strHtml.push("</span><span class=\"note\"></span></li>");
        strHtml.push("</ul>");
        strHtml.push("</div>");
        var submite = $("<div class=\"form_btn\"><input class=\"btn\" id=\"submit_btn\" value=\"提交\" type=\"button\" /></div>");
        submite.unbind().bind("click", { "action": "update" }, AccidentAlarm.SubmitContentInfo);
        content.append(strHtml.join(''));
        content.append(submite);
        Common.ShowEditFrame("bg_div", "move_column", "layer", "btn_close");
    }, SubmitContentInfo: function (data) {
        var result = AccidentAlarm.CheckSubmitContentInfo();
        if (result != false) {
            result["action"] = data.data.action;
            EmergencyWaring.MyAjax(result, function (d) {
                EmergencyWaring.GetPageList();
                EmergencyWaring.RealTimeDetection();
                $("#bg_div, #layer").hide(100);
            });
        } else {
            alert("请确认数据真实有效!");
        }
    }, CheckSubmitContentInfo: function () {
        var result = true;
        var data = {};
        var id = $("#txtID");
        var title = $("#txtTitle");
        var url = $("#txtUrl");
        var deadCount = $("#txtDeadCount");
        var injuredCount = $("#txtInjuredCount");
        var lostCount = $("#txtLostCount");
        var isMassDeath = $("[name='radMassDeath']:radio:checked");

        if (lostCount.val() == "" || lostCount.val() == undefined) {
            result = false;
        }
        if (isNaN(lostCount.val())) {
            result = false;
        }
        if (deadCount.val() == "" || deadCount.val() == undefined) {
            result = false;
        }
        if (isNaN(deadCount.val())) {
            result = false;
        }
        if (injuredCount.val() == "" || injuredCount.val() == undefined) {
            result = false;
        }
        if (isNaN(injuredCount.val())) {
            result = false;
        }
        if (url.val() == "" || url.val() == undefined) {
            result = false;
        }
        if (title.val() == "" || title.val() == undefined) {
            result = false;
        }
        if (result) {
            data = { "ID": id.val(), "Title": escape(title.val()), "Url": escape(url.val()), "DeadCount": deadCount.val(), "InjuredCount": injuredCount.val(), "LostCount": lostCount.val(), "IsMassDeath": isMassDeath.val() };
            return data;
        } else {
            return result;
        }
    }, AddAlarmInfo: function () {
        var content = $("#formsContent");
        content.empty();
        var strHtml = [];
        strHtml.push("<div id=\"SubmitContent\">");
        strHtml.push("<span class=\"input\">红色<b style='color:red;'>*</b>为必填选项</span>");
        strHtml.push("<ul class=\"form_list\">");
        strHtml.push("<li style=\"display:none;\"><span class=\"name\">ID</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtID\" value=\"0\" />");
        strHtml.push("</span> <span class=\"note\"></span></li>");
        strHtml.push("<li><span class=\"name\">标题</span> <span class=\"input\" style=\"width: 500px;\">");
        strHtml.push("<input type=\"text\" id=\"txtTitle\" value=\"\" style=\"width: 490px;\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        //strHtml.push("<li><span class=\"name\">内容</span> <span class=\"textarea\">");
        //strHtml.push("<textarea id=\"txtContent\" cols=\"20\" rows=\"5\"></textarea>");
        //strHtml.push("</span> <span class=\"note\"></span></li>");
        strHtml.push("<li><span class=\"name\">链接</span> <span class=\"input\" style=\"width: 500px;\">");
        strHtml.push("<input type=\"text\" id=\"txtUrl\" value=\"\" style=\"width: 490px;\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">死亡</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtDeadCount\" value=\"0\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">受伤</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtInjuredCount\" value=\"0\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">失踪</span> <span class=\"input\">");
        strHtml.push("<input type=\"text\" id=\"txtLostCount\" value=\"0\" />");
        strHtml.push("</span> <span class=\"note\">*</span></li>");
        strHtml.push("<li><span class=\"name\">性质</span> <span class=\"radio\">");
        strHtml.push("<input type=\"radio\" name=\"radMassDeath\" checked=\"checked\" value=\"0\" />非群体性质 ");
        strHtml.push("<input type=\"radio\" name=\"radMassDeath\" value=\"1\" />群体性质");
        strHtml.push("</span><span class=\"note\"></span></li>");
        strHtml.push("</ul>");
        strHtml.push("</div>");
        var submite = $("<div class=\"form_btn\"><input class=\"btn\" id=\"submit_btn\" value=\"提交\" type=\"button\" /></div>");
        submite.unbind().bind("click", { "action": "add" }, AccidentAlarm.SubmitContentInfo);
        content.append(strHtml.join(''));
        content.append(submite);
        Common.ShowEditFrame("bg_div", "move_column", "layer", "btn_close");
    }
}

$(function () {
    AccidentAlarm.Init();
})
