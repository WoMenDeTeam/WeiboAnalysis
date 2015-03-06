/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />
/// <reference path="../template.js" />
/// <reference path="../common.js" />


Array.prototype.removeVal = function (val) {
    if (isNaN(val)) { return false; }
    var isdel = false;
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] == val) {
            isdel = true;
        } else {
            this[n++] = this[i];
        }
    }
    isdel ? this.length -= 1 : "";
}

var CaseLibrary = {
    _bodytemp: "<li delid=<%=EventID%> ><span class=\"sum\"><b class=\"color_2\"><%=DeadCount %></b>死<b class=\"color_2\"><%=InjuryCount %></b>伤<b class=\"color_4\"><%=LostCount %></b>失踪</span><span class=\"text\"><input type=\"checkbox\" name=\"<%=EventName%>\" value=\"<%=EventID%>\" />　<a href=\"javascript:void(0)\" title=<%=EventName %> name='linkinfo' eid='<%=EventID%>'><%=EventName.length>24?EventName.substring(0,24):EventName %></a></span><span class=\"btn\" style=\"display:none;\"><a class=\"btn_edit\" title=\"编辑案例名称\" href=\"javascript:void(0);\" cid=<%=EventID%> ename=<%=EventName%> act=\"edit\"></a> <a class=\"btn_delete\" title=\"删除案例\" href=\"javascript:void(0);\" cid=<%=EventID%> act=\"del\"></a></span><p><span class=\"date\"><%=OccurrenceTime %></span><span class=\"city\"><%=ProvinceName%><%=CityName%></span><span class=\"keyword\"><%=EventDescription %></span></p></li>",
    _eventGroupTemp: "<input type='checkbox' name='event_group_ckb' value=<%=ID%> cid='<%=ID %>' pid='<%=pid %>' /><code><%=AccidentName %></code>",
    duibiColumn: { "EventCategoryID": "事件分类", "EventAccidentTypeID": "事故类型", "OccurrenceTime": "发生时间", "EventHolidayName": "重要节日", "PoliticsFactorName": "政治因素", "SubjectionUnit": "隶属单位", "EventUnit": "事故单位", "DeadCount": "死亡人数", "InjuryCount": "受伤人数", "LostCount": "失踪人数", "LostBelongings": "财产损失", "EventDescription": "事故描述", "CreateDate": "创建日期", "CaseAction": "官方行动", "FirstMedia": "首发媒体", "FirstWeibo": "首发微博", "FirstWeiboUser": "首发用户", "FirstWeiboDate": "首发日期", "FirstWeiboContent": "首发内容" },
    sqlEventItem: { "page_size": 20, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "orderBy": "CreateDate desc", "sql_tag": "item", "web_url": "../../Handler/CaseLibraryHandler.ashx" },
    eventListQeuryParams: { "action": "getlist", "orderBy": "CreateDate desc" },
    cacheParams: { "action": "getlist", "orderBy": "CreateDate desc" },
    idolCategoryquery: { "display_style": "8", "action": "GetQueryTagValues", "mindate": "01/01/2012", "fieldname": "DATENUM", "sort": "ReverseDate", "documentcount": "True", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "predict": "false", "text": "*" },
    cacheProvince: {},
    isCacheProvince: true,
    provinceCityHander: "../../Handler/ProvinceCityHander.ashx",
    eventAjaxHander: "../../Handler/CaseLibraryHandler.ashx",
    caseAccidentHandler: "../../Handler/CaseAccidentHandler.ashx",
    caseActionHander: "../../Handler/CaseActionHandler.ashx",
    newEventId: 9,
    duibiArry: [],
    startingMedia: Config.MediaType,
    defPageStartIndex: 1,
    init: function () {
    },
    searchObj: {
        /*搜索模块*/
        init: function () {
            HotWeiboUser.GetHotUser({}, null);
            $("#close_advanced_search_a").unbind().bind("click", function () { $("#search_plan").hide(); })
            $("#search_bar_btn").toggle(function () {
                $("#search_plan").show();
            }, function () {
                $("#search_plan").hide();
            });
            $("#search_btn").unbind().bind("click", CaseLibrary.searchObj.baseInfo.searData);
            $("#weibo_screening_btn").unbind().bind("click", CaseLibrary.searchObj.baseInfo.searData);
            //城市级联
            CaseLibrary.loadSearCity("search_province_sel", "0");
            CaseLibrary.loadSearCity("search_city_sel", "1");
            $("#search_province_sel").change(function () {
                var childDoc = this.attributes.child.value;
                CaseLibrary.loadSearCity(childDoc, this.value);
            });
            //事故类型级联
            CaseLibrary.loadEventType("search_event_group_sel", "0");
            CaseLibrary.loadEventType("serach_event_type_sel", "1");
            $("#search_event_group_sel").change(function () {
                var childDoc = this.attributes.child.value;
                CaseLibrary.loadEventType(childDoc, this.value);
            });
            //排序事件
            CaseLibrary.searchObj.orderByBtn();
            $("#btn_history").unbind().bind("click", function () { $("#history_div").show(); });
            $("#colse_history_div").unbind().bind("click", function () { $("#history_div").hide(); });

            var today = new Date();
            var time = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            $("#search_start_time_txt").val(today.getFullYear() - 1 + "-01-01");

            $("#search_end_time_txt").val(time);
            $("#search_firstmeiti_sel option").remove();
            $("#search_firstmeiti_sel").append("<option value=\"\" >" + "首发媒体" + "</option>");
            for (var i in CaseLibrary.startingMedia) {
                if (CaseLibrary.startingMedia[i] != undefined)
                    $("#search_firstmeiti_sel").append("<option value=" + i + ">" + CaseLibrary.startingMedia[i] + "</option>");
            }

            $("#FirstMedia option").remove();
            for (var i in CaseLibrary.startingMedia) {
                if (CaseLibrary.startingMedia[i] != undefined)
                    $("#FirstMedia").append("<option value=" + i + ">" + CaseLibrary.startingMedia[i] + "</option>");
            }
        },
        orderByBtn: function () {
            $("#actionBtns ul li").unbind().bind("click", function () {
                var col = this.attributes.orderby.value;
                CaseLibrary.cacheParams["orderBy"] = col + " desc";
                CaseLibrary.loadEventItem(CaseLibrary.cacheParams);
                $("#actionBtns ul li").removeClass("on");
                $(this).addClass("on");
            });
        },
        baseInfo: {
            searData: function () {
                //遍历页面控件获取值
                var historyTitle = [];
                var startTime = $("#search_start_time_txt").val();
                if (startTime != "")
                    historyTitle.push(startTime);
                var endTime = $("#search_end_time_txt").val();
                if (endTime != "")
                    historyTitle.push(endTime);
                var province = $("#search_province_sel").val();
                if (province != "")
                    historyTitle.push($("#search_province_sel option:selected").text());
                var city = $("#search_city_sel").val();
                if (city != "")
                    historyTitle.push($("#search_city_sel option:selected").text());
                var areaKeywork = $("#search_area_keyword_txt").val();
                if (areaKeywork != "")
                    historyTitle.push(areaKeywork);
                var eventGroup = $("#search_event_group_sel option:selected").val();
                if (eventGroup != "")
                    historyTitle.push($("#search_event_group_sel option:selected").text());
                var eventType = $("#serach_event_type_sel").val();
                var eventLSDW = $("#search_lsdw_txt").val();
                if (eventLSDW != "")
                    historyTitle.push(eventLSDW);
                var eventSJDW = $("#search_sjdw_txt").val();
                if (eventSJDW != "")
                    historyTitle.push(eventSJDW);
                var deadNumber = $("#search_deadnumber_txt").val();
                if (deadNumber != "")
                    historyTitle.push(deadNumber);
                var injuryNumber = $("#search_injurynumber_txt").val();
                if (injuryNumber != "")
                    historyTitle.push(injuryNumber);
                var lostNumber = $("#search_lostnumber_txt").val();
                if (lostNumber != "")
                    historyTitle.push(lostNumber);
                var lostMinMonery = $("#search_lostmin_monery_txt").val();
                if (lostMinMonery != "")
                    historyTitle.push(lostMinMonery);
                var lostMaxMonery = $("#search_loastmax_monert_txt").val();
                if (lostMaxMonery != "")
                    historyTitle.push(lostMaxMonery);
                var eventDescription = $("#search_description_txt").val();
                if (eventDescription != "")
                    historyTitle.push(eventDescription);

                var firstMeiTi = $("#search_firstmeiti_sel").val();
                if (firstMeiTi != "")
                    historyTitle.push($("#search_firstmeiti_sel option:selected").text());
                var firstWeibo = $("#search_firstweibo_sel").val();
                if (firstWeibo != "")
                    historyTitle.push($("#search_firstweibo_sel option:selected").text());
                var userName = $("#search_user_txt").val();
                if (userName != "")
                    historyTitle.push(userName);
                var deadMax = $("#deadMax").val();
                var injuryMax = $("#injuryMax").val();
                var loatMax = $("#loatMax").val();
                var data = { "action": "getlistbywhere", "startTime": startTime, "endTime": endTime, "province": province, "city": city,
                    "areaKeywork": areaKeywork, "eventGroup": eventGroup, "eventType": eventType, "eventLSDW": eventLSDW,
                    "eventSJDW": eventSJDW, "deadNumber": deadNumber, "injuryNumber": injuryNumber, "lostNumber": lostNumber,
                    "lostMinMonery": lostMinMonery, "lostMaxMonery": lostMaxMonery, "eventDescription": eventDescription,
                    "firstMeiTi": firstMeiTi, "firstWeibo": firstWeibo, "userName": userName, "orderBy": "CreateDate desc",
                    "deadMax": deadMax, "injuryMax": injuryMax, "loatMax": loatMax
                };

                CaseLibrary.cacheParams = data;
                //历史搜索记录
                CaseLibrary.searchObj.cacheHistory(historyTitle.join("+"), data);
                //按条件查询数据
                CaseLibrary.loadEventItem(data);
            }
        },
        cacheHistory: function (title, d) {
            var _el = $("<li><a href='javascript:void(0);'>" + title + "</a></li>").click(function () {
                CaseLibrary.loadEventItem(d);
            });
            $("#historyList").prepend(_el);
            $("#historyList li:gt(10)").remove();
        }
    },
    eventList: {
        init: function () {
            $("#list_body_div li input[type=checkbox]").die("click");
            $("#list_body_div li input[type=checkbox]").unbind().live("click", CaseLibrary.eventList.addDuibi);
        },
        addDuibi: function () {
            $("#duibi_info_div").show();
            if (this.checked) {
                this.disabled = true;
                if (CaseLibrary.duibiArry.length < 4) {
                    CaseLibrary.duibiArry.push(this.value);
                    var doc = $("<li><span class=\"input\"><input type=\"checkbox\" value=\"" + this.value + "\" /></span><span class=\"name\">" + this.name + "</span></li>");
                    doc.find("input[type=checkbox]").unbind().bind("change", function () {
                        if (this.checked) {
                            CaseLibrary.duibiArry.removeVal(this.value);
                            CaseLibrary.eventList.delDuibi(this.value);
                            doc.remove();
                            if (CaseLibrary.duibiArry.length > 0) {
                                $("#duibi_info_div").show();
                            } else {
                                $("#duibi_info_div").hide();
                            }
                        }
                    });
                    $("#duibi_info_div ul").append(doc);
                }
                else {
                    this.checked = false;
                }
            } else {
                CaseLibrary.duibiArry.removeVal(this.value);

            }
        }, delDuibi: function (val) {
            var len = CaseLibrary.duibiArry.length
            $("#list_body_div input[type=checkbox]").removeAttr("checked").removeAttr("disabled");
            for (var i = 0; i < len; i++) {
                val = CaseLibrary.duibiArry[i];
                $("#list_body_div input[type=checkbox][value=" + val + "]").attr("checked", true).attr("disabled", true);
            }
        }
    },
    newEvents: {
        /*新事件模块*/
        init: function () {
            CaseLibrary.newEvents.getEventGroup();
            CaseLibrary.loadSearCity("event_info_province_sel", "0");
            CaseLibrary.loadSearCity("event_info_city_sel", "1");
            $("#event_info_province_sel").change(function () {
                var childDoc = this.attributes.child.value;
                CaseLibrary.loadSearCity(childDoc, this.value);
            });
            $("#thirdStep").unbind().bind("click", CaseLibrary.newEvents.submitEventInfo);
            $("#event_add_btn").unbind().bind("click", CaseLibrary.newEvents.addNewEvent);
            $("#add_group_btn").unbind().bind("click", CaseLibrary.newEvents.addNewEventGroup);
            $("#add_vew_action_btn").unbind().bind("click", CaseLibrary.newEvents.addActionEventDoc);
            CaseLibrary.newEvents.initActionEvent();

            //进入填写事件信息步骤
            $("#tianxieziliao").unbind().bind("click", function () {
                var checkResult = CaseLibrary.newEvents.checkEventName();
                if (checkResult) {
                    $("#add_new_event_div").hide();
                    $("#add_new_event_info1_div").show();
                }
            });
            //点击"添加新案例"按钮弹出填写资料层
            $("#add_new_case_btn").unbind().bind("click", function () {
                $("#add_new_event_div").show();
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
                $("#btn_close").click(function () {

                });
            });
            //进入填写行动计划步骤
            $("#firstSteps").unbind().bind("click", function () {
                $("#add_new_event_info2_div").show();
                $("#add_new_event_info1_div").hide();
            });
            //进入填媒体资料步骤
            $("#secondStep").unbind().bind("click", function () {
                $("#add_new_event_info2_div").hide();
                $("#add_new_event_info3_div").show();
            });
            //返回修改事件名称和关键词步骤
            $("#firstStepsUp").unbind().bind("click", function () {
                $("#add_new_event_info1_div").hide();
                $("#add_new_event_div").show();
            });
            //返回修改事件具体信息步骤
            $("#secondStepUp").unbind().bind("click", function () {
                $("#add_new_event_info2_div").hide();
                $("#add_new_event_info1_div").show();
            });
            //返回修改行动计划信息步骤
            $("#thirdStepUp").unbind().bind("click", function () {
                $("#add_new_event_info3_div").hide();
                $("#add_new_event_info2_div").show();
            });
        },
        //验证案例名称和案例关键词是否合法
        checkEventName: function () {
            var result = true;
            var name = $("#event_name_txt").val();
            var keyword = $("#event_keywords_txt").val();
            if (name == "" || name == undefined) {
                CaseLibrary.showMsg("案例名称不能为空");

                result = false;
            }
            if (name.length < 3) {
                CaseLibrary.showMsg("案例名称不能少于三个字符!");
                result = false;
            }
            if (keyword == "" || keyword == undefined) {
                CaseLibrary.showMsg("关键字不能为空!");
                result = false;
            }
            return result;
        },
        //初始化行动事件
        initActionEvent: function () {
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
            var li = "<li class='on' tag=\"#info_tabs" + len + "\"><a href=\"javascript:void(0);\" >行动" + (len + 1) + "</a></li>";
            $("#add_new_event_tab ul").append(li);

            var bodyDoc = "<ul class='form_list' id='info_tabs" + len + "'><li><span class='name'>行动日期</span> <span class='input'> <input name='ActionDate' size='18' type='text' value='' class='Wdate' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd HH:mm:ss\"})' /></span></li><li><span class='name'>行动人员</span> <span class='input'><input name='ActionPersonal' size='38' type='text' value='' /></span> </li><li><span class='name'>讲话内容</span> <span class='input'><textarea name='ActionTalkContent' size='36' value=''></textarea></span> </li><li><span class='name'>影响分析</span> <span class='input'><textarea name='ActionAnalysis' size='36' value=''></textarea></span> </li></ul>";
            $("#add_new_event_plan").append(bodyDoc);
            $("#add_new_event_plan ul").hide();
            $("#info_tabs" + len).show();
        },
        getEventType: function () {
            //获取事件子分类
            var pid = this.attributes.cid.value;
            var divId = "event_type_div_" + pid;
            if (this.checked) {
                var eventTypeDiv = "<div id=\"" + divId + "\"><div name=\"listcheck\"></div> <div name=\"addbtn\"></div></div>";
                var data = { "action": "getlist", "pid": pid };
                CaseLibrary.newEvents.eventGroupAjax(data, function (d) {
                    $("#event_type_div").append(eventTypeDiv);
                    var jsonData = d.data;
                    if (d.success == "1")
                        for (var i = 0; i < jsonData.length; i++) {
                            var tempDate = jsonData[i];
                            var ready = template.compile(CaseLibrary._eventGroupTemp);
                            var html = ready(tempDate);
                            $("#" + divId + " [name=listcheck]").append(html);
                        }
                    $("#" + divId + " [name=addbtn]").empty().append("<input type=\"text\" /><input type=\"button\" value=\"确定\" pid=\"" + pid + "\" pdiv=\"" + divId + "\" />");
                    $("#" + divId + " [type=button]").unbind().bind("click", CaseLibrary.newEvents.addEventType);

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
            var data = { "action": "addnew", "CaseName": newGroupName, "pid": pid };
            CaseLibrary.newEvents.eventGroupAjax(data, function (d) {
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibrary._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#" + pdiv + " [name=listcheck]").append(html);
                }
            });
        },
        getEventGroup: function () {
            //获取事件类型
            var data = { "action": "getlist", "pid": "0" };
            CaseLibrary.newEvents.eventGroupAjax(data, function (d) {
                $("#event_group_div").empty();
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibrary._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#event_group_div").append(html);
                    $("#event_group_div [type=checkbox]").unbind().change(CaseLibrary.newEvents.getEventType);
                }
            });
        },
        addNewEventGroup: function (e) {
            //添加事件类型
            var newGroupName = $("#add_group_txt").val();
            var pid = this.attributes.pid.value;
            var data = { "action": "addnew", "CaseName": newGroupName, "pid": pid };
            CaseLibrary.newEvents.eventGroupAjax(data, function (d) {
                var jsonData = d.data;
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibrary._eventGroupTemp);
                    var html = ready(tempDate);
                    $("#event_group_div").append(html);
                }
                $("#event_group_div [type=checkbox]").unbind().change(CaseLibrary.newEvents.getEventType);

            });
        },
        addNewEvent: function () {
            var checkResult = CaseLibrary.newEvents.checkEventName();
            if (checkResult) {
                var data = { "action": "createevent", "EventName": eventName, "EventKeywords": eventKeywords };
                CaseLibrary.newEvents.eventAjax(data, function (data) {
                    if (data.success == 2) {
                        CaseLibrary.showMsg("案例名字重复，请修改后添加");
                    } else if (data.success == 1) {
                        CaseLibrary.showMsg("添加成功!");
                        $("#sad").hide();
                        $("#layer").hide();
                        $("#event_name_txt").val("");
                        $("#event_keywords_txt").val("");
                        //刷新页面
                        CaseLibrary.loadEventItem(CaseLibrary.eventListQeuryParams);
                        CaseLibrary.newEventId = data.eventid;
                    }
                });
            }
        },
        submitEventInfo: function () {
            var eventName = $("#event_name_txt").val();
            var eventKeywords = $("#event_keywords_txt").val();
            var data = { "action": "createevent", "EventName": eventName, "EventKeywords": eventKeywords };
            CaseLibrary.newEvents.eventAjax(data, function (data) {
                if (data.success == 2) {
                    CaseLibrary.showMsg("案例名字重复，请修改后添加！");
                } else {
                    //alert("新事件ID：" + data.eventid);
                    CaseLibrary.newEventId = data.eventid;
                    CaseLibrary.newEvents.firstSteps();
                    CaseLibrary.newEvents.secondStep();
                    CaseLibrary.newEvents.thirdStep();
                }
            });
        },
        firstSteps: function () {
            //第一步-完成基本资料
            var data = { "action": "firststeps" };
            $("#add_event_info_div [type=text]").each(function () {
                data[this.id] = this.value;
            });
            data["eid"] = CaseLibrary.newEventId;
            data["OccurrenceProvinceID"] = $("#event_info_province_sel").val();
            data["OccurrenceCityID"] = $("#event_info_city_sel").val();
            data["EventDescription"] = $("#EventDescription").val();

            var groupList = [];
            var groupDoc = $("#event_group_div input[type=checkbox]:checked");
            groupDoc.each(function () { groupList.push(this.value); });
            data["EventCategoryID"] = groupList.join(",");
            var typeDoc = $("#event_type_div input[type=checkbox]:checked");
            var types = [];
            typeDoc.each(function () { types.push(this.value); });
            data["EventAccidentTypeID"] = types.join(',');
            alert(JSON.stringify(data));
            CaseLibrary.newEvents.eventAjax(data, function (d) {
                if (d.success == "1") {
                    //成功！
                }
                //alert(data.success);
            });
        },

        secondStep: function () {
            //第二步-行动详情
            $("#add_new_event_plan ul").each(function (i, doc) {
                var isAction = true;
                var data = { "action": "addaction", "eid": CaseLibrary.newEventId };
                $(doc).find("[type=text]").each(function (i) {
                    data[this.name] = this.value;
                    if (i == 0 && (this.value == "" || this.value == "undefined")) {
                        isAction = false;
                    }
                });
                if (isAction) {
                    CaseLibrary.newEvents.actionAjax(data, function (d) {
                        // $("#add_new_event_info2_div").hide();
                        // $("#add_new_event_info3_div").show();
                    });
                }
            });
        },
        thirdStep: function () {
            //第三步-媒体
            var data = { "action": "thirdstep", "eid": CaseLibrary.newEventId };
            data["FirstMedia"] = $("#FirstMedia").val();
            data["FirstWeibo"] = $("#FirstWeibo").val();
            data["FirstWeiboUser"] = $("#FirstWeiboUser").val();
            data["FirstWeiboDate"] = $("#FirstWeiboDate").val();
            data["FirstWeiboLink"] = $("#FirstWeiboLink").val();
            data["FirstWeiboContent"] = $("#FirstWeiboContent").val();
            CaseLibrary.newEvents.eventAjax(data, function (d) {
                if (d.success == "1") {
                    //成功
                    CaseLibrary.showMsg("添加成功！");
                    $("#sad").hide();
                    $("#layer").hide();
                }
            });
        },
        actionAjax: function (data, callfun) {
            //行动Ajax请求
            $.ajax(CaseLibrary.caseActionHander, {
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
            $.ajax(CaseLibrary.eventAjaxHander, {
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
        }, eventGroupAjax: function (data, callfun) {
            //事件分类以及子分类请求
            $.ajax(CaseLibrary.caseAccidentHandler, {
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
    duiBi: {
        init: function () {
            $("#close_duibi_div").unbind().bind("click", function () {
                $("#duibiinfo_div").hide();
                $("#duibi_info_div").show()
                $("#right_div").show();
                $("#left_div").show();

            });
            $("#start_duibi_btn").unbind().bind("click", CaseLibrary.duiBi.getEvent);
            $("#duibi_div li ").unbind().bind("click", function () {
                $("#duibi_div li").removeClass();
                $(this).addClass("on");
                var id = "#" + this.attributes.plan.value;
                $("#duibi_base_info_div").hide();
                $("#duibi_qushi_div").hide();
                $(id).show();
            })
        },
        getEvent: function () {
            $("#duibiinfo_div").show();
            $("#duibi_info_div").hide();
            $("#right_div").hide();
            $("#left_div").hide();
            //开始对比
            var ids = CaseLibrary.duibiArry.join(',');
            var data = { "action": "duibi", "eids": ids };
            if (CaseLibrary.duibiArry.length > 0)
                CaseLibrary.newEvents.eventAjax(data, function (d) {
                    if (d.success == "1") {
                        $("#duibi_base_info_div table").remove();
                        var newData = {};
                        var listd = [];
                        var len = d.data.length;
                        var actionD = d.actiondata;
                        if (actionD == 0) {
                            actionD = [];
                        }

                        for (var i = 0; i < len; i++) {
                            var id = d.data[i]["EventID"];
                            var adata = [];

                            for (var j = 0; j < actionD.length; j++) {
                                if (id == actionD[j]["CaseEventID"]) {
                                    adata.push(actionD[j]);
                                }
                            }

                            var actionTbHtml = [];
                            for (var k = 0; k < adata.length; k++) {
                                var tr = "<p><b class=\"color_2\">" + adata[k]["ActionDate"] + "</b><br />" + adata[k]["ActionPersonal"] + "<br />" + adata[k]["ActionTalkContent"] + "<br />" + adata[k]["ActionAnalysis"] + "<br />" + adata[k]["CaseEventID"] + "</p>";
                                actionTbHtml.push(tr);
                            }
                            d.data[i]["CaseAction"] = actionTbHtml.join('');
                        }

                        for (var item in CaseLibrary.duibiColumn) {
                            var newColume = { "name": "", "c0": "", "c1": "", "c2": "", "c3": "" };
                            newColume["name"] = CaseLibrary.duibiColumn[item];
                            for (var i = 0; i < len; i++) {
                                var val = d.data[i][item];
                                if (item == "FirstMedia") {
                                    val = CaseLibrary.duiBi.getFirstMedia(val);
                                } else if (item == "FirstWeibo") {
                                    val = CaseLibrary.duiBi.getFirstWeibo(val);
                                }
                                newColume["c" + i] = val;
                            }
                            listd.push(newColume);
                        }

                        var columeEventName = { "name": "", "c0": "", "c1": "", "c2": "", "c3": "" };
                        for (var i = 0; i < len; i++) {
                            columeEventName["c" + i] = d.data[i]["EventName"];
                        }
                        newData = { "list": listd, "eventName": columeEventName };

                        var temps = $("#dui_bi_temps").val();
                        var html = template.render('dui_bi_temps', newData);
                        $("#duibi_base_info_div").append(html);
                        CaseLibrary.duiBi.getCategory();
                    }
                });
        },
        getFirstWeibo: function (d) {
            var result = "";
            if (isNaN(parseInt(d)))
                d = 0;
            else
                d = parseInt(d);

            result = Config.WeiboSource[d];
            return result;
        }, getFirstMedia: function (d) {
            var result = "";
            result = CaseLibrary.startingMedia[d]; // Config.MediaType[d]; // CaseLibrary.startingMedia[d];
            if (result == undefined) {
                result = "";
            }
            return result;
        },
        getCategory: function () {
            var data = CaseLibrary.idolCategoryquery;
            data["eids"] = CaseLibrary.duibiArry.join(',');
            $("#comper_chart_info_div").html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\"></div></div>");
            CaseLibrary.newEvents.eventAjax(data, function (d) {
                for (var i = 0; i < d.data.length; i++) {
                    var ci = d.data[i].data.length;
                    for (var j = (ci - 1); j < 7; j++) {
                        d.data[i].data.push(0);
                    }
                }
                CaseLibrary.chart.compareLine(d.data);
                var newData = { "list": d.festivaldata };
                var html = template.render('comper_chart_info_temps', newData);
                $("#comper_chart_info_div").empty().append(html);
            });
        }
    },
    loadSearCity: function (docId, pid) {
        var removeOption = "#" + docId + " option";
        var addOption = "#" + docId;
        $.getJSON(CaseLibrary.provinceCityHander, { "action": "city", "pid": pid }, function (data) {
            if (data.success == "1") {
                if (pid = "0" && CaseLibrary.isCacheProvince) {
                    CaseLibrary.cacheProvince = data.data;
                    CaseLibrary.isCacheProvince = false;
                }
                $(removeOption).remove();
                $(addOption).append("<option value=\"\" >" + "请选择" + "</option>");
                for (var i in data.data) {
                    if (data.data[i].ProvinceCity != undefined) {
                        $(addOption).append("<option value=" + data.data[i].ID + ">" + data.data[i].ProvinceCity + "</option>");
                    }
                }
            }
        });
    }, loadEventType: function (docid, pid) {
        var data = { "action": "getlist", "pid": pid };
        var removeOption = "#" + docid + " option";
        var addOption = "#" + docid;
        CaseLibrary.newEvents.eventGroupAjax(data, function (d) {
            if (d.success == "1") {
                $(removeOption).remove();
                $(addOption).append("<option  value=\"\">" + "请选择" + "</option>");
                for (var i in d.data) {
                    if (d.data[i].AccidentName != undefined) {
                        $(addOption).append("<option value=" + d.data[i].ID + ">" + d.data[i].AccidentName + "</option>");
                    }
                }
            } else {
                $(removeOption).remove();
                $(addOption).append("<option  value=\"\" >" + "无子分类" + "</option>");
            }
        });
    },
    delCaseEvent: function (caseId) {
        if (!confirm("确定删除改案例吗？")) {
            return;
        } else {
            var data = { "action": "delcase", "caseid": caseId }
            $.ajax(CaseLibrary.eventAjaxHander, {
                type: "post",
                dataType: "json",
                data: data,
                beforeSend: function () {
                },
                success: function () {
                    CaseLibrary.showMsg("删除成功!");
                    $("#list_body_div li[delid='" + caseId + "']").remove();
                },
                error: function () {
                }
            });
        }
    },
    loadEventItem: function (params) {
        var sp = new SqlPager(CaseLibrary.sqlEventItem);
        sp.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            if (data.data == "0") {
                Common.LoadingImg("list_body_div", "none");
            }
            else {
                var pageIndex = this.currPageIndex;
                var jsonData = data.data;
                $("#list_body_div").empty();
                for (var i = 0; i < jsonData.length; i++) {
                    var tempDate = jsonData[i];
                    var ready = template.compile(CaseLibrary._bodytemp);
                    var html = ready(tempDate);
                    $("#list_body_div").append(html);
                }
                $("#list_body_div a[name='linkinfo']").unbind().bind("click", function () {
                    var eid = this.attributes.eid.value;
                    Top.loadCaseLibraryInfo(eid, pageIndex);
                });
                $("#list_body_div li a[act='del'] ").unbind().bind("click", function () {
                    var cid = $(this).attr("cid");
                    CaseLibrary.delCaseEvent(cid);
                });
                $("#list_body_div li a[act='edit'] ").unbind().bind("click", function () {
                    var cid = $(this).attr("cid");
                    var ename = $(this).attr("ename");
                    $("#upload_eventname_txt").val(ename);

                    Common.ShowEditFrame("sad", "update_move_bar", "update_eventName_layer", "update_close_btn");
                    $("#update_submit").unbind().bind("click", function () {
                        var newName = $("#upload_eventname_txt").val();
                        if (newName == undefined || newName == "" || newName.length < 3) {
                            CaseLibrary.showMsg("名字不合法");
                            return;
                        }
                        var data = { "action": "updateeventsname", "eid": cid, "EventName": newName }
                        $.ajax(CaseLibrary.eventAjaxHander, {
                            type: "post",
                            dataType: "json",
                            data: data,
                            beforeSend: function () {
                            },
                            success: function (d) {
                                if (d.success == 2) {
                                    //CaseLibrary.showMsg("名字重复");
                                    alert("名字重复");
                                } else if (d.success == 1) {
                                    $("#upload_eventname_txt").val("");
                                    $("#sad").hide();
                                    $("#update_eventName_layer").hide();

                                    CaseLibrary.loadEventItem(params);
                                    CaseLibrary.showMsg("修改成功!");
                                }
                            },
                            error: function () {
                            }
                        });
                    });
                });

                $("#list_body_div li").hover(function () {
                    $(this).find("span[class='btn']").show();
                }, function () {
                    $(this).find("span[class='btn']").hide();
                });
            }
        }
        sp.LoadData(CaseLibrary.defPageStartIndex, params);
    },
    beforeSend: function () {
        // alert("开始请求");
    },
    erroe: function () {
        //alert("服务器无响应");
    },
    showMsg: function (txtmsg) {
        $("#show_msg_text").text(txtmsg);
        Common.SubmitPop("show_msg_div");
    },
    chart: {
        compareLine: function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].data[0] = 10;
            }
            var compareChart = new Highcharts.Chart({
                chart: {
                    width: "920",
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
//$(function () {
//    CaseLibrary.searchObj.init();
//    CaseLibrary.newEvents.init();
//    CaseLibrary.loadEventItem(CaseLibrary.eventListQeuryParams);
//    CaseLibrary.duiBi.init();
//    CaseLibrary.eventList.init();
//});