var Emergencywarning_Index = {
    Init: function () {
        EmergencyWaring.ListTemplate = Emergencywarning_Index.LoadDataTemplate;
        EmergencyWaring.AdminWhere = "";
        EmergencyWaring.Init();
    }, LoadDataTemplate: function (data) {
        //DeadCount 死 IsMassDeath 群 InjuredCount 伤  LostCount 失踪 HigLevel=DeadCount+LostCount 严重指数;
        var count = parseInt(data.HigLevel);
        var degree = EmergencyWaring.MarkLevelClass(count, data.IsMassDeath, data.SourceType, data.AlarmState);
        var id = data.ID;
        var doc = [];
        doc.push("<li>");
        if (data.AlarmState == 0) {
            doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        }
        doc.push("<span class=\"text\"><a name=\"deleteAlarr off\" aid=" + id + " class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + unescape(data.Title) + "</a>");
        if (data.Tag === "1" && data.Remark !== "") {
            doc.push("<span class=\"text\" ><span style=\"padding-left:23px;font-size:12px;\">备注：" + data.Remark + "</span></span>");
        }
        doc.push("</span>");
        doc.push("<code>");
        doc.push(data.CreateTime);
        doc.push("</code>");
        if (data.SourceType == "1") {
            doc.push("<code>");
            doc.push("LV" + data.Level);
            doc.push(" 来源鹰眼");
            doc.push("</code>");
        }
        doc.push("<code>");
        //if (data.Tag === "0") {
        //    doc.push("<a name='add_tag' aid='" + id + "' href='javascript:void(0);'>备注</a>");
        //}
        //if (data.Tag === "1") {
        //    doc.push("<a name='cancel_tag' aid='" + id + "' href='javascript:void(0);'>取消备注</a>");
        //}

        doc.push("</code>");
        doc.push("<span class=\"btn\">");
        doc.push("</span>");
        doc.push("</li>");
        var html = doc.join("");
        var _doc = $(html);

        //_doc.find("a[name='deleteAlarr']").bind("click", function () {
        //    var id = $(this).attr("aid");
        //    EmergencyWaring.OffWarning({ "action": "delalarm", "id": id });
        //});

        //_doc.find("[name='chkItem']:checkbox").change(function () {
        //    EmergencyWaring.ResetCheckState();
        //});
        //_doc.find("[name='add_tag']").bind("click", EmergencyWaring.AddTag);
        //_doc.find("[name='cancel_tag']").bind("click", EmergencyWaring.CancelTag);
        return _doc;

    }
}