/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />
/// <reference path="../template.js" />
/// <reference path="../ajaxfileupload.js" />
/// <reference path="../Pager.js" />
/// <reference path="../common.js" />

//$(function () {
//    CaseLibraryInfo.newEvents.init();
//    CaseLibraryInfo.getEventsInfo(); 
//    CaseLibraryInfo.getActionInfo();
//    CaseLibraryInfo.getReportList();
//    CaseLibraryInfo.init();
//});

var CaseLibraryInfo = {
    idolCategoryquery: { "display_style": "8", "action": "GetQueryTagValues", "mindate": "01/01/2012", "fieldname": "DATENUM", "sort": "ReverseDate", "documentcount": "True", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "predict": "false", "text": "*" },
    weiboIdolParameter: { "display_style": 8, "act": "caselibraryweibo", "action": "query", "minscore": 30, "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "false", "nearTime": "0,d" },
    weiboPageParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    _bodytemp: "<li><span class=\"sum\"><b class=\"color_2\"><%=DeadCount %></b>死<b class=\"color_2\"><%=InjuryCount %></b>伤<b class=\"color_4\"><%=LostCount %></b>失踪</span><span class=\"text\"><input type=\"checkbox\" name=\"<%=EventName%>\" value=\"<%=EventID%>\" />　<a href=\"caseLibraryInfo.html\"><%=EventName %></a></span><p><span class=\"date\"><%=OccurrenceTime %></span><span class=\"city\">{省+市}</span><span class=\"keyword\"><%=EventKeywords %></span></p></li>",
    _eventGroupTemp: "<input type='checkbox' name='event_group_ckb' value=<%=ID%> cid='<%=ID %>' pid='<%=pid %>' /><code><%=AccidentName %></code>",
    duibiColumn: { "EventName": "事件名称", "EventCategoryID": "事件分类", "EventAccidentTypeID": "事故类型", "OccurrenceTime": "发生时间", "EventHolidayName": "重要节日", "PoliticsFactorName": "政治因素", "SubjectionUnit": "隶属单位", "EventUnit": "事故单位", "DeadCount": "死亡人数", "InjuryCount": "受伤人数", "LostCount": "失踪人数", "LostBelongings": "财产损失", "EventDescription": "事故描述", "CreateDate": "创建日期", "FirstMedia": "首发媒体", "FirstWeibo": "首发微博", "FirstWeiboUser": "首发用户", "FirstWeiboDate": "首发日期", "FirstWeiboContent": "首发内容" },
    sqlEventItem: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "orderBy": "OccurrenceTime", "sql_tag": "item", "web_url": "../../Handler/CaseLibraryHandler.ashx" },
    eventListQeuryParams: { "action": "getlist", "orderBy": "OccurrenceTime" },
    cacheParams: { "action": "getlist", "orderBy": "OccurrenceTime" },
    startingMedia: Config.MediaType,
    cacheProvince: {},
    cacheInfo: {},
    isCacheProvince: true,
    provinceCityHander: "../../Handler/ProvinceCityHander.ashx",
    eventAjaxHander: "../../Handler/CaseLibraryHandler.ashx",
    caseAccidentHandler: "../../Handler/CaseAccidentHandler.ashx",
    caseActionHander: "../../Handler/CaseActionHandler.ashx",
    newEventId: 4,
    backIndex: 1,
    minDate: "",
    maxDate: "",
    _Template: Object,
    init: function () {
        $("#FirstMedia option").remove();
        for (var i in CaseLibrary.startingMedia) {
            if (CaseLibrary.startingMedia[i] != undefined)
                $("#FirstMedia").append("<option value=" + i + ">" + CaseLibrary.startingMedia[i] + "</option>");
        }
        CaseLibraryInfo._Template = new Analysis();
        CaseLibraryInfo._Template.analysis.Init();
        CaseLibraryInfo.initShortBtns();
        $("#caidanlan dd").unbind().bind("click", function () {
            var id = this.attributes.plan.value;
            if (id) {
                CaseLibraryInfo.hidenDiv();
                $("#caidanlan dd").removeClass("on");
                $(this).addClass("on");
                $("#" + id).show();
                $("#widget_title").html($(this).attr("title"));
            }
        });
        CaseLibraryInfo.hidenDiv();
        $("#add_new_event_info1_div").show();
        $("#widget_title").html("事件资料");
        CaseLibraryInfo.getCategory();
        $("#goblack").die("click");
        $("#goblack").unbind().bind("click", CaseLibraryInfo.goBlack);
        $("#freshen_chart_a").unbind().bind("click", CaseLibraryInfo.getCategory);
        //CaseLibrary.loadEventItem(CaseLibrary.eventListQeuryParams);
        $("#refurbish_weibo_a").unbind().bind("click", CaseLibraryInfo.loadWeiboListAjax);
    },
    hidenDiv: function () {
        $("#compre_chart_plan").hide();
        $("#widget_resize_frame").hide();
        $("#add_new_event_info1_div").hide();
        $("#add_new_event_info2_div").hide();
        $("#add_new_event_info3_div").hide();
        $("#guanjianci_div").hide();
        $("#report_file_div").hide();
    },
    saveKeywords: function () {
        var words = $("#EventKeywords").val();
        var data = { "action": "savekeywords", "eid": CaseLibraryInfo.newEventId, "EventKeywords": words };
        CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
            alert("修改成功!");
        });
    },
    goBlack: function () {
        Top.loadCaseLibary(CaseLibraryInfo.backIndex);
    },
    getEventsInfo: function () {
        var data = { "action": "byid", "eid": CaseLibraryInfo.newEventId }
        CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
            if (d.success == "1") {
                var jsonD = d.data[0];
                $("#add_event_info_div [type=text]").each(function () {
                    var colm = this.id.toString();
                    this.value = jsonD[colm];
                });
                $("#EventDescription").val(jsonD["EventDescription"]);
                $("#EventKeywords").val(jsonD["EventKeywords"]);
                //对数据缓存
                CaseLibraryInfo.cacheInfo = jsonD;
                //城市
                var pid = jsonD["OccurrenceProvinceID"];
                var cityId = jsonD["OccurrenceCityID"];
                if (pid == "")
                    pid = 1;
                if (cityId == "")
                    cityId = 1;
                CaseLibraryInfo.loadSearCity("event_info_province_sel", "0", pid);
                CaseLibraryInfo.loadSearCity("event_info_city_sel", pid, cityId);
                //事故类型
                var defGroup = jsonD["EventCategoryID"].split(',');
                CaseLibraryInfo.newEvents.getEventGroup(defGroup);
                var defgroupType = jsonD["EventAccidentTypeID"].split(',');
                for (var i = 0; i < defGroup.length; i++) {
                    $("#event_group_div [value=" + defGroup[i] + "]").attr("checked", "checked");
                    CaseLibraryInfo.newEvents.getEventType(defGroup[i], defgroupType);
                }

                CaseLibraryInfo.weiboIdolParameter["OccurrenceTime"] = jsonD["OccurrenceTime"];
                //媒体
                CaseLibraryInfo.getMediaInfo();
                CaseLibraryInfo.getWeiboList();
            }
        });
    }, getActionInfo: function () {
        var data = { "action": "getlistbyid", "eid": CaseLibraryInfo.newEventId };
        CaseLibraryInfo.newEvents.actionAjax(data, function (d) {
            var len = $("#add_new_event_plan ul").length;
            var resStart = true;
            if (d.success == 0) { resStart = false; }
            if (d.data == 0 && resStart) { resStart = false; }
            for (var i = 0; resStart && i < d.data.length; i++) {
                if (i >= len) {
                    CaseLibraryInfo.newEvents.addActionEventDoc();
                }
                var docId = "#info_tabs" + i;
                $(docId).find("input[type=text]").each(function () {
                    this.value = d.data[i][this.name];
                });
                $(docId).find("textarea").each(function () {
                    this.value = d.data[i][this.name];
                });
            }
        });
    },
    getMediaInfo: function () {
        $("#add_new_event_info3_div input[type=text]").each(function () {
            this.value = CaseLibraryInfo.cacheInfo[this.id];
        });
        $("#FirstMedia").val(CaseLibraryInfo.cacheInfo["FirstMedia"]);
        $("#FirstWeibo").val(CaseLibraryInfo.cacheInfo["FirstMedia"]);
        $("#FirstWeiboContent").val(CaseLibraryInfo.cacheInfo["FirstWeiboContent"]);
    },
    getReportList: function () {
        var data = { "action": "getlist", "eid": CaseLibraryInfo.newEventId };
        var url = "../../Handler/CaseFileUploadHandler.ashx";
        CaseLibraryInfo.myAjax(url, data, function (d) {
            if (d.success == 1) {
                $("#report_list_div").empty();
                var jsonD = d.data;
                for (var i in jsonD) {
                    if (i != "removeVal") {
                        var html = template("report_temp", jsonD[i]);
                        $("#report_list_div").append(html);
                    }
                }
            }
        });
    },
    ajaxFileUpload: function () {
        var reportName = $("#report_name_txt").val();
        var id = $("#report_id_hid").val();
        var eid = $("#report_eid_hid").val();
        var action = $("#report_action_hid").val();
        var data = { "action": action, "eid": CaseLibraryInfo.newEventId, "name": reportName, "id": id };
        $.ajaxFileUpload({
            url: "../../Handler/CaseFileUploadHandler.ashx",
            type: "post",
            secureuri: false,
            fileElementId: "report_file",
            data: data,
            success: function (d) {
                $("#report_name_txt").val("");
                $("#report_id_hid").val("0");
                $("#report_eid_hid").val("0");
                $("#report_action_hid").val("addfile");
                CaseLibraryInfo.getReportList();
                alert("操作成功!");

                $("#sad").hide();
                $("#layer").hide();
            }
        });
    },
    newEvents: {
        /*新事件模块*/
        init: function () {
            //初始化事件分组
            $("#event_info_province_sel").change(function () {
                var childDoc = this.attributes.child.value;
                CaseLibraryInfo.loadSearCity(childDoc, this.value);
            });
            $("#firstSteps").unbind().bind("click", CaseLibraryInfo.newEvents.firstSteps);
            $("#secondStep").unbind().bind("click", CaseLibraryInfo.newEvents.secondStep);
            $("#thirdStep").unbind().bind("click", CaseLibraryInfo.newEvents.thirdStep);
            //$("#event_add_btn").unbind().bind("click", CaseLibraryInfo.newEvents.addNewEvent);
            //$("#add_group_btn").unbind().bind("click", CaseLibraryInfo.newEvents.addNewEventGroup);
            $("#add_vew_action_btn").unbind().bind("click", CaseLibraryInfo.newEvents.addActionEventDoc);
            CaseLibraryInfo.newEvents.initActionEvent();
            $("#upload_report_btn").unbind().bind("click", CaseLibraryInfo.ajaxFileUpload);
            CaseLibraryInfo.newEvents.initReoprtUpdata();
            $("#save_keywords_btn").unbind().bind("click", CaseLibraryInfo.saveKeywords);
            $("#show_add_report_div").unbind().bind("click", function () {
                $("#report_name_txt").val("");
                $("#report_id_hid").val("0");
                $("#report_eid_hid").val("0");
                $("#report_action_hid").val("addfile");
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btn_close").click(function () {

                });
            });
        },
        initReoprtUpdata: function () {
            $("#report_list_div a[name=tihuan]").live("click", function () {
                $("#report_name_txt").val(this.attributes.reportname.value)
                $("#report_id_hid").val(this.attributes.reportid.value);
                $("#report_eid_hid").val(this.attributes.eid.value);
                $("#report_action_hid").val("update");

                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btn_close").click(function () {

                });
            });
        },
        initActionEvent: function () {
            //初始化行动事件
            $("#add_new_event_tab ul li").die("click");
            $("#add_new_event_tab ul li").unbind().live("click", function () {
                $("#add_new_event_tab ul li").removeClass("on");
                $(this).addClass("on");
                var tabsId = this.attributes.tag.value;
                $("#add_new_event_plan ul").hide();
                $(tabsId).show();
            });
        },
        addActionEventDoc: function () {
            $("#add_new_event_tab ul li").removeClass("on");
            var len = $("#add_new_event_tab ul li").length;
            var li = "<li class='on'  tag=\"#info_tabs" + len + "\"><a href=\"javascript:void(0);\" >行动" + (len + 1) + "</a></li>";
            $("#add_new_event_tab ul").append(li);

            var bodyDoc = "<ul class='form_list' id='info_tabs" + len + "'><li style='display:none;'><input type='text' name='ID'/></li><li><span class='name'>行动日期</span> <span class='input'> <input name='ActionDate' size='24' type='text' value='' class='Wdate' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd HH:mm:ss\"})' /></span></li><li><span class='name'>行动人员</span> <span class='input'><input name='ActionPersonal' size='24' type='text' value='' /></span> </li><li><span class='name'>讲话内容</span> <span class='input'><textarea  cols='68' rows='6' name='ActionTalkContent'   /></textarea></span> </li><li><span class='name'>影响分析</span> <span class='input'><textarea name='ActionAnalysis' cols='68' rows='6' /></textarea></span> </li></ul>";
            $("#add_new_event_plan").append(bodyDoc);
            $("#add_new_event_plan ul").hide();
            $("#info_tabs" + len).show();

        },
        getEventType: function (p, defval) {
            //获取事件子分类
            var ispid = true;
            if (p == "") ispid = false;
            var pid = "";
            if (p > 0 && ispid) {
                pid = p;
            } else if (ispid) {
                pid = this.attributes.cid.value;
            }
            var divId = "event_type_div_" + pid;
            if (this.checked || p > 0) {
                var eventTypeDiv = "<div id=\"" + divId + "\"><div name=\"listcheck\"></div> <div name=\"addbtn\"></div></div>";
                var data = { "action": "getlist", "pid": pid };
                CaseLibraryInfo.newEvents.eventGroupAjax(data, function (d) {
                    $("#event_type_div").append(eventTypeDiv);
                    var jsonData = d.data;
                    if (d.success == "1") {
                        for (var i = 0; i < jsonData.length; i++) {
                            var tempDate = jsonData[i];
                            var ready = template.compile(CaseLibraryInfo._eventGroupTemp);
                            var html = ready(tempDate);
                            $("#" + divId + " [name=listcheck]").append(html);
                        }
                    }
                    if (p > 0) {
                        for (var i = 0; i < defval.length; i++) {
                            $("#" + divId + " [value=" + defval[i] + "]").attr("checked", "checked");
                        }
                    }
                });
            } else {
                $("#" + divId).remove();
            }
        },
        addEventType: function () {
            //添加事件子分类
            var pid = this.attributes.pid.value;
            var pdiv = this.attributes.pdiv.value;
            var newGroupName = $("#" + pdiv + " [type=text]").val();
            // alert(newGroupName + "," + pid);
            var data = { "action": "addnew", "CaseName": newGroupName, "pid": pid };
            CaseLibraryInfo.newEvents.eventGroupAjax(data, function (d) {
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibraryInfo._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#" + pdiv + " [name=listcheck]").append(html);
                }
            });
        },
        getEventGroup: function (defcheckd) {
            //获取事件类型
            var data = { "action": "getlist", "pid": "0" };
            CaseLibraryInfo.newEvents.eventGroupAjax(data, function (d) {
                $("#event_group_div").empty();
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibraryInfo._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#event_group_div").append(html);
                }
                for (var i = 0; i < defcheckd.length; i++) {
                    $("#event_group_div [value=" + defcheckd[i] + "]").attr("checked", "checked");
                }
                $("#event_group_div [type=checkbox]").unbind().change(CaseLibraryInfo.newEvents.getEventType);
            });
        },
        addNewEventGroup: function (e) {
            //添加事件类型
            var newGroupName = $("#add_group_txt").val();
            var pid = this.attributes.pid.value;
            var data = { "action": "addnew", "CaseName": newGroupName, "pid": pid };
            CaseLibraryInfo.newEvents.eventGroupAjax(data, function (d) {
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibraryInfo._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#event_group_div").append(html);
                }
                $("#event_group_div [type=checkbox]").unbind().change(CaseLibraryInfo.newEvents.getEventType);
            });
        },
        addNewEvent: function () {
            var eventName = $("#event_name_txt").val();
            var eventKeywords = $("#event_keywords_txt").val();
            var data = { "action": "createevent", "EventName": eventName, "EventKeywords": eventKeywords };
            CaseLibraryInfo.newEvents.eventAjax(data, function (data) {
                //alert("新事件ID：" + data.eventid);
                CaseLibraryInfo.newEventId = data.eventid;
            });
        },
        firstSteps: function () {
            //第一步-完成基本资料
            var data = { "action": "firststeps" };
            $("#add_event_info_div [type=text]").each(function () {
                data[this.id] = this.value;
            });
            data["eid"] = CaseLibraryInfo.newEventId;
            data["OccurrenceProvinceID"] = $("#event_info_province_sel").val();
            data["OccurrenceCityID"] = $("#event_info_city_sel").val();
            data["EventDescription"] = $("#EventDescription").val();
            data["EventKeywords"] = $("#EventKeywords").val();

            var groupList = [];
            var groupDoc = $("#event_group_div input[type=checkbox]:checked");
            groupDoc.each(function () { groupList.push(this.value); });
            data["EventCategoryID"] = groupList.join(",");
            var typeDoc = $("#event_type_div input[type=checkbox]:checked");
            var types = [];
            typeDoc.each(function () { types.push(this.value); });
            data["EventAccidentTypeID"] = types.join(',');

            CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
                if (d.success == "1") {
                    alert("成功!");
                }
            });
        },
        secondStep: function () {
            //第二步-行动详情
            var index = 0;
            var c = $("#add_new_event_plan ul").length;
            $("#add_new_event_plan ul").each(function (i, doc) {

                var isAction = true;
                var data = { "action": "updateaction", "eid": CaseLibraryInfo.newEventId };
                $(doc).find("[type=text]").each(function (i) {
                    data[this.name] = this.value;
                    if (this.name == "ActionDate" && (this.value == "" || this.value == "undefined" || this.value == null)) {
                        isAction = false;
                    }
                });
                $(doc).find("textarea").each(function (i) {
                    data[this.name] = this.value;
                });
                if (isAction) {
                    CaseLibraryInfo.newEvents.actionAjax(data, function (d) {
                        index++;
                        if (index == c) {
                            CaseLibraryInfo.getActionInfo();
                            alert("保存成功!");
                        }
                    });
                } else {
                    index++;
                }
            });
        },
        thirdStep: function () {
            //第三步-媒体
            var data = { "action": "thirdstep", "eid": CaseLibraryInfo.newEventId };
            data["FirstMedia"] = $("#FirstMedia").val();
            data["FirstWeibo"] = $("#FirstWeibo").val();
            data["FirstWeiboUser"] = $("#FirstWeiboUser").val();
            data["FirstWeiboDate"] = $("#FirstWeiboDate").val();
            data["FirstWeiboLink"] = $("#FirstWeiboLink").val();
            data["FirstWeiboContent"] = $("#FirstWeiboContent").val();
            CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
                if (d.success == "1") {
                    alert("保存成功!")
                    //成功
                }
            });
        },
        actionAjax: function (data, callfun) {
            //行动Ajax请求
            $.ajax(CaseLibraryInfo.caseActionHander, {
                type: "post",
                dataType: "json",
                data: data,
                beforeSend: function () {
                },
                success: callfun,
                error: function () {
                    //alert("error");
                }
            });
        },
        eventAjax: function (data, callfun) {
            //新事件Ajax请求
            $.ajax(CaseLibraryInfo.eventAjaxHander, {
                type: "post",
                dataType: "json",
                data: data,
                beforeSend: function () {
                },
                success: callfun,
                error: function () {
                    // alert("error");
                }
            });
        }, eventGroupAjax: function (data, callfun) {
            //事件分类以及子分类请求
            $.ajax(CaseLibraryInfo.caseAccidentHandler, {
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
    },
    myAjax: function (rul, data, callfun) {
        //新事件Ajax请求
        $.ajax(rul, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
                // alert("error");
            }
        });
    },
    duiBi: {
        getEvent: function () {
            var data = { "action": "duibi", "eids": "1,2,3" }
            CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
                if (d.success == "1") {
                    var newData = {};
                    var listd = [];
                    var len = d.data.length;
                    for (var item in CaseLibraryInfo.duibiColumn) {
                        var newColume = { "name": "", "c0": "", "c1": "", "c2": "", "c3": "" };
                        newColume["name"] = CaseLibraryInfo.duibiColumn[item];
                        for (var i = 0; i < len; i++) {
                            newColume["c" + i] = d.data[i][item];
                        }
                        listd.push(newColume);
                        newData = { "list": listd };
                    }
                    var temps = $("#dui_bi_temps").val();
                    var html = template.render('dui_bi_temps', newData);
                    $("#duibi_base_info_div").append(html);
                }
            });
        }
    },
    loadSearCity: function (docId, pid, defval) {
        var removeOption = "#" + docId + " option";
        var addOption = "#" + docId;
        $.getJSON(CaseLibraryInfo.provinceCityHander, { "action": "city", "pid": pid }, function (data) {
            if (data.success == "1") {
                $(removeOption).remove();
                for (var i in data.data) {
                    if (data.data[i].ProvinceCity != undefined) {
                        //var obj = new Option(data.data[i].ProvinceCity, data.data[i].ID);
                        //$(addOption).append(obj);
                        $(addOption).append("<option value=" + data.data[i].ID + ">" + data.data[i].ProvinceCity + "</option>");
                    }
                }
                $(addOption).val(defval);
            }
        });
    }, loadEventType: function (docid, pid) {
        var data = { "action": "getlist", "pid": pid };
        var removeOption = "#" + docid + " option";
        var addOption = "#" + docid;
        CaseLibraryInfo.newEvents.eventGroupAjax(data, function (d) {
            if (d.success == "1") {
                $(removeOption).remove();
                for (var i in d.data) {
                    $(addOption).append("<option value=" + d.data[i].ID + ">" + d.data[i].AccidentName + "</option>");
                    //var obj = new Option(d.data[i].AccidentName, d.data[i].ID);
                    //$(addOption).append(obj);
                }
            } else {
                $(removeOption).remove();
                //var obj = new Option("无子分类", "");
                //$(addOption).append(obj);
                $(addOption).append("<option >" + "无子分类" + "</option>");
            }
        });
    },
    loadEventItem: function (params) {
        var sp = new SqlPager(CaseLibraryInfo.sqlEventItem);
        sp.Display = function (data) {
            if (data.data == "0") {
                // alert("无数据");
            }
            else {
                var jsonData = data.data;
                $("#list_body_div").empty();
                for (var i = 0; i < jsonData.length; i++) {

                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibraryInfo._bodytemp);
                    var html = ready(tempDate);
                    $("#list_body_div").append(html);
                    // alert(JSON.stringify(tempDate));
                }
            }
        }
        sp.LoadData(1, params);
    },
    beforeSend: function () {
        alert("开始请求");
    },
    erroe: function () {
        alert("服务器无响应");
    },
    getWeiboList: function () {
        CaseLibraryInfo.sortByWhere(null, "Date");
    },
    loadWeiboListAjax: function () {
        var Lpager = new Pager(CaseLibraryInfo.weiboPageParameter);
        Lpager.Display = function (data) {
            CaseLibraryInfo._Template.analysis.resultDataIdol(data.data);
        };
        Lpager.LoadData(1, CaseLibraryInfo.weiboIdolParameter);
    },
    sortByWhere: function (dom, sortWhere) {
        if (dom != null) {
            $("#actionBtns li").removeClass("on");
            $(dom).addClass("on");
        }
        CaseLibraryInfo.weiboIdolParameter["sort"] = sortWhere;
        var keyword = $("#EventKeywords").val();
        if (keyword == "")
            keyword = "*";
        CaseLibraryInfo.weiboIdolParameter["text"] = keyword;
        CaseLibraryInfo.loadWeiboListAjax();
    },
    initShortBtns: function () {//实时微博
        $("#real_time_btn").click(function () {
            CaseLibraryInfo.sortByWhere(this, "Date");
        });
        $("#hot_point_btn").click(function () {
            CaseLibraryInfo.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
        $("#negative_btn").click(function () {
            CaseLibraryInfo.sortByWhere(this, "REPLYNUM:numberdecreasing");

        });
    }, getCategory: function () {
        var data = CaseLibraryInfo.idolCategoryquery;
        data["eids"] = CaseLibraryInfo.newEventId;
        CaseLibraryInfo.newEvents.eventAjax(data, function (d) {
            CaseLibraryInfo.chart.compareLine(d.data);
        });
    }
    , chart: {
        compareLine: function (data) {
            data[0].data[0] = 0;
            var compareChart = new Highcharts.Chart({
                chart: {
                    width: "740",
                    height: "470",
                    renderTo: "compre_chart_div"
                },
                title: {
                    text: '发展趋势对比'
                },
                xAxis: {
                    categories: ["前1天", "第1天", "第2天", "第3天", "第4天", "第5天", "第6天"]
                },
                yAxis: {
                    min: 0,
                    title: { enabled: false, text: "" }
                },
                series: data
            });
        }
    }
}
