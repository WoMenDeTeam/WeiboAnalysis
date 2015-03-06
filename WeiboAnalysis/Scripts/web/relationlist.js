/// <reference path="jquery-1.8.1.js" />
/// <reference path="template.js" />
/// <reference path="SqlPager.js" />
/// <reference path="sysConfig.js" />
/// <reference path="sysConfig.js" />
/// <reference path="common.js" />


var relationlist = {
    SqlPageParm: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "page_bar", "info_id": "load_error", "sql_tag": "item", "min_size": "2", "mix_size": "5", "web_url": "Handler/SqlSearch.ashx" },
    SqlGetParm: { "action": "relationlist", "searchwhere": "", "searchtype": "all" },
    Init: function () {
        $("#search_all_btn").bind("click", this.SearchAllRelationList);
        $("#search_my_btn").bind("click", this.SearchMyRelationList);
        $("#btn_add_relation").bind("click", this.ShowAddRelationDiv);
        setInterval(relationlist.GetTime, 1000);
        sysConfig.GetUserName("");
        relationlist.InitSelect();
    },
    SearchAllRelationList: function () {
        relationlist.SqlGetParm["searchtype"] = "all";
        relationlist.LoadList();
    },
    SearchMyRelationList: function () {
        relationlist.SqlGetParm["searchtype"] = "my";
        relationlist.LoadList();
    }, InitSelect: function () {
        relationlist.MyGetAjax({ "action": "initselect" }, function (data) {
            for (var tbName in data) {
                var d = data[tbName];
                if (tbName == "TotalDepName") {
                    for (var i = 0; i < d.length; i++) {

                        d[i].TotalID < 0 ? "" : $("select[tag=" + tbName + "]").append("<option value='" + d[i].TotalID + "'>" + d[i].TotalDepName + "</option>");
                    }
                } else if (tbName == "SecondDepName") {
                    for (var i = 0; i < d.length; i++) {
                        d[i].SecondDepID < 0 ? "" : $("select[tag=" + tbName + "]").append("<option value='" + d[i].SecondDepID + "'>" + d[i].SecondDepName + "</option>");
                    }
                } else if (tbName == "Relation") {
                    for (var i = 0; i < d.length; i++) {
                        d[i].RelationID < 0 ? "" : $("select[tag=" + tbName + "]").append("<option value='" + d[i].RelationID + "'>" + d[i].RelationName + "</option>");
                    }
                } else if (tbName == "HumanPost") {
                    for (var i = 0; i < d.length; i++) {
                        d[i].HumanPostID < 0 ? "" : $("select[tag=" + tbName + "]").append("<option value='" + d[i].HumanPostID + "'>" + d[i].HumanPost + "</option>");
                    }
                } else if (tbName == "HumanLevel") {
                    for (var i = 0; i < d.length; i++) {
                        d[i].HumanLevelID < 0 ? "" : $("select[tag=" + tbName + "]").append("<option value='" + d[i].HumanLevelID + "'>" + d[i].HumanLevelName + "</option>");
                    }
                }
            }
            relationlist.SearchAllRelationList();
        });
    }, LoadList: function () {
        var sp = new SqlPager(this.SqlPageParm);
        sp.Display = this.ResultRelationList;
        var swhere = [];
        $("#search_div select").each(function () {
            var key = this.name;
            var value = this.value;
            value = isNaN(parseInt(value)) ? 0 : value;
            if (value > 0) {
                swhere.push(key + "=" + value);
            }
        });
        var companyName = $("#search_div #CompanyName").val();
        var humanLevelName = $("#search_div #HumanLevelName").val();
        var humanPostName = $("#search_div #HumanPostName").val();

        companyName == null ? "" : swhere.push("CompanyName like'%" + companyName + "%'");
        humanLevelName == null ? "" : swhere.push("HumanLevelName like'%" + humanLevelName + "%'");
        humanPostName == null ? "" : swhere.push("HumanPostName like'%" + humanPostName + "%'");
        //var alias = $("#search_div #Alias").val();
        //alias == "" ? "" : swhere.push(" Alias like '%" + alias + "%' ");
        // alert(swhere.join(" and "));
        this.SqlGetParm["searchwhere"] = swhere.join(" and ");
        sp.LoadData(1, this.SqlGetParm);
    }, ResultRelationList: function (data) {
        //JSON 数据
        $("#list_body_div table tr:gt(0)").remove();
        if (data && data.success == "1") {
            if (data.data == null || data.data[0] == null) {
                return;
            }
            for (var i = 0; i < data.data.length; i++) {
                var d = data.data[i];
                d["longId"] = data["longId"];
                var ready = template.compile(relationlist.relationTemp.listTemp);
                var html = ready(d);
                var $el = $(html);
                $el.find("a[tag = del]").bind("click", d, relationlist.DelRelation);

                $el.find("a[tag = update]").bind("click", d, relationlist.ShowUpdateRelationDiv); //update
                $("#list_body_div table").append($el);
            }
        }
    }, DelRelation: function (data) {
        if (!confirm("确认删除吗？")) {
            return;
        };
        var d = data.data;
        d["action"] = "delrelation";
        relationlist.MyGetAjax(d, function (data) {
            relationlist.LoadList();
        });
    }, ShowUpdateRelationDiv: function (data) {
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        //设置层上的下拉列表框的值
        for (var i in data.data) {
            var selects = "#div_relation_layer select[name=" + i + "] option[value=" + data.data[i] + "]";
            $(selects).attr("selected", "selected");
        }
        $("#div_relation_layer input[name=CompanyName]").val(data.data["CompanyName"]);
        $("#div_relation_layer input[name=Alias]").val(data.data["Alias"]);
        $("#div_relation_layer input[name=HumanLevelName]").val(data.data["HumanLevelName"]);
        $("#div_relation_layer input[name=HumanPostName]").val(data.data["HumanPostName"]);
        $("#btn_submit_relation").unbind("click").bind("click", data.data, relationlist.UpdateRelation);

    }, UpdateRelation: function (data) {
        //修改关系人
        var d = data.data;
        var swhere = [];
        $("#div_relation_layer select").each(function () {
            var key = this.name;
            var value = this.value;
            value = isNaN(parseInt(value)) ? 0 : value;
            if (value > 0) {
                d[key] = value;
            }
        });
        d["action"] = "updaterelation";
        d["Alias"] = $("#div_relation_layer input[name=Alias]").val();
        d["CompanyName"] = $("#div_relation_layer input[name=CompanyName]").val();
        d["HumanLevelName"] = $("#div_relation_layer input[name=HumanLevelName]").val();
        d["HumanPostName"] = $("#div_relation_layer input[name=HumanPostName]").val();
        //alert(d["HumanPostName"]);
        relationlist.MyGetAjax(d, function () {
            Common.CloseEditFrame("layer", "sad");
            relationlist.LoadList();
        });

    }, ShowAddRelationDiv: function () {
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        $("#div_relation_layer select").each(function () {
            this.selectedIndex = 0;
        });
        $("#div_relation_layer input[name=CompanyName]").val("");
        $("#div_relation_layer input[name=Alias]").val("");
        $("#div_relation_layer input[name=HumanLevelName]").val("");
        $("#div_relation_layer input[name=HumanPostName]").val("");
        $("#btn_submit_relation").unbind("click").bind("click", relationlist.AddRelation);
    }, AddRelation: function () {
        //添加关系人
        var d = { "action": "addrelation" };
        $("#div_relation_layer select").each(function () {
            var key = this.name;
            var value = this.value;
            value = isNaN(parseInt(value)) ? 0 : value;
            if (value > 0) {
                d[key] = value;
            }
        });
        d["Alias"] = $("#div_relation_layer input[name=Alias]").val();
        d["CompanyName"] = $("#div_relation_layer input[name=CompanyName]").val();
        d["HumanLevelName"] = $("#div_relation_layer input[name=HumanLevelName]").val();
        d["HumanPostName"] = $("#div_relation_layer input[name=HumanPostName]").val();
        relationlist.MyGetAjax(d, function () {
            Common.CloseEditFrame("layer", "sad");
            relationlist.LoadList();
            //alert("添加关系人成功!");
        });
    }, relationTemp: { "listTemp1": "<tr><td><%=ID%></td><td><%=TotalDepName%></td><td><%=HumanLevelName%></td><td><%=HumanLevelName%></td><td>- -</td><td><%=RelationName%></td><td><%if(longId==HUserID){ %><%=UserName%><%}else{%> <%=UserID%><% }%></td><td><%if(longId==HUserID){ %><a href='javascript:void()' tag='del'>删除</a><a href='javascript:void()' tag='update'>修改</a><%}%></td></tr>",
        "listTemp": "<tr><td><%=ID %></td><td><%=CompanyName%></td><!--<td><%=SecondDepName%>--></td><td><%=HumanLevelName%></td><td><%=HumanPostName%></td><td><%=RelationName%></td><td>会员<%=UserID%></td><td><%if(longId==HUserID){ %><%=Alias%><%}else{%><% }%></td><td><%if(longId==HUserID){ %><a href='javascript:' tag='del'><img src='images/btn_close.gif' width='16' height='16' /></a><a href='javascript:' tag='update'><img src='images/btn_edit.gif' width='16' height='16' /></a><%}%> </td></tr>"
    }, GetUserMsg: function () {
        var data = { "action": "getusermsg" };
        relationlist.MyGetAjax(data, function (data) {
            if (data.success == "1" && data.data && data.data[0] !== null) {
                var d = data.data[0];
                for (var item in d) {
                    $("#" + item).val(d[item]);
                }
                $("#update_msg").unbind("click").bind("click", d, relationlist.UpdateUserMsg);
            }
        });
    }, UpdateUserMsg: function (oData) {
        var data = oData.data;
        $("#div_my_msg ul input").each(function () {
            data[this.name] = this.value;
        });
        data["action"] = "updateuser";
        relationlist.MyGetAjax(data, function () {
            alert("修改成功!");
        });

    }, MyGetAjax: function (data, callFun) {
        $.ajax({
            type: "post",
            url: "../Handler/SqlSearch.ashx",
            data: data,
            dataType: "json",
            beforeSend: function (XMLHttpRequest) {
            },
            success: function (data) {
                if (data && data.success == "1") {
                    callFun(data);
                } else {
                    alert(data.msg);
                }
            }
        });
    }, GoBack: function () {
        window.history.go(-1);
    }, GetTime: function () {
        var dTime = new Date();
        var Year = dTime.getFullYear();
        var Month = dTime.getMonth() + 1;
        var Day = dTime.getDate();
        var hh = dTime.getHours();
        var mm = dTime.getMinutes();
        var ss = dTime.getSeconds();
        var doc_msg = "<p>" + Year + "年" + Month + "月" + Day + "日</p>" + "<p>" + hh + ":" + mm + ":" + ss + "</p>";
        $("#div_time").empty().html(doc_msg);

    }
}